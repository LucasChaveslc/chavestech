import { createHmac } from 'node:crypto'
import { Resend } from 'resend'

import { criarEmailBriefing, validarBriefing } from '../server/briefing.js'

const TAMANHO_MAXIMO_CORPO = 32_768
const JANELA_LIMITE_MS = 15 * 60 * 1000
const MAXIMO_ENVIOS_JANELA = 5

interface RegistroLimite {
  quantidade: number
  expiraEm: number
}

const tentativasPorCliente = new Map<string, RegistroLimite>()

function respostaJson(corpo: Record<string, unknown>, status = 200, cabecalhos: Record<string, string> = {}) {
  return Response.json(corpo, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...cabecalhos,
    },
  })
}

function configuracaoAusente() {
  return ['RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'BRIEFING_TO_EMAIL', 'SITE_URL', 'RATE_LIMIT_SECRET']
    .filter((nome) => !process.env[nome]?.trim())
}

function origensPermitidas() {
  const origens = new Set<string>()
  if (process.env.SITE_URL) origens.add(process.env.SITE_URL.replace(/\/$/, ''))
  if (process.env.VERCEL_URL) origens.add(`https://${process.env.VERCEL_URL}`)
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').map((origem) => origem.trim().replace(/\/$/, '')).filter(Boolean).forEach((origem) => origens.add(origem))
  }
  if (process.env.NODE_ENV !== 'production') {
    origens.add('http://localhost:3000')
    origens.add('http://127.0.0.1:3000')
  }
  return origens
}

function origemAutorizada(request: Request) {
  const origem = request.headers.get('origin')?.replace(/\/$/, '')
  return Boolean(origem && origensPermitidas().has(origem))
}

function identificadorCliente(request: Request, segredo: string) {
  const encaminhado = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = encaminhado || request.headers.get('x-real-ip') || 'desconhecido'
  return createHmac('sha256', segredo).update(ip).digest('hex').slice(0, 32)
}

function excedeuLimite(chave: string, agora = Date.now()) {
  if (tentativasPorCliente.size > 5_000) {
    for (const [identificador, registro] of tentativasPorCliente) {
      if (registro.expiraEm <= agora) tentativasPorCliente.delete(identificador)
    }
  }

  const atual = tentativasPorCliente.get(chave)
  if (!atual || atual.expiraEm <= agora) {
    tentativasPorCliente.set(chave, { quantidade: 1, expiraEm: agora + JANELA_LIMITE_MS })
    return false
  }

  atual.quantidade += 1
  return atual.quantidade > MAXIMO_ENVIOS_JANELA
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return respostaJson({ ok: false, codigo: 'metodo_nao_permitido' }, 405, { Allow: 'POST' })
    }

    const ausentes = configuracaoAusente()
    if (ausentes.length > 0) {
      console.error(JSON.stringify({ evento: 'briefing_configuracao_ausente', variaveis: ausentes }))
      return respostaJson({ ok: false, codigo: 'servico_indisponivel', mensagem: 'O envio ainda não está disponível.' }, 503)
    }

    if (!origemAutorizada(request)) {
      return respostaJson({ ok: false, codigo: 'origem_nao_autorizada' }, 403)
    }

    const tipoConteudo = request.headers.get('content-type') || ''
    const tamanhoDeclarado = Number(request.headers.get('content-length') || '0')
    if (!tipoConteudo.toLowerCase().startsWith('application/json') || tamanhoDeclarado > TAMANHO_MAXIMO_CORPO) {
      return respostaJson({ ok: false, codigo: 'requisicao_invalida' }, 400)
    }

    const corpoTexto = await request.text()
    if (!corpoTexto || corpoTexto.length > TAMANHO_MAXIMO_CORPO) {
      return respostaJson({ ok: false, codigo: 'requisicao_invalida' }, 400)
    }

    let corpo: unknown
    try {
      corpo = JSON.parse(corpoTexto)
    } catch {
      return respostaJson({ ok: false, codigo: 'json_invalido' }, 400)
    }

    const validacao = validarBriefing(corpo)
    if (validacao.suspeitaSpam) {
      return respostaJson({ ok: true, protocolo: crypto.randomUUID() }, 202)
    }
    if (!validacao.dados) {
      return respostaJson({
        ok: false,
        codigo: 'dados_invalidos',
        mensagem: 'Revise os campos indicados e tente novamente.',
        campos: validacao.camposInvalidos,
      }, 422)
    }

    const segredoLimite = process.env.RATE_LIMIT_SECRET as string
    const chaveCliente = identificadorCliente(request, segredoLimite)
    if (excedeuLimite(chaveCliente)) {
      return respostaJson(
        { ok: false, codigo: 'limite_excedido', mensagem: 'Muitas tentativas em pouco tempo. Aguarde e tente novamente.' },
        429,
        { 'Retry-After': String(JANELA_LIMITE_MS / 1000) },
      )
    }

    const dados = validacao.dados
    const email = criarEmailBriefing(dados)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const destinatarios = (process.env.BRIEFING_TO_EMAIL as string).split(',').map((item) => item.trim()).filter(Boolean)

    if (destinatarios.length === 0) {
      console.error(JSON.stringify({ evento: 'briefing_configuracao_invalida', variavel: 'BRIEFING_TO_EMAIL' }))
      return respostaJson({ ok: false, codigo: 'servico_indisponivel', mensagem: 'O envio ainda não está disponível.' }, 503)
    }

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL as string,
        to: destinatarios,
        replyTo: dados.email,
        subject: email.assunto,
        html: email.html,
        text: email.texto,
      }, {
        idempotencyKey: `briefing/${dados.idSolicitacao}`,
        signal: AbortSignal.timeout(8_000),
      })

      if (error || !data?.id) {
        console.error(JSON.stringify({
          evento: 'briefing_email_recusado',
          protocolo: dados.idSolicitacao,
          tipoErro: error?.name || 'resposta_sem_id',
          status: error?.statusCode || null,
        }))
        return respostaJson({ ok: false, codigo: 'falha_no_envio', mensagem: 'Não foi possível enviar agora. Tente novamente.' }, 502)
      }

      console.info(JSON.stringify({
        evento: 'briefing_email_aceito',
        protocolo: dados.idSolicitacao,
        emailId: data.id,
      }))

      return respostaJson({ ok: true, registrado: true, protocolo: dados.idSolicitacao }, 201)
    } catch (erro) {
      console.error(JSON.stringify({
        evento: 'briefing_email_falhou',
        protocolo: dados.idSolicitacao,
        tipoErro: erro instanceof Error ? erro.name : 'erro_desconhecido',
      }))
      return respostaJson({ ok: false, codigo: 'falha_no_envio', mensagem: 'Não foi possível enviar agora. Tente novamente.' }, 502)
    }
  },
}

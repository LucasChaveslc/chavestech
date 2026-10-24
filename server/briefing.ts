export const TIPOS_PROJETO = ['site', 'landing', 'ecommerce', 'portfolio', 'sistema', 'nao-sei'] as const
export const OBJETIVOS = [
  'Apresentar minha marca',
  'Receber contatos',
  'Vender online',
  'Mostrar meu trabalho',
  'Organizar processos',
  'Outro',
] as const
export const FASES_PROJETO = [
  'Só tenho a ideia',
  'Já tenho conteúdo e referências',
  'Quero melhorar algo existente',
  'Preciso substituir um sistema/site',
] as const

export type TipoProjeto = typeof TIPOS_PROJETO[number]

export interface BriefingValidado {
  idSolicitacao: string
  iniciadoEm: number
  tipoProjeto: TipoProjeto
  urlExistente: string
  objetivos: string[]
  descricao: string
  tarefasSistema: string
  fase: string
  prazo: 'sem-data' | 'com-data'
  dataDesejada: string
  nome: string
  email: string
  whatsapp: string
  empresa: string
  consentimentoContato: true
}

export interface ResultadoValidacao {
  dados: BriefingValidado | null
  camposInvalidos: string[]
  suspeitaSpam: boolean
}

const ROTULOS_TIPO: Record<TipoProjeto, string> = {
  site: 'Site institucional',
  landing: 'Landing page',
  ecommerce: 'Loja virtual / e-commerce',
  portfolio: 'Portfólio profissional',
  sistema: 'Sistema sob medida',
  'nao-sei': 'Ainda não sei',
}

function objeto(valor: unknown): Record<string, unknown> | null {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor)
    ? valor as Record<string, unknown>
    : null
}

function textoLinha(valor: unknown, limite: number) {
  if (typeof valor !== 'string') return ''
  return valor.normalize('NFKC').replace(/\0/g, '').replace(/\s+/g, ' ').trim().slice(0, limite)
}

function textoLivre(valor: unknown, limite: number) {
  if (typeof valor !== 'string') return ''
  return valor
    .normalize('NFKC')
    .replace(/\0/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .trim()
    .slice(0, limite)
}

function excedeLimite(valor: unknown, limite: number) {
  return typeof valor === 'string' && valor.normalize('NFKC').replace(/\0/g, '').length > limite
}

function urlValida(valor: string) {
  if (!valor) return true
  try {
    const url = new URL(valor)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function emailValido(valor: string) {
  return valor.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
}

function telefoneValido(valor: string) {
  if (!valor) return true
  if (!/^[+()\d.\s-]+$/.test(valor)) return false
  const digitos = valor.replace(/\D/g, '')
  return digitos.length >= 8 && digitos.length <= 15
}

function dataValida(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false
  const data = new Date(`${valor}T00:00:00Z`)
  return !Number.isNaN(data.getTime()) && data.toISOString().startsWith(valor)
}

export function validarBriefing(valor: unknown, agora = Date.now()): ResultadoValidacao {
  const entrada = objeto(valor)
  if (!entrada) return { dados: null, camposInvalidos: ['formulario'], suspeitaSpam: false }

  const armadilha = textoLinha(entrada.enderecoConfirmacao, 200)
  if (armadilha) return { dados: null, camposInvalidos: [], suspeitaSpam: true }

  const camposInvalidos: string[] = []
  const idSolicitacao = textoLinha(entrada.idSolicitacao, 64).toLowerCase()
  const iniciadoEm = typeof entrada.iniciadoEm === 'number' ? entrada.iniciadoEm : Number.NaN
  const tipoProjeto = textoLinha(entrada.tipoProjeto, 30) as TipoProjeto
  const urlExistente = textoLinha(entrada.urlExistente, 500)
  const descricao = textoLivre(entrada.descricao, 2000)
  const tarefasSistema = textoLivre(entrada.tarefasSistema, 1000)
  const fase = textoLinha(entrada.fase, 100)
  const prazo = textoLinha(entrada.prazo, 20) as BriefingValidado['prazo']
  const dataDesejada = textoLinha(entrada.dataDesejada, 10)
  const nome = textoLinha(entrada.nome, 120)
  const email = textoLinha(entrada.email, 254).toLowerCase()
  const whatsapp = textoLinha(entrada.whatsapp, 30)
  const empresa = textoLinha(entrada.empresa, 120)
  const consentimentoContato = entrada.consentimentoContato === true

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(idSolicitacao)) camposInvalidos.push('idSolicitacao')
  if (!Number.isFinite(iniciadoEm) || iniciadoEm > agora + 60_000 || agora - iniciadoEm < 3_000) camposInvalidos.push('formulario')
  if (!TIPOS_PROJETO.includes(tipoProjeto)) camposInvalidos.push('tipoProjeto')
  if (excedeLimite(entrada.urlExistente, 500)) camposInvalidos.push('urlExistente')
  if (!urlValida(urlExistente)) camposInvalidos.push('urlExistente')

  const objetivosRecebidos = Array.isArray(entrada.objetivos) ? entrada.objetivos : []
  const objetivos = [...new Set(objetivosRecebidos.map((item) => textoLinha(item, 80)))]
  if (objetivos.length === 0 || objetivos.length > OBJETIVOS.length || objetivos.some((item) => !OBJETIVOS.includes(item as typeof OBJETIVOS[number]))) {
    camposInvalidos.push('objetivos')
  }

  if (descricao.length < 20 || excedeLimite(entrada.descricao, 2000)) camposInvalidos.push('descricao')
  if (excedeLimite(entrada.tarefasSistema, 1000)) camposInvalidos.push('tarefasSistema')
  if (!FASES_PROJETO.includes(fase as typeof FASES_PROJETO[number])) camposInvalidos.push('fase')
  if (prazo !== 'sem-data' && prazo !== 'com-data') camposInvalidos.push('prazo')
  if (prazo === 'com-data' && !dataValida(dataDesejada)) camposInvalidos.push('dataDesejada')
  if (nome.length < 2 || excedeLimite(entrada.nome, 120)) camposInvalidos.push('nome')
  if (excedeLimite(entrada.email, 254)) camposInvalidos.push('email')
  if (!emailValido(email)) camposInvalidos.push('email')
  if (excedeLimite(entrada.whatsapp, 30)) camposInvalidos.push('whatsapp')
  if (!telefoneValido(whatsapp)) camposInvalidos.push('whatsapp')
  if (excedeLimite(entrada.empresa, 120)) camposInvalidos.push('empresa')
  if (!consentimentoContato) camposInvalidos.push('consentimentoContato')

  if (camposInvalidos.length > 0) {
    return { dados: null, camposInvalidos: [...new Set(camposInvalidos)], suspeitaSpam: false }
  }

  return {
    dados: {
      idSolicitacao,
      iniciadoEm,
      tipoProjeto,
      urlExistente,
      objetivos,
      descricao,
      tarefasSistema,
      fase,
      prazo,
      dataDesejada: prazo === 'com-data' ? dataDesejada : '',
      nome,
      email,
      whatsapp,
      empresa,
      consentimentoContato: true,
    },
    camposInvalidos: [],
    suspeitaSpam: false,
  }
}

function escaparHtml(valor: string) {
  return valor.replace(/[&<>'"]/g, (caractere) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[caractere] ?? caractere)
}

function valorOuTraco(valor: string) {
  return valor || '—'
}

function linhaHtml(rotulo: string, valor: string) {
  return `<tr><td class="rotulo" style="padding:10px 0;color:#667085;font-size:13px;vertical-align:top;width:170px">${escaparHtml(rotulo)}</td><td style="padding:10px 0;color:#101828;font-size:15px;line-height:1.55;white-space:pre-wrap">${escaparHtml(valorOuTraco(valor))}</td></tr>`
}

export function criarEmailBriefing(dados: BriefingValidado) {
  const tipo = ROTULOS_TIPO[dados.tipoProjeto]
  const prazo = dados.prazo === 'com-data' ? `Data desejada: ${dados.dataDesejada}` : 'Sem data definida'
  const linhas = [
    linhaHtml('Tipo de projeto', tipo),
    linhaHtml('Objetivos', dados.objetivos.join(', ')),
    linhaHtml('Site ou sistema atual', dados.urlExistente),
    linhaHtml('Descrição', dados.descricao),
    ...(dados.tipoProjeto === 'sistema' ? [linhaHtml('Tarefas do sistema', dados.tarefasSistema)] : []),
    linhaHtml('Fase atual', dados.fase),
    linhaHtml('Prazo', prazo),
    linhaHtml('Nome', dados.nome),
    linhaHtml('E-mail', dados.email),
    linhaHtml('WhatsApp', dados.whatsapp),
    linhaHtml('Empresa ou marca', dados.empresa),
  ].join('')

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>@media(max-width:600px){.conteudo{padding:24px!important}.rotulo{display:block!important;width:auto!important;padding-bottom:2px!important}}</style>
  </head>
  <body style="margin:0;background:#eef1f6;font-family:Arial,sans-serif;color:#101828">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef1f6;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:16px;overflow:hidden">
          <tr><td style="padding:28px 32px;background:#121a28;border-bottom:4px solid #5b8cff">
            <div style="font-size:12px;letter-spacing:2px;color:#8fb0ff;text-transform:uppercase">CHAVESTECH · NOVO CONTATO</div>
            <h1 style="margin:12px 0 0;color:#ffffff;font-size:26px;line-height:1.15">Novo briefing comercial</h1>
          </td></tr>
          <tr><td class="conteudo" style="padding:32px">
            <p style="margin:0 0 24px;color:#475467;font-size:14px;line-height:1.6">Uma nova solicitação foi validada e enviada pelo site. Responda diretamente a este e-mail para falar com a pessoa.</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${linhas}</table>
            <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #eaecf0;color:#667085;font-size:12px;line-height:1.6">Protocolo técnico: ${escaparHtml(dados.idSolicitacao)}<br>O visitante confirmou a Política de Privacidade para contato sobre esta solicitação.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`

  const texto = [
    'CHAVESTECH — Novo briefing comercial',
    '',
    `Tipo de projeto: ${tipo}`,
    `Objetivos: ${dados.objetivos.join(', ')}`,
    `Site ou sistema atual: ${valorOuTraco(dados.urlExistente)}`,
    `Descrição: ${dados.descricao}`,
    ...(dados.tipoProjeto === 'sistema' ? [`Tarefas do sistema: ${valorOuTraco(dados.tarefasSistema)}`] : []),
    `Fase atual: ${dados.fase}`,
    `Prazo: ${prazo}`,
    '',
    `Nome: ${dados.nome}`,
    `E-mail: ${dados.email}`,
    `WhatsApp: ${valorOuTraco(dados.whatsapp)}`,
    `Empresa ou marca: ${valorOuTraco(dados.empresa)}`,
    '',
    `Protocolo técnico: ${dados.idSolicitacao}`,
    'O visitante confirmou a Política de Privacidade para contato sobre esta solicitação.',
  ].join('\n')

  return {
    assunto: `Novo briefing — ${tipo}`,
    html,
    texto,
  }
}

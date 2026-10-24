export interface DadosBriefing {
  idSolicitacao: string
  iniciadoEm: number
  enderecoConfirmacao: string
  tipoProjeto: string
  urlExistente: string
  objetivos: string[]
  descricao: string
  tarefasSistema: string
  fase: string
  prazo: string
  dataDesejada: string
  nome: string
  email: string
  whatsapp: string
  empresa: string
  consentimentoContato: boolean
}

interface RespostaBriefing {
  ok?: boolean
  registrado?: boolean
  codigo?: string
  mensagem?: string
  protocolo?: string
  campos?: string[]
}

export class ErroEnvioBriefing extends Error {
  readonly codigo: string
  readonly campos: string[]

  constructor(mensagem: string, codigo = 'falha_no_envio', campos: string[] = []) {
    super(mensagem)
    this.name = 'ErroEnvioBriefing'
    this.codigo = codigo
    this.campos = campos
  }
}

export async function enviarBriefing(dados: DadosBriefing) {
  const controlador = new AbortController()
  const temporizador = window.setTimeout(() => controlador.abort(), 12_000)

  try {
    const resposta = await fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(dados),
      signal: controlador.signal,
    })

    let corpo: RespostaBriefing = {}
    try {
      corpo = await resposta.json() as RespostaBriefing
    } catch {
      // Respostas inválidas são tratadas abaixo como falha recuperável.
    }

    if (resposta.status !== 201 || corpo.ok !== true || corpo.registrado !== true || !corpo.protocolo) {
      throw new ErroEnvioBriefing(
        corpo.mensagem || 'Não foi possível enviar agora. Suas respostas continuam aqui; tente novamente.',
        corpo.codigo,
        corpo.campos,
      )
    }

    return { protocolo: corpo.protocolo }
  } catch (erro) {
    if (erro instanceof ErroEnvioBriefing) throw erro
    if (erro instanceof DOMException && erro.name === 'AbortError') {
      throw new ErroEnvioBriefing('O envio demorou mais que o esperado. Suas respostas continuam aqui; tente novamente.', 'tempo_esgotado')
    }
    throw new ErroEnvioBriefing('Não foi possível conectar ao serviço de envio. Suas respostas continuam aqui; tente novamente.', 'falha_de_rede')
  } finally {
    window.clearTimeout(temporizador)
  }
}

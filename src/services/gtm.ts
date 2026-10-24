import type { TipoServico } from '../content/site'

type EstadoConsentimento = 'denied' | 'granted'

const CHAVE_CONSENTIMENTO = 'chavestech:consentimento:v1'
const VERSAO_CONSENTIMENTO = 1
const VERSAO_POLITICA_PRIVACIDADE = '1.0'
const DURACAO_CONSENTIMENTO_MS = 180 * 24 * 60 * 60 * 1000
export const EVENTO_ABRIR_PREFERENCIAS = 'chavestech:abrir-preferencias-cookies'

export interface PreferenciasConsentimento {
  analytics: boolean
  publicidade: boolean
}

export interface RegistroConsentimento extends PreferenciasConsentimento {
  versao: number
  politicaVersao: string
  atualizadoEm: string
}

export type ParametrosEvento = Record<string, string | number | boolean | null | undefined>

type LocalizacaoCta = 'hero' | 'servicos' | 'processo'

interface DadosCliqueCta {
  localizacao: LocalizacaoCta
  identificador: string
  tipoServico?: TipoServico
}

function registroValido(valor: unknown): valor is RegistroConsentimento {
  if (!valor || typeof valor !== 'object') return false
  const registro = valor as Partial<RegistroConsentimento>
  const atualizadoEm = typeof registro.atualizadoEm === 'string'
    ? Date.parse(registro.atualizadoEm)
    : Number.NaN

  return registro.versao === VERSAO_CONSENTIMENTO
    && registro.politicaVersao === VERSAO_POLITICA_PRIVACIDADE
    && typeof registro.analytics === 'boolean'
    && typeof registro.publicidade === 'boolean'
    && Number.isFinite(atualizadoEm)
    && atualizadoEm <= Date.now()
    && Date.now() - atualizadoEm <= DURACAO_CONSENTIMENTO_MS
}

export function lerConsentimentoSalvo(): RegistroConsentimento | null {
  try {
    const valor = window.localStorage.getItem(CHAVE_CONSENTIMENTO)
    if (!valor) return null
    const registro: unknown = JSON.parse(valor)
    return registroValido(registro) ? registro : null
  } catch {
    return null
  }
}

const registroInicial = lerConsentimentoSalvo()
const consentimentoAtual: PreferenciasConsentimento = {
  analytics: registroInicial?.analytics ?? false,
  publicidade: registroInicial?.publicidade ?? false,
}

function obterDataLayer() {
  window.dataLayer = window.dataLayer || []
  return window.dataLayer
}

function estado(valor: boolean): EstadoConsentimento {
  return valor ? 'granted' : 'denied'
}

/**
 * Deve ser chamado pelo gerenciador de consentimento após uma escolha explícita.
 * Publicidade permanece independente de analytics para permitir consentimento granular.
 */
function removerCookiesGoogle(prefixos: string[]) {
  const cookies = document.cookie.split(';')
  const host = window.location.hostname
  const dominios = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]

  for (const cookie of cookies) {
    const nome = cookie.split('=')[0]?.trim()
    if (!nome || !prefixos.some((prefixo) => nome.startsWith(prefixo))) continue

    for (const dominio of dominios) {
      const atributoDominio = dominio ? `; domain=${dominio}` : ''
      document.cookie = `${nome}=; Max-Age=0; path=/${atributoDominio}; SameSite=Lax`
    }
  }
}

export function atualizarConsentimentoGtm(preferencias: PreferenciasConsentimento) {
  const gtmEstavaCarregado = window.__chavestechGtmCarregado === true
  const consentimentoAnterior = { ...consentimentoAtual }
  consentimentoAtual.analytics = preferencias.analytics
  consentimentoAtual.publicidade = preferencias.publicidade

  const registro: RegistroConsentimento = {
    versao: VERSAO_CONSENTIMENTO,
    politicaVersao: VERSAO_POLITICA_PRIVACIDADE,
    atualizadoEm: new Date().toISOString(),
    ...preferencias,
  }

  try {
    window.localStorage.setItem(CHAVE_CONSENTIMENTO, JSON.stringify(registro))
  } catch {
    // O consentimento ainda é aplicado na sessão, mesmo se o navegador bloquear armazenamento.
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: estado(preferencias.analytics),
    ad_storage: estado(preferencias.publicidade),
    ad_user_data: estado(preferencias.publicidade),
    ad_personalization: estado(preferencias.publicidade),
  })

  obterDataLayer().push({
    event: 'chavestech_consent_ready',
    consent_analytics: estado(preferencias.analytics),
    consent_publicidade: estado(preferencias.publicidade),
  })

  if (!preferencias.analytics) removerCookiesGoogle(['_ga', '_gid', '_gat'])
  if (!preferencias.publicidade) removerCookiesGoogle(['_gcl_', '_gac_'])

  if (preferencias.analytics || preferencias.publicidade) {
    window.__carregarGtmChavestech?.()
  }

  const consentimentoFoiRevogado = (consentimentoAnterior.analytics && !preferencias.analytics)
    || (consentimentoAnterior.publicidade && !preferencias.publicidade)

  return {
    registro,
    recarregarPagina: gtmEstavaCarregado && consentimentoFoiRevogado,
  }
}

/**
 * Centraliza eventos do site e evita que eventos analíticos entrem no dataLayer
 * antes do consentimento. Nunca envie PII ou conteúdo livre de formulários aqui.
 */
export function enviarEventoGtm(evento: string, parametros: ParametrosEvento = {}) {
  if (!consentimentoAtual.analytics) return false

  const { event: _eventoIgnorado, ...parametrosSeguros } = parametros
  obterDataLayer().push({ event: evento, ...parametrosSeguros })
  return true
}

export function registrarCliqueCta({ localizacao, identificador, tipoServico }: DadosCliqueCta) {
  const parametros: ParametrosEvento = {
    cta_location: localizacao,
    cta_id: identificador,
    cta_target: 'briefing',
  }

  if (tipoServico) parametros.service_type = tipoServico
  return enviarEventoGtm('cta_click', parametros)
}

export function registrarInicioBriefing(tipoServico?: TipoServico) {
  const parametros: ParametrosEvento = {
    form_id: 'briefing_orcamento',
  }

  if (tipoServico) parametros.service_type = tipoServico
  return enviarEventoGtm('form_start', parametros)
}

export function registrarLeadGerado(tipoServico?: TipoServico) {
  const parametros: ParametrosEvento = {
    form_id: 'briefing_orcamento',
  }

  if (tipoServico) parametros.service_type = tipoServico
  return enviarEventoGtm('generate_lead', parametros)
}

export function possuiConsentimentoAnalytics() {
  return consentimentoAtual.analytics
}

export function abrirPreferenciasCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR_PREFERENCIAS))
}

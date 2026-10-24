<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  EVENTO_ABRIR_PREFERENCIAS,
  atualizarConsentimentoGtm,
  lerConsentimentoSalvo,
  type PreferenciasConsentimento,
} from '../../services/gtm'

const registroInicial = lerConsentimentoSalvo()
const bannerVisivel = ref(!registroInicial)
const painelAberto = ref(false)
const analytics = ref(registroInicial?.analytics ?? false)
const publicidade = ref(registroInicial?.publicidade ?? false)
const dialogo = ref<HTMLElement | null>(null)
const botaoFechar = ref<HTMLButtonElement | null>(null)

let focoAnterior: HTMLElement | null = null
let overflowAnterior = ''
let appInerteAnterior = false
let appAriaHiddenAnterior: string | null = null

function sincronizarFormulario() {
  const registro = lerConsentimentoSalvo()
  analytics.value = registro?.analytics ?? false
  publicidade.value = registro?.publicidade ?? false
}

function abrirPainel() {
  sincronizarFormulario()
  painelAberto.value = true
}

function fecharPainel() {
  painelAberto.value = false
}

function aplicarEscolha(preferencias: PreferenciasConsentimento) {
  analytics.value = preferencias.analytics
  publicidade.value = preferencias.publicidade

  const resultado = atualizarConsentimentoGtm(preferencias)
  bannerVisivel.value = false
  painelAberto.value = false

  if (resultado.recarregarPagina) window.location.reload()
}

function aceitarTodos() {
  aplicarEscolha({ analytics: true, publicidade: true })
}

function rejeitarOpcionais() {
  aplicarEscolha({ analytics: false, publicidade: false })
}

function salvarPreferencias() {
  aplicarEscolha({ analytics: analytics.value, publicidade: publicidade.value })
}

function controlarTeclado(evento: KeyboardEvent) {
  if (!painelAberto.value) return

  if (evento.key === 'Escape') {
    evento.preventDefault()
    fecharPainel()
    return
  }

  if (evento.key !== 'Tab' || !dialogo.value) return
  const focaveis = Array.from(dialogo.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
  ))
  if (focaveis.length === 0) return

  const primeiro = focaveis[0]
  const ultimo = focaveis[focaveis.length - 1]
  if (evento.shiftKey && document.activeElement === primeiro) {
    evento.preventDefault()
    ultimo?.focus()
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault()
    primeiro?.focus()
  }
}

watch(painelAberto, async (aberto) => {
  const app = document.getElementById('app')

  if (aberto) {
    focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    if (app) {
      appInerteAnterior = app.inert
      appAriaHiddenAnterior = app.getAttribute('aria-hidden')
      app.inert = true
      app.setAttribute('aria-hidden', 'true')
    }

    await nextTick()
    botaoFechar.value?.focus({ preventScroll: true })
    return
  }

  document.body.style.overflow = overflowAnterior
  if (app) {
    app.inert = appInerteAnterior
    if (appAriaHiddenAnterior === null) app.removeAttribute('aria-hidden')
    else app.setAttribute('aria-hidden', appAriaHiddenAnterior)
  }
  focoAnterior?.focus({ preventScroll: true })
})

onMounted(() => {
  window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, abrirPainel)
  window.addEventListener('keydown', controlarTeclado)
})

onBeforeUnmount(() => {
  window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, abrirPainel)
  window.removeEventListener('keydown', controlarTeclado)
  document.body.style.overflow = overflowAnterior
})
</script>

<template>
  <Transition name="consentimento-banner">
    <aside v-if="bannerVisivel" class="consentimento" aria-label="Preferências de cookies">
      <div class="consentimento__texto">
        <span>Privacidade e dados</span>
        <p>
          Usamos armazenamento necessário para lembrar suas escolhas. Com sua autorização, também usamos
          dados analíticos para entender como o site é utilizado.
          <a href="/politica-de-privacidade.html" target="_blank" rel="noreferrer">Política de Privacidade</a>
        </p>
      </div>
      <div class="consentimento__acoes">
        <button type="button" class="consentimento__decisao consentimento__decisao--aceitar" @click="aceitarTodos">
          Aceitar todos
        </button>
        <button type="button" class="consentimento__decisao consentimento__decisao--rejeitar" @click="rejeitarOpcionais">
          Rejeitar opcionais
        </button>
        <button type="button" class="consentimento__personalizar" @click="abrirPainel">Personalizar</button>
      </div>
    </aside>
  </Transition>

  <Teleport to="body">
    <Transition name="consentimento-painel">
      <div v-if="painelAberto" class="preferencias" @mousedown.self="fecharPainel">
        <section
          ref="dialogo"
          class="preferencias__dialogo"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-preferencias"
          aria-describedby="descricao-preferencias"
        >
          <header class="preferencias__cabecalho">
            <div>
              <span>Controle de privacidade</span>
              <h2 id="titulo-preferencias">Preferências de cookies</h2>
            </div>
            <button ref="botaoFechar" type="button" class="preferencias__fechar" aria-label="Fechar preferências" @click="fecharPainel">×</button>
          </header>

          <p id="descricao-preferencias" class="preferencias__introducao">
            Você decide quais categorias opcionais podem ser usadas. A recusa não altera o funcionamento do site.
          </p>

          <div class="preferencias__lista">
            <label class="preferencias__item preferencias__item--necessario">
              <span><strong>Necessários</strong><small>Lembram sua escolha de privacidade e mantêm recursos essenciais.</small></span>
              <span class="preferencias__toggle"><input type="checkbox" checked disabled><i aria-hidden="true" /></span>
            </label>
            <label class="preferencias__item">
              <span><strong>Analíticos</strong><small>Ajudam a entender navegação e desempenho por meio do Google Analytics.</small></span>
              <span class="preferencias__toggle"><input v-model="analytics" type="checkbox"><i aria-hidden="true" /></span>
            </label>
            <label class="preferencias__item">
              <span><strong>Publicidade</strong><small>Permitem medir campanhas e personalizar publicidade, caso essas tags sejam ativadas.</small></span>
              <span class="preferencias__toggle"><input v-model="publicidade" type="checkbox"><i aria-hidden="true" /></span>
            </label>
          </div>

          <p class="preferencias__politica">
            Consulte a <a href="/politica-de-privacidade.html" target="_blank" rel="noreferrer">Política de Privacidade</a>
            para saber quais dados são tratados, com quais finalidades e como exercer seus direitos.
          </p>

          <footer class="preferencias__acoes">
            <button type="button" class="preferencias__rejeitar" @click="rejeitarOpcionais">Rejeitar opcionais</button>
            <button type="button" class="preferencias__salvar" @click="salvarPreferencias">Salvar preferências</button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.consentimento {
  position: fixed;
  z-index: 90;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  left: max(1rem, env(safe-area-inset-left));
  display: grid;
  width: min(calc(100% - 2rem), 72rem);
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 2rem;
  align-items: center;
  margin-inline: auto;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, .18);
  border-radius: 1.1rem;
  background: rgba(25, 36, 55, .98);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, .34);
}
.consentimento__texto > span,
.preferencias__cabecalho span {
  color: var(--cor-marca);
  font-family: var(--fonte-mono);
  font-size: .64rem;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.consentimento__texto p { max-width: 45rem; margin: .45rem 0 0; color: var(--cor-texto-suave); font-size: .87rem; line-height: 1.55; }
.consentimento__texto a,
.preferencias__politica a { color: var(--cor-texto); text-decoration: underline; text-underline-offset: .18em; }
.consentimento__acoes { display: grid; grid-template-columns: 1fr 1fr; gap: .65rem; min-width: 26rem; }
.consentimento__decisao,
.preferencias__rejeitar,
.preferencias__salvar {
  display: inline-flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: center;
  padding: .7rem 1rem;
  border: 1px solid;
  border-radius: 999px;
  font-size: .78rem;
  font-weight: 650;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease;
}
.consentimento__decisao--aceitar,
.preferencias__salvar { border-color: var(--cor-marca); background: var(--cor-marca); color: #07101f; }
.consentimento__decisao--rejeitar,
.preferencias__rejeitar { border-color: rgba(255, 255, 255, .38); background: var(--cor-fundo); color: var(--cor-texto); }
.consentimento__decisao--aceitar:hover,
.preferencias__salvar:hover { background: #7aa2ff; }
.consentimento__decisao--rejeitar:hover,
.preferencias__rejeitar:hover { border-color: var(--cor-texto); background: #192536; }
.consentimento__personalizar { grid-column: 1 / -1; min-height: 2.75rem; color: var(--cor-texto-suave); font-family: var(--fonte-mono); font-size: .66rem; letter-spacing: .08em; text-decoration: underline; text-underline-offset: .2em; text-transform: uppercase; }
.consentimento__personalizar:hover { color: var(--cor-marca); }

.preferencias {
  position: fixed;
  z-index: 1100;
  inset: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
  background: rgba(5, 10, 18, .76);
}
.preferencias__dialogo { width: min(100%, 46rem); max-height: calc(100svh - 2rem); overflow-y: auto; border: 1px solid rgba(255, 255, 255, .18); border-radius: 1.25rem; background: var(--cor-fundo); box-shadow: 0 1.5rem 5rem rgba(0, 0, 0, .45); }
.preferencias__cabecalho { display: flex; align-items: start; justify-content: space-between; gap: 2rem; padding: clamp(1.25rem, 4vw, 2rem); border-bottom: 1px solid var(--cor-borda); }
.preferencias__cabecalho h2 { margin: .65rem 0 0; font-size: clamp(1.8rem, 5vw, 2.7rem); font-weight: 600; letter-spacing: -.045em; line-height: 1; }
.preferencias__fechar { display: grid; width: 2.75rem; min-width: 2.75rem; height: 2.75rem; place-items: center; border: 1px solid var(--cor-borda); border-radius: 50%; color: var(--cor-texto-suave); font-size: 1.5rem; line-height: 1; }
.preferencias__fechar:hover { border-color: var(--cor-marca); color: var(--cor-texto); }
.preferencias__introducao { margin: 0; padding: 1.5rem clamp(1.25rem, 4vw, 2rem); color: var(--cor-texto-suave); line-height: 1.6; }
.preferencias__lista { padding-inline: clamp(1.25rem, 4vw, 2rem); }
.preferencias__item { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2rem; align-items: center; min-height: 6rem; padding-block: 1.2rem; border-top: 1px solid var(--cor-borda); cursor: pointer; }
.preferencias__item:last-child { border-bottom: 1px solid var(--cor-borda); }
.preferencias__item > span:first-child { display: grid; gap: .35rem; }
.preferencias__item strong { font-size: 1rem; font-weight: 600; }
.preferencias__item small { max-width: 50ch; color: var(--cor-texto-discreto); font-size: .79rem; line-height: 1.5; }
.preferencias__item--necessario { cursor: default; }
.preferencias__toggle { position: relative; display: block; width: 3rem; min-width: 3rem; height: 1.7rem; }
.preferencias__toggle input { position: absolute; width: 1px; height: 1px; opacity: 0; }
.preferencias__toggle i { position: absolute; inset: 0; border: 1px solid rgba(255, 255, 255, .32); border-radius: 999px; background: #0a111d; transition: background-color 180ms ease, border-color 180ms ease; }
.preferencias__toggle i::after { position: absolute; top: .24rem; left: .25rem; width: 1.1rem; height: 1.1rem; border-radius: 50%; background: var(--cor-texto-discreto); content: ''; transition: background-color 180ms ease, transform 180ms ease; }
.preferencias__toggle input:checked + i { border-color: var(--cor-marca); background: rgba(91, 140, 255, .22); }
.preferencias__toggle input:checked + i::after { background: var(--cor-marca); transform: translateX(1.32rem); }
.preferencias__toggle input:focus-visible + i { outline: 3px solid var(--cor-foco); outline-offset: 4px; }
.preferencias__toggle input:disabled + i { opacity: .72; }
.preferencias__politica { margin: 0; padding: 1.4rem clamp(1.25rem, 4vw, 2rem); color: var(--cor-texto-discreto); font-size: .76rem; line-height: 1.55; }
.preferencias__acoes { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; padding: 0 clamp(1.25rem, 4vw, 2rem) clamp(1.25rem, 4vw, 2rem); }

.consentimento-banner-enter-active,
.consentimento-banner-leave-active,
.consentimento-painel-enter-active,
.consentimento-painel-leave-active { transition: opacity 220ms ease; }
.consentimento-banner-enter-from,
.consentimento-banner-leave-to,
.consentimento-painel-enter-from,
.consentimento-painel-leave-to { opacity: 0; }

@media (max-width: 850px) {
  .consentimento { grid-template-columns: 1fr; gap: 1rem; }
  .consentimento__acoes { min-width: 0; }
}
@media (max-width: 520px) {
  .consentimento { padding: 1rem; border-radius: .9rem; }
  .consentimento__acoes,
  .preferencias__acoes { grid-template-columns: 1fr; }
  .consentimento__personalizar { grid-column: auto; }
  .preferencias { align-items: end; padding: 0; }
  .preferencias__dialogo { width: 100%; max-height: 92svh; border-radius: 1.25rem 1.25rem 0 0; }
  .preferencias__item { gap: 1rem; }
}
</style>

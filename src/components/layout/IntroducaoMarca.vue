<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const CHAVE_SESSAO = 'chavestech:intro-vista:v1'
const DURACAO_SEGURANCA = 10_000

const video = ref<HTMLVideoElement | null>(null)
const botaoPular = ref<HTMLButtonElement | null>(null)

function deveExibirIntroducao() {
  const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const ancoraDireta = window.location.hash && window.location.hash !== '#inicio'
  const forcarVisualizacao = new URLSearchParams(window.location.search).has('intro')

  let jaVista = false
  try {
    jaVista = window.sessionStorage.getItem(CHAVE_SESSAO) === '1'
  } catch {
    // A introdução continua disponível quando o armazenamento está bloqueado.
  }

  return !movimentoReduzido && !ancoraDireta && (forcarVisualizacao || !jaVista)
}

const introducaoVisivel = ref(deveExibirIntroducao())

let temporizadorSeguranca: number | undefined
let overflowHtmlAnterior = ''
let overflowBodyAnterior = ''
let appInerteAnterior = false
let ariaHiddenAnterior: string | null = null

if (introducaoVisivel.value) {
  document.documentElement.dataset.introducaoMarca = 'ativa'
}

function marcarComoVista() {
  try {
    window.sessionStorage.setItem(CHAVE_SESSAO, '1')
  } catch {
    // A finalização não depende da disponibilidade do sessionStorage.
  }
}

function bloquearPagina() {
  const app = document.getElementById('app')

  overflowHtmlAnterior = document.documentElement.style.overflow
  overflowBodyAnterior = document.body.style.overflow
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'

  if (app) {
    appInerteAnterior = app.inert
    ariaHiddenAnterior = app.getAttribute('aria-hidden')
    app.inert = true
    app.setAttribute('aria-hidden', 'true')
  }
}

function liberarPagina() {
  const app = document.getElementById('app')

  document.documentElement.style.overflow = overflowHtmlAnterior
  document.body.style.overflow = overflowBodyAnterior
  delete document.documentElement.dataset.introducaoMarca

  if (app) {
    app.inert = appInerteAnterior
    if (ariaHiddenAnterior === null) app.removeAttribute('aria-hidden')
    else app.setAttribute('aria-hidden', ariaHiddenAnterior)
  }
}

function encerrarIntroducao() {
  if (!introducaoVisivel.value) return

  window.clearTimeout(temporizadorSeguranca)
  window.removeEventListener('keydown', controlarTeclado)
  marcarComoVista()
  introducaoVisivel.value = false
}

function controlarTeclado(evento: KeyboardEvent) {
  if (evento.key === 'Escape') encerrarIntroducao()
}

onMounted(async () => {
  if (!introducaoVisivel.value) {
    delete document.documentElement.dataset.introducaoMarca
    return
  }

  bloquearPagina()
  window.addEventListener('keydown', controlarTeclado)
  temporizadorSeguranca = window.setTimeout(encerrarIntroducao, DURACAO_SEGURANCA)

  await nextTick()
  botaoPular.value?.focus({ preventScroll: true })

  try {
    await video.value?.play()
  } catch {
    encerrarIntroducao()
  }
})

onBeforeUnmount(() => {
  window.clearTimeout(temporizadorSeguranca)
  window.removeEventListener('keydown', controlarTeclado)
  if (introducaoVisivel.value) liberarPagina()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="introducao-marca" @after-leave="liberarPagina">
      <section
        v-if="introducaoVisivel"
        class="introducao-marca"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-introducao"
        @click="encerrarIntroducao"
      >
        <h2 id="titulo-introducao" class="introducao-marca__acessivel">
          Bem-vindo à CHAVESTECH. Ideias que funcionam no mundo real.
        </h2>

        <video
          ref="video"
          class="introducao-marca__video"
          autoplay
          muted
          playsinline
          preload="auto"
          aria-hidden="true"
          @ended="encerrarIntroducao"
          @error="encerrarIntroducao"
        >
          <source src="/videos/intro-chavestech.mp4" type="video/mp4">
        </video>

        <button
          ref="botaoPular"
          type="button"
          class="introducao-marca__pular"
          @click.stop="encerrarIntroducao"
        >
          Pular introdução
          <span aria-hidden="true">↗</span>
        </button>
      </section>
    </Transition>
  </Teleport>
</template>

<style scoped>
.introducao-marca {
  position: fixed;
  z-index: 1000;
  inset: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  background-color: var(--cor-fundo);
  background-image:
    linear-gradient(rgba(255, 255, 255, .045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .045) 1px, transparent 1px);
  background-position: -1px -1px;
  background-size: 3.75rem 3.75rem;
  cursor: pointer;
  isolation: isolate;
}
.introducao-marca__video {
  position: absolute;
  z-index: -1;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--cor-fundo);
}
.introducao-marca__pular {
  position: absolute;
  right: max(1.25rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: .55rem;
  padding: .7rem 1rem;
  border: 1px solid rgba(255, 255, 255, .2);
  border-radius: 999px;
  background: rgba(12, 19, 31, .72);
  color: var(--cor-texto-suave);
  font-family: var(--fonte-mono);
  font-size: .66rem;
  letter-spacing: .07em;
  text-transform: uppercase;
  backdrop-filter: blur(.5rem);
  touch-action: manipulation;
  transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease;
}
.introducao-marca__pular:hover {
  border-color: var(--cor-marca);
  background: rgba(12, 19, 31, .94);
  color: var(--cor-texto);
}
.introducao-marca__pular:focus-visible {
  outline: 2px solid var(--cor-marca);
  outline-offset: 3px;
}
.introducao-marca__acessivel {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}
.introducao-marca-leave-active { transition: opacity 600ms cubic-bezier(.65, 0, .35, 1); }
.introducao-marca-leave-to { opacity: 0; }

@media (max-width: 700px) {
  .introducao-marca__video {
    object-fit: contain;
    transform: scale(1.8);
  }
  .introducao-marca__pular {
    right: max(1rem, env(safe-area-inset-right));
    bottom: max(1rem, env(safe-area-inset-bottom));
  }
}

@media (prefers-reduced-motion: reduce) {
  .introducao-marca-leave-active { transition: none; }
}
</style>

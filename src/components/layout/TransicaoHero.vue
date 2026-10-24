<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const pausaAtiva = ref(false)
const DURACAO_TRANSICAO = 1700

let controleAtivo = false
let transicaoConsumida = false
let temporizadorPausa: number | undefined
let quadroAnimacao: number | undefined
let comportamentoRolagemAnterior = ''
let consultaMovimento: MediaQueryList | undefined
let consultaPonteiro: MediaQueryList | undefined

function efeitoHabilitado() {
  return Boolean(
    consultaPonteiro?.matches
    && !consultaMovimento?.matches
    && window.innerWidth >= 900,
  )
}

function liberarRolagem() {
  window.clearTimeout(temporizadorPausa)
  window.cancelAnimationFrame(quadroAnimacao ?? 0)
  document.documentElement.style.scrollBehavior = comportamentoRolagemAnterior
  pausaAtiva.value = false
  controleAtivo = false
  delete document.documentElement.dataset.transicaoHero
}

function permitirEscape(evento: KeyboardEvent) {
  if (evento.key === 'Escape' && controleAtivo) liberarRolagem()
}

function iniciarPausa() {
  pausaAtiva.value = true
  temporizadorPausa = window.setTimeout(liberarRolagem, 2000)
}

function suavizar(progresso: number) {
  return progresso < .5
    ? 4 * progresso * progresso * progresso
    : 1 - Math.pow(-2 * progresso + 2, 3) / 2
}

function animarAte(destino: HTMLElement) {
  const posicaoInicial = window.scrollY
  const posicaoFinal = destino.getBoundingClientRect().top + posicaoInicial
  const distancia = posicaoFinal - posicaoInicial
  let inicio: number | undefined

  comportamentoRolagemAnterior = document.documentElement.style.scrollBehavior
  document.documentElement.style.scrollBehavior = 'auto'

  function atualizar(agora: number) {
    if (!controleAtivo) return
    if (inicio === undefined) inicio = agora

    const progresso = Math.min((agora - inicio) / DURACAO_TRANSICAO, 1)
    window.scrollTo(0, posicaoInicial + distancia * suavizar(progresso))

    if (progresso < 1) {
      quadroAnimacao = window.requestAnimationFrame(atualizar)
      return
    }

    document.documentElement.style.scrollBehavior = comportamentoRolagemAnterior
    iniciarPausa()
  }

  quadroAnimacao = window.requestAnimationFrame(atualizar)
}

function irParaServicos() {
  const destino = document.getElementById('servicos')
  if (!destino) return

  controleAtivo = true
  transicaoConsumida = true
  document.documentElement.dataset.transicaoHero = 'ativa'
  animarAte(destino)
}

function controlarRoda(evento: WheelEvent) {
  if (!efeitoHabilitado()) return

  if (!controleAtivo && window.scrollY <= 2) transicaoConsumida = false

  if (controleAtivo) {
    evento.preventDefault()
    return
  }

  const gestoVertical = Math.abs(evento.deltaY) > Math.abs(evento.deltaX)
  const dentroDoInicio = window.scrollY <= Math.min(window.innerHeight * .3, 240)

  if (
    transicaoConsumida
    || !gestoVertical
    || evento.deltaY <= 0
    || !dentroDoInicio
  ) return

  evento.preventDefault()
  irParaServicos()
}

onMounted(() => {
  consultaMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')
  consultaPonteiro = window.matchMedia('(pointer: fine)')

  window.addEventListener('wheel', controlarRoda, { passive: false, capture: true })
  window.addEventListener('keydown', permitirEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', controlarRoda, true)
  window.removeEventListener('keydown', permitirEscape)
  window.clearTimeout(temporizadorPausa)
  window.cancelAnimationFrame(quadroAnimacao ?? 0)
  document.documentElement.style.scrollBehavior = comportamentoRolagemAnterior
  delete document.documentElement.dataset.transicaoHero
})
</script>

<template>
  <Transition name="indicador-leitura">
    <div v-if="pausaAtiva" class="transicao-leitura" role="status" aria-live="polite">
      <div class="transicao-leitura__texto">
        <span>01 / Serviços</span>
        <span>Leitura · 02s</span>
      </div>
      <div class="transicao-leitura__barra" aria-hidden="true"><i /></div>
    </div>
  </Transition>
</template>

<style scoped>
.transicao-leitura {
  position: fixed;
  z-index: 45;
  right: max(1.25rem, env(safe-area-inset-right));
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  width: min(17rem, calc(100vw - 2.5rem));
  padding: .9rem 1rem;
  border: 1px solid var(--cor-borda);
  border-radius: .8rem;
  background: #0c131f;
  box-shadow: 0 .75rem 2rem rgba(0, 0, 0, .24);
  pointer-events: none;
}
.transicao-leitura__texto {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--cor-texto-discreto);
  font-family: var(--fonte-mono);
  font-size: .6rem;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.transicao-leitura__texto span:first-child { color: var(--cor-texto); }
.transicao-leitura__barra { height: 2px; margin-top: .75rem; overflow: hidden; background: rgba(255, 255, 255, .1); }
.transicao-leitura__barra i {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--cor-marca);
  transform: scaleX(0);
  transform-origin: left;
  animation: progresso-leitura 2s linear forwards;
}
.indicador-leitura-enter-active,
.indicador-leitura-leave-active { transition: opacity 160ms ease, transform 160ms ease; }
.indicador-leitura-enter-from,
.indicador-leitura-leave-to { opacity: 0; transform: translateY(.5rem); }

@keyframes progresso-leitura {
  to { transform: scaleX(1); }
}

@media (max-width: 899px), (prefers-reduced-motion: reduce) {
  .transicao-leitura { display: none; }
}
</style>

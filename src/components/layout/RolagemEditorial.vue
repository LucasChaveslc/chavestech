<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const FATOR_ROLAGEM = .72

let consultaMovimento: MediaQueryList | undefined
let consultaPonteiro: MediaQueryList | undefined

function rolagemEditorialHabilitada() {
  return Boolean(
    consultaPonteiro?.matches
    && !consultaMovimento?.matches
    && window.innerWidth >= 900,
  )
}

function normalizarDelta(evento: WheelEvent) {
  if (evento.deltaMode === WheelEvent.DOM_DELTA_LINE) return evento.deltaY * 16
  if (evento.deltaMode === WheelEvent.DOM_DELTA_PAGE) return evento.deltaY * window.innerHeight
  return evento.deltaY
}

function permiteRolagemInterna(alvo: EventTarget | null, delta: number) {
  if (!(alvo instanceof Element)) return false
  if (alvo.closest('input, select, textarea, [contenteditable="true"]')) return true

  let elemento: Element | null = alvo

  while (elemento && elemento !== document.documentElement) {
    const estilo = window.getComputedStyle(elemento)
    const podeRolar = /(auto|scroll)/.test(estilo.overflowY)

    if (podeRolar && elemento.scrollHeight > elemento.clientHeight) {
      const noInicio = elemento.scrollTop <= 0
      const noFim = elemento.scrollTop + elemento.clientHeight >= elemento.scrollHeight - 1

      if ((delta < 0 && !noInicio) || (delta > 0 && !noFim)) return true
    }

    elemento = elemento.parentElement
  }

  return false
}

function desacelerarRolagem(evento: WheelEvent) {
  if (
    !rolagemEditorialHabilitada()
    || evento.defaultPrevented
    || evento.ctrlKey
    || evento.metaKey
    || evento.shiftKey
    || Math.abs(evento.deltaY) <= Math.abs(evento.deltaX)
  ) return

  const delta = normalizarDelta(evento)
  if (!delta || permiteRolagemInterna(evento.target, delta)) return

  const dentroDaEntradaHero = window.scrollY <= Math.min(window.innerHeight * .3, 240)
  if (
    document.documentElement.dataset.transicaoHero === 'ativa'
    || (delta > 0 && dentroDaEntradaHero)
  ) return

  evento.preventDefault()

  const raiz = document.documentElement
  const comportamentoAnterior = raiz.style.scrollBehavior
  raiz.style.scrollBehavior = 'auto'
  window.scrollBy({ top: delta * FATOR_ROLAGEM, behavior: 'auto' })
  raiz.style.scrollBehavior = comportamentoAnterior
}

onMounted(() => {
  consultaMovimento = window.matchMedia('(prefers-reduced-motion: reduce)')
  consultaPonteiro = window.matchMedia('(pointer: fine)')
  window.addEventListener('wheel', desacelerarRolagem, { passive: false, capture: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', desacelerarRolagem, true)
})
</script>

<template>
  <!-- Componente comportamental, sem interface visual. -->
</template>


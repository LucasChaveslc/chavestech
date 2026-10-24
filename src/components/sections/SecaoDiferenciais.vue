<script setup lang="ts">
import { diferenciais } from '../../content/site'
import CabecalhoSecao from '../base/CabecalhoSecao.vue'
</script>

<template>
  <section id="diferenciais" class="secao diferenciais" aria-labelledby="titulo-diferenciais">
    <div class="container-site">
      <CabecalhoSecao
        numero="04"
        rotulo="Nosso jeito"
        titulo="Não começa no código. Começa no que você precisa resolver."
      >
        <template #titulo><span id="titulo-diferenciais">Não começa no código. Começa no que você precisa resolver.</span></template>
      </CabecalhoSecao>

      <ol class="diferenciais__lista">
        <li v-for="(item, indice) in diferenciais" :key="item.titulo">
          <span>{{ String(indice + 1).padStart(2, '0') }}</span>
          <h3>{{ item.titulo }}</h3>
          <p>{{ item.texto }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.diferenciais { background: #e9edf5; color: #101827; }
.diferenciais :deep(.cabecalho-secao__rotulo span), .diferenciais :deep(.cabecalho-secao__rotulo) { color: #315fc8; }
.diferenciais__lista { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: clamp(4rem, 8vw, 7rem); border-top: 1px solid rgba(16,24,39,.18); border-bottom: 1px solid rgba(16,24,39,.18); }
.diferenciais__lista li { min-height: 24rem; padding: 2rem clamp(1.5rem, 3vw, 3rem); border-right: 1px solid rgba(16,24,39,.18); }
.diferenciais__lista li:first-child { padding-left: 0; }
.diferenciais__lista li:last-child { padding-right: 0; border-right: 0; }
.diferenciais__lista span { color: #315fc8; font-family: var(--fonte-mono); font-size: .68rem; }
.diferenciais__lista h3 { max-width: 10ch; margin-top: 8rem; font-size: clamp(1.75rem, 3vw, 2.8rem); font-weight: 600; letter-spacing: -.05em; line-height: 1; }
.diferenciais__lista p { max-width: 21rem; margin-top: 1.25rem; color: #465164; line-height: 1.6; }
@media (max-width: 720px) {
  .diferenciais__lista { grid-template-columns: 1fr; }
  .diferenciais__lista li, .diferenciais__lista li:first-child, .diferenciais__lista li:last-child { min-height: 0; padding: 2rem 0; border-right: 0; border-bottom: 1px solid rgba(16,24,39,.18); }
  .diferenciais__lista li:last-child { border-bottom: 0; }
  .diferenciais__lista h3 { margin-top: 3rem; }
}
</style>

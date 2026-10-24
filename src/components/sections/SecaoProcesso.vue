<script setup lang="ts">
import { etapasProcesso } from '../../content/site'
import { registrarCliqueCta } from '../../services/gtm'
import CabecalhoSecao from '../base/CabecalhoSecao.vue'

function registrarCtaProcesso() {
  registrarCliqueCta({
    localizacao: 'processo',
    identificador: 'processo_comecar_projeto',
  })
}
</script>

<template>
  <section id="processo" class="secao processo" aria-labelledby="titulo-processo">
    <div class="container-site">
      <CabecalhoSecao
        numero="03"
        rotulo="Como trabalhamos"
        titulo="Você entende cada etapa. A gente transforma a ideia em projeto."
        apoio="Um caminho claro, com alinhamentos e espaço para decisões antes de publicar."
      >
        <template #titulo><span id="titulo-processo">Você entende cada etapa. A gente transforma a ideia em projeto.</span></template>
      </CabecalhoSecao>

      <ol class="processo__trilha">
        <li v-for="(etapa, indice) in etapasProcesso" :key="etapa.titulo">
          <article>
            <p>Etapa {{ String(indice + 1).padStart(2, '0') }}</p>
            <h3>{{ etapa.titulo }}</h3>
            <p>{{ etapa.texto }}</p>
          </article>
        </li>
      </ol>

      <a class="processo__cta" href="#contato" @click="registrarCtaProcesso">Quero começar meu projeto <span aria-hidden="true">→</span></a>
    </div>
  </section>
</template>

<style scoped>
.processo { background: var(--cor-fundo); }
.processo__trilha { position: relative; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4rem 0; margin-top: clamp(5rem, 10vw, 9rem); }
.processo__trilha li { position: relative; min-width: 0; }
.processo article { min-height: 15rem; margin: 2rem 1rem 0; padding: 1.5rem clamp(1rem, 2.5vw, 2rem); border-top: 1px solid var(--cor-borda); }
.processo li:nth-child(even) article { margin-top: 6rem; }
.processo article > p:first-child { color: var(--cor-texto-discreto); font-family: var(--fonte-mono); font-size: .6rem; letter-spacing: .1em; text-transform: uppercase; }
.processo h3 { margin-top: 2rem; font-size: clamp(1.25rem, 2vw, 1.7rem); font-weight: 600; letter-spacing: -.035em; line-height: 1.05; }
.processo article > p:last-child { margin-top: 1rem; color: var(--cor-texto-suave); font-size: .88rem; line-height: 1.55; }
.processo__cta { display: flex; width: fit-content; min-height: 3.25rem; align-items: center; gap: .8rem; margin: 2rem auto 0; padding: .75rem 1.3rem; border-radius: 999px; background: var(--cor-marca); color: #07101f; font-weight: 700; }
@media (max-width: 980px) {
  .processo__trilha { gap: 3rem 0; }
  .processo li:nth-child(even) article { margin-top: 2rem; }
}
@media (max-width: 650px) {
  .processo__trilha { grid-template-columns: 1fr; gap: 0; }
  .processo article, .processo li:nth-child(even) article { min-height: 0; margin: 0; padding: 1.5rem 0 3.5rem; }
  .processo h3 { margin-top: 1.25rem; }
}
</style>

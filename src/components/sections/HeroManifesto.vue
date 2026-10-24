<script setup lang="ts">
import { conteudoHero, servicos } from '../../content/hero'
import BotoesHero from '../base/BotoesHero.vue'
import RotuloSecao from '../base/RotuloSecao.vue'
import CabecalhoConceito from '../layout/CabecalhoConceito.vue'
</script>

<template>
  <section id="inicio" class="proposta proposta-hibrida" aria-labelledby="titulo-manifesto">
    <CabecalhoConceito />

    <div class="hibrido__grade">
      <div class="hibrido__principal">
        <div class="hibrido__principal-conteudo">
          <RotuloSecao :texto="conteudoHero.rotulo" />
          <h1 id="titulo-manifesto">
            <span>Sua próxima ideia</span>
            <span>merece sair do papel.</span>
            <span>E funcionar de verdade.</span>
          </h1>
        </div>
      </div>

      <aside class="hibrido__indice" aria-label="Soluções oferecidas">
        <p>Do conceito à entrega</p>
        <ol>
          <li v-for="(servico, indice) in servicos" :key="servico">
            <span>{{ String(indice + 1).padStart(2, '0') }}</span>{{ servico }}
          </li>
        </ol>
      </aside>

      <div class="hibrido__apoio">
        <p>{{ conteudoHero.descricao }}</p>
        <BotoesHero />
        <small>{{ conteudoHero.microcopy }}</small>
      </div>

      <div class="hibrido__assinatura" aria-hidden="true">
        <span>ideia</span>
        <svg viewBox="0 0 140 32"><path d="M2 16h132m-14-12 14 12-14 12" /></svg>
        <span>real</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.proposta-hibrida {
  --grade-celula:
    linear-gradient(rgba(255, 255, 255, .045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .045) 1px, transparent 1px);
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  background-color: var(--cor-fundo);
}

.hibrido__grade {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(15rem, 1fr);
  grid-template-rows: minmax(0, 1fr) auto;
  height: calc(100vh - 5rem);
  height: calc(100dvh - 5rem);
  min-height: 0;
}

.hibrido__principal {
  display: grid;
  min-height: 0;
  background-color: var(--cor-fundo);
  background-image: var(--grade-celula);
  background-position: -1px -1px;
  background-size: 3.75rem 3.75rem;
}

.hibrido__principal-conteudo {
  align-self: end;
  padding: clamp(3rem, 8vh, 7rem) clamp(1.25rem, 5vw, 5rem) clamp(1.75rem, 4vh, 3.5rem);
  padding-left: max(5.75rem, 5vw);
}

.hibrido__principal h1 {
  max-width: 14ch;
  margin-top: 1.5rem;
  font-size: clamp(3.25rem, min(5.8vw, 9.5vh), 7rem);
  font-weight: 600;
  letter-spacing: -.068em;
  line-height: .88;
}
.hibrido__principal h1 span { display: block; }
.hibrido__principal h1 span:nth-child(2) {
  margin-left: 5vw;
  color: var(--cor-texto-suave);
}
.hibrido__principal h1 span:nth-child(3) { color: var(--cor-marca); }

.hibrido__indice {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: 5rem clamp(1.25rem, 3vw, 3.5rem) 3rem;
  border-left: 1px solid var(--cor-borda);
}
.hibrido__indice > p {
  margin-bottom: 1.5rem;
  color: var(--cor-texto-discreto);
  font-family: var(--fonte-mono);
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.hibrido__indice li {
  display: grid;
  grid-template-columns: 2.25rem 1fr;
  gap: .5rem;
  padding: .78rem 0;
  color: var(--cor-texto-suave);
}
.hibrido__indice li span {
  color: var(--cor-marca);
  font-family: var(--fonte-mono);
  font-size: .72rem;
  font-variant-numeric: tabular-nums;
}

.hibrido__apoio {
  padding: 3.5rem clamp(1.25rem, 5vw, 5rem);
  padding-left: max(5.75rem, 5vw);
  border-top: 1px solid var(--cor-borda);
}

.hibrido__apoio,
.hibrido__assinatura {
  background-color: var(--cor-fundo);
  background-image: var(--grade-celula);
  background-position: -1px -1px;
  background-size: 3.75rem 3.75rem;
}
.hibrido__apoio > p {
  max-width: 42rem;
  color: var(--cor-texto-suave);
  font-size: clamp(1rem, 1.35vw, 1.2rem);
  line-height: 1.6;
}
.hibrido__apoio small {
  display: block;
  margin-top: 1.3rem;
  color: var(--cor-texto-discreto);
}

.hibrido__assinatura {
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  gap: .7rem;
  padding: 2rem;
  border-top: 1px solid var(--cor-borda);
  border-left: 1px solid var(--cor-borda);
  color: var(--cor-texto-discreto);
  font-family: var(--fonte-mono);
  font-size: .7rem;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.hibrido__assinatura svg {
  width: 5rem;
  fill: none;
  stroke: var(--cor-marca);
  stroke-width: 1.5;
}

@media (max-width: 800px) {
  .proposta-hibrida {
    height: auto;
    min-height: 100svh;
    overflow: visible;
  }
  .hibrido__grade {
    height: auto;
    min-height: calc(100svh - 5rem);
    grid-template-rows: auto;
  }
  .hibrido__grade { grid-template-columns: 1fr; }
  .hibrido__principal-conteudo { padding-top: 6rem; }
  .hibrido__principal-conteudo,
  .hibrido__apoio { padding-left: 1.25rem; }
  .hibrido__principal h1 { font-size: clamp(2.8rem, 12.8vw, 4.75rem); }
  .hibrido__principal h1 span:nth-child(2) { margin-left: 0; }
  .hibrido__indice { padding-top: 0; }
  .hibrido__indice {
    border-top: 1px solid var(--cor-borda);
    border-left: 0;
  }
  .hibrido__assinatura { display: none; }
}

@media (min-width: 1150px) and (max-height: 850px),
       (min-width: 1150px) and (min-aspect-ratio: 2 / 1) {
  .hibrido__principal-conteudo { align-self: center; }
  .hibrido__principal h1 { max-width: none; }
  .hibrido__principal h1 span:first-child,
  .hibrido__principal h1 span:nth-child(3) {
    width: max-content;
    max-width: 100%;
    white-space: nowrap;
  }
  .hibrido__principal h1 span:nth-child(2) {
    width: max-content;
    max-width: 100%;
    margin-left: clamp(4rem, 8vw, 8rem);
    white-space: nowrap;
  }
}

@media (min-width: 801px) and (min-aspect-ratio: 2 / 1) {
  .hibrido__principal-conteudo {
    align-self: center;
    padding-top: clamp(2rem, 4vh, 2.75rem);
    padding-bottom: .75rem;
  }
  .hibrido__principal h1 {
    margin-top: 1.25rem;
    font-size: clamp(3.25rem, min(5.8vw, 9.5vh), 7rem);
  }
  .hibrido__indice {
    padding-top: 2.5rem;
    padding-bottom: 1.5rem;
  }
  .hibrido__indice > p { margin-bottom: .75rem; }
  .hibrido__indice li { padding-block: .55rem; }
  .hibrido__apoio {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
  .hibrido__apoio :deep(.botoes-hero) { margin-top: 1rem; }
  .hibrido__apoio small { margin-top: .65rem; }
}

@media (min-width: 1150px) and (min-aspect-ratio: 2 / 1) {
  .hibrido__principal h1 span:nth-child(2) {
    margin-left: clamp(6rem, 13vw, 20rem);
  }
}

@media (min-width: 801px) and (max-height: 850px) {
  .hibrido__principal-conteudo { padding-top: 3rem; padding-bottom: 1.25rem; }
  .hibrido__principal h1 { font-size: clamp(3rem, 7.5vh, 4.2rem); }
  .hibrido__indice { padding-top: 2rem; padding-bottom: 1.5rem; }
  .hibrido__indice > p { margin-bottom: .75rem; }
  .hibrido__indice li { padding-block: .5rem; }
  .hibrido__apoio { padding-block: 1.5rem; }
  .hibrido__apoio :deep(.botoes-hero) { margin-top: 1rem; }
  .hibrido__apoio small { margin-top: .65rem; }
}
</style>

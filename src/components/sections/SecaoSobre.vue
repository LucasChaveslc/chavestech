<script setup lang="ts">
import CabecalhoSecao from '../base/CabecalhoSecao.vue'
</script>

<template>
  <section id="sobre" class="secao sobre" aria-labelledby="titulo-sobre">
    <div class="container-site">
      <CabecalhoSecao numero="05" rotulo="Sobre a CHAVESTECH" titulo="Tecnologia boa é a que facilita a vida de quem usa.">
        <template #titulo><span id="titulo-sobre">Tecnologia boa é a que facilita a vida de quem usa.</span></template>
      </CabecalhoSecao>

      <div class="sobre__corpo">
        <div class="sobre__texto">
          <p>A CHAVESTECH é um estúdio independente de desenvolvimento digital. Unimos visão de negócio, atenção à experiência e desenvolvimento para construir soluções úteis — de uma página objetiva a um sistema que organiza o trabalho.</p>
          <p>Sem fórmulas prontas: primeiro entendemos o desafio, depois definimos o caminho.</p>
        </div>

        <div class="sobre__canvas" aria-label="Representação visual do método da CHAVESTECH">
          <div class="sobre__canvas-topo"><span>CANVAS DE PROJETO</span><span>CHAVESTECH / 01</span></div>
          <div class="sobre__mapa">
            <span class="sobre__no sobre__no--entrada">DESAFIO</span>
            <svg aria-hidden="true" viewBox="0 0 460 210" preserveAspectRatio="none">
              <path d="M50 105H150C180 105 180 45 215 45H310" />
              <path d="M150 105C180 105 180 165 215 165H310" />
              <path d="M310 45C355 45 355 105 410 105" />
              <path d="M310 165C355 165 355 105 410 105" />
            </svg>
            <span class="sobre__no sobre__no--estrategia">ESTRUTURA</span>
            <span class="sobre__no sobre__no--visual">EXPERIÊNCIA</span>
            <span class="sobre__no sobre__no--saida">SOLUÇÃO ÚTIL</span>
          </div>
          <div class="sobre__canvas-rodape"><span>ENTENDER</span><span>DEFINIR</span><span>CONSTRUIR</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sobre { background: #0e1623; }
.sobre__corpo { display: grid; grid-template-columns: minmax(17rem, .72fr) minmax(0, 1.28fr); gap: clamp(3rem, 8vw, 8rem); align-items: center; margin-top: clamp(4rem, 9vw, 8rem); }
.sobre__texto { font-size: clamp(1.25rem, 2.2vw, 1.75rem); line-height: 1.5; }
.sobre__texto p { margin: 0; }
.sobre__texto p + p { margin-top: 2rem; color: var(--cor-texto-discreto); font-size: .7em; }
.sobre__canvas { min-height: 29rem; border: 1px solid var(--cor-borda); background-image: linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px); background-size: 3.75rem 3.75rem; }
.sobre__canvas-topo, .sobre__canvas-rodape { display: flex; justify-content: space-between; padding: 1rem; font-family: var(--fonte-mono); font-size: .6rem; letter-spacing: .08em; }
.sobre__canvas-topo { border-bottom: 1px solid var(--cor-borda); color: var(--cor-texto-discreto); }
.sobre__canvas-rodape { border-top: 1px solid var(--cor-borda); color: var(--cor-marca); }
.sobre__mapa { position: relative; min-height: 23rem; }
.sobre__mapa svg { position: absolute; inset: 2rem; width: calc(100% - 4rem); height: calc(100% - 4rem); fill: none; stroke: rgba(91,140,255,.65); stroke-width: 1; vector-effect: non-scaling-stroke; }
.sobre__no { position: absolute; z-index: 1; padding: .65rem .8rem; border: 1px solid rgba(91,140,255,.55); background: #111c2c; font-family: var(--fonte-mono); font-size: .58rem; letter-spacing: .08em; }
.sobre__no--entrada { top: 50%; left: 1.5rem; transform: translateY(-50%); }
.sobre__no--estrategia { top: 15%; left: 45%; transform: translateX(-50%); }
.sobre__no--visual { bottom: 15%; left: 45%; transform: translateX(-50%); }
.sobre__no--saida { top: 50%; right: 1.5rem; transform: translateY(-50%); background: var(--cor-marca); color: #07101f; }
@media (max-width: 800px) { .sobre__corpo { grid-template-columns: 1fr; } }
@media (max-width: 500px) {
  .sobre__canvas { min-height: 24rem; }
  .sobre__mapa { min-height: 18rem; }
  .sobre__no { font-size: .48rem; }
  .sobre__no--entrada { left: .6rem; }
  .sobre__no--saida { right: .6rem; }
}
</style>

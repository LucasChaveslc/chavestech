<script setup lang="ts">
import { projetosConceituais } from '../../content/site'
import CabecalhoSecao from '../base/CabecalhoSecao.vue'
</script>

<template>
  <section id="projetos" class="secao projetos" aria-labelledby="titulo-projetos">
    <div class="container-site">
      <CabecalhoSecao
        numero="02"
        rotulo="Projetos"
        titulo="Estudos e projetos conceituais."
        apoio="Cada detalhe existe para resolver algo. Conheça o raciocínio e a experiência por trás de cada projeto."
      >
        <template #titulo>
          <span id="titulo-projetos">Estudos e projetos conceituais.</span>
        </template>
      </CabecalhoSecao>

      <div class="projetos__lista">
        <article
          v-for="(projeto, indice) in projetosConceituais"
          :key="projeto.id"
          class="projeto"
          :class="`projeto--${projeto.tema}`"
        >
          <div class="projeto__visual" aria-hidden="true">
            <div v-if="projeto.tema === 'oficina'" class="mockup-oficina">
              <div class="mockup-barra"><i /><i /><i /><span>boaroda.local</span></div>
              <div class="mockup-oficina__corpo">
                <p>OFICINA BOA RODA</p>
                <strong>Cuidado claro.<br>Do orçamento à estrada.</strong>
                <div class="mockup-oficina__acoes"><span>AGENDAR AVALIAÇÃO</span><i>→</i></div>
                <div class="mockup-oficina__rodape">
                  <span>01 · REVISÃO</span><span>02 · FREIOS</span><span>03 · SUSPENSÃO</span>
                </div>
              </div>
            </div>

            <div v-else class="mockup-imoveis">
              <div class="mockup-imoveis__painel">
                <p>LAR CERTO</p>
                <strong>Encontre um lugar<br>com a sua rotina.</strong>
                <div class="mockup-imoveis__busca"><span>Comprar</span><span>São Paulo</span><b>Buscar</b></div>
              </div>
              <div class="mockup-imoveis__cartao">
                <div class="mockup-imoveis__foto"><span>APARTAMENTO · 82 M²</span></div>
                <strong>Vila Mariana</strong><p>2 quartos · 1 vaga</p>
              </div>
            </div>
          </div>

          <div class="projeto__conteudo">
            <div class="projeto__meta">
              <span>{{ String(indice + 1).padStart(2, '0') }}</span>
              <span>Projeto conceitual — negócio fictício</span>
            </div>
            <p class="projeto__categoria">{{ projeto.categoria }}</p>
            <h3>{{ projeto.nome }}</h3>
            <dl>
              <div><dt>Desafio</dt><dd>{{ projeto.desafio }}</dd></div>
              <div><dt>Solução</dt><dd>{{ projeto.solucao }}</dd></div>
            </dl>
            <a href="#contato">Quero discutir algo parecido <span aria-hidden="true">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projetos { background: #0e1623; }
.projetos__lista { display: grid; gap: clamp(5rem, 10vw, 9rem); margin-top: clamp(4rem, 8vw, 7rem); }
.projeto { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(18rem, .75fr); gap: clamp(2rem, 6vw, 6rem); align-items: center; }
.projeto:nth-child(even) { grid-template-columns: minmax(18rem, .75fr) minmax(0, 1.45fr); }
.projeto:nth-child(even) .projeto__visual { grid-column: 2; grid-row: 1; }
.projeto__visual { min-height: clamp(27rem, 48vw, 39rem); padding: clamp(1rem, 2vw, 1.5rem); border: 1px solid var(--cor-borda); background-image: linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px); background-size: 3.75rem 3.75rem; }
.projeto__meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 1rem; color: var(--cor-texto-discreto); font-family: var(--fonte-mono); font-size: .65rem; letter-spacing: .08em; text-transform: uppercase; }
.projeto__meta span:first-child, .projeto__categoria { color: var(--cor-marca); }
.projeto__categoria { margin-top: 4rem; font-family: var(--fonte-mono); font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; }
.projeto h3 { margin-top: .8rem; font-size: clamp(2.75rem, 5vw, 5.25rem); font-weight: 600; letter-spacing: -.06em; line-height: .95; }
.projeto dl { display: grid; gap: 1.5rem; margin: 3rem 0 0; }
.projeto dl div { display: grid; grid-template-columns: 4.5rem 1fr; gap: 1rem; }
.projeto dt { color: var(--cor-texto-discreto); font-family: var(--fonte-mono); font-size: .67rem; letter-spacing: .08em; text-transform: uppercase; }
.projeto dd { margin: 0; color: var(--cor-texto-suave); line-height: 1.6; }
.projeto__conteudo > a { display: inline-flex; min-height: 2.75rem; align-items: center; gap: .75rem; margin-top: 2rem; font-weight: 600; }
.projeto__conteudo > a span { color: var(--cor-marca); }
.mockup-oficina { height: 100%; min-height: 34rem; border: 1px solid rgba(255,255,255,.2); background: #e8e5dd; color: #111821; transform: rotate(-1deg); }
.mockup-barra { display: flex; align-items: center; gap: .4rem; height: 2.25rem; padding-inline: .75rem; border-bottom: 1px solid rgba(18,26,40,.2); }
.mockup-barra i { width: .4rem; height: .4rem; border-radius: 50%; background: #111821; opacity: .35; }
.mockup-barra span { margin-left: auto; font-family: var(--fonte-mono); font-size: .55rem; }
.mockup-oficina__corpo { display: flex; min-height: calc(34rem - 2.25rem); flex-direction: column; padding: clamp(1.5rem, 4vw, 3.5rem); }
.mockup-oficina__corpo > p { font-family: var(--fonte-mono); font-size: .6rem; letter-spacing: .16em; }
.mockup-oficina__corpo > strong { max-width: 11ch; margin-top: auto; font-size: clamp(2.4rem, 5vw, 5rem); letter-spacing: -.07em; line-height: .88; }
.mockup-oficina__acoes { display: flex; justify-content: space-between; margin-top: 2rem; padding: 1rem; background: #ff5c35; font-family: var(--fonte-mono); font-size: .62rem; font-weight: 700; }
.mockup-oficina__rodape { display: flex; flex-wrap: wrap; gap: 1rem 2rem; margin-top: 1.5rem; font-family: var(--fonte-mono); font-size: .55rem; }
.mockup-imoveis { position: relative; min-height: 36rem; overflow: hidden; background: #d9d2c3; color: #15221c; }
.mockup-imoveis__painel { min-height: 31rem; padding: clamp(1.5rem, 4vw, 3.5rem); background: linear-gradient(135deg, rgba(13,48,35,.2), transparent), #d9d2c3; }
.mockup-imoveis__painel > p { font-family: var(--fonte-mono); font-size: .65rem; letter-spacing: .18em; }
.mockup-imoveis__painel > strong { display: block; max-width: 12ch; margin-top: 7rem; font-size: clamp(2.5rem, 5vw, 4.8rem); letter-spacing: -.07em; line-height: .9; }
.mockup-imoveis__busca { display: flex; gap: 1rem; align-items: center; margin-top: 2.5rem; padding: .65rem .65rem .65rem 1rem; background: #f5f2eb; font-size: .65rem; }
.mockup-imoveis__busca span { padding-right: 1rem; border-right: 1px solid rgba(0,0,0,.15); }
.mockup-imoveis__busca b { margin-left: auto; padding: .65rem 1rem; background: #173d2e; color: white; }
.mockup-imoveis__cartao { position: absolute; right: 1.5rem; bottom: 1.5rem; width: min(18rem, 55%); padding: .65rem; background: #f5f2eb; box-shadow: 0 1.5rem 4rem rgba(0,0,0,.25); }
.mockup-imoveis__foto { display: flex; aspect-ratio: 1.65; align-items: end; padding: .75rem; background: linear-gradient(150deg, #6d897c, #b8b3a4); }
.mockup-imoveis__foto span { color: white; font-family: var(--fonte-mono); font-size: .5rem; }
.mockup-imoveis__cartao strong { display: block; margin-top: .8rem; }
.mockup-imoveis__cartao p { margin: .25rem 0 0; font-size: .7rem; }
@media (max-width: 900px) {
  .projeto, .projeto:nth-child(even) { grid-template-columns: 1fr; gap: 2.5rem; }
  .projeto:nth-child(even) .projeto__visual { grid-column: auto; grid-row: auto; }
  .projeto__categoria { margin-top: 2.5rem; }
}
@media (max-width: 560px) {
  .projeto__visual { min-height: 25rem; }
  .mockup-oficina { min-height: 27rem; }
  .mockup-oficina__corpo { min-height: calc(27rem - 2.25rem); }
  .mockup-imoveis { min-height: 28rem; }
  .mockup-imoveis__painel { min-height: 25rem; }
  .mockup-imoveis__painel > strong { margin-top: 4rem; }
  .mockup-imoveis__busca span:nth-child(2) { display: none; }
  .projeto dl div { grid-template-columns: 1fr; gap: .5rem; }
}
</style>

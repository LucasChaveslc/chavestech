<script setup lang="ts">
import { servicosSite, type TipoServico } from '../../content/site'
import { registrarCliqueCta } from '../../services/gtm'
import CabecalhoSecao from '../base/CabecalhoSecao.vue'
import IconeServico from '../base/IconeServico.vue'

const emitir = defineEmits<{
  selecionar: [tipo: TipoServico]
}>()

function selecionarServico(tipo: TipoServico) {
  registrarCliqueCta({
    localizacao: 'servicos',
    identificador: `servicos_${tipo}`,
    tipoServico: tipo,
  })
  emitir('selecionar', tipo)
}
</script>

<template>
  <section id="servicos" class="secao servicos" aria-labelledby="titulo-servicos">
    <div class="container-site">
      <CabecalhoSecao
        numero="01"
        rotulo="O que criamos"
        titulo="Uma solução certa para cada fase do seu negócio."
        apoio="Nem todo projeto precisa da mesma estrutura. A gente entende o objetivo e constrói o que faz sentido para ele."
      >
        <template #titulo>
          <span id="titulo-servicos">Uma solução certa para cada fase do seu negócio.</span>
        </template>
      </CabecalhoSecao>

      <div class="servicos__grade">
        <article
          v-for="(servico, indice) in servicosSite"
          :key="servico.id"
          class="cartao-servico"
        >
          <div class="cartao-servico__topo">
            <span>{{ String(indice + 1).padStart(2, '0') }}</span>
            <IconeServico :nome="servico.icone" />
          </div>
          <p class="cartao-servico__nome">{{ servico.nome }}</p>
          <h3>{{ servico.titulo }}</h3>
          <p class="cartao-servico__descricao">{{ servico.descricao }}</p>
          <a href="#contato" @click="selecionarServico(servico.id)">
            {{ servico.cta }}
            <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4 10h11M11 5l5 5-5 5" /></svg>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.servicos { background: var(--cor-fundo); }
.servicos__grade {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
  margin-top: clamp(3rem, 7vw, 6rem);
}
.cartao-servico {
  position: relative;
  display: flex;
  min-height: 29rem;
  flex-direction: column;
  grid-column: span 4;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  overflow: hidden;
  border: 1px solid var(--cor-borda);
  border-radius: 1.25rem;
  background: var(--cor-superficie);
}
.cartao-servico:first-child { grid-column: span 7; }
.cartao-servico:nth-child(2) { grid-column: span 5; }
.cartao-servico::after {
  position: absolute;
  right: -3rem;
  bottom: -3rem;
  width: 10rem;
  height: 10rem;
  border: 1px solid rgba(91, 140, 255, .18);
  border-radius: 50%;
  content: '';
}
.cartao-servico__topo { display: flex; align-items: center; justify-content: space-between; color: var(--cor-marca); }
.cartao-servico__topo > span,
.cartao-servico__nome { font-family: var(--fonte-mono); font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; }
.cartao-servico__nome { margin-top: auto; color: var(--cor-texto-discreto); }
.cartao-servico h3 { max-width: 18ch; margin-top: 1rem; font-size: clamp(1.65rem, 2.6vw, 2.7rem); font-weight: 600; letter-spacing: -.045em; line-height: 1; }
.cartao-servico__descricao { max-width: 34rem; margin-top: 1.4rem; color: var(--cor-texto-suave); line-height: 1.65; }
.cartao-servico a { display: inline-flex; width: fit-content; min-height: 2.75rem; align-items: center; gap: .65rem; margin-top: 1.75rem; color: var(--cor-texto); font-weight: 600; }
.cartao-servico a svg { width: 1.1rem; fill: none; stroke: var(--cor-marca); stroke-width: 1.5; transition: transform 180ms ease; }
.cartao-servico a:hover svg { transform: translateX(.2rem); }
.icone-servico { width: 2.25rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.25; }

@media (max-width: 900px) {
  .cartao-servico,
  .cartao-servico:first-child,
  .cartao-servico:nth-child(2) { grid-column: span 6; }
  .cartao-servico:last-child { grid-column: 1 / -1; }
}
@media (max-width: 620px) {
  .servicos__grade { grid-template-columns: 1fr; }
  .cartao-servico,
  .cartao-servico:first-child,
  .cartao-servico:nth-child(2),
  .cartao-servico:last-child { min-height: 25rem; grid-column: auto; }
}
</style>

<script setup lang="ts">
import { nextTick, ref } from 'vue'

import HeroManifesto from './components/sections/HeroManifesto.vue'
import SecaoServicos from './components/sections/SecaoServicos.vue'
import SecaoProjetos from './components/sections/SecaoProjetos.vue'
import SecaoProcesso from './components/sections/SecaoProcesso.vue'
import SecaoDiferenciais from './components/sections/SecaoDiferenciais.vue'
import SecaoSobre from './components/sections/SecaoSobre.vue'
import SecaoContato from './components/sections/SecaoContato.vue'
import RodapeSite from './components/layout/RodapeSite.vue'
import MenuLateral from './components/layout/MenuLateral.vue'
import RolagemEditorial from './components/layout/RolagemEditorial.vue'
import TransicaoHero from './components/layout/TransicaoHero.vue'
import type { TipoServico } from './content/site'

const servicoSelecionado = ref<TipoServico | ''>('')

async function selecionarServico(tipo: TipoServico) {
  servicoSelecionado.value = tipo
  await nextTick()
  document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
}

</script>

<template>
  <a class="atalho-conteudo" href="#conteudo-principal">Pular para o conteúdo principal</a>
  <MenuLateral />
  <TransicaoHero />
  <RolagemEditorial />

  <main id="conteudo-principal">
    <HeroManifesto />
    <SecaoServicos @selecionar="selecionarServico" />
    <SecaoProjetos />
    <SecaoProcesso />
    <SecaoDiferenciais />
    <SecaoSobre />
    <SecaoContato :tipo-inicial="servicoSelecionado" />
  </main>

  <RodapeSite />
</template>


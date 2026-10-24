<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import LogoChavestech from '../base/LogoChavestech.vue'

const secoes = [
  { id: 'inicio', numero: '00', nome: 'Início' },
  { id: 'servicos', numero: '01', nome: 'Serviços' },
  { id: 'projetos', numero: '02', nome: 'Projetos' },
  { id: 'processo', numero: '03', nome: 'Processo' },
  { id: 'diferenciais', numero: '04', nome: 'Nosso jeito' },
  { id: 'sobre', numero: '05', nome: 'Sobre' },
  { id: 'contato', numero: '06', nome: 'Contato' },
] as const

const itensMenu = [
  secoes[1], secoes[2], secoes[3],
  { ...secoes[0], marca: true },
  secoes[4], secoes[5], secoes[6],
] as const

const secaoAtiva = ref('inicio')
const menuVisivel = ref(false)
const menuAberto = ref(false)
const botaoMenu = ref<HTMLButtonElement | null>(null)
let observadorSecoes: IntersectionObserver | undefined
let observadorInicio: IntersectionObserver | undefined

function selecionarSecao(id: string) {
  secaoAtiva.value = id
  menuAberto.value = false
}

function alternarMenu() {
  menuAberto.value = !menuAberto.value
}

async function fecharMenu() {
  if (!menuAberto.value) return
  menuAberto.value = false
  await nextTick()
  botaoMenu.value?.focus()
}

onMounted(() => {
  observadorSecoes = new IntersectionObserver((entradas) => {
    const visivel = entradas
      .filter((entrada) => entrada.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

    if (visivel?.target.id) secaoAtiva.value = visivel.target.id
  }, {
    rootMargin: '-38% 0px -52% 0px',
    threshold: [0, .1, .25, .5],
  })

  secoes.forEach(({ id }) => {
    const secao = document.getElementById(id)
    if (secao) observadorSecoes?.observe(secao)
  })

  const inicio = document.getElementById('inicio')
  if (inicio) {
    observadorInicio = new IntersectionObserver(([entrada]) => {
      if (!entrada) return

      const deveExibirMenu = entrada.intersectionRatio === 0
        && entrada.boundingClientRect.bottom <= 1

      if (deveExibirMenu && !menuVisivel.value) {
        // Ao sair do hero, a primeira seção em tela é sempre Serviços.
        // Isso também corrige o estado ao repetir hero -> serviços.
        secaoAtiva.value = 'servicos'
      }

      menuVisivel.value = deveExibirMenu

      if (!deveExibirMenu) {
        menuAberto.value = false

        // Um link focado manteria :focus-within ativo enquanto o menu está
        // oculto, fazendo-o reaparecer expandido no próximo scroll.
        const elementoAtivo = document.activeElement
        if (elementoAtivo instanceof HTMLElement && elementoAtivo.closest('.menu-lateral')) {
          elementoAtivo.blur()
        }
      }
    }, { threshold: [.001, .01] })

    observadorInicio.observe(inicio)
  }
})

onBeforeUnmount(() => {
  observadorSecoes?.disconnect()
  observadorInicio?.disconnect()
})
</script>

<template>
  <aside
    class="menu-lateral"
    :class="{
      'menu-lateral--visivel': menuVisivel,
      'menu-lateral--aberto': menuAberto,
    }"
    :aria-hidden="!menuVisivel"
    @keydown.esc="fecharMenu"
  >
    <button
      ref="botaoMenu"
      type="button"
      class="menu-lateral__gatilho"
      aria-controls="navegacao-lateral"
      :aria-label="menuAberto ? 'Fechar navegação' : 'Abrir navegação'"
      :aria-expanded="menuAberto"
      :tabindex="menuVisivel ? 0 : -1"
      @click="alternarMenu"
    >
      <LogoChavestech class="menu-lateral__simbolo" variante="simbolo-branco" alt="" />
    </button>

    <nav id="navegacao-lateral" aria-label="Navegação principal">
      <a
        v-for="item in itensMenu"
        :key="item.id"
        :href="`#${item.id}`"
        :class="{ 'menu-lateral__marca': 'marca' in item }"
        :aria-label="'marca' in item ? 'Voltar ao início' : undefined"
        :aria-current="secaoAtiva === item.id ? 'location' : undefined"
        :tabindex="menuVisivel ? 0 : -1"
        @click="selecionarSecao(item.id)"
      >
        <template v-if="'marca' in item">
          <LogoChavestech class="menu-lateral__simbolo" variante="simbolo-branco" alt="" />
        </template>
        <template v-else>
          <span class="menu-lateral__numero">{{ item.numero }}</span>
          <span class="menu-lateral__nome">{{ item.nome }}</span>
        </template>
      </a>
    </nav>
  </aside>
</template>

<style scoped>
.menu-lateral {
  position: fixed;
  z-index: 50;
  top: 50%;
  left: max(.75rem, calc((100vw - 90rem) / 2 - 4rem));
  width: 3.4rem;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
  transition: opacity 180ms ease 480ms, visibility 0s 780ms;
}
.menu-lateral--visivel {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transition-delay: 0s;
}
.menu-lateral:hover,
.menu-lateral:focus-within { width: 12rem; }
.menu-lateral__gatilho { display: none; }
.menu-lateral nav { position: relative; isolation: isolate; display: grid; gap: .2rem; padding: .45rem; }
.menu-lateral nav::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  border: 1px solid var(--cor-borda);
  border-radius: 1.1rem;
  background: rgba(12, 19, 31, .96);
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, .2);
  content: '';
  transform: scaleY(.135);
  transform-origin: center;
  transition: transform 760ms cubic-bezier(.65, 0, .35, 1);
}
.menu-lateral--visivel nav::before { transform: scaleY(1); }
.menu-lateral a {
  position: relative;
  display: grid;
  min-height: 2.75rem;
  grid-template-columns: 2.4rem minmax(0, 1fr);
  align-items: center;
  border-radius: .75rem;
  color: var(--cor-texto-discreto);
  font-family: var(--fonte-mono);
  font-size: .64rem;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}
.menu-lateral a:not(.menu-lateral__marca) {
  opacity: 0;
  transform: scale(.86);
  transition: opacity 180ms ease, transform 240ms ease;
}
.menu-lateral--visivel a:not(.menu-lateral__marca) {
  opacity: 1;
  transform: scale(1);
  transition-delay: 560ms;
}
.menu-lateral a:hover { color: var(--cor-texto); }
.menu-lateral a[aria-current='location'] { background: rgba(91, 140, 255, .12); color: var(--cor-texto); }
.menu-lateral__numero { display: grid; place-items: center; color: var(--cor-texto-discreto); font-variant-numeric: tabular-nums; }
.menu-lateral a[aria-current='location'] .menu-lateral__numero { color: var(--cor-marca); }
.menu-lateral__nome { overflow: hidden; opacity: 0; transform: translateX(-.35rem); transition: opacity 160ms ease, transform 160ms ease; }
.menu-lateral:hover .menu-lateral__nome,
.menu-lateral:focus-within .menu-lateral__nome { opacity: 1; transform: translateX(0); }
.menu-lateral__marca {
  z-index: 1;
  display: grid !important;
  min-height: 2.75rem;
  grid-template-columns: 1fr !important;
  place-items: center;
  background: var(--cor-marca);
  color: #07101f !important;
  opacity: 0;
  transform: scale(.65);
  transition: opacity 180ms ease, transform 300ms cubic-bezier(.22, 1, .36, 1);
}
.menu-lateral .menu-lateral__marca[aria-current='location'] {
  background: var(--cor-marca);
  color: #07101f;
}
.menu-lateral--visivel .menu-lateral__marca { opacity: 1; transform: scale(1); }
.menu-lateral__simbolo { width: 1.65rem; }

@media (max-width: 899px) {
  .menu-lateral,
  .menu-lateral:hover,
  .menu-lateral:focus-within {
    top: auto;
    bottom: calc(1rem + env(safe-area-inset-bottom));
    left: max(1rem, env(safe-area-inset-left));
    width: auto;
    transform: none;
  }
  .menu-lateral__gatilho {
    position: relative;
    z-index: 2;
    display: grid;
    width: 3rem;
    min-height: 3rem;
    place-items: center;
    border: 1px solid rgba(91, 140, 255, .6);
    border-radius: .8rem;
    background: var(--cor-marca);
    color: #07101f;
    box-shadow: 0 .75rem 2rem rgba(0, 0, 0, .3);
    font-weight: 700;
  }
  .menu-lateral__gatilho:hover { background: #7aa2ff; }
  .menu-lateral nav {
    position: absolute;
    bottom: 3.65rem;
    left: 0;
    width: min(20rem, calc(100vw - 2rem));
    padding: .7rem;
    overscroll-behavior: contain;
    visibility: hidden;
    opacity: 0;
    transform: translateY(.6rem);
    transition: opacity 180ms ease, transform 180ms ease;
  }
  .menu-lateral nav::before { transform: scaleY(1); }
  .menu-lateral--aberto nav { visibility: visible; opacity: 1; transform: translateY(0); }
  .menu-lateral a { grid-template-columns: 2.4rem 1fr; }
  .menu-lateral a:not(.menu-lateral__marca) { opacity: 1; transform: none; }
  .menu-lateral__nome { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .menu-lateral,
  .menu-lateral nav::before,
  .menu-lateral a { transition: none; }
}
</style>

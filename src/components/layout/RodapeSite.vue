<script setup lang="ts">
import LogoChavestech from '../base/LogoChavestech.vue'

const anoAtual = new Date().getFullYear()
</script>

<template>
  <footer class="rodape">
    <div class="container-site rodape__grade">
      <div>
        <a href="#inicio" class="rodape__marca" aria-label="CHAVESTECH — voltar ao início">
          <LogoChavestech alt="" />
        </a>
        <p>Desenvolvimento digital com propósito.</p>
      </div>
      <a href="#inicio" class="rodape__topo">Voltar ao topo <span aria-hidden="true">↑</span></a>
    </div>
    <div class="container-site rodape__base"><span>© {{ anoAtual }} CHAVESTECH</span><span>Ideia → estrutura → experiência</span></div>
  </footer>
</template>

<style scoped>
.rodape { padding: clamp(4rem, 8vw, 7rem) 0 1.5rem; background: #0a111d; }
.rodape__grade { display: grid; grid-template-columns: 1fr auto; gap: 3rem; }
.rodape__marca { display: block; width: clamp(12rem, 22vw, 18rem); }
.rodape__grade p { margin-top: 1.25rem; color: var(--cor-texto-discreto); }
.rodape__topo { display: flex; gap: .75rem; align-items: start; padding-top: .8rem; font-family: var(--fonte-mono); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; }
.rodape__topo:hover { color: var(--cor-marca); }
.rodape__topo span { color: var(--cor-marca); }
.rodape__base { display: flex; justify-content: space-between; gap: 2rem; margin-top: 7rem; padding-top: 1.5rem; border-top: 1px solid var(--cor-borda); color: var(--cor-texto-discreto); font-family: var(--fonte-mono); font-size: .6rem; letter-spacing: .08em; text-transform: uppercase; }
@media (max-width: 700px) {
  .rodape__grade { grid-template-columns: 1fr; }
  .rodape__topo { width: fit-content; }
  .rodape__base { flex-direction: column; margin-top: 4rem; }
}
</style>

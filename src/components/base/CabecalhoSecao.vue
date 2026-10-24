<script setup lang="ts">
defineProps<{
  numero: string
  rotulo: string
  titulo: string
  apoio?: string
}>()
</script>

<template>
  <header class="cabecalho-secao">
    <p class="cabecalho-secao__rotulo"><span>{{ numero }}</span> / {{ rotulo }}</p>
    <div class="cabecalho-secao__texto">
      <h2><slot name="titulo">{{ titulo }}</slot></h2>
      <p v-if="apoio">{{ apoio }}</p>
    </div>
  </header>
</template>

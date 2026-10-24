<script setup lang="ts">
defineProps<{
  texto: string
}>()
</script>

<template>
  <p class="rotulo-secao">{{ texto }}</p>
</template>

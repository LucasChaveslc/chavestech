<script setup lang="ts">
defineProps<{
  nome: 'janela' | 'alvo' | 'loja' | 'pasta' | 'fluxo'
}>()
</script>

<template>
  <svg class="icone-servico" aria-hidden="true" viewBox="0 0 32 32">
    <template v-if="nome === 'janela'">
      <rect x="3.5" y="5.5" width="25" height="21" rx="2" />
      <path d="M4 11h24M8 8.3h.1M11 8.3h.1" />
    </template>
    <template v-else-if="nome === 'alvo'">
      <circle cx="16" cy="16" r="11.5" />
      <circle cx="16" cy="16" r="5.5" />
      <path d="m16 16 9-9M21 7h4v4" />
    </template>
    <template v-else-if="nome === 'loja'">
      <path d="M5 13h22l-2-7H7l-2 7Zm2 0v13h18V13M12 26v-7h8v7" />
      <path d="M5 13c0 2 1.5 3 3.5 3s3.5-1 3.5-3c0 2 1.5 3 4 3s4-1 4-3c0 2 1.5 3 3.5 3S27 15 27 13" />
    </template>
    <template v-else-if="nome === 'pasta'">
      <path d="M4 9.5h9l2.5 3H28v14H4zM4 9.5V6h8l2.5 3.5" />
    </template>
    <template v-else>
      <rect x="3" y="5" width="8" height="6" rx="1" />
      <rect x="21" y="21" width="8" height="6" rx="1" />
      <rect x="3" y="21" width="8" height="6" rx="1" />
      <path d="M11 8h5v16h5M16 16h5" />
    </template>
  </svg>
</template>

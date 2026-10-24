<script setup lang="ts">
import logoHorizontal from '../../assets/brand/chavestech_horizontal_branco_transparente.png'
import simboloBranco from '../../assets/brand/chavestech-simbolo-branco.svg'

type VarianteLogo = 'horizontal' | 'simbolo-branco'

const propriedades = withDefaults(defineProps<{
  variante?: VarianteLogo
  alt?: string
  prioridade?: boolean
}>(), {
  variante: 'horizontal',
  alt: 'CHAVESTECH',
  prioridade: false,
})

const arquivos = {
  horizontal: {
    src: logoHorizontal,
    largura: 1674,
    altura: 520,
  },
  'simbolo-branco': {
    src: simboloBranco,
    largura: 512,
    altura: 512,
  },
} as const
</script>

<template>
  <img
    class="logo-chavestech"
    :src="arquivos[propriedades.variante].src"
    :width="arquivos[propriedades.variante].largura"
    :height="arquivos[propriedades.variante].altura"
    :alt="propriedades.alt"
    :loading="propriedades.prioridade ? 'eager' : 'lazy'"
    :fetchpriority="propriedades.prioridade ? 'high' : 'auto'"
    decoding="async"
    draggable="false"
  >
</template>

<style scoped>
.logo-chavestech {
  display: block;
  max-width: 100%;
  height: auto;
  user-select: none;
}
</style>

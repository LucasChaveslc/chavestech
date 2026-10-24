/// <reference types="vite/client" />

interface Window {
  dataLayer: Array<Record<string, unknown> | IArguments>
  gtag?: (...argumentos: unknown[]) => void
  __chavestechGtmCarregado?: boolean
  __carregarGtmChavestech?: () => void
}


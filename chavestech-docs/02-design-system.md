# Design system — CHAVESTECH Web

**Fonte de verdade:** `00-identidade-instagram-original.md`. Os valores marcados como [definido] aqui são herdados do arquivo; extensões indicadas como [proposta] precisam de validação visual.

## Cores

| Token | Valor | Finalidade | Status |
|---|---|---|---|
| `--cor-fundo` | `#121a28` | fundo principal | definido |
| `--cor-brilho` | `#1d2a42` | brilho radial | definido |
| `--cor-texto` | `#ffffff` | títulos | definido |
| `--cor-texto-suave` | `#d3dae6` | corpo | definido |
| `--cor-texto-discreto` | `#a9b4c6` | texto secundário | definido |
| `--cor-marca` | `#5b8cff` | botões, links, estados ativos | definido |
| `--cor-dourado-nicho` | `#f2c14e` | apenas comunicação imobiliária | definido |
| `--cor-sucesso` | `#2fd27a` | confirmação | definido |
| `--cor-erro` | `#ff6363` | erro | definido |
| `--cor-whatsapp` | `#1fae5b` | ícone/CTA de WhatsApp | definido |
| `--cor-superficie` | `#192437` | cards sobre fundo | proposta |
| `--cor-borda` | `rgba(255,255,255,.11)` | contornos | proposta |
| `--cor-foco` | `#9db9ff` | outline teclado | proposta |

Evitar fazer o site inteiro preto, usar gradientes multicoloridos ou aplicar o dourado em botões genéricos.

## Tipografia

- **Space Grotesk**: títulos 600–700 e corpo 400–500 (família definida; pesos web propostos).
- **JetBrains Mono** (proposta): rótulos, numeração, categorias e microtexto; pode trocar por IBM Plex Mono.
- Corpo: base 16–18px; line-height 1.55–1.7.
- H1: `clamp(2.6rem, 6vw, 5.8rem)`; linha curta com quebras conscientes.
- H2: `clamp(2rem, 4vw, 3.8rem)`; H3: `clamp(1.25rem, 2vw, 1.8rem)`.
- Largura ideal do texto longo: 60–72 caracteres.

## Espaçamento e estrutura [proposta]

- Container: `min(100% - 2.5rem, 1200px)`; em telas pequenas, margens >= 20px.
- Escala de espaçamento: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.
- Seção: padding vertical `clamp(72px, 10vw, 128px)`.
- Radius: botões 999px; cards 20px; campos 14px; pequenos badges 999px.
- Bordas 1px, sombras discretas; evitar glassmorphism em todas as áreas.

## Fundo de grade

Grade branca a 5%, 60px, brilho radial no topo. Reduzir opacidade em áreas com texto para legibilidade. Não aplicar em todo card. Respeitar a cor base do Instagram.

```css
:root {
  --cor-fundo: #121a28;
  --cor-brilho: #1d2a42;
  --cor-texto: #ffffff;
  --cor-texto-suave: #d3dae6;
  --cor-texto-discreto: #a9b4c6;
  --cor-marca: #5b8cff;
  --cor-dourado-nicho: #f2c14e;
  --cor-sucesso: #2fd27a;
  --cor-erro: #ff6363;
  --cor-whatsapp: #1fae5b;
  --cor-superficie: #192437;
  --cor-borda: rgba(255,255,255,.11);
  --cor-foco: #9db9ff;
}
.fundo-marca {
  background-color: var(--cor-fundo);
  background-image:
    radial-gradient(ellipse at top, #1d2a42 0%, transparent 60%),
    linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size: 100% 100%, 60px 60px, 60px 60px;
}
:focus-visible { outline: 3px solid var(--cor-foco); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

## Acessibilidade e responsividade

- Contraste WCAG AA para texto e campos; conferir também sobre o azul do botão.
- Foco visível, navegação por teclado, labels explícitos, erros associados ao campo, alvos >=44x44px.
- Não depender apenas de cor para sucesso/erro.
- Mobile-first; evitar títulos que estouram largura e carrosséis que bloqueiam scroll.
- Imagens com `alt` contextual; imagens puramente decorativas com `alt=""`.
- Animações sutis, nunca obrigatórias para compreender conteúdo.

## Logo

Usar somente o arquivo real da marca quando disponível, sobre fundo escuro. O contexto aponta que ela existe apenas como imagem sem transparência; não redesenhar no código como se fosse oficial. **Enquanto o asset não estiver no repositório, usar wordmark textual temporário `CHAVESTECH`**, claramente provisório.

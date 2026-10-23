# Plano de implementação e instruções para o Codex

## Preparação

1. Leia `README.md`, `00-identidade-instagram-original.md` e todos os arquivos `01` a `08` antes de gerar código.
2. Inspecione o projeto existente (stack, scripts, estrutura, lint) antes de alterar arquivos.
3. Siga a stack já presente. **Não migrar frameworks, instalar dependências ou criar backend sem necessidade/justificativa.**
4. Escreva código em português, com identificadores claros e autoexplicativos, sempre que tecnicamente permitido. Preserve nomes de APIs e convenções obrigatórias de bibliotecas.
5. Priorize componentes reutilizáveis e separação entre conteúdo, interface e lógica.
6. Nunca invente informação comercial, clientes, números ou resultados.

## Desenvolvimento em 4 entregas pequenas

### Entrega A — Base visual

- Fontes, tokens, reset, layout/container, header, fundo de grade e footer.
- Hero completo e responsivo com cópia definida em `03-copy.md`.
- Mockup conceitual rotulado, nada que pareça cliente real.
- Verificar foco, contraste, overflow e mobile.

### Entrega B — Conteúdo principal

- Serviços com 5 cards e CTAs para o formulário.
- Projetos com placeholders conceituais claramente identificados (ou dados reais somente se fornecidos).
- Processo de 6 etapas original, vertical no mobile e com progressão no desktop.
- Sobre e diferenciais (diferenciais podem ser descartados se repetitivos).

### Entrega C — Briefing interativo

- Etapas e validação detalhadas em `06-formulario-briefing.md`.
- Sem backend: modo demonstração explícito; não coletar dados reais sem destino funcional.
- Ao integrar backend: checagem de LGPD, proteção antispam e estados reais de envio.

### Entrega D — Polimento e qualidade

- SEO base (meta title/description/OG), acessibilidade e responsividade.
- Otimizar imagens; lazy-load de imagens fora da primeira dobra; fontes sem bloquear render desnecessariamente.
- Suporte a movimento reduzido; testar teclado e leitores de tela conforme disponível.
- Rever copy, revisar links e medir desempenho com ferramentas apropriadas.

## Prompt inicial pronto para Codex

> Você vai construir a home da CHAVESTECH a partir destes arquivos Markdown. Leia README.md, 00-identidade-instagram-original.md e 01 a 08 antes de codar. Preserve a identidade existente (fundo #121a28, azul #5b8cff, grade sutil, Space Grotesk e tom de voz). Crie uma interface original: a Matilab inspira o briefing guiado; a Istoria inspira a clareza de 6 passos no processo; a Maatz inspira a assertividade comercial — não copie textos, layouts ou assets. Inspecione a stack existente e implemente apenas a Entrega A deste plano. Código didático, identificadores em português, componentes reutilizáveis, mobile-first e acessibilidade. Não fabrique casos, clientes, resultados, preços nem um formulário que finja enviar. Antes de começar, liste os arquivos a alterar; ao terminar, explique alterações e como testar.

## Prompt para próxima iteração

> Confira o plano e implemente apenas a Entrega B. Reutilize tokens e componentes da Entrega A. Mantenha copy em português e os exemplos com identificação `Projeto conceitual — negócio fictício`. Verifique visual mobile/desktop, estados de foco, navegação por âncoras e CTAs de serviços pré-selecionando o briefing (ou documente dependência da Entrega C). Não altere decisões de branding sem apontar conflitos.

## Critérios globais de pronto

- Sem scroll horizontal em 360, 390, 768, 1024 e 1440px.
- Links navegam, botões têm ação real, não há controles decorativos fingindo interação.
- Hierarquia semântica correta (`h1` único; `h2` por seção).
- Textos não cortados, contraste conferido, navegação por teclado usável.
- Conteúdo de demonstração sempre rotulado; nada de prova social fictícia.
- Não publicar formulário sem endpoint, política de privacidade e proteção contra abuso.

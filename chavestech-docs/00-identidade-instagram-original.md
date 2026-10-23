# CHAVESTECH: Identidade visual do Instagram

> Documento de contexto para qualquer chat que precise seguir a identidade da marca (posts, reels, site).
> Atualizado em 23/10/2026. Fonte de verdade: os posts já publicados e o arquivo de contexto do Instagram.
> Tudo que está marcado como **[definido]** vem dos posts e do contexto. Tudo marcado como **[sugestão]** é adaptação minha e pode mudar.

## 1. Resumo em 5 linhas
- Marca: **CHAVESTECH** (Lucas Chaves, freelancer de desenvolvimento). Vende sites, landing pages, portfólios e sistemas que trazem cliente.
- Estética: **fundo azul-marinho escuro com grade sutil**, texto branco, títulos grandes em **Space Grotesk**, rótulos pequenos em fonte monoespaçada.
- Destaque da marca: **azul**. Destaque do nicho imobiliário: **dourado**.
- Visual limpo, poucas palavras, alto contraste, mockups realistas **em português**.
- Tom: didático, confiável, próximo. Fala de dinheiro, cliente e tempo, não de tecnologia.

## 2. Cores [definido]

| Uso | Hex |
|---|---|
| Texto principal | `#ffffff` |
| Texto de apoio | `#d3dae6` |
| Texto apagado | `#a9b4c6` |
| Destaque da marca (azul) | `#5b8cff` |
| Destaque do nicho (dourado) | `#f2c14e` |
| Positivo | `#2fd27a` |
| Negativo | `#ff6363` |
| WhatsApp (nos exemplos) | `#1fae5b` |

Regras:
- Posts gerais: destaque em **azul**. Posts de imobiliária: destaque em **dourado** (palavras-chave do título, rótulos, marcadores, setas, botão de CTA).
- Verde e vermelho só para sinalizar certo/errado, antes/depois, feito/pendente.
- Manter sempre o fundo `#121a28`. Uma peça saiu mais preta/grafite que isso e foi marcada como erro.

### Tokens prontos (CSS) [definido + organização minha]
```css
:root {
  --bg: #121a28;
  --bg-glow: #1d2a42;
  --text: #ffffff;
  --text-soft: #d3dae6;
  --text-muted: #a9b4c6;
  --brand: #5b8cff;      /* destaque geral */
  --niche-gold: #f2c14e; /* destaque do nicho imobiliário */
  --positive: #2fd27a;
  --negative: #ff6363;
  --whatsapp: #1fae5b;
  --grid-line: rgba(255, 255, 255, 0.05);
  --grid-size: 60px;
}
```

## 3. Fundo [definido]
Azul-marinho `#121a28`, com:
- **Grade sutil:** linhas brancas a 5%, quadrados de 60px.
- **Brilho radial** `#1d2a42` no topo.

```css
body {
  background-color: #121a28;
  background-image:
    radial-gradient(ellipse at top, #1d2a42 0%, rgba(29, 42, 66, 0) 60%),
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 100% 100%, 60px 60px, 60px 60px;
}
```

## 4. Tipografia

- **Fonte principal [definido]:** **Space Grotesk**. Títulos em **700**, texto em **500**. Google Fonts ou pacote npm `@fontsource/space-grotesk`.
- **Rótulos [definido]:** texto pequeno, em **caixa alta**, em **fonte monoespaçada**, com espaçamento entre letras. A fonte mono exata não foi definida. **[sugestão]** usar uma mono comum (ex.: JetBrains Mono ou IBM Plex Mono) e manter a mesma em todo lugar.
- Exemplos de rótulos usados: "PARA IMOBILIÁRIAS", "O PROBLEMA", "A SOLUÇÃO · PARTE 1", "SITE INSTITUCIONAL", "CHECKLIST", "DIAGNÓSTICO GRATUITO", "VAMOS NESSA?".
- Cor do rótulo: **azul** nos posts gerais, **dourado** nos posts do nicho imobiliário.
- Títulos: grandes, poucas palavras, alto contraste. Em geral uma ou duas palavras-chave do título ganham a cor de destaque (ex.: "Sua imobiliária paga portal todo mês. **E o cliente nem lembra do seu nome.**").
- Texto de apoio: `#d3dae6`, com trechos importantes em branco e negrito.

## 5. Logo [definido]
- Monograma "C" estilizado com o símbolo `</>` dentro, mais o texto **CHAVESTECH** embaixo.
- Cor: cinza-claro/branco, sempre sobre fundo escuro.
- **Só existe como imagem** (criada no Gemini, sem arquivo editável nem PNG transparente). Usar como está.
- Posição nos posts: parte de baixo da peça. Nos carrosséis, pequena no canto inferior esquerdo; no último slide, grande e centralizada com a frase de apoio ("Sites e sistemas para imobiliárias").
- Cuidado: não deixar a logo apagada ou pequena demais. Contraste baixo na logo foi um erro apontado.
- **[sugestão para o site]** colocar a imagem sobre fundo escuro (`--bg`) para o contraste funcionar, já que não há versão transparente.

## 6. Componentes visuais que se repetem nos posts [definido]

- **Rótulo no topo à esquerda** (mono, caixa alta) e **numeração no topo à direita** (ex.: `01/05`, também mono).
- **Seta de continuidade** no canto inferior direito: "Arrasta pro lado →" no primeiro slide, depois frases curtas ("Tem jeito →", "E tem mais →", "Bora? →"), na cor de destaque.
- **Cards escuros** com cantos bem arredondados e borda sutil, sobre o fundo. Ícone em quadradinho arredondado à esquerda, título em branco, descrição em cinza-claro.
- **Pílulas com check** (✓ na cor de destaque) para listar benefícios, em formato arredondado com borda fina.
- **Botão de CTA** em formato pílula, na cor de destaque (dourado no nicho), texto escuro em negrito, com ícone de envio. Exemplo: `Mandar "IMOBILIÁRIA"`.
- **Botão de WhatsApp** em verde `#1fae5b`, com o ícone do WhatsApp, nos mockups (ex.: "Pedir orçamento no WhatsApp").
- **Etiquetas ANTES (vermelho) e DEPOIS (verde)** nas comparações, em formato pílula, caixa alta.
- **Números grandes só com contorno** em azul (`01`, `02`...) nos itens numerados do carrossel de dicas.
- **Checklist** com caixas de contorno azul, uma linha por item, com divisor sutil.
- **Barras de progresso** vermelha (site pesado, carregando) e verde (otimizado, pronto) para ilustrar velocidade.
- **Mockups:** celular, notebook e janela de navegador com telas realistas, em português, com negócio fictício. Tabelas e painéis com etiquetas de status coloridas (Novo, Em contato, Visita marcada, Proposta).
- **Ícones:** de traço fino, na cor de destaque, dentro de quadradinho arredondado escuro.

## 7. Formatos [definido]
- **Carrossel:** 1080×1350 (4:5).
- **Reels:** 1080×1920 (9:16).
- Margens generosas nas laterais. Rótulo e numeração no topo, logo e seta embaixo.

## 8. Composição e variedade [definido]
- **Variar a composição de um post para outro**, mantendo cores e fonte. Os dois primeiros conteúdos ficaram parecidos demais (número grande, título, texto e um card).
- Gostou do **carrossel panorâmico**, em que um elemento (chave dourada, celular, caminho tracejado) começa num slide e termina no seguinte. Vale repetir a ideia.

## 9. Tom de voz e texto [definido]
- Didático e confiável, linguagem próxima. Sem exagero e sem promessa milagrosa.
- Direto e prático, sem jargão técnico. Fala de **dinheiro, cliente e tempo**.
- Português do Brasil, informal profissional, tratando por "você".
- Gancho em forma de dor ou pergunta. Exemplos aprovados:
  - "Seu site é bonito. Mas ele traz cliente?"
  - "Sua imobiliária paga portal todo mês. E o cliente nem lembra do seu nome."
  - "Site não é enfeite. É o seu vendedor 24h por dia."
- CTA: palavra-chave no direct, uma por post. "EU QUERO" nos gerais, "IMOBILIÁRIA" nos posts do nicho. Link na bio leva ao portfólio.

## 10. Regras de honestidade e uso de exemplos [definido]
- Não usar número ou estatística que Lucas não consiga comprovar.
- Exemplos visuais usam **negócios fictícios**, sempre com o aviso "exemplo com negócio fictício" (ou "dados de exemplo" em painéis):
  - **Oficina Boa Roda** (geral)
  - **Lar Certo Imóveis** (nicho imobiliário)
- Sem foto de banco de imagens apresentada como trabalho real.
- Sem print real e sem nome de cliente nos cases: apenas texto.
- Não criticar negócios reais em público.
- Lucas **não aparece** (sem rosto, sem voz real). Tudo fala em nome da CHAVESTECH.

## 11. O que evitar (erros já identificados) [definido]
- Textos de mockup em inglês.
- Placeholders visíveis (ex.: "Rua Exemplo, 123").
- Fundo diferente do padrão (mais preto ou grafite que `#121a28`).
- Texto de baixo contraste, inclusive logo apagada.
- Elementos cortados por engano (ex.: "ua imobiliária" no lugar de "Sua imobiliária").
- Nomes de negócio fictício diferentes de um slide para outro.
- Números ou detalhes que não batem com o texto (ex.: "formulário de 6 campos" mostrando 3).
- Promessas sem prova.
- Última peça sem chamada para ação.

## 12. Notas para o site da marca [sugestão]
- O **portfólio atual** usa fundo claro, seção escura e azul vivo (~`#2563EB`). Hoje **não combina** com o Instagram. Ao codar o site novo, recomendo seguir esta identidade: fundo `--bg`, grade sutil, Space Grotesk, azul `--brand` como destaque.
- O dourado `--niche-gold` pode aparecer em uma seção ou página dedicada a imobiliárias, espelhando o Instagram.
- Reaproveitar os componentes da seção 6 (cards escuros, pílulas com check, rótulos mono, botão CTA em pílula, botão verde de WhatsApp) mantém o site e o feed parecendo a mesma marca.
- Nome sempre escrito **CHAVESTECH**.
- Manter as regras de honestidade: sem print real de cliente, sem nome de cliente, mockups com aviso de negócio fictício.

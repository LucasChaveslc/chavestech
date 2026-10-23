# Biblioteca de componentes (especificação funcional)

## Regras gerais

- Componentes reutilizáveis, nomes autoexplicativos em português no código quando a stack permitir.
- Contratos claros: estados `normal`, `hover`, `foco`, `desabilitado`, `carregando`, `erro`, quando aplicáveis.
- Acessibilidade antes de animação. Preferir transições 150–250ms.

| Componente | Aparência | Interação/estado | Usado em |
|---|---|---|---|
| `Cabecalho` | transparente sobre o hero; borda ao rolar | navegação por âncoras, menu mobile acessível | site todo |
| `RotuloSecao` | mono, caixa alta, azul, tracking amplo | decorativo, sem clique | todas as seções |
| `BotaoPrimario` | pílula azul, texto de alto contraste, seta | hover discreto, foco forte, loading quando enviar | hero/CTAs |
| `BotaoSecundario` | pílula contornada ou link com seta | não competir com primário | hero/cases |
| `CartaoServico` | superfície azul-marinho mais clara, borda fina, raio 20px | hover com elevação mínima; CTA funcional | serviços |
| `CartaoProjeto` | mockup com janela de navegador + legenda | link real ou detalhe local; selo conceitual | projetos |
| `MarcoProcesso` | numeração contornada + linha técnica | animação opcional ao entrar viewport | processo |
| `IndicadorEtapas` | passos `01/04`, barra de progresso | atualização sem perder contexto | briefing |
| `CampoTexto` | fundo escuro, borda visível, label acima | erro vinculado por `aria-describedby` | briefing |
| `OpcaoSelecionavel` | card-radio com ícone e texto | selecionado com borda azul + marcador textual | briefing |
| `SelecaoMultipla` | pills / checkbox cards | keyboard, múltipla escolha e limites | briefing |
| `AvisoInline` | caixa discreta com ícone e frase | aviso, erro ou sucesso descritivo | briefing |
| `PerguntaFrequente` | accordion com divisor | `button`, `aria-expanded`, teclado | FAQ opcional |
| `BotaoWhatsapp` | verde somente para WhatsApp, rótulo claro | abre destino real; não simula envio | contato |

## Botões

- Primário: `Conversar sobre meu projeto` / `Enviar meu projeto`.
- Hover: brilho contido ou deslocamento da seta de 2px, sem “pular” layout.
- Desabilitado: apenas quando real; não esconder motivo do bloqueio.
- Área clicável mínima de 44px.

## Cards

- Usar ícones de linha consistentes; não misturar emojis, ícones 3D e glyphs aleatórios.
- Em desktop, grid pode ser assimétrico, mas baseline e paddings coerentes.
- Não tornar um card inteiro clicável se também houver links internos conflitantes.

## Mockups

- Janela de navegador com barra discreta, interface legível e português correto.
- Dados fictícios devem permanecer consistentes entre o site e Instagram.
- Legenda: `Projeto conceitual — negócio fictício` visível junto à peça.
- Não usar logotipos de clientes ou métricas sem autorização.

## Processo

- Etapas numeradas 01–06 com linha fina; conteúdo em HTML de lista ordenada para significado sem CSS.
- No mobile, linha contínua à esquerda e texto à direita.
- Animação com `prefers-reduced-motion`; nunca esconder conteúdo até JS executar.

## Forms

- `label` visível em todos os inputs; placeholder é exemplo, não rótulo.
- Mensagens específicas (`Informe um e-mail válido`), nunca apenas borda vermelha.
- Botão voltar preserva respostas; teclado Enter não pula validações.
- Prevenir envios duplicados enquanto a solicitação é processada.
- Estado de sucesso só com retorno confirmado do servidor.

## Componentes a evitar inicialmente

- Cursor customizado, scroll-jacking, vídeo autoplay de fundo, excesso de parallax, contadores fictícios, logos de “parceiros” inventados, depoimentos fabricados.

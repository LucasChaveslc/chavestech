# Arquitetura da home e estrutura das seções

## Navegação desktop

Logo | Serviços | Projetos | Processo | Sobre | `Falar do meu projeto` (CTA)

Mobile: botão menu acessível, lista vertical e CTA; fechar menu após selecionar âncora. Exibir `Contato` como âncora do briefing.

## Ordem recomendada (MVP)

| Ordem | ID | Seção | Objetivo | Forma |
|---|---|---|---|---|
| 00 | `#inicio` | Hero | explicar o que faz e iniciar ação | texto editorial + mockup conceitual |
| 01 | `#servicos` | Serviços | ajudar a reconhecer a solução | grid 2+3 ou cards assimétricos |
| 02 | `#projetos` | Projetos | demonstrar repertório com honestidade | vitrine de cases/projetos conceituais |
| 03 | `#processo` | Processo | reduzir incerteza na contratação | linha do tempo 6 passos |
| 04 | `#diferenciais` | Nosso jeito (opcional) | demonstrar critérios de trabalho | 3 blocos editoriais curtos |
| 05 | `#sobre` | Sobre | humanizar o estúdio sem inventar equipe | texto + elemento gráfico de marca |
| 06 | `#contato` | Briefing guiado | qualificar pedido e captar contato | etapas progressivas |
| 07 | rodapé | Footer | facilitar navegação/contato e informar | links, marca, legal |

## 00 — Hero

- Esquerda: eyebrow, H1 de no máximo 3–4 linhas em desktop, parágrafo, dois CTAs.
- Direita: composição de 2–3 interfaces conceituais (site, mobile, painel), com textos em PT-BR e selo de demonstração.
- Fundo: grade de 60px e brilho radial; área do título com contraste alto.
- Em mobile: conteúdo primeiro, mockup depois; CTAs empilhados se necessário.

## 01 — Serviços

- Cabeçalho com rótulo e H2 + parágrafo.
- Cinco cards com ritmos distintos; cada card traz número, ícone simples, título, explicação e CTA.
- Clique no CTA pré-seleciona serviço no briefing (`#contato`) sem envio automático.
- Destacar sistemas sem fazê-los parecer mais importantes do que os outros serviços.

## 02 — Projetos

- Layout em duas colunas no desktop, uma no mobile.
- Cada case tem capa, categoria, nome, desafio, solução e o estado `Conceitual` ou `Real`.
- Se não houver projetos reais autorizados, mostrar **apenas projetos conceituais identificados**; exemplos possíveis: Oficina Boa Roda, Lar Certo Imóveis (preservar nomes usados na comunicação existente).
- Filtros só se houver volume suficiente e interação real; nada de filtro cenográfico.
- Não apresentar prints inventados como sites publicados.

## 03 — Processo (referência de conceito: Istoria)

- Visual original: trilha conectando 6 marcos numerados, alternating stagger no desktop e vertical simples no mobile.
- Cada etapa: `01`, título curto, texto de 1–2 frases, indicador de progresso narrativo.
- Pode usar destaque de etapa ativa conforme rolagem (opcional); conteúdo sempre visível e acessível sem JS.
- Etapas: conversa inicial; escopo; estrutura/design; desenvolvimento; revisão; publicação.
- Não copiar ilustrações ou composição da Istoria.

## 04 — Diferenciais (opcional)

- Fundo com menos elementos para aliviar a leitura.
- Três princípios, cada um com uma frase comprovável como compromisso de processo (não promessa de resultado).
- Remover se a página ficar longa sem agregar nova informação.

## 05 — Sobre

- Título com abordagem humana, sem foto falsa de equipe.
- Apresentar estúdio independente, método e valores. Mostrar rosto apenas se futuramente autorizado.
- Elemento visual: linhas técnicas / cursor / janela de projeto, não fotografia genérica.

## 06 — Contato

- Painel dividido: coluna editorial à esquerda e formulário guiado à direita.
- Em mobile, título antes do formulário e etapas em uma coluna.
- Barra de progresso textual e visual; resumo da solicitação antes de enviar.
- Não mostrar preço estimado automaticamente.

## Rodapé

- Wordmark real quando disponível, frase de posicionamento, âncoras, contatos configurados e copyright dinâmico.
- Links para privacidade e termos quando o formulário entrar em produção.

## Percurso de conversão

`Hero/Serviço/Projeto -> Briefing (serviço pré-selecionado quando aplicável) -> Validação -> Consentimento -> Envio real -> Confirmação`.

**Versão sem backend:** oferecer opção de WhatsApp apenas com destino real configurado e texto revisável; não confirmar recebimento se só houve abertura do aplicativo. Alternativamente manter formulário em modo de demonstração claramente marcado.

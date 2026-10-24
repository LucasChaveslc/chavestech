# Analytics — Etapa 1

## Escopo implementado

Esta etapa mede somente CTAs comerciais que levam ao briefing e o primeiro início efetivo de preenchimento. Os links dos dois projetos conceituais não são instrumentados.

Todos os eventos passam por `src/services/gtm.ts`. Sem consentimento analítico, `enviarEventoGtm` retorna `false` e nada é adicionado ao `dataLayer`.

## Eventos

### `cta_click`

Parâmetros:

- `cta_location`: `hero`, `servicos` ou `processo`;
- `cta_id`: `hero_conversar_projeto`, `servicos_site`, `servicos_landing`, `servicos_ecommerce`, `servicos_portfolio`, `servicos_sistema` ou `processo_comecar_projeto`;
- `service_type`: `site`, `landing`, `ecommerce`, `portfolio` ou `sistema`; presente apenas nos CTAs específicos dos serviços;
- `cta_target`: sempre `briefing`.

### `form_start`

Disparado na primeira alteração efetiva de um campo do briefing. Quando um serviço já veio selecionado por um CTA, avançar validamente para a próxima etapa também conta como início real. Apenas a exibição ou o foco do formulário não dispara o evento.

Parâmetros:

- `form_id`: sempre `briefing_orcamento`;
- `service_type`: `site`, `landing`, `ecommerce`, `portfolio` ou `sistema`, somente quando uma dessas opções estiver selecionada.

O controle de unicidade é mantido durante o ciclo de vida da página. Se a primeira interação acontecer sem consentimento, ela não é armazenada nem reenviada retroativamente; uma interação posterior, já autorizada, poderá registrar o início uma única vez.

## Configuração necessária no GTM

Criar variáveis de camada de dados, versão 2, para:

- `cta_location`;
- `cta_id`;
- `service_type`;
- `cta_target`;
- `form_id`.

Criar dois acionadores do tipo **Evento personalizado**:

1. Nome do evento `cta_click`;
2. Nome do evento `form_start`.

Criar uma tag de evento GA4 para cada acionador, preservando o mesmo nome do evento e encaminhando somente os parâmetros listados acima. Nas duas tags, exigir `analytics_storage` em **Configurações de consentimento**. Não adicionar acionadores `All Pages` ou `Initialization` a essas tags.

## Conflito com a medição otimizada

Em 24/10/2026, o contêiner publicado utiliza a métrica `G-2ERCMEEW8Y` e sua configuração pública contém o coletor `__ccd_em_form`. Isso indica que **Interações com formulários** está ativo na medição otimizada e pode gerar outro `form_start` para o mesmo briefing.

Antes de publicar a tag manual `form_start`, acessar no GA4:

1. **Administrador → Fluxos de dados → fluxo Web da CHAVESTECH**;
2. abrir as configurações de **Medição otimizada**;
3. desativar somente **Interações com formulários**;
4. manter as demais opções de medição otimizada conforme a estratégia vigente;
5. validar no Tag Assistant que uma interação real produz exatamente um `form_start`.

Essa alteração pertence à configuração do fluxo GA4 e não pode ser aplicada pelo código do site.

## Privacidade

Os eventos não enviam conteúdo de campos. Nome, e-mail, telefone, empresa, URL, descrição, objetivos e demais respostas do briefing não fazem parte dos objetos enviados ao `dataLayer`.

O envio real e o evento de conversão posterior à confirmação do servidor estão documentados em `11-resend-leads.md`.

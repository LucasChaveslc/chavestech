# Consentimento e Google Tag Manager

## Arquitetura implementada

- Contêiner: `GTM-PCJQDH7L`.
- Modo: Consent Mode V2 básico.
- Sem escolha ou com todos os opcionais recusados, o script `gtm.js` não é carregado.
- Preferências persistidas em `localStorage` na chave `chavestech:consentimento:v1`.
- O registro contém a versão `1.0` da Política de Privacidade e expira após 180 dias.
- Categorias opcionais: `analytics` e `publicidade`, ambas desativadas por padrão.
- O evento central de consentimento é `chavestech_consent_ready`.

## Configuração necessária no GTM

O código do site controla carregamento e consentimento, mas cada tag também precisa declarar sua dependência no painel do GTM.

### Estado verificado do contêiner publicado

Em 24/10/2026, o JavaScript público de `GTM-PCJQDH7L` foi inspecionado e contém a tag Google com o ID `G-2ERCMEEW8Y` e tags de evento para `cta_click`, `form_start` e `generate_lead`.

Permanecem duas correções no painel do Google:

- desativar a detecção automática de dados fornecidos pelo usuário, atualmente habilitada para e-mail e telefone;
- desativar somente `Interações com formulários` na medição otimizada, pois `form_start` já é enviado manualmente pelo site.

### Google Analytics 4

1. Criar uma variável de camada de dados `consent_analytics`.
2. Criar acionador de evento personalizado `chavestech_consent_ready`.
3. Condição: `consent_analytics` igual a `granted`.
4. Associar esse acionador à tag Google/GA4.
5. Em `Configurações de consentimento`, exigir `analytics_storage`.
6. Não enviar `nome`, `email`, `telefone`, empresa, URL fornecida ou textos livres do briefing.

### Publicidade

1. Criar variável `consent_publicidade`.
2. Usar o evento `chavestech_consent_ready` com condição igual a `granted`.
3. Exigir `ad_storage`, `ad_user_data` e `ad_personalization` nas tags publicitárias.

Não usar `All Pages` isoladamente em tags opcionais. O evento de consentimento é disparado tanto na primeira escolha quanto na restauração de uma escolha válida.

## Roteiro de validação

1. Limpar `localStorage`, cookies e recarregar: não deve existir requisição para `gtm.js`, `collect` ou `google-analytics.com`.
2. Aceitar analíticos: deve carregar `gtm.js`; GA4 só pode disparar com `analytics_storage=granted`.
3. Rejeitar opcionais: GTM e GA4 não devem carregar.
4. Aceitar somente analíticos: publicidade permanece `denied`.
5. Alterar preferências pelo rodapé e confirmar o novo evento `chavestech_consent_ready`.
6. Revogar uma categoria ou todas: cookies conhecidos da categoria são removidos e, se o GTM já estava carregado, a página reinicializa sob a nova escolha.
7. Recarregar: a escolha válida deve ser restaurada antes de qualquer carregamento opcional.
8. Simular um registro com mais de 180 dias: o GTM deve permanecer bloqueado e o banner deve reaparecer.
9. Repetir em 390px de largura e somente com teclado.

## Pendências antes da publicação definitiva

- Revisar juridicamente a Política de Privacidade.
- Confirmar retenção configurada no GA4.
- Confirmar fornecedores, transferências internacionais e termos aplicáveis.
- Corrigir as duas opções automáticas do Google indicadas acima e validar no Tag Assistant.

## Resultado da validação local

Em 24/10/2026, os testes automatizados em navegador confirmaram:

- primeira visita com banner, sem autorização implícita e sem requisição para `gtm.js`;
- opções analítica e de publicidade inicialmente desmarcadas;
- carregamento de `gtm.js` somente após autorização opcional;
- consentimento somente analítico, alteração, rejeição, revogação e restauração após recarregar;
- ausência de requisições GA4 `collect` no estado atual do contêiner;
- funcionamento em viewport móvel de 390 px, nas orientações retrato e paisagem, sem rolagem horizontal ou controles fora da tela.

A validação final no Tag Assistant deve ser repetida depois da criação e publicação da tag GA4.

# Envio de briefings com Resend

## Arquitetura

- Frontend Vue envia `POST /api/briefing` no mesmo domínio.
- `api/briefing.ts` é uma Vercel Function Node.js; a chave do Resend nunca entra no bundle do navegador.
- `server/briefing.ts` valida, normaliza e produz as versões HTML e texto do e-mail.
- O Resend encaminha o briefing ao e-mail comercial e usa o e-mail do visitante como `replyTo`.
- O frontend só mostra sucesso e envia `generate_lead` depois de receber `201` com `ok: true` e `registrado: true` do backend.
- As respostas ficam apenas na memória da página no frontend. O site não grava PII em `localStorage`.

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `RESEND_API_KEY` | Chave secreta criada no Resend com permissão de envio. |
| `RESEND_FROM_EMAIL` | Remetente em domínio verificado, por exemplo `CHAVESTECH <briefings@chavestech.com.br>`. |
| `BRIEFING_TO_EMAIL` | Caixa comercial destinatária; aceita mais de um endereço separado por vírgula. |
| `SITE_URL` | Origem pública canônica autorizada, sem barra final. |
| `RATE_LIMIT_SECRET` | Segredo aleatório longo usado para transformar IP em identificador não reversível na limitação local. |
| `ALLOWED_ORIGINS` | Opcional; origens adicionais separadas por vírgula para testes controlados. |

Nenhuma dessas variáveis deve usar o prefixo `VITE_`. Configure-as no projeto da Vercel para Production e, quando necessário, Preview/Development.

## Validação e segurança

- aceita somente `POST` JSON do mesmo domínio;
- corpo máximo de 32 KiB;
- allowlists para tipo, objetivos e fase;
- nome, e-mail, URL, telefone, data e limites de texto validados no servidor;
- saída HTML escapada antes de compor o e-mail;
- consentimento de contato obrigatório e não pré-marcado;
- honeypot e tempo mínimo de três segundos;
- limite de cinco solicitações por identificador em quinze minutos, por instância aquecida;
- IP transformado com HMAC e nunca incluído nos logs;
- idempotência `briefing/<UUID>` no Resend para impedir o reenvio da mesma solicitação durante 24 horas;
- logs contêm apenas evento técnico, protocolo, ID do e-mail, classe/status do erro — nunca o corpo do briefing.

O limite em memória é uma proteção de primeira linha e não é global entre todas as instâncias serverless. Para tráfego relevante, habilitar também rate limiting no Vercel Firewall ou adicionar um armazenamento distribuído com expiração. A idempotência do Resend continua protegendo contra duplicidade da mesma solicitação.

## Resend

1. Criar/verificar o domínio remetente no painel **Domains**.
2. Publicar os registros DNS solicitados pelo Resend (SPF e DKIM; DMARC recomendado).
3. Criar uma API key restrita ao envio e preencher `RESEND_API_KEY` na Vercel.
4. Preencher `RESEND_FROM_EMAIL` com um endereço pertencente ao domínio verificado.
5. Preencher `BRIEFING_TO_EMAIL` com a caixa comercial real.
6. Conferir os e-mails aceitos/entregues na página **Emails** do Resend.

## Teste local e real

O `vite dev` isolado não executa a pasta `api`. Para testar frontend e função juntos:

1. copiar `.env.example` para `.env.local` e preencher valores de teste;
2. instalar/autenticar a Vercel CLI;
3. executar `npx vercel dev`;
4. acessar a URL local informada pelo CLI;
5. preencher o briefing com dados de teste autorizados;
6. confirmar o recebimento no destino e o status no painel do Resend;
7. repetir o mesmo payload/UUID apenas por teste técnico e confirmar que o Resend devolve o mesmo ID sem duplicar a mensagem.

Não usar dados pessoais reais em ambientes Preview ou Development.

## Evento `generate_lead`

Após a resposta confirmada do backend, e somente com consentimento analítico, o frontend envia:

```js
{
  event: 'generate_lead',
  form_id: 'briefing_orcamento',
  service_type: 'site' // omitido quando não houver serviço específico
}
```

No GTM:

1. criar acionador de evento personalizado `generate_lead`;
2. criar uma tag GA4 Event com nome `generate_lead`;
3. encaminhar `form_id` e `service_type` usando variáveis da camada de dados;
4. exigir `analytics_storage` nas configurações de consentimento;
5. não atribuir `value` ou `currency`;
6. validar no Preview/Tag Assistant: erro do backend não pode produzir o evento e uma resposta `201` deve produzir exatamente um.

## Pendências de produção e privacidade

- preencher todas as variáveis de ambiente;
- informar o domínio oficial e verificar seu DNS no Resend;
- informar o e-mail comercial destinatário;
- concluir e revisar juridicamente a Política de Privacidade antes de receber leads reais;
- identificar controlador e canal para exercício de direitos;
- definir finalidade/base legal e prazos de retenção do e-mail comercial e dos registros no Resend;
- revisar/assinar o DPA do Resend e documentar regiões, subprocessadores e mecanismo de transferência internacional;
- definir rotina de eliminação dos briefings no e-mail e no painel do Resend;
- configurar rate limiting global no Vercel Firewall ou serviço distribuído se o volume/risco justificar;
- validar o domínio de produção no `SITE_URL` e executar teste completo após o deploy.

Esta documentação é apoio técnico e não substitui revisão jurídica especializada em proteção de dados.

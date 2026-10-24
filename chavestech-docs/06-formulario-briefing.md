# Briefing guiado — especificação

## Objetivo

Inspirar-se no **conceito interativo de configuração** visto na calculadora da Matilab, mas criar experiência e lógica próprias: um formulário por etapas que ajuda a pessoa a explicar o projeto e permite um contato qualificado. **Não fazer calculadora de preço** neste MVP; preço sem critérios reais seria enganoso.

## Layout

À esquerda: texto `O que você quer colocar no mundo?`, uma frase curta e indicação de que é uma conversa inicial. À direita: card principal com opções grandes, rótulo `ETAPA 01 / 04`, barra de progresso e botões Voltar / Continuar. Em mobile uma coluna.

## Fluxo (quatro etapas)

### 01 — Tipo de projeto

Pergunta: `Qual projeto você tem em mente?`

Opções de escolha única:
- Site institucional
- Landing page
- Loja virtual / e-commerce
- Portfólio profissional
- Sistema sob medida
- Ainda não sei

Campo complementar opcional: `Já existe algum site ou sistema?` com URL validada.

### 02 — Objetivo e necessidades

Pergunta: `O que você quer resolver com esse projeto?`

Opções múltiplas: `Apresentar minha marca`, `Receber contatos`, `Vender online`, `Mostrar meu trabalho`, `Organizar processos`, `Outro`.

Campo aberto obrigatório: `Conte um pouco da ideia` (mínimo sugerido 20 caracteres; máximo 2000).

Campo opcional condicional para sistemas: `Que tarefas o sistema precisa facilitar?`.

### 03 — Momento do projeto

Pergunta: `Em que fase sua ideia está?`

Opções: `Só tenho a ideia`, `Já tenho conteúdo e referências`, `Quero melhorar algo existente`, `Preciso substituir um sistema/site`.

Prazo desejado (opcional): `Sem data definida`, `Tenho uma data em mente` (se houver, pedir data). Não prometer cumprimento automático.

Orçamento (opcional, **somente se decidido futuramente**): não coletar na v1.

### 04 — Contato e revisão

Campos: `Nome` (obrigatório); `E-mail` (obrigatório); `WhatsApp` (obrigatório e canal preferencial de retorno, com DDI/DDD); `Empresa ou marca` (opcional).

Resumo editável do que foi respondido; link para voltar a qualquer etapa.

Checkbox de consentimento **não pré-marcado**: `Li a Política de Privacidade e concordo com o uso dos dados para contato sobre minha solicitação.` Link funcional obrigatório quando publicado. Definir fundamento legal e texto adequado com revisão jurídica; não interpretar esse checkbox como autorização para marketing genérico.

Botão: `Enviar meu projeto`.

## Comportamentos e validação

- Progresso avançar somente quando campos obrigatórios válidos.
- Persistir valores somente na memória da página nesta primeira versão; sem gravar PII em `localStorage`.
- Validar no frontend **e** backend; sanitizar saída e impor limite/tamanho de requisição.
- Antispam: honeypot + limite de taxa no servidor; CAPTCHA somente se necessário.
- Backend deve armazenar/transmitir via HTTPS, controlar acessos e evitar registrar dados pessoais em logs desnecessários.
- Consentimento/privacidade alinhados à LGPD; documentar finalidade, retenção e canal de contato.
- Ao enviar: loading, prevenção de duplicidade, mensagem de falha recuperável; sucesso só após confirmação real.
- Após o sucesso confirmado: substituir o formulário por uma confirmação animada, aguardar 3 segundos e restaurar um briefing vazio para novo envio.
- Nenhum envio a terceiros sem configurar e validar destino; `mailto:` não é equivalente a envio concluído.

## Modelo de dados ilustrativo

```json
{
  "tipo_projeto": "sistema",
  "objetivos": ["organizar_processos"],
  "descricao": "Exemplo de necessidade relatada pelo cliente.",
  "fase": "ideia",
  "prazo": "sem_data",
  "nome": "Pessoa de teste",
  "email": "teste@example.com",
  "whatsapp": "+55 11 99999-9999",
  "empresa": null,
  "consentimento_contato": true
}
```

**Exemplo somente para desenvolvimento, não usar como lead real.**

## Critérios de aceite

1. Todas as seis opções de serviço podem ser selecionadas, inclusive `Ainda não sei`.
2. Clique em um serviço na home abre formulário com categoria selecionada.
3. Voltar preserva respostas; navegação funciona por teclado.
4. Erros claros e anunciados a leitores de tela; campos inválidos mantêm foco adequado.
5. Resumo final confere com os campos, permitindo editar.
6. Em celular, campos e botões não estouram a largura.
7. Sem backend configurado, interface informa modo demonstração e não simula recebimento.
8. Com backend real, o sucesso depende da confirmação e os dados seguem a política publicada.

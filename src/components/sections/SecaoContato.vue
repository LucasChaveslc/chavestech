<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { fasesProjeto, opcoesObjetivo, servicosSite, type TipoServico } from '../../content/site'
import { enviarBriefing, ErroEnvioBriefing, type DadosBriefing } from '../../services/briefing'
import { registrarInicioBriefing, registrarLeadGerado } from '../../services/gtm'

const propriedades = defineProps<{ tipoInicial?: TipoServico | '' }>()

const tiposProjeto = [
  { valor: 'site', rotulo: 'Site institucional' },
  { valor: 'landing', rotulo: 'Landing page' },
  { valor: 'ecommerce', rotulo: 'Loja virtual / e-commerce' },
  { valor: 'portfolio', rotulo: 'Portfólio profissional' },
  { valor: 'sistema', rotulo: 'Sistema sob medida' },
  { valor: 'nao-sei', rotulo: 'Ainda não sei' },
] as const

const etapa = ref(1)
const tipo = ref<string>('')
const urlExistente = ref('')
const objetivos = ref<string[]>([])
const descricao = ref('')
const tarefasSistema = ref('')
const fase = ref('')
const prazo = ref('sem-data')
const dataDesejada = ref('')
const nome = ref('')
const email = ref('')
const whatsapp = ref('')
const empresa = ref('')
const consentimentoContato = ref(false)
const enderecoConfirmacao = ref('')
const erro = ref('')
const briefingIniciado = ref(false)
const estadoEnvio = ref<'pronto' | 'enviando' | 'sucesso' | 'erro'>('pronto')
const mensagemEnvio = ref('')
const mensagemEnvioElemento = ref<HTMLElement | null>(null)
const iniciadoEm = Date.now()
const idSolicitacao = ref('')
const assinaturaSolicitacao = ref('')
const leadRegistrado = ref(false)

const progresso = computed(() => `${etapa.value * 25}%`)
const tipoLegivel = computed(() => tiposProjeto.find((item) => item.valor === tipo.value)?.rotulo ?? 'Não informado')

watch(() => propriedades.tipoInicial, (novoTipo) => {
  if (!novoTipo) return
  tipo.value = novoTipo
  etapa.value = 1
  erro.value = ''
})

function focarTitulo() {
  nextTick(() => document.querySelector<HTMLElement>('#titulo-etapa')?.focus())
}

function registrarInicioReal() {
  if (briefingIniciado.value) return

  const tipoServico = servicosSite.find((servico) => servico.id === tipo.value)?.id
  const registrado = registrarInicioBriefing(tipoServico)
  if (registrado) briefingIniciado.value = true
}

function obterTipoServicoSelecionado() {
  return servicosSite.find((servico) => servico.id === tipo.value)?.id
}

function criarIdSolicitacao() {
  return window.crypto.randomUUID()
}

function montarDadosBriefing(): DadosBriefing {
  const conteudo = {
    iniciadoEm,
    enderecoConfirmacao: enderecoConfirmacao.value,
    tipoProjeto: tipo.value,
    urlExistente: urlExistente.value,
    objetivos: [...objetivos.value],
    descricao: descricao.value,
    tarefasSistema: tarefasSistema.value,
    fase: fase.value,
    prazo: prazo.value,
    dataDesejada: dataDesejada.value,
    nome: nome.value,
    email: email.value,
    whatsapp: whatsapp.value,
    empresa: empresa.value,
    consentimentoContato: consentimentoContato.value,
  }
  const assinaturaAtual = JSON.stringify(conteudo)

  if (!idSolicitacao.value || assinaturaSolicitacao.value !== assinaturaAtual) {
    idSolicitacao.value = criarIdSolicitacao()
    assinaturaSolicitacao.value = assinaturaAtual
  }

  return { idSolicitacao: idSolicitacao.value, ...conteudo }
}

async function informarErroEnvio(mensagem: string) {
  estadoEnvio.value = 'erro'
  mensagemEnvio.value = mensagem
  await nextTick()
  mensagemEnvioElemento.value?.focus()
}

async function enviarSolicitacao() {
  if (estadoEnvio.value === 'enviando' || estadoEnvio.value === 'sucesso') return

  erro.value = ''
  mensagemEnvio.value = ''

  if (nome.value.trim().length < 2) {
    await informarErroEnvio('Informe seu nome para enviarmos a solicitação.')
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    await informarErroEnvio('Informe um e-mail válido para podermos responder.')
    return
  }
  if (prazo.value === 'com-data' && !dataDesejada.value) {
    await informarErroEnvio('Informe a data desejada ou selecione “Sem data definida”.')
    return
  }
  if (!consentimentoContato.value) {
    await informarErroEnvio('Confirme a leitura da Política de Privacidade para enviar sua solicitação.')
    return
  }

  registrarInicioReal()
  estadoEnvio.value = 'enviando'

  try {
    await enviarBriefing(montarDadosBriefing())
    estadoEnvio.value = 'sucesso'
    mensagemEnvio.value = 'Solicitação enviada. Vamos responder pelo contato informado.'

    if (!leadRegistrado.value) {
      registrarLeadGerado(obterTipoServicoSelecionado())
      leadRegistrado.value = true
    }

    await nextTick()
    mensagemEnvioElemento.value?.focus()
  } catch (erroEnvio) {
    const mensagem = erroEnvio instanceof ErroEnvioBriefing
      ? erroEnvio.message
      : 'Não foi possível enviar agora. Suas respostas continuam aqui; tente novamente.'
    await informarErroEnvio(mensagem)
  }
}

function continuar() {
  erro.value = ''
  if (etapa.value === 1 && !tipo.value) erro.value = 'Escolha um tipo de projeto para continuar.'
  if (etapa.value === 2 && objetivos.value.length === 0) erro.value = 'Escolha pelo menos um objetivo.'
  if (etapa.value === 2 && descricao.value.trim().length < 20) erro.value = 'Conte um pouco mais da ideia: use pelo menos 20 caracteres.'
  if (etapa.value === 3 && !fase.value) erro.value = 'Escolha o momento atual do projeto.'
  if (erro.value) return
  registrarInicioReal()
  if (etapa.value < 4) etapa.value += 1
  focarTitulo()
}

function voltar() {
  if (etapa.value > 1) etapa.value -= 1
  erro.value = ''
  focarTitulo()
}

function editar(numero: number) {
  etapa.value = numero
  erro.value = ''
  focarTitulo()
}
</script>

<template>
  <section id="contato" class="secao contato" aria-labelledby="titulo-contato">
    <div class="container-site contato__grade">
      <header class="contato__editorial">
        <p><span>06</span> / Vamos construir?</p>
        <h2 id="titulo-contato">Conta sua ideia. A gente encontra o melhor ponto de partida.</h2>
        <p>Responda algumas perguntas rápidas para começarmos uma conversa mais objetiva. Não é um orçamento automático.</p>
        <div class="contato__nota">
          <span aria-hidden="true">●</span>
          <p><strong>Envio protegido</strong>Suas respostas só são consideradas enviadas após a confirmação na tela.</p>
        </div>
      </header>

      <form id="briefing_orcamento" class="briefing" novalidate :aria-busy="estadoEnvio === 'enviando'" @input="registrarInicioReal" @submit.prevent="enviarSolicitacao">
        <div class="briefing__progresso">
          <span>Etapa {{ String(etapa).padStart(2, '0') }} / 04</span>
          <span>{{ etapa * 25 }}%</span>
          <div><i :style="{ width: progresso }" /></div>
        </div>

        <div class="briefing__conteudo">
          <fieldset v-if="etapa === 1">
            <legend id="titulo-etapa" tabindex="-1">Qual projeto você tem em mente?</legend>
            <div class="briefing__opcoes briefing__opcoes--duas">
              <label v-for="item in tiposProjeto" :key="item.valor" :class="{ ativo: tipo === item.valor }">
                <input v-model="tipo" type="radio" name="tipo" :value="item.valor">
                <span>{{ item.rotulo }}</span><i aria-hidden="true" />
              </label>
            </div>
            <label class="campo-texto"><span>Já existe algum site ou sistema? <small>Opcional</small></span><input v-model="urlExistente" name="url_existente" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://seusite.com.br"></label>
          </fieldset>

          <fieldset v-else-if="etapa === 2">
            <legend id="titulo-etapa" tabindex="-1">O que você quer resolver com esse projeto?</legend>
            <div class="briefing__opcoes briefing__opcoes--duas">
              <label v-for="opcao in opcoesObjetivo" :key="opcao" :class="{ ativo: objetivos.includes(opcao) }">
                <input v-model="objetivos" type="checkbox" name="objetivos" :value="opcao">
                <span>{{ opcao }}</span><i aria-hidden="true" />
              </label>
            </div>
            <label class="campo-texto"><span>Conte um pouco da ideia <small>{{ descricao.length }} / 2000</small></span><textarea v-model="descricao" name="descricao" maxlength="2000" rows="5" placeholder="Ex.: preciso apresentar meus serviços e receber contatos…" /></label>
            <label v-if="tipo === 'sistema'" class="campo-texto"><span>Que tarefas o sistema precisa facilitar? <small>Opcional</small></span><textarea v-model="tarefasSistema" name="tarefas_sistema" maxlength="1000" rows="3" /></label>
          </fieldset>

          <fieldset v-else-if="etapa === 3">
            <legend id="titulo-etapa" tabindex="-1">Em que fase sua ideia está?</legend>
            <div class="briefing__opcoes">
              <label v-for="opcao in fasesProjeto" :key="opcao" :class="{ ativo: fase === opcao }">
                <input v-model="fase" type="radio" name="fase" :value="opcao">
                <span>{{ opcao }}</span><i aria-hidden="true" />
              </label>
            </div>
            <div class="briefing__prazo">
              <p>Prazo desejado <small>Opcional</small></p>
              <label><input v-model="prazo" type="radio" name="prazo" value="sem-data"> Sem data definida</label>
              <label><input v-model="prazo" type="radio" name="prazo" value="com-data"> Tenho uma data em mente</label>
              <input v-if="prazo === 'com-data'" v-model="dataDesejada" name="data_desejada" type="date" aria-label="Data desejada">
            </div>
          </fieldset>

          <fieldset v-else>
            <legend id="titulo-etapa" tabindex="-1">Como podemos falar com você?</legend>
            <div class="briefing__campos">
              <label class="campo-texto"><span>Nome</span><input v-model="nome" name="nome" type="text" autocomplete="name"></label>
              <label class="campo-texto"><span>E-mail</span><input v-model="email" name="email" type="email" autocomplete="email" spellcheck="false"></label>
              <label class="campo-texto"><span>WhatsApp <small>Opcional</small></span><input v-model="whatsapp" name="whatsapp" type="tel" autocomplete="tel" placeholder="+55 (00) 00000-0000"></label>
              <label class="campo-texto"><span>Empresa ou marca <small>Opcional</small></span><input v-model="empresa" name="empresa" type="text" autocomplete="organization"></label>
            </div>
            <div class="briefing__resumo">
              <div><span>Projeto</span><strong>{{ tipoLegivel }}</strong><button type="button" @click="editar(1)">Editar</button></div>
              <div><span>Objetivo</span><strong>{{ objetivos.join(', ') || 'Não informado' }}</strong><button type="button" @click="editar(2)">Editar</button></div>
              <div><span>Fase</span><strong>{{ fase || 'Não informada' }}</strong><button type="button" @click="editar(3)">Editar</button></div>
            </div>
            <label class="briefing__consentimento">
              <input v-model="consentimentoContato" name="consentimento_contato" type="checkbox">
              <span>Li a <a href="/politica-de-privacidade.html" target="_blank" rel="noreferrer" @click.stop>Política de Privacidade</a> e concordo com o uso dos dados para contato sobre minha solicitação.</span>
            </label>
            <label class="briefing__armadilha" aria-hidden="true">
              Confirme seu endereço
              <input v-model="enderecoConfirmacao" name="endereco_confirmacao" type="text" tabindex="-1" autocomplete="off">
            </label>
          </fieldset>

          <p v-if="erro" class="briefing__erro" role="alert">{{ erro }}</p>
        </div>

        <div class="briefing__acoes">
          <button v-if="etapa > 1" type="button" class="briefing__voltar" @click="voltar">← Voltar</button>
          <span v-else />
          <button v-if="etapa < 4" type="button" class="briefing__continuar" @click="continuar">Continuar <span aria-hidden="true">→</span></button>
          <button
            v-else
            type="submit"
            class="briefing__continuar"
            :disabled="estadoEnvio === 'enviando' || estadoEnvio === 'sucesso'"
          >
            {{ estadoEnvio === 'enviando' ? 'Enviando…' : estadoEnvio === 'sucesso' ? 'Solicitação enviada' : 'Enviar meu projeto' }}
          </button>
        </div>
        <p
          v-if="mensagemEnvio"
          ref="mensagemEnvioElemento"
          class="briefing__status"
          :class="`briefing__status--${estadoEnvio}`"
          :role="estadoEnvio === 'erro' ? 'alert' : 'status'"
          tabindex="-1"
        >
          {{ mensagemEnvio }}
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contato { background: #111a29; }
.contato__grade { display: grid; grid-template-columns: minmax(18rem, .8fr) minmax(0, 1.2fr); gap: clamp(3rem, 8vw, 8rem); align-items: start; }
.contato__editorial { position: sticky; top: 2rem; }
.contato__editorial > p:first-child { color: var(--cor-marca); font-family: var(--fonte-mono); font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; }
.contato__editorial > p:first-child span { color: var(--cor-texto-discreto); }
.contato__editorial h2 { margin-top: 3rem; font-size: clamp(3rem, 5.5vw, 5.5rem); font-weight: 600; letter-spacing: -.065em; line-height: .93; }
.contato__editorial > p:nth-child(3) { max-width: 34rem; margin-top: 2rem; color: var(--cor-texto-suave); line-height: 1.65; }
.contato__nota { display: flex; gap: .8rem; max-width: 30rem; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--cor-borda); }
.contato__nota > span { color: #e7b35d; font-size: .6rem; }
.contato__nota p { margin: 0; color: var(--cor-texto-discreto); font-size: .8rem; line-height: 1.5; }
.contato__nota strong { display: block; color: var(--cor-texto); }
.briefing { border: 1px solid var(--cor-borda); background: #172235; }
.briefing__progresso { display: grid; grid-template-columns: 1fr auto; gap: 1rem; padding: 1.5rem; color: var(--cor-texto-discreto); font-family: var(--fonte-mono); font-size: .65rem; letter-spacing: .08em; text-transform: uppercase; }
.briefing__progresso > div { grid-column: 1 / -1; height: 2px; background: rgba(255,255,255,.1); }
.briefing__progresso i { display: block; height: 100%; background: var(--cor-marca); transition: width 220ms ease; }
.briefing__conteudo { min-height: 38rem; padding: clamp(1.5rem, 4vw, 3rem); border-block: 1px solid var(--cor-borda); }
.briefing fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
.briefing legend { max-width: 15ch; padding: 0; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 600; letter-spacing: -.055em; line-height: 1; }
.briefing__opcoes { display: grid; gap: .75rem; margin-top: 2.5rem; }
.briefing__opcoes--duas { grid-template-columns: repeat(2, 1fr); }
.briefing__opcoes label { position: relative; display: flex; min-height: 4rem; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; border: 1px solid var(--cor-borda); cursor: pointer; }
.briefing__opcoes label:hover, .briefing__opcoes label.ativo { border-color: var(--cor-marca); background: rgba(91,140,255,.09); }
.briefing__opcoes input { position: absolute; opacity: 0; }
.briefing__opcoes input:focus-visible + span { outline: 3px solid var(--cor-foco); outline-offset: 4px; }
.briefing__opcoes label > i { width: .8rem; height: .8rem; border: 1px solid var(--cor-texto-discreto); border-radius: 50%; }
.briefing__opcoes label.ativo > i { border: 3px solid #172235; background: var(--cor-marca); box-shadow: 0 0 0 1px var(--cor-marca); }
.campo-texto { display: block; margin-top: 2rem; }
.campo-texto > span, .briefing__prazo > p { display: flex; justify-content: space-between; margin-bottom: .65rem; color: var(--cor-texto-suave); font-size: .82rem; }
.campo-texto small, .briefing__prazo small { color: var(--cor-texto-discreto); font-weight: 400; }
.campo-texto input, .campo-texto textarea, .briefing__prazo > input { width: 100%; min-height: 3rem; padding: .8rem 0; border: 0; border-bottom: 1px solid var(--cor-borda); border-radius: 0; background: transparent; color: var(--cor-texto); font: inherit; resize: vertical; }
.campo-texto input::placeholder, .campo-texto textarea::placeholder { color: #7e8a9f; }
.briefing__prazo { display: grid; gap: .8rem; margin-top: 2.5rem; }
.briefing__prazo label { color: var(--cor-texto-suave); }
.briefing__prazo input { accent-color: var(--cor-marca); }
.briefing__campos { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1.25rem; }
.briefing__resumo { margin-top: 2.5rem; border-top: 1px solid var(--cor-borda); }
.briefing__resumo > div { display: grid; grid-template-columns: 5rem 1fr auto; gap: 1rem; align-items: start; padding-block: 1rem; border-bottom: 1px solid var(--cor-borda); font-size: .78rem; }
.briefing__resumo span { color: var(--cor-texto-discreto); font-family: var(--fonte-mono); text-transform: uppercase; }
.briefing__resumo strong { font-weight: 500; }
.briefing__resumo button { color: var(--cor-marca); text-decoration: underline; }
.briefing__consentimento { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .8rem; align-items: start; margin-top: 1.5rem; padding: 1rem; border: 1px solid var(--cor-borda); color: var(--cor-texto-suave); cursor: pointer; font-size: .78rem; line-height: 1.5; }
.briefing__consentimento input { width: 1rem; height: 1rem; margin-top: .1rem; accent-color: var(--cor-marca); }
.briefing__consentimento a { color: var(--cor-texto); text-decoration: underline; text-underline-offset: .18em; }
.briefing__armadilha { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
.briefing__erro { margin-top: 1.5rem; padding: 1rem; font-size: .78rem; line-height: 1.5; }
.briefing__erro { border: 1px solid #f08c8c; color: #ffc2c2; }
.briefing__acoes { display: flex; min-height: 5.5rem; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; }
.briefing__voltar { min-height: 2.75rem; padding-inline: .5rem; color: var(--cor-texto-suave); }
.briefing__continuar { min-height: 3.25rem; padding: .75rem 1.25rem; border-radius: 999px; background: var(--cor-marca); color: #07101f; font-weight: 700; }
.briefing__continuar:not(:disabled):hover { background: #7aa2ff; }
.briefing__voltar:hover, .briefing__resumo button:hover { color: var(--cor-texto); }
.briefing__continuar:disabled { background: #344157; color: #9aa6ba; cursor: not-allowed; }
.briefing__status { margin: 0; padding: 0 1.5rem 1.5rem; color: var(--cor-texto-suave); font-size: .78rem; line-height: 1.5; text-align: right; }
.briefing__status--sucesso { color: var(--cor-sucesso); }
.briefing__status--erro { color: #ffc2c2; }
@media (max-width: 900px) {
  .contato__grade { grid-template-columns: 1fr; }
  .contato__editorial { position: static; }
}
@media (max-width: 560px) {
  .briefing__conteudo { min-height: 0; }
  .briefing__opcoes--duas, .briefing__campos { grid-template-columns: 1fr; }
  .briefing__resumo > div { grid-template-columns: 1fr auto; }
  .briefing__resumo span { grid-column: 1 / -1; }
  .briefing__acoes { align-items: stretch; }
  .briefing__continuar { max-width: 14rem; }
  .briefing__status { text-align: left; }
}
</style>

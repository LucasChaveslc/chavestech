export type TipoServico = 'site' | 'landing' | 'ecommerce' | 'portfolio' | 'sistema'

export const servicosSite: Array<{
  id: TipoServico
  nome: string
  titulo: string
  descricao: string
  cta: string
  icone: 'janela' | 'alvo' | 'loja' | 'pasta' | 'fluxo'
}> = [
  {
    id: 'site',
    nome: 'Site institucional',
    titulo: 'Sua empresa bem apresentada, de ponta a ponta.',
    descricao: 'Uma casa digital para apresentar sua marca, serviços, diferenciais e facilitar o primeiro contato.',
    cta: 'Quero um site',
    icone: 'janela',
  },
  {
    id: 'landing',
    nome: 'Landing page',
    titulo: 'Uma página. Um objetivo claro.',
    descricao: 'Páginas pensadas para comunicar uma oferta e conduzir o visitante até a ação desejada.',
    cta: 'Quero uma landing page',
    icone: 'alvo',
  },
  {
    id: 'ecommerce',
    nome: 'E-commerce',
    titulo: 'Sua loja pronta para ser encontrada e explorada.',
    descricao: 'Catálogo, navegação e jornada de compra organizados para tornar a experiência mais simples.',
    cta: 'Quero uma loja virtual',
    icone: 'loja',
  },
  {
    id: 'portfolio',
    nome: 'Portfólio',
    titulo: 'Seu trabalho fala melhor quando é bem mostrado.',
    descricao: 'Uma vitrine profissional para destacar projetos, especialidades e abrir novas conversas.',
    cta: 'Quero um portfólio',
    icone: 'pasta',
  },
  {
    id: 'sistema',
    nome: 'Sistemas',
    titulo: 'Menos improviso. Mais organização para operar.',
    descricao: 'Ferramentas sob medida para fluxos, cadastros, agendamentos e necessidades específicas.',
    cta: 'Quero um sistema',
    icone: 'fluxo',
  },
]

export const projetosConceituais = [
  {
    id: 'boa-roda',
    nome: 'Oficina Boa Roda',
    categoria: 'Site institucional',
    desafio: 'Organizar os serviços da oficina e tornar o pedido de orçamento mais fácil de encontrar.',
    solucao: 'Uma experiência direta, com serviços bem separados, sinais de confiança e contato em destaque.',
    tema: 'oficina',
  },
  {
    id: 'lar-certo',
    nome: 'Lar Certo Imóveis',
    categoria: 'Experiência imobiliária',
    desafio: 'Apresentar imóveis com clareza sem transformar a busca em uma sequência confusa de informações.',
    solucao: 'Uma vitrine organizada por intenção, com filtros objetivos e detalhes essenciais no momento certo.',
    tema: 'imoveis',
  },
] as const

export const etapasProcesso = [
  { titulo: 'Conversa inicial', texto: 'Você conta o que precisa, qual é o objetivo e o que já existe.' },
  { titulo: 'Escopo e proposta', texto: 'Definimos entregas, limites, prazo estimado e condições antes de começar.' },
  { titulo: 'Estrutura e direção visual', texto: 'Organizamos conteúdo, navegação e referências para validar o caminho.' },
  { titulo: 'Desenvolvimento', texto: 'Transformamos as decisões aprovadas em telas e funcionalidades.' },
  { titulo: 'Revisão e ajustes', texto: 'Testamos fluxos, responsividade e detalhes previstos no escopo.' },
  { titulo: 'Publicação e próximos passos', texto: 'Colocamos no ar e alinhamos documentação, orientações e eventual suporte contratado.' },
] as const

export const diferenciais = [
  { titulo: 'Clareza antes de construir', texto: 'A proposta e as prioridades precisam fazer sentido para você.' },
  { titulo: 'Visual com função', texto: 'Cada escolha de interface deve ajudar alguém a encontrar ou fazer algo.' },
  { titulo: 'Base para evoluir', texto: 'Pensamos na manutenção e nas próximas necessidades desde o começo.' },
] as const

export const opcoesObjetivo = [
  'Apresentar minha marca',
  'Receber contatos',
  'Vender online',
  'Mostrar meu trabalho',
  'Organizar processos',
  'Outro',
] as const

export const fasesProjeto = [
  'Só tenho a ideia',
  'Já tenho conteúdo e referências',
  'Quero melhorar algo existente',
  'Preciso substituir um sistema/site',
] as const

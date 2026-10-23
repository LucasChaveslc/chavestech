# CHAVESTECH

Site institucional one-page da CHAVESTECH.

## Tecnologias

- Vue 3 com Single-File Components e Composition API
- TypeScript
- Vite
- Tailwind CSS integrado pelo plugin oficial do Vite

O MVP é uma aplicação estática: não utiliza banco de dados, roteador ou gerenciamento global de estado.

## Desenvolvimento local

```bash
npm install
npm run dev
```

O terminal informará o endereço local da aplicação.

## Verificação e build

```bash
npm run type-check
npm run build
npm run preview
```

O build de produção é gerado em `dist/`, formato compatível com deploy estático na Vercel.

## Estrutura

```text
src/
├── assets/
│   ├── images/       # imagens e ilustrações locais
│   └── styles/       # entrada global do Tailwind e estilos compartilhados
├── components/
│   ├── base/         # elementos reutilizáveis de interface
│   ├── layout/       # cabeçalho, rodapé e estruturas globais
│   └── sections/     # seções da home one-page
├── composables/          # estado e comportamento reutilizáveis
├── content/              # conteúdo estruturado separado da apresentação
├── types/                # tipos compartilhados
├── App.vue               # composição da página
└── main.ts               # inicialização da aplicação
```

As definições de marca, arquitetura de conteúdo e etapas de implementação estão em `chavestech-docs/`.

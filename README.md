# Petmove

SPA mockup do dashboard do Petmove, uma coleira inteligente para monitoramento de gasto calorico, sono, atividade e outros sinais relevantes do cachorro.

## Stack

- React 19
- Vite 8
- TypeScript
- Recharts
- Lucide React

## Requisitos

- Node.js 20+ recomendado
- npm

## Como rodar o projeto

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador o endereco exibido no terminal.
   Por padrao, o Vite usa:

```text
http://localhost:5173
```

## Scripts disponiveis

### Desenvolvimento

```bash
npm run dev
```

Sobe a aplicacao em modo de desenvolvimento com hot reload.

### Build de producao

```bash
npm run build
```

Gera a versao otimizada na pasta `dist/`.

### Preview local da build

```bash
npm run preview
```

Serve localmente a build de producao para validacao.

### Lint

```bash
npm run lint
```

Executa a verificacao estaticas com ESLint.

## Estrutura principal

- `src/App.tsx`: layout principal da SPA
- `src/components/`: componentes reutilizaveis
- `src/data/mockData.ts`: dados mockados usados no dashboard
- `src/App.css`: estilos da interface
- `src/index.css`: estilos globais e tokens visuais

## Status

O projeto esta em fase de mockup visual, com dados simulados e foco em experiencia de interface.

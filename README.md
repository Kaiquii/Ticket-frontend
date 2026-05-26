# Ticket Front-end

Aplicação Angular para abertura e acompanhamento de tickets/chamados.

## Stack

- Angular 21
- TailwindCSS 4
- HttpClient com interceptor JWT
- Arquitetura por features

## Configuração

A URL da API deve vir do arquivo `.env`:

```env
API_BASE_URL=http://127.0.0.1:8000
```

Antes de `npm start` e `npm run build`, o script `generate:env` lê o `.env` e gera `public/env.js`. A aplicação consome `window.__env.API_BASE_URL`, sem URL fixa no código Angular.

## Executar

```bash
npm install
npm start
```

Acesse:

```text
http://localhost:4200
```

## Funcionalidades

- Cadastro de usuário
- Login com JWT salvo em `localStorage`
- Interceptor adicionando `Authorization: Bearer TOKEN`
- Criar ticket com título, descrição e prioridade
- Listar tickets do usuário logado
- Alterar status: Aberto, Em andamento e Finalizado
- Excluir ticket
- Tratamento visual de erros da API

## Estrutura

```text
src/app/core
src/app/features/auth
src/app/features/tickets
src/environments
```

## Build

```bash
npm run build
```

## Testes

```bash
npm test
```

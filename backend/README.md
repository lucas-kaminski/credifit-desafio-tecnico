# Backend (estrutura atualizada)

Este diretório contém o backend do projeto.

O comando utilizado para inicializar o projeto foi:

```sh
nest new . --package-manager=yarn --skip-git
```

Que gerou um boilerplate com as dependências necessárias para o projeto.

## Estrutura

- `.` - Arquivos de configuração do projeto e suas dependências
- `src/` — Código-fonte principal
- `prisma/` — Arquivos de migração e schema do banco de dados
- `test/` — Testes automatizados

## Comandos principais

- Instalar dependências:
  ```sh
  yarn install
  ```
- Rodar em modo desenvolvimento:
  ```sh
  yarn start:dev
  ```
- Rodar testes:
  ```sh
  yarn test
  ```

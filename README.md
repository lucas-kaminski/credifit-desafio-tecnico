# Wordz

> This is a challenge by [Coodesh](https://coodesh.com/)

Um dicionário de inglês que permite buscar palavras, aprender seu significados, como falar, sinônimos e antônimos, e para as que mais gostar, salvar como favorita!

Para conhecer o projeto, acesse o site [wordz.lucas-kaminski.dev](https://wordz.lucas-kaminski.dev), faça seu cadastro e comece a procurar palavras!

Quando gostar de uma palavra, pode clicar no botão de compartilhar para copiar o link da palavra e compartilhar com amigos!

Feito para como entrega para o desafio técnico da [Coodesh](https://coodesh.com/), para mais informações, acesse o arquivo [original-readme.md](original-readme.md) e saiba a definição inicial e detalhes sobre a proposta.

A branch [`main`](https://github.com/lucas-kaminski/credifit-desafio-tecnico/tree/main) continuará sendo atualizada até ser completado todos os requisitos, caso queira ver exatamente o código que foi entregue junto com o envio do vídeo de apresentação, acesse a branch [`snapshot-entrega-final`](https://github.com/lucas-kaminski/credifit-desafio-tecnico/tree/snapshot-entrega-final). Verifique o [dev log](#log-de-desenvolvimento) para mais detalhes sobre o que foi desenvolvido após a entrega.

## Sumário

- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Instalação e uso](#instalação-e-inicialização-do-projeto)
- [Log de desenvolvimento](#log-de-desenvolvimento)
- [Checklist da entrega](#checklist-da-entrega)
- [Backlog](#backlog)

## Tecnologias utilizadas

Tratando-se de um projeto end to end, optou-se por utilizar tecnologias que tinha um match com a descrição da vaga, além de serem tecnologias que eu utilizo no meu dia a dia em outros projetos em produção.

### Infraestrutura do projeto

- Monorepo com backend e frontend;
- Docker orquestrado pelo docker compose para containerização dos serviços utilizados no projeto;
- Workflows de Continuous Integration com Github Actions;
- Workflow de Continuous Deployment com Github Actions e actions apontadas para uma VPS pessoal, com Nginx previamente instalado e configurado como reverse proxy junto com a ferramente Certbot para administração de certificados SSL. Permite que o projeto seja acessado através de um domínio personalizado, o [wordz.lucas-kaminski.dev](https://wordz.lucas-kaminski.dev) para o frontend e o [backend-wordz.lucas-kaminski.dev](https://backend-wordz.lucas-kaminski.dev) para o backend.

### Banco de dados

- PostgreSQL para armazenamento primário dos dados;
- Redis para cache das requisições.

### Frontend

- Typescript;
- Next.js;
- React;
- Chakra UI.

### Backend

- TypeScript;
- Node.js;
- NestJS;
- Prisma ORM;
- Axios;
- JWT + Bcrypt + Passport;
- Class-transformer + class-validator;
- Jest.

### Qualidade de código

- ESLint;
- Prettier;
- Husky.

## Instalação e inicialização do projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado e configurado na sua máquina:

- [Git](https://git-scm.com/downloads);
- [Node.js LTS](https://nodejs.org/en/about/previous-releases);
- [Yarn](https://yarnpkg.com/getting-started);
- [Docker](https://hub.docker.com/welcome);

### Configuração do projeto

Os comandos abaixo são instruções para execução em ambiente Linux, caso queira executar em outro sistema operacional, algumas configurações podem variar.

1. Clone o repositório

```sh
cd ~
git clone https://github.com/lucas-kaminski/credifit-desafio-tecnico.git
```

2. Instale as dependências do backend

```sh
cd credifit-desafio-tecnico/backend
yarn install
```

3. Copie o arquivo `.env.template` para `.env` e configure as variáveis de ambiente

```sh
cp .env.template .env
```

4. Instancie o banco de dados

```sh
cd credifit-desafio-tecnico/backend
docker compose up -d db
```

5. Alimente o banco de dados com a wordList

```sh
cd credifit-desafio-tecnico/backend
yarn seed:database
```

6. Inicie o servidor

```sh
cd credifit-desafio-tecnico/backend
yarn start:dev
```

7. Instale as dependências do frontend

```sh
cd credifit-desafio-tecnico/frontend
yarn install
```

8. Inicie o servidor

```sh
cd credifit-desafio-tecnico/frontend
yarn dev
```

9. Acesse a aplicação no navegador no endereço `http://localhost:3000`

10. Faça seu cadastro e comece a usar!

## Log de desenvolvimento

Aqui está um relatório de todo o processo de desenvolvimento do projeto, desde a abertura do desafio até a entrega final, com as tarefas e decisões técnicas que foram tomadas durante a execução do desafio.

Toda vez que é citado uma task, é referente ao [backlog](#backlog) e a sua definição.

### 12/05/2025

- Fiz a abertura do desafio pelo link recebido no e-mail. Fiz a leitura do desafio, enviei um e-mail para o recrutador perguntando se estaria em tempo hábil para realizar o desafio. Recebo o retorno positivo e organizo-me para começar o desafio a noite.
- Faço o fork do repositório, configuro como público e clono para minha máquina.
- Reli o README.md e durante o processo fiz o [checklist de entrega](#checklist-da-entrega)
- Iniciei o [dev log](#log-de-desenvolvimento)
- Iniciei o [backlog](#backlog)
- Criei a branch `develop` e defini o padrão de branches
- Deixei para amanhã para verificar os critérios de qualidade para o desenvolvimento e criar o TASK-1 que seria a configuração inicial do projeto

### 15/05/2025

- Finalizei a task-0 anteriormente definida, que seria a definição do backlog
- Iniciei e finalizei a task-1, configurando o projeto monorepo no geral
- Iniciei a task-2, configurando o projeto backend e suas ferramentas, executei até a definição completa do banco de dados e sua primeira migração
- Com o banco estruturado, iniciei a task-4, focando em criar o script para importar a wordList para o banco de dados, gerando para mim uma massa de dados para trabalhar conforme fosse implementando os endpoints
- Finalizei o script da task-4 e retomo para a task-3, implementando os endpoints de autenticação e listagem de palavras já cadastradas no banco de dados

### 16/05/2025

- Continuei e finalizei a task-3, implementando todos os endpoints restantes e seus testes unitários, toda a lógica de negócio foi implementada junto com seus testes unitários, garantindo que o código está funcionando conforme o esperado e, futuras mudanças que viessem a ser necessárias, não quebrariam o código de forma inesperada
- Dockerizei o backend pela task-4 e validei toda configuração do projeto criado até aqui, rodando tudo localmente e tendo certeza de que tudo está funcionando conforme o esperado
- Iniciei e finalizei a task-5, configurando o projeto frontend e suas ferramentas, configuração de variáveis de ambiente, configuração de ESLint, Prettier e Husky
- Iniciei e finalizei a task-6, implementando quase todas as funcionalidades do frontend e deixando a maioria das telas funcionando conforme o esperado, faltando apenas implementações secundárias, o core do projeto já está funcional a essa parte, permitindo que eu possa testar em ambiente de produção
- Estruturei toda configuração e adaptei minha VPS pessoal para o deploy do projeto, criando as urls [wordz.lucas-kaminski.dev](wordz.lucas-kaminski.dev) para o deploy do frontend e [backend-wordz.lucas-kaminski.dev](backend-wordz.lucas-kaminski.dev) para o deploy do backend
- Finalizei a task-7, realizando o deploy do projeto no servidor, configurando o nginx como reverse proxy e habilitando o SSL com certbot
- Retomei algumas melhorias que passaram na TASK-6, como implementação do scroll infinito e adição de um parâmetro de busca na URL.
- Finalizei a task-8, atualizando o README.md com as informações de ENTREGA do projeto. A esta altura, o projeto está funcionando conforme o esperado e está apto para ser entregue. Porém, ainda faltam algumas melhorias secundárias apontadas que não foram implementadas, sendo elas:
  - Backend:
    - Documentação da API com OpenAPI 3.0
    - Cache de requisições à Free Dictionary API
    - Cache de requisições entre o backend e o frontend
    - Paginação por cursores com mudança da estrutura de retorno para o padrão de cursores
  - Frontend:
    - SSR
    - PWA
    - Unit ou E2E tests
- Como falta pouco tempo para a entrega (menos de 12 horas), é necessário eu decidir o que vou priorizar para entrega e o que vou deixar como não priorizado.
- Realizei a entrega do projeto, enviando o link do repositório e realizando a gravação do vídeo de apresentação do projeto.

### 18/05/2025

- Durante o fim de semana, apresentei o projeto para amigos e familiares, recebendo feedbacks e sugestões de melhorias. Com eles, resolvi continuar o projeto tanto para implementar as melhorias que já tenho experiência quanto aprender algumas que não tenho tanto.
- Criei o snapshot da entrega final do projeto, que é o código que foi entregue junto com o vídeo de apresentação.
- Atualizei o README.md com as informações de entrega e próximos passos.
- Refiz o backlog com o que faltava para ser implementado e atualizei o README.md com o backlog atualizado.

## Checklist da entrega

O checklist abaixo é uma lista de todos os itens que abstrai como demanda de desenvolvimento a partir da definição original do desafio. Me serviu como base para definir o backlog e as tasks, além de ser uma lista de reverificação durante o desenvolvimento para garantir que tudo que foi requisitado, será implementado. Conforme o desenvolvimento, eu vou marcando os itens como concluídos e mantendo o checklist atualizado.

### Antes de começar

- [x] Fork público do repositório
- [x] Usar as linguagens definidas na vaga
- [x] Deadline de 5 dias
- [x] Documentar processo de investigação e desenvolvimento da atividade.

### Instruções iniciais (Frontend)

- [x] Com ou sem framework
- [x] Estilização
- [x] CSS Flex-box e Grid
- [x] Design mobile first
- [x] Gestão de dados
- [x] Conceitos de programação funcional em JS
- [x] Atenção para usabilidade
- [x] Adequar a interface com elementos visuais

### Instruções iniciais (Backend)

- [x] Uma API
- [x] Banco de dados

### Organização

- [x] Separar código backend do frontend
- [x] Clean code
- [x] Validação de chamadas assíncronas para evitar tratamento

### Backend

- [x] Validar todos casos de uso
  - [x] Capacidade de login
  - [x] Visualizar lista de palavras
  - [x] Guardar histórico de palavras visualizadas
  - [x] Visualizar histórico de palavras guardadas
  - [x] Guardar palavra como favorita
  - [x] Apagar uma palavra favorita
  - [x] Proxy para a API Free Dictionary
- [x] Implementar todas as rotas
  - [x] GET "/"
  - [x] POST "/auth/signup"
  - [x] POST "/auth/signin"
  - [x] GET "/entries/en"
  - [x] GET "/entries/en/:word"
  - [x] POST "/entries/en/:word/favorite"
  - [x] DELETE "/entries/en/:word/unfavorite"
  - [x] GET "/user/me"
  - [x] GET "/user/me/history"
  - [x] GET "/user/me/favorites"
- [x] Script para alimentar o banco de dados
- [ ] Documentação da API no OpenAPI 3.0
- [x] Unit tests para os endpoints da API
- [x] Docker no projeto
- [x] Deploy em algum servidor
- [ ] Paginação por cursores com retorno padrão
- [ ] Cache o resultado das requisições com headers específicos na resposta

### Frontend

- [x] Atender os casos de uso
  - [x] Capacidade de login
  - [x] Lista de palavras com rolagem infinita
  - [x] Visualizar uma palavra, significado e fonética
  - [x] Salvar como favorito
  - [x] Remover palavra como favorito
  - [x] Lista de palavras vista anteriormente
- [x] Seguir o wireframe definido
- [ ] Unit ou E2E tests
- [x] Docker
- [x] URL com params de busca
- [ ] SSR
- [ ] PWA

### Entrega final

- [x] Título do projeto
- [x] Descrição em frase
- [x] Lista de ferramentas utilizadas
- [x] Como instalar e usar o projeto
- [x] Não esquecer do .gitignore
- [x] Colocar referência do challenge

## Backlog

Esse é o backlog do projeto, onde eu defini as tasks e o que foi desenvolvido.

Optei pela nomenclatura TASK-X para as tasks, onde X é o número da task na ordem da esteira de desenvolvimento, sendo uma alusão aos diversos sistemas de gerenciamento de projeto que existem, como o Jira ou Linear.

Normalmente é utilizado o identificador da TASK como referência para o desenvolvimento, sendo o nome da branch a ser desenvolvida o mesmo nome da task, realizando PRs para a branch `develop` (concentra todo o código desenvolvido até o momento) e, após a aprovação do PR, realizando o merge da branch `develop` para a branch `main` conforme o patch de atualização do projeto fosse liberado (código entra em produção).

Pode variar o fluxo do desenvolvimento, como ter uma branch anterior para testes e homologação com cliente antes de realizar o deploy, porém o citado acima acredito ser adequado para o desafio.

### TASK-0: Entendimento do desafio

- [x] Fork e clone do repositório [Repositório no github](https://github.com/lucas-kaminski/credifit-desafio-tecnico)
- [x] Definição das tecnologias da vaga e alinhamento com o desafio
  - Tecnologias citadas na vaga
    - React
    - Nest
    - TypeScript
    - SQL -> PostgresSQL
    - Docker/Kubernetes
    - CI/CD
    - Mensageria (Kafka, SNS/SQS) e microserviços.
  - Escolhas INICIAIS para o desafio
    - Para o frontend:
      - TypeScript, React com NextJS para PWA/SSR
      - As outras instruções iniciais eu prefiro adaptar conforme desenvolvimento do desafio
    - Para o backend:
      - TypeScript, NodeJS com NestJS para API Rest
    - Para o banco de dados
      - SQL, PostgreSQL com Prisma ORM
      - NoSQL, Redis com Redis-OM
    - Reforçando que uma diretriz inicial, pode ser adaptada conforme o desenvolvimento do desafio
- [x] Oficializar um padrão de documentação "Dev Log" para a entrega
- [x] Iniciar o git workflow
  - branch `main` para o código final
  - branch `develop` para o código em desenvolvimento
  - branch `TASK-X` para os blocos de tarefas
- [x] Definir critérios de qualidade para o desenvolvimento
- [x] Estudar a documentação da API Free Dictionary
- [x] Definir as tasks

### TASK-1: Setup Inicial

- [x] Configurar a estrutura de pastas
- [x] Configurar o .gitignore

### TASK-2: Configuração do backend

- [x] Inicializar projeto backend com NestJS
- [x] Configurar ESLint, Prettier e Husky
- [x] Configurar conexão com banco de dados (PostgreSQL via Prisma)
- [x] Configurar variáveis de ambiente (.env)
- [x] Docker PostgresSQL
- [x] Criar entidades e models
  - [x] User
  - [x] Word
  - [x] Favorite
  - [x] History

### TASK-3: Endpoints

- [x] Implementar endpoint GET "/"
  - [x] Teste unitário
- [x] Implementar tratamento de erros (200, 204, 400)
  - [x] Teste unitário
- [x] Implementar endpoint POST "/auth/signup"
  - [x] Teste unitário
- [x] Implementar endpoint POST "/auth/signin"
  - [x] Teste unitário
- [x] Implementar middleware de JWT
- [x] Implementar endpoint GET "/entries/en" (paginação, busca)
  - [x] Teste unitário
- [x] Implementar endpoint GET "/entries/en/:word" (registra histórico)
  - [x] Teste unitário
- [x] Implementar endpoint POST "/entries/en/:word/favorite"
  - [x] Teste unitário
- [x] Implementar endpoint DELETE "/entries/en/:word/unfavorite"
  - [x] Teste unitário
- [x] Implementar endpoint GET "/user/me"
  - [x] Teste unitário
- [x] Implementar endpoint GET "/user/me/history" (paginação)
  - [x] Teste unitário
- [x] Implementar endpoint GET "/user/me/favorites" (paginação)
  - [x] Teste unitário

### TASK-4: Melhorias do backend

- [x] Implementar script para importar wordList para o banco
- [x] Escrever testes unitários para todos endpoints
- [x] Dockerizar backend
- [x] Preparar backend para deploy

### TASK-5: Configuração do frontend

- [x] Inicializar projeto frontend com Next.js (React + TypeScript)
- [x] Configurar ESLint, Prettier e Husky
- [x] Configurar variáveis de ambiente (.env)

### TASK-6: Funcionalidades do frontend

- [x] Implementar tela de login
- [x] Implementar tela de listagem de palavras
- [x] Implementar tela de visualização de palavra
- [x] Implementar funcionalidade de favoritar/desfavoritar palavra
- [x] Implementar tela de histórico de palavras visualizadas
- [x] Implementar design mobile first
- [x] Implementar estilização com CSS Flexbox e Grid
- [x] Implementar usabilidade e acessibilidade
- [x] Implementar URL com parâmetros de busca
- [x] Dockerizar frontend
- [x] Preparar frontend para deploy

### TASK-7: DevOps

- [x] Criar arquivos Dockerfile e docker-compose.yml
- [x] Realizar deploy do backend
- [x] Realizar deploy do frontend

### TASK-8: Documentação e Entrega

- [x] Atualizar README com título, descrição, tecnologias, instruções de uso
- [x] Adicionar referência ao challenge by Coodesh
- [x] Documentar decisões técnicas e critérios de qualidade
- [x] Checklist final de entrega

### TASK-9: Melhorias do backend pt.2

- [ ] Implementar cache de requisições à Free Dictionary API
- [ ] Adicionar headers x-cache e x-response-time nas respostas
- [ ] Implementar paginação por cursores
- [ ] Documentar API com OpenAPI 3.0

### TASK-10: Melhorias do frontend pt.2

- [ ] Implementar SSR
- [ ] Implementar PWA
- [ ] Escrever testes unitários ou E2E

### TASK-11: Melhorias de feedbacks

- [x] Botão de copiar link da palavra
- [x] Logo na tela de login e cadastro
- [x] Arrumar mensagens em inglês para português
- [x] Botão de recuperar senha com alert dizendo que está em construção (fora do escopo do desafio)
- [x] Menus da coluna em inglês, trocar para português
- [x] Label de procurar palavra em inglês, trocar para português
- [x] Colocar um informativo dizendo que são palavras importadas de um arquivo e que nem todas terão seu significado na API Free Dictionary
- [x] Melhorar erro de mensagem não encontrada, trocar botão "voltar" para "sair"
- [ ] No histórico só aparecer palavras que tiveram significado na API Free Dictionary

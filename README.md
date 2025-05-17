# Entrega do desafio "Fullstack Challenge - Dictionary" by Coodesh

## Log de desenvolvimento

### 12/05/2025

Tarde (+-15m)

- Fiz a abertura do desafio pelo link recebido no e-mail. Fiz a leitura do desafio, enviei um e-mail para o recrutador perguntando se estaria em tempo hábil para realizar o desafio. Recebo o retorno positivo e organizo-me para começar o desafio a noite.
- Faço o fork do repositório, configuro como público e clono para minha máquina.

Noite (+-1h 30m)

- Reli o README.md e durante o processo fiz o [checklist de entrega](#checklist-da-entrega)
- Iniciei o [dev log](#log-de-desenvolvimento)
- Iniciei o [backlog](#backlog)
- Criei a branch `develop` e defini o padrão de branches
- Deixei para amanhã para verificar os critérios de qualidade para o desenvolvimento e criar o TASK-1 que seria a configuração inicial do projeto

### 15/05/2025

- Finalizei a task-0, completando backlog
- Iniciei e finalizei a task-1, configurando o projeto monorepo no geral
- Iniciei a task-2, configurando o projeto backend e suas ferramentas, executei até a definição completa do banco de dados e sua primeira migração
- Com o banco estruturado, iniciei a task-4, focando em criar o script para importar a wordList para o banco de dados
- Finalizei o script da task-4 e retomo para a task-3, implementando os endpoints de autenticação e listagem de palavras

### 16/05/2025

- Continuei e finalizei a task-3, implementando todos os endpoints restantes e seus testes unitários
- Dockerizei o backend pela task-4 e validei toda configuração do projeto criado até aqui
- Finalizei a task-5, configurando o projeto frontend e suas ferramentas
- Finalizei a task-6, implementando todas as funcionalidades do frontend
-

## Checklist da entrega

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
- [ ] Validação de chamadas assíncronas para evitar tratamento

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
- [ ] Deploy em algum servidor
- [ ] Paginação por cursores com retorno padrão
- [ ] Cache o resultado das requisições com headers específicos na resposta

### Frontend

- [x] Atender os casos de uso
  - [x] Capacidade de login
  - [ ] Lista de palavras com rolagem infinita
  - [x] Visualizar uma palavra, significado e fonética
  - [x] Salvar como favorito
  - [x] Remover palavra como favorito
  - [x] Lista de palavras vista anteriormente
- [x] Seguir o wireframe definido
- [ ] Unit ou E2E tests
- [x] Docker
- [ ] URL com params de busca
- [ ] SSR
- [ ] PWA

### Entrega final

- [ ] Título do projeto
- [ ] Descrição em frase
- [ ] Lista de ferramentas utilizadas
- [ ] Como instalar e usar o projeto
- [ ] Não esquecer do .gitignore
- [ ] Colocar referência do challenge

## Backlog

### TASK-0: Entendimento do desafio

- [x] Fork e clone do repositório [Repositório no github](https://github.com/lucas-kaminski/credifit-desafio-tecnico)
- [x] Definição das tecnologias da vaga e alinhamento
      com o desafio
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
      - As outras instruções iniciais eu prefiro
        adaptar conforme desenvolvimento do desafio
    - Para o backend:
      - TypeScript, NodeJS com NestJS para API Rest
    - Para o banco de dados
      - SQL, PostgreSQL com Prisma ORM
      - NoSQL, MongoDB com Mongoose
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
- [ ] Implementar cache de requisições à Free Dictionary API
- [ ] Adicionar headers x-cache e x-response-time nas respostas
- [ ] Implementar paginação por cursores
- [x] Escrever testes unitários para todos endpoints
- [ ] Documentar API com OpenAPI 3.0
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
- [ ] Implementar URL com parâmetros de busca
- [ ] Implementar SSR (Server Side Rendering)
- [ ] Implementar PWA
- [ ] Escrever testes unitários ou E2E
- [x] Dockerizar frontend
- [x] Preparar frontend para deploy

### TASK-7: DevOps

- [x] Criar arquivos Dockerfile e docker-compose.yml
- [x] Realizar deploy do backend
- [x] Realizar deploy do frontend

### TASK-8: Documentação e Entrega

- [ ] Atualizar README com título, descrição, tecnologias, instruções de uso
- [ ] Adicionar referência ao challenge by Coodesh
- [ ] Documentar decisões técnicas e critérios de qualidade
- [ ] Checklist final de entrega

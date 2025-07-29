# UniMonitor Esporte

Este é um PWA (Progressive Web App) responsivo para a gestão e divulgação de atividades esportivas universitárias. Para fins de teste e simplicidade, este projeto utiliza um sistema de login simulado que lê os dados diretamente do Firestore.

O projeto foi construído com Next.js, TypeScript e Tailwind CSS, e utiliza o Firebase como banco de dados (Firestore).

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos para Execução](#passos-para-execução)
- [Como Testar a Aplicação](#como-testar-a-aplicação)
  - [Acesso Público (Estudante)](#acesso-público-estudante)
  - [Acesso Restrito (Perfis com Login)](#acesso-restrito-perfis-com-login)
  - [Credenciais de Teste](#credenciais-de-teste)

## Tecnologias Utilizadas

- **Frontend:** Next.js, React, TypeScript
- **Estilização:** Tailwind CSS, ShadCN UI
- **Backend & Banco de Dados:** Firebase (Firestore)
- **Validação de Formulários:** Zod, React Hook Form

## Funcionalidades

- **Visualização Pública:** Qualquer visitante pode ver as atividades aprovadas e os avisos.
- **Painel do Monitor:** Monitores podem se logar para cadastrar, editar e remover suas atividades e avisos. As atividades submetidas ficam com status "PENDENTE" até serem aprovadas.
- **Painel do Administrador:** Administradores podem aprovar ou reprovar as atividades pendentes e gerenciar os monitores do sistema.

## Como Executar o Projeto

### Pré-requisitos

- Node.js e npm (ou um gerenciador de pacotes compatível).
- Um projeto Firebase configurado com as credenciais presentes em `src/lib/firebase.ts`.

### Passos para Execução

1.  **Configure as Regras do Firestore:**
    - Acesse o [Console do Firebase](https://console.firebase.google.com/).
    - Navegue até a seção **Firestore Database** e vá para a aba **Regras**.
    - Altere as regras para permitir leitura e escrita para desenvolvimento. **Atenção: não use estas regras em produção.**
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if true;
        }
      }
    }
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em [http://localhost:9002](http://localhost:9002). Na primeira vez que a aplicação for executada com o banco de dados vazio, ele será automaticamente populado com dados de teste.

## Como Testar a Aplicação

A aplicação possui um script que popula o banco de dados Firestore com dados de teste na primeira execução (se a coleção `users` estiver vazia).

### Acesso Público (Estudante)

-   Acesse a página inicial ([http://localhost:9002](http://localhost:9002)) para visualizar as atividades aprovadas e os avisos.
-   Use o filtro para ver atividades de modalidades específicas.

### Acesso Restrito (Perfis com Login)

Acesse a página de login em [http://localhost:9002/login](http://localhost:9002/login).

### Credenciais de Teste

A senha para todos os usuários de teste é **`123`**.

#### 🧑‍🏫 Monitor

-   **E-mail:** `carlos.p@unimonitor.com`
-   **E-mail:** `ana.s@unimonitor.com`
-   **Redireciona para:** `/monitor/dashboard`
-   **O que testar:** Cadastrar, editar e remover atividades e avisos.

#### ✅ Administrador

-   **E-mail:** `admin@unimonitor.com`
-   **Redireciona para:** `/admin/dashboard`
-   **O que testar:** Aprovar e reprovar atividades pendentes.

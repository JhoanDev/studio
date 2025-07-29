# UniMonitor Esporte

Este é um PWA (Progressive Web App) responsivo para a gestão e divulgação de atividades esportivas universitárias.

O projeto foi construído com Next.js, TypeScript e Tailwind CSS, e utiliza o Firebase como backend para autenticação e banco de dados (Firestore).

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Como Executar o Projeto](#como-executar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Passos para Execução](#passos-para-execução)
- [Como Testar a Aplicação](#como-testar-a-aplicação)
  - [Acesso Público (Estudante)](#acesso-público-estudante)
  - [Acesso Restrito (Perfis com Login)](#acesso-restrito-perfis-com-login)

## Tecnologias Utilizadas

- **Frontend:** Next.js, React, TypeScript
- **Estilização:** Tailwind CSS, ShadCN UI
- **Backend & Banco de Dados:** Firebase (Authentication e Firestore)
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

1.  **Configure o Firebase Authentication:**
    - Acesse o [Console do Firebase](https://console.firebase.google.com/).
    - Navegue até a seção **Authentication** e ative o provedor **"E-mail/senha"**.
    - Crie os usuários de teste (veja a seção "Como Testar" abaixo).

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em [http://localhost:9002](http://localhost:9002).

## Como Testar a Aplicação

A aplicação possui um script que popula o banco de dados Firestore com dados de teste na primeira execução (se a coleção `users` estiver vazia). Para o login funcionar, você **precisa criar os seguintes usuários no Firebase Authentication** com as senhas de sua preferência.

### Acesso Público (Estudante)

-   Acesse a página inicial ([http://localhost:9002](http://localhost:9002)) para visualizar as atividades aprovadas e os avisos.
-   Use o filtro para ver atividades de modalidades específicas.

### Acesso Restrito (Perfis com Login)

Acesse a página de login em [http://localhost:9002/login](http://localhost:9002/login).

#### 🧑‍🏫 Monitor

-   **E-mail:** `carlos.p@unimonitor.com` | **Senha:** (a que você definiu no Firebase)
-   **E-mail:** `ana.s@unimonitor.com` | **Senha:** (a que você definiu no Firebase)
-   **Redireciona para:** `/monitor/dashboard`
-   **O que testar:** Cadastrar, editar e remover atividades e avisos.

#### ✅ Administrador

-   **E-mail:** `admin@unimonitor.com` | **Senha:** (a que você definiu no Firebase)
-   **Redireciona para:** `/admin/dashboard`
-   **O que testar:** Aprovar e reprovar atividades pendentes.

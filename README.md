# UniMonitor Esporte

## 🚀 Sobre o Projeto

O **UniMonitor Esporte** é um Progressive Web App (PWA) responsivo desenvolvido para a gestão e divulgação de atividades esportivas em um ambiente universitário. A plataforma centraliza o cronograma de atividades, permitindo que estudantes visualizem os horários e que monitores e administradores gerenciem o conteúdo de forma eficiente.

Para fins de demonstração e para simplificar a avaliação em um contexto acadêmico, o projeto utiliza um sistema de login simulado que autentica os usuários diretamente com base nos dados armazenados no **Firebase Firestore**, contornando o setup do Firebase Authentication.

---

## ✨ Funcionalidades Principais

-   **Painel Público:** Visitantes e estudantes podem visualizar o cronograma de atividades aprovadas e os avisos gerais. Um filtro por modalidade permite encontrar rapidamente as atividades desejadas.
-   **Painel do Monitor:** Monitores podem se autenticar para gerenciar suas próprias atividades e avisos.
    -   Cadastrar, editar e remover atividades (que ficam com status "PENDENTE" até a aprovação).
    -   Publicar, editar e remover avisos para suas modalidades.
-   **Painel do Administrador:** Administradores possuem uma visão geral do sistema.
    -   Aprovar ou reprovar atividades submetidas pelos monitores.
    -   Gerenciar os monitores cadastrados no sistema.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna focada em performance e produtividade:

-   **Frontend:** [Next.js](https://nextjs.org/) (com App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Banco de Dados:** [Firebase](https://firebase.google.com/) (usando exclusivamente o **Firestore** para dados e login simulado)
-   **Validação de Formulários:** [Zod](https://zod.dev/), [React Hook Form](https://react-hook-form.com/)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados:
-   [Node.js](https://nodejs.org/en) (versão 18 ou superior)
-   npm ou um gerenciador de pacotes compatível (Yarn, pnpm)

### Passos para Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/unimonitor-esporte.git
    cd unimonitor-esporte
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure o Firebase:**
    -   Crie um novo projeto no [Console do Firebase](https://console.firebase.google.com/).
    -   No seu projeto, vá para a seção **Firestore Database** e crie um banco de dados.
    -   Na aba **Regras** do Firestore, altere as regras para permitir leitura e escrita para desenvolvimento. **Atenção: não use estas regras em produção.**
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
    -   Copie as credenciais do seu projeto Firebase (encontradas em *Configurações do projeto > Geral > Seus aplicativos > SDK do Firebase*) e cole-as no arquivo `src/lib/firebase.ts`.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:9002`.

    Na primeira vez que a aplicação for executada com o banco de dados vazio, ela será automaticamente populada com dados de teste.

---

## 🧪 Como Testar a Aplicação

A aplicação possui três perfis de acesso. Para testar o login, utilize as credenciais abaixo na página `http://localhost:9002/login`.

**Senha padrão para todos os usuários:** `123`

### 👨‍🎓 Acesso Público (Estudante)

-   **Como acessar:** Basta abrir a página inicial (`http://localhost:9002`).
-   **O que testar:** Visualizar a lista de atividades aprovadas e os avisos. Utilizar o filtro para selecionar modalidades específicas e ver a atualização da lista em tempo real.

### 🧑‍🏫 Acesso do Monitor

-   **Credenciais:**
    -   E-mail: `carlos.p@unimonitor.com` | Senha: `123`
    -   E-mail: `ana.s@unimonitor.com` | Senha: `123`
-   **Redireciona para:** `/monitor/dashboard`
-   **O que testar:**
    -   Cadastrar uma nova atividade (ela deve aparecer na lista com status "PENDENTE").
    -   Tentar editar uma atividade aprovada (o botão deve estar desabilitado).
    -   Remover uma atividade.
    -   Publicar, editar e remover um aviso.

### ✅ Acesso do Administrador

-   **Credenciais:**
    -   E-mail: `admin@unimonitor.com` | Senha: `123`
-   **Redireciona para:** `/admin/dashboard`
-   **O que testar:**
    -   Na aba "Aprovar Atividades", visualizar a atividade pendente criada pelo monitor.
    -   Aprovar a atividade (ela deve desaparecer da lista de pendentes e aparecer na página inicial).
    -   Reprovar uma atividade.
    -   Navegar para a aba "Gerenciar Monitores" para ver a lista de monitores.

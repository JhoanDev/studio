# UniMonitor Esporte

## 🚀 Sobre o Projeto

O **UniMonitor Esporte** é um Progressive Web App (PWA) responsivo, projetado para otimizar a gestão e divulgação de atividades esportivas em um ambiente universitário. A plataforma centraliza o cronograma de atividades, permitindo que estudantes consultem os horários e que monitores e administradores gerenciem o conteúdo de forma eficiente e intuitiva.

Para fins de demonstração e para simplificar a avaliação em um contexto acadêmico, o projeto utiliza um sistema de login simulado. A autenticação é feita comparando os dados inseridos com os registros de usuários armazenados diretamente no **Firebase Firestore**, contornando a complexidade de setup do Firebase Authentication.

---

## ✨ Funcionalidades Principais

A aplicação é dividida em três níveis de acesso, cada um com funcionalidades específicas.

### 1. Painel Público (Acesso de Estudante)
Qualquer visitante pode acessar a página inicial para visualizar informações gerais.
-   **Visualização de Cronograma:** Lista de todas as atividades esportivas com status "APROVADO".
-   **Visualização de Avisos:** Acesso a todos os avisos publicados pelos monitores.
-   **Filtro por Modalidade:** Ferramenta que permite filtrar tanto as atividades quanto os avisos por uma modalidade esportiva específica, atualizando a visualização em tempo real.

### 2. Painel do Monitor (Requer Login)
Monitores autenticados têm acesso a um painel para gerenciar suas próprias publicações.
-   **Gerenciamento de Atividades:**
    -   Cadastrar novas atividades, que entram no sistema com status "PENDENTE".
    -   Editar atividades pendentes ou reprovadas para reenviá-las para aprovação.
    -   Remover atividades.
    -   Atividades já aprovadas não podem ser editadas para garantir a consistência do cronograma.
-   **Gerenciamento de Avisos:**
    -   Publicar novos avisos associados às suas modalidades.
    -   Editar ou remover avisos existentes.

### 3. Painel do Administrador (Requer Login)
Administradores possuem uma visão geral do sistema e permissões para moderar o conteúdo.
-   **Moderação de Atividades:**
    -   Aprovar ou reprovar as atividades submetidas pelos monitores.
    -   As atividades aprovadas tornam-se visíveis no painel público.
-   **Gerenciamento de Monitores:**
    -   Visualizar a lista de todos os monitores cadastrados no sistema.
    -   Funcionalidades de adicionar, editar e remover monitores (placeholders na UI).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna focada em performance, escalabilidade e produtividade no desenvolvimento:

-   **Framework:** [Next.js](https://nextjs.org/) (com App Router)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Biblioteca de UI:** [React](https://react.dev/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes UI:** [ShadCN UI](https://ui.shadcn.com/)
-   **Backend & Banco de Dados:** [Firebase](https://firebase.google.com/) (usando exclusivamente o **Firestore** para dados e simulação de login)
-   **Validação de Formulários:** [Zod](https://zod.dev/) e [React Hook Form](https://react-hook-form.com/)

---

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente de desenvolvimento.

### Pré-requisitos
-   [Node.js](https://nodejs.org/en) (versão 18 ou superior)
-   `npm` ou um gerenciador de pacotes compatível (Yarn, pnpm)

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
    -   Na seção **Firestore Database**, crie um novo banco de dados.
    -   Vá para a aba **Regras** do Firestore e configure as regras de segurança para permitir leitura e escrita em modo de desenvolvimento.
        > **Atenção:** Estas regras são inseguras e não devem ser usadas em produção.
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
    -   Vá para **Configurações do projeto > Geral** e, na seção "Seus aplicativos", copie o objeto de configuração do Firebase para aplicativos da Web.
    -   Cole essa configuração no arquivo `src/lib/firebase.ts`, substituindo o objeto `firebaseConfig` existente.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em `http://localhost:9002`. Na primeira vez que for executada com o banco de dados vazio, a aplicação será automaticamente populada com dados de teste (usuários, atividades e avisos).

---

## 🧪 Como Testar a Aplicação

A aplicação possui três perfis de acesso. Para testar o login, utilize as credenciais abaixo na página de login.

**Senha padrão para todos os usuários de teste:** `123`

### 👨‍🎓 Acesso Público (Estudante)

-   **Como acessar:** Basta abrir a página inicial (`http://localhost:9002`).
-   **O que testar:**
    -   Visualizar a lista de atividades aprovadas e os avisos gerais.
    -   Utilizar o filtro para selecionar modalidades específicas e observar a atualização da lista em tempo real.

### 🧑‍🏫 Acesso do Monitor

-   **Credenciais:**
    -   E-mail: `carlos.p@unimonitor.com` | Senha: `123`
    -   E-mail: `ana.s@unimonitor.com` | Senha: `123`
-   **Redireciona para:** `/monitor/dashboard`
-   **O que testar:**
    -   Cadastrar uma nova atividade e verificar se ela aparece na lista com o status "PENDENTE".
    -   Tentar editar uma atividade aprovada (o botão "Editar" deve estar desabilitado).
    -   Editar uma atividade pendente.
    -   Remover uma atividade.
    -   Publicar, editar e remover um aviso.

### ✅ Acesso do Administrador

-   **Credenciais:**
    -   E-mail: `admin@unimonitor.com` | Senha: `123`
-   **Redireciona para:** `/admin/dashboard`
-   **O que testar:**
    -   Na aba "Aprovar Atividades", visualizar a atividade pendente criada pelo monitor.
    -   Aprovar a atividade (ela deve desaparecer da lista de pendentes e aparecer na página inicial).
    -   Reprovar uma atividade (ela deve permanecer na lista do monitor com status "REPROVADO").
    -   Navegar para a aba "Gerenciar Monitores" para ver a lista de monitores cadastrados.

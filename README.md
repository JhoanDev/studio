# UniMonitor Esporte

Este é um PWA responsivo para a gestão e divulgação de atividades esportivas universitárias, construído com Next.js, TypeScript e Tailwind CSS.

## Como Executar o Projeto

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação estará disponível em [http://localhost:9002](http://localhost:9002).

## Como Testar

A aplicação possui três perfis de usuário: Estudante (acesso público), Monitor e Administrador (ambos com login).

### Acesso Público (Estudante)

*   Acesse a página inicial ([http://localhost:9002](http://localhost:9002)) para visualizar as atividades aprovadas e os avisos.

### Acesso Restrito (Login)

*   Acesse a página de login em [http://localhost:9002/login](http://localhost:9002/login).
*   Use as credenciais abaixo para testar os diferentes perfis. (A senha pode ser qualquer valor para fins de demonstração).

#### 🧑‍🏫 Monitor

*   **Usuário:** `carlos`
*   **Senha:** (qualquer)
*   **Redireciona para:** `/monitor/dashboard`

*   **Usuário:** `ana`
*   **Senha:** (qualquer)
*   **Redireciona para:** `/monitor/dashboard`

#### ✅ Administrador

*   **Usuário:** `admin`
*   **Senha:** (qualquer)
*   **Redireciona para:** `/admin/dashboard`

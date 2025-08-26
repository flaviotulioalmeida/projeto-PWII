# Gemini Chat UI

Uma interface de chatbot moderna e elegante, desenvolvida com a API Gemini. Apresenta respostas em tempo real, uma UI com tema escuro e funcionalidades de Progressive Web App (PWA) para acesso offline.

## Funcionalidades

- **Streaming em Tempo Real:** Receba respostas da API Gemini à medida que são geradas.
- **Gerenciamento de Workspaces:** Organize suas conversas em diferentes espaços de trabalho (ex: "Pessoal", "Projetos de Trabalho").
- **Histórico de Conversas:** Todas as conversas são salvas automaticamente no armazenamento local do seu navegador.
- **Pronto para PWA:** Pode ser instalado como um Progressive Web App para uma experiência semelhante a um aplicativo nativo e acesso offline à interface.
- **Busca de Chats:** Encontre conversas antigas rapidamente dentro de um workspace.
- **Seleção de Modelo:** Escolha qual modelo Gemini usar para suas conversas através do painel de configurações.
- **UI Moderna:** Uma interface limpa, responsiva e com tema escuro, construída com Tailwind CSS.

## Tecnologias Utilizadas

- **Framework:** React
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **IA:** Google Gemini API (`@google/genai`)
- **Carregamento de Módulos:** ES Modules via `importmap`

## Pré-requisitos

Antes de começar, garanta que você tenha o seguinte instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior é recomendada)
- [npm](https://www.npmjs.com/) (ou yarn/pnpm)

## Como Rodar a Aplicação

Siga estes passos para executar a aplicação na sua máquina local.

### 1. Clone o Repositório

Primeiro, clone este repositório para a sua máquina:
```bash
git clone https://github.com/flaviotulioalmeida/projeto-PWII
cd projeto-PWII
```

### 2. Instale as Dependências

Instale as dependências necessárias do projeto:
```bash
npm i
```

### 3. Configure as Variáveis de Ambiente

Você precisará de uma chave de API do Google Gemini para usar esta aplicação.

1.  Crie um novo arquivo chamado `.env.local` na raiz do projeto.
2.  Adicione sua chave de API a este arquivo:

    ```env
    GEMINI_API_KEY=SUA_CHAVE_DE_API_GEMINI_AQUI
    ```

    Substitua `SUA_CHAVE_DE_API_GEMINI_AQUI` pela sua chave real. O `process.env.API_KEY` no código irá carregar esta variável automaticamente em ambientes de desenvolvimento que suportam arquivos `.env`.

### 4. Execute o Servidor de Desenvolvimento

Para iniciar a aplicação em modo de desenvolvimento, execute:
```bash
npm run dev
```

Isso iniciará um servidor de desenvolvimento (como o Vite, por exemplo). Você poderá visualizar a aplicação acessando o endereço indicado no seu terminal (geralmente `http://localhost:5173`) no seu navegador.

---

Agora você está pronto para conversar com a API Gemini!


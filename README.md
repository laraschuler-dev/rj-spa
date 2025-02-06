# RJ-SPA

🚀 **Redefinindo Jornadas - Frontend**

Este repositório contém o frontend do projeto **Redefinindo Jornadas**, uma plataforma solidária para a reintegração de **pessoas em situação de rua**. A aplicação foi desenvolvida como uma SPA (Single Page Application) utilizando **React, TypeScript e TailwindCSS**, garantindo uma experiência rápida e responsiva.

## 🛠 Tecnologias Utilizadas

- **React** (com Vite)
- **TypeScript**
- **TailwindCSS**
- **React Router DOM** (para navegação)
- **Zustand** (para gerenciamento de estado)
- **Axios** (para consumo da API backend)
- **ESLint & Prettier** (para padronização do código)

## 📦 Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/laraschuler-dev/rj-spa.git
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd rj-spa
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env` na raiz do projeto e adicione as credenciais necessárias, como a URL da API backend.

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

6. **Acesse a aplicação:**
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 🌍 Estrutura do Projeto

```
📂 rj-spa
├── 📂 src
│   ├── 📂 components  # Componentes reutilizáveis
│   ├── 📂 pages       # Páginas da aplicação
│   ├── 📂 services    # Conexão com a API
│   ├── 📂 hooks       # Hooks customizados
│   ├── 📂 store       # Gerenciamento de estado
│   ├── 📂 styles      # Estilização global e Tailwind
│   ├── App.tsx       # Componente raiz
│   ├── main.tsx      # Ponto de entrada da aplicação
├── .gitignore
├── .gitattributes
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔗 Conectando ao Backend

Este frontend se comunica com a API do projeto **Redefinindo Jornadas**, que pode ser encontrada [aqui](https://github.com/candidodev/rj-api). Certifique-se de que o backend esteja rodando para testar todas as funcionalidades corretamente.

## 📌 Funcionalidades Principais

✅ Cadastro e login de usuários (ONGs, voluntários, assistidos e administração)  
✅ Listagem e busca de serviços assistenciais  
✅ Publicação e gerenciamento de eventos sociais  
✅ Conexão entre voluntários e ONGs  
✅ Interface responsiva e acessível  

## 🤝 Contribuição

1. **Crie uma branch para sua feature:**
   ```bash
   git checkout -b feature/minha-feature
   ```
2. **Implemente as mudanças e faça o commit:**
   ```bash
   git commit -m "feat: Descrição da feature"
   ```
3. **Envie as alterações para o repositório remoto:**
   ```bash
   git push origin feature/minha-feature
   ```
4. **Abra um Pull Request no GitHub.**

---

💙 Desenvolvido por [Lara Schüler](https://github.com/laraschuler-dev)


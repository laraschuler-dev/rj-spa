# RJ-SPA

🚀 **Redefinindo Jornadas - Frontend**

Este repositório contém o frontend do projeto **Redefinindo Jornadas**, uma plataforma solidária para a reintegração de **pessoas em situação de rua**. A aplicação está sendo desenvolvida como uma SPA (Single Page Application) utilizando **React, TypeScript e TailwindCSS**, garantindo uma experiência rápida e responsiva.

---

## Índice

1. [Introdução](#1-introdução)
   - [Propósito](#11-propósito)
   - [Escopo](#12-escopo)
   - [Justificativa](#13-justificativa)
2. [Descrição do Problema](#2-descrição-do-problema)
3. [Objetivos](#3-objetivos)
4. [Funcionalidades Principais](#4-funcionalidades-principais)
5. [Tecnologias Utilizadas](#5-tecnologias-utilizadas)
6. [Metodologia](#6-metodologia)
7. [Ferramentas Utilizadas](#7-ferramentas-utilizadas)
8. [Restrições](#8-restrições)
9. [Suposições](#9-suposições)
10. [Dependências](#10-dependências)
11. [Como Contribuir](#11-como-contribuir)
12. [Instalação e Execução](#12-instalação-e-execução)
13. [Licença](#13-licença)

---

## 1. Introdução

### 1.1 Propósito

A Rede Social Solidária **Redefinindo Jornadas** tem como objetivo conectar entidades públicas, privadas e voluntários para facilitar o acesso de **pessoas em situação de rua** a serviços assistenciais e oportunidades de reintegração social. A plataforma busca transformar práticas assistencialistas em ações que promovam inclusão e emancipação desses indivíduos.

### 1.2 Escopo

A plataforma permitirá a articulação de ações sociais por meio de entidades e voluntários, oferecendo recursos para organização de eventos, compartilhamento de experiências, recebimento de doações e disponibilização de oportunidades de socialização.

### 1.3 Justificativa

O aumento da população em situação de rua exige ações efetivas e coordenadas entre diferentes agentes da sociedade. A falta de acesso a meios digitais por essa população torna essencial a intermediação de instituições e voluntários para garantir o acesso a serviços assistenciais e oportunidades de reinserção social.

---

## 2. Descrição do Problema

A população em situação de rua enfrenta dificuldades para acessar serviços assistenciais, educação, saúde e oportunidades de reinserção social. Além disso, não há uma plataforma centralizada para organizar e facilitar as iniciativas da sociedade voltadas a essa causa.

---

## 3. Objetivos

- Cadastrar e avaliar indivíduos em situação de rua para um direcionamento mais eficaz a serviços assistenciais.
- Facilitar a conexão entre entidades públicas, privadas e voluntários para articular iniciativas de apoio.
- Disponibilizar um ambiente digital para organização de eventos, campanhas de doação e compartilhamento de experiências.

---

## 4. Funcionalidades Principais

✅ Cadastro e login de usuários (ONGs, voluntários, assistidos e administração)  
✅ Listagem e busca de serviços assistenciais  
✅ Publicação e gerenciamento de eventos sociais  
✅ Conexão entre voluntários e ONGs  
✅ Interface responsiva e acessível

---

## 5. Tecnologias Utilizadas

- **React** (com Vite)
- **TypeScript**
- **TailwindCSS**
- **React Router DOM** (para navegação)
- **Zustand** (para gerenciamento de estado)
- **Axios** (para consumo da API backend)
- **ESLint & Prettier** (para padronização do código)

---

## 6. Metodologia

O desenvolvimento deste projeto segue a metodologia **Kanban**, garantindo um fluxo de trabalho adaptável. O gerenciamento é feito via **Notion**.

---

## 7. Ferramentas Utilizadas

- **Desenvolvimento:** VSCode, GitHub
- **Backend:** Postman, Swagger
- **Frontend:** React Developer Tools, TailwindCSS

---

## 8. Restrições

- O projeto deve utilizar apenas tecnologias de código aberto.
- Deve garantir a segurança e privacidade dos usuários.

---

## 9. Suposições

- A adesão de entidades públicas, privadas e voluntários será suficiente para garantir a oferta de serviços.

---

## 10. Dependências

- Backend rodando corretamente para funcionamento do frontend.

---

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

## 11. Licença

Este projeto está licenciado sob a GNU License.

💙 Desenvolvido por [Lara Schüler](https://github.com/laraschuler-dev)

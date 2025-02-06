// src/pages/Home.tsx

/**
 * Home Page - Página inicial do projeto Redefinindo Jornadas.
 * Esta página contém informações sobre o propósito da plataforma
 * e exibe um layout simples com um cabeçalho, conteúdo principal e rodapé.
 *
 * Responsividade está garantida usando classes utilitárias do TailwindCSS.
 */
import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      {/* Cabeçalho */}
      <header className="p-4 bg-blue-600">
        <h1 className="text-3xl text-center">
          Bem-vindo ao Redefinindo Jornadas
        </h1>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 flex items-center justify-center text-center">
        <div>
          <h2 className="text-2xl mb-4">O que fazemos</h2>
          <p className="text-lg mb-4">
            Nosso objetivo é ajudar pessoas em situação de rua a encontrar
            serviços assistenciais e oportunidades de reintegração social.
          </p>

          <p className="text-lg">
            Fique à vontade para explorar nossa plataforma e aprender mais sobre
            como podemos ajudar.
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="p-4 bg-blue-600 text-center">
        <p>&copy; 2025 Redefinindo Jornadas. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;

import React from 'react';
import Header from './Header';
import HeaderFeed from './HeaderFeed';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Propriedades do componente Layout
 *
 * @property {React.ReactNode} children - Os componentes filhos que serão renderizados dentro do layout.
 */
interface LayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'feed';
}

/**
 * Componente Layout
 *
 * Este componente representa a estrutura de layout principal do aplicativo, incluindo o cabeçalho,
 * a barra lateral, o conteúdo principal e o rodapé.
 *
 * @param {LayoutProps} props - As propriedades do componente.
 * @returns {JSX.Element} O layout principal do aplicativo.
 */
const Layout: React.FC<LayoutProps> = ({ children, variant = 'default' }) => {
  const isFeed = variant === 'feed';

  return (
    <div className="flex flex-col min-h-screen bg-background text-gray-800">
      {isFeed ? <HeaderFeed /> : <Header />}

      {/* compensação do header fixo com pt-20 (~80px) */}
      <div className="flex flex-grow">
        <Sidebar isFeed={isFeed} />
        <main
          className={`flex-1 pt-20 px-4 md:px-8 pb-8 ${
            variant === 'feed' ? 'max-w-4xl mx-auto' : 'lg:px-12'
          } overflow-auto`}
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;

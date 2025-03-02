import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Propriedades do componente Layout
 *
 * @property {React.ReactNode} children - Os componentes filhos que serão renderizados dentro do layout.
 */
interface LayoutProps {
  children: React.ReactNode;
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
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

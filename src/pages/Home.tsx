import React from 'react';
import Layout from '../components/layout/Layout';
import Introduction from '../components/Introduction';
import AboutUs from '../components/AboutUs';
import Events from '../components/Events';
import Services from '../components/Services';
import HowToDonate from '../components/HowToDonate';
import Contact from '../components/Contact';

/**
 * Componente Home
 *
 * Este componente representa a página inicial do aplicativo "Redefinindo Jornadas".
 * Ele utiliza o componente Layout para estruturar a página e inclui elementos de tipografia
 * e um botão de ação.
 *
 * @returns {JSX.Element} A página inicial do aplicativo.
 */
const Home: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <Introduction />
        <AboutUs />
        <Events />
        <Services />
        <HowToDonate />
        <Contact />
      </div>
    </Layout>
  );
};

export default Home;

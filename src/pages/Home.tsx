import React from "react";
import Layout from "../components/layout/Layout";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import Introduction from "../components/Introduction";

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
      </div>
    </Layout>
  );
};


export default Home;
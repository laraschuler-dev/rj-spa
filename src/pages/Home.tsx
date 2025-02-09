import React from "react";
import Layout from "../components/layout/Layout";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";

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
      <div className="flex flex-col items-center justify-center text-center p-8 space-y-6 max-w-3xl mx-auto">
        {/* Título principal */}
        <Typography variant="h1">Bem-vindo ao Redefinindo Jornadas</Typography>

        {/* Descrição */}
        <Typography variant="p">
          Nossa missão é conectar pessoas em situação de rua a oportunidades e
          serviços assistenciais. Acreditamos que todos merecem dignidade, apoio
          e novas chances para recomeçar.
        </Typography>

        <Typography variant="p">
          Navegue pela plataforma, descubra formas de ajudar ou encontre o suporte
          necessário. Juntos, podemos transformar vidas.
        </Typography>

        {/* Botão de ação */}
        <Button variant="primary">Saiba Mais</Button>
      </div>
    </Layout>
  );
};

export default Home;
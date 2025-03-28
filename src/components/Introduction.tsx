import { motion } from 'framer-motion';
import Button from './ui/Button';
import Typography from './ui/Typography';

const Introduction = () => {
  return (
    <section
      id="introduction"
      className="relative h-screen flex flex-col justify-start pt-24 text-center px-6 md:px-12 lg:px-24 mb-6 mt-16"
    >
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0 bg-[url('/img/intro-bg.jpg')] bg-cover bg-center brightness-50"></div>

      {/* Conteúdo da introdução */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-white"
      >
        <Typography variant="h1" className="text-3xl md:text-5xl font-bold">
          Bem-vindo ao <br /> Redefinindo Jornadas
        </Typography>
        <Typography
          variant="p"
          className="mt-4 text-base md:text-lg max-w-2xl mx-auto"
        >
          Nossa missão é conectar pessoas em situação de rua a oportunidades e
          serviços assistenciais. Acreditamos que todos merecem dignidade, apoio
          e novas chances para recomeçar.
        </Typography>
        <Typography
          variant="p"
          className="mt-4 text-base md:text-lg max-w-2xl mx-auto"
        >
          Navegue pela plataforma, descubra formas de ajudar ou encontre o
          suporte necessário. Juntos, podemos transformar vidas.
        </Typography>
        {/* Botão de Ação */}
        <div className="mt-8 text-center">
          <Button variant="primary">Saiba mais</Button>
        </div>
      </motion.div>
    </section>
  );
};

export default Introduction;

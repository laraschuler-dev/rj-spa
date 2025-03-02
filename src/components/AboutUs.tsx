import { motion } from 'framer-motion';
import Typography from './ui/Typography';
import Button from './ui/Button';

const AboutUs = () => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-24 pt-20 pb-20 mb-6"
    >
      {/* Imagem de fundo com overlay */}
      <div className="absolute inset-0 bg-[url('/img/about.jpg')] bg-cover bg-center brightness-50"></div>

      {/* Conteúdo da seção */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-white"
      >
        {/* Título e Descrição */}
        <Typography variant="h1" className="text-3xl md:text-5xl font-bold">
          Quem Somos
        </Typography>
        <Typography
          variant="p"
          className="mt-4 text-base md:text-lg max-w-2xl mx-auto"
        >
          Somos uma rede social solidária que conecta pessoas em situação de rua
          a serviços assistenciais e oportunidades de reintegração social.
          Acreditamos que dignidade, inclusão e acolhimento são essenciais para
          transformar vidas.
        </Typography>

        {/* Seções Missão, Visão e Valores */}
        <div className="mt-8 space-y-4">
          <div className="bg-primary text-white p-4 rounded-xl shadow-md min-h-[120px] md:min-h-0 flex flex-col justify-center">
            <Typography variant="h2" className="font-bold text-lg">
              Nossa Missão
            </Typography>
            <Typography variant="p">
              Conectar pessoas em situação de rua a serviços assistenciais e
              oportunidades para reintegração social.
            </Typography>
          </div>
          <div className="bg-primary text-white p-4 rounded-xl shadow-md min-h-[120px] md:min-h-0 flex flex-col justify-center">
            <Typography variant="h2" className="font-bold text-lg">
              Nossa Visão
            </Typography>
            <Typography variant="p">
              Criar um ambiente digital que transforme assistencialismo em
              inclusão e emancipação.
            </Typography>
          </div>
          <div className="bg-primary text-white p-4 rounded-xl shadow-md min-h-[120px] md:min-h-0 flex flex-col justify-center">
            <Typography variant="h2" className="font-bold text-lg">
              Nossos Valores
            </Typography>
            <Typography variant="p">
              Empatia, dignidade e acesso igualitário a oportunidades.
            </Typography>
          </div>
        </div>

        {/* Botão de Ação */}
        <div className="mt-8 text-center">
          <Button
            variant="primary"
            className="mt-16 text-lg font-semibold shadow-md"
          >
            Junte-se a Nós
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;

import { motion } from 'framer-motion';

const HowToDonate = () => {
  return (
    <section
      id="donate"
      className="relative py-16 px-6 md:px-12 lg:px-24 text-center"
    >
      {/* Imagem de fundo cobrindo toda a seção */}
      <div className="absolute inset-0 w-full h-full bg-[url('/img/doacao.jpg')] bg-cover bg-center brightness-50"></div>

      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Conteúdo da seção "Como Doar" */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-white max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-bold">
          Faça a Diferença! Contribua com Nossa Causa
        </h2>
        <p className="mt-4 text-base md:text-lg max-w-2xl mx-auto">
          Sua doação ajuda a transformar vidas, oferecendo suporte essencial
          para quem mais precisa. Escolha a melhor forma de contribuir e faça
          parte dessa rede de solidariedade!
        </p>
      </motion.div>

      {/* Espaçamento extra antes do card */}
      <div className="mt-16"></div>

      {/* Container do card e botão (fora da imagem de fundo) */}
      <div className="relative z-20 mt-16">
        {/* Card com fundo translúcido */}
        <div className="max-w-sm mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white text-center">
            Doe Agora via Pix
          </h3>
          <div className="mt-4 flex justify-center">
            <img
              src="/img/qrcode.png"
              alt="QR Code Pix"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="mt-4 text-center text-white">
            Aponte sua câmera para o QR Code e faça uma doação via Pix.
          </p>
        </div>

        {/* Botão para outras opções */}
        <div className="mt-8 text-center">
          <button className="bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-primary-dark transition">
            Outras Opções
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowToDonate;

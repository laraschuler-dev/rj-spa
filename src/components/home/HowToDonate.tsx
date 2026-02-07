import { motion } from 'framer-motion';
import Typography from '../ui/Typography';
import Button from '../ui/Button';
import { toast } from 'react-toastify';

const HowToDonate = () => {
  const handleOtherOptionsClick = () => {
    toast.info(
      'No momento, estamos focados no desenvolvimento da plataforma e buscando parcerias com entidades especializadas em PSR. Outras opções de doação estarão disponíveis em breve!',
      {
        position: 'top-center',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          minWidth: '400px',
          maxWidth: '90vw',
          fontSize: '16px',
          padding: '16px',
        },
      }
    );
  };

  return (
    <section
      id="donate"
      className="relative pt-32 pb-48 md:pb-56 lg:pb-64 px-6 md:px-12 lg:px-24 text-center"
    >
      <div className="absolute inset-0 w-full h-full bg-[url('/img/doacao-1.png')] bg-cover bg-center"></div>

      <div className="absolute inset-0 bg-black/50"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-white max-w-3xl mx-auto"
      >
        <Typography variant="h1" className="text-3xl md:text-5xl font-bold">
          Faça a Diferença! Contribua com Nossa Causa
        </Typography>
        <Typography
          variant="p"
          className="mt-4 text-base md:text-lg max-w-2xl mx-auto"
        >
          Sua doação ajuda a transformar vidas, oferecendo suporte essencial
          para quem mais precisa. Escolha a melhor forma de contribuir e faça
          parte dessa rede de solidariedade!
        </Typography>
      </motion.div>

      <div className="mt-16"></div>

      <div className="relative z-20 mt-16">
        <div className="max-w-sm mx-auto bg-white/20 backdrop-blur-md border border-white/30 rounded-lg shadow-lg p-6">
          <Typography
            variant="h3"
            className="text-xl font-semibold text-white text-center"
          >
            Doe Agora via Pix
          </Typography>

          <div className="mt-2 mb-3">
            <Typography
              variant="p"
              className="text-xs text-white/80 text-center italic"
            >
              *QR Code ilustrativo - Em desenvolvimento
            </Typography>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src="/img/qrcode.png"
              alt="QR Code Pix"
              className="w-48 h-48 object-contain"
            />
          </div>
          <Typography variant="p" className="mt-4 text-center text-white">
            Aponte sua câmera para o QR Code e faça uma doação via Pix.
          </Typography>

          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <Typography
              variant="p"
              className="text-xs text-white/90 text-center"
            >
              Estamos em fase de MVP e buscando parcerias com entidades
              especializadas em PSR para garantir total transparência no
              direcionamento de recursos.
            </Typography>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button variant="primary" onClick={handleOtherOptionsClick}>
            Outras Opções
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowToDonate;

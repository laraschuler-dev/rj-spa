import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-16 px-6 md:px-12 lg:px-24 text-center">
      {/* Título e descrição */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
          Entre em Contato
        </h2>
        <p className="mt-4 text-base md:text-lg text-gray-600">
          Fale conosco! Estamos aqui para esclarecer dúvidas, receber sugestões
          e conectar você a nossa rede social solidária.
        </p>
      </motion.div>

      {/* Formulário de Contato */}
      <div className="mt-12 max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 border">
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Seu Nome"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <input
            type="email"
            placeholder="Seu E-mail"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
          <textarea
            placeholder="Sua Mensagem"
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          ></textarea>
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition">
            Enviar Mensagem
          </button>
        </form>
      </div>

      {/* Informações de Contato */}
      <div className="mt-12 text-gray-700">
        <div className="flex items-center justify-center gap-4">
          <FaEnvelope className="text-xl text-primary" />
          <p className="text-lg">redefinindojornadas@gmail.com</p>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <FaMapMarkerAlt className="text-xl text-primary" />
          <p className="text-lg">Taquara, RS - Brasil</p>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="mt-8 flex justify-center gap-6">
        <a href="#" className="text-primary hover:text-primary-dark transition">
          <FaFacebook size={30} />
        </a>
        <a href="#" className="text-primary hover:text-primary-dark transition">
          <FaInstagram size={30} />
        </a>
        <a href="#" className="text-primary hover:text-primary-dark transition">
          <FaLinkedin size={30} />
        </a>
      </div>
    </section>
  );
};

export default Contact;

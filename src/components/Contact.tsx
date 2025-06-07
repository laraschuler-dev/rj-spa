import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import Typography from './ui/Typography';
import SubmitButton from './ui/SubmitButton';
import { toast } from 'react-toastify';
import axios from '../config/axiosConfig';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('/contact', formData);
      toast.success('Mensagem enviada com sucesso!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error: any) {
      const msg =
        error.response?.data?.error ||
        'Erro ao enviar mensagem. Tente novamente mais tarde.';
      toast.error(msg);
    }
  };

  return (
    <section id="contact" className="py-16 px-6 md:px-12 lg:px-24 text-center">
      {/* Título e descrição */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto"
      >
        <Typography
          variant="h1"
          className="text-3xl md:text-5xl font-bold text-primary"
        >
          Entre em Contato
        </Typography>
        <Typography
          variant="p"
          className="mt-4 text-base md:text-lg text-gray-600"
        >
          Fale conosco! Estamos aqui para esclarecer dúvidas, receber sugestões
          e conectar você a nossa rede social solidária.
        </Typography>
      </motion.div>

      {/* Formulário de Contato */}
      <div className="mt-12 max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 border">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu Nome"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Seu E-mail"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Sua Mensagem"
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
          <SubmitButton>Enviar Mensagem</SubmitButton>
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

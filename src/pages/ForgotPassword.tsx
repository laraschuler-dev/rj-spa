import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import SubmitButton from '../components/ui/SubmitButton';
import api from '../config/axiosConfig';
import { toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Envia o e-mail para o backend
      await api.post('/auth/forgot', { email });
      toast.success(
        'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.'
      );
    } catch (err: any) {
      if (err.response && err.response.data) {
        const backendMessage =
          err.response.data.error || 'Erro ao solicitar recuperação de senha';
        toast.error(backendMessage);
      } else if (err.request) {
        toast.error(
          'Não foi possível conectar ao servidor. Verifique sua conexão.'
        );
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Título */}
        <Typography variant="h2" className="text-primary text-center mb-6">
          Esqueci minha senha
        </Typography>
        <Typography
          variant="p"
          className="text-sm text-gray-600 text-center mb-6"
        >
          Insira seu e-mail para receber o link de redefinição de senha.
        </Typography>

        {/* Formulário de Recuperação */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          {/* Botão de Enviar */}
          <SubmitButton>Enviar</SubmitButton>
        </form>

        {/* Link para voltar ao login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Lembrou sua senha?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default ForgotPassword;

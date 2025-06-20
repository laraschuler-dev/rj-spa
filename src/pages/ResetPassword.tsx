import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import SubmitButton from '../components/ui/SubmitButton';
import api from '../services/api';
import { toast } from 'react-toastify';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Captura o token da URL
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token de redefinição inválido ou ausente.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      // Envia o token e a nova senha para o backend
      await api.post('/auth/reset', { token, newPassword });
      toast.success(
        'Senha redefinida com sucesso! Faça login com sua nova senha.'
      );
      navigate('/login'); // Redireciona para a tela de login
    } catch (err: any) {
      if (err.response && err.response.data) {
        const backendMessage =
          err.response.data.error || 'Erro ao redefinir a senha';
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
          Redefinir Senha
        </Typography>
        <Typography
          variant="p"
          className="text-sm text-gray-600 text-center mb-6"
        >
          Insira sua nova senha nos campos abaixo.
        </Typography>

        {/* Formulário de Redefinição */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="new-password"
              className="block mb-1 text-sm font-medium"
            >
              Nova Senha
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite sua nova senha"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-1 text-sm font-medium"
            >
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirme sua nova senha"
              required
            />
          </div>

          {/* Botão de Redefinir */}
          <SubmitButton>Redefinir Senha</SubmitButton>
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

export default ResetPassword;

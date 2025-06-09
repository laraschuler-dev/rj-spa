import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import { FcGoogle } from 'react-icons/fc';
import SubmitButton from '../components/ui/SubmitButton';
import { FaFacebook } from 'react-icons/fa';
import api from '../config/axiosConfig';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
  });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/feed';

  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, from, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    try {
      const response = await api.post('/auth/session', formData);
      toast.success('Login realizado com sucesso!');
      setToken(response.data.token); // Salva no Zustand
      localStorage.setItem('token', response.data.token);
      //navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Verifica se a mensagem de erro está presente no backend
        const backendMessage =
          err.response.data.error || 'Erro ao realizar login';
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
          Bem-vindo de volta
        </Typography>

        {/* Formulário de Login */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="emailOrPhone"
              className="block mb-1 text-sm font-medium"
            >
              E-mail ou Telefone
            </label>
            <input
              type="text"
              id="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="exemplo@email.com ou (99) 99999-9999"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Link para "Esqueci minha senha" */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-primary font-medium hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Botão de Entrar */}
          <SubmitButton>Entrar</SubmitButton>
        </form>

        {/* Divisor */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Ou entre com</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center max-w-md">
          {/* Botão de login com Facebook */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FaFacebook size={22} className="text-[#1877F2]" />
            <span className="font-medium">Entrar com Facebook</span>
          </button>

          {/* Botão de login com Google */}
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
            <FcGoogle size={22} />
            <span className="font-medium">Entrar com Google</span>
          </button>
        </div>

        {/* Link para cadastro */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Ainda não tem uma conta?{' '}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import SubmitButton from '../components/ui/SubmitButton';
import api from '../config/axiosConfig';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/auth/users', formData); // Envia os dados para o backend
      toast.success('Conta criada com sucesso! Redirecionando para o login...');
      navigate('/login'); // Redireciona para a página de login após o sucesso
    } catch (err: any) {
      if (err.response) {
        // Exibe a mensagem de erro retornada pelo backend
        const backendMessage =
          err.response.data.message || 'Erro ao criar conta';
        toast.error(backendMessage);
      } else if (err.request) {
        // Erro relacionado à requisição (ex.: sem resposta do servidor)
        toast.error(
          'Não foi possível conectar ao servidor. Verifique sua conexão.'
        );
      } else {
        // Erro desconhecido
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Título */}
        <Typography variant="h2" className="text-primary text-center mb-6">
          Criar Conta
        </Typography>
        <Typography
          variant="p"
          className="text-sm text-gray-600 text-center mb-6"
        >
          Junte-se à Rede Solidária e comece a fazer a diferença.
        </Typography>

        {/* Formulário de Registro */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(99) 99999-9999"
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
              placeholder="Digite sua senha"
              required
            />
          </div>

          {/* Exibe mensagem de erro, se houver */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botão de Criar Conta */}
          <SubmitButton>Criar Conta</SubmitButton>
        </form>

        {/* Divisor */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Ou</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        {/* Login com Google */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
          <FcGoogle size={22} />
          <span className="font-medium">Entrar com Google</span>
        </button>

        {/* Login com Facebook */}
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
          <FaFacebook size={22} className="text-[#1877F2]" />
          <span className="font-medium">Entrar com Facebook</span>
        </button>

        {/* Link para login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

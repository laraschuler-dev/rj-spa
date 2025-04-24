import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import { FcGoogle } from 'react-icons/fc';
import SubmitButton from '../components/ui/SubmitButton';
import { FaFacebook } from 'react-icons/fa';

const Login: React.FC = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {/* Título */}
        <Typography variant="h2" className="text-primary text-center mb-6">
          Bem-vindo de volta
        </Typography>

        {/* Formulário de Login */}
        <form className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="block mb-1 text-sm font-medium"
            >
              E-mail ou Telefone
            </label>
            <input
              type="text"
              id="identifier"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="exemplo@email.com ou (99) 99999-9999"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
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

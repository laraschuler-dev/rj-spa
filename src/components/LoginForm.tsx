// components/LoginForm.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Typography from './ui/Typography';
import PasswordInput from './ui/PasswordInput';
import SubmitButton from './ui/SubmitButton';
import GoogleLoginButton from './ui/GoogleLoginButton';

interface LoginFormProps {
  formData: {
    emailOrPhone: string;
    password: string;
  };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  isSubmitting,
  onChange,
  onSubmit,
}) => (
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
    {/* Título */}
    <Typography variant="h2" className="text-primary text-center mb-6">
      Bem-vindo de volta
    </Typography>

    {/* Formulário de Login */}
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="emailOrPhone"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          E-mail ou Telefone
        </label>
        <input
          type="text"
          id="emailOrPhone"
          value={formData.emailOrPhone}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="exemplo@email.com ou (99) 99999-9999"
          required
        />
      </div>

      <div>
        <PasswordInput
          type="password"
          id="password"
          label="Senha"
          value={formData.password}
          onChange={onChange}
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
      <SubmitButton loading={isSubmitting}>Entrar</SubmitButton>
    </form>

    {/* Divisor */}
    <div className="flex items-center my-6">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-gray-500 text-sm">Ou se preferir</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>

    {/* Google Login e Footer */}
    <div className="flex flex-col items-center justify-center max-w-md">
      <GoogleLoginButton />
    </div>

    <p className="text-center text-sm text-gray-600 mt-6">
      Ainda não tem uma conta?{' '}
      <Link to="/register" className="text-primary font-medium hover:underline">
        Criar conta
      </Link>
    </p>
  </div>
);

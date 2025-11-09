// components/RegisterForm.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import { RegisterFormData } from '../../hooks/useRegister';
import Typography from '../ui/Typography';
import PasswordInput from '../ui/PasswordInput';
import SubmitButton from '../ui/SubmitButton';
import GoogleLoginButton from '../ui/GoogleLoginButton';

interface RegisterFormProps {
  formData: RegisterFormData;
  error: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}) => (
  <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg mx-4 sm:mx-0">
    {/* Título */}
    <Typography variant="h2" className="text-primary text-center mb-6">
      Criar Conta
    </Typography>
    <Typography variant="p" className="text-sm text-gray-600 text-center mb-6">
      Junte-se à Rede Solidária e comece a fazer a diferença.
    </Typography>

    {/* Formulário de Registro */}
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Nome completo
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu nome"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Digite seu e-mail"
          required
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="(99) 99999-9999"
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
          placeholder="Digite sua senha"
          required
        />
      </div>
      <div>
        <PasswordInput
          type="password"
          id="confirmPassword"
          label="Confirmar Senha"
          value={formData.confirmPassword}
          onChange={onChange}
          placeholder="Confirme sua senha"
          required
        />
      </div>

      {/* Exibe mensagem de erro, se houver */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botão de Criar Conta */}
      <SubmitButton loading={isSubmitting}>Criar Conta</SubmitButton>
    </form>

    {/* Divisor */}
    <div className="flex items-center my-6">
      <hr className="flex-grow border-t border-gray-300" />
      <span className="mx-4 text-gray-500 text-sm">Ou se preferir</span>
      <hr className="flex-grow border-t border-gray-300" />
    </div>

    <div className="flex flex-col items-center justify-center max-w-md">
      {/* Botão de login com Google */}
      <GoogleLoginButton />
    </div>

    {/* Link para login */}
    <p className="text-center text-sm text-gray-600 mt-6">
      Já tem uma conta?{' '}
      <Link to="/login" className="text-primary font-medium hover:underline">
        Entrar
      </Link>
    </p>
  </div>
);

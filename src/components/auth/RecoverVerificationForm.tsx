// components/RecoverVerificationForm.tsx
import React from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';

interface RecoverVerificationFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResend: () => void;
  onBackToLogin: () => void;
}

export const RecoverVerificationForm: React.FC<
  RecoverVerificationFormProps
> = ({ email, loading, onEmailChange, onResend, onBackToLogin }) => (
  <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-[90%] sm:w-full max-w-md">
      {/* Título e descrição */}
      <div className="text-center mb-6">
        <Typography variant="h2" className="text-primary mb-4">
          Reenviar Verificação
        </Typography>

        <p className="text-gray-600">
          Digite seu e-mail para reenviar o link de verificação da sua conta.
        </p>
      </div>

      {/* Campo de email */}
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          E-mail
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={onEmailChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="seu@email.com"
          required
        />
      </div>

      {/* Botões - container ajustado */}
      <div className="flex flex-col gap-3">
        {' '}
        {/* ✅ Usando gap em vez de space-y */}
        {/* Botão de reenviar */}
        <SubmitButton loading={loading} onClick={onResend}>
          {loading ? 'Enviando...' : 'Reenviar Verificação'}
        </SubmitButton>
        {/* Botão voltar para login - COM MESMO PADDING */}
        <SubmitButton type="button" variant="neutral" onClick={onBackToLogin}>
          Voltar para o Login
        </SubmitButton>
      </div>

      {/* Dica */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Verifique também sua pasta de spam.
        </p>
      </div>
    </div>
  </main>
);

// components/PendingVerification.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';

interface PendingVerificationProps {
  loading: boolean;
  onResend: () => void;
}

export const PendingVerification: React.FC<PendingVerificationProps> = ({
  loading,
  onResend,
}) => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-[90%] sm:w-full max-w-md text-center">
        <Typography variant="h2" className="text-primary mb-4">
          Verifique seu e-mail
        </Typography>
        <p className="text-gray-600 mb-6">
          Enviamos um link de verificação para o seu e-mail. Clique no link para
          ativar sua conta antes de fazer login.
        </p>
        <SubmitButton loading={loading} onClick={onResend}>
          Reenviar e-mail
        </SubmitButton>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Não recebeu o e-mail?</strong> Verifique sua pasta de spam.
          </p>
        </div>
      </div>
    </main>
  );
};

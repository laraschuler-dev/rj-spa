// pages/VerifyPending.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import Typography from '../components/ui/Typography';
import SubmitButton from '../components/ui/SubmitButton';

const VerifyPending = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('pendingEmail');
      if (!email) return toast.error('E-mail não encontrado.');
      await api.post('/auth/resend-verification', { email });
      toast.success('E-mail de verificação reenviado!');
    } catch {
      toast.error('Erro ao reenviar o e-mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md text-center">
        <Typography variant="h2" className="text-primary mb-4">
          Verifique seu e-mail
        </Typography>
        <p className="text-gray-600 mb-6">
          Enviamos um link de verificação para o seu e-mail. Clique no link para
          ativar sua conta antes de fazer login.
        </p>
        <SubmitButton loading={loading} onClick={handleResend}>
          Reenviar e-mail
        </SubmitButton>
      </div>
    </main>
  );
};

export default VerifyPending;

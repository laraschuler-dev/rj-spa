// hooks/useVerifyPending.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export const useVerifyPending = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('pendingEmail');
      if (!email) {
        toast.error('E-mail não encontrado.');
        return;
      }

      await api.post('/auth/resend-verification', { email });
      toast.success('E-mail de verificação reenviado!');
    } catch {
      toast.error('Erro ao reenviar o e-mail.');
    } finally {
      setLoading(false);
    }
  };

  const handleTryLogin = () => {
    navigate('/login');
  };

  const pendingEmail = localStorage.getItem('pendingEmail');

  return {
    loading,
    pendingEmail,
    handleResend,
    handleTryLogin,
  };
};

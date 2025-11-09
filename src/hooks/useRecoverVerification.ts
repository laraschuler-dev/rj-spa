// hooks/useRecoverVerification.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export const useRecoverVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Digite um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/resend-verification', { email });
      localStorage.setItem('pendingEmail', email);
      toast.success('E-mail de verificação reenviado!');
      navigate('/verify-pending');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 'Erro ao reenviar verificação';

      // Tratamento específico para email não encontrado
      if (
        errorMessage.includes('não encontrado') ||
        errorMessage.includes('não existe')
      ) {
        toast.error(
          'E-mail não encontrado. Verifique se digitou corretamente.'
        );
      } else if (errorMessage.includes('já verificado')) {
        toast.error('Este e-mail já foi verificado. Faça login.');
        navigate('/login');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return {
    email,
    loading,
    handleEmailChange,
    handleResend,
    handleBackToLogin,
  };
};

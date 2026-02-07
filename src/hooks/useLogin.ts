// hooks/useLogin.ts
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import useAuthStore from '../stores/authStore';

export const useLogin = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ CORREÇÃO: Aceita tanto string quanto objeto com pathname
  const from =
    typeof location.state?.from === 'string'
      ? location.state.from
      : location.state?.from?.pathname || '/feed';

  const setToken = useAuthStore((state) => state.setToken);
  const validateToken = useAuthStore((state) => state.validateToken);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Redirecionamento automático
  useEffect(() => {
    if (token && user) {
      navigate(from, { replace: true });
    }
  }, [token, user, from, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/session', formData);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      await validateToken();
      toast.success('Login realizado com sucesso!');
      localStorage.removeItem('pendingEmail');
    } catch (err: any) {
      handleLoginError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginError = (err: any) => {
    if (err.response?.data?.error) {
      const message = err.response.data.error;

      /*if (message.toLowerCase().includes('não verificado')) {
        toast.warning('Verifique seu e-mail antes de entrar.');
        const email = formData.emailOrPhone.includes('@')
          ? formData.emailOrPhone
          : null;
        if (email) localStorage.setItem('pendingEmail', email);
        navigate('/verify-pending');
        return;
      }*/

      toast.error(message);
    } else if (err.request) {
      toast.error('Erro de conexão com o servidor.');
    } else {
      toast.error('Erro inesperado ao fazer login.');
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};

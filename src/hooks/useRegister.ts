// hooks/useRegister.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const useRegister = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = (): boolean => {
    setError('');

    // Validação de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Digite um e-mail válido.');
      return false;
    }

    // Validação de senhas
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await api.post('/auth/users', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      /*toast.success(
        'Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.'
      );
      localStorage.setItem('pendingEmail', formData.email);
      navigate('/verify-pending');?*/

      toast.success('Conta criada com sucesso! Você já pode fazer login.');
      navigate('/login');
    } catch (err: any) {
      handleRegisterError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterError = (err: any) => {
    if (err.response && err.response.data) {
      const backendMessage = err.response.data.error || 'Erro ao criar conta';
      toast.error(backendMessage);
    } else if (err.request) {
      toast.error(
        'Não foi possível conectar ao servidor. Verifique sua conexão.'
      );
    } else {
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    }
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};

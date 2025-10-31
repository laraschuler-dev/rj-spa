// hooks/useSocialConnections.ts
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';

export const useSocialConnections = () => {
  const [loading, setLoading] = useState(false);

  const linkGoogleAccount = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await axios.post('/auth/google/link', { idToken });
      toast.success('Conta Google vinculada com sucesso!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao vincular Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unlinkGoogleAccount = async (password: string) => {
    setLoading(true);
    try {
      await axios.post('/auth/google/unlink', { password });
      toast.success('Conta Google desvinculada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao desvincular Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSocialConnections = async () => {
    try {
      const response = await axios.get('/auth/social-connections');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar conexões sociais:', error);
      throw error;
    }
  };

  return {
    loading,
    linkGoogleAccount,
    unlinkGoogleAccount,
    getSocialConnections,
  };
};

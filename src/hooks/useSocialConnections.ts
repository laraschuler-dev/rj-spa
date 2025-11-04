// useSocialConnections.ts - Versão corrigida
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import { SocialConnections } from '../types/accountSettings';

export const useSocialConnections = () => {
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Usar refreshUser em vez de setUser
  const { user, refreshUser, setHasGoogle } = useAuthStore();

  const connections: SocialConnections = {
    hasGoogle: user?.hasGoogle || false,
    connectedProviders: user?.hasGoogle ? ['google'] : [],
  };

  const linkGoogleAccount = async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/google/link', { idToken });

      // Atualizar dados do usuário sem afetar a sessão
      await refreshUser();
      return response.data;
    } catch (error: any) {
      console.error(error.response?.data?.error || 'Erro ao vincular Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unlinkGoogleAccount = async (password: string) => {
    if (!password) {
      toast.error('Por favor, informe sua senha');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/auth/google/unlink', { password });

      // Atualizar dados do usuário sem afetar a sessão
      await refreshUser();

      setShowUnlinkModal(false);
      setUnlinkPassword('');
      toast.success('Google desvinculado com sucesso!');
    } catch (error: any) {
      console.error('🔴 Erro ao desvincular Google:', error);

      // Se for erro 401, pode ser que o backend invalidou o token
      if (error.response?.status === 401) {
        toast.error('Sessão expirada ao desvincular Google.');
        // O useAuthListener vai redirecionar para login
      } else {
        toast.error(
          error.response?.data?.error || 'Erro ao desvincular Google'
        );
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    connections,
    unlinkPassword,
    setUnlinkPassword,
    showUnlinkModal,
    setShowUnlinkModal,
    isLoading,
    linkGoogleAccount,
    unlinkGoogleAccount,
  };
};

// useSocialConnections.ts
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import { SocialConnections } from '../types/accountSettings';

export const useSocialConnections = () => {
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ CORREÇÃO: Remover refreshUser e setHasGoogle que não existem
  const { user } = useAuthStore();

  const connections: SocialConnections = {
    hasGoogle: user?.hasGoogle || false,
    connectedProviders: user?.hasGoogle ? ['google'] : [],
  };

  const linkGoogleAccount = async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/google/link', { idToken });
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

      setShowUnlinkModal(false);
      setUnlinkPassword('');
      toast.success('Google desvinculado com sucesso!');

      // ✅ OPÇÃO: Recarregar a página para atualizar o estado do usuário
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('🔴 Erro ao desvincular Google:', error);

      const code = error.response?.data?.code;
      const message = error.response?.data?.error;

      if (code === 'INVALID_PASSWORD') {
        toast.error(message || 'Senha incorreta. Tente novamente.');
      } else if (error.response?.status === 401) {
        toast.error(message || 'Sessão expirada ao desvincular Google.');
      } else {
        toast.error(message || 'Erro ao desvincular Google');
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

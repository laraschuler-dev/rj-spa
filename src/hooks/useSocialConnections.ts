// src/hooks/useSocialConnections.ts (VERSÃO FINAL UNIFICADA)
import { useState, useEffect } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../stores/authStore';
import { SocialConnections } from '../types/accountSettings';

export const useSocialConnections = () => {
  // Estado das conexões
  const [connections, setConnections] = useState<SocialConnections>({
    hasGoogle: false,
    connectedProviders: [],
  });

  // Estado do modal de desvinculação
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  // ✅ CARREGA CONEXÕES AO INICIAR
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const response = await axios.get('/auth/social-connections');
        setConnections(response.data);
      } catch (error) {
        console.error('Erro ao carregar conexões sociais:', error);
      }
    };

    loadConnections();
  }, []);

  // ✅ VINCULAR GOOGLE
  const linkGoogleAccount = async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/google/link', { idToken });

      // Atualiza estado local
      setConnections((prev) => ({
        ...prev,
        hasGoogle: true,
        connectedProviders: [...prev.connectedProviders, 'google'],
      }));

      // Atualiza user na store
      setUser(response.data.user);

      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao vincular Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DESVINCULAR GOOGLE
  const unlinkGoogleAccount = async (password: string) => {
    if (!password) {
      toast.error('Por favor, informe sua senha');
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('/auth/google/unlink', { password });

      // Atualiza estado local
      setConnections((prev) => ({
        ...prev,
        hasGoogle: false,
        connectedProviders: prev.connectedProviders.filter(
          (p) => p !== 'google'
        ),
      }));

      setShowUnlinkModal(false);
      setUnlinkPassword('');
      toast.success('Google desvinculado com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao desvincular Google');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ BUSCAR CONEXÕES (para recarregar)
  const getSocialConnections = async () => {
    try {
      const response = await axios.get('/auth/social-connections');
      setConnections(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar conexões sociais:', error);
      throw error;
    }
  };

  return {
    // Estado
    connections,
    unlinkPassword,
    setUnlinkPassword,
    showUnlinkModal,
    setShowUnlinkModal,
    isLoading,

    // Ações
    linkGoogleAccount,
    unlinkGoogleAccount,
    getSocialConnections,
  };
};

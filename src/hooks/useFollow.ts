// src/hooks/useFollow.ts (VERSÃO OTIMIZADA)
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useProfileStore } from '../stores/profileStore';
import { useAuth } from './useAuth';

export interface UserFollowerInfo {
  id: number;
  name: string;
  profilePhoto?: string | null;
  profileType?: string;
  bio?: string | null;
  isFollowing?: boolean;
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export const useFollow = () => {
  const [loading, setLoading] = useState(false);
  const { token, user: currentUser } = useAuth();
  const {
    updateFollowStats,
    incrementFollowers,
    decrementFollowers,
    incrementFollowing,
    decrementFollowing,
  } = useProfileStore();

  const getFollowStats = useCallback(
    async (userId: number): Promise<FollowStats | null> => {
      try {
        const response = await api.get(`/follow/${userId}/stats`);
        return response.data;
      } catch (error) {
        console.error('Erro ao carregar estatísticas de follow');
        return null;
      }
    },
    []
  );

  const refreshFollowStats = useCallback(
    async (userId: number) => {
      try {
        const stats = await getFollowStats(userId);
        if (stats) {
          console.log('🔄 refreshFollowStats - dados atualizados:', stats);
          // 👇 SEMPRE atualiza a store para o usuário específico
          const currentState = useProfileStore.getState();
          if (currentState.user?.id === userId) {
            updateFollowStats(stats);
            console.log('✅ Store atualizada com novos stats');
          }
          return stats;
        }
      } catch (error) {
        console.error('Erro ao atualizar estatísticas de follow:', error);
      }
      return null;
    },
    [getFollowStats, updateFollowStats]
  );

  // 👇 SIMPLIFICAR A LÓGICA OTIMISTA - FOCO NO PERFIL ATUAL
  // No useFollow.ts, atualize a função updateOptimisticFollow:
  // No useFollow.ts, simplifique a função updateOptimisticFollow:
  const updateOptimisticFollow = useCallback(
    (targetUserId: number, isFollowing: boolean) => {
      const currentState = useProfileStore.getState();

      console.log('🔍 DEBUG updateOptimisticFollow:', {
        targetUserId,
        isFollowing,
        currentUserId: currentState.user?.id,
        currentUserProfileId: currentUser?.id,
      });

      // 👇 LÓGICA SIMPLIFICADA:
      // Se a store tem o usuário que estamos visualizando, atualiza seus seguidores
      if (currentState.user?.id === targetUserId) {
        console.log('🔄 Atualizando seguidores do perfil visualizado');
        if (isFollowing) {
          incrementFollowers(); // +1 seguidor
        } else {
          decrementFollowers(); // -1 seguidor
        }
      }

      // 👇 NÃO PRECISAMOS DA LÓGICA DO "SEGUINDO" AQUI
      // Isso será tratado pelo refreshFollowStats
    },
    [incrementFollowers, decrementFollowers]
  );

  const followUser = useCallback(
    async (followingId: number, enableOptimisticUpdate: boolean = true) => {
      if (!token) {
        toast.error('Faça login para seguir usuários');
        return false;
      }

      try {
        setLoading(true);

        // 👇 ATUALIZAÇÃO OTIMISTA CONDICIONAL
        if (enableOptimisticUpdate) {
          updateOptimisticFollow(followingId, true);
        }

        await api.post(
          '/follow',
          { followingId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 👇 ATUALIZAÇÃO REAL - BUSCA DADOS FRESCOS DA API
        // Isso garante que os números ficam corretos mesmo se houver
        // múltiplas ações simultâneas
        await refreshFollowStats(followingId);

        toast.success('Usuário seguido com sucesso!');
        return true;
      } catch (error: any) {
        // 👇 REVERTE em caso de erro
        if (enableOptimisticUpdate) {
          updateOptimisticFollow(followingId, false);
        }

        const message = error.response?.data?.error || 'Erro ao seguir usuário';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, refreshFollowStats, updateOptimisticFollow]
  );

  const unfollowUser = useCallback(
    async (followingId: number, enableOptimisticUpdate: boolean = true) => {
      if (!token) {
        toast.error('Faça login para deixar de seguir usuários');
        return false;
      }

      try {
        setLoading(true);

        // 👇 ATUALIZAÇÃO OTIMISTA CONDICIONAL
        if (enableOptimisticUpdate) {
          updateOptimisticFollow(followingId, false);
        }

        await api.delete(`/follow/${followingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 👇 ATUALIZAÇÃO REAL - BUSCA DADOS FRESCOS DA API
        await refreshFollowStats(followingId);

        toast.success('Deixou de seguir o usuário');
        return true;
      } catch (error: any) {
        // 👇 REVERTE em caso de erro
        if (enableOptimisticUpdate) {
          updateOptimisticFollow(followingId, true);
        }

        const message =
          error.response?.data?.error || 'Erro ao deixar de seguir';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, refreshFollowStats, updateOptimisticFollow]
  );

  // ... resto das funções permanece igual
  const getFollowers = useCallback(
    async (userId: number): Promise<UserFollowerInfo[]> => {
      try {
        const response = await api.get(`/follow/${userId}/followers`);
        return response.data;
      } catch (error: any) {
        toast.error('Erro ao carregar seguidores');
        return [];
      }
    },
    []
  );

  const getFollowing = useCallback(
    async (userId: number): Promise<UserFollowerInfo[]> => {
      try {
        const response = await api.get(`/follow/${userId}/following`);
        return response.data;
      } catch (error: any) {
        toast.error('Erro ao carregar usuários seguidos');
        return [];
      }
    },
    []
  );

  const checkIsFollowing = useCallback(
    async (followingId: number): Promise<boolean> => {
      if (!token) return false;

      try {
        const response = await api.get(`/follow/check/${followingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.isFollowing;
      } catch (error) {
        return false;
      }
    },
    [token]
  );

  return {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStats,
    checkIsFollowing,
    refreshFollowStats,
    loading,
  };
};

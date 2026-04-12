// src/hooks/useFollow.ts (VERSÃO SIMPLIFICADA)
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
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
  const { token } = useAuth();

  // 👇 CORREÇÃO: useCallback em todas as funções
  const followUser = useCallback(
    async (followingId: number) => {
      if (!token) {
        toast.error('Faça login para seguir usuários');
        return false;
      }

      try {
        setLoading(true);
        await api.post(
          '/follow',
          { followingId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success('Usuário seguido com sucesso!');
        return true;
      } catch (error: any) {
        const message = error.response?.data?.error || 'Erro ao seguir usuário';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const unfollowUser = useCallback(
    async (followingId: number) => {
      if (!token) {
        toast.error('Faça login para deixar de seguir usuários');
        return false;
      }

      try {
        setLoading(true);
        await api.delete(`/follow/${followingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success('Deixou de seguir o usuário');
        return true;
      } catch (error: any) {
        const message =
          error.response?.data?.error || 'Erro ao deixar de seguir';
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

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

  const getFollowStats = useCallback(
    async (userId: number): Promise<FollowStats | null> => {
      try {
        const response = await api.get(`/follow/${userId}/stats`);
        return response.data;
      } catch (error) {
        return null;
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
    loading,
  };
};

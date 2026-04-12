// src/hooks/useUserProfile.ts
import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { useFollow } from './useFollow';

export function useUserProfile(userId?: number) {
  const [state, setState] = useState({
    user: null as any,
    profile: null as any,
    loading: true,
    error: null as string | null,
  });

  const { getFollowStats } = useFollow();

  const fetchProfile = useCallback(
    async (id: number) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const res = await api.get(`/profile/public/${id}`);

        const userData = {
          id: res.data.id,
          name: res.data.name,
        };

        const profileData = {
          translated_type: res.data.profile?.translated_type,
          profile_photo: res.data.profile?.profile_photo,
          bio: res.data.profile?.bio,
          city: res.data.profile?.city,
          state: res.data.profile?.state,
          followStats: res.data.profile?.followStats,
        };

        // SEMPRE buscar followStats atualizados
        try {
          const followStats = await getFollowStats(id);
          if (followStats) {
            profileData.followStats = followStats;
          }
        } catch (followError) {
          console.error('Erro ao buscar follow stats:', followError);
        }

        setState({
          user: userData,
          profile: profileData,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('Erro ao buscar perfil público:', err);
        setState({
          user: null,
          profile: null,
          loading: false,
          error: err.response?.data?.error || 'Erro ao carregar perfil',
        });
      }
    },
    [getFollowStats]
  );

  const refreshFollowStats = useCallback(async () => {
    if (!userId || !state.profile) return;

    try {
      const followStats = await getFollowStats(userId);

      if (followStats) {
        setState((prev) => ({
          ...prev,
          profile: {
            ...prev.profile,
            followStats,
          },
        }));
      }
    } catch (error) {
      console.error(
        '❌ [useUserProfile] Erro ao atualizar follow stats:',
        error
      );
    }
  }, [userId, state.profile, getFollowStats]);

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      setState({ user: null, profile: null, loading: false, error: null });
    }
  }, [userId, fetchProfile]);

  return {
    ...state,
    refreshProfile: () => userId && fetchProfile(userId),
    refreshFollowStats,
  };
}

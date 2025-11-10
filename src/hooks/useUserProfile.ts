// src/hooks/useUserProfile.ts (CORRIGIDO)
import { useEffect } from 'react';
import api from '../services/api';
import { useFollow } from './useFollow';
import { useProfileStore } from '../stores/profileStore';

export function useUserProfile(userId?: number) {
  const { setProfile, setLoading } = useProfileStore();
  const { getFollowStats, checkIsFollowing } = useFollow();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userId) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
        }

        // Busca dados básicos do perfil
        const res = await api.get(`/profile/public/${userId}`);

        // Busca estatísticas de follow
        const followStats = await getFollowStats(userId);

        // Verifica se o usuário atual está seguindo este perfil
        const isFollowing = await checkIsFollowing(userId);

        if (isMounted) {
          const userData = {
            id: res.data.id,
            name: res.data.name,
            // 👇 PARA PERFIS PÚBLICOS, NÃO TEMOS email E fone
          };

          const profileData = {
            translated_type: res.data.profile?.translated_type,
            profile_photo: res.data.profile?.profile_photo,
            bio: res.data.profile?.bio,
            city: res.data.profile?.city,
            state: res.data.profile?.state,
            followStats: {
              followersCount: followStats?.followersCount || 0,
              followingCount: followStats?.followingCount || 0,
              isFollowing: isFollowing || false,
            },
          };

          // 👇 AGORA A STORE TERÁ OS DADOS DO USUÁRIO QUE ESTAMOS VISUALIZANDO
          setProfile(userData, profileData);
        }
      } catch (err: any) {
        console.error('Erro ao carregar perfil público:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId, getFollowStats, checkIsFollowing, setProfile, setLoading]);

  // 👇 RETORNAR OS DADOS DA STORE, NÃO DO ESTADO LOCAL
  const { user, profile, loading } = useProfileStore();
  return { user, profile, loading };
}

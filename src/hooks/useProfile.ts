// src/hooks/useProfile.ts
import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import api from '../services/api';
import { useProfileBase } from './useProfileBase';
import { useProfileStore } from '../stores/profileStore';

export function useProfile() {
  const { token } = useAuthStore();
  const { setProfile, clearProfile, setLoading } = useProfileStore();
  const baseData = useProfileBase();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = {
          id: res.data.profile?.user_id,
          name: res.data.name,
          email: res.data.email,
          fone: res.data.fone,
        };

        const profileData = {
          translated_type: res.data.profile?.translated_type,
          profile_photo: res.data.profile?.profile_photo,
          bio: res.data.profile?.bio,
          city: res.data.profile?.city,
          state: res.data.profile?.state,
          followStats: res.data.followStats,
        };

        setProfile(userData, profileData);
      } catch (err) {
        console.error('🔴 Erro ao buscar perfil:', err);
        clearProfile();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, setProfile, clearProfile, setLoading]);

  return baseData;
}

// src/hooks/useProfile.ts
import { useEffect } from 'react';
import { useProfileStore } from '../stores/profileStore';
import useAuthStore from '../stores/authStore';
import api from '../services/api';

// src/hooks/useProfile.ts
export function useProfile() {
  const { token } = useAuthStore();
  const { user, profile, loading, setProfile, clearProfile, setLoading } =
    useProfileStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const res = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('🔍 Resposta completa da API /profile:', res.data);

        // ✅ CORREÇÃO: Pegar o ID do lugar correto
        const userData = {
          id: res.data.profile?.user_id, // ← Agora pega de profile.user_id
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
        };

        console.log('🔍 Dados extraídos:', { userData, profileData });

        setProfile(userData, profileData);
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
        clearProfile();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, setProfile, clearProfile, setLoading]);

  return { user, profile, loading };
}

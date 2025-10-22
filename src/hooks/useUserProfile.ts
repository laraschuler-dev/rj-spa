// src/hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import api from '../services/api';

// 👇 ADICIONE ESTES TIPOS NOVOS (no topo do arquivo)
export interface PublicUserData {
  id: number;
  name: string;
  // ❌ NÃO inclui email/telefone - são dados sensíveis
}

export interface PrivateUserData {
  id: number;
  name: string;
  email: string;
  fone?: string;
}

// 👇 ATUALIZE esta interface para usar os tipos específicos
interface UserProfileData {
  user: PublicUserData | PrivateUserData | null; // 👈 MUDOU AQUI
  profile: {
    translated_type?: string;
    profile_photo?: string;
    bio?: string;
    city?: string;
    state?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

// src/hooks/useUserProfile.ts
export function useUserProfile(userId?: number): UserProfileData {
  const [state, setState] = useState<UserProfileData>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setState({ user: null, profile: null, loading: false, error: null });
        return;
      }

      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // 👇 CORREÇÃO: Use a rota correta /profile/public/{userId}
        const res = await api.get(`/profile/public/${userId}`);

        console.log('🔍 Resposta perfil público:', res.data);

        // 👇 Dados públicos apenas
        const userData: PublicUserData = {
          id: res.data.id,
          name: res.data.name,
          // ❌ NÃO inclui email e telefone
        };

        const profileData = {
          translated_type: res.data.profile?.translated_type,
          profile_photo: res.data.profile?.profile_photo,
          bio: res.data.profile?.bio,
          city: res.data.profile?.city,
          state: res.data.profile?.state,
        };

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
    };

    fetchUserProfile();
  }, [userId]);

  return state;
}

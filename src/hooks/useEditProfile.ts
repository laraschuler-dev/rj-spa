// src/hooks/useEditProfile.ts
import { useState } from 'react';
import axios from '../services/api';
import { useProfileStore } from '../stores/profileStore';

export type ProfileFormData = {
  profile_type: string;
  bio: string;
  city: string;
  state: string;
};

const validProfileTypes = [
  'psr',
  'volunteer',
  'ong',
  'company',
  'public_institution',
] as const;

type ValidProfileType = (typeof validProfileTypes)[number];

// Type guard para garantir type safety
function isValidProfileType(value: string): value is ValidProfileType {
  return validProfileTypes.includes(value as ValidProfileType);
}

export const useEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setProfile } = useProfileStore();

  const editProfile = async (form: ProfileFormData, photoFile: File | null) => {
    try {
      setLoading(true);

      // Monta dados a enviar
      const dataToSend: Partial<ProfileFormData> = {
        bio: form.bio,
        city: form.city,
        state: form.state,
      };

      // Aplica type guard para profile_type
      if (form.profile_type && isValidProfileType(form.profile_type)) {
        dataToSend.profile_type = form.profile_type;
      }

      // Atualiza perfil
      const res = await axios.put('/profile', dataToSend);

      const { user: currentUser } = useProfileStore.getState(); // pega o user atual da store

      const updatedUser = {
        ...currentUser!,
        name: res.data.name,
        email: res.data.email,
        fone: res.data.fone,
      };

      let updatedProfile = {
        profile_type: res.data.profile?.profile_type,
        translated_type: res.data.profile?.translated_type,
        profile_photo: res.data.profile?.profile_photo,
        bio: res.data.profile?.bio,
        city: res.data.profile?.city,
        state: res.data.profile?.state,
      };

      // Atualiza foto, se houver
      if (photoFile) {
        const formData = new FormData();
        formData.append('profile_photo', photoFile);

        const photoRes = await axios.put('/profile/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Ajuste: a API retorna o profile direto, não dentro de .profile
        updatedProfile.profile_photo =
          photoRes.data?.profile_photo ?? updatedProfile.profile_photo;
      }

      // Atualiza store
      setProfile(updatedUser, updatedProfile);

      return { success: true };
    } catch (err: any) {
      if (err.response?.data?.error)
        return { success: false, error: err.response.data.error };
      if (err.request)
        return { success: false, error: 'Erro de conexão com o servidor.' };
      return { success: false, error: 'Erro inesperado ao salvar perfil.' };
    } finally {
      setLoading(false);
    }
  };

  return { editProfile, loading };
};

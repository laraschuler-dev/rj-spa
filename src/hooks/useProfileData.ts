// src/hooks/useProfileData.ts
import { useProfile } from './useProfile';
import { useUserProfile } from './useUserProfile';

export function useProfileData(targetUserId?: number, isOwnProfile?: boolean) {
  // Lógica clara:
  // - Perfil próprio: usa useProfile (com store)
  // - Perfil de outros: usa useUserProfile (estado local)
  return isOwnProfile ? useProfile() : useUserProfile(targetUserId);
}

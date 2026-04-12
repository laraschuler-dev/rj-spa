// src/hooks/useProfileBase.ts
import { useProfileStore } from '../stores/profileStore';

export function useProfileBase() {
  // Retorna os dados diretamente da store
  const { user, profile, loading } = useProfileStore();
  return { user, profile, loading };
}

// src/hooks/useAuth.ts
import useAuthStore from '../stores/authStore';

export function useAuth() {
  const { token, user, setToken, setUser, clearAuth } = useAuthStore();
  const isAuthenticated = !!token && !!user;
  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    clearAuth,
  };
}

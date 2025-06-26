// hooks/useLogout.ts
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth); // <-- CORREÇÃO

  const logout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  return logout;
}

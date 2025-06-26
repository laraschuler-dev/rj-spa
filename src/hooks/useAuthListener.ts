// hooks/useAuthListener.ts
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export const useAuthListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, clearAuth } = useAuthStore();

  useEffect(() => {
    const handleAuthChange = () => {
      const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
      const isTokenValid = !!localStorage.getItem('auth-storage');

      if (!isTokenValid && token) {
        clearAuth(); // Garante sincronização com o Zustand
      }

      if (!isTokenValid && !isPublicRoute) {
        navigate('/login');
      }
    };

    // Escuta eventos de authCleared (disparados pelo clearAuth)
    window.addEventListener('authCleared', handleAuthChange);

    // Escuta mudanças no localStorage (para outras abas)
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('authCleared', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate, location.pathname, token, clearAuth]);
};

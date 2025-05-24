// components/AuthInitializer.tsx
import { ReactNode, useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import { useAuthListener } from '../hooks/useAuthListener';

interface Props {
  children: ReactNode;
}

export default function AuthInitializer({ children }: Props) {
  const { token, validateToken } = useAuthStore();
  useAuthListener(); // Gerencia redirecionamentos

  useEffect(() => {
    const checkToken = async () => {
      if (!token) return;
      try {
        await validateToken();
      } catch (error) {
        console.error('Falha na validação do token:', error);
      }
    };
    checkToken();
  }, [token, validateToken]);

  return <>{children}</>;
}

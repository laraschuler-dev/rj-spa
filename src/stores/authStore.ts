import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  validateToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),

      clearAuth: () => {
        set({ token: null, user: null });
        window.dispatchEvent(new CustomEvent('authCleared'));
      },

      validateToken: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          get().setUser(response.data);
        } catch (error) {
          console.warn('Token inválido ou expirado. Limpando sessão.');
          get().clearAuth();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

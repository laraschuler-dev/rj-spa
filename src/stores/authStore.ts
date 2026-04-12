// authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  isSocialLogin: boolean;
  hasGoogle: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  validateToken: () => Promise<void>;
  // Novas ações para atualizações específicas
  updateUser: (updates: Partial<User>) => void;
  setHasGoogle: (hasGoogle: boolean) => void;
  setIsSocialLogin: (isSocialLogin: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setToken: (token) => {
        set({ token });
      },

      setUser: (user) => {
        set({ user });
      },

      clearAuth: () => {
        set({ token: null, user: null });
        window.dispatchEvent(new CustomEvent('authCleared'));
      },

      // authStore.ts - Adicione esta ação
      validateToken: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          get().setUser(response.data);
        } catch (error) {
          console.warn(
            '🔴 Token inválido ou expirado. Limpando sessão.',
            error
          );
          get().clearAuth();
          throw error;
        }
      },

      // ✅ NOVA AÇÃO: Apenas atualiza o user sem mexer no token
      refreshUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          get().setUser(response.data);
        } catch (error) {
          console.warn('🔴 Erro ao atualizar dados do usuário:', error);
          // Não limpa a auth aqui - pode ser um erro temporário
          throw error;
        }
      },

      // ✅ NOVAS AÇÕES PARA ATUALIZAÇÕES ESPECÍFICAS
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      setHasGoogle: (hasGoogle) => {
        set((state) => ({
          user: state.user ? { ...state.user, hasGoogle } : null,
        }));
      },

      setIsSocialLogin: (isSocialLogin) => {
        set((state) => ({
          user: state.user ? { ...state.user, isSocialLogin } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        console.log('[AuthStore] Rehidratando auth-storage', state);
      },
    }
  )
);

export default useAuthStore;

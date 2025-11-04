// src/stores/notificationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../services/api';

export interface Notification {
  id: number;
  type: 'LIKE' | 'COMMENT' | 'EVENT_ATTENDANCE' | 'SHARE';
  is_read: boolean;
  created_at: string;
  actor: {
    id: number;
    name: string;
    avatar_url?: string | null;
  };
  post?: {
    id: number;
    content_preview: string;
    image?: string;
  };
  message?: string;
}

interface NotificationStoreState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  page: number;

  fetchNotifications: (isInitialLoad?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStoreState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,
      hasMore: true,
      page: 1,

      // 🔹 Buscar notificações
      fetchNotifications: async (isInitialLoad = false) => {
        console.log(
          '🟢 [Store] fetchNotifications iniciado (isInitialLoad:',
          isInitialLoad,
          ')'
        );

        const { loading, page } = get();
        if (loading) return;

        console.log('🔄 Buscando notificações...', {
          isInitialLoad,
          currentPage: isInitialLoad ? 1 : page,
        });
        set({ loading: true });

        try {
          const currentPage = isInitialLoad ? 1 : page;
          const response = await axios.get('/notifications', {
            params: { page: currentPage, limit: 10 },
          });

          const newNotifications: Notification[] = response.data.data;
          const pagination = response.data.pagination;

          set((state) => {
            const updatedNotifications = isInitialLoad
              ? newNotifications
              : [...state.notifications, ...newNotifications];

            const nextPage = isInitialLoad ? 2 : state.page + 1;

            return {
              notifications: updatedNotifications,
              page: nextPage,
              hasMore: pagination.hasNextPage,
              loading: false,
            };
          });
        } catch (error) {
          console.error('❌ Erro ao buscar notificações:', error);
          set({ loading: false });
        }
      },

      // 🔹 Contador de não lidas
      fetchUnreadCount: async () => {
        console.log('🟡 [Store] fetchUnreadCount chamado...');
        try {
          const response = await axios.get('/notifications/unread-count');
          console.log(
            '📊 [Store] Unread count recebido da API:',
            response.data.count
          );
          set({ unreadCount: response.data.count });
        } catch (error) {
          console.error('❌ Erro ao buscar contador:', error);
        }
      },

      // 🔹 Marcar todas como lidas
      markAllAsRead: async () => {
        console.log('✅ [Store] markAllAsRead chamado...');
        try {
          // 🔹 Atualiza imediatamente o estado local
          set((state) => ({
            unreadCount: 0,
            notifications: state.notifications.map((n) => ({
              ...n,
              is_read: true,
            })),
          }));

          // 🔹 Faz a chamada para o backend
          await axios.post('/notifications/mark-all-as-read');

          // 🔹 Evita corrida: pequeno delay antes da revalidação
          setTimeout(async () => {
            try {
              const response = await axios.get('/notifications/unread-count');
              console.log(
                '🔁 [Store] Revalidação após markAllAsRead:',
                response.data.count
              );
              set({ unreadCount: response.data.count });
            } catch (err) {
              console.warn('[Store] Falha ao revalidar unread count', err);
            }
          }, 500); // pequeno delay evita conflito de requests simultâneas
        } catch (error) {
          console.error(
            '❌ [Store] Erro ao marcar notificações como lidas:',
            error
          );
        }
      },

      // 🔹 Limpar notificações (sem perder contador)
      clearNotifications: () => {
        set((state) => ({
          ...state,
          notifications: [],
          page: 1,
          hasMore: true,
          loading: false,
        }));
      },

      // 🔹 Adicionar notificação em tempo real
      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);

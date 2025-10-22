// stores/notificationStore.ts
import { create } from 'zustand';
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

export const useNotificationStore = create<NotificationStoreState>(
  (set, get) => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
    hasMore: true,
    page: 1,

    fetchNotifications: async (isInitialLoad = false) => {
      const { loading, page } = get();
      if (loading) return;

      console.log('🔄 Buscando notificações...', {
        isInitialLoad,
        currentPage: isInitialLoad ? 1 : page,
      });
      set({ loading: true });

      try {
        // CORREÇÃO: Calcular a página correta baseada no isInitialLoad
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

          // CORREÇÃO: Avançar para próxima página apenas se não for load inicial
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

    fetchUnreadCount: async () => {
      try {
        const response = await axios.get('/notifications/unread-count');
        set({ unreadCount: response.data.count });
      } catch (error) {
        console.error('❌ Erro ao buscar contador:', error);
      }
    },

    markAllAsRead: async () => {
      try {
        set({ unreadCount: 0 });
      } catch (error) {
        console.error('Erro ao marcar notificações como lidas:', error);
      }
    },

    clearNotifications: () => {
      set({
        notifications: [],
        page: 1,
        hasMore: true,
        loading: false, // Também garantir que loading seja false
      });
    },

    addNotification: (notification: Notification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    },
  })
);

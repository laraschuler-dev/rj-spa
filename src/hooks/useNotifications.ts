import { useEffect, useCallback } from 'react';
import { useNotificationStore } from '../stores/notificationStore';
export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    clearNotifications,
  } = useNotificationStore();

  const initializeNotifications = useCallback(async () => {
    console.log('[useNotifications] Inicializando notificações...');
    await fetchUnreadCount();
    await fetchNotifications(true);
    console.log('[useNotifications] Finalizado initializeNotifications');
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    // Evita buscar contador novamente se o hook for re-renderizado imediatamente após markAllAsRead
    const timeout = setTimeout(() => {
      initializeNotifications();
    }, 300);

    return () => clearTimeout(timeout);
  }, [initializeNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    clearNotifications,
    hasNotifications: notifications.length > 0,
    hasUnread: unreadCount > 0,
  };
};

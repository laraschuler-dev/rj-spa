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
    await fetchUnreadCount();
    await fetchNotifications(true);
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
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

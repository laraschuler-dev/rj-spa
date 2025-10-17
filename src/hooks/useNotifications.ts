// hooks/useNotifications.ts - CORREÇÃO NA ORDEM
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

  // CORREÇÃO: Ordem mais lógica e sem zerar o contador
  const initializeNotifications = useCallback(async () => {
    // Primeiro busca o contador (mantém o valor atual)
    await fetchUnreadCount();
    // Depois limpa e busca notificações
    clearNotifications();
    await fetchNotifications(true);
  }, [fetchNotifications, fetchUnreadCount, clearNotifications]);

  // Buscar notificações e contador ao montar
  useEffect(() => {
    initializeNotifications();
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

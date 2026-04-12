// hooks/useNotificationNavigation.ts
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollStore } from '../stores/scrollStore';

export const useNotificationNavigation = () => {
  const navigate = useNavigate();
  const { markNotificationsForRestore } = useScrollStore();

  const navigateToPostFromNotification = useCallback(
    async (notification: any, onCloseDropdown?: () => void) => {
      console.log('🔔 useNotificationNavigation - Iniciando navegação...');

      // ✅ 1. MARCA PRIMEIRO - SÍNCRONO E IMEDIATO
      markNotificationsForRestore('notification_click');

      // ✅ 2. PEQUENA PAUSA CRÍTICA para garantir que a store foi atualizada
      await new Promise((resolve) => setTimeout(resolve, 50));

      console.log(
        '🔔 useNotificationNavigation - Store atualizada, fechando dropdown...'
      );

      // ✅ 3. Fecha dropdown (se fornecido)
      onCloseDropdown?.();

      // ✅ 4. PEQUENA PAUSA antes da navegação
      await new Promise((resolve) => setTimeout(resolve, 20));

      console.log('🔔 useNotificationNavigation - Navegando...');

      // ✅ 5. Lógica de navegação específica
      if (notification.type === 'COMMENT' && notification.post?.comment_id) {
        try {
          // Navega para post com comentário aberto
          if (notification.post.share_id) {
            navigate(
              `/post/${notification.post.id}/share/${notification.post.share_id}`,
              {
                state: {
                  openCommentId: notification.post.comment_id,
                  scrollToComment: true,
                  fromNotification: true, // ✅ MARCAÇÃO IMPORTANTE
                },
              }
            );
          } else {
            navigate(`/post/${notification.post.id}`, {
              state: {
                openCommentId: notification.post.comment_id,
                scrollToComment: true,
                fromNotification: true, // ✅ MARCAÇÃO IMPORTANTE
              },
            });
          }
        } catch (error) {
          console.error('Erro ao navegar para comentário:', error);
          navigateToPostNormal(notification);
        }
      } else if (notification.post && notification.post.id) {
        navigateToPostNormal(notification);
      } else if (notification.type === 'FOLLOW' && notification.actor.id) {
        navigate(`/profile/${notification.actor.id}`, {
          state: { fromNotification: true }, // ✅ MARCAÇÃO
        });
      }

      // ✅ 6. DEBUG - Verificar se estado foi mantido
      setTimeout(() => {
        const state = useScrollStore.getState();
        console.log(
          '🔔 useNotificationNavigation - Estado final da store:',
          state
        );
      }, 100);
    },
    [navigate, markNotificationsForRestore]
  );

  const navigateToPostNormal = useCallback(
    (notification: any) => {
      if (notification.post.share_id) {
        navigate(
          `/post/${notification.post.id}/share/${notification.post.share_id}`,
          { state: { fromNotification: true } } // ✅ MARCAÇÃO
        );
      } else {
        navigate(`/post/${notification.post.id}`, {
          state: { fromNotification: true }, // ✅ MARCAÇÃO
        });
      }
    },
    [navigate]
  );

  return {
    navigateToPostFromNotification,
    navigateToPostNormal,
  };
};

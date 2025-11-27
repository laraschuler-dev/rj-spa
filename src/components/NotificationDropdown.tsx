// components/NotificationDropdown.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell,
  FiX,
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Typography from './ui/Typography';
import AvatarInitials from './ui/AvatarInitials';
import axios from 'axios';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    fetchNotifications,
    markAllAsRead, // ✅ AGORA MARCA COMO LIDA AO ABRIR
  } = useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ MARCA COMO LIDA QUANDO ABRE O DROPDOWN
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [isOpen, unreadCount, markAllAsRead]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Há algum tempo';
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchNotifications();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'LIKE':
        return <FiHeart className="w-4 h-4 text-blue-500" />;
      case 'COMMENT':
        return <FiMessageSquare className="w-4 h-4 text-blue-500" />;
      case 'FOLLOW':
        return <FiUser className="w-4 h-4 text-blue-500" />;
      case 'SHARE':
        return <FiShare2 className="w-4 h-4 text-blue-500" />;
      case 'EVENT_ATTENDANCE':
        return <FiCalendar className="w-4 h-4 text-blue-500" />;
      default:
        return <FiBell className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    onClose();

    // ✅ NOTIFICAÇÃO DE COMMENT COM comment_id - BUSCA O COMENTÁRIO
    if (notification.type === 'COMMENT' && notification.post?.comment_id) {
      try {
        // Busca detalhes do comentário (não precisa armazenar em variável)
        await axios.get(`/posts/comments/${notification.post.comment_id}`);

        // Navega para a página de detalhes do post com o comentário aberto
        if (notification.post.share_id) {
          navigate(
            `/post/${notification.post.id}/share/${notification.post.share_id}`,
            {
              state: {
                openCommentId: notification.post.comment_id,
                scrollToComment: true,
              },
            }
          );
        } else {
          navigate(`/post/${notification.post.id}`, {
            state: {
              openCommentId: notification.post.comment_id,
              scrollToComment: true,
            },
          });
        }
      } catch (error) {
        console.error('Erro ao buscar comentário:', error);
        // Fallback: navega normal sem abrir comentário
        navigateToPostNormal(notification);
      }
    }
    // ✅ OUTRAS NOTIFICAÇÕES - COMPORTAMENTO NORMAL
    else if (notification.post && notification.post.id) {
      navigateToPostNormal(notification);
    }

    // Para notificações de FOLLOW
    if (notification.type === 'FOLLOW' && notification.actor.id) {
      navigate(`/profile/${notification.actor.id}`);
    }
  };

  // ✅ FUNÇÃO AUXILIAR PARA NAVEGAÇÃO NORMAL
  const navigateToPostNormal = (notification: any) => {
    if (notification.post.share_id) {
      navigate(
        `/post/${notification.post.id}/share/${notification.post.share_id}`
      );
    } else {
      navigate(`/post/${notification.post.id}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="fixed md:absolute right-2 left-2 md:left-auto top-16 md:top-full mt-2 w-auto md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-[80vh] md:max-h-[70vh] overflow-hidden mx-auto md:mx-0 focus:outline-none"
          style={{
            maxWidth: 'calc(100vw - 1rem)',
            width: 'min(400px, calc(100vw - 1rem))',
          }}
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-4 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Typography
                  variant="h2"
                  className="text-lg font-semibold text-gray-900"
                >
                  Notificações
                </Typography>
                {unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-6 h-6 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 flex-shrink-0 focus:outline-none"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Lista de Notificações */}
          <div className="overflow-y-auto max-h-96">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div>
                <Typography variant="p" className="text-sm">
                  Carregando notificações...
                </Typography>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <FiBell size={32} className="mb-3 text-gray-300" />
                <Typography
                  variant="h3"
                  className="text-sm font-medium mb-1 text-gray-600"
                >
                  Nenhuma notificação
                </Typography>
                <Typography variant="small" className="text-gray-400">
                  Novas interações aparecerão aqui
                </Typography>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="block text-left p-3 border-l-4 border-l-blue-200 bg-white 
  transition hover:bg-gray-50 focus:outline-none mx-auto w-full max-w-[340px]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.actor.avatar_url ? (
                          <img
                            src={resolveImageUrl(notification.actor.avatar_url)}
                            alt={notification.actor.name}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            <AvatarInitials name={notification.actor.name} />
                          </div>
                        )}
                      </div>

                      {/* Conteúdo principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getNotificationIcon(notification.type)}

                              <div className="flex items-center gap-1 min-w-0">
                                {/* Nome com ellipsis */}
                                <Typography
                                  variant="h3"
                                  className="text-sm font-semibold text-gray-900 truncate max-w-[140px]"
                                >
                                  {notification.actor.name}
                                </Typography>

                                {/* Mensagem continua na mesma linha */}
                                <Typography
                                  variant="p"
                                  className="text-sm text-gray-700 leading-relaxed whitespace-nowrap text-ellipsis overflow-hidden"
                                >
                                  {notification.message}
                                </Typography>
                              </div>
                            </div>

                            {/* Preview do post apenas para notificações com post */}
                            {notification.type !== 'FOLLOW' &&
                              notification.post && (
                                <div className="mt-2 flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200">
                                  {notification.post.image && (
                                    <img
                                      src={resolveImageUrl(
                                        notification.post.image
                                      )}
                                      alt="Post"
                                      className="w-6 h-6 md:w-8 md:h-8 rounded-md object-cover flex-shrink-0"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <Typography
                                    variant="small"
                                    className="text-xs text-gray-600 flex-1 break-words line-clamp-2"
                                  >
                                    {notification.post.content_preview}
                                  </Typography>
                                </div>
                              )}

                            <Typography
                              variant="small"
                              className="text-xs text-gray-400 mt-2"
                            >
                              {formatTimeAgo(notification.created_at)}
                            </Typography>
                          </div>

                          {/* ❌ REMOVIDO: Indicador de não lida (já marca todas como lidas ao abrir) */}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full py-2 text-sm text-blue-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium focus:outline-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      Carregando...
                    </div>
                  ) : (
                    'Carregar mais notificações'
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationDropdown;

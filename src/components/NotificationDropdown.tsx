// components/NotificationDropdown.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiX } from 'react-icons/fi';
import { useNotifications } from '../hooks/useNotifications';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Typography from './ui/Typography';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, unreadCount, loading, hasMore, fetchNotifications } =
    useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden text-[13px] outline-none focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <Typography
              variant="h3"
              className="!text-sm font-semibold text-gray-900"
            >
              Notificações
              {unreadCount > 0 && (
                <span className="ml-2 bg-accent text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Typography>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors focus:outline-none"
            >
              <FiX size={14} className="text-gray-500" />
            </button>
          </div>

          {/* Lista de Notificações */}
          <div className="overflow-y-auto max-h-80">
            {loading && notifications.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                <Typography variant="p" className="text-[13px]">
                  Carregando...
                </Typography>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <FiBell size={24} className="mx-auto mb-1 text-gray-300" />
                <Typography variant="small" className="text-[12px]">
                  Nenhuma notificação
                </Typography>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors group focus:outline-none"
                  >
                    <div className="flex gap-2">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {notification.actor.avatar_url ? (
                          <img
                            src={resolveImageUrl(notification.actor.avatar_url)}
                            alt={notification.actor.name}
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {notification.actor.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1">
                            <Typography
                              variant="p"
                              className="!text-[13px] text-gray-900 line-clamp-2 leading-snug"
                            >
                              <strong>{notification.actor.name}</strong>{' '}
                              <span className="text-gray-700 font-normal">
                                {notification.message
                                  ?.replace(notification.actor.name, '')
                                  .trim()}
                              </span>
                            </Typography>
                            {notification.post?.image && (
                              <div className="mt-1">
                                <img
                                  src={resolveImageUrl(notification.post.image)}
                                  alt="Post"
                                  className="w-10 h-10 rounded-md object-cover border border-gray-200"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <Typography
                              variant="small"
                              className="!text-[11px] text-gray-400 mt-1"
                            >
                              {formatTimeAgo(notification.created_at)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full py-1.5 text-xs text-accent hover:bg-accent/10 rounded transition-colors disabled:opacity-50 focus:outline-none"
                >
                  {loading ? 'Carregando...' : 'Carregar mais'}
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

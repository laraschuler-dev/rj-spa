// src/components/follow/FollowListModal.tsx (CORRIGIDO)
import React from 'react';
import { UserFollowerInfo } from '../../hooks/useFollow';
import Typography from '../ui/Typography';
import AvatarInitials from '../ui/AvatarInitials';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import FollowButton from './FollowButton';
import { useAuth } from '../../hooks/useAuth';

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserFollowerInfo[];
  title: string;
  onUserClick?: (userId: number) => void;
  onFollowChange?: (userId: number, isFollowing: boolean) => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  users,
  title,
  onUserClick,
  onFollowChange,
}) => {
  const { user: currentUser } = useAuth();

  if (!isOpen) return null;

  const handleUserClick = (userId: number) => {
    // Não permitir clique no próprio usuário
    if (userId === currentUser?.id) return;
    onUserClick?.(userId);
  };

  const handleFollowChange = (userId: number, isFollowing: boolean) => {
    // Atualizar o estado local do usuário
    onFollowChange?.(userId, isFollowing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h2" className="text-lg font-semibold">
              {title}
            </Typography>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="overflow-y-auto max-h-96">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Typography variant="p">Nenhum usuário encontrado</Typography>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                {/* Informações do usuário (clicável) */}
                <button
                  onClick={() => handleUserClick(user.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {/* Avatar */}
                  {user.profilePhoto ? (
                    <img
                      src={resolveImageUrl(user.profilePhoto)}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <AvatarInitials
                      name={user.name}
                      className="w-12 h-12 text-lg"
                    />
                  )}

                  {/* Informações do usuário */}
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="h3"
                      className="text-sm font-semibold text-gray-900 truncate"
                    >
                      {user.name}
                    </Typography>
                    {user.profileType && (
                      <Typography
                        variant="p"
                        className="text-xs text-gray-500 truncate"
                      >
                        {user.profileType}
                      </Typography>
                    )}
                    {user.bio && (
                      <Typography
                        variant="p"
                        className="text-xs text-gray-600 mt-1 line-clamp-2"
                      >
                        {user.bio}
                      </Typography>
                    )}
                  </div>
                </button>

                {/* Botão de Follow (apenas para outros usuários) */}
                {currentUser && user.id !== currentUser.id && (
                  <div className="ml-3 flex-shrink-0">
                    <FollowButton
                      targetUserId={user.id}
                      isFollowing={user.isFollowing}
                      onFollowChange={(isFollowing) =>
                        handleFollowChange(user.id, isFollowing)
                      }
                      size="sm"
                      variant="outline"
                      enableOptimisticUpdate={false}
                    />
                  </div>
                )}

                {/* Indicador para o próprio usuário */}
                {currentUser && user.id === currentUser.id && (
                  <div className="ml-3 flex-shrink-0">
                    <span className="text-xs text-gray-500 px-2 py-1">
                      Você
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;

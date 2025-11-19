// src/components/follow/FollowListModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUserClick = (userId: number) => {
    // Não permitir clique no próprio usuário
    if (userId === currentUser?.id) return;

    // ✅ REDIRECIONAR PARA O PERFIL
    navigate(`/profile/${userId}`);

    // Fechar o modal após o clique
    onClose();

    // Chamar callback se existir
    onUserClick?.(userId);
  };

  const handleFollowChange = (userId: number, isFollowing: boolean) => {
    onFollowChange?.(userId, isFollowing);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden focus:outline-none">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Typography variant="h2" className="text-lg font-semibold">
              {title}
            </Typography>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100 focus:outline-none" // ✅ REMOVE BORDA DE FOCO
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
                className="w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {/* ✅ LAYOUT FLEX COM QUEBRA CONTROLADA */}
                <div className="flex items-center justify-between gap-3 w-full">
                  {/* Lado esquerdo: Avatar + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <button
                      onClick={() => handleUserClick(user.id)}
                      className="flex-shrink-0 hover:opacity-80 transition-opacity focus:outline-none"
                    >
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
                    </button>

                    {/* Informações do usuário */}
                    <button
                      onClick={() => handleUserClick(user.id)}
                      className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity focus:outline-none"
                    >
                      <div className="min-w-0">
                        <Typography
                          variant="h3"
                          className="text-sm font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors"
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
                      </div>
                    </button>
                  </div>

                  {/* Lado direito: Botão (sempre visível) */}
                  <div className="flex-shrink-0 ml-2">
                    {currentUser && user.id !== currentUser.id ? (
                      <FollowButton
                        targetUserId={user.id}
                        isFollowing={user.isFollowing}
                        onFollowChange={(isFollowing) =>
                          handleFollowChange(user.id, isFollowing)
                        }
                        size="sm"
                        variant="outline"
                      />
                    ) : currentUser && user.id === currentUser.id ? (
                      <span className="text-xs text-gray-500 px-2 py-1 whitespace-nowrap">
                        Você
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;

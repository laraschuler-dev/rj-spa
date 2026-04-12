import React, { useState, useEffect } from 'react';
import { useFollow } from '../../hooks/useFollow';
import { useAuth } from '../../hooks/useAuth';

interface FollowButtonProps {
  targetUserId: number;
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'outline';
}

const FollowButton: React.FC<FollowButtonProps> = ({
  targetUserId,
  isFollowing: initialIsFollowing = false,
  onFollowChange,
  size = 'md',
  variant = 'primary',
}) => {
  const { user: currentUser } = useAuth();
  const { followUser, unfollowUser, loading, checkIsFollowing } = useFollow();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Verifica o status de follow quando o componente monta
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      if (currentUser?.id && currentUser.id !== targetUserId) {
        setIsLoadingStatus(true);
        const status = await checkIsFollowing(targetUserId);
        if (isMounted) {
          setIsFollowing(status);
          setIsLoadingStatus(false);
        }
      }
    };
    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [targetUserId, currentUser?.id, checkIsFollowing]);

  // Sincroniza com prop externa (caso o pai passe o estado)
  useEffect(() => {
    if (typeof initialIsFollowing === 'boolean') {
      setIsFollowing(initialIsFollowing);
      setIsLoadingStatus(false);
    }
  }, [initialIsFollowing]);

  // Não mostrar botão se for o próprio perfil ou não estiver logado
  if (!currentUser || currentUser.id === targetUserId) {
    return null;
  }

  // Enquanto o status de follow ainda não foi carregado, evita piscar
  if (isLoadingStatus || isFollowing === null) {
    return (
      <button
        disabled
        className={`px-4 py-2 text-sm bg-gray-100 text-gray-400 rounded-xl opacity-70 cursor-default`}
      >
        ...
      </button>
    );
  }

  const handleFollowToggle = async () => {
    if (loading) return;

    const success = isFollowing
      ? await unfollowUser(targetUserId)
      : await followUser(targetUserId);

    if (success) {
      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);
      onFollowChange?.(newIsFollowing);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: isFollowing
      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300'
      : 'bg-primary text-white hover:bg-primary-dark border border-primary',
    outline: isFollowing
      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
      : 'border border-primary text-primary hover:bg-primary hover:text-white',
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-medium rounded-xl transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {isFollowing ? 'Deixando...' : 'Seguindo...'}
        </span>
      ) : isFollowing ? (
        'Seguindo'
      ) : (
        'Seguir'
      )}
    </button>
  );
};

export default FollowButton;

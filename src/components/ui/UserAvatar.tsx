// src/components/ui/UserAvatar.tsx
import { useProfile } from '../../hooks/useProfile';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showType?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  size = 'md',
  showName = false,
  showType = false,
  className = '',
}) => {
  const { user, profile } = useProfile();

  // Função para obter as iniciais do usuário
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Tamanhos configuráveis
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const borderClasses = {
    sm: 'border',
    md: 'border-2',
    lg: 'border-2',
  };

  const renderAvatar = () => {
    if (profile?.profile_photo) {
      const imageUrl = resolveImageUrl(profile.profile_photo);
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className={`${sizeClasses[size]} rounded-full object-cover ${borderClasses[size]} border-white`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} bg-accent rounded-full flex items-center justify-center text-white font-semibold ${borderClasses[size]} border-white`}
      >
        {getUserInitials()}
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {renderAvatar()}
      {(showName || showType) && (
        <div className="text-left">
          {showName && (
            <p className="text-sm font-medium leading-none">
              {size === 'sm'
                ? user?.name?.split(' ')[0]
                : user?.name || 'Usuário'}
            </p>
          )}
          {showType && profile?.translated_type && (
            <p className="text-xs text-gray-500 leading-none mt-1">
              {profile.translated_type}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

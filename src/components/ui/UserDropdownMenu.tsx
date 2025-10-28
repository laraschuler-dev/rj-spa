// src/components/ui/UserDropdownMenu.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown, FiHome } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useLogout } from '../../hooks/useLogout';
import { useProfile } from '../../hooks/useProfile';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import AvatarInitials from './AvatarInitials';

interface UserDropdownMenuProps {
  variant?: 'header' | 'standalone';
  className?: string;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  variant = 'header',
  className = '',
}) => {
  const logout = useLogout();
  const { user, profile } = useProfile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleUserMenuAction = (action?: () => void) => {
    setIsUserMenuOpen(false);
    if (action) action();
  };

  // ✅ Se o usuário tem foto
  const hasProfilePhoto = Boolean(profile?.profile_photo);

  // Função para obter a foto de perfil ou mostrar as iniciais (PEQUENA)
  // — agora usa isUserMenuOpen e hasProfilePhoto para ajustar só o avatar quando necessário
  const renderUserAvatar = () => {
    if (hasProfilePhoto) {
      const imageUrl = resolveImageUrl(profile!.profile_photo);
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }

    // Avatar genérico: adiciona ring/border quando menu está aberto para separá-lo do bg do botão
    const baseClasses =
      'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold';
    const openStateClasses = isUserMenuOpen
      ? 'ring-2 ring-white/70 shadow-sm' // separação clara quando o botão fica bg-accent
      : '';

    return (
      <div className={`${baseClasses} bg-accent ${openStateClasses}`}>
        <AvatarInitials name={user?.name} />
      </div>
    );
  };

  // Versão maior do avatar para o dropdown
  const renderLargeUserAvatar = () => {
    if (hasProfilePhoto) {
      const imageUrl = resolveImageUrl(profile!.profile_photo);
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }

    // Avatar genérico grande: também ganha ring quando o menu estiver aberto
    const baseClasses =
      'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold';
    const openStateClasses = isUserMenuOpen
      ? 'ring-2 ring-white/70 shadow-sm'
      : '';

    return (
      <div className={`${baseClasses} bg-accent ${openStateClasses}`}>
        <AvatarInitials name={user?.name} />
      </div>
    );
  };

  // Determinar qual item mostrar baseado na localização atual
  const getNavigationItem = () => {
    const isOnHomePage = location.pathname === '/';

    if (isOnHomePage) {
      return {
        to: '/feed',
        icon: <FiHome size={16} />,
        text: 'Feed',
        isActive: false,
      };
    } else {
      return {
        to: '/profile',
        icon: <CgProfile size={16} />,
        text: 'Meu Perfil',
        isActive: location.pathname === '/profile',
      };
    }
  };

  const navItem = getNavigationItem();

  // Estilos baseados na variante (mantive a tua lógica)
  const buttonStyles = {
    header: `flex items-center gap-2 p-2 rounded transition-all duration-200 group focus:outline-none ${
      isUserMenuOpen
        ? 'bg-accent text-white shadow-md'
        : hasProfilePhoto
          ? 'hover:bg-primary-dark/50 hover:text-accent'
          : 'hover:bg-primary-dark/30 hover:text-accent hover:border-accent/20'
    }`,
    standalone: `flex items-center gap-2 p-2 rounded-lg transition-all duration-200 group border border-gray-200 focus:outline-none ${
      isUserMenuOpen
        ? 'bg-accent text-white shadow-md'
        : hasProfilePhoto
          ? 'hover:bg-gray-50 hover:border-gray-300'
          : 'hover:bg-gray-100 hover:border-gray-300 hover:border-accent/20'
    }`,
  };

  return (
    <div className={`relative ${className}`} ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className={buttonStyles[variant]}
        aria-label="Menu do usuário"
        aria-expanded={isUserMenuOpen}
      >
        <div className="flex items-center gap-2">
          {renderUserAvatar()}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none">
              {user?.name?.split(' ')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-background/70 leading-none mt-1">
              {profile?.translated_type &&
              profile.translated_type !== 'Não informado'
                ? profile.translated_type
                : ''}
            </p>
          </div>
        </div>
        <FiChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          } ${variant === 'header' ? 'text-background' : 'text-gray-500'}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Header do usuário */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {renderLargeUserAvatar()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || ''}
                </p>
                {profile?.translated_type &&
                  profile.translated_type !== 'Não informado' && (
                    <p className="text-xs text-accent font-medium mt-1">
                      {profile.translated_type}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* ÚNICO item de navegação (contextual) */}
          <Link
            to={navItem.to}
            onClick={() => handleUserMenuAction()}
            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors focus:outline-none ${
              navItem.isActive
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {navItem.icon}
            <span>{navItem.text}</span>
          </Link>

          {/* Configurações */}
          <Link
            to="/account-settings"
            onClick={() => handleUserMenuAction()}
            className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors focus:outline-none ${
              location.pathname === '/account-settings'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiSettings size={16} />
            <span>Configurações</span>
          </Link>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={() => handleUserMenuAction(logout)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left focus:outline-none rounded"
          >
            <FiLogOut size={16} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
};

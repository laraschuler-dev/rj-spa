// src/components/ui/UserDropdownMobile.tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSettings, FiLogOut, FiChevronDown, FiHome } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { useLogout } from '../../hooks/useLogout';
import { useProfile } from '../../hooks/useProfile';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

export const UserDropdownMobile: React.FC = () => {
  const logout = useLogout();
  const { user, profile } = useProfile();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const renderUserAvatar = () => {
    if (profile?.profile_photo) {
      const imageUrl = resolveImageUrl(profile.profile_photo);
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className="w-8 h-8 rounded-full object-cover border-2 border-background"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }

    return (
      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {getUserInitials()}
      </div>
    );
  };

  const getNavigationItem = () => {
    const isOnHomePage = location.pathname === '/';

    if (isOnHomePage) {
      return {
        to: '/feed',
        icon: <FiHome size={18} />,
        text: 'Feed',
        isActive: false,
      };
    } else {
      return {
        to: '/profile',
        icon: <CgProfile size={18} />,
        text: 'Meu Perfil',
        isActive: location.pathname === '/profile',
      };
    }
  };

  const navItem = getNavigationItem();

  return (
    <div className="relative w-full" ref={userMenuRef}>
      <button
        onClick={toggleUserMenu}
        className="flex items-center justify-between w-full p-3 rounded-lg bg-primary-dark/30 hover:bg-primary-dark/50 transition-all duration-200 focus:outline-none"
        aria-label="Menu do usuário"
        aria-expanded={isUserMenuOpen}
      >
        <div className="flex items-center gap-3">
          {renderUserAvatar()}
          <div className="text-left">
            <p className="text-sm font-medium text-background">
              {user?.name?.split(' ')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-background/70">
              {profile?.translated_type || 'Membro'}
            </p>
          </div>
        </div>
        <FiChevronDown
          size={16}
          className={`text-background transition-transform duration-200 ${
            isUserMenuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
          <Link
            to={navItem.to}
            onClick={() => handleUserMenuAction()}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors focus:outline-none ${
              navItem.isActive
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {navItem.icon}
            <span>{navItem.text}</span>
          </Link>

          <Link
            to="/account-settings"
            onClick={() => handleUserMenuAction()}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors focus:outline-none ${
              location.pathname === '/account-settings'
                ? 'bg-accent/10 text-accent font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FiSettings size={18} />
            <span>Configurações</span>
          </Link>

          <div className="border-t border-gray-100 my-1"></div>

          <button
            onClick={() => handleUserMenuAction(logout)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left focus:outline-none"
          >
            <FiLogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
};

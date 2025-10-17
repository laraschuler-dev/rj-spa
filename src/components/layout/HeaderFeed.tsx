// src/components/HeaderFeed.tsx - COM resolveImageUrl NO AVATAR
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBell,
  FiMenu,
  FiLogOut,
  FiHome,
  FiSettings,
  FiBriefcase,
  FiCalendar,
  FiGift,
  FiChevronDown,
} from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import MobileMenuFeed from '../ui/MobileMenuFeed';
import { useLogout } from '../../hooks/useLogout';
import { useProfile } from '../../hooks/useProfile';
import SearchBar from '../SearchBar';
import SearchBarMobile from '../SearchBarMobile';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import NotificationDropdown from '../NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';

const HeaderFeed: React.FC = () => {
  const logout = useLogout();
  const { user, profile, loading } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { unreadCount, fetchUnreadCount } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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

  // Função para obter as iniciais do usuário
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Função para obter a foto de perfil ou mostrar as iniciais
  const renderUserAvatar = () => {
    if (profile?.profile_photo) {
      const imageUrl = resolveImageUrl(profile.profile_photo); // ← Use resolveImageUrl aqui
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
          onError={(e) => {
            // Fallback para iniciais se a imagem não carregar
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // O fallback será mostrado pela div abaixo
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

  // Versão maior do avatar para o dropdown
  const renderLargeUserAvatar = () => {
    if (profile?.profile_photo) {
      const imageUrl = resolveImageUrl(profile.profile_photo); // ← Use resolveImageUrl aqui
      return (
        <img
          src={imageUrl}
          alt={user?.name || 'Usuário'}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            // Fallback para iniciais se a imagem não carregar
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
        {getUserInitials()}
      </div>
    );
  };

  return (
    <header className="bg-primary text-background py-4 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Logo + Navegação Principal */}
      <div className="flex items-center gap-2 md:gap-10 flex-shrink-0">
        {/* Logo */}
        <Link
          to="/"
          className="text-lg md:text-xl font-heading font-bold cursor-pointer hover:text-accent transition-colors whitespace-nowrap"
        >
          Redefinindo Jornadas
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-0 bg-primary-dark/20 rounded-lg p-1">
          <Link
            to="/feed"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-all duration-200 ${
              location.pathname === '/feed'
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark/50 hover:text-accent'
            }`}
          >
            <FiHome size={16} />
            <span>Feed</span>
          </Link>
          <Link
            to="/donations"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-all duration-200 ${
              location.pathname === '/donations'
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark/50 hover:text-accent'
            }`}
          >
            <FiGift size={16} />
            <span>Doações</span>
          </Link>
          <Link
            to="/events"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-all duration-200 ${
              location.pathname === '/events'
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark/50 hover:text-accent'
            }`}
          >
            <FiCalendar size={16} />
            <span>Eventos</span>
          </Link>
          <Link
            to="/services"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm transition-all duration-200 ${
              location.pathname === '/services'
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark/50 hover:text-accent'
            }`}
          >
            <FiBriefcase size={16} />
            <span>Serviços</span>
          </Link>
        </nav>
      </div>

      {/* SearchBar - Centralizado com mais espaço */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-10">
        <SearchBar />
      </div>

      {/* Área do Usuário COM AVATAR REAL E resolveImageUrl */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="md:hidden">
          <SearchBarMobile />
        </div>

        {/* Ícones de Ação */}
        <div className="flex items-center gap-1 md:gap-2 bg-primary-dark/20 rounded-lg p-1">
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                fetchUnreadCount(); // Atualizar contador ao abrir
              }}
              className="relative p-2 rounded-md hover:bg-primary-dark hover:text-accent transition-all duration-200 group"
              aria-label="Notificações"
            >
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Menu do Usuário - COM AVATAR REAL E resolveImageUrl */}
          <div className="hidden md:block relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className={`flex items-center gap-2 p-2 rounded transition-all duration-200 group ${
                isUserMenuOpen
                  ? 'bg-accent text-white shadow-md'
                  : 'hover:bg-primary-dark/50 hover:text-accent'
              }`}
              aria-label="Menu do usuário"
              aria-expanded={isUserMenuOpen}
            >
              {/* Avatar do usuário */}
              <div className="flex items-center gap-2">
                {renderUserAvatar()}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">
                    {user?.name?.split(' ')[0] || 'Usuário'}
                  </p>
                  <p className="text-xs text-background/70 leading-none mt-1">
                    {profile?.translated_type || 'Membro'}
                  </p>
                </div>
              </div>
              <FiChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95">
                {/* Header do usuário com informações reais */}
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
                      {profile?.translated_type && (
                        <p className="text-xs text-accent font-medium mt-1">
                          {profile.translated_type}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Itens do menu */}
                <Link
                  to="/profile"
                  onClick={() => handleUserMenuAction()}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    location.pathname === '/profile'
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <CgProfile size={16} />
                  <span>Meu Perfil</span>
                </Link>

                <Link
                  to="/account-settings"
                  onClick={() => handleUserMenuAction()}
                  className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    location.pathname === '/account-settings'
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <FiSettings size={16} />
                  <span>Configurações</span>
                </Link>

                {/* Separador */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout */}
                <button
                  onClick={() => handleUserMenuAction(logout)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
                >
                  <FiLogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Separador Visual */}
        <div className="hidden md:block h-5 w-px bg-primary-dark/50 mx-1"></div>

        {/* Menu Mobile */}
        <button
          className="md:hidden p-1.5 rounded hover:bg-primary-dark/50 transition-all duration-200"
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Menu Mobile */}
      <MobileMenuFeed
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default HeaderFeed;

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBell,
  FiMenu,
  FiHome,
  FiBriefcase,
  FiCalendar,
  FiGift,
} from 'react-icons/fi';
import MobileMenuFeed from '../ui/MobileMenuFeed';
import SearchBar from '../ui/SearchBar';
import SearchBarMobile from '../ui/SearchBarMobile';
import NotificationDropdown from '../ui/NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';
import { UserDropdownMenu } from '../ui/UserDropdownMenu';
import { Sparkles } from 'lucide-react';
import { useScrollStore } from '../../stores/scrollStore';

const HeaderFeed: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { unreadCount, fetchUnreadCount, markAllAsRead } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const [hasMarkedOnOpen, setHasMarkedOnOpen] = useState(false);

  useEffect(() => {
    if (!isNotificationsOpen) {
      setHasMarkedOnOpen(false);
      return;
    }

    if (!hasMarkedOnOpen) {
      markAllAsRead();
      setHasMarkedOnOpen(true);
    }
  }, [isNotificationsOpen, hasMarkedOnOpen, markAllAsRead]);

  const { shouldRestoreNotifications, clearNotificationsRestore } =
    useScrollStore();

  useEffect(() => {
    console.log('🔔 HeaderFeed - Effect triggered', {
      shouldRestoreNotifications,
      pathname: location.pathname,
      state: location.state,
    });

    const shouldOpenNotifications =
      shouldRestoreNotifications || location.state?.restoreNotifications;

    if (shouldOpenNotifications && location.pathname === '/feed') {
      setIsNotificationsOpen(true);

      // Limpa ambos os estados
      clearNotificationsRestore();
      // Limpa o state da location para evitar reabertura
      window.history.replaceState(
        { ...location.state, restoreNotifications: false },
        ''
      );
    }
  }, [shouldRestoreNotifications, location, clearNotificationsRestore]);

  return (
    <header className="bg-primary text-background py-4 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-primary-dark/20">
      <div className="flex items-center gap-2 md:gap-10 flex-shrink-0">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-1.5 text-base md:text-2xl font-heading font-bold cursor-pointer text-white bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent/30 transition-all duration-300 whitespace-nowrap px-2 py-1 md:px-4 md:py-2 rounded-lg border-2 border-accent shadow-lg hover:shadow-xl"
        >
          <Sparkles className="w-3 h-3 md:w-5 md:h-5" />
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

      <div className="hidden md:flex flex-1 max-w-2xl mx-10">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="md:hidden">
          <SearchBarMobile />
        </div>

        {/* Ícones de Ação */}
        <div className="flex items-center gap-1 md:gap-2 bg-primary-dark/20 rounded-lg p-1">
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-md hover:bg-primary-dark hover:text-accent transition-all duration-200 group focus:outline-none"
              aria-label="Notificações"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          <div className="hidden md:block">
            <UserDropdownMenu variant="header" />
          </div>
        </div>

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

      <MobileMenuFeed
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default HeaderFeed;

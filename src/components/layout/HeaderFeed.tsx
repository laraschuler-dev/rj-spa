// src/components/HeaderFeed.tsx - VERSÃO COM LOGO MAIOR E ESPAÇAMENTO AJUSTADO
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell,
  FiMenu,
  FiLogOut,
  FiHome,
  FiSettings,
  FiBriefcase,
  FiCalendar,
  FiGift,
} from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import MobileMenuFeed from '../ui/MobileMenuFeed';
import { useLogout } from '../../hooks/useLogout';
import SearchBar from '../SearchBar';
import SearchBarMobile from '../SearchBarMobile';

const HeaderFeed: React.FC = () => {
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-primary text-background py-4 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Logo + Navegação Principal */}
      <div className="flex items-center gap-2 md:gap-10 flex-shrink-0">
        {/* Logo - MAIOR no mobile */}
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm hover:bg-primary-dark/50 hover:text-accent transition-all duration-200"
          >
            <FiHome size={16} />
            <span>Feed</span>
          </Link>
          <Link
            to="/donations"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm hover:bg-primary-dark/50 hover:text-accent transition-all duration-200"
          >
            <FiGift size={16} />
            <span>Doações</span>
          </Link>
          <Link
            to="/events"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm hover:bg-primary-dark/50 hover:text-accent transition-all duration-200"
          >
            <FiCalendar size={16} />
            <span>Eventos</span>
          </Link>
          <Link
            to="/services"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-sm hover:bg-primary-dark/50 hover:text-accent transition-all duration-200"
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

      {/* Área do Usuário - MOBILE OTIMIZADO */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="md:hidden">
          <SearchBarMobile />
        </div>
        {/* Ícones de Ação - ESPAÇAMENTO REDUZIDO no mobile */}
        <div className="flex items-center gap-1 md:gap-2 bg-primary-dark/20 rounded-lg p-1">
          <Link to="/notificacoes" aria-label="Notificações">
            <FiBell
              size={18}
              className="hover:text-accent transition-all duration-200 group"
            />
          </Link>
          {/* Perfil - Apenas Desktop */}
          <Link
            to="/profile"
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded hover:bg-primary-dark/50 hover:text-accent transition-all duration-200 group"
          >
            <CgProfile size={18} />
            <span className="text-sm">Perfil</span>
          </Link>
          {/* Configurações - Apenas Desktop */}
          <Link
            to="/account-settings"
            className="hidden md:flex p-1.5 rounded hover:bg-primary-dark/50 hover:text-accent transition-all duration-200 group"
            aria-label="Configurações"
          >
            <FiSettings size={18} />
          </Link>
          {/* Logout - Apenas Desktop */}
          <button
            onClick={logout}
            className="hidden md:flex p-1.5 rounded hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 group"
            aria-label="Sair"
          >
            <FiLogOut size={18} />
          </button>
        </div>
        {/* Separador Visual */}
        <div className="hidden md:block h-5 w-px bg-primary-dark/50 mx-1"></div>
        {/* Menu Mobile */}
        <button
          className="md:hidden p-1.5 rounded hover:bg-primary-dark/50 transition-all duration-200"
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <FiMenu size={28} />{' '}
          {/* ← Ajustei para 22 (equilibrado com o bell) */}
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

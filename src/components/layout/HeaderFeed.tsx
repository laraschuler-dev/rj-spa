import React from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiMail, FiMenu, FiLogOut } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import MobileMenuFeed from '../ui/MobileMenuFeed';
import { useLogout } from '../../hooks/useLogout';
import { FiSettings } from 'react-icons/fi';

const HeaderFeed: React.FC = () => {
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-primary text-background py-4 px-6 shadow-md flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Logo / Home */}
      <Link to="/" className="text-xl md:text-2xl font-heading cursor-pointer">
        Redefinindo Jornadas
      </Link>

      {/* Acoes principais - oculto no mobile */}
      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/posts/general"
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Criar Post
        </Link>
        <Link
          to="/meus-posts"
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Meus Posts
        </Link>
        <Link
          to="/eventos"
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Eventos
        </Link>
        <Link
          to="/eventos"
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Serviços
        </Link>
      </nav>

      {/* Ícones e Perfil */}
      <div className="flex items-center gap-4">
        {/* Ícones visíveis em todas as telas */}
        <Link to="/mensagens" aria-label="Mensagens">
          <FiMail size={24} className="hover:text-accent transition" />
        </Link>
        <Link to="/notificacoes" aria-label="Notificações">
          <FiBell size={24} className="hover:text-accent transition" />
        </Link>

        {/* Só visível no desktop */}
        <Link
          to="/profile"
          className="hidden md:flex items-center gap-1 hover:text-accent transition"
        >
          <CgProfile size={24} />
        </Link>
        <Link
          to="/account-settings"
          className="hidden md:flex items-center gap-1 hover:text-accent transition"
        >
          <FiSettings size={24} />
        </Link>
        <Link
          to="/login"
          onClick={logout}
          aria-label="Sair"
          className="hidden md:flex hover:text-red-300 transition"
        >
          <FiLogOut size={24} />
        </Link>
      </div>

      {/* Mobile - menu hamburguer */}
      <button
        className="md:hidden"
        aria-label="Abrir menu"
        onClick={() => setIsMenuOpen(true)}
      >
        <FiMenu size={26} />
      </button>
      <MobileMenuFeed
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
};

export default HeaderFeed;

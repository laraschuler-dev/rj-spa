import React, { useState } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { CgLogIn, CgProfile } from 'react-icons/cg';
import { FiMenu } from 'react-icons/fi';
import MobileMenu from '../ui/MobileMenu';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = false; // TODO: Substituir por lógica real de autenticação

  return (
    <header className="bg-primary text-background py-4 px-6 shadow-md flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      {!isMenuOpen && (
        <ScrollLink
          to="introduction"
          smooth={true}
          duration={500}
          className="text-xl md:text-2xl font-heading cursor-pointer"
        >
          Redefinindo Jornadas
        </ScrollLink>
      )}

      {/* Navegação Desktop */}
      <nav className="hidden md:flex gap-6">
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Quem Somos
        </ScrollLink>
        <ScrollLink
          to="information"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Informações
        </ScrollLink>
        <ScrollLink
          to="events"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Eventos
        </ScrollLink>
        <ScrollLink
          to="services"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Serviços
        </ScrollLink>
        <ScrollLink
          to="donate"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Como Doar
        </ScrollLink>
        <ScrollLink
          to="contact"
          smooth={true}
          duration={500}
          className="hover:text-accent transition-colors cursor-pointer"
        >
          Contato
        </ScrollLink>
      </nav>

      {/* Botão Login / Perfil */}
      <div className="hidden md:flex">
        {isAuthenticated ? (
          <ScrollLink
            to="profile"
            smooth={true}
            duration={500}
            className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer"
          >
            <CgProfile size={24} />
            <span className="font-body">Perfil</span>
          </ScrollLink>
        ) : (
          <ScrollLink
            to="login"
            smooth={true}
            duration={500}
            className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer"
          >
            <CgLogIn size={24} />
            <span className="font-body">Entrar</span>
          </ScrollLink>
        )}
      </div>

      {/* Botão Menu Hambúrguer (Mobile) */}
      {!isMenuOpen && (
        <button
          className="md:hidden text-background"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <FiMenu size={28} />
        </button>
      )}

      {/* Menu Mobile */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={false}
      />
    </header>
  );
};

export default Header;

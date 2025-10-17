import React, { useState, useEffect } from 'react'; // ← Adicione useEffect
import { Link as ScrollLink } from 'react-scroll';
import { CgLogIn, CgProfile } from 'react-icons/cg';
import { FiMenu } from 'react-icons/fi';
import MobileMenu from '../ui/MobileMenu';
import { Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction'); // ← Estado para seção ativa
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;

  // Detecta qual seção está visível (simplificado)
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'about',
        'information',
        'events',
        'services',
        'donate',
        'contact',
      ];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="bg-primary text-background py-4 px-6 shadow-md flex items-center justify-between fixed top-0 left-0 w-full z-50">
      {!isMenuOpen && (
        <ScrollLink
          to="introduction"
          smooth={true}
          duration={500}
          className="text-xl md:text-2xl font-heading font-bold cursor-pointer hover:text-accent transition-colors"
        >
          Redefinindo Jornadas
        </ScrollLink>
      )}

      {/* Navegação Desktop COM ESTADO ATIVO */}
      <nav className="hidden md:flex items-center gap-0 bg-primary-dark/20 rounded-lg p-1">
        {' '}
        {/* ← Adicionei container estilizado */}
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'about'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Quem Somos
        </ScrollLink>
        <ScrollLink
          to="information"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'information'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Informações
        </ScrollLink>
        <ScrollLink
          to="events"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'events'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Eventos
        </ScrollLink>
        <ScrollLink
          to="services"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'services'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Serviços
        </ScrollLink>
        <ScrollLink
          to="donate"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'donate'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Como Doar
        </ScrollLink>
        <ScrollLink
          to="contact"
          smooth={true}
          duration={500}
          className={`px-3 py-2 rounded text-sm transition-all duration-200 cursor-pointer ${
            activeSection === 'contact'
              ? 'bg-accent text-white shadow-md hover:bg-accent/90'
              : 'hover:bg-primary-dark/50 hover:text-accent'
          }`}
        >
          Contato
        </ScrollLink>
      </nav>

      {/* Botão Login / Perfil */}
      <div className="hidden md:flex">
        {isAuthenticated ? (
          <Link
            to="/feed"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-primary-dark/20 hover:bg-primary-dark/50 hover:text-accent transition-all duration-200" // ← Estilo consistente
          >
            <CgProfile size={18} /> {/* ← Ícone menor */}
            <span>Feed</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm bg-primary-dark/20 hover:bg-primary-dark/50 hover:text-accent transition-all duration-200" // ← Estilo consistente
          >
            <CgLogIn size={18} /> {/* ← Ícone menor */}
            <span>Entrar</span>
          </Link>
        )}
      </div>

      {/* Botão Menu Hambúrguer (Mobile) */}
      {!isMenuOpen && (
        <button
          className="md:hidden p-2 rounded hover:bg-primary-dark/50 transition-all duration-200" // ← Estilo consistente
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <FiMenu size={22} /> {/* ← Ícone menor */}
        </button>
      )}

      {/* Menu Mobile */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};

export default Header;

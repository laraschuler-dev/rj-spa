// src/components/ui/MobileMenu.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CgLogIn } from 'react-icons/cg';
import {
  FiHeart,
  FiGift,
  FiAlertCircle,
  FiUsers,
  FiBriefcase,
} from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { useState, useEffect } from 'react';
import { UserDropdownMobile } from './UserDropdownMobile';
import { Sparkles } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar a seção ativa - simplificado
  const [activeSection, setActiveSection] = useState('');

  // Detecta a seção ativa baseada no hash da URL ou scroll
  useEffect(() => {
    if (isOpen && location.pathname === '/') {
      // Tenta pegar do hash da URL primeiro
      const hash = window.location.hash.replace('#', '');
      if (
        hash &&
        [
          'about',
          'information',
          'events',
          'services',
          'donate',
          'contact',
        ].includes(hash)
      ) {
        setActiveSection(hash);
        return;
      }

      // Fallback: detecta seção visível de forma mais robusta
      const detectActiveSection = () => {
        const sections = [
          'about',
          'information',
          'events',
          'services',
          'donate',
          'contact',
        ];
        let currentSection = '';

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Se o topo do elemento está perto do topo da viewport
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = section;
              break;
            }
          }
        }

        if (currentSection) {
          setActiveSection(currentSection);
        }
      };

      // Executa imediatamente e configura listener
      detectActiveSection();
      window.addEventListener('scroll', detectActiveSection, { passive: true });

      return () => window.removeEventListener('scroll', detectActiveSection);
    }
  }, [isOpen, location.pathname]);

  const handleNavigation = (path: string, sectionId?: string) => {
    if (sectionId) {
      setActiveSection(sectionId);
      // Atualiza a URL com hash para persistir o estado
      window.history.replaceState(null, '', `/#${sectionId}`);
    }
    navigate(path);
    onClose();

    setTimeout(() => {
      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };

  const handleLogoClick = () => {
    setActiveSection('introduction');
    window.history.replaceState(null, '', '/');
    scroll.scrollToTop({ duration: 500, smooth: true });
    onClose();
  };

  // Função auxiliar para verificar seção ativa
  const isSectionActive = (sectionId: string) => {
    return location.pathname === '/' && activeSection === sectionId;
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-primary to-primary/95 text-background shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
    >
      {/* Botão de Fechar */}
      <button
        className="absolute top-4 right-4 text-background text-3xl z-50 focus:outline-none"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <IoMdClose />
      </button>

      <div className="flex justify-center mt-6 mb-4">
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-1.5 text-base font-heading font-bold cursor-pointer text-white bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent/30 transition-all duration-300 whitespace-nowrap px-2 py-1.5 rounded-lg border border-accent shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-3 h-3" />
          Redefinindo Jornadas
        </Link>
      </div>

      {/* UserDropdownMobile - QUANDO AUTENTICADO */}
      {isAuthenticated ? (
        <div className="mb-4">
          <UserDropdownMobile />
        </div>
      ) : (
        /* Botão de Login - QUANDO NÃO AUTENTICADO */
        <div className="mb-4">
          <Link
            to="/login"
            className="flex items-center gap-3 p-3 rounded-lg bg-primary-dark/30 hover:bg-primary-dark/50 hover:text-accent transition-all duration-200 w-full"
            onClick={onClose}
          >
            <CgLogIn size={20} />
            <span className="font-medium">Fazer Login</span>
          </Link>
        </div>
      )}

      <hr className="border-background opacity-50 mb-4" />

      {/* Navegação do Site COM ESTADO ATIVO CORRIGIDO */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Navegar no Site
        </h3>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => handleNavigation('/', 'about')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('about')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Quem Somos</span>
          </button>
          <button
            onClick={() => handleNavigation('/', 'information')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('information')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Informações</span>
          </button>
          <button
            onClick={() => handleNavigation('/', 'events')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('events')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Eventos</span>
          </button>
          <button
            onClick={() => handleNavigation('/', 'services')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('services')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Serviços</span>
          </button>
          <button
            onClick={() => handleNavigation('/', 'donate')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('donate')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Como Doar</span>
          </button>
          <button
            onClick={() => handleNavigation('/', 'contact')}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 text-left ${
              isSectionActive('contact')
                ? 'bg-accent text-white shadow-md hover:bg-accent/90'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Contato</span>
          </button>
        </nav>
      </div>

      <hr className="border-background opacity-50 my-4" />

      {/* Ações Rápidas - DISPONÍVEL PARA TODOS (autenticados e não autenticados) */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Ações Rápidas
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to={isAuthenticated ? '/posts/create/9' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdOutlinePostAdd size={18} />
            <span>Postar</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/8' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdEventAvailable size={18} />
            <span>Criar Evento</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/3' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdOutlineCampaign size={18} />
            <span>Criar Campanha</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/6' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <PiStudent size={18} />
            <span>Oferecer Curso</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/1' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiGift size={18} />
            <span>Quero Doar</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/5' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiHeart size={18} />
            <span>Quero Voluntariar</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/4' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiUsers size={18} />
            <span>Preciso de Ajuda</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/7' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiBriefcase size={18} />
            <span>Anunciar Vaga</span>
          </Link>
          <Link
            to={isAuthenticated ? '/posts/create/2' : '/login'}
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiAlertCircle size={18} />
            <span>Denunciar Violência</span>
          </Link>
        </nav>
      </div>
    </motion.div>
  );
};

export default MobileMenu;

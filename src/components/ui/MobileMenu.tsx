import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CgLogIn, CgProfile } from 'react-icons/cg';
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
      className="fixed top-0 right-0 w-64 h-full bg-primary text-background shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
    >
      {/* Botão de Fechar */}
      <button
        className="absolute top-4 right-4 text-background text-3xl z-50"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <IoMdClose />
      </button>

      {/* Logo */}
      <h2
        className="text-xl font-heading font-bold hover:text-accent transition-colors mb-4 mt-8 cursor-pointer"
        onClick={handleLogoClick}
      >
        Redefinindo Jornadas
      </h2>

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

      {/* Acesso à Plataforma */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Plataforma
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to={isAuthenticated ? '/feed' : '/login'}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
            onClick={onClose}
          >
            {isAuthenticated ? <CgProfile size={18} /> : <CgLogIn size={18} />}
            <span>{isAuthenticated ? 'Ir para o Feed' : 'Fazer Login'}</span>
          </Link>
        </nav>
      </div>

      <hr className="border-background opacity-50 my-4" />

      {/* Criar Conteúdo */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Ações Rápidas
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to="/posts/create/9"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdOutlinePostAdd size={18} />
            <span>Postar</span>
          </Link>
          <Link
            to="/posts/create/8"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdEventAvailable size={18} />
            <span>Criar Evento</span>
          </Link>
          <Link
            to="/posts/create/3"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdOutlineCampaign size={18} />
            <span>Criar Campanha</span>
          </Link>
          <Link
            to="/posts/create/6"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <PiStudent size={18} />
            <span>Oferecer Curso</span>
          </Link>
          <Link
            to="/posts/create/1"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiGift size={18} />
            <span>Quero Doar</span>
          </Link>
          <Link
            to="/posts/create/5"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiHeart size={18} />
            <span>Quero Voluntariar</span>
          </Link>
          <Link
            to="/posts/create/4"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiUsers size={18} />
            <span>Preciso de Ajuda</span>
          </Link>
          <Link
            to="/posts/create/7"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiBriefcase size={18} />
            <span>Anunciar Vaga</span>
          </Link>
          <Link
            to="/posts/complaint"
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

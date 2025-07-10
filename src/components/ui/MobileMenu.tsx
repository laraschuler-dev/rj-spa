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
import { useNavigate } from 'react-router-dom';
import { animateScroll as scroll } from 'react-scroll';
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';

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

  const handleNavigation = (path: string, sectionId?: string) => {
    navigate(path); // Navega para a rota desejada
    onClose(); // Fecha o menu

    setTimeout(() => {
      if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100); // Timeout para garantir que a navegação ocorreu antes do scroll
  };

  const handleLogoClick = () => {
    scroll.scrollToTop({ duration: 500, smooth: true });
    onClose(); // Fecha o menu ao clicar no logo
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-64 h-full bg-primary text-background shadow-lg z-50 p-6 flex flex-col"
    >
      {/* Botão de Fechar no Topo Direito */}
      <button
        className="absolute top-4 right-4 text-background text-3xl z-50"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <IoMdClose />
      </button>

      {/* Logo (Agora com clique para scrollar ao topo) */}
      <h2
        className="text-xl font-heading mb-4 mt-8 cursor-pointer"
        onClick={handleLogoClick}
      >
        Redefinindo Jornadas
      </h2>
      <hr className="border-background opacity-50" />

      {/* Links de Navegação */}
      <nav className="flex flex-col gap-4 mt-4">
        <button
          onClick={() => handleNavigation('/', 'about')}
          className="hover:text-accent transition-colors"
        >
          Quem Somos
        </button>
        <button
          onClick={() => handleNavigation('/', 'information')}
          className="hover:text-accent transition-colors"
        >
          Informações
        </button>
        <button
          onClick={() => handleNavigation('/', 'events')}
          className="hover:text-accent transition-colors"
        >
          Eventos
        </button>
        <button
          onClick={() => handleNavigation('/', 'services')}
          className="hover:text-accent transition-colors"
        >
          Serviços
        </button>
        <button
          onClick={() => handleNavigation('/', 'donate')}
          className="hover:text-accent transition-colors"
        >
          Como Doar
        </button>
        <button
          onClick={() => handleNavigation('/', 'contact')}
          className="hover:text-accent transition-colors"
        >
          Contato
        </button>
        <Link
          to={isAuthenticated ? '/feed' : '/login'}
          className="hover:text-accent transition-colors flex items-center gap-2"
          onClick={onClose}
        >
          {isAuthenticated ? <CgProfile size={20} /> : <CgLogIn size={20} />}
          {isAuthenticated ? 'Perfil' : 'Entrar'}
        </Link>
      </nav>

      <hr className="border-background opacity-50 mt-4" />

      {/* Opções adicionais */}
      <nav className="flex flex-col gap-4 mt-4">
        <Link
          to="/posts/volunteer"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <FiHeart /> Quero Voluntariar
        </Link>
        <Link
          to="/posts/donation"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <FiGift /> Quero Doar
        </Link>
        <Link
          to="/posts/help"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <FiUsers /> Solicitar Ajuda
        </Link>
        <Link
          to="/posts/job"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <FiBriefcase /> Anunciar Vaga
        </Link>
        <Link
          to="/posts/complaint"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <FiAlertCircle /> Denunciar Violência
        </Link>
        <Link
          to="/posts/campaign"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <MdOutlineCampaign /> Criar Campanha
        </Link>
        <Link
          to="/posts/course"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <PiStudent /> Oferecer Curso
        </Link>
        <Link
          to="/posts/event"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <MdEventAvailable /> Criar Evento
        </Link>
        <Link
          to="/posts/general"
          className="flex items-center gap-2 hover:text-accent transition-colors"
          onClick={onClose}
        >
          <MdOutlinePostAdd /> Postar
        </Link>
      </nav>
    </motion.div>
  );
};

export default MobileMenu;

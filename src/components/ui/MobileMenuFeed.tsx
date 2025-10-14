import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiGift,
  FiAlertCircle,
  FiUsers,
  FiBriefcase,
  FiLogOut,
  FiSettings,
  FiHome,
  FiCalendar,
} from 'react-icons/fi';
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { CgProfile } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';
import { useLogout } from '../../hooks/useLogout';

interface MobileMenuFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuFeed: React.FC<MobileMenuFeedProps> = ({ isOpen, onClose }) => {
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-64 h-full bg-primary text-background shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
    >
      {/* Botão Fechar */}
      <button
        className="absolute top-4 right-4 text-background text-3xl"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <IoMdClose />
      </button>

      {/* Logo */}
      <h2
        className="text-xl font-heading font-bold hover:text-accent transition-colors mb-4 mt-8 cursor-pointer"
        onClick={() => {
          window.location.href = '/';
          onClose();
        }}
      >
        Redefinindo Jornadas
      </h2>

      <hr className="border-background opacity-50 mb-4" />

      {/* Navegação Principal */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Navegação
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to="/feed"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <span>Feed</span>
          </Link>
          <Link
            to="/donations"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <span>Doações</span>
          </Link>
          <Link
            to="/events"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <span>Eventos</span>
          </Link>
          <Link
            to="/services"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <span>Serviços</span>
          </Link>
        </nav>
      </div>

      <hr className="border-background opacity-50 my-4" />

      {/* Ações Rápidas */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-background/70 uppercase tracking-wider mb-3">
          Ações Rápidas
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            to="/posts/create/5"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiHeart size={18} />
            <span>Quero Voluntariar</span>
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
            to="/posts/create/4"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiUsers size={18} />
            <span>Solicitar Ajuda</span>
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
            to="/posts/create/2"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiAlertCircle size={18} />
            <span>Denunciar Violência</span>
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
            to="/posts/create/8"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdEventAvailable size={18} />
            <span>Criar Evento</span>
          </Link>
          <Link
            to="/posts/create/9"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <MdOutlinePostAdd size={18} />
            <span>Postar</span>
          </Link>
        </nav>
      </div>

      <hr className="border-background opacity-50 my-4" />

      {/* Configurações e Perfil */}
      <div className="mt-auto">
        <nav className="flex flex-col gap-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <CgProfile size={18} />
            <span>Meu Perfil</span>
          </Link>
          <Link
            to="/account-settings"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-dark hover:text-accent transition-all duration-200"
          >
            <FiSettings size={18} />
            <span>Configurações</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-600/20 hover:text-red-300 transition-all duration-200 text-left w-full"
          >
            <FiLogOut size={18} />
            <span>Sair</span>
          </button>
        </nav>
      </div>
    </motion.div>
  );
};

export default MobileMenuFeed;

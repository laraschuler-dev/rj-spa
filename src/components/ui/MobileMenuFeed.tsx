import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiGift,
  FiAlertCircle,
  FiUsers,
  FiBriefcase,
} from 'react-icons/fi';
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { IoMdClose } from 'react-icons/io';
import { UserDropdownMobile } from './UserDropdownMobile';
import { Sparkles } from 'lucide-react'; // Importar o ícone Sparkles

interface MobileMenuFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuFeed: React.FC<MobileMenuFeedProps> = ({ isOpen, onClose }) => {
  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-64 h-full bg-gradient-to-b from-primary to-primary/95 text-background shadow-lg z-50 p-6 flex flex-col overflow-y-auto"
    >
      {/* Botão Fechar */}
      <button
        className="absolute top-4 right-4 text-background text-3xl focus:outline-none"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <IoMdClose />
      </button>

      {/* Logo - Versão mais compacta */}
      <Link
        to="/"
        onClick={onClose}
        className="flex items-center gap-1.5 text-base font-heading font-bold cursor-pointer text-white bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent/30 transition-all duration-300 whitespace-nowrap px-2 py-1.5 rounded-lg border border-accent shadow-md hover:shadow-lg mt-6 mb-4"
      >
        <Sparkles className="w-3 h-3" />
        Redefinindo Jornadas
      </Link>

      {/* UserDropdownMobile - COMPONENTE PERSONALIZADO */}
      <div className="mb-4">
        <UserDropdownMobile />
      </div>

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
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive('/feed')
                ? 'bg-accent text-white shadow-md'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Feed</span>
          </Link>
          <Link
            to="/donations"
            onClick={onClose}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive('/donations')
                ? 'bg-accent text-white shadow-md'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Doações</span>
          </Link>
          <Link
            to="/events"
            onClick={onClose}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive('/events')
                ? 'bg-accent text-white shadow-md'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
          >
            <span>Eventos</span>
          </Link>
          <Link
            to="/services"
            onClick={onClose}
            className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
              isActive('/services')
                ? 'bg-accent text-white shadow-md'
                : 'hover:bg-primary-dark hover:text-accent'
            }`}
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
    </motion.div>
  );
};

export default MobileMenuFeed;

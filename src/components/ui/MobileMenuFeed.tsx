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
} from 'react-icons/fi';
import {
  MdOutlineCampaign,
  MdEventAvailable,
  MdOutlinePostAdd,
} from 'react-icons/md';
import { PiStudent } from 'react-icons/pi';
import { CgProfile } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';
import { useLogout } from '../../hooks/useLogout'; // ✅ importa o hook

interface MobileMenuFeedProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenuFeed: React.FC<MobileMenuFeedProps> = ({ isOpen, onClose }) => {
  const logout = useLogout(); // ✅ usa o hook

  const handleLogout = () => {
    logout(); // ✅ chama o hook
    onClose(); // ✅ fecha o menu após logout
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 w-64 h-full bg-primary text-background shadow-lg z-50 p-6 flex flex-col"
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
        className="text-xl font-heading mb-6 mt-10 cursor-pointer"
        onClick={() => {
          window.location.href = '/';
          onClose();
        }}
      >
        Redefinindo Jornadas
      </h2>

      <hr className="border-background opacity-50 mb-4" />

      {/* Menu de ações */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent transition-colors"
        >
          <CgProfile size={20} /> Meu Perfil
        </Link>
        <Link
          to="/posts/create/5"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiHeart /> Quero Voluntariar
        </Link>
        <Link
          to="/posts/create/1"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiGift /> Quero Doar
        </Link>
        <Link
          to="/posts/create/4"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiUsers /> Solicitar Ajuda
        </Link>
        <Link
          to="/posts/create/7"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiBriefcase /> Anunciar Vaga
        </Link>
        <Link
          to="/posts/create/2"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiAlertCircle /> Denunciar Violência
        </Link>
        <Link
          to="/posts/create/3"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <MdOutlineCampaign /> Criar Campanha
        </Link>
        <Link
          to="/posts/create/6"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <PiStudent /> Oferecer Curso
        </Link>
        <Link
          to="/posts/create/8"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <MdEventAvailable /> Criar Evento
        </Link>
        <Link
          to="/posts/create/9"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <MdOutlinePostAdd /> Postar
        </Link>

        <hr className="border-background opacity-50 my-4" />

        <Link
          to="/account-settings"
          onClick={onClose}
          className="flex items-center gap-2 hover:text-accent"
        >
          <FiSettings /> Configurações
        </Link>
        <Link
          onClick={handleLogout}
          className="flex items-center gap-2 text-left hover:text-red-300 transition-colors"
          to={''}
        >
          <FiLogOut /> Sair
        </Link>
      </nav>
    </motion.div>
  );
};

export default MobileMenuFeed;

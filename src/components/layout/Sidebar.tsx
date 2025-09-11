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

interface SidebarProps {
  isFeed?: boolean;
}

/**
 * Componente Sidebar
 *
 * Este componente representa a barra lateral de navegação do aplicativo,
 * destacando ações importantes que podem ser realizadas.
 *
 * @returns {JSX.Element} A barra lateral de navegação.
 */
function Sidebar({ isFeed = false }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-white h-screen p-6 shadow-lg sticky top-16">
      <div className={`${isFeed ? 'pt-20' : 'pt-4'} px-4`}></div> {/* Título */}
      <h2 className="text-2xl mb-6">Ações</h2>
      {/* Links de Navegação */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/posts/create/5"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiHeart size={20} /> Quero Voluntariar
        </Link>
        <Link
          to="/posts/create/1"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiGift size={20} /> Quero Doar
        </Link>
        <Link
          to="/posts/create/4"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiUsers size={20} /> Solicitar Ajuda
        </Link>
        <Link
          to="/posts/create/7"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiBriefcase size={20} /> Anunciar Vaga
        </Link>
        <Link
          to="/posts/create/2"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiAlertCircle size={20} /> Denunciar Violência
        </Link>
        <Link
          to="/posts/create/3"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <MdOutlineCampaign size={20} /> Criar Campanha
        </Link>
        <Link
          to="/posts/create/6"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <PiStudent size={20} /> Oferecer Curso
        </Link>
        <Link
          to="/posts/create/8"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <MdEventAvailable size={20} /> Criar Evento
        </Link>
        <Link
          to="/posts/create/9"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <MdOutlinePostAdd size={20} /> Postar
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;

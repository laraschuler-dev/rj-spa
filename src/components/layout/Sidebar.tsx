// Sidebar.tsx - VERSÃO COM ESPAÇAMENTO AJUSTADO
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

function Sidebar() {
  return (
    <div className="hidden md:flex">
      {/* Container fixo que sempre ocupa a altura da tela */}
      <div
        className="sticky top-16"
        style={{
          height: 'calc(100vh - 64px)',
          width: '256px', // 64 * 4
        }}
      >
        <aside className="w-64 bg-sidebar text-white h-full p-6 shadow-lg flex flex-col">
          <h2 className="text-2xl mt-6 mb-6">Ações</h2>{' '}
          {/* ← Reduzi o mb-6 para mb-4 */}
          <nav className="flex flex-col gap-2 flex-1">
            {' '}
            {/* ← Reduzi o gap-4 para gap-2 */}
            <Link
              to="/posts/create/5"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <FiHeart size={18} /> Quero Voluntariar{' '}
              {/* ← Reduzi size 20 para 18 */}
            </Link>
            <Link
              to="/posts/create/1"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <FiGift size={18} /> Quero Doar
            </Link>
            <Link
              to="/posts/create/4"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <FiUsers size={18} /> Solicitar Ajuda
            </Link>
            <Link
              to="/posts/create/7"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <FiBriefcase size={18} /> Anunciar Vaga
            </Link>
            <Link
              to="/posts/create/2"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <FiAlertCircle size={18} /> Denunciar Violência
            </Link>
            <Link
              to="/posts/create/3"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <MdOutlineCampaign size={18} /> Criar Campanha
            </Link>
            <Link
              to="/posts/create/6"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <PiStudent size={18} /> Oferecer Curso
            </Link>
            <Link
              to="/posts/create/8"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <MdEventAvailable size={18} /> Criar Evento
            </Link>
            <Link
              to="/posts/create/9"
              className="flex items-center gap-2 text-lg hover:text-accent transition-colors py-1.5"
            >
              <MdOutlinePostAdd size={18} /> Postar
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}

export default Sidebar;

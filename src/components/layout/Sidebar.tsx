import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiHeart,
  FiGift,
  FiAlertCircle,
  FiUsers,
  FiBriefcase,
} from 'react-icons/fi';

/**
 * Componente Sidebar
 *
 * Este componente representa a barra lateral de navegação do aplicativo,
 * destacando ações importantes que podem ser realizadas antes do login.
 *
 * @returns {JSX.Element} A barra lateral de navegação.
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-white h-screen p-6 shadow-lg sticky top-0">
      {/* Título */}
      <h2 className="text-2xl font-heading mb-6">Ações</h2>

      {/* Links de Navegação */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/voluntariar"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiHeart size={20} /> Quero Voluntariar
        </Link>
        <Link
          to="/posts/create"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiGift size={20} /> Quero Doar
        </Link>
        <Link
          to="/ajuda"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiUsers size={20} /> Solicitar Ajuda
        </Link>
        <Link
          to="/empregos"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiBriefcase size={20} /> Anunciar Vaga
        </Link>
        <Link
          to="/denuncia"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiAlertCircle size={20} /> Denunciar Violência
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

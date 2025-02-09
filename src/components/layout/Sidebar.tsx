import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiUsers, FiSettings } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-white h-screen p-6 shadow-lg">
      {/* Título */}
      <h2 className="text-2xl font-heading mb-6">Menu</h2>

      {/* Links de Navegação */}
      <nav className="flex flex-col gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiHome size={20} /> Home
        </Link>
        <Link
          to="/comunidade"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiUsers size={20} /> Comunidade
        </Link>
        <Link
          to="/configuracoes"
          className="flex items-center gap-2 text-lg hover:text-accent transition-colors"
        >
          <FiSettings size={20} /> Configurações
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

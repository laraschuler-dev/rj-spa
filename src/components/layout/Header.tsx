import React from "react";
import { Link } from "react-router-dom";
import { CgLogIn, CgProfile } from "react-icons/cg";

/**
 * Componente Header
 * 
 * Este componente representa o cabeçalho do aplicativo, incluindo a navegação e o botão de login/perfil.
 * 
 * @returns {JSX.Element} O cabeçalho do aplicativo.
 */
const Header: React.FC = () => {
  const isAuthenticated = false; // TODO: Substituir por lógica real de autenticação

  return (
    <header className="bg-primary text-background py-4 px-6 shadow-md flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl md:text-2xl font-heading">
        Redefinindo Jornadas
      </Link>

      {/* Navegação */}
      <nav className="hidden md:flex gap-6">
        <Link to="/quem-somos" className="hover:text-accent transition-colors">Quem Somos</Link>
        <Link to="/eventos" className="hover:text-accent transition-colors">Eventos</Link>
        <Link to="/denuncia" className="hover:text-accent transition-colors">Serviços</Link>
        <Link to="/como-doar" className="hover:text-accent transition-colors">Como Doar</Link>
        <Link to="/contatos" className="hover:text-accent transition-colors">Contato</Link>
      </nav>

      {/* Botão Login / Perfil */}
      <div>
        {isAuthenticated ? (
          <Link to="/perfil" className="flex items-center gap-2 hover:text-accent transition-colors">
            <CgProfile  size={24} />
            <span className="font-body">Perfil</span>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-2 hover:text-accent transition-colors">
            <CgLogIn size={24} />
            <span className="font-body">Entrar</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
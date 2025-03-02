import React from 'react';

/**
 * Componente Footer
 *
 * Este componente representa o rodapé do aplicativo.
 *
 * @returns {JSX.Element} O rodapé do aplicativo.
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-background py-6 text-center shadow-md">
      <p className="text-sm font-body">
        &copy; {new Date().getFullYear()} Redefinindo Jornadas. Todos os
        direitos reservados.
      </p>
    </footer>
  );
};

export default Footer;

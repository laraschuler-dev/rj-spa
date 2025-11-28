// CardButton.tsx - VERSÃO COM LOADING
import React from 'react';
import clsx from 'clsx';

interface CardButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean; // ✅ Nova prop
  loadingText?: string; // ✅ Texto opcional durante o loading
}

const CardButton: React.FC<CardButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false, // ✅ Valor padrão
  loadingText = 'Carregando...', // ✅ Texto padrão
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading} // ✅ Desabilita durante loading
      className={clsx(
        'mt-4 text-base shadow-md w-full px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-0 active:outline-none active:ring-0 border-0 flex items-center justify-center',
        {
          'bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 w-full hover:opacity-90':
            !disabled && !loading,
          'opacity-50 cursor-not-allowed bg-gray-400 text-white': disabled,
          'bg-blue-500 text-white cursor-wait': loading, // ✅ Estilo específico para loading
        }
      )}
    >
      {loading ? (
        // ✅ Conteúdo durante loading
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>{loadingText}</span>
        </div>
      ) : (
        // ✅ Conteúdo normal
        children
      )}
    </button>
  );
};

export default CardButton;

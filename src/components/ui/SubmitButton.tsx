// SubmitButton.tsx - corrigido sem mudar estrutura
import React from 'react';
import clsx from 'clsx';

interface SubmitButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'neutral';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'w-full py-3 rounded-lg font-semibold transition flex justify-center items-center focus:outline-none',
        {
          // Variante primária (azul padrão com hover laranja)
          'bg-primary text-white hover:bg-orange-600': variant === 'primary',

          // Variante secundária (laranja)
          'bg-secondary text-white hover:bg-orange-700':
            variant === 'secondary',

          // Variante neutra (cinza)
          'bg-gray-200 text-gray-700 hover:bg-gray-300': variant === 'neutral',

          // Variante outline (borda azul)
          'border border-primary text-primary hover:bg-primary hover:text-white':
            variant === 'outline',

          // Variante danger (vermelho)
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',

          // Estados comuns
          'opacity-50 cursor-not-allowed': disabled || loading,
          'cursor-pointer': !disabled && !loading,
        }
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Processando...
        </div>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default SubmitButton;

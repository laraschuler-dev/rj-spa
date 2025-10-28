// SubmitButton.tsx - Versão corrigida
import React from 'react';
import clsx from 'clsx';

interface SubmitButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
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
        'w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex justify-center items-center focus:outline-none',
        {
          'bg-primary text-white hover:bg-secondary': variant === 'primary',
          'bg-secondary text-white hover:bg-orange-700':
            variant === 'secondary',
          'border border-primary text-primary hover:bg-primary hover:text-white':
            variant === 'outline',
          'opacity-50 cursor-not-allowed': disabled || loading,
        }
      )}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          {/* Spinner mais simples */}
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

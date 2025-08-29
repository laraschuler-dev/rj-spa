import React from 'react';
import clsx from 'clsx';

interface SubmitButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition flex justify-center items-center',
        {
          // Aumentado o padding e fonte
          'bg-primary text-white hover:bg-secondary': variant === 'primary', // Azul por padrão, laranja no hover
          'bg-secondary text-white hover:bg-orange-700':
            variant === 'secondary',
          'border border-primary text-primary hover:bg-primary hover:text-white':
            variant === 'outline',
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default SubmitButton;

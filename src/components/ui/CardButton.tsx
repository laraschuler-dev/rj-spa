import React from 'react';
import clsx from 'clsx';

interface CardButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const CardButton: React.FC<CardButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'mt-4 text-base shadow-md w-full px-4 py-2 rounded-lg transition-all',
        {
          'bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 w-full':
            !disabled,
          'opacity-50 cursor-not-allowed': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default CardButton;

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
        'mt-4 text-base shadow-md w-full px-4 py-2 rounded-lg transition-all focus:outline-none focus:ring-0 active:outline-none active:ring-0 border-0',
        {
          'bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 w-full hover:opacity-90':
            !disabled,
          'opacity-50 cursor-not-allowed bg-gray-400 text-white': disabled,
        }
      )}
    >
      {children}
    </button>
  );
};

export default CardButton;

import { useNavigate } from 'react-router-dom';

interface CancelButtonProps {
  mode: 'create' | 'edit';
  onCloseModal?: (() => void) | null;
  label?: string;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  mode,
  onCloseModal,
  label = 'Cancelar',
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (mode === 'create') {
      navigate(-1); // volta para página anterior
    } else if (mode === 'edit' && onCloseModal) {
      onCloseModal(); // fecha modal
    } else {
      navigate(-1); // fallback: sempre volta para a página anterior
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`text-red-600 hover:text-red-800 text-sm font-medium mt-4 block mx-auto ${className}`}
    >
      {label}
    </button>
  );
};

export default CancelButton;

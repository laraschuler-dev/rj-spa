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
      className={`text-gray-700 hover:text-gray-900 text-sm font-semibold underline underline-offset-2 mt-4 mx-auto block transition-colors duration-150 ${className} focus:outline-none`}
    >
      {label}
    </button>
  );
};

export default CancelButton;

// BackButton.tsx - VERSÃO COM DEBUG
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { useScrollStore } from '../../stores/scrollStore';

const BackButton: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  const targetSection = useScrollStore((s) => s.targetSection);

  const handleBack = () => {
    console.log('🔙 BackButton - targetSection:', targetSection);

    // Se existe um target definido na store -> voltar pra home e deixar a Home scrolar
    if (targetSection) {
      console.log('🎯 Indo para home com seção:', targetSection);
      navigate('/', { replace: true });
      return;
    }

    // Caso contrário, segue o comportamento padrão de "voltar"
    console.log('🔁 Comportamento padrão: navegando -1');
    navigate(-1);
  };

  return (
    <button onClick={handleBack} className={className}>
      <MdArrowBackIos className="w-7 h-7 text-[#004AAD] focus:outline-none" />
    </button>
  );
};

export default BackButton;

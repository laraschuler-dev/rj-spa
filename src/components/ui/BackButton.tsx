// BackButton.tsx - VERSÃO SEM BORDA AO CLICAR
import { useNavigate, useLocation } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { useScrollStore } from '../../stores/scrollStore';

const BackButton: React.FC<{ className?: string }> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    targetSection,
    shouldRestoreNotifications,
    clearNotificationsRestore,
  } = useScrollStore();

  const handleBack = () => {
    console.log('🔙 BackButton - Analisando navegação...');
    console.log('📍 Localização atual:', location.pathname);
    console.log('🎯 targetSection:', targetSection);
    console.log('🔔 shouldRestoreNotifications:', shouldRestoreNotifications);
    console.log('📦 State da location:', location.state);

    // ✅ PRIMEIRO: Verificar se veio de notificação (state do React Router)
    const cameFromNotification = location.state?.fromNotification;

    // ✅ SEGUNDO: Verificar store
    if (shouldRestoreNotifications || cameFromNotification) {
      console.log(
        '🔔 BackButton - Voltando para feed com notificações abertas'
      );

      // Limpa o estado ANTES de navegar para evitar loops
      clearNotificationsRestore();

      // Navega para o feed - o HeaderFeed vai detectar e abrir notificações
      navigate('/feed', {
        replace: true,
        state: { restoreNotifications: true }, // ✅ Estado extra para garantir
      });
      return;
    }

    // ✅ Comportamento para targetSection (existente)
    if (targetSection) {
      navigate('/', { replace: true });
      return;
    }

    // ✅ Comportamento padrão
    console.log('🔁 BackButton - Navegação padrão (-1)');
    navigate(-1);
  };

  return (
    <button
      onClick={handleBack}
      className={`${className} focus:outline-none focus:ring-0 active:outline-none active:ring-0 hover:opacity-80 transition-opacity`}
      aria-label="Voltar"
    >
      <MdArrowBackIos className="w-7 h-7 text-[#004AAD] focus:outline-none" />
    </button>
  );
};

export default BackButton;

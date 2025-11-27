// components/account-settings/sections/SocialConnectionsSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import GoogleLinkButton from '../ui/GoogleLinkButton';
import { SocialConnections } from '../../types/accountSettings';
import useAuthStore from '../../stores/authStore';
import { FcGoogle } from 'react-icons/fc';

interface SocialConnectionsSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  connections: SocialConnections;
  onUnlinkGoogle: () => void;
  unlinkPassword: string;
  onUnlinkPasswordChange: (password: string) => void;
  showUnlinkModal: boolean;
  onShowUnlinkModalChange: (show: boolean) => void;
  isUnlinking: boolean;
}

export const SocialConnectionsSection: React.FC<
  SocialConnectionsSectionProps
> = ({
  isOpen,
  onToggle,
  connections,
  onUnlinkGoogle,
  unlinkPassword,
  onUnlinkPasswordChange,
  showUnlinkModal,
  onShowUnlinkModalChange,
  isUnlinking,
}) => {
  const { user } = useAuthStore();

  const handleGoogleLinkSuccess = () => {
    // Esta função será passada para o GoogleLinkButton
  };

  const getConnectionMessage = () => {
    if (connections.hasGoogle) {
      return '✅ Sua conta está vinculada ao Google. Você pode fazer login de forma rápida e segura.';
    } else {
      return '💡 Vincule sua conta ao Google para fazer login de forma mais rápida e segura.';
    }
  };

  const getAdditionalInfo = () => {
    if (user?.isSocialLogin && connections.hasGoogle) {
      return ' Você também pode criar uma senha para fazer login com email.';
    }
    return '';
  };

  return (
    <>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
        >
          <Typography variant="h3" className="text-gray-800 font-semibold">
            Conexões Sociais
          </Typography>
          <svg
            className={`w-5 h-5 text-gray-600 transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="px-6 py-4 space-y-6">
            <div className="flex flex-col items-center text-center md:flex-row md:items-center md:justify-between py-3 border-b border-gray-100 gap-4">
              {/* Ícone e textos */}
              <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-3">
                <div className="w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                  <FcGoogle size={22} />
                </div>
                <div>
                  <Typography
                    variant="h3"
                    className="text-gray-800 font-medium"
                  >
                    Google
                  </Typography>
                  <Typography variant="p" className="text-gray-500 text-sm">
                    {connections.hasGoogle ? 'Conectado' : 'Não conectado'}
                  </Typography>
                </div>
              </div>

              {/* Botão */}
              <div className="flex justify-center md:justify-end w-full md:w-auto">
                {connections.hasGoogle ? (
                  <button
                    onClick={() => onShowUnlinkModalChange(true)}
                    disabled={isUnlinking}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors focus:outline-none w-full sm:w-auto"
                  >
                    Desvincular
                  </button>
                ) : (
                  <div className="w-full sm:w-auto">
                    <GoogleLinkButton onSuccess={handleGoogleLinkSuccess} />
                  </div>
                )}
              </div>
            </div>

            {/* Informações contextuais */}
            <div
              className={`p-4 rounded-lg ${
                connections.hasGoogle ? 'bg-green-50' : 'bg-blue-50'
              }`}
            >
              <Typography
                variant="p"
                className={`text-sm ${
                  connections.hasGoogle ? 'text-green-700' : 'text-blue-700'
                }`}
              >
                {getConnectionMessage()}
                {getAdditionalInfo()}
              </Typography>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Desvincular Google */}
      {showUnlinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <Typography
              variant="h3"
              className="text-red-700 font-semibold mb-4"
            >
              Desvincular Google
            </Typography>

            <Typography variant="p" className="text-gray-600 mb-4">
              Para desvincular sua conta Google, confirme sua senha atual:
            </Typography>

            <input
              type="password"
              value={unlinkPassword}
              onChange={(e) => onUnlinkPasswordChange(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onShowUnlinkModalChange(false);
                  onUnlinkPasswordChange('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={onUnlinkGoogle}
                disabled={isUnlinking || !unlinkPassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors focus:outline-none"
              >
                {isUnlinking ? 'Desvinculando...' : 'Desvincular'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

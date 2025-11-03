// components/account-settings/sections/SocialConnectionsSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import GoogleLinkButton from '../ui/GoogleLinkButton';
import { SocialConnections } from '../../types/accountSettings';
import useAuthStore from '../../stores/authStore';
import { FcGoogle } from 'react-icons/fc'; // ✅ Ícone oficial do Google

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
            {/* Google Connection */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm">
                  <FcGoogle size={22} /> {/* ✅ Ícone estiloso e pronto */}
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

              {connections.hasGoogle ? (
                <button
                  onClick={() => onShowUnlinkModalChange(true)}
                  disabled={isUnlinking}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Desvincular
                </button>
              ) : (
                <GoogleLinkButton onSuccess={handleGoogleLinkSuccess} />
              )}
            </div>

            {/* Informações sobre vinculação */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <Typography variant="p" className="text-blue-700 text-sm">
                💡 Vincule sua conta ao Google para fazer login de forma mais
                rápida e segura.
                {user?.isSocialLogin &&
                  ' Você também pode criar uma senha para fazer login com email.'}
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onUnlinkGoogle}
                disabled={isUnlinking || !unlinkPassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
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

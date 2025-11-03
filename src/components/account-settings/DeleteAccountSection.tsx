// components/account-settings/sections/DeleteAccountSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';
import { DeleteFormData } from '../../types/accountSettings';
import { User } from '../../stores/authStore';

interface DeleteAccountSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  deleteData: DeleteFormData;
  onDeleteDataChange: (data: DeleteFormData) => void;
  onDelete: (isSocialLogin?: boolean) => void;
  isDeleting: boolean;
  user?: User | null;
}

export const DeleteAccountSection: React.FC<DeleteAccountSectionProps> = ({
  isOpen,
  onToggle,
  deleteData,
  onDeleteDataChange,
  onDelete,
  isDeleting,
  user,
}) => {
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDeleteDataChange({
      ...deleteData,
      password: e.target.value,
    });
  };

  const handleConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDeleteDataChange({
      ...deleteData,
      confirmation: e.target.value,
    });
  };

  // Função para verificar se o botão deve estar desabilitado
  const isDeleteDisabled = () => {
    const confirmationText = 'deletar minha conta';

    // Verifica se o texto de confirmação está correto
    if (deleteData.confirmation.toLowerCase() !== confirmationText) {
      return true;
    }

    // Para usuários não sociais, verifica se a senha foi preenchida
    if (!user?.isSocialLogin && !deleteData.password) {
      return true;
    }

    return false;
  };

  return (
    <div className="border border-red-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-red-50 hover:bg-red-100 transition-colors text-left flex justify-between items-center focus:outline-none"
      >
        <Typography variant="h3" className="text-red-700 font-semibold">
          Deletar Conta
        </Typography>
        <svg
          className={`w-5 h-5 text-red-600 transform transition-transform ${
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
        <div className="px-6 py-4 space-y-4 bg-red-50">
          <Typography variant="p" className="text-red-600 text-sm">
            Ao excluir sua conta, todos os seus dados serão removidos
            permanentemente. Esta ação não pode ser desfeita.
          </Typography>

          <div className="space-y-4 pt-2">
            <Typography
              variant="p"
              className="text-red-600 text-sm font-medium"
            >
              {user?.isSocialLogin
                ? 'Confirme a exclusão abaixo:'
                : 'Para confirmar a exclusão, digite sua senha e confirme abaixo:'}
            </Typography>

            <form autoComplete="off" className="space-y-4">
              {!user?.isSocialLogin && (
                <div>
                  <label className="text-sm text-red-600 block mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={deleteData.password}
                    onChange={handlePasswordChange}
                    className="w-full rounded-xl border border-red-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Digite sua senha atual"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-red-600 block mb-1">
                  Digite "deletar minha conta" para confirmar
                </label>
                <input
                  type="text"
                  name="confirmation"
                  autoComplete="off"
                  value={deleteData.confirmation}
                  onChange={handleConfirmationChange}
                  className="w-full rounded-xl border border-red-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="deletar minha conta"
                />
              </div>
            </form>

            <div className="text-right">
              <SubmitButton
                onClick={() => onDelete(user?.isSocialLogin)}
                loading={isDeleting}
                disabled={isDeleteDisabled()}
                variant="danger"
              >
                Confirmar Exclusão
              </SubmitButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

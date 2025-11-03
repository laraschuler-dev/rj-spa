// components/account-settings/sections/CreatePasswordSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';
import PasswordInput from '../ui/PasswordInput';
import { PasswordFormData } from '../../types/accountSettings';

interface CreatePasswordSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  passwordData: PasswordFormData;
  onPasswordDataChange: (data: PasswordFormData) => void;
  onCreate: () => void;
  isUpdating: boolean;
}

export const CreatePasswordSection: React.FC<CreatePasswordSectionProps> = ({
  isOpen,
  onToggle,
  passwordData,
  onPasswordDataChange,
  onCreate,
  isUpdating,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPasswordDataChange({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = passwordData.newPassword && passwordData.confirmPassword;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
      >
        <Typography variant="h3" className="text-gray-800 font-semibold">
          Criar Senha
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
        <div className="px-6 py-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <Typography variant="p" className="text-blue-700 text-sm">
              💡 Crie uma senha para fazer login com email também. Isso não
              remove sua conexão com o Google - você poderá usar ambos os
              métodos.
            </Typography>
          </div>

          <form autoComplete="off" className="space-y-4">
            <div>
              <PasswordInput
                label="Nova Senha"
                type="password"
                name="newPassword"
                autoComplete="new-password"
                value={passwordData.newPassword}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <PasswordInput
                label="Confirmar Senha"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
              />
            </div>
          </form>

          <div className="text-right pt-2">
            <SubmitButton
              onClick={onCreate}
              loading={isUpdating}
              disabled={!isFormValid || isUpdating}
            >
              Criar Senha
            </SubmitButton>
          </div>
        </div>
      )}
    </div>
  );
};

// components/account-settings/sections/PasswordSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';
import PasswordInput from '../ui/PasswordInput';
import { PasswordFormData } from '../../types/accountSettings';

interface PasswordSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  passwordData: PasswordFormData;
  onPasswordDataChange: (data: PasswordFormData) => void;
  onUpdate: () => void;
  isUpdating: boolean;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({
  isOpen,
  onToggle,
  passwordData,
  onPasswordDataChange,
  onUpdate,
  isUpdating,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPasswordDataChange({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid =
    passwordData.currentPassword &&
    passwordData.newPassword &&
    passwordData.confirmPassword;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
      >
        <Typography variant="h3" className="text-gray-800 font-semibold">
          Alterar Senha
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
          <form autoComplete="off" className="space-y-4">
            <div>
              <PasswordInput
                label="Senha Atual"
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                value={passwordData.currentPassword}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

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
                label="Confirmar Nova Senha"
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
              onClick={onUpdate}
              loading={isUpdating}
              disabled={!isFormValid || isUpdating}
            >
              Alterar Senha
            </SubmitButton>
          </div>
        </div>
      )}
    </div>
  );
};

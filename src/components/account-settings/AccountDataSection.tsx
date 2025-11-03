// components/account-settings/sections/AccountDataSection.tsx
import React from 'react';
import Typography from '../ui/Typography';
import SubmitButton from '../ui/SubmitButton';
import { UserFormData } from '../../types/accountSettings';
import useAuthStore from '../../stores/authStore';
import { SocialConnections } from '../../types/accountSettings';

interface AccountDataSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: UserFormData;
  onFormDataChange: (data: UserFormData) => void;
  onSave: () => void;
  isUpdating: boolean;
  hasChanges: boolean;
  socialConnections: SocialConnections;
}

export const AccountDataSection: React.FC<AccountDataSectionProps> = ({
  isOpen,
  onToggle,
  formData,
  onFormDataChange,
  onSave,
  isUpdating,
  hasChanges,
  socialConnections,
}) => {
  const { user } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isEmailDisabled = user?.isSocialLogin || socialConnections.hasGoogle;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
      >
        <Typography variant="h3" className="text-gray-800 font-semibold">
          Dados da Conta
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
          <div>
            <label className="text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isEmailDisabled}
              className={`w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                isEmailDisabled
                  ? 'bg-gray-100 cursor-not-allowed opacity-70'
                  : ''
              }`}
            />
            {isEmailDisabled && (
              <p className="text-xs text-gray-500 mt-1">
                {socialConnections.hasGoogle
                  ? 'Email não pode ser alterado enquanto a conta Google estiver vinculada. Desvincule primeiro.'
                  : 'Email não pode ser alterado em contas vinculadas ao Google'}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="text-right pt-2">
            <SubmitButton
              onClick={onSave}
              loading={isUpdating}
              disabled={!hasChanges}
            >
              Salvar Alterações
            </SubmitButton>
          </div>
        </div>
      )}
    </div>
  );
};

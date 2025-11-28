// components/account-settings/AccountSettings.tsx
import React, { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { OpenSections } from '../types/accountSettings';
import { useAccountData } from '../hooks/useAccountData';
import { usePasswordManagement } from '../hooks/usePasswordManagement';
import { useSocialConnections } from '../hooks/useSocialConnections';
import { useDeleteAccount } from '../hooks/useDeleteAccount';
import BackButton from '../components/ui/BackButton';
import Typography from '../components/ui/Typography';
import { AccountDataSection } from '../components/account-settings/AccountDataSection';
import { PasswordSection } from '../components/account-settings/PasswordSection';
import { CreatePasswordSection } from '../components/account-settings/CreatePasswordSection';
import { SocialConnectionsSection } from '../components/account-settings/SocialConnectionsSection';
import { DeleteAccountSection } from '../components/account-settings/DeleteAccountSection';

// AccountSettings.tsx
const AccountSettings: React.FC = () => {
  const { user } = useAuthStore();

  const [openSections, setOpenSections] = useState<OpenSections>({
    account: true,
    password: false,
    createPassword: false,
    social: false,
    danger: false,
  });

  const accountData = useAccountData();
  const passwordManagement = usePasswordManagement();
  const socialConnections = useSocialConnections();
  const deleteAccount = useDeleteAccount();

  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <BackButton className="fixed top-6 left-6 z-50" />

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md space-y-4">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Configurações da Conta
        </Typography>

        <AccountDataSection
          isOpen={openSections.account}
          onToggle={() => toggleSection('account')}
          formData={accountData.formData}
          onFormDataChange={accountData.setFormData}
          onSave={accountData.updateAccount}
          isUpdating={accountData.isUpdating}
          hasChanges={accountData.hasChanges()}
        />

        {!user?.isSocialLogin && (
          <PasswordSection
            isOpen={openSections.password}
            onToggle={() => toggleSection('password')}
            passwordData={passwordManagement.passwordData}
            onPasswordDataChange={passwordManagement.setPasswordData}
            onUpdate={passwordManagement.updatePassword}
            isUpdating={passwordManagement.isUpdating}
          />
        )}

        {user?.isSocialLogin && (
          <CreatePasswordSection
            isOpen={openSections.createPassword}
            onToggle={() => toggleSection('createPassword')}
            passwordData={passwordManagement.passwordData}
            onPasswordDataChange={passwordManagement.setPasswordData}
            onCreate={passwordManagement.createPasswordForSocial}
            isUpdating={passwordManagement.isUpdating}
          />
        )}

        <SocialConnectionsSection
          isOpen={openSections.social}
          onToggle={() => toggleSection('social')}
          connections={socialConnections.connections}
          onUnlinkGoogle={() =>
            socialConnections.unlinkGoogleAccount(
              socialConnections.unlinkPassword
            )
          }
          unlinkPassword={socialConnections.unlinkPassword}
          onUnlinkPasswordChange={socialConnections.setUnlinkPassword}
          showUnlinkModal={socialConnections.showUnlinkModal}
          onShowUnlinkModalChange={socialConnections.setShowUnlinkModal}
          isUnlinking={socialConnections.isLoading}
        />

        <DeleteAccountSection
          isOpen={openSections.danger}
          onToggle={() => toggleSection('danger')}
          deleteData={deleteAccount.deleteData}
          onDeleteDataChange={deleteAccount.setDeleteData}
          onDelete={deleteAccount.deleteAccount}
          isDeleting={deleteAccount.isDeleting}
          user={user}
        />
      </div>
    </main>
  );
};

export default AccountSettings;

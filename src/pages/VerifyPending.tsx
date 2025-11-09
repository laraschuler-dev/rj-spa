// VerifyPending.tsx
import React from 'react';
import { useVerifyPending } from '../hooks/useVerifyPending';
import { PendingVerification } from '../components/auth/PendingVerification';

const VerifyPending: React.FC = () => {
  const { loading, pendingEmail, handleResend, handleTryLogin } =
    useVerifyPending();

  return (
    <PendingVerification
      pendingEmail={pendingEmail}
      loading={loading}
      onResend={handleResend}
      onTryLogin={handleTryLogin}
    />
  );
};

export default VerifyPending;

// VerifyPending.tsx
import React from 'react';
import { useVerifyPending } from '../hooks/useVerifyPending';
import { PendingVerification } from '../components/auth/PendingVerification';

const VerifyPending: React.FC = () => {
  const { loading, handleResend } = useVerifyPending();

  return <PendingVerification loading={loading} onResend={handleResend} />;
};

export default VerifyPending;

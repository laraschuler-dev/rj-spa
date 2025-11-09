// RecoverVerification.tsx
import React from 'react';
import { useRecoverVerification } from '../hooks/useRecoverVerification';
import { RecoverVerificationForm } from '../components/auth/RecoverVerificationForm';

const RecoverVerification: React.FC = () => {
  const { email, loading, handleEmailChange, handleResend, handleBackToLogin } =
    useRecoverVerification();

  return (
    <RecoverVerificationForm
      email={email}
      loading={loading}
      onEmailChange={handleEmailChange}
      onResend={handleResend}
      onBackToLogin={handleBackToLogin}
    />
  );
};

export default RecoverVerification;

// EmailVerification.tsx - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { useEmailVerification } from '../hooks/useEmailVerification';
import { VerificationLoader } from '../components/VerificationLoader';

const EmailVerification: React.FC = () => {
  useEmailVerification(); // ✅ Limpo e simples

  return <VerificationLoader />;
};

export default EmailVerification;

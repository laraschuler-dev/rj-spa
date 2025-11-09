// components/VerificationLoader.tsx
import React from 'react';

interface VerificationLoaderProps {
  message?: string;
}

export const VerificationLoader: React.FC<VerificationLoaderProps> = ({
  message = 'Verificando seu e-mail...',
}) => (
  <main className="flex items-center justify-center min-h-screen bg-background">
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-[90%] sm:w-full max-w-sm text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </main>
);

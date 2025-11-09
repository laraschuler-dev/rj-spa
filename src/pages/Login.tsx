// Login.tsx
import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { useLogin } from '../hooks/useLogin';

const Login: React.FC = () => {
  const { formData, isSubmitting, handleChange, handleSubmit } = useLogin();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <LoginForm
        formData={formData}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default Login;

// Register.tsx
import React from 'react';
import { useRegister } from '../hooks/useRegister';
import { RegisterForm } from '../components/RegisterForm';
const Register: React.FC = () => {
  const { formData, error, isSubmitting, handleChange, handleSubmit } =
    useRegister();

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <RegisterForm
        formData={formData}
        error={error}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default Register;

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // ou react-icons/fi → FiEye, FiEyeOff

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative">
        <input
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />

        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordInput;

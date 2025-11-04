// usePasswordManagement.ts
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { PasswordFormData } from '../types/accountSettings';
import useAuthStore from '../stores/authStore';

export const usePasswordManagement = () => {
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const { updateUser } = useAuthStore();

  const validatePassword = (): string | null => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return 'As senhas não coincidem. Por favor, verifique.';
    }

    if (passwordData.newPassword.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }

    return null;
  };

  const updatePassword = async () => {
    if (isUpdating) return;

    const validationError = validatePassword();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdating(true);

    try {
      await axios.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success('Senha atualizada com sucesso.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar senha';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const createPasswordForSocial = async () => {
    if (isUpdating) return;

    const validationError = validatePassword();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsUpdating(true);

    try {
      await axios.put('/auth/password', {
        newPassword: passwordData.newPassword,
      });

      // ATUALIZAR STORE - usuário não é mais apenas social
      updateUser({ isSocialLogin: false });

      toast.success(
        'Senha criada com sucesso! Agora você pode fazer login com email também.'
      );
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao criar senha';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    passwordData,
    setPasswordData,
    isUpdating,
    updatePassword,
    createPasswordForSocial,
    validatePassword,
  };
};

// components/account-settings/hooks/useDeleteAccount.ts
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { DeleteFormData } from '../types/accountSettings';

export const useDeleteAccount = () => {
  const [deleteData, setDeleteData] = useState<DeleteFormData>({
    password: '',
    confirmation: '',
  });

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async (isSocialLogin?: boolean) => {
    if (isDeleting) return;

    if (deleteData.confirmation.toLowerCase() !== 'deletar minha conta') {
      toast.error(
        'Por favor, digite exatamente "deletar minha conta" para confirmar.'
      );
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete('/auth/account', {
        data: isSocialLogin ? {} : { password: deleteData.password },
      });

      toast.success('Sua conta foi excluída com sucesso.');
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao excluir conta';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteData,
    setDeleteData,
    isDeleting,
    deleteAccount,
  };
};

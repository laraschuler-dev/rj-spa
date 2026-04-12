// components/account-settings/hooks/useAccountData.ts
import { useState, useEffect } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { UserFormData } from '../types/accountSettings';
import useAuthStore from '../stores/authStore';

export const useAccountData = () => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [originalData, setOriginalData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ Obter o usuário atual da store para reagir a mudanças
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get('/auth/me');
        const userData = {
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
        };

        setFormData(userData);
        setOriginalData(userData);
      } catch (err: any) {
        const message = err.response?.data?.error || 'Erro ao carregar dados';
        console.error(message);
      }
    };

    loadUserData();
  }, [user]); // ✅ Recarregar quando o usuário mudar

  const updateAccount = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      await axios.put('/auth/account', formData);
      setOriginalData(formData);
      toast.success('Dados atualizados com sucesso.');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar dados';
      console.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone
    );
  };

  return {
    formData,
    setFormData,
    isUpdating,
    updateAccount,
    hasChanges,
  };
};

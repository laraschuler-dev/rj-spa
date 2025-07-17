import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Typography from '../components/ui/Typography';
import { toast } from 'react-toastify';
import SubmitButton from '../components/ui/SubmitButton';
import { Link } from 'react-router-dom';

const AccountSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    axios
      .get('/auth/me')
      .then((res) => {
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        });
      })
      .catch((err) => {
        const backendMessage =
          err.response?.data?.error || 'Erro ao carregar dados';
        toast.error(backendMessage);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateAccount = async () => {
    try {
      await axios.put('/auth/account', formData);
      toast.success('Dados atualizados com sucesso.');
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao atualizar dados.';
      toast.error(backendMessage);
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put('/auth/password', passwordData);
      toast.success('Senha atualizada com sucesso.');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao atualizar senha.';
      toast.error(backendMessage);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md space-y-8">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Configurações da Conta
        </Typography>

        {/* Dados da conta */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="text-right">
            <SubmitButton onClick={updateAccount}>
              Salvar Alterações
            </SubmitButton>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Alterar senha */}
        <div className="space-y-4">
          <Typography
            variant="h3"
            className="text-lg text-gray-700 font-semibold"
          >
            Alterar Senha
          </Typography>

          <form autoComplete="off">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Senha Atual
              </label>
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </form>
          <div className="text-right">
            <SubmitButton onClick={updatePassword}>Alterar Senha</SubmitButton>
          </div>
          {/* Cancelar link geral */}
          <div className="text-center mt-6">
            <Link
              to="/feed"
              className="text-sm text-red-500 hover:text-red-600 hover:underline transition"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountSettings;

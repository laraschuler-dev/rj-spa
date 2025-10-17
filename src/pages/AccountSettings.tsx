import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Typography from '../components/ui/Typography';
import { toast } from 'react-toastify';
import SubmitButton from '../components/ui/SubmitButton';
import BackButton from '../components/ui/BackButton';

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

  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: '',
  });

  // Estados de loading para cada ação
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Estados para controlar as abas abertas
  const [openSections, setOpenSections] = useState({
    account: true, // Inicia com a primeira aba aberta
    password: false,
    danger: false,
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

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Esta função é necessária para a seção de alteração de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Funções para exclusão de conta
  const handleDeletePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeleteData((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleDeleteConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeleteData((prev) => ({ ...prev, confirmation: e.target.value }));
  };
  const updateAccount = async () => {
    if (isUpdatingAccount) return;
    setIsUpdatingAccount(true);

    try {
      await axios.put('/auth/account', formData);
      toast.success('Dados atualizados com sucesso.');
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao atualizar dados.';
      toast.error(backendMessage);
    } finally {
      setIsUpdatingAccount(false);
    }
  };

  const updatePassword = async () => {
    if (isUpdatingPassword) return;
    setIsUpdatingPassword(true);

    try {
      await axios.put('/auth/password', passwordData);
      toast.success('Senha atualizada com sucesso.');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao atualizar senha.';
      toast.error(backendMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const deleteAccount = async () => {
    if (isDeletingAccount) return;

    // Validação do campo de confirmação
    if (deleteData.confirmation.toLowerCase() !== 'deletar minha conta') {
      toast.error(
        'Por favor, digite exatamente "deletar minha conta" para confirmar.'
      );
      return;
    }

    setIsDeletingAccount(true);

    try {
      await axios.delete('/auth/account', {
        data: { password: deleteData.password },
      });
      toast.success('Sua conta foi excluída com sucesso.');

      // Redirecionar para a página inicial ou login após exclusão
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao excluir conta.';
      toast.error(backendMessage);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <BackButton to="/feed" className="fixed top-6 left-6 z-50" />
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-md space-y-4">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Configurações da Conta
        </Typography>

        {/* Seção 1: Dados da Conta */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('account')}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
          >
            <Typography variant="h3" className="text-gray-800 font-semibold">
              Dados da Conta
            </Typography>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                openSections.account ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openSections.account && (
            <div className="px-6 py-4 space-y-4">
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
                <label className="text-sm text-gray-600 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="text-right pt-2">
                <SubmitButton
                  onClick={updateAccount}
                  loading={isUpdatingAccount}
                >
                  Salvar Alterações
                </SubmitButton>
              </div>
            </div>
          )}
        </div>

        {/* Seção 2: Alterar Senha */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('password')}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
          >
            <Typography variant="h3" className="text-gray-800 font-semibold">
              Alterar Senha
            </Typography>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                openSections.password ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openSections.password && (
            <div className="px-6 py-4 space-y-4">
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
              <div className="text-right pt-2">
                <SubmitButton
                  onClick={updatePassword}
                  loading={isUpdatingPassword}
                >
                  Alterar Senha
                </SubmitButton>
              </div>
            </div>
          )}
        </div>

        {/* Seção 3: Zona de Perigo */}
        <div className="border border-red-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('danger')}
            className="w-full px-6 py-4 bg-red-50 hover:bg-red-100 transition-colors text-left flex justify-between items-center focus:outline-none"
          >
            <Typography variant="h3" className="text-red-700 font-semibold">
              Deletar Conta
            </Typography>
            <svg
              className={`w-5 h-5 text-red-600 transform transition-transform ${
                openSections.danger ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openSections.danger && (
            <div className="px-6 py-4 space-y-4 bg-red-50">
              <Typography variant="p" className="text-red-600 text-sm">
                Ao excluir sua conta, todos os seus dados serão removidos
                permanentemente. Esta ação não pode ser desfeita.
              </Typography>

              <div className="space-y-4 pt-2">
                <Typography
                  variant="p"
                  className="text-red-600 text-sm font-medium"
                >
                  Para confirmar a exclusão, digite sua senha e confirme abaixo:
                </Typography>

                {/* Form com proteção máxima */}
                <form autoComplete="off" className="space-y-4">
                  <input
                    type="password"
                    style={{ display: 'none' }}
                    autoComplete="new-password"
                  />

                  <div>
                    <label className="text-sm text-red-600 block mb-1">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={deleteData.password}
                      onChange={handleDeletePasswordChange}
                      className="w-full rounded-xl border border-red-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Digite sua senha atual manualmente"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-red-600 block mb-1">
                      Digite "deletar minha conta" para confirmar
                    </label>
                    <input
                      type="text"
                      name="confirmation"
                      autoComplete="off"
                      value={deleteData.confirmation}
                      onChange={handleDeleteConfirmationChange}
                      className="w-full rounded-xl border border-red-300 px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="deletar minha conta"
                    />
                  </div>
                </form>

                <div className="flex flex-col space-y-3">
                  <div className="text-right">
                    <SubmitButton
                      onClick={deleteAccount}
                      loading={isDeletingAccount}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-500 w-full sm:w-auto"
                    >
                      Confirmar Exclusão
                    </SubmitButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AccountSettings;

import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Typography from '../components/ui/Typography';
import { toast } from 'react-toastify';
import SubmitButton from '../components/ui/SubmitButton';
import BackButton from '../components/ui/BackButton';
import PasswordInput from '../components/ui/PasswordInput';
import useAuthStore from '../stores/authStore';
import { useSocialConnections } from '../hooks/useSocialConnections';
import GoogleLinkButton from '../components/ui/GoogleLinkButton';

const AccountSettings: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Estados para controlar dados originais
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [deleteData, setDeleteData] = useState({
    password: '',
    confirmation: '',
  });

  // Estados de loading para cada ação
  const [isUpdatingAccount, setIsUpdatingAccount] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { user } = useAuthStore();

  // Estados para controlar as abas abertas
  const [openSections, setOpenSections] = useState({
    account: true, // Inicia com a primeira aba aberta
    password: false,
    social: false,
    danger: false,
  });

  useEffect(() => {
    axios
      .get('/auth/me')
      .then((res) => {
        const userData = {
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
        };

        setFormData(userData);
        setOriginalData(userData); // ✅ SALVA OS DADOS ORIGINAIS
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

  // Verifica se houve mudanças nos dados
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone
    );
  };

  const updatePassword = async () => {
    if (isUpdatingPassword) return;

    // ✅ VALIDAÇÃO DA CONFIRMAÇÃO (igual ao social)
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    // ✅ VALIDAÇÃO DO TAMANHO MÍNIMO
    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // ✅ ENVIA APENAS OS CAMPOS NECESSÁRIOS
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
      const backendMessage =
        err.response?.data?.error || 'Erro ao atualizar senha.';
      toast.error(backendMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const updatePasswordForSocial = async () => {
    if (isUpdatingPassword) return;

    // ✅ VALIDAÇÃO DA CONFIRMAÇÃO
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('As senhas não coincidem. Por favor, verifique.');
      return;
    }

    // ✅ VALIDAÇÃO DO TAMANHO MÍNIMO
    if (passwordData.newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await axios.put('/auth/password', {
        newPassword: passwordData.newPassword,
      });

      toast.success(
        'Senha criada com sucesso! Agora você pode fazer login com email também.'
      );
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao criar senha.';
      toast.error(backendMessage);
    } finally {
      setIsUpdatingPassword(false);
    }
  };
  const deleteAccount = async () => {
    if (isDeletingAccount) return;

    if (deleteData.confirmation.toLowerCase() !== 'deletar minha conta') {
      toast.error(
        'Por favor, digite exatamente "deletar minha conta" para confirmar.'
      );
      return;
    }

    setIsDeletingAccount(true);

    try {
      await axios.delete('/auth/account', {
        data: user?.isSocialLogin
          ? {} // ✅ social não precisa de senha
          : { password: deleteData.password },
      });

      toast.success('Sua conta foi excluída com sucesso.');
      setTimeout(() => (window.location.href = '/'), 2000);
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.error || 'Erro ao excluir conta.';
      toast.error(backendMessage);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // ✅ NOVOS ESTADOS PARA CONEXÕES SOCIAIS
  const [socialConnections, setSocialConnections] = useState({
    hasGoogle: false,
    connectedProviders: [] as string[],
  });
  const [unlinkPassword, setUnlinkPassword] = useState('');
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);

  const {
    unlinkGoogleAccount,
    getSocialConnections,
    loading: socialLoading,
  } = useSocialConnections();

  // ✅ BUSCAR CONEXÕES SOCIAIS AO CARREGAR
  useEffect(() => {
    const loadSocialConnections = async () => {
      try {
        const connections = await getSocialConnections();
        setSocialConnections(connections);
      } catch (error) {
        console.error('Erro ao carregar conexões sociais:', error);
      }
    };

    loadSocialConnections();
  }, []);

  // ✅ FUNÇÃO PARA DESVINCULAR GOOGLE
  const handleUnlinkGoogle = async () => {
    if (!unlinkPassword) {
      toast.error('Por favor, informe sua senha');
      return;
    }

    try {
      await unlinkGoogleAccount(unlinkPassword);
      setSocialConnections((prev) => ({
        ...prev,
        hasGoogle: false,
        connectedProviders: prev.connectedProviders.filter(
          (p) => p !== 'google'
        ),
      }));
      setShowUnlinkModal(false);
      setUnlinkPassword('');
      toast.success('Google desvinculado com sucesso!');
    } catch (error) {
      // Erro já é tratado no hook
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
                <label className="text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              {/* EMAIL - Condicional */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={user?.isSocialLogin || socialConnections.hasGoogle} // ✅ CORRIGIDO
                  className={`w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none ${
                    user?.isSocialLogin || socialConnections.hasGoogle
                      ? 'bg-gray-100 cursor-not-allowed opacity-70'
                      : ''
                  }`}
                />
                {(user?.isSocialLogin || socialConnections.hasGoogle) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {socialConnections.hasGoogle
                      ? 'Email não pode ser alterado enquanto a conta Google estiver vinculada. Desvincule primeiro.'
                      : 'Email não pode ser alterado em contas vinculadas ao Google'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
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
                  disabled={!hasChanges()} // ✅ DESABILITA SE NÃO HOUVER ALTERAÇÕES
                >
                  Salvar Alterações
                </SubmitButton>
              </div>
            </div>
          )}
        </div>

        {!user?.isSocialLogin && (
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
                <form autoComplete="off" className="space-y-4">
                  <div>
                    <PasswordInput
                      label="Senha Atual"
                      type="password"
                      name="currentPassword"
                      autoComplete="current-password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <PasswordInput
                      label="Nova Senha"
                      type="password"
                      name="newPassword"
                      autoComplete="new-password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  {/* ✅ ADICIONAR CONFIRMAÇÃO AQUI TAMBÉM */}
                  <div>
                    <PasswordInput
                      label="Confirmar Nova Senha"
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </form>

                <div className="text-right pt-2">
                  <SubmitButton
                    onClick={updatePassword}
                    loading={isUpdatingPassword}
                    disabled={
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    Alterar Senha
                  </SubmitButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ SEÇÃO ATUALIZADA COM CONFIRMAÇÃO */}
        {user?.isSocialLogin && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('createPassword')}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
            >
              <Typography variant="h3" className="text-gray-800 font-semibold">
                Criar Senha
              </Typography>
              <svg
                className={`w-5 h-5 text-gray-600 transform transition-transform ${
                  openSections.createPassword ? 'rotate-180' : ''
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

            {openSections.createPassword && (
              <div className="px-6 py-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Typography variant="p" className="text-blue-700 text-sm">
                    💡 Crie uma senha para fazer login com email também. Isso
                    não remove sua conexão com o Google - você poderá usar ambos
                    os métodos.
                  </Typography>
                </div>

                <form autoComplete="off" className="space-y-4">
                  <div>
                    <PasswordInput
                      label="Nova Senha"
                      type="password"
                      name="newPassword"
                      autoComplete="new-password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>

                  {/* ✅ NOVO CAMPO: CONFIRMAR SENHA */}
                  <div>
                    <PasswordInput
                      label="Confirmar Senha"
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </form>

                <div className="text-right pt-2">
                  <SubmitButton
                    onClick={updatePasswordForSocial}
                    loading={isUpdatingPassword}
                    disabled={
                      !passwordData.newPassword || !passwordData.confirmPassword
                    }
                  >
                    Criar Senha
                  </SubmitButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ NOVA SEÇÃO: Conexões Sociais */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('social')}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex justify-between items-center focus:outline-none"
          >
            <Typography variant="h3" className="text-gray-800 font-semibold">
              Conexões Sociais
            </Typography>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform ${
                openSections.social ? 'rotate-180' : ''
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

          {openSections.social && (
            <div className="px-6 py-4 space-y-6">
              {/* Google Connection */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">
                      G
                    </span>
                  </div>
                  <div>
                    <Typography
                      variant="h4"
                      className="text-gray-800 font-medium"
                    >
                      Google
                    </Typography>
                    <Typography variant="p" className="text-gray-500 text-sm">
                      {socialConnections.hasGoogle
                        ? 'Conectado'
                        : 'Não conectado'}
                    </Typography>
                  </div>
                </div>

                {socialConnections.hasGoogle ? (
                  <button
                    onClick={() => setShowUnlinkModal(true)}
                    disabled={socialLoading}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    Desvincular
                  </button>
                ) : (
                  <GoogleLinkButton
                    onSuccess={() => {
                      setSocialConnections((prev) => ({
                        ...prev,
                        hasGoogle: true,
                        connectedProviders: [
                          ...prev.connectedProviders,
                          'google',
                        ],
                      }));
                    }}
                  />
                )}
              </div>

              {/* Informações sobre vinculação */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <Typography variant="p" className="text-blue-700 text-sm">
                  💡 Vincule sua conta ao Google para fazer login de forma mais
                  rápida e segura.
                  {user?.isSocialLogin &&
                    ' Você também pode criar uma senha para fazer login com email.'}
                </Typography>
              </div>
            </div>
          )}
        </div>

        {/* Modal para Desvincular Google */}
        {showUnlinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <Typography
                variant="h3"
                className="text-red-700 font-semibold mb-4"
              >
                Desvincular Google
              </Typography>

              <Typography variant="p" className="text-gray-600 mb-4">
                Para desvincular sua conta Google, confirme sua senha atual:
              </Typography>

              <input
                type="password"
                value={unlinkPassword}
                onChange={(e) => setUnlinkPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowUnlinkModal(false);
                    setUnlinkPassword('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUnlinkGoogle}
                  disabled={socialLoading || !unlinkPassword}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {socialLoading ? 'Desvinculando...' : 'Desvincular'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Seção existente: Login Social Info */}
        {user?.isSocialLogin && !socialConnections.hasGoogle && (
          <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
            <Typography
              variant="h3"
              className="text-gray-700 font-semibold mb-2"
            >
              Login com Google
            </Typography>
            <Typography
              variant="p"
              className="text-gray-500 text-sm leading-relaxed"
            >
              Sua conta foi criada usando o login do Google. Por isso, não há
              senha para alterar.
              <br />
              Você pode criar uma senha para fazer login com email também.
            </Typography>
          </div>
        )}

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
                  {user?.isSocialLogin
                    ? 'Confirme a exclusão abaixo:'
                    : 'Para confirmar a exclusão, digite sua senha e confirme abaixo:'}
                </Typography>

                <form autoComplete="off" className="space-y-4">
                  {!user?.isSocialLogin && (
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
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                  )}

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

                <div className="text-right">
                  <SubmitButton
                    onClick={deleteAccount}
                    loading={isDeletingAccount}
                  >
                    Confirmar Exclusão
                  </SubmitButton>
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

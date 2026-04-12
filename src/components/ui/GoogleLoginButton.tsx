import { GoogleLogin } from '@react-oauth/google';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import useAuthStore from '../../stores/authStore';

export default function GoogleLoginButton() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const validateToken = useAuthStore((state) => state.validateToken);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await axios.post('/auth/google', { idToken });

      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      await validateToken();

      toast.success('Login com Google realizado com sucesso!');
      window.location.href = '/feed';
    } catch (err: any) {
      console.error('🔴 erro login Google:', err);

      // ✅ TRATAMENTO SIMPLES MAS EFETIVO
      const errorMessage = err.response?.data?.error || err.message;

      if (
        errorMessage.includes('excluída') ||
        errorMessage.includes('deletada')
      ) {
        toast.error('Esta conta foi excluída. Entre em contato com o suporte.');
      } else if (errorMessage.includes('token inválido')) {
        toast.error('Token do Google inválido. Tente novamente.');
      } else {
        toast.error(errorMessage || 'Erro ao fazer login com Google');
      }
    }
  };

  const handleError = () => {
    console.error('🔴 Falha na autenticação com Google');
    toast.error('Falha na autenticação com Google');
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        ux_mode="popup"
      />
    </div>
  );
}

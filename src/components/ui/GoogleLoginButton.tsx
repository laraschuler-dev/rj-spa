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

      // Sincronizar token com localStorage E Zustand
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      // Validar token para garantir que está funcionando
      await validateToken();

      toast.success('Login com Google realizado com sucesso!');
      window.location.href = '/feed';
    } catch (err: any) {
      console.error('🔴 erro login Google:', err);
      toast.error('Erro ao fazer login com Google');
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

// components/GoogleLinkButton.tsx
import { GoogleLogin } from '@react-oauth/google';
import { useSocialConnections } from '../../hooks/useSocialConnections';
import useAuthStore from '../../stores/authStore';
import { toast } from 'react-toastify';

interface GoogleLinkButtonProps {
  onSuccess?: () => void;
}

export default function GoogleLinkButton({ onSuccess }: GoogleLinkButtonProps) {
  const { linkGoogleAccount } = useSocialConnections();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;
      const result = await linkGoogleAccount(idToken);

      // Atualiza o usuário na store
      setUser(result.user);

      toast.success('Google vinculado com sucesso!');
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao vincular Google:', error);
      toast.error('Erro ao vincular Google');
    }
  };

  const handleError = () => {
    toast.error('Falha na autenticação com Google');
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        ux_mode="popup"
        text="signin_with"
        size="large"
      />
    </div>
  );
}

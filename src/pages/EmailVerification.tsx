import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const EmailVerification = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      const token = params.get('token');
      if (!token) {
        toast.error('Token inválido.');
        navigate('/login');
        return;
      }

      try {
        await api.post('/auth/verify-email', { token });
        toast.success('E-mail verificado com sucesso!');
        navigate('/login');
      } catch {
        toast.error('Link expirado ou inválido.');
        navigate('/verify-pending');
      }
    };

    verifyEmail();
  }, [params, navigate]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p>Verificando seu e-mail...</p>
      </div>
    </main>
  );
};

export default EmailVerification;

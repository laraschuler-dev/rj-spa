import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import SubmitButton from '../components/ui/SubmitButton';
import api from '../services/api';
import { toast } from 'react-toastify';
import PasswordInput from '../components/ui/PasswordInput';
import GoogleLoginButton from '../components/ui/GoogleLoginButton';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  // Estado para controlar o loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Digite um e-mail válido.');
      return;
    }

    // Impede múltiplos envios
    if (isSubmitting) return;

    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/auth/users', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success(
        'Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.'
      );
      localStorage.setItem('pendingEmail', formData.email);
      navigate('/verify-pending');
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Exibe a mensagem de erro retornada pelo backend
        const backendMessage = err.response.data.error || 'Erro ao criar conta';
        toast.error(backendMessage);
      } else if (err.request) {
        // Erro relacionado à requisição (ex.: sem resposta do servidor)
        toast.error(
          'Não foi possível conectar ao servidor. Verifique sua conexão.'
        );
      } else {
        // Erro desconhecido
        toast.error('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      // Reativa o botão após o envio (sucesso ou erro)
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-lg mx-4 sm:mx-0">
        {/* Título */}
        <Typography variant="h2" className="text-primary text-center mb-6">
          Criar Conta
        </Typography>
        <Typography
          variant="p"
          className="text-sm text-gray-600 text-center mb-6"
        >
          Junte-se à Rede Solidária e comece a fazer a diferença.
        </Typography>

        {/* Formulário de Registro */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Nome completo
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu nome"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(99) 99999-9999"
              required
            />
          </div>

          <div>
            <PasswordInput
              type="password"
              id="password"
              label="Senha"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div>
            <PasswordInput
              type="password"
              id="confirmPassword"
              label="Confirmar Senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              required
            />
          </div>

          {/* Exibe mensagem de erro, se houver */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Botão de Criar Conta */}
          <SubmitButton loading={isSubmitting}>Criar Conta</SubmitButton>
        </form>

        {/* Divisor */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">Ou se preferir</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center max-w-md">
          {/* Botão de login com Google */}
          <GoogleLoginButton />
        </div>

        {/* Link para login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;

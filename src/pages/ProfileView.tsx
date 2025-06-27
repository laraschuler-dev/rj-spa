import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Typography from '../components/ui/Typography';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { FaMapMarkerAlt } from 'react-icons/fa';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';

interface UserData {
  name: string;
  email: string;
  fone?: string;
}

interface UserProfile {
  translated_type?: string;
  profile_photo?: string;
  bio?: string;
  city?: string;
  state?: string;
}

const ProfileView: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  const apiBaseUrl = axios.defaults.baseURL || '';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;

        setUser({
          name: data.name,
          email: data.email,
          fone: data.fone,
        });

        setProfile({
          translated_type: data.profile.translated_type,
          profile_photo: data.profile.profile_photo,
          bio: data.profile.bio,
          city: data.profile.city,
          state: data.profile.state,
        });
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (isLoading) {
    return <div className="text-center mt-12">Carregando perfil...</div>;
  }

  if (!profile || !user) {
    return (
      <div className="text-center mt-12">
        <p>Perfil não encontrado.</p>
        <Link to="/profile/edit" className="text-primary hover:underline">
          Criar Perfil
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center">
        {/* Foto de perfil */}
        {profile.profile_photo ? (
          <img
            src={`${apiBaseUrl}${profile.profile_photo}`}
            alt="Foto de perfil"
            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <CgProfile size={48} className="text-gray-500" />
          </div>
        )}

        {/* Nome */}
        <Typography
          variant="h2"
          className="text-xl font-bold text-primary mb-1"
        >
          {user.name}
        </Typography>

        {/* Tipo de perfil */}
        <p className="text-sm text-gray-600 mb-2">
          {profile.translated_type || 'Tipo de perfil não informado'}
        </p>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-700 text-sm mb-4 italic">"{profile.bio}"</p>
        )}

        {/* Localização */}
        {(profile.city || profile.state) && (
          <p className="flex justify-center items-center gap-2 text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt />
            {profile.city}
            {profile.city && profile.state ? ' - ' : ''}
            {profile.state}
          </p>
        )}

        {/* Contato */}
        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.fone && (
            <p>
              <strong>Telefone:</strong> {user.fone}
            </p>
          )}
        </div>

        {/* Botão editar */}
        <Link to="/profile/edit">
          <Button>Editar Perfil</Button>
        </Link>
      </div>
    </main>
  );
};

export default ProfileView;

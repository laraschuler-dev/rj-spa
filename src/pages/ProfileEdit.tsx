import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/ui/CustomSelect';
import Typography from '../components/ui/Typography';
import useAuthStore from '../stores/authStore';
import { CgProfile } from 'react-icons/cg';
import SubmitButton from '../components/ui/SubmitButton';
import { Link } from 'react-router-dom';

const profileOptions = [
  { value: '', label: 'Perfil' },
  { value: 'psr', label: 'Pessoa em situação de rua' },
  { value: 'volunteer', label: 'Voluntário(a)' },
  { value: 'ong', label: 'ONG' },
  { value: 'company', label: 'Empresa' },
  { value: 'public_institution', label: 'Instituição Pública' },
];

const ProfileEdit: React.FC = () => {
  const [form, setForm] = useState({
    profile_type: '',
    bio: '',
    city: '',
    state: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          profile_type: res.data.profile?.profile_type || '',
          bio: res.data.profile?.bio || '',
          city: res.data.profile?.city || '',
          state: res.data.profile?.state || '',
        });
        if (res.data.profile?.profile_photo) {
          setPhotoPreview(
            `${axios.defaults.baseURL}${res.data.profile.profile_photo}`
          );
        }
      } catch (err) {
        console.error('Erro ao carregar dados do perfil:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (value: string) => {
    setForm({ ...form, profile_type: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put('/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (photoFile) {
        const formData = new FormData();
        formData.append('profile_photo', photoFile);

        await axios.put('/profile/photo', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      navigate('/profile');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <main className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <Typography variant="h1" className="text-center text-primary mb-6">
        Editar Perfil
      </Typography>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Foto de perfil personalizada */}
        <div className="flex flex-col items-center gap-2">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center">
              <CgProfile size={36} className="text-gray-500" />
            </div>
          )}
          <label className="mt-2 cursor-pointer text-sm text-primary hover:underline">
            Alterar Foto
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <CustomSelect
          label="Tipo de perfil"
          options={profileOptions}
          value={form.profile_type}
          onChange={handleSelect}
        />

        <textarea
          name="bio"
          placeholder="Sua bio..."
          value={form.bio}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="Cidade"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="state"
            placeholder="Estado"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <SubmitButton>Salvar</SubmitButton>
          <Link
            to="/profile"
            className="text-sm text-red-500 hover:text-red-600 hover:underline transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
};

export default ProfileEdit;

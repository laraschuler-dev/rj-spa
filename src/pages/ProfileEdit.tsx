import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomSelect from '../components/ui/CustomSelect';
import Typography from '../components/ui/Typography';
import SubmitButton from '../components/ui/SubmitButton';
import { toast } from 'react-toastify';
import CancelButton from '../components/ui/CancelButton';
import { useProfileStore } from '../stores/profileStore';
import { useEditProfile, ProfileFormData } from '../hooks/useEditProfile';
import BackButton from '../components/ui/BackButton';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import { useAuth } from '../hooks/useAuth';
import AvatarInitials from '../components/ui/AvatarInitials';
import CitySelect from '../components/ui/CitySelect';
import StateSelect from '../components/ui/StateSelect';

const profileOptions = [
  { value: '', label: 'Perfil' },
  { value: 'psr', label: 'Pessoa em situação de rua' },
  { value: 'volunteer', label: 'Voluntário(a)' },
  { value: 'ong', label: 'ONG' },
  { value: 'company', label: 'Empresa' },
  { value: 'public_institution', label: 'Instituição Pública' },
];

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const { editProfile, loading } = useEditProfile();
  const { user: currentUser } = useAuth();

  const [form, setForm] = useState<ProfileFormData>({
    profile_type: '',
    bio: '',
    city: '',
    state: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [initialForm, setInitialForm] = useState<ProfileFormData | null>(null);
  const [initialPhoto, setInitialPhoto] = useState<string | null>(null);

  // Atualiza form quando profile muda na store
  useEffect(() => {
    if (profile) {
      const loadedForm = {
        profile_type: (profile.profile_type as any) || '',
        bio: profile.bio || '',
        city: profile.city || '',
        state: profile.state || '',
      };
      setForm(loadedForm);
      setInitialForm(loadedForm); // guarda estado inicial
      if (profile.profile_photo) {
        const resolved = resolveImageUrl(profile.profile_photo);
        setPhotoPreview(resolved);
        setInitialPhoto(resolved);
      } else {
        setInitialPhoto(null);
      }
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (value: string) => {
    setForm({
      ...form,
      profile_type: value as ProfileFormData['profile_type'],
    });
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
    const result = await editProfile(form, photoFile);

    if (result.success) {
      toast.success('Perfil atualizado com sucesso!');
      navigate('/profile');
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  // ✅ Calcula se houve alguma mudança
  const isChanged = useMemo(() => {
    if (!initialForm) return false;

    const formChanged =
      form.profile_type !== initialForm.profile_type ||
      form.bio !== initialForm.bio ||
      form.city !== initialForm.city ||
      form.state !== initialForm.state;

    const photoChanged = photoFile !== null || photoPreview !== initialPhoto;

    return formChanged || photoChanged;
  }, [form, photoFile, photoPreview, initialForm, initialPhoto]);

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <BackButton to="/feed" className="fixed top-6 left-6 z-50" />
      <div className="w-full max-w-[600px] bg-white p-8 rounded-2xl shadow-lg text-center mx-auto">
        <Typography variant="h1" className="text-center text-primary mb-6">
          Editar Perfil
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border shadow"
              />
            ) : (
              <div className="w-32 h-32 mx-auto rounded-full bg-accent flex items-center justify-center mb-4 border border-white">
                <AvatarInitials
                  name={currentUser?.name}
                  className="w-20 h-20 text-4xl"
                />
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
            options={profileOptions}
            value={form.profile_type}
            onChange={handleSelect}
          />

          <textarea
            name="bio"
            placeholder="Sua bio..."
            value={form.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <div className="grid grid-cols-2 gap-4">
            <StateSelect
              value={form.state}
              onChange={(value) => setForm({ ...form, state: value })}
            />
            <CitySelect
              state={form.state}
              value={form.city}
              onChange={(value) => setForm({ ...form, city: value })}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <SubmitButton disabled={loading || !isChanged}>
              {loading ? 'Salvando...' : 'Salvar'}
            </SubmitButton>
            <CancelButton mode="edit" className="mx-auto block" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default ProfileEdit;

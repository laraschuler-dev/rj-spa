import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';
import ImageUpload from '../../components/ui/ImageUpload'; // ✅ import do componente

const CreateComplaintPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isAnonymous: false,
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '2'); // complaint
    postData.append('content', formData.description);

    const metadata = {
      title: formData.title,
      description: formData.description,
      isAnonymous: formData.isAnonymous,
    };
    postData.append('metadata', JSON.stringify(metadata));

    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Denúncia enviada com sucesso!');
      navigate('/dashboard');
    } catch {
      toast.error('Erro ao enviar denúncia.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Nova Denúncia
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Violência contra PSR)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="description"
            placeholder="Descreva o ocorrido"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="accent-primary"
            />
            Enviar como anônimo
          </label>

          {/* ✅ Componente reaproveitado */}
          <ImageUpload
            images={formData.images}
            onChange={(files) =>
              setFormData((prev) => ({ ...prev, images: files }))
            }
          />

          <SubmitButton>Enviar Denúncia</SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default CreateComplaintPost;

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';
import ImageUpload from '../../components/ui/ImageUpload';

const CreateEventPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    content: '',
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '8'); // ID da categoria EVENT
    postData.append('content', formData.content || formData.title);

    const metadata = {
      title: formData.title,
      location: formData.location,
      date: formData.date,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Evento publicado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao publicar evento.');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Novo Evento
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título do evento (ex: Feira de Saúde)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição do evento (opcional)"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="location"
            placeholder="Local (ex: Praça Central)"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Upload de imagens */}
          <ImageUpload
            images={formData.images}
            onChange={(files) =>
              setFormData((prev) => ({ ...prev, images: files }))
            }
          />

          <SubmitButton>Publicar</SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default CreateEventPost;

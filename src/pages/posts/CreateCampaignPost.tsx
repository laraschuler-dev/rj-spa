import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';
import ImageUpload from '../../components/ui/ImageUpload';

const CreateCampaignPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    deadline: '',
    organizer: '',
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
    postData.append('categoria_idcategoria', '3'); // CAMPAIGN
    postData.append('content', formData.content);

    const metadata = {
      title: formData.title,
      goal: formData.goal,
      deadline: formData.deadline,
      organizer: formData.organizer,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Campanha criada com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro ao criar campanha.');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Nova Campanha
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título da campanha"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição adicional da campanha"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="goal"
            placeholder="Meta (ex: Arrecadar 100 cobertores)"
            value={formData.goal}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="date"
            name="deadline"
            placeholder="Prazo"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="organizer"
            placeholder="Organizador (ONG, associação...)"
            value={formData.organizer}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Upload de imagens (opcional) */}
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

export default CreateCampaignPost;

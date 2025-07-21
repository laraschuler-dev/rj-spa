import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';
import ImageUpload from '../../components/ui/ImageUpload';

const CreateJobPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    requirements: '',
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
    postData.append('categoria_idcategoria', '7'); // JOB_OFFER
    postData.append('content', formData.content || formData.title);

    const metadata = {
      title: formData.title,
      requirements: formData.requirements,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts', postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Vaga publicada com sucesso!');
      navigate('/feed');
    } catch (error: any) {
      toast.error('Erro ao publicar vaga.');
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Nova Vaga
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título da vaga (ex: Assistente Social)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição adicional da vaga (opcional)"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="requirements"
            placeholder="Requisitos da vaga (ex: formação, experiência)"
            value={formData.requirements}
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

export default CreateJobPost;

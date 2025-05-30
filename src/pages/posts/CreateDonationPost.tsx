import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';

const CreateDonationPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    itemType: '',
    condition: '',
    location: '',
    availability: '',
    content: '',
    images: [] as File[],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      images: selectedFiles,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '1'); // DONATION
    postData.append('content', formData.content);

    const metadata = {
      title: formData.title,
      itemType: formData.itemType,
      condition: formData.condition,
      location: formData.location,
      availability: formData.availability,
    };
    postData.append('metadata', JSON.stringify(metadata));

    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post criado com sucesso!');
      navigate('/dashboard');
    } catch {
      toast.error('Erro ao criar post.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          Nova Doação
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Doação de Roupas)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição da doação"
            value={formData.content}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="itemType"
            placeholder="Tipo de item (ex: roupas)"
            value={formData.itemType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Condição do item</option>
            <option value="novo">Novo</option>
            <option value="usado">Usado</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Localização"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="availability"
            placeholder="Disponibilidade (ex: Manhãs)"
            value={formData.availability}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label
            htmlFor="imageUpload"
            className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-400 rounded-lg px-4 py-3 text-sm text-gray-600 cursor-pointer hover:border-primary hover:bg-gray-50 transition"
          >
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16l4-4a2 2 0 012.828 0l2.344 2.344a2 2 0 002.828 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>Selecionar imagens (até 5)</span>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {formData.images.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {formData.images.length} imagem(ns) selecionada(s)
            </p>
          )}

          {/* Botão de Entrar */}
          <SubmitButton>Publicar</SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default CreateDonationPost;

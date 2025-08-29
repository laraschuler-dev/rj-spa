import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';
import { toast } from 'react-toastify';
import Typography from '../../components/ui/Typography';
import SubmitButton from '../../components/ui/SubmitButton';
import CustomSelect from '../../components/ui/CustomSelect';
import ImageUpload from '../../components/ui/ImageUpload';

const CreateDonationPost: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    itemType: '',
    condition: '',
    customCondition: '',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '1'); // DONATION
    postData.append('content', formData.content);

    const metadata = {
      title: formData.title,
      itemType: formData.itemType,
      condition:
        formData.condition === 'outro'
          ? formData.customCondition
          : formData.condition,
      location: formData.location,
      availability: formData.availability,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    try {
      await axios.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Post criado com sucesso!');
      navigate('/feed');
    } catch (error: any) {
      toast.error('Erro ao criar post.');

      if (error.response && error.response.data) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
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

          <CustomSelect
            value={formData.condition}
            onChange={(val) => setFormData({ ...formData, condition: val })}
            options={[
              { label: 'Novo', value: 'novo' },
              { label: 'Usado', value: 'usado' },
              { label: 'Outro', value: 'outro' },
            ]}
            placeholder="Condição do item"
          />

          {formData.condition === 'outro' && (
            <input
              type="text"
              name="customCondition"
              placeholder="Descreva a condição"
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.customCondition}
              onChange={handleChange}
            />
          )}

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

          {/* Image Upload Component */}
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

export default CreateDonationPost;

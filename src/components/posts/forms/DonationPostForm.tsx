// src/components/posts/forms/DonationPostForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import CustomSelect from '../../ui/CustomSelect';
import ImageUpload from '../../ui/ImageUpload';

interface DonationPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    title?: string;
    content?: string;
    itemType?: string;
    condition?: string;
    customCondition?: string;
    location?: string;
    availability?: string;
    images?: File[];
  };
}

const DonationPostForm: React.FC<DonationPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    itemType: initialData?.itemType || '',
    condition: initialData?.condition || '',
    customCondition: initialData?.customCondition || '',
    location: initialData?.location || '',
    availability: initialData?.availability || '',
    images: initialData?.images || ([] as File[]),
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
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

    onSubmit(postData);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create' ? 'Nova Doação' : 'Editar Doação'}
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

          <ImageUpload
            images={formData.images}
            onChange={(files) =>
              setFormData((prev) => ({ ...prev, images: files }))
            }
          />

          <SubmitButton>
            {mode === 'create' ? 'Publicar' : 'Salvar Alterações'}
          </SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default DonationPostForm;

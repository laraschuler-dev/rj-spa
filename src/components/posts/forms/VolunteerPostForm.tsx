// src/components/posts/forms/VolunteerPostForm.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';

interface VolunteerPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    title?: string;
    serviceType?: string;
    availability?: string;
    qualifications?: string;
    content?: string;
    images?: File[];
  };
}

const VolunteerPostForm: React.FC<VolunteerPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    serviceType: initialData?.serviceType || '',
    availability: initialData?.availability || '',
    qualifications: initialData?.qualifications || '',
    content: initialData?.content || '',
    images: initialData?.images || ([] as File[]),
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '5'); // VOLUNTEER
    postData.append('content', formData.content || formData.title);

    const metadata = {
      title: formData.title,
      serviceType: formData.serviceType,
      availability: formData.availability,
      qualifications: formData.qualifications,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    onSubmit(postData);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create' ? 'Novo Voluntariado' : 'Editar Voluntariado'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Atendimento psicológico solidário)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição adicional (opcional)"
            value={formData.content}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="serviceType"
            placeholder="Tipo de serviço (ex: Psicologia, Odontologia...)"
            value={formData.serviceType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="availability"
            placeholder="Disponibilidade (ex: Fins de semana)"
            value={formData.availability}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="qualifications"
            placeholder="Requisitos (ex: CRP ativo, experiência com público)"
            value={formData.qualifications}
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

export default VolunteerPostForm;

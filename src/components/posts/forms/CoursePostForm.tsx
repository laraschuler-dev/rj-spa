// src/components/posts/forms/CoursePostForm.tsx
import React, { useState, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';

interface CoursePostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    title?: string;
    content?: string;
    format?: string;
    duration?: string;
    requirements?: string;
    images?: File[];
  };
}

const CoursePostForm: React.FC<CoursePostFormProps> = ({
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    format: initialData?.format || '',
    duration: initialData?.duration || '',
    requirements: initialData?.requirements || '',
    images: initialData?.images || ([] as File[]),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const postData = new FormData();
    postData.append('categoria_idcategoria', '6'); // COURSE
    postData.append('content', formData.content || formData.title);

    const metadata = {
      title: formData.title,
      format: formData.format,
      duration: formData.duration,
      requirements: formData.requirements,
    };
    postData.append('metadata', JSON.stringify(metadata));

    formData.images.forEach((img) => postData.append('images', img));

    onSubmit(postData);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create' ? 'Novo Curso' : 'Editar Curso'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Curso de Informática)"
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
            name="format"
            placeholder="Formato (ex: Presencial, Online)"
            value={formData.format}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="duration"
            placeholder="Duração (ex: 4 semanas)"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="requirements"
            placeholder="Requisitos (ex: Maior de 16 anos)"
            value={formData.requirements}
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

export default CoursePostForm;

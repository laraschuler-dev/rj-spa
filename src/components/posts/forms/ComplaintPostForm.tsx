// src/components/posts/forms/ComplaintPostForm.tsx
import React, { useState, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';

interface ComplaintPostFormProps {
  onSubmit: (data: FormData) => Promise<void>; // ✅ corrigido Promise<void>
  mode: 'create' | 'edit';
  initialData?: any; // opcional para edição futura
}

const ComplaintPostForm: React.FC<ComplaintPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    isAnonymous: initialData?.isAnonymous || false,
    images: initialData?.images || ([] as File[]),
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
    postData.append('categoria_idcategoria', '2'); // ✅ Complaint
    postData.append('content', formData.description);

    const metadata = {
      title: formData.title,
      description: formData.description,
      isAnonymous: formData.isAnonymous,
    };
    postData.append('metadata', JSON.stringify(metadata));

    formData.images.forEach((img) => postData.append('images', img));

    await onSubmit(postData); // ✅ garante retorno compatível com Promise<void>
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create' ? 'Nova Denúncia' : 'Editar Denúncia'}
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

          <ImageUpload
            images={formData.images}
            onChange={(files) =>
              setFormData((prev) => ({ ...prev, images: files }))
            }
          />

          <SubmitButton>
            {mode === 'create' ? 'Enviar Denúncia' : 'Salvar Alterações'}
          </SubmitButton>
        </form>
      </div>
    </main>
  );
};

export default ComplaintPostForm;

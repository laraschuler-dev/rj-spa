// src/components/posts/forms/HelpRequestPostForm.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';
import CustomSelect from '../../ui/CustomSelect';

interface HelpRequestPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    title?: string;
    type?: string;
    urgency?: string;
    deadline?: string;
    content?: string;
    images?: File[];
  };
}

const HelpRequestPostForm: React.FC<HelpRequestPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    type: initialData?.type || '',
    urgency: initialData?.urgency || '',
    deadline: initialData?.deadline || '',
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
    postData.append('categoria_idcategoria', '4'); // HELP_REQUEST
    postData.append('content', formData.content || formData.title);

    const metadata = {
      title: formData.title,
      type: formData.type,
      urgency: formData.urgency,
      deadline: formData.deadline,
    };

    postData.append('metadata', JSON.stringify(metadata));
    formData.images.forEach((img) => postData.append('images', img));

    onSubmit(postData);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create'
            ? 'Novo Pedido de Ajuda'
            : 'Editar Pedido de Ajuda'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Ajuda urgente com alimentação)"
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
            name="type"
            placeholder="Tipo de ajuda (ex: Alimentos, Abrigo...)"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <CustomSelect
            value={formData.urgency}
            onChange={(val) => setFormData({ ...formData, urgency: val })}
            options={[
              { label: 'Baixa', value: 'Baixa' },
              { label: 'Média', value: 'Média' },
              { label: 'Alta', value: 'Alta' },
            ]}
            placeholder="Nível de urgência"
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
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

export default HelpRequestPostForm;

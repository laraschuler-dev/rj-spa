// src/components/posts/forms/DonationPostForm.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import CustomSelect from '../../ui/CustomSelect';
import ImageUpload from '../../ui/ImageUpload';
import { UploadImage } from '../../../types/upload';
import { useDeletePostImage } from '../../../hooks/useDeletePostImage';
import CancelButton from '../../ui/CancelButton';

interface DonationPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    id: number;
    title?: string;
    content?: string;
    itemType?: string;
    condition?: string;
    customCondition?: string;
    location?: string;
    availability?: string;
    images?: UploadImage[];
  };
  onClose?: () => void;
}

const DonationPostForm: React.FC<DonationPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
  onClose,
}) => {
  const postId = initialData?.id;
  const { deleteImage } = useDeletePostImage(postId ?? 0);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    content: initialData?.content ?? '',
    itemType: initialData?.itemType ?? '',
    condition: initialData?.condition ?? '',
    customCondition: initialData?.customCondition ?? '',
    location: initialData?.location ?? '',
    availability: initialData?.availability ?? '',
    images: initialData?.images ?? [], // já suporta {id, url} ou File
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

    // arquivos novos
    formData.images
      .filter((img): img is File => img instanceof File)
      .forEach((file) => postData.append('images', file));

    // IDs das imagens existentes
    const existingIds = formData.images
      .filter(
        (img): img is { id: number; url: string } => !(img instanceof File)
      )
      .map((img) => img.id);
    postData.append('existingImageIds', JSON.stringify(existingIds));

    await onSubmit(postData);
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
            onChange={(files: UploadImage[]) =>
              setFormData((prev) => ({ ...prev, images: files }))
            }
            onRemoveExisting={async (imageId: number) => {
              if (!postId) return;
              await deleteImage(imageId);
              setFormData((prev) => ({
                ...prev,
                images: prev.images.filter(
                  (img) =>
                    !(
                      typeof img === 'object' &&
                      'id' in img &&
                      img.id === imageId
                    )
                ),
              }));
            }}
          />

          <SubmitButton>
            {mode === 'create' ? 'Publicar' : 'Salvar Alterações'}
          </SubmitButton>

          <CancelButton mode={mode} onCloseModal={onClose} />
        </form>
      </div>
    </main>
  );
};

export default DonationPostForm;

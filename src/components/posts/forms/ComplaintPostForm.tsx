// src/components/posts/forms/ComplaintPostForm.tsx
import React, { useState, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';
import { UploadImage } from '../../../types/upload';
import { useDeletePostImage } from '../../../hooks/useDeletePostImage';
import CancelButton from '../../ui/CancelButton';
import { toast } from 'react-toastify';

interface ComplaintPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    id: number;
    title: string;
    description: string;
    isAnonymous: boolean;
    images: UploadImage[];
  };
  onClose?: () => void;
}

const ComplaintPostForm: React.FC<ComplaintPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
  onClose,
}) => {
  const postId = initialData?.id;
  const { deleteImage } = useDeletePostImage(postId ?? 0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    isAnonymous: initialData?.isAnonymous ?? false,
    images: initialData?.images ?? [],
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

    // Impede múltiplos envios
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const postData = new FormData();
      postData.append('categoria_idcategoria', '2'); // Complaint
      postData.append('content', formData.description);

      const metadata = {
        title: formData.title,
        description: formData.description,
        isAnonymous: formData.isAnonymous,
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
    } catch (err: any) {
      // Tratamento de erro similar ao Login
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err.request) {
        toast.error('Erro de conexão com o servidor.');
      } else {
        toast.error(
          `Erro inesperado ao ${mode === 'create' ? 'criar' : 'editar'} denúncia.`
        );
      }
    } finally {
      // Reativa o botão após o envio (sucesso ou erro)
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`flex justify-center ${
        mode === 'edit'
          ? 'min-h-0 py-2 bg-transparent'
          : 'min-h-screen py-12 items-center bg-background'
      }`}
    >
      <div
        className={`w-full bg-white p-6 sm:p-8 rounded-2xl shadow-lg 
  ${mode === 'create' ? 'max-w-sm sm:max-w-md' : 'max-w-md'} mx-4 sm:mx-0`}
      >
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

          <SubmitButton loading={isSubmitting}>
            {mode === 'create' ? 'Enviar Denúncia' : 'Salvar Alterações'}
          </SubmitButton>

          <CancelButton mode={mode} onCloseModal={onClose} />
        </form>
      </div>
    </main>
  );
};

export default ComplaintPostForm;

// src/components/posts/forms/GeneralPostForm.tsx
import React, { useState, FormEvent } from 'react';
import Typography from '../../ui/Typography';
import SubmitButton from '../../ui/SubmitButton';
import ImageUpload from '../../ui/ImageUpload';
import { UploadImage } from '../../../types/upload';
import { useDeletePostImage } from '../../../hooks/useDeletePostImage';
import CancelButton from '../../ui/CancelButton';
import { toast } from 'react-toastify';

interface GeneralPostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: {
    id: number;
    title?: string;
    content?: string;
    images?: UploadImage[];
  };
  onClose?: () => void;
}

const GeneralPostForm: React.FC<GeneralPostFormProps> = ({
  onSubmit,
  mode,
  initialData,
  onClose,
}) => {
  const postId = initialData?.id;
  const { deleteImage } = useDeletePostImage(postId ?? 0);

  // Estado para controlar o loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title ?? '',
    content: initialData?.content ?? '',
    images: initialData?.images ?? [], // suporta {id, url} ou File
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Impede múltiplos envios
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const postData = new FormData();
      postData.append('categoria_idcategoria', '9'); // GENERAL
      postData.append('content', formData.content || formData.title);

      const metadata = {
        title: formData.title,
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
      // Tratamento de erro padronizado
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err.request) {
        toast.error('Erro de conexão com o servidor.');
      } else {
        toast.error(
          `Erro inesperado ao ${mode === 'create' ? 'publicar' : 'editar'} informação geral.`
        );
      }
    } finally {
      // Reativa o botão após o envio (sucesso ou erro)
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`flex justify-center bg-background ${
        mode === 'edit' ? 'min-h-0 py-2' : 'min-h-screen py-12 items-center'
      }`}
    >
      <div
        className={`w-full bg-white p-8 rounded-2xl shadow-lg 
    ${mode === 'create' ? 'max-w-xs sm:max-w-md' : 'max-w-md'}`}
      >
        <Typography variant="h2" className="text-primary text-center mb-6">
          {mode === 'create'
            ? 'Publicar Informação Geral'
            : 'Editar Informação Geral'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Título (ex: Direitos sociais para PSR)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="content"
            placeholder="Descrição adicional"
            value={formData.content}
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

          <SubmitButton loading={isSubmitting}>
            {mode === 'create' ? 'Publicar' : 'Salvar Alterações'}
          </SubmitButton>
          <CancelButton mode={mode} onCloseModal={onClose} />
        </form>
      </div>
    </main>
  );
};

export default GeneralPostForm;

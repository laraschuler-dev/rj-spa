// ImageUpload.tsx
import React, { useEffect } from 'react';
import { UploadImage } from '../../types/upload';
import { X } from 'lucide-react';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

interface ImageUploadProps {
  images: UploadImage[];
  onChange: (images: UploadImage[]) => void;
  onRemoveExisting?: (imageId: number) => Promise<void>; // remover no backend
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  onRemoveExisting,
  maxImages = 5,
}) => {
  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newImages = [...images, ...files].slice(0, maxImages); // respeita limite
    console.log('Adicionando novas imagens:', files);
    onChange(newImages);
  };

  const handleRemove = async (index: number) => {
    const img = images[index];

    if (img && typeof img === 'object' && 'id' in img && img.id > 0) {
      console.log('Imagem existente detectada com id:', img.id);
      if (onRemoveExisting) {
        try {
          await onRemoveExisting(img.id);
          onChange(images.filter((_, i) => i !== index));
        } catch (error) {
          console.error('Erro ao remover imagem no backend:', error);
        }
      }
    } else if (img instanceof File) {
      onChange(images.filter((_, i) => i !== index));
    } else if (typeof img === 'string') {
      onChange(images.filter((_, i) => i !== index));
    } else {
      console.warn('Tipo de imagem não reconhecido:', img);
    }
  };

  useEffect(() => {
    const objectUrls: string[] = [];

    images.forEach((img) => {
      if (img instanceof File) {
        const url = URL.createObjectURL(img);
        objectUrls.push(url);
      }
    });

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((img, index) => {
          let src = '';

          if (img instanceof File) {
            src = URL.createObjectURL(img);
          } else if (typeof img === 'string') {
            src = resolveImageUrl(img);
          } else if (typeof img === 'object' && 'url' in img) {
            src = resolveImageUrl(img.url);
          }

          return (
            <div key={index} className="relative w-24 h-24">
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {images.length < maxImages && (
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
          <span>Selecionar imagens (até {maxImages})</span>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleAdd}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;

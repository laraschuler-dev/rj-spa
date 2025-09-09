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
    console.log('Imagem a ser removida:', img);
    console.log('Tipo da imagem:', typeof img);
    console.log('Tem id?', img && typeof img === 'object' && 'id' in img);

    if (img && typeof img === 'object' && 'id' in img && img.id > 0) {
      console.log('Imagem existente detectada com id:', img.id);
      if (onRemoveExisting) {
        try {
          console.log('Chamando onRemoveExisting para id:', img.id);
          await onRemoveExisting(img.id);
          console.log('onRemoveExisting finalizado para id:', img.id);
          onChange(images.filter((_, i) => i !== index));
          console.log('Imagem removida do estado local:', img.id);
        } catch (error) {
          console.error('Erro ao remover imagem no backend:', error);
        }
      }
    } else if (img instanceof File) {
      console.log('Imagem nova detectada (File), removendo localmente.');
      onChange(images.filter((_, i) => i !== index));
    } else if (typeof img === 'string') {
      console.log('Imagem como string detectada, removendo localmente.');
      onChange(images.filter((_, i) => i !== index));
    } else {
      console.warn('Tipo de imagem não reconhecido:', img);
    }
  };

  // previne memory leaks ao usar URL.createObjectURL
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
        <input type="file" multiple accept="image/*" onChange={handleAdd} />
      )}
    </div>
  );
};

export default ImageUpload;

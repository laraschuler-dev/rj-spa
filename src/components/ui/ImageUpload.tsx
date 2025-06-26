import React from 'react';

interface ImageUploadProps {
  images: File[];
  onChange: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const combined = [...images, ...Array.from(selectedFiles)].slice(0, 5);
    onChange(combined);
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <>
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
        <span>Selecionar imagens (até 5)</span>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image)}
                alt={`Imagem ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg shadow"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                aria-label="Remover imagem"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ImageUpload;

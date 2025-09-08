// components/posts/EditPostModal.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import PostFormFactory from './PostFormFactory';
import { useEditPost } from '../../hooks/useEditPost';
import { toast } from 'react-toastify';

interface EditPostModalProps {
  postId: number;
  shareId?: number;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  postId,
  shareId,
  onClose,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const { editPost, loading } = useEditPost({ postId, shareId });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const params = shareId ? { params: { shareId } } : {};
        const { data } = await axios.get(`/posts/${postId}`, params);

        setCategoryId(data.categoryId);

        setInitialData({
          id: data.id,
          ...data.metadata,
          content: data.content ?? '',
          images: Array.isArray(data.images) ? data.images : [],
        });
      } catch (error: any) {
        toast.error('Erro ao carregar post.');
        console.error(error);
      }
    };

    fetchPost();
  }, [postId, shareId]);

  if (!initialData || categoryId === null) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <PostFormFactory
          categoryId={categoryId}
          mode="edit"
          initialData={initialData}
          onSubmit={async (formData: FormData) => {
            await editPost(formData);
            onClose();
            onSuccess?.();
          }}
        />
      </div>
    </div>
  );
};

export default EditPostModal;

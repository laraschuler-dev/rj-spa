// components/posts/EditPostModal.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import PostFormFactory from './PostFormFactory';
import { useEditPost } from '../../hooks/useEditPost';
import { toast } from 'react-toastify';
import { usePostStore } from '../../stores/postStore';
import { PostListItem } from '../../types/Post';
import SubmitButton from '../ui/SubmitButton'; // ✅ Importe o SubmitButton

interface EditPostModalProps {
  postId: number;
  shareId?: number;
  onClose: () => void;
  onSuccess?: (updatedPost: PostListItem) => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  postId,
  shareId,
  onClose,
}) => {
  const [initialData, setInitialData] = useState<any>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const { editPost, loading } = useEditPost({ postId, shareId });
  const { updatePost } = usePostStore();
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Estado local

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

  const handleSubmit = async (formData: FormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const updatedPost = await editPost(formData);
      if (updatedPost) updatePost(updatedPost);
      onClose();
    } catch (error) {
      console.error('Erro ao editar post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData || categoryId === null) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-2 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 focus:outline-none"
          >
            ×
          </button>
          <PostFormFactory
            categoryId={categoryId}
            mode="edit"
            initialData={initialData}
            onSubmit={async (formData: FormData) => {
              const updatedPost = await editPost(formData);
              if (updatedPost) updatePost(updatedPost);
              onClose();
            }}
            onClose={onClose}
            loading={loading}
          />
          <div className="mt-4 pt-4 border-t">
            <SubmitButton loading={isSubmitting}>
              Salvar Alterações
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;

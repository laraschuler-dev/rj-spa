// components/posts/EditPostModal.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import PostFormFactory from './PostFormFactory';
import { useEditPost } from '../../hooks/useEditPost';
import { toast } from 'react-toastify';
import { usePostStore } from '../../stores/postStore';
import { PostListItem } from '../../types/Post';
import { FiX } from 'react-icons/fi';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-2 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[500px] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 focus:outline-none"
          >
            <FiX size={18} className="text-gray-500" />
          </button>

          <PostFormFactory
            categoryId={categoryId}
            mode="edit"
            initialData={initialData}
            onSubmit={async (formData: FormData) => {
              if (isSubmitting) return;
              setIsSubmitting(true);

              try {
                const updatedPost = await editPost(formData);
                console.log('✅ Resposta da API após editar:', updatedPost);

                if (updatedPost) {
                  updatePost(updatedPost);
                  onClose();
                }
              } catch (error) {
                console.error('Erro ao editar post:', error);
              } finally {
                setIsSubmitting(false);
              }
            }}
            onClose={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;

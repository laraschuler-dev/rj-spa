// components/posts/ShareEditModal.tsx
import React, { useEffect, useState } from 'react';
import Typography from '../ui/Typography';
import PostPreviewCard from './PostPreviewCard';
import { usePostDetails } from '../../hooks/usePostDetails';
import { useEditPost } from '../../hooks/useEditPost';
import SubmitButton from '../ui/SubmitButton';
import CancelButton from '../ui/CancelButton';
import { usePostStore } from '../../stores/postStore';
import { FiX } from 'react-icons/fi';

interface ShareEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  shareId: number;
  onSave?: (updatedPost: any) => void; // ✅ adicionado
}

const ShareEditModal: React.FC<ShareEditModalProps> = ({
  isOpen,
  onClose,
  postId,
  shareId,
  onSave, // ✅ desestruturação
}) => {
  const { post, loading } = usePostDetails(postId, shareId);
  const [message, setMessage] = useState('');
  const { editPost, loading: saving } = useEditPost({ postId, shareId });
  const { updatePost } = usePostStore();

  useEffect(() => {
    setMessage(post?.sharedBy?.message ?? '');
  }, [post]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('message', message);

      const updated = await editPost(formData);

      if (updated) {
        updatePost(updated); // atualiza store
        onSave?.(updated); // ✅ chama callback opcional
        onClose();
      }
    } catch (err) {
      console.error('Erro ao atualizar compartilhamento:', err);
    }
  };

  if (!isOpen || loading || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4 overflow-auto"
      onClick={onClose}
    >
      {/* ✅ MEIO-TERMO: max-w-lg (512px) - nem largo nem estreito */}
      <div
        className="bg-white rounded-2xl w-full max-w-lg my-8" // ✅ max-w-lg
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 focus:outline-none"
          >
            <FiX size={18} className="text-gray-500" />
          </button>

          <Typography variant="h2" className="text-primary text-center mb-4">
            Editar Compartilhamento
          </Typography>

          <div className="mb-4">
            <PostPreviewCard
              author={
                post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
                  ? {
                      id: 0,
                      name: 'Anônimo',
                      avatarUrl: undefined,
                    }
                  : {
                      id: post.user?.id || post.author?.id,
                      name:
                        post.user?.name ||
                        post.author?.name ||
                        'Usuário desconhecido',
                      avatarUrl: post.user?.avatarUrl || post.author?.avatarUrl,
                    }
              }
              createdAt={post.sharedBy?.sharedAt ?? post.createdAt}
              metadata={post.metadata}
              content={post.content}
              images={post.images?.map((url, index) => ({ id: index, url }))}
            />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Edite a mensagem do compartilhamento"
            className="w-full p-3 border rounded-lg text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            rows={3}
          />

          <div className="flex flex-col gap-3">
            <SubmitButton onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </SubmitButton>
            <CancelButton mode="edit" onCloseModal={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareEditModal;

import React, { useEffect, useState } from 'react';
import Typography from '../ui/Typography';
import PostPreviewCard from './PostPreviewCard';
import { usePostDetails } from '../../hooks/usePostDetails';
import { useEditPost } from '../../hooks/useEditPost';
import SubmitButton from '../ui/SubmitButton';
import CancelButton from '../ui/CancelButton';

interface ShareEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  shareId: number;
  onSave: () => void;
}

const ShareEditModal: React.FC<ShareEditModalProps> = ({
  isOpen,
  onClose,
  postId,
  shareId,
  onSave,
}) => {
  const { post, loading } = usePostDetails(postId, shareId);
  const [message, setMessage] = useState('');
  const { editPost, loading: saving } = useEditPost({ postId, shareId });

  useEffect(() => {
    setMessage(post?.sharedBy?.message ?? '');
  }, [post]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('message', message);
    await editPost(formData);
    onSave();
    onClose();
  };

  if (!isOpen || loading || !post) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão fechar no topo */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <Typography variant="h2" className="text-primary text-center mb-6">
          Editar Compartilhamento
        </Typography>

        <div className="mb-4">
          <PostPreviewCard
            author={post.author}
            createdAt={post.createdAt}
            metadata={post.metadata}
            content={post.content}
            images={post.images}
          />
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Edite a mensagem do compartilhamento"
          className="w-full p-3 border rounded-lg text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />

        <div className="flex flex-col items-center gap-2 mt-2">
          <SubmitButton onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </SubmitButton>
          <CancelButton mode="edit" onCloseModal={onClose} className="mt-1" />
        </div>
      </div>
    </div>
  );
};

export default ShareEditModal;

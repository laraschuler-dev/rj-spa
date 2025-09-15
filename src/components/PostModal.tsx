import React from 'react';
import PostCard from './PostCard';
import { usePostStore } from '../stores/postStore';
import { PostListItem } from '../types/Post';

interface PostModalProps {
  postId: number;
  shareId?: number;
  onClose: () => void;
  onLike?: (postId: number, shareId?: number) => void;
  onShare: () => void;
  onDelete: (postId: number, shareId?: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  shareId,
  onClose,
  onLike,
  onShare,
  onDelete,
}) => {
  const { posts, toggleLikePost } = usePostStore();

  // 🔑 Pega o post atualizado diretamente da store
  const modalPost: PostListItem | undefined = posts.find((p) => {
    // Se estamos procurando um post COMPARTILHADO
    if (shareId) {
      return p.sharedBy?.shareId === shareId;
    }
    // Se estamos procurando um post ORIGINAL
    else {
      return p.id === postId && !p.sharedBy; // ⚠️ IMPORTANTE: && !p.sharedBy
    }
  });

  if (!modalPost) return <p>Carregando...</p>;

  const handleLike = async () => {
    try {
      // Atualiza a store primeiro para feedback visual imediato
      toggleLikePost(postId, !modalPost.liked, shareId);

      // Depois chama a API
      if (onLike) {
        await onLike(postId, shareId);
      }
    } catch (err) {
      console.error('Erro ao curtir/descurtir post:', err);
      // Reverte se der erro
      toggleLikePost(postId, modalPost.liked, shareId);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <PostCard
          id={modalPost.id}
          title={modalPost.metadata?.title || ''}
          content={modalPost.content}
          images={
            modalPost.images?.map((img: any) =>
              typeof img === 'string' ? img : img.url
            ) || []
          }
          createdAt={modalPost.createdAt}
          categoryId={modalPost.categoria_idcategoria}
          metadata={modalPost.metadata}
          author={{
            id: modalPost.user?.id || modalPost.author?.id,
            name:
              modalPost.user?.name ||
              modalPost.author?.name ||
              'Usuário desconhecido',
            avatarUrl: modalPost.user?.avatarUrl || modalPost.author?.avatarUrl,
          }}
          isLiked={modalPost.liked ?? false}
          sharedBy={modalPost.sharedBy}
          expanded
          onLike={handleLike} // Use a função corrigida
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default PostModal;

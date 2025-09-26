import React from 'react';
import PostCard from './PostCard';
import { usePostStore } from '../stores/postStore';
import { PostListItem } from '../types/Post';
import { useEventAttendance } from '../hooks/useEventAttendance';

interface PostModalProps {
  postId: number;
  shareId?: number;
  onClose: () => void;
  onLike?: (postId: number, shareId?: number) => void;
  onShare: () => void;
  onEdit: (postId: number, shareId?: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  shareId,
  onClose,
  onLike,
  onShare,
  onEdit,
}) => {
  const { posts, toggleLikePost } = usePostStore(); // ✅ Remova toggleAttendance não usado

  // ✅ Use apenas o necessário do hook
  const { status, toggleAttendance: toggleAttendanceHook } = useEventAttendance(
    postId,
    shareId
  );

  // 🔑 Pega o post atualizado diretamente da store
  const modalPost: PostListItem | undefined = posts.find((p) => {
    if (shareId) {
      const matches = p.sharedBy?.shareId === shareId;
      return matches;
    } else {
      const matches = p.id === postId && !p.sharedBy;
      return matches;
    }
  });

  if (!modalPost) return <p>Carregando...</p>;

  const handleLike = async () => {
    try {
      // ✅ Garanta que não está passando undefined para liked
      const currentLiked = modalPost.liked ?? false;
      toggleLikePost(postId, !currentLiked, shareId);

      if (onLike) {
        await onLike(postId, shareId);
      }
    } catch (err) {
      console.error('Erro ao curtir/descurtir post:', err);
      // ✅ Reverte com valor seguro
      const currentLiked = modalPost.liked ?? false;
      toggleLikePost(postId, currentLiked, shareId);
    }
  };

  const handleAttendance = async () => {
    try {
      await toggleAttendanceHook();
    } catch (err) {
      console.error('Erro ao alternar presença:', err);
    }
  };

  const author =
    modalPost.categoria_idcategoria === 2 && modalPost.metadata?.isAnonymous
      ? {
          id: 0,
          name: 'Anônimo',
          avatarUrl: undefined,
        }
      : {
          id: modalPost.user?.id || modalPost.author?.id,
          name:
            modalPost.user?.name ||
            modalPost.author?.name ||
            'Usuário desconhecido',
          avatarUrl: modalPost.user?.avatarUrl || modalPost.author?.avatarUrl,
        };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[92vw] sm:max-w-[480px] md:max-w-[520px] mx-3 p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 focus:outline-none"
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
          author={author}
          isLiked={modalPost.liked ?? false}
          sharedBy={modalPost.sharedBy}
          expanded
          isInModal={true}
          onLike={handleLike}
          onShare={onShare}
          onAttend={handleAttendance}
          isAttending={status.userStatus === 'confirmed'}
          isPostOwner={modalPost.isPostOwner ?? false}
          isShareOwner={modalPost.isShareOwner ?? false}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};

export default PostModal;

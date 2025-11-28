import React from 'react';
import PostCard from './PostCard';
import { usePostStore } from '../../stores/postStore';
import { usePostDetails } from '../../hooks/usePostDetails';
import { useEventAttendance } from '../../hooks/useEventAttendance';
import { FiX } from 'react-icons/fi';

interface PostModalProps {
  postId: number;
  shareId?: number;
  onClose: () => void;
  onLike?: (postId: number, shareId?: number) => void;
  onShare: () => void;
  onEdit?: (postId: number, shareId?: number) => void;
  onDelete?: (postId: number, shareId?: number) => Promise<void>;
}

const PostModal: React.FC<PostModalProps> = ({
  postId,
  shareId,
  onClose,
  onLike,
  onShare,
  onEdit,
}) => {
  const { toggleLikePost } = usePostStore();

  // ✅ USA O MESMO HOOK QUE A PÁGINA DE DETALHES
  const { post, loading, error } = usePostDetails(postId, shareId);

  const { status, toggleAttendance: toggleAttendanceHook } = useEventAttendance(
    postId,
    shareId
  );

  if (loading) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-sm mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-gray-600">Carregando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-sm mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-center text-red-500 mb-4">
            {error || 'Post não encontrado'}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      const currentLiked = post.liked ?? false;
      toggleLikePost(postId, !currentLiked, shareId);

      if (onLike) {
        await onLike(postId, shareId);
      }
    } catch (err) {
      console.error('Erro ao curtir/descurtir post:', err);
      const currentLiked = post.liked ?? false;
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

  // ✅ CORREÇÃO: Simplificar a lógica do author para deixar o PostCard cuidar dos avatares
  const author = {
    id: post.user?.id || post.author?.id || 0,
    name:
      post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
        ? 'Anônimo'
        : post.user?.name || post.author?.name || 'Usuário desconhecido',
    avatarUrl: post.user?.avatarUrl || post.author?.avatarUrl,
    profileType: post.user?.profileType || post.author?.profileType,
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-start pt-12 sm:pt-16 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-[520px] md:max-w-[620px] mx-3 p-5 sm:p-6 relative mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-3xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10 focus:outline-none"
        >
          <FiX size={18} className="text-gray-500" />
        </button>

        <PostCard
          id={post.id}
          title={post.metadata?.title || ''}
          content={post.content}
          images={
            post.images?.map((img: any) =>
              typeof img === 'string' ? img : img.url
            ) || []
          }
          createdAt={post.createdAt}
          categoryId={post.categoria_idcategoria}
          metadata={post.metadata}
          author={author}
          isLiked={post.liked ?? false}
          sharedBy={post.sharedBy}
          expanded
          isInModal={true}
          onLike={handleLike}
          onShare={onShare}
          onAttend={handleAttendance}
          isAttending={status.userStatus === 'confirmed'}
          isPostOwner={post.isPostOwner ?? false}
          isShareOwner={post.isShareOwner ?? false}
          onEdit={onEdit}
          // ✅ AGORA OS CONTADORES VIRÃO DO HOOK usePostDetails
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          sharesCount={post.sharesCount}
          attendanceCount={post.attendanceCount}
        />
      </div>
    </div>
  );
};

export default PostModal;

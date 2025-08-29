import React from 'react';
import PostCard from './PostCard';

interface PostModalProps {
  post: any; // você pode tipar melhor usando PostListItem
  onClose: () => void;
  onLike: () => void;
  onShare: () => void;
  onDelete: (postId: number, shareId?: number) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  post,
  onClose,
  onLike,
  onShare,
  onDelete,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20 overflow-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[700px] p-6 relative"
        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
        >
          ×
        </button>

        <PostCard
          id={post.id}
          title={post.metadata?.title || ''}
          content={post.content}
          images={post.images.map((img: any) =>
            typeof img === 'string' ? img : img.url
          )}
          createdAt={post.createdAt}
          categoryId={post.categoria_idcategoria || post.categoryId}
          metadata={post.metadata}
          author={{
            id: post.user?.id || post.author?.id,
            name:
              post.user?.name || post.author?.name || 'Usuário desconhecido',
            avatarUrl: post.user?.avatarUrl || post.author?.avatarUrl,
          }}
          isLiked={post.liked ?? post.likedByUser}
          sharedBy={post.sharedBy}
          expanded
          onLike={onLike}
          onShare={onShare}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default PostModal;

import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { usePosts } from '../hooks/usePosts';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';

const Feed: React.FC = () => {
  const { posts, setPosts, fetchPosts, hasMore, loading } = usePosts();
  const { sharePost } = useSharePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);

  const openShareModal = (post: any) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setPostToShare(null);
    setShareModalOpen(false);
  };

  const handleShare = async (message?: string) => {
    if (!postToShare) return;

    try {
      // sempre pegar o postId original
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId // Post compartilhado: pega o id do post original
        : postToShare.id; // Post original: usa próprio ID

      const sharedPostDTO = await sharePost(originalPostId, message);
      setPosts((prev) => [sharedPostDTO, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      closeShareModal();
    }
  };

  const { deletePost } = useDeletePost();

  const handleDelete = async (postId: number, shareId?: number) => {
    console.log('Tentando excluir:', { postId, shareId });
    try {
      await deletePost(postId, shareId);

      setPosts((prev) =>
        prev.filter((p) => {
          if (shareId) {
            // excluir compartilhamento específico
            return p.sharedBy?.shareId !== shareId;
          } else {
            // excluir post original
            return p.id !== postId && !p.sharedBy;
          }
        })
      );

      toast.success('Post excluído com sucesso!');
    } catch (err) {
      toast.error('Erro ao excluir o post!');
      console.error('Erro ao excluir:', err);
      if (err instanceof Error) {
        console.error('Mensagem:', err.message);
      }
    }
  };

  return (
    <Layout variant="feed">
      <div className="space-y-6">
        {posts
          .filter(
            (post, index, self) =>
              index === self.findIndex((p) => p.uniqueKey === post.uniqueKey)
          )
          .map((post) => (
            <PostCard
              key={post.uniqueKey || `post-${post.id}`}
              id={post.id}
              title={post.metadata?.title || ''}
              content={post.content}
              images={post.images}
              createdAt={post.createdAt}
              categoryId={post.categoria_idcategoria}
              metadata={post.metadata}
              author={{
                id: post.user?.id,
                name: post.user?.name || 'Usuário desconhecido',
                avatarUrl: post.user?.avatarUrl,
              }}
              isLiked={post.liked}
              sharedBy={post.sharedBy} // mantém se tiver compartilhamento
              onLike={async () => {
                let postIdToSend: number;
                let shareIdToSend: number | undefined;

                if (post.sharedBy) {
                  postIdToSend = post.sharedBy.postId;
                  shareIdToSend = post.sharedBy.shareId;
                } else {
                  postIdToSend = post.id;
                  shareIdToSend = undefined;
                }

                const liked = await likePost(postIdToSend, shareIdToSend);
                setPosts((prev) =>
                  prev.map((p) =>
                    p.uniqueKey === post.uniqueKey ? { ...p, liked } : p
                  )
                );
              }}
              onShare={() => openShareModal(post)}
              onDelete={handleDelete}
            />
          ))}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={fetchPosts}
              disabled={loading}
              className="text-primary hover:underline"
            >
              {loading ? 'Carregando...' : 'Carregar mais'}
            </button>
          </div>
        )}
      </div>

      {postToShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          postSummary={{
            title: postToShare.metadata?.title || '',
            content: postToShare.content,
            author: postToShare.user?.name || 'Usuário desconhecido',
          }}
          onShare={handleShare}
        />
      )}
    </Layout>
  );
};

export default Feed;

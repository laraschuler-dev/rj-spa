// Feed.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { usePosts } from '../hooks/usePosts';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import PostModal from '../components/PostModal';

const Feed: React.FC = () => {
  const { posts, setPosts, fetchPosts, hasMore, loading } = usePosts();
  const { sharePost } = useSharePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // Agora guardamos o post completo

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
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId
        : postToShare.id;

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
    try {
      await deletePost(postId, shareId);

      setPosts((prev) =>
        prev.filter((p) => {
          if (shareId) return p.sharedBy?.shareId !== shareId;
          return p.id !== postId && !p.sharedBy;
        })
      );

      toast.success('Post excluído com sucesso!');
    } catch (err) {
      toast.error('Erro ao excluir o post!');
      console.error('Erro ao excluir:', err);
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
              sharedBy={post.sharedBy}
              onLike={async () => {
                const postIdToSend = post.sharedBy
                  ? post.sharedBy.postId
                  : post.id;
                const shareIdToSend = post.sharedBy?.shareId;

                const liked = await likePost(postIdToSend, shareIdToSend);
                setPosts((prev) =>
                  prev.map((p) =>
                    p.uniqueKey === post.uniqueKey ? { ...p, liked } : p
                  )
                );
              }}
              onShare={() => openShareModal(post)}
              onDelete={handleDelete}
              onOpenDetails={() => setSelectedPost(post)} // 🔹 Passa o post completo
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

      {/* 🔹 Modal de Detalhes */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            const postIdToSend = selectedPost.sharedBy
              ? selectedPost.sharedBy.postId
              : selectedPost.id;
            const shareIdToSend = selectedPost.sharedBy?.shareId;

            const liked = await likePost(postIdToSend, shareIdToSend);
            // Atualiza o post no feed corretamente
            setPosts((prev) =>
              prev.map((p) =>
                p.id === selectedPost.id ||
                p.sharedBy?.shareId === selectedPost.sharedBy?.shareId
                  ? { ...p, liked }
                  : p
              )
            );

            // Também atualiza o selectedPost para refletir o like no modal
            setSelectedPost((prev: any) => prev && { ...prev, liked });
          }}
          onShare={() => {
            // Abre o mesmo ShareModal do feed
            if (selectedPost) openShareModal(selectedPost);
          }}
          onDelete={handleDelete}
        />
      )}

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

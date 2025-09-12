// Feed.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { usePosts } from '../hooks/usePosts';
import { usePostStore } from '../stores/postStore';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import PostModal from '../components/PostModal';
import EditPostModal from '../components/posts/EditPostModal';
import ShareEditModal from '../components/posts/ShareEditModal';

const Feed: React.FC = () => {
  const { posts, fetchPosts, hasMore, loading } = usePosts();
  const { updatePost, addPost, removePost, toggleLikePost } = usePostStore();
  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [editingPost, setEditingPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  const openShareModal = (post: any) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setPostToShare(null);
    setShareModalOpen(false);
  };

  // ✅ Função para compartilhar diretamente via store
  const handleShare = async (message?: string) => {
    if (!postToShare) return;

    try {
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId
        : postToShare.id;
      const sharedPostDTO = await sharePost(originalPostId, message);
      addPost(sharedPostDTO); // adiciona no topo do feed via store
    } catch (err) {
      console.error(err);
      toast.error('Erro ao compartilhar o post');
    } finally {
      closeShareModal();
    }
  };

  // ✅ Função para deletar diretamente via store
  const handleDelete = async (postId: number, shareId?: number) => {
    try {
      await deletePost(postId, shareId);
      removePost(postId, shareId); // remove do feed via store
      toast.success('Post excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o post!');
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
              images={post.images || []}
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

                // chama a API para curtir/descurtir
                const liked = await likePost(postIdToSend, shareIdToSend);

                // atualiza apenas o liked no store
                toggleLikePost(postIdToSend, shareIdToSend, liked);
              }}
              onShare={() => openShareModal(post)}
              onDelete={handleDelete} // usa store
              onOpenDetails={() => setSelectedPost(post)}
              onEdit={(postId, shareId) =>
                setEditingPost({ id: postId, shareId })
              }
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
            updatePost({ ...selectedPost, liked }); // feed atualizado via store
            setSelectedPost((prev) => prev && { ...prev, liked }); // modal atualizado
          }}
          onShare={() => selectedPost && openShareModal(selectedPost)}
          onDelete={handleDelete} // usa store
        />
      )}

      {editingPost &&
        (editingPost.shareId ? (
          <ShareEditModal
            isOpen={!!editingPost}
            onClose={() => setEditingPost(null)}
            postId={editingPost.id}
            shareId={editingPost.shareId}
            onSave={fetchPosts} // refresh leve
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={fetchPosts} // refresh leve
          />
        ))}

      {postToShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          postSummary={{
            title: postToShare.metadata?.title || '',
            content: postToShare.content,
            author: postToShare.user?.name || 'Usuário desconhecido',
          }}
          onShare={handleShare} // usa store
        />
      )}
    </Layout>
  );
};

export default Feed;

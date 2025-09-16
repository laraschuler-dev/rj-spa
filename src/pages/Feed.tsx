// Feed.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { usePostStore } from '../stores/postStore';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import PostModal from '../components/PostModal';
import EditPostModal from '../components/posts/EditPostModal';
import ShareEditModal from '../components/posts/ShareEditModal';

const Feed: React.FC = () => {
  const {
    posts,
    fetchPosts,
    hasMore,
    loading,
    toggleLikePost,
    addPost,
    removePost,
  } = usePostStore();

  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);
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

  // ✅ Compartilhar
  const handleShare = async (message?: string) => {
    if (!postToShare) return;

    try {
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId
        : postToShare.id;
      const sharedPostDTO = await sharePost(originalPostId, message);
      addPost(sharedPostDTO);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao compartilhar o post');
    } finally {
      closeShareModal();
    }
  };

  // ✅ Deletar
  const handleDelete = async (postId: number, shareId?: number) => {
    try {
      await deletePost(postId, shareId);
      removePost(postId, shareId);
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
          .map((post) => {
            return (
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
                  const postIdToSend = post.sharedBy?.postId || post.id;
                  const shareIdToSend = post.sharedBy?.shareId;

                  try {
                    const { liked } = await likePost(
                      postIdToSend,
                      shareIdToSend
                    );
                    toggleLikePost(postIdToSend, liked, shareIdToSend); // Atualiza store
                  } catch (err) {
                    console.error('Erro ao curtir/descurtir post:', err);
                  }
                }}
                onShare={() => openShareModal(post)}
                onDelete={handleDelete}
                onOpenDetails={() => {
                  console.log('Abrindo modal para post:', {
                    id: post.id, // ← Deve ser o ID original (60)
                    shareId: post.sharedBy?.shareId, // ← Deve ser o shareId (40)
                    postOriginalId: post.sharedBy?.postId, // ← Adicione para verificar
                    postData: post,
                  });
                  setSelectedPost({
                    id: post.id,
                    shareId: post.sharedBy?.shareId,
                  });
                }}
                onEdit={(postId, shareId) =>
                  setEditingPost({ id: postId, shareId })
                }
              />
            );
          })}

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

      {/* 🔑 Modal conectado à store */}
      {selectedPost && (
        <PostModal
          postId={selectedPost.id}
          shareId={selectedPost.shareId}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            if (!selectedPost) return;
            const postIdToSend = selectedPost.id;
            const shareIdToSend = selectedPost.shareId;
            try {
              const { liked } = await likePost(postIdToSend, shareIdToSend);
              toggleLikePost(postIdToSend, liked, shareIdToSend);
            } catch (err) {
              console.error('Erro ao curtir/descurtir post:', err);
            }
          }}
          onShare={() => {
            const post = posts.find((p) => {
              if (selectedPost.shareId) {
                return p.sharedBy?.shareId === selectedPost.shareId;
              } else {
                return p.id === selectedPost.id && !p.sharedBy;
              }
            });
            if (post) openShareModal(post);
          }}
          onDelete={handleDelete}
        />
      )}
      {editingPost &&
        (editingPost.shareId ? (
          <ShareEditModal
            isOpen={!!editingPost}
            onClose={() => setEditingPost(null)}
            postId={editingPost.id}
            shareId={editingPost.shareId}
            onSave={fetchPosts}
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={fetchPosts}
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
          onShare={handleShare}
        />
      )}
    </Layout>
  );
};

export default Feed;

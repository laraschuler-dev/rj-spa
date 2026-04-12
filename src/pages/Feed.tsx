// Feed.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/posts/PostCard';
import ShareModal from '../components/posts/ShareModal';
import { usePostStore } from '../stores/postStore';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import PostModal from '../components/posts/PostModal';
import EditPostModal from '../components/posts/EditPostModal';
import ShareEditModal from '../components/posts/ShareEditModal';
import { usePosts } from '../hooks/usePosts';

const Feed: React.FC = () => {
  const {
    posts,
    hasMore,
    loading,
    toggleLikePost,
    addPost,
    removePost,
    updatePost,
  } = usePostStore();
  const { refreshPosts, loadMorePosts } = usePosts();

  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);
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

  const handleShare = async (message?: string) => {
    if (!postToShare) return;

    try {
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId
        : postToShare.id;

      // ✅ DETERMINA se é compartilhamento de compartilhamento
      const shareIdToSend = postToShare.sharedBy?.shareId;

      const sharedPostDTO = await sharePost(
        originalPostId,
        message,
        shareIdToSend
      );
      addPost(sharedPostDTO);
    } catch (err) {
      console.error(err);
    } finally {
      closeShareModal();
    }
  };

  // Deletar
  const handleDelete = async (postId: number, shareId?: number) => {
    try {
      // Passa shareId só se for um compartilhamento
      if (shareId) {
        await deletePost(postId, shareId);
      } else {
        await deletePost(postId);
      }

      removePost(postId, shareId); // atualiza a store corretamente
      toast.success('Post excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o post!');
    }
  };

  useEffect(() => {
    if (shareModalOpen && selectedPost) setSelectedPost(null);
    if (selectedPost && shareModalOpen) setShareModalOpen(false);
  }, [shareModalOpen, selectedPost]);

  return (
    <Layout variant="feed">
      <div className="mb-12"></div>
      <div className="space-y-6">
        {(!posts || posts.length === 0) && !loading ? (
          <div className="text-center py-12 text-gray-500">
            Nenhum post disponível no momento. Volte mais tarde ou seja o
            primeiro a compartilhar!
          </div>
        ) : (
          (posts || []).map((post) => (
            <PostCard
              key={post.uniqueKey || `post-${post.id}`}
              id={post.id}
              title={post.metadata?.title || ''}
              content={post.content}
              images={post.images || []}
              createdAt={post.createdAt}
              categoryId={post.categoria_idcategoria}
              metadata={post.metadata}
              author={
                post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
                  ? { id: 0, name: 'Anônimo', avatarUrl: undefined }
                  : {
                      id: post.user?.id,
                      name: post.user?.name || 'Usuário desconhecido',
                      avatarUrl: post.user?.avatarUrl,
                    }
              }
              isLiked={post.liked}
              sharedBy={post.sharedBy}
              onLike={async () => {
                const postIdToSend = post.sharedBy?.postId || post.id;
                const shareIdToSend = post.sharedBy?.shareId;

                const currentLiked = post.liked ?? false;
                toggleLikePost(postIdToSend, !currentLiked, shareIdToSend);

                try {
                  const { liked } = await likePost(postIdToSend, shareIdToSend);
                  if (liked !== !currentLiked) {
                    toggleLikePost(postIdToSend, liked, shareIdToSend);
                  }
                } catch (err) {
                  toggleLikePost(postIdToSend, currentLiked, shareIdToSend);
                  console.error('Erro ao curtir/descurtir post:', err);
                  toast.error('Erro ao curtir o post');
                }
              }}
              onShare={() => openShareModal(post)}
              onDelete={handleDelete}
              onOpenDetails={() =>
                setSelectedPost({
                  id: post.id,
                  shareId: post.sharedBy?.shareId,
                })
              }
              onEdit={(postId, shareId) =>
                setEditingPost({ id: postId, shareId })
              }
              isPostOwner={post.isPostOwner}
              isShareOwner={post.isShareOwner}
            />
          ))
        )}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={loadMorePosts}
              disabled={loading}
              className="text-primary hover:underline focus:outline-none"
            >
              {loading ? 'Carregando...' : 'Carregar mais'}
            </button>
          </div>
        )}
      </div>

      {/* Modais conectados à store */}
      {selectedPost && (
        <PostModal
          postId={selectedPost.id}
          shareId={selectedPost.shareId}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            if (!selectedPost) return;
            const postIdToSend = selectedPost.id;
            const shareIdToSend = selectedPost.shareId;

            const post = posts.find((p) =>
              selectedPost.shareId
                ? p.sharedBy?.shareId === selectedPost.shareId
                : p.id === selectedPost.id && !p.sharedBy
            );

            if (!post) return;

            const currentLiked = post.liked ?? false; // ← Use false como padrão se for undefined
            toggleLikePost(postIdToSend, !currentLiked, shareIdToSend);

            try {
              const { liked } = await likePost(postIdToSend, shareIdToSend);

              if (liked !== !currentLiked) {
                toggleLikePost(postIdToSend, liked, shareIdToSend);
              }
            } catch (err) {
              toggleLikePost(postIdToSend, currentLiked, shareIdToSend);
              console.error('Erro ao curtir/descurtir post:', err);
            }
          }}
          onShare={() => {
            const post = posts.find((p) =>
              selectedPost.shareId
                ? p.sharedBy?.shareId === selectedPost.shareId
                : p.id === selectedPost.id && !p.sharedBy
            );

            if (post) {
              // Fecha o modal de detalhes
              setSelectedPost(null);

              // Abre o modal de compartilhamento
              setTimeout(() => openShareModal(post), 300);
            }
          }}
          onDelete={handleDelete}
          onEdit={(postId, shareId) => setEditingPost({ id: postId, shareId })}
        />
      )}

      {editingPost &&
        (editingPost.shareId ? (
          <ShareEditModal
            isOpen={!!editingPost}
            onClose={() => setEditingPost(null)}
            postId={editingPost.id}
            shareId={editingPost.shareId}
            onSave={(updatedPost) => {
              updatePost(updatedPost); // store como fonte da verdade
              setEditingPost(null);
            }}
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={(updatedPost) => {
              updatePost(updatedPost); // store atualizada
              setEditingPost(null);
            }}
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

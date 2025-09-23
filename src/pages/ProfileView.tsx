// src/views/ProfileView.tsx
import React, { useEffect, useState } from 'react';
import Typography from '../components/ui/Typography';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';
import { useProfile } from '../hooks/useProfile';
import { useProfilePosts } from '../hooks/useProfilePosts'; // ✅ NOVO HOOK
import PostCard from '../components/PostCard';
import PostModal from '../components/PostModal';
import ShareModal from '../components/ShareModal';
import EditPostModal from '../components/posts/EditPostModal';
import ShareEditModal from '../components/posts/ShareEditModal';
import { usePostStore } from '../stores/postStore';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import axios from '../services/api';

const ProfileView: React.FC = () => {
  const { user, profile, loading } = useProfile();
  const apiBaseUrl = axios.defaults.baseURL || '';

  const {
    posts: userPosts,
    loadMorePosts,
    refreshPosts,
    hasMore,
    loading: postsLoading,
  } = useProfilePosts(user?.id);

  // ✅ CORREÇÃO: useEffect com controle de execução
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (user?.id && !initialLoadDone) {
      refreshPosts();
      setInitialLoadDone(true);
    }
  }, [user?.id, initialLoadDone, refreshPosts]);

  // ✅ AÇÕES VÊM DIRETO DA STORE (IGUAL AO FEED)
  const { toggleLikePost, addPost, removePost, updatePost } = usePostStore();

  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [selectedPost, setSelectedPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  // ✅ Estado para modais (IGUAL AO FEED)
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  // ✅ Funções de compartilhamento (IGUAL AO FEED)
  const openShareModal = (post: any) => {
    setPostToShare(post);
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setPostToShare(null);
    setShareModalOpen(false);
  };

  // ✅ COMPARTILHAR (IGUAL AO FEED)
  const handleShare = async (message?: string) => {
    if (!postToShare) return;

    try {
      const originalPostId = postToShare.sharedBy
        ? postToShare.sharedBy.postId
        : postToShare.id;
      const sharedPostDTO = await sharePost(originalPostId, message);
      addPost(sharedPostDTO); // ✅ store como única fonte da verdade
    } catch (err) {
      console.error(err);
      toast.error('Erro ao compartilhar o post');
    } finally {
      closeShareModal();
    }
  };

  // ✅ DELETAR (IGUAL AO FEED)
  const handleDelete = async (postId: number, shareId?: number) => {
    try {
      // Passa shareId só se for um compartilhamento
      if (shareId) {
        await deletePost(postId, shareId);
      } else {
        await deletePost(postId);
      }

      removePost(postId, shareId); // ✅ atualiza a store corretamente
      toast.success('Post excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o post!');
    }
  };

  // ✅ CURTIR (DIRETO NA STORE - SEM FUNÇÃO HANDLER REDUNDANTE)
  // O PostCard chama toggleLikePost diretamente, igual no Feed

  if (loading) {
    return <div className="text-primary text-center">Carregando perfil...</div>;
  }

  if (!profile || !user) {
    return (
      <div className="text-center mt-12">
        <p>Perfil não encontrado.</p>
        <Link to="/profile/edit" className="text-primary hover:underline">
          Criar Perfil
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <BackButton to="/feed" className="fixed top-6 left-6 z-50" />

      {/* Card de perfil */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg text-center mx-auto">
        {profile.profile_photo ? (
          <img
            src={`${apiBaseUrl}${profile.profile_photo}`}
            alt="Foto de perfil"
            className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border"
          />
        ) : (
          <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <CgProfile size={48} className="text-gray-500" />
          </div>
        )}

        <Typography
          variant="h2"
          className="text-xl font-bold text-primary mb-1"
        >
          {user.name}
        </Typography>

        <p className="text-sm text-gray-600 mb-2">
          {profile.translated_type || 'Tipo de perfil não informado'}
        </p>

        {profile.bio && (
          <p className="text-gray-700 text-sm mb-4 italic">"{profile.bio}"</p>
        )}

        {(profile.city || profile.state) && (
          <p className="flex justify-center items-center gap-2 text-gray-500 text-sm mb-2">
            <FaMapMarkerAlt />
            {profile.city}
            {profile.city && profile.state ? ' - ' : ''}
            {profile.state}
          </p>
        )}

        <div className="text-sm text-gray-600 mb-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.fone && (
            <p>
              <strong>Telefone:</strong> {user.fone}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            to="/profile/edit"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <FiEdit2 size={16} />
            Editar
          </Link>
        </div>
      </div>

      {/* Lista de posts do usuário - AGORA USA userPosts do useProfilePosts */}
      {user.id && (
        <div className="mt-8 max-w-md mx-auto space-y-4">
          {postsLoading && (
            <p className="text-center text-gray-500">Carregando posts...</p>
          )}

          {(userPosts || []).map((post) => {
            // ← Proteção adicional
            if (!post) return null;
            const postIdToSend = post.sharedBy?.postId || post.id;
            const shareIdToSend = post.sharedBy?.shareId;

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
                author={
                  post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
                    ? { id: 0, name: 'Anônimo' }
                    : {
                        id: post.user?.id,
                        name: post.user?.name || 'Usuário desconhecido',
                        avatarUrl: post.user?.avatarUrl,
                        profileType: post.user?.profileType,
                      }
                }
                isLiked={post.liked}
                sharedBy={post.sharedBy}
                // ✅ CURTIR DIRETO NA STORE (IGUAL AO FEED)
                onLike={async () => {
                  const postIdToSend = post.sharedBy?.postId || post.id;
                  const shareIdToSend = post.sharedBy?.shareId;
                  try {
                    const { liked } = await likePost(
                      postIdToSend,
                      shareIdToSend
                    );
                    toggleLikePost(postIdToSend, liked, shareIdToSend);
                  } catch (err) {
                    console.error('Erro ao curtir/descurtir post:', err);
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
                isPostOwner={user.id === post.user?.id}
                isShareOwner={user.id === post.sharedBy?.id}
              />
            );
          })}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMorePosts}
                disabled={postsLoading}
                className="text-primary hover:underline"
              >
                {postsLoading ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modais (MESMO CÓDIGO DO FEED) */}
      {selectedPost && (
        <PostModal
          postId={selectedPost.id}
          shareId={selectedPost.shareId}
          onClose={() => setSelectedPost(null)}
          // ✅ CURTIR DIRETO NA STORE (IGUAL AO FEED)
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
            const post = userPosts.find((p) =>
              selectedPost.shareId
                ? p.sharedBy?.shareId === selectedPost.shareId
                : p.id === selectedPost.id && !p.sharedBy
            );
            if (post) openShareModal(post);
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

      {editingPost &&
        (editingPost.shareId ? (
          <ShareEditModal
            isOpen={!!editingPost}
            onClose={() => setEditingPost(null)}
            postId={editingPost.id}
            shareId={editingPost.shareId}
            onSave={(updatedPost) => {
              updatePost(updatedPost); // ✅ store como fonte da verdade
              setEditingPost(null);
            }}
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={(updatedPost) => {
              updatePost(updatedPost); // ✅ store atualizada
              setEditingPost(null);
            }}
          />
        ))}
    </main>
  );
};

export default ProfileView;

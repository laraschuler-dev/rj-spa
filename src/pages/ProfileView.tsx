// src/views/ProfileView.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Typography from '../components/ui/Typography';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';
import { useProfile } from '../hooks/useProfile';
import { useUserProfile } from '../hooks/useUserProfile';
import { useProfilePosts } from '../hooks/useProfilePosts';
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
import { useAuth } from '../hooks/useAuth';
import { resolveImageUrl } from '../utils/resolveImageUrl';
import AvatarInitials from '../components/ui/AvatarInitials';
import { useFollow, UserFollowerInfo } from '../hooks/useFollow';
import FollowButton from '../components/follow/FollowButton';
import { useProfileStore } from '../stores/profileStore';
import FollowListModal from '../components/follow/FollowListModal';
import FollowStats from '../components/follow/FollowStats';

// 👇 Type Guard para verificar se é PrivateUserData (tem email)
const hasEmail = (user: any): user is { email: string; fone?: string } => {
  return user && 'email' in user;
};

const ProfileView: React.FC = () => {
  const { userId: urlUserId } = useParams<{ userId?: string }>();
  const { user: currentUser } = useAuth();

  const targetUserId = urlUserId ? parseInt(urlUserId) : currentUser?.id;
  const isOwnProfile = !urlUserId || currentUser?.id === targetUserId;

  // Hook para perfil próprio ou de outros usuários
  const profileData = isOwnProfile
    ? useProfile()
    : useUserProfile(targetUserId);

  const { user, profile, loading } = profileData;

  const {
    posts: userPosts,
    loadMorePosts,
    refreshPosts,
    hasMore,
    loading: postsLoading,
  } = useProfilePosts(targetUserId);

  useEffect(() => {
    if (targetUserId) {
      refreshPosts();
    }
  }, [targetUserId, refreshPosts]);

  const { toggleLikePost, addPost, removePost, updatePost } = usePostStore();
  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [selectedPost, setSelectedPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState<UserFollowerInfo[]>([]);
  const [following, setFollowing] = useState<UserFollowerInfo[]>([]);

  const { getFollowers, getFollowing } = useFollow();

  // Funções para carregar as listas
  const loadFollowers = async () => {
    const data = await getFollowers(targetUserId!);
    setFollowers(data);
    setShowFollowersModal(true);
  };

  const loadFollowing = async () => {
    const data = await getFollowing(targetUserId!);
    setFollowing(data);
    setShowFollowingModal(true);
  };

  // Função para atualizar o estado de follow de um usuário na lista
  const updateUserFollowStatus = (userId: number, isFollowing: boolean) => {
    setFollowers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isFollowing } : user))
    );
    setFollowing((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isFollowing } : user))
    );
  };

  useEffect(() => {
    if (shareModalOpen && selectedPost) setSelectedPost(null);
    if (selectedPost && shareModalOpen) setShareModalOpen(false);
  }, [shareModalOpen, selectedPost]);

  // No ProfileView.tsx, adicione este useEffect:
  const { refreshFollowStats } = useFollow();

  useEffect(() => {
    if (targetUserId && profile?.followStats) {
      // A store já está sendo atualizada automaticamente
    }
  }, [targetUserId, profile?.followStats]);

  // No ProfileView.tsx, adicione um useEffect para debug:
  useEffect(() => {
    console.log('🔍 ProfileView - Estado atual:', {
      targetUserId,
      isOwnProfile,
      user: user?.id,
      profile: profile?.followStats,
      storeUser: useProfileStore.getState().user?.id,
      storeProfile: useProfileStore.getState().profile?.followStats,
    });
  }, [targetUserId, isOwnProfile, user, profile]);

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
      addPost(sharedPostDTO);
    } catch (err) {
      console.error(err);
    } finally {
      closeShareModal();
    }
  };

  const handleDelete = async (postId: number, shareId?: number) => {
    try {
      if (shareId) {
        await deletePost(postId, shareId);
      } else {
        await deletePost(postId);
      }

      removePost(postId, shareId);
      toast.success('Post excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o post!');
    }
  };

  const handleEdit = isOwnProfile
    ? (postId: number, shareId?: number) =>
        setEditingPost({ id: postId, shareId })
    : undefined;

  if (loading) {
    return (
      <div className="text-primary text-center mt-12">Carregando perfil...</div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">Perfil não encontrado.</p>
        {isOwnProfile && (
          <Link to="/profile/edit" className="text-primary hover:underline">
            Criar Perfil
          </Link>
        )}
      </div>
    );
  }

  const getPostAuthor = (post: any) => {
    // 1. Se é post indisponível, respeita o que veio da API
    if (post.metadata?.isUnavailable) {
      return {
        id: post.user?.id || 0,
        name: post.user?.name || 'Usuário desconhecido',
        avatarUrl: post.user?.avatarUrl,
        profileType: post.user?.profileType,
      };
    }

    // 2. Se é post anônimo
    if (post.categoria_idcategoria === 2 && post.metadata?.isAnonymous) {
      return {
        id: 0,
        name: 'Usuário Anônimo',
        avatarUrl: undefined,
      };
    }

    // 3. Post normal
    return {
      id: post.user?.id,
      name: post.user?.name || 'Usuário desconhecido',
      avatarUrl: post.user?.avatarUrl,
      profileType: post.user?.profileType,
    };
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <BackButton to="/feed" className="fixed top-6 left-6 z-50" />

      {/* Card de perfil */}
      <div className="w-full max-w-[600px] bg-white p-8 rounded-2xl shadow-lg text-center mx-auto">
        {/* Avatar e Informações Básicas */}
        <div className="mb-6">
          {profile.profile_photo ? (
            <img
              src={resolveImageUrl(profile.profile_photo)}
              alt="Foto de perfil"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4 border"
            />
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full bg-accent flex items-center justify-center mb-4 border border-white">
              <AvatarInitials
                name={user?.name}
                className="w-20 h-20 text-4xl"
              />
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
            <p className="flex justify-center items-center gap-2 text-gray-500 text-sm">
              <FaMapMarkerAlt />
              {profile.city}
              {profile.city && profile.state ? ' - ' : ''}
              {profile.state}
            </p>
          )}
        </div>

        {/* Seção de Follow - Agora com melhor espaçamento */}
        <div className="border-t border-gray-100 pt-6">
          {/* Estatísticas de Follow */}
          <div className="mb-4">
            <FollowStats
              followersCount={profile.followStats?.followersCount || 0}
              followingCount={profile.followStats?.followingCount || 0}
              onFollowersClick={loadFollowers}
              onFollowingClick={loadFollowing}
            />
          </div>

          {/* Botão de Seguir (apenas se não for o próprio perfil) */}
          {!isOwnProfile && (
            <div className="mb-4">
              <FollowButton
                targetUserId={targetUserId!}
                isFollowing={profile.followStats?.isFollowing}
                onFollowChange={(isFollowing) => {
                  console.log('Status de follow alterado:', isFollowing);
                }}
                enableOptimisticUpdate={true} // 👈 MANTÉM ATUALIZAÇÃO OTIMISTA AQUI (valor padrão)
              />
            </div>
          )}

          {/* Informações de Contato e Ações */}
          <div className="space-y-3">
            {/* Informações de contato (apenas no próprio perfil) */}
            {isOwnProfile && hasEmail(user) && (
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {user.fone && (
                  <p>
                    <strong>Telefone:</strong> {user.fone}
                  </p>
                )}
              </div>
            )}

            {/* Botão Editar (apenas no próprio perfil) */}
            {isOwnProfile && (
              <div className="flex justify-center">
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  <FiEdit2 size={16} />
                  Editar Perfil
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 👇 MOSTRA "CRIAR POST" APENAS NO PRÓPRIO PERFIL */}
      {isOwnProfile && (
        <div className="mt-8 max-w-[600px] mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <Typography
              variant="h3"
              className="text-lg font-semibold text-gray-800 mb-2"
            >
              Compartilhe algo novo
            </Typography>
            <Typography variant="p" className="text-gray-600 text-sm mb-4">
              Conte novidades, ofereça ajuda ou inicie uma discussão
            </Typography>
            <Link
              to="/posts/create/9"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-2.5 px-6 rounded-xl transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Criar Post
            </Link>
          </div>
        </div>
      )}

      {/* Lista de posts do usuário */}
      {targetUserId && (
        <div className="mt-8 max-w-[600px] mx-auto space-y-6 w-full">
          <Typography
            variant="h3"
            className="text-lg font-semibold text-gray-800 mb-4"
          >
            {isOwnProfile ? 'Meus Posts' : `Posts de ${user.name}`}
          </Typography>

          {(!userPosts || userPosts.length === 0) && !postsLoading ? (
            <div className="text-center py-12 text-gray-500">
              {isOwnProfile
                ? 'Você ainda não criou nenhum post. Compartilhe algo novo!'
                : `${user.name} ainda não publicou posts.`}
            </div>
          ) : (
            (userPosts || []).map((post) => {
              if (!post) return null;

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
                  author={getPostAuthor(post)}
                  isLiked={post.liked}
                  sharedBy={post.sharedBy}
                  onLike={async () => {
                    const postIdToSend = post.sharedBy?.postId || post.id;
                    const shareIdToSend = post.sharedBy?.shareId;
                    const currentLiked = post.liked ?? false;
                    toggleLikePost(postIdToSend, !currentLiked, shareIdToSend);

                    try {
                      const { liked } = await likePost(
                        postIdToSend,
                        shareIdToSend
                      );
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
                  onDelete={isOwnProfile ? handleDelete : undefined}
                  onOpenDetails={() =>
                    setSelectedPost({
                      id: post.id,
                      shareId: post.sharedBy?.shareId,
                    })
                  }
                  onEdit={handleEdit}
                  isPostOwner={post.isPostOwner ?? false}
                  isShareOwner={post.isShareOwner ?? false}
                />
              );
            })
          )}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={loadMorePosts}
                disabled={postsLoading}
                className="text-primary hover:underline focus:outline-none"
              >
                {postsLoading ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      {selectedPost && (
        <PostModal
          postId={selectedPost.id}
          shareId={selectedPost.shareId}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            if (!selectedPost) return;
            const postIdToSend = selectedPost.id;
            const shareIdToSend = selectedPost.shareId;

            const post = userPosts.find((p) =>
              selectedPost.shareId
                ? p.sharedBy?.shareId === selectedPost.shareId
                : p.id === selectedPost.id && !p.sharedBy
            );

            if (!post) return;

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
            }
          }}
          onShare={() => {
            const post = userPosts.find((p) =>
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
          onDelete={isOwnProfile ? handleDelete : undefined}
          onEdit={
            isOwnProfile
              ? (postId, shareId) => setEditingPost({ id: postId, shareId })
              : undefined
          }
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
              updatePost(updatedPost);
              setEditingPost(null);
            }}
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={(updatedPost) => {
              updatePost(updatedPost);
              setEditingPost(null);
            }}
          />
        ))}

      <FollowListModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        users={followers}
        title="Seguidores"
        onUserClick={(userId) => {
          setShowFollowersModal(false);
          // Navega para o perfil do usuário
          // navigate(`/profile/${userId}`);
        }}
        onFollowChange={updateUserFollowStatus} // 👈 ADICIONAR ESTA PROP
      />

      <FollowListModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        users={following}
        title="Seguindo"
        onUserClick={(userId) => {
          setShowFollowingModal(false);
          // Navega para o perfil do usuário
          // navigate(`/profile/${userId}`);
        }}
        onFollowChange={updateUserFollowStatus} // 👈 ADICIONAR ESTA PROP
      />
    </main>
  );
};

export default ProfileView;

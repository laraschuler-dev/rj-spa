import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PostCard from '../components/posts/PostCard';
import ShareModal from '../components/posts/ShareModal';
import EditPostModal from '../components/posts/EditPostModal';
import ShareEditModal from '../components/posts/ShareEditModal';
import { usePostDetails } from '../hooks/usePostDetails';
import { usePostStore } from '../stores/postStore';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import { FiRefreshCw } from 'react-icons/fi';
import BackButton from '../components/ui/BackButton';

const PostDetailsPage: React.FC = () => {
  const { id, shareId } = useParams<{ id: string; shareId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const postId = id ? parseInt(id) : 0;
  const parsedShareId = shareId ? parseInt(shareId) : undefined;

  // ✅ DEBUG: log para verificar parâmetros
  useEffect(() => {
    console.log('🎯 PostDetailsPage Params:', { postId, parsedShareId });
  }, [postId, parsedShareId]);

  const { post, loading, error, refetch } = usePostDetails(
    postId,
    parsedShareId
  );
  const { updatePost, removePost, toggleLikePost, addPost } = usePostStore();

  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [editingPost, setEditingPost] = useState<{
    id: number;
    shareId?: number;
  } | null>(null);

  // ✅ ESTADO PARA CONTROLAR COMENTÁRIOS ABERTOS
  const [openCommentId, setOpenCommentId] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);

  // ✅ NOVO ESTADO PARA DELETE
  const [isDeleting, setIsDeleting] = useState(false);
  const [postWasDeleted, setPostWasDeleted] = useState(false); // ✅ NOVO ESTADO

  // ✅ DEBUG: log do post quando carrega
  useEffect(() => {
    if (post) {
      console.log('✅ Post carregado:', {
        id: post.id,
        hasCounters: {
          likes: post.likesCount,
          comments: post.commentsCount,
          shares: post.sharesCount,
          attendance: post.attendanceCount,
        },
        content: post.content?.substring(0, 50) + '...',
      });
    }
  }, [post]);

  // ✅ EFFECT PARA LER O ESTADO DA NAVEGAÇÃO
  useEffect(() => {
    if (location.state) {
      const { openCommentId: navOpenCommentId, scrollToComment } =
        location.state;

      if (scrollToComment && navOpenCommentId) {
        setOpenCommentId(navOpenCommentId);
        setShowComments(true);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

  // ✅ EFFECT PARA SCROLLAR ATÉ O COMENTÁRIO QUANDO POST CARREGAR
  useEffect(() => {
    if (post && openCommentId && showComments) {
      const timer = setTimeout(() => {
        scrollToComment(openCommentId);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [post, openCommentId, showComments]);

  // ✅ FUNÇÃO PARA SCROLLAR ATÉ O COMENTÁRIO
  const scrollToComment = (commentId: number) => {
    const commentElement = document.getElementById(`comment-${commentId}`);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      commentElement.classList.add(
        'bg-yellow-50',
        'border-l-4',
        'border-yellow-400'
      );
      setTimeout(() => {
        commentElement.classList.remove(
          'bg-yellow-50',
          'border-l-4',
          'border-yellow-400'
        );
      }, 3000);
    } else {
      console.warn(`Comentário com ID ${commentId} não encontrado`);
    }
  };

  // ✅ FUNÇÃO PARA MANIPULAR ABERTURA DE COMENTÁRIOS
  const handleCommentAction = () => {
    setShowComments((prev) => !prev);
  };

  // Redireciona se não há ID válido
  useEffect(() => {
    if (!postId) {
      navigate('/feed');
    }
  }, [postId, navigate]);

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

  // ✅ NOVA FUNÇÃO DE DELETE SEM POPUP E SEM MENSAGEM DE ERRO
  const handleDelete = async (postId: number, shareId?: number) => {
    if (isDeleting) return; // Previne múltiplos cliques

    setIsDeleting(true);
    setPostWasDeleted(true); // ✅ MARCA QUE O POST FOI EXCLUÍDO

    try {
      if (shareId) {
        await deletePost(postId, shareId);
      } else {
        await deletePost(postId);
      }
      removePost(postId, shareId);

      // ✅ Feedback visual suave
      toast.success('Post excluído com sucesso!', {
        position: 'top-center',
        autoClose: 2000,
      });

      // ✅ Redireciona imediatamente sem esperar
      navigate('/feed');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o post!');
      setIsDeleting(false);
      setPostWasDeleted(false); // ✅ RESETA SE HOUVER ERRO
    }
  };

  const handleLike = async () => {
    if (!post) return;
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
  };

  // ✅ LOADING MELHORADO com mensagem
  if (loading && !postWasDeleted) {
    // ✅ SÓ MOSTRA LOADING SE NÃO FOI EXCLUÍDO
    return (
      <div className="max-w-[600px] mx-auto p-4">
        <BackButton className="fixed top-6 left-6 z-50" />
        <div className="flex justify-center items-center py-12 flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <span className="text-gray-600">Carregando post...</span>
        </div>
      </div>
    );
  }

  // ✅ ERROR MELHORADO - NÃO MOSTRA ERRO SE O POST FOI EXCLUÍDO
  if ((error || !post) && !postWasDeleted) {
    return (
      <div className="max-w-[600px] mx-auto p-4">
        <BackButton className="fixed top-6 left-6 z-50" />
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            {error || 'Post não encontrado'}
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiRefreshCw size={16} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // ✅ SE O POST FOI EXCLUÍDO, MOSTRA APENAS O LOADING ATÉ REDIRECIONAR
  if (postWasDeleted) {
    return (
      <div className="max-w-[600px] mx-auto p-4">
        <BackButton className="fixed top-6 left-6 z-50" />
        <div className="flex justify-center items-center py-12 flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <span className="text-gray-600">Redirecionando...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return null; // ou uma mensagem de fallback
  }

  return (
    <div className="max-w-[600px] mx-auto p-4">
      <div className="mb-6"></div>
      <BackButton className="fixed top-6 left-6 z-50" />

      {/* Post em modo expandido */}
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
          id:
            post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
              ? 0
              : post.user?.id || post.author?.id || 0,
          name:
            post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
              ? 'Anônimo'
              : post.user?.name || post.author?.name || 'Usuário desconhecido',
          avatarUrl: post.user?.avatarUrl || post.author?.avatarUrl,
        }}
        isLiked={post.liked}
        sharedBy={post.sharedBy}
        expanded={true}
        likesCount={post.likesCount}
        commentsCount={post.commentsCount}
        sharesCount={post.sharesCount}
        attendanceCount={post.attendanceCount}
        onLike={handleLike}
        onShare={() => openShareModal(post)}
        onDelete={handleDelete}
        onEdit={(postId, shareId) => setEditingPost({ id: postId, shareId })}
        isPostOwner={post.isPostOwner}
        isShareOwner={post.isShareOwner}
        showComments={showComments}
        onComment={handleCommentAction}
        highlightedCommentId={openCommentId}
        isDeleting={isDeleting}
      />

      {/* Modais */}
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
              toast.success('Post atualizado com sucesso!');
            }}
          />
        ) : (
          <EditPostModal
            postId={editingPost.id}
            onClose={() => setEditingPost(null)}
            onSuccess={(updatedPost) => {
              updatePost(updatedPost);
              setEditingPost(null);
              toast.success('Post atualizado com sucesso!');
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
            author:
              postToShare.user?.name ||
              postToShare.author?.name ||
              'Usuário desconhecido',
          }}
          onShare={handleShare}
        />
      )}
    </div>
  );
};

export default PostDetailsPage;

// pages/PostDetailsPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { usePostStore } from '../stores/postStore';
import { useEventAttendance } from '../hooks/useEventAttendance';
import { usePostDetails } from '../hooks/usePostDetails';
import { FiArrowLeft } from 'react-icons/fi';

const PostDetailsPage: React.FC = () => {
  const { postId, shareId } = useParams<{ postId: string; shareId?: string }>();
  const navigate = useNavigate();

  const numericPostId = postId ? parseInt(postId) : 0;
  const numericShareId = shareId ? parseInt(shareId) : undefined;

  const { post, loading } = usePostDetails(numericPostId, numericShareId);
  const { toggleLikePost } = usePostStore();

  const { status, toggleAttendance: toggleAttendanceHook } = useEventAttendance(
    numericPostId,
    numericShareId
  );

  // Redirecionar se não tiver postId
  useEffect(() => {
    if (!numericPostId) {
      navigate('/feed');
    }
  }, [numericPostId, navigate]);

  const handleLike = async () => {
    try {
      if (!post) return;

      const currentLiked = post.liked ?? false;
      toggleLikePost(numericPostId, !currentLiked, numericShareId);
    } catch (err) {
      console.error('Erro ao curtir/descurtir post:', err);
    }
  };

  const handleShare = () => {
    // Implementar lógica de compartilhamento
    console.log('Compartilhar post:', numericPostId, numericShareId);
  };

  const handleEdit = () => {
    // Implementar navegação para edição
    console.log('Editar post:', numericPostId, numericShareId);
  };

  const handleDelete = async () => {
    // Implementar lógica de exclusão
    console.log('Excluir post:', numericPostId, numericShareId);
  };

  const handleAttendance = async () => {
    try {
      await toggleAttendanceHook();
    } catch (err) {
      console.error('Erro ao alternar presença:', err);
    }
  };

  const handleBack = () => {
    navigate(-1); // Voltar para página anterior
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Post não encontrado</p>
          <button
            onClick={handleBack}
            className="text-blue-500 hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const author =
    post.categoria_idcategoria === 2 && post.metadata?.isAnonymous
      ? {
          id: 0,
          name: 'Anônimo',
          avatarUrl: undefined,
        }
      : {
          id: post.user?.id || post.author?.id,
          name: post.user?.name || post.author?.name || 'Usuário desconhecido',
          avatarUrl: post.user?.avatarUrl || post.author?.avatarUrl,
        };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Detalhes do Post
            </h1>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6">
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
          expanded={true}
          isInModal={false} // Importante: false para página
          onLike={handleLike}
          onShare={handleShare}
          onAttend={handleAttendance}
          isAttending={status.userStatus === 'confirmed'}
          isPostOwner={post.isPostOwner ?? false}
          isShareOwner={post.isShareOwner ?? false}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PostDetailsPage;

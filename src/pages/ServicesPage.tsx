// pages/ServicesPage.tsx
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { useSharePost } from '../hooks/useSharePost';
import { likePost } from '../hooks/useLikePost';
import { useDeletePost } from '../hooks/useDeletePost';
import { toast } from 'react-toastify';
import PostModal from '../components/PostModal';
import EditPostModal from '../components/posts/EditPostModal';
import { useServices } from '../hooks/useServices';
import Typography from '../components/ui/Typography';

const ServicesPage: React.FC = () => {
  const {
    services,
    hasMore,
    loading,
    loadMoreServices,
    updateService,
    removeService,
    toggleLikeService,
  } = useServices();

  const { sharePost } = useSharePost();
  const { deletePost } = useDeletePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<number | null>(null);

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
      await sharePost(postToShare.id, message);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao compartilhar o serviço');
    } finally {
      const reopenedId = postToShare.id;
      closeShareModal();

      // Reabre o modal de detalhes, se quiser
      setSelectedPost(reopenedId);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
      removeService(postId);
      toast.success('Serviço excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o serviço!');
    }
  };

  // Função para determinar o tipo de serviço baseado na categoria
  const getServiceType = (categoryId: number) => {
    switch (categoryId) {
      case 5:
        return 'Voluntariado';
      case 6:
        return 'Curso';
      case 7:
        return 'Oportunidade de Emprego';
      default:
        return 'Serviço';
    }
  };

  React.useEffect(() => {
    if (shareModalOpen && selectedPost) setSelectedPost(null);
    if (selectedPost && shareModalOpen) setShareModalOpen(false);
  }, [shareModalOpen, selectedPost]);

  return (
    <Layout variant="feed">
      <div className="mt-4 mb-6">
        <Typography variant="h1" className="text-primary text-center mb-6">
          Serviços
        </Typography>
        <Typography variant="p" className="text-gray-700 mt-4 text-center">
          Encontre oportunidades de voluntariado, cursos e empregos na sua
          comunidade
        </Typography>

        {/* Badges dos tipos de serviços */}
        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            🎯 Voluntariado
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
            📚 Cursos
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
            💼 Empregos
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {services.map((service) => (
          <PostCard
            key={service.uniqueKey || `post-${service.id}`}
            id={service.id}
            title={service.metadata?.title || ''}
            content={service.content}
            images={service.images || []}
            createdAt={service.createdAt}
            categoryId={service.categoria_idcategoria}
            metadata={{
              ...service.metadata,
              serviceType: getServiceType(service.categoria_idcategoria),
            }}
            author={{
              id: service.user?.id || 0,
              name: service.user?.name || 'Organizador',
              avatarUrl: service.user?.avatarUrl,
            }}
            isLiked={service.liked}
            sharedBy={undefined}
            onLike={async () => {
              const currentLiked = service.liked ?? false;
              toggleLikeService(service.id, !currentLiked);

              try {
                const { liked } = await likePost(service.id);

                if (liked !== !currentLiked) {
                  toggleLikeService(service.id, liked);
                }
              } catch (err) {
                toggleLikeService(service.id, currentLiked);
                console.error('Erro ao curtir serviço:', err);
                toast.error('Erro ao curtir o serviço');
              }
            }}
            onShare={() => openShareModal(service)}
            onDelete={() => handleDelete(service.id)}
            onOpenDetails={() => setSelectedPost(service.id)}
            onEdit={(postId) => setEditingPost(postId)}
            isPostOwner={service.isPostOwner}
            isShareOwner={false}
          />
        ))}

        {services.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum serviço encontrado</p>
            <p className="text-gray-400 mt-2">
              Seja o primeiro a oferecer um serviço à comunidade!
            </p>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreServices}
              disabled={loading}
              className="text-primary hover:underline focus:outline-none"
            >
              {loading ? 'Carregando...' : 'Carregar mais serviços'}
            </button>
          </div>
        )}
      </div>

      {/* Modais */}
      {selectedPost && (
        <PostModal
          postId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            const service = services.find((s) => s.id === selectedPost);

            if (!service) return;

            const currentLiked = service.liked ?? false;
            toggleLikeService(selectedPost, !currentLiked);

            try {
              const { liked } = await likePost(selectedPost);

              if (liked !== !currentLiked) {
                toggleLikeService(selectedPost, liked);
              }
            } catch (err) {
              toggleLikeService(selectedPost, currentLiked);
              console.error('Erro ao curtir serviço:', err);
            }
          }}
          onShare={() => {
            const service = services.find((e) => e.id === selectedPost);
            if (service) {
              // Fecha o modal de detalhes
              setSelectedPost(null);

              // Abre o modal de compartilhamento com leve delay
              setTimeout(() => openShareModal(service), 300);
            }
          }}
          onDelete={() => handleDelete(selectedPost)}
          onEdit={(postId) => setEditingPost(postId)}
        />
      )}

      {editingPost && (
        <EditPostModal
          postId={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={(updatedService) => {
            updateService(updatedService);
            setEditingPost(null);
          }}
        />
      )}

      {postToShare && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={closeShareModal}
          postSummary={{
            title: postToShare.metadata?.title || '',
            content: postToShare.content,
            author: postToShare.user?.name || 'Prestador',
          }}
          onShare={handleShare}
        />
      )}
    </Layout>
  );
};

export default ServicesPage;

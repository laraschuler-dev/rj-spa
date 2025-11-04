// pages/EventsPage.tsx - VERSÃO SIMPLIFICADA
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
import { useEvents } from '../hooks/useEvents';
import Typography from '../components/ui/Typography';

const EventsPage: React.FC = () => {
  const {
    events,
    hasMore,
    loading,
    loadMoreEvents,
    updateEvent,
    removeEvent,
    toggleLikeEvent,
  } = useEvents();

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
    } finally {
      closeShareModal();
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await deletePost(postId);
      removeEvent(postId);
      toast.success('Evento excluído com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir o evento!');
    }
  };

  React.useEffect(() => {
    if (shareModalOpen && selectedPost) setSelectedPost(null);
    if (selectedPost && shareModalOpen) setShareModalOpen(false);
  }, [shareModalOpen, selectedPost]);

  return (
    <Layout variant="feed">
      <div className="mt-6 mb-6">
        <Typography variant="h1" className="text-primary text-center mb-6">
          Eventos
        </Typography>
        <Typography variant="p" className="text-gray-700 mt-4 text-center">
          Descubra eventos solidários na sua comunidade
        </Typography>
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <PostCard
            key={event.uniqueKey || `post-${event.id}`}
            id={event.id}
            title={event.metadata?.title || ''}
            content={event.content}
            images={event.images || []}
            createdAt={event.createdAt}
            categoryId={event.categoria_idcategoria}
            metadata={event.metadata}
            author={{
              id: event.user?.id || 0,
              name: event.user?.name || 'Organizador',
              avatarUrl: event.user?.avatarUrl,
            }}
            isLiked={event.liked}
            sharedBy={undefined}
            onLike={async () => {
              const currentLiked = event.liked ?? false;
              toggleLikeEvent(event.id, !currentLiked);

              try {
                const { liked } = await likePost(event.id);
                if (liked !== !currentLiked) {
                  toggleLikeEvent(event.id, liked);
                }
              } catch (err) {
                toggleLikeEvent(event.id, currentLiked);
                console.error('Erro ao curtir evento:', err);
                toast.error('Erro ao curtir o evento');
              }
            }}
            onShare={() => openShareModal(event)}
            onDelete={() => handleDelete(event.id)}
            onOpenDetails={() => setSelectedPost(event.id)}
            onEdit={(postId) => setEditingPost(postId)}
            isPostOwner={event.isPostOwner}
            isShareOwner={false}
          />
        ))}

        {/* Mostrar mensagem apenas se não estiver carregando */}
        {!loading && events.length === 0 && (
          <div className="text-center py-12">
            <Typography variant="p" className="text-gray-500 text-lg">
              Nenhum evento encontrado.
            </Typography>
            <Typography variant="p" className="text-gray-400 mt-2">
              Seja o primeiro a criar um evento solidário!
            </Typography>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreEvents}
              disabled={loading}
              className="text-primary hover:underline focus:outline-none"
            >
              {loading ? 'Carregando...' : 'Carregar mais eventos'}
            </button>
          </div>
        )}
      </div>

      {/* Modais Simplificados */}
      {selectedPost && (
        <PostModal
          postId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={async () => {
            const event = events.find((e) => e.id === selectedPost);

            if (!event) return;

            const currentLiked = event.liked ?? false;
            toggleLikeEvent(selectedPost, !currentLiked);

            try {
              const { liked } = await likePost(selectedPost);

              if (liked !== !currentLiked) {
                toggleLikeEvent(selectedPost, liked);
              }
            } catch (err) {
              toggleLikeEvent(selectedPost, currentLiked);
              console.error('Erro ao curtir evento:', err);
            }
          }}
          onShare={() => {
            const event = events.find((e) => e.id === selectedPost);
            if (event) {
              // Fecha o modal de detalhes
              setSelectedPost(null);

              // Abre o modal de compartilhamento com leve delay
              setTimeout(() => openShareModal(event), 300);
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
          onSuccess={(updatedEvent) => {
            updateEvent(updatedEvent);
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
            author: postToShare.user?.name || 'Organizador',
          }}
          onShare={handleShare}
        />
      )}
    </Layout>
  );
};

export default EventsPage;

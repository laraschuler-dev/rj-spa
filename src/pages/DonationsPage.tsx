// pages/DonationsPage.tsx
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
import { useDonations } from '../hooks/useDonations';
import Typography from '../components/ui/Typography';

const DonationsPage: React.FC = () => {
  const {
    donations,
    hasMore,
    loading,
    loadMoreDonations,
    updateDonation,
    removeDonation,
    toggleLikeDonation,
  } = useDonations();

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
      removeDonation(postId);
      toast.success('Doação excluída com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir a doação!');
    }
  };

  return (
    <Layout variant="feed">
      <div className="mt-4 mb-6">
        <Typography variant="h1" className="text-primary text-center mb-6">
          Doações
        </Typography>
        <Typography variant="p" className="text-gray-700 mt-4 text-center">
          Encontre itens disponíveis para doação na sua comunidade
        </Typography>
      </div>

      <div className="space-y-6">
        {donations.map((donation) => (
          <PostCard
            key={donation.uniqueKey || `post-${donation.id}`}
            id={donation.id}
            title={donation.metadata?.title || ''}
            content={donation.content}
            images={donation.images || []}
            createdAt={donation.createdAt}
            categoryId={donation.categoria_idcategoria}
            metadata={donation.metadata}
            author={{
              id: donation.user?.id || 0,
              name: donation.user?.name || 'Doador',
              avatarUrl: donation.user?.avatarUrl,
            }}
            isLiked={donation.liked}
            sharedBy={undefined}
            onLike={async () => {
              const currentLiked = donation.liked ?? false;
              toggleLikeDonation(donation.id, !currentLiked);

              try {
                const { liked } = await likePost(donation.id);

                if (liked !== !currentLiked) {
                  toggleLikeDonation(donation.id, liked);
                }
              } catch (err) {
                toggleLikeDonation(donation.id, currentLiked);
                console.error('Erro ao curtir doação:', err);
                toast.error('Erro ao curtir a doação');
              }
            }}
            onShare={() => openShareModal(donation)}
            onDelete={() => handleDelete(donation.id)}
            onOpenDetails={() => setSelectedPost(donation.id)}
            onEdit={(postId) => setEditingPost(postId)}
            isPostOwner={donation.isPostOwner}
            isShareOwner={false}
          />
        ))}

        {donations.length === 0 && !loading && (
          <div className="text-center py-12">
            <Typography variant="p" className="text-gray-500">
              Nenhuma doação encontrada
            </Typography>
            <Typography variant="p" className="text-gray-400 mt-2">
              Seja o primeiro a oferecer uma doação!
            </Typography>
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={loadMoreDonations}
              disabled={loading}
              className="text-primary hover:underline focus:outline-none"
            >
              {loading ? 'Carregando...' : 'Carregar mais doações'}
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
            const donation = donations.find((d) => d.id === selectedPost);

            if (!donation) return;

            const currentLiked = donation.liked ?? false;
            toggleLikeDonation(selectedPost, !currentLiked);

            try {
              const { liked } = await likePost(selectedPost);

              if (liked !== !currentLiked) {
                toggleLikeDonation(selectedPost, liked);
              }
            } catch (err) {
              toggleLikeDonation(selectedPost, currentLiked);
              console.error('Erro ao curtir doação:', err);
            }
          }}
          onShare={() => {
            const donation = donations.find((d) => d.id === selectedPost);
            if (donation) openShareModal(donation);
          }}
          onDelete={() => handleDelete(selectedPost)}
          onEdit={(postId) => setEditingPost(postId)}
        />
      )}

      {editingPost && (
        <EditPostModal
          postId={editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={(updatedDonation) => {
            updateDonation(updatedDonation);
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
            author: postToShare.user?.name || 'Doador',
          }}
          onShare={handleShare}
        />
      )}
    </Layout>
  );
};

export default DonationsPage;

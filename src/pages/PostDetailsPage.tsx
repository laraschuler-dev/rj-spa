import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { usePostDetails } from '../hooks/usePostDetails';
import PostCard from '../components/PostCard';
import ShareModal from '../components/ShareModal';
import { useSharePost } from '../hooks/useSharePost';
import Typography from '../components/ui/Typography';

const PostDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shareId = searchParams.get('shareId')
    ? Number(searchParams.get('shareId'))
    : undefined;

  const { post, loading } = usePostDetails(Number(id), shareId);
  const { sharePost } = useSharePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);

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

      await sharePost(originalPostId, message);
    } catch (err) {
      console.error(err);
    } finally {
      closeShareModal();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <Typography variant="p">Carregando...</Typography>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex justify-center py-10">
          <Typography variant="p">Post não encontrado.</Typography>
        </div>
      </Layout>
    );
  }

  return (
    <Layout variant="feed">
      <div className="max-w-[700px] mx-auto">
        {/* Botão de voltar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary text-sm hover:underline"
        >
          ← Voltar ao feed
        </button>

        {/* Post expandido */}
        <PostCard
          id={post.id}
          title={post.metadata?.title || ''}
          content={post.content}
          images={post.images.map((img) => img.url)}
          createdAt={post.createdAt}
          categoryId={post.categoryId}
          metadata={post.metadata}
          author={{
            id: post.author.id,
            name: post.author.name || 'Usuário desconhecido',
            avatarUrl: post.author.avatarUrl,
          }}
          isLiked={post.likedByUser}
          sharedBy={post.sharedBy}
          expanded
          onShare={() => openShareModal(post)}
        />

        {/* Modal de compartilhamento */}
        {postToShare && (
          <ShareModal
            isOpen={shareModalOpen}
            onClose={closeShareModal}
            postSummary={{
              title: postToShare.metadata?.title || '',
              content: postToShare.content,
              author: postToShare.author?.name || 'Usuário desconhecido',
            }}
            onShare={handleShare}
          />
        )}
      </div>
    </Layout>
  );
};

export default PostDetailsPage;

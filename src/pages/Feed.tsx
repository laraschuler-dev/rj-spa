import React from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';
import api from '../services/api';
import { useSharePost } from '../hooks/useSharePost';

const Feed: React.FC = () => {
  const { posts, setPosts, fetchPosts, hasMore, loading } = usePosts();
  const { sharePost } = useSharePost();

  return (
    <Layout variant="feed">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={`${post.id}-${post.sharedBy?.sharedAt || post.createdAt}`}
            id={post.id}
            title={post.metadata?.title || ''}
            content={post.content}
            images={post.images}
            createdAt={post.createdAt}
            categoryId={post.categoria_idcategoria}
            author={{
              name: post.user_iduser.name,
              avatarUrl: post.user_iduser.avatarUrl,
            }}
            isLiked={post.liked}
            onLike={async () => {
              try {
                const res = await api.post(`/posts/${post.id}/like`);
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === post.id ? { ...p, liked: res.data.liked } : p
                  )
                );
              } catch (error) {
                console.error('Erro ao curtir o post:', error);
              }
            }}
            onShare={() => sharePost(post.id)}
          />
        ))}

        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={fetchPosts}
              disabled={loading}
              className="text-primary hover:underline" // Estilo original
            >
              {loading ? 'Carregando...' : 'Carregar mais'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feed;

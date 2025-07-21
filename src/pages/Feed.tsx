import React from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';
import api from '../services/api';

const Feed: React.FC = () => {
  const { posts, setPosts, fetchPosts, hasMore, loading } = usePosts();

  return (
    <Layout variant="feed">
      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostCard
            key={`post-${post.id}-${index}`}
            id={post.id}
            title={post.metadata?.title || ''}
            content={post.content}
            images={post.images}
            createdAt={post.createdAt}
            categoryId={post.categoria_idcategoria}
            author={{
              name: post.user_iduser?.name || 'Usuário desconhecido',
              avatarUrl: post.user_iduser?.avatarUrl,
              profileType: post.user_iduser?.profileType,
            }}
            isLiked={post.liked} // <- passa liked do estado
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
          />
        ))}
        {hasMore && (
          <div className="text-center mt-4">
            <button
              onClick={fetchPosts}
              disabled={loading}
              className="text-primary hover:underline"
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

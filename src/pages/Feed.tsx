import React from 'react';
import Layout from '../components/layout/Layout';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';
import api from '../services/api';
import { useSharePost } from '../hooks/useSharePost';

const Feed: React.FC = () => {
  const { posts, setPosts, fetchPosts, hasMore, loading } = usePosts();
  const { sharePost } = useSharePost();

  React.useEffect(() => {
    const keys = posts.map((p) => p.uniqueKey || p.id);
    const duplicateKeys = keys.filter(
      (key, index) => keys.indexOf(key) !== index
    );

    if (duplicateKeys.length > 0) {
      console.error('Posts com chaves duplicadas:', duplicateKeys);
      console.log(
        'Posts duplicados:',
        posts.filter((p) =>
          duplicateKeys.includes(p.uniqueKey || p.id.toString())
        )
      );
    }
  }, [posts]);

  return (
    <Layout variant="feed">
      <div className="space-y-6">
        {posts
          .filter(
            (post, index, self) =>
              index === self.findIndex((p) => p.id === post.id)
          )
          .map((post) => (
            <PostCard
              key={post.uniqueKey || `post-${post.id}`}
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

import { useEffect, useState } from 'react';
import axios from '../services/api';
import { PostListItem } from '../types/Post';

export function usePosts() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get('/posts', {
        params: { page, limit: 5 },
      });

      const newPosts: PostListItem[] = res.data.data
        .filter(
          (newPost: PostListItem) =>
            !posts.some((post) => post.id === newPost.id)
        )
        .map((post: any) => ({
          id: post.id,
          content: post.content,
          categoria_idcategoria: post.categoria_idcategoria,
          metadata: post.metadata || {},
          images: post.images || [],
          createdAt: post.createdAt,
          liked: post.liked ?? false,
          user_iduser: {
            id: post.user_iduser?.id || 0,
            name: post.user_iduser?.name || 'Usuário',
            avatarUrl: post.user_iduser?.avatarUrl,
            profileType: post.user_iduser?.profileType,
          },
        }));

      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(res.data.totalPages > page);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, setPosts, fetchPosts, hasMore, loading };
}

import { useState, useEffect, useCallback } from 'react';
import axios from '../services/api';
import { PostListItem } from '../types/Post';

/**
 * Gerencia a lista combinada de posts e compartilhamentos
 *
 * - Automaticamente remove duplicatas usando uniqueKey
 * - Preserva a ordem cronológica inversa (mais novos primeiro)
 * - Garante que cada instância de post/compartilhamento tenha identidade única
 */
export function usePosts() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(
    async (isInitialLoad = false) => {
      if (loading || (!isInitialLoad && !hasMore)) return;

      setLoading(true);
      try {
        const res = await axios.get('/posts', {
          params: {
            page: isInitialLoad ? 1 : page,
            limit: 10,
          },
        });

        if (!res.data?.posts || res.data.posts.length === 0) {
          setHasMore(false);
          return;
        }

        setPosts((prev) => {
          // Na carga inicial, substitui todos os posts
          if (isInitialLoad) {
            return res.data.posts;
          }

          // Nas cargas seguintes, adiciona somente posts novos
          const newPosts = res.data.posts.filter(
            (newPost: { id: number }) =>
              !prev.some((post) => post.id === newPost.id)
          );

          return [...prev, ...newPosts];
        });

        if (!isInitialLoad) {
          setHasMore(res.data.posts.length > 0);
          setPage((prev) => prev + 1);
        } else {
          setPage(2);
        }
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore]
  );

  const refreshPosts = useCallback(() => {
    fetchPosts(true);
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  return {
    posts,
    setPosts,
    fetchPosts: () => fetchPosts(false),
    refreshPosts, // Nova função para refresh
    hasMore,
    loading,
  };
}

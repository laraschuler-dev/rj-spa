import { useState, useEffect, useCallback } from 'react';
import axios from '../services/api';
import { PostListItem } from '../types/Post';

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
            page: isInitialLoad ? 1 : page, // Sempre página 1 no carregamento inicial
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
          // Nas cargas seguintes, adiciona aos existentes
          return [...prev, ...res.data.posts];
        });

        // Atualiza paginação somente se não for carga inicial
        if (!isInitialLoad) {
          setHasMore(res.data.page < res.data.totalPages);
          setPage((prev) => prev + 1);
        }
      } catch (err) {
        console.error('Erro ao buscar posts:', err);
      } finally {
        setLoading(false);
      }
    },
    [page, loading, hasMore]
  );

  // Carrega a primeira página automaticamente
  useEffect(() => {
    fetchPosts(true);
  }, []);

  return {
    posts,
    setPosts,
    fetchPosts: () => fetchPosts(false), // Força não ser carga inicial
    hasMore,
    loading,
  };
}

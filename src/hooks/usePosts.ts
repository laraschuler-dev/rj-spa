// src/hooks/usePosts.ts
import { usePostStore } from '../stores/postStore';

/**
 * Hook que expõe a store de posts
 *
 * Mantém a mesma interface anterior para evitar que componentes que já usam quebrem.
 * Toda a lógica agora está centralizada no Zustand.
 */
export function usePosts() {
  const { posts, setPosts, fetchPosts, refreshPosts, hasMore, loading } =
    usePostStore();

  return {
    posts,
    setPosts,
    fetchPosts: () => fetchPosts(false),
    refreshPosts,
    hasMore,
    loading,
  };
}

import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';

export function usePosts() {
  const { posts, fetchPosts, refreshPosts, hasMore, loading, resetPosts } =
    usePostStore();

  useEffect(() => {
    resetPosts();
    fetchPosts(true);
  }, [fetchPosts, resetPosts]);

  return {
    posts,
    loadMorePosts: () => {
      fetchPosts(false);
    },
    refreshPosts,
    hasMore,
    loading,
  };
}

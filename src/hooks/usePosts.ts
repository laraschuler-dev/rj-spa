import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';

export function usePosts() {
  const { posts, fetchPosts, refreshPosts, hasMore, loading } = usePostStore();

  useEffect(() => {
    fetchPosts(true);
  }, [fetchPosts]);

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

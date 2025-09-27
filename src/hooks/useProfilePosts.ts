import { useEffect, useCallback } from 'react';
import { usePostStore } from '../stores/postStore';
import { useAuth } from '../hooks/useAuth';

export function useProfilePosts(userId: number | undefined) {
  const { user: currentUser } = useAuth();

  const {
    posts = [],
    fetchUserPosts,
    refreshUserPosts,
    hasMore,
    loading,
  } = usePostStore();

  const refreshPosts = useCallback(() => {
    if (userId && currentUser?.id) {
      return refreshUserPosts(userId, currentUser.id);
    }
  }, [userId, currentUser?.id, refreshUserPosts]);

  // Carrega posts inicialmente
  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return {
    posts,
    loadMorePosts: () =>
      userId &&
      currentUser?.id &&
      fetchUserPosts(userId, currentUser.id, false),
    refreshPosts,
    hasMore,
    loading,
  };
}

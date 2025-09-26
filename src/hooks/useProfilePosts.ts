import { useEffect } from 'react';
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

  // ✅ Função para refresh que será retornada
  const refreshPosts = () => {
    if (userId && currentUser?.id) {
      return refreshUserPosts(userId, currentUser.id);
    }
  };

  // ✅ useEffect usando a função interna refreshPosts
  useEffect(() => {
    if (userId && currentUser?.id) {
      refreshUserPosts(userId, currentUser.id);
    }
  }, [userId, currentUser?.id]);

  return {
    posts: posts,
    loadMorePosts: () =>
      userId &&
      currentUser?.id &&
      fetchUserPosts(userId, currentUser.id, false),
    refreshPosts: () =>
      userId && currentUser?.id && refreshUserPosts(userId, currentUser.id),
    hasMore,
    loading,
  };
}

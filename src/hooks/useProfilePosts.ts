// useProfilePosts.ts
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';

export function useProfilePosts(userId: number | undefined) {
  const {
    posts = [],
    fetchUserPosts,
    refreshUserPosts,
    hasMore,
    loading,
  } = usePostStore();

  // ✅ Função para refresh que será retornada
  const refreshPosts = () => {
    if (userId) {
      return refreshUserPosts(userId);
    }
  };

  // ✅ useEffect usando a função interna refreshPosts
  useEffect(() => {
    if (userId) {
      refreshUserPosts(userId); // ✅ Chama diretamente da store
    }
  }, [userId]); // ✅ Só depende do userId

  const userPosts = (posts || []).filter(
    (post) => post.user?.id === userId || post.sharedBy?.id === userId
  );

  return {
    posts: userPosts,
    loadMorePosts: () => userId && fetchUserPosts(userId, false),
    refreshPosts: () => userId && refreshUserPosts(userId), // ✅ Retorna a função correta
    hasMore,
    loading,
  };
}

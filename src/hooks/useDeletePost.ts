// src/hooks/useDeletePost.ts
import { useState } from 'react';
import api from '../services/api';
import { usePostStore } from '../stores/postStore';

export function useDeletePost() {
  const [loading, setLoading] = useState(false);
  const removePost = usePostStore((state) => state.removePost);

  const deletePost = async (postId: number, shareId?: number) => {
    setLoading(true);
    try {
      await api.delete(`/posts/${postId}`, {
        params: shareId ? { shareId } : undefined,
      });
      removePost(postId, shareId); // ✅ remove via store
    } catch (err) {
      console.error('[useDeletePost] Erro ao excluir:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading };
}

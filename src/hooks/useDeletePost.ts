// src/hooks/useDeletePost.ts
import { useState } from 'react';
import api from '../services/api';

export function useDeletePost() {
  const [loading, setLoading] = useState(false);

  const deletePost = async (postId: number, shareId?: number) => {
    setLoading(true);
    try {
      console.log('[useDeletePost] Tentando excluir:', { postId, shareId });
      const response = await api.delete(`/posts/${postId}`, {
        params: shareId ? { shareId } : undefined,
      });
      console.log('[useDeletePost] Resposta da API:', response);
    } catch (err) {
      console.error(
        '[useDeletePost] Erro ao excluir post/compartilhamento:',
        err
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { deletePost, loading };
}

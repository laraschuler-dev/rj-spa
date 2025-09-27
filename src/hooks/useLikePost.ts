// src/hooks/useLikePost.ts
import api from '../services/api';

export async function likePost(postId: number, shareId?: number) {
  const params = shareId ? { shareId } : {};
  try {
    const res = await api.post(`/posts/${postId}/like`, null, { params });
    return res.data as { liked: boolean }; // retorna apenas { liked, likeCount }
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error);
    throw error;
  }
}

// src/hooks/useLikePost.ts
import api from '../services/api';
import { PostListItem } from '../types/Post';
import { usePostStore } from '../stores/postStore';

export async function likePost(postId: number, shareId?: number) {
  const params = shareId ? { shareId } : {};
  try {
    const res = await api.post(`/posts/${postId}/like`, null, { params });
    const updatedPost: PostListItem = res.data; // <-- retornando post completo
    const store = usePostStore.getState();
    store.updatePost(updatedPost); // ✅ atualiza feed via store
    return updatedPost.liked;
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error);
    throw error;
  }
}

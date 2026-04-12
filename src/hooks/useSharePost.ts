// hooks/useSharePost.ts (ATUALIZADO)
import { toast } from 'react-toastify';
import api from '../services/api';
import { usePostStore } from '../stores/postStore';

export function useSharePost() {
  const addPost = usePostStore((state) => state.addPost);

  const sharePost = async (
    postId: number,
    optionalMessage?: string,
    shareId?: number // ✅ NOVO: ID do compartilhamento que está sendo compartilhado
  ) => {
    try {
      const res = await api.post(`/posts/${postId}/share`, {
        message: optionalMessage,
        shareId: shareId, // ✅ ENVIA quando for compartilhamento de compartilhamento
      });

      addPost(res.data);
      toast.success('Post compartilhado com sucesso!');
      return res.data;
    } catch (error) {
      toast.error('Erro ao compartilhar post!');
      console.error('Erro ao compartilhar post:', error);
      throw error;
    }
  };

  return { sharePost };
}

import { toast } from 'react-toastify';
import api from '../services/api';
import { usePostStore } from '../stores/postStore';

export function useSharePost() {
  const addPost = usePostStore((state) => state.addPost);

  const sharePost = async (postId: number, optionalMessage?: string) => {
    try {
      const res = await api.post(`/posts/${postId}/share`, {
        message: optionalMessage,
      });
      addPost(res.data); // ✅ adiciona no topo via store
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

import { toast } from 'react-toastify';
import api from '../services/api';

export function useSharePost() {
  const sharePost = async (postId: number, optionalMessage?: string) => {
    try {
      const res = await api.post(`/posts/${postId}/share`, {
        message: optionalMessage,
      });
      toast.dismiss();
      toast.success('Post compartilhado com sucesso!');
      return res.data; // <-- importante para atualizar o feed
    } catch (error) {
      console.error('Erro ao compartilhar post:', error);
      toast.dismiss();
      toast.error('Erro ao compartilhar o post');
      throw error;
    }
  };

  return { sharePost };
}

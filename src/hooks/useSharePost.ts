import { toast } from 'react-toastify';
import api from '../services/api';

export function useSharePost() {
  const sharePost = async (postId: number, optionalMessage?: string) => {
    try {
      await api.post(`/posts/${postId}/share`, {
        message: optionalMessage,
      });
      toast.dismiss();
      toast.success('Post compartilhado com sucesso!');
    } catch (error) {
      console.error('Erro ao compartilhar post:', error);
      toast.dismiss();
      toast.error('Erro ao compartilhar o post');
    }
  };

  return { sharePost };
}

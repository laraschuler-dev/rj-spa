import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';

interface UseEditPostProps {
  postId: number;
  shareId?: number;
}

export const useEditPost = ({ postId, shareId }: UseEditPostProps) => {
  const [loading, setLoading] = useState(false);

  const editPost = async (data: FormData) => {
    try {
      setLoading(true);
      const params = shareId ? { params: { shareId } } : {};
      await axios.put(`/posts/${postId}`, data, params);
      toast.success('Post atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar o post.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { editPost, loading };
};

// hooks/useEditPost.ts
import { useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { PostListItem } from '../types/Post';

interface UseEditPostProps {
  postId: number;
  shareId?: number;
}

export const useEditPost = ({ postId, shareId }: UseEditPostProps) => {
  const [loading, setLoading] = useState(false);

  const editPost = async (data: FormData): Promise<PostListItem | null> => {
    try {
      setLoading(true);
      const params = shareId ? { params: { shareId } } : {};
      const { data: updatedPost } = await axios.put(
        `/posts/${postId}`,
        data,
        params
      );
      toast.success('Post atualizado com sucesso!');
      return updatedPost; // <-- retorna post completo
    } catch (error: any) {
      toast.error('Erro ao atualizar o post.');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editPost, loading };
};

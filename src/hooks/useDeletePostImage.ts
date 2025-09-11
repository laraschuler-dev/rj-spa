import axios from '../services/api';
import { toast } from 'react-toastify';

export const useDeletePostImage = (postId: number) => {
  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/posts/${postId}/images/${imageId}`);
    } catch (error: any) {
      toast.error('Erro ao remover a imagem.');
      console.error(error);
    }
  };

  return { deleteImage };
};

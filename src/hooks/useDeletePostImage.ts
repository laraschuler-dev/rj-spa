import axios from '../services/api';
import { toast } from 'react-toastify';

export const useDeletePostImage = (postId: number) => {
  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/posts/${postId}/images/${imageId}`);
      toast.success('Imagem removida com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao remover a imagem.');
      console.error(error);
    }
  };

  return { deleteImage };
};

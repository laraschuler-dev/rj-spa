import axios from '../services/api';

export const useDeletePostImage = (postId: number) => {
  const deleteImage = async (imageId: number) => {
    try {
      await axios.delete(`/posts/${postId}/images/${imageId}`);
    } catch (error: any) {
      console.error('Erro ao remover a imagem:', error);
      throw error; // se precisar tratar no componente
    }
  };

  return { deleteImage };
};

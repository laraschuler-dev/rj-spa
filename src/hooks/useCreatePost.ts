// src/hooks/posts/useCreatePost.ts
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { toast } from 'react-toastify';

export const useCreatePost = () => {
  const navigate = useNavigate();

  const createPost = async (data: FormData) => {
    try {
      await axios.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post criado com sucesso!');
      navigate('/feed');
    } catch (error) {
      toast.error('Erro ao criar post.');
      console.error(error);
    }
  };

  return { createPost };
};

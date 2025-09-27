// src/hooks/posts/useCreatePost.ts
import axios from '../services/api';
import { toast } from 'react-toastify';
import { usePostStore } from '../stores/postStore';
import { useNavigate } from 'react-router-dom';

export const useCreatePost = () => {
  const navigate = useNavigate();
  const addPost = usePostStore((state) => state.addPost); // pegar função da store

  const createPost = async (data: FormData) => {
    try {
      const res = await axios.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newPost = res.data; // Assumindo que a API retorna o post completo
      addPost(newPost); // Atualiza store

      toast.success('Post criado com sucesso!');
      navigate('/feed'); // agora já terá o post na store
    } catch (error) {
      toast.error('Erro ao criar post.');
      console.error(error);
    }
  };

  return { createPost };
};

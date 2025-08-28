import { useEffect, useState } from 'react';
import axios from '../services/api';
import { PostListItem } from '../types/Post';

export const usePostDetails = (postId: number, shareId?: number) => {
  const [post, setPost] = useState<PostListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`, {
          params: shareId ? { shareId } : {},
        });
        setPost(res.data);
      } catch (err) {
        console.error('Erro ao carregar detalhes do post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, shareId]);

  return { post, loading };
};

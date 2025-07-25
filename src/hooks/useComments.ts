import { useState } from 'react';
import api from '../services/api';
import { Comment } from '../types/Comment';

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.data);
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments/count`);
      setCommentCount(res.data.count);
    } catch (err) {
      console.error('Erro ao contar comentários:', err);
      throw err;
    }
  };

  const createComment = async (content: string) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, {
        comment: content,
      });
      await fetchComments();
      await fetchCommentCount();
      return res.data;
    } catch (err) {
      console.error('Erro ao criar comentário:', err);
      throw err;
    }
  };

  const editComment = async (commentId: number, content: string) => {
    try {
      const res = await api.put(`/posts/${postId}/comments/${commentId}`, {
        content,
      });
      await fetchComments();
      return res.data;
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
      await fetchComments();
      await fetchCommentCount();
      return res.data;
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      throw err;
    }
  };

  return {
    comments,
    loading,
    commentCount,
    fetchComments,
    fetchCommentCount,
    createComment,
    editComment,
    deleteComment,
  };
}

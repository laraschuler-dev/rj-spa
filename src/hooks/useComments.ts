// src/hooks/useComments.ts
import { useState } from 'react';
import { usePostStore } from '../stores/postStore';
import api from '../services/api';
import { PostComment } from '../types/Comment';

export function useComments(postId: number, shareId?: number) {
  const { comments, fetchComments, addComment, updateComment, removeComment } =
    usePostStore();

  const [loading, setLoading] = useState(false); // 👈 novo estado

  const key = shareId ? `share-${shareId}` : `post-${postId}`;
  const currentComments = comments[key] || [];

  const fetchWithLoading = async () => {
    setLoading(true);
    try {
      await fetchComments(postId, shareId);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    const params = shareId ? { shareId } : {};
    const res = await api.post(
      `/posts/${postId}/comment`,
      { comment: content },
      { params }
    );

    const created: PostComment =
      res.data?.data ?? res.data?.comment ?? res.data ?? null;

    if (created && created.id) {
      addComment(postId, created, shareId);
    } else {
      await fetchWithLoading();
    }

    return created;
  };

  const editComment = async (commentId: number, content: string) => {
    const params = shareId ? { postShareId: shareId } : undefined;
    const res = await api.put(
      `/posts/${postId}/comments/${commentId}`,
      { content },
      { params }
    );

    const updated: PostComment =
      res.data?.data ?? res.data?.comment ?? res.data ?? null;

    if (updated && updated.id) {
      updateComment(postId, updated, shareId);
    } else {
      await fetchWithLoading();
    }

    return updated;
  };

  const deleteComment = async (commentId: number) => {
    const params = shareId ? { postShareId: shareId } : undefined;
    await api.delete(`/posts/${postId}/comments/${commentId}`, { params });
    removeComment(postId, commentId, shareId);
  };

  return {
    comments: currentComments,
    loading, // 👈 exporta loading
    fetchComments: fetchWithLoading,
    createComment,
    editComment,
    deleteComment,
  };
}

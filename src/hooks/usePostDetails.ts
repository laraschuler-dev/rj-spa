// hooks/usePostDetails.ts - VERSÃO CORRIGIDA
import { useEffect, useState } from 'react';
import { usePostStore } from '../stores/postStore';

export const usePostDetails = (postId: number, shareId?: number) => {
  const { posts, fetchPostDetails } = usePostStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ SELETOR - deriva o post da store
  const post = posts.find((p) => {
    if (shareId) {
      return p.sharedBy?.shareId === shareId;
    } else {
      return p.id === postId && !p.sharedBy;
    }
  });

  // ✅ EFFECT - SEMPRE busca da API para garantir dados frescos
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await fetchPostDetails(postId, shareId);
      } catch (err) {
        console.error('❌ Erro ao carregar post:', err);
        setError('Erro ao carregar post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId, shareId, fetchPostDetails]);

  return {
    post,
    loading,
    error,
    refetch: () => fetchPostDetails(postId, shareId),
  };
};

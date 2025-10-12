import { useState } from 'react';
import axios from '../services/api';
import { usePostStore } from '../stores/postStore';

export function useEventAttendance(postId?: number, postShareId?: number) {
  const { posts, toggleAttendance } = usePostStore();
  const [loading, setLoading] = useState(false);

  // Localiza o post/share na store
  // No useEventAttendance.ts - CORREÇÃO
  const post = posts.find((p) => {
    // Se temos postShareId, busca pelo compartilhamento específico
    if (postShareId) {
      return p.sharedBy?.shareId === postShareId;
    }
    // Se não temos postShareId, busca pelo post original
    else {
      return p.id === postId && !p.sharedBy;
    }
  });

  const status = {
    attending: post?.attending ?? false,
    userStatus: post?.attending ? 'confirmed' : null,
  };

  const toggle = async () => {
    if (!postId) return;

    try {
      setLoading(true);

      // Atualização otimista na store (toggle local)
      toggleAttendance(postId, postShareId);

      // Chamada para API: sempre envia 'confirmed', backend faz toggle
      await axios.post(
        `/posts/${postId}/attend`,
        { status: 'confirmed' },
        { params: postShareId ? { postShareId } : {} }
      );
    } catch (error) {
      console.error('[useEventAttendance] Erro ao registrar presença:', error);

      // Reverte em caso de erro
      toggleAttendance(postId, postShareId);
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, toggleAttendance: toggle };
}

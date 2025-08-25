import { useState, useEffect } from 'react';
import axios from '../services/api';

interface EventAttendanceStatus {
  userStatus: 'interested' | 'confirmed' | null;
  interestedCount: number;
  confirmedCount: number;
}

// hooks/useEventAttendance.ts
export function useEventAttendance(postId?: number, postShareId?: number) {
  const [status, setStatus] = useState<EventAttendanceStatus>({
    userStatus: null,
    interestedCount: 0,
    confirmedCount: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/posts/${postId}/attend-status`, {
          params: postShareId ? { postShareId } : {},
        });
        setStatus(res.data);
      } catch (error) {
        console.error(
          '[useEventAttendance] Erro ao carregar status de presença:',
          error
        );
      }
    };

    fetchStatus();
  }, [postId, postShareId]);

  const toggleAttendance = async () => {
    if (!postId) return;

    setLoading(true);
    try {
      // se o usuário já está confirmado, vai remover
      const newStatus =
        status.userStatus === 'confirmed' ? 'confirmed' : 'confirmed';

      const res = await axios.post(
        `/posts/${postId}/attend`,
        { status: newStatus },
        { params: postShareId ? { postShareId } : {} }
      );
      // atualizar o status retornado
      setStatus((prev) => ({
        ...prev,
        userStatus: prev.userStatus === 'confirmed' ? null : 'confirmed',
        confirmedCount:
          prev.userStatus === 'confirmed'
            ? prev.confirmedCount - 1
            : prev.confirmedCount + 1,
      }));
    } catch (error) {
      console.error('[useEventAttendance] Erro ao registrar presença:', error);
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, toggleAttendance };
}

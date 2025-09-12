import { useState, useEffect } from 'react';
import axios from '../services/api';
import { usePostStore } from '../stores/postStore';

interface EventAttendanceStatus {
  userStatus: 'interested' | 'confirmed' | null;
  interestedCount: number;
  confirmedCount: number;
}

export function useEventAttendance(postId?: number, postShareId?: number) {
  const { toggleAttendance: updateStoreAttendance } = usePostStore();
  const [status, setStatus] = useState<EventAttendanceStatus>({
    userStatus: null,
    interestedCount: 0,
    confirmedCount: 0,
  });
  const [loading, setLoading] = useState(false);

  // Carrega status inicial do backend
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

  // Toggle de presença
  const toggleAttendance = async () => {
    if (!postId) return;

    setLoading(true);
    const isConfirmed = status.userStatus === 'confirmed';
    const newUserStatus: 'confirmed' | null = isConfirmed ? null : 'confirmed';
    const newConfirmedCount = isConfirmed
      ? status.confirmedCount - 1
      : status.confirmedCount + 1;

    try {
      // Atualiza estado local imediatamente (UX instantânea)
      setStatus((prev) => ({
        ...prev,
        userStatus: newUserStatus,
        confirmedCount: newConfirmedCount,
      }));

      // Atualiza store global
      updateStoreAttendance(postId, postShareId, newUserStatus, {
        interestedCount: status.interestedCount,
        confirmedCount: newConfirmedCount,
      });

      // Chamada ao backend (toggle)
      await axios.post(
        `/posts/${postId}/attend`,
        { status: 'confirmed' }, // sempre enviado
        { params: postShareId ? { postShareId } : {} }
      );
    } catch (error) {
      console.error('[useEventAttendance] Erro ao registrar presença:', error);

      // Reverte estado local e store em caso de erro
      setStatus((prev) => ({
        ...prev,
        userStatus: status.userStatus,
        confirmedCount: status.confirmedCount,
      }));
      updateStoreAttendance(postId, postShareId, status.userStatus, {
        interestedCount: status.interestedCount,
        confirmedCount: status.confirmedCount,
      });
    } finally {
      setLoading(false);
    }
  };

  return { status, loading, toggleAttendance };
}

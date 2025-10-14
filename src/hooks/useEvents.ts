// hooks/useEvents.ts
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';
import axios from '../services/api';

export function useEvents() {
  const {
    posts,
    fetchPosts,
    refreshPosts,
    hasMore,
    loading,
    setPosts,
    updatePost,
    removePost,
    toggleLikePost,
    toggleAttendance,
  } = usePostStore();

  const events = posts.filter(
    (post) => post.categoria_idcategoria === 8 && !post.sharedBy
  );

  const fetchEvents = async (isInitialLoad: boolean = false) => {
    if (loading) return;

    try {
      const currentPage = isInitialLoad ? 1 : usePostStore.getState().page;

      const res = await axios.get('/specialized/events', {
        params: { page: currentPage, limit: 10 },
      });

      const eventsFromApi = res.data.posts || res.data.events || [];
      const pagination = res.data.pagination;

      if (isInitialLoad) {
        // Substitui todos os posts por eventos
        setPosts(eventsFromApi);
      } else {
        // Adiciona novos eventos aos posts existentes
        const currentPosts = usePostStore.getState().posts;
        const newPosts = [
          ...currentPosts,
          ...eventsFromApi.filter(
            (e: any) =>
              !currentPosts.some(
                (existing: any) => existing.uniqueKey === e.uniqueKey
              )
          ),
        ];
        setPosts(newPosts);
      }

      usePostStore.setState({
        page: currentPage + 1,
        hasMore: pagination?.hasNextPage || false,
        loading: false,
      });
    } catch (err) {
      console.error('Erro ao buscar eventos:', err);
      usePostStore.setState({ loading: false });
    }
  };

  const refreshEvents = async () => {
    await fetchEvents(true);
  };

  const loadMoreEvents = () => {
    fetchEvents(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  return {
    events,
    loadMoreEvents,
    refreshEvents,
    hasMore,
    loading,
    updateEvent: updatePost,
    removeEvent: removePost,
    toggleLikeEvent: toggleLikePost,
    toggleEventAttendance: toggleAttendance,
  };
}

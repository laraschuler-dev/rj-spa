// hooks/useServices.ts
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';
import axios from '../services/api';

export function useServices() {
  const {
    posts,
    setPosts,
    updatePost,
    removePost,
    toggleLikePost,
    hasMore,
    loading,
  } = usePostStore();

  const services = posts.filter(
    (post) => [5, 6, 7].includes(post.categoria_idcategoria) && !post.sharedBy
  );

  const fetchServices = async (isInitialLoad: boolean = false) => {
    // ⚠️ aqui usa só o loading do store
    if (loading) return;

    // 🔹 força loading = true na store antes da fetch
    usePostStore.setState({ loading: true });

    try {
      const currentPage = isInitialLoad ? 1 : usePostStore.getState().page;

      const res = await axios.get('/specialized/services', {
        params: { page: currentPage, limit: 10 },
      });

      const servicesFromApi = res.data.posts || res.data.services || [];
      const pagination = res.data.pagination;

      const currentPosts = usePostStore.getState().posts;

      const newPosts = isInitialLoad
        ? servicesFromApi
        : [
            ...currentPosts,
            ...servicesFromApi.filter(
              (s: any) =>
                !currentPosts.some(
                  (existing: any) => existing.uniqueKey === s.uniqueKey
                )
            ),
          ];

      setPosts(newPosts);

      usePostStore.setState({
        page: currentPage + 1,
        hasMore: pagination?.hasNextPage || false,
        loading: false,
      });
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
      usePostStore.setState({ loading: false });
    }
  };

  const refreshServices = async () => {
    await fetchServices(true);
  };

  const loadMoreServices = () => {
    fetchServices(false);
  };

  useEffect(() => {
    refreshServices();
  }, []);

  return {
    services,
    loadMoreServices,
    refreshServices,
    hasMore,
    loading, // usa apenas loading da store
    updateService: updatePost,
    removeService: removePost,
    toggleLikeService: toggleLikePost,
  };
}

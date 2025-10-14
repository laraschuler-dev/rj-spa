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

  // 👇 Filtra apenas serviços ORIGINAIS (categorias 5, 6, 7)
  const services = posts.filter(
    (post) =>
      [5, 6, 7].includes(post.categoria_idcategoria) && // VOLUNTEER, COURSE, JOB_OFFER
      !post.sharedBy
  );

  const fetchServices = async (isInitialLoad: boolean = false) => {
    if (loading) return;

    try {
      const currentPage = isInitialLoad ? 1 : usePostStore.getState().page;

      const res = await axios.get('/specialized/services', {
        params: { page: currentPage, limit: 10 },
      });

      const servicesFromApi = res.data.posts || res.data.services || [];
      const pagination = res.data.pagination;

      console.log('📄 Paginação Serviços:', {
        page: currentPage,
        servicesReceived: servicesFromApi.length,
        hasMore: pagination?.hasNextPage,
        total: pagination?.totalItems,
        categories: servicesFromApi.map((s: any) => s.categoria_idcategoria),
      });

      if (isInitialLoad) {
        setPosts(servicesFromApi);
      } else {
        const currentPosts = usePostStore.getState().posts;
        const newPosts = [
          ...currentPosts,
          ...servicesFromApi.filter(
            (s: any) =>
              !currentPosts.some(
                (existing: any) => existing.uniqueKey === s.uniqueKey
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
    loading,
    updateService: updatePost,
    removeService: removePost,
    toggleLikeService: toggleLikePost,
  };
}

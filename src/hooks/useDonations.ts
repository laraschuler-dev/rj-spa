// hooks/useDonations.ts
import { useEffect } from 'react';
import { usePostStore } from '../stores/postStore';
import axios from '../services/api';

export function useDonations() {
  const {
    posts,
    setPosts,
    updatePost,
    removePost,
    toggleLikePost,
    hasMore,
    loading,
    resetPosts,
  } = usePostStore();

  // 👇 Filtra apenas doações ORIGINAIS (categoria 1)
  const donations = posts.filter(
    (post) => post.categoria_idcategoria === 1 && !post.sharedBy
  );

  const fetchDonations = async (isInitialLoad: boolean = false) => {
    usePostStore.setState({ loading: true }); // ✅ garante que loading seja true antes de buscar
    try {
      const currentPage = isInitialLoad ? 1 : usePostStore.getState().page;

      const res = await axios.get('/specialized/donations', {
        params: { page: currentPage, limit: 10 },
      });

      const donationsFromApi = res.data.posts || res.data.donations || [];
      const pagination = res.data.pagination;

      if (isInitialLoad) {
        setPosts(donationsFromApi);
      } else {
        const currentPosts = usePostStore.getState().posts;
        const newPosts = [
          ...currentPosts,
          ...donationsFromApi.filter(
            (d: any) =>
              !currentPosts.some(
                (existing: any) => existing.uniqueKey === d.uniqueKey
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
      console.error('Erro ao buscar doações:', err);
      usePostStore.setState({ loading: false });
    }
  };

  const refreshDonations = async () => {
    resetPosts();
    await fetchDonations(true);
  };

  const loadMoreDonations = () => {
    fetchDonations(false);
  };

  useEffect(() => {
    refreshDonations();
  }, []);

  return {
    donations,
    loadMoreDonations,
    refreshDonations,
    hasMore,
    loading,
    updateDonation: updatePost,
    removeDonation: removePost,
    toggleLikeDonation: toggleLikePost,
  };
}

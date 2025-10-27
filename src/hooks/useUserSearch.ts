// src/hooks/useUserSearch.ts
import { useState, useCallback } from 'react';
import axios from '../services/api';

export interface SearchedUser {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  profileType?: string;
}

export const useUserSearch = () => {
  const [users, setUsers] = useState<SearchedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  const searchUsers = useCallback(
    async (searchTerm: string, isNewSearch: boolean = true) => {
      if (!searchTerm || searchTerm.trim().length < 2) {
        setUsers([]);
        setHasMore(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const currentPage = isNewSearch ? 1 : page;
        const response = await axios.get('/users/search', {
          params: {
            q: searchTerm.trim(),
            page: currentPage,
            limit: 10,
          },
        });

        const newUsers = response.data.data.users;

        setUsers((prev) => (isNewSearch ? newUsers : [...prev, ...newUsers]));
        setHasMore(response.data.pagination.hasNextPage);
        setPage(currentPage + 1);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Erro ao buscar usuários');
        console.error('Erro na busca de usuários:', err);
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  const resetSearch = useCallback(() => {
    setUsers([]);
    setPage(1);
    setHasMore(false);
    setError(null);
  }, []);

  const loadMore = useCallback(() => {
    if (users.length > 0 && hasMore) {
      searchUsers('', false);
    }
  }, [users.length, hasMore, searchUsers]);

  return {
    users,
    loading,
    error,
    hasMore,
    searchUsers,
    resetSearch,
    loadMore,
  };
};

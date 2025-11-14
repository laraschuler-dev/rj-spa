// usePostDetails.ts - VERSÃO SEM LOOP
import { useEffect, useState, useRef } from 'react';
import { PostListItem } from '../types/Post';
import { usePostStore } from '../stores/postStore';

export const usePostDetails = (postId: number, shareId?: number) => {
  const { posts, updatePost, fetchPostDetails } = usePostStore();
  const [post, setPost] = useState<PostListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ REF para controlar se já buscou da API
  const hasFetchedFromApi = useRef(false);
  const key = shareId ? `share-${shareId}` : `post-${postId}`;

  useEffect(() => {
    if (!postId) return;

    // ✅ Encontra post na store
    const existing = posts.find((p) => {
      const pKey = p.sharedBy?.shareId
        ? `share-${p.sharedBy.shareId}`
        : `post-${p.id}`;
      return pKey === key;
    });

    // ✅ PRIMEIRA RENDERIZAÇÃO: Mostra da store + busca da API
    if (existing && !hasFetchedFromApi.current) {
      setPost(existing);
      setLoading(false);

      // ✅ Busca dados atualizados (só uma vez)
      const fetchUpdatedPost = async () => {
        try {
          console.log('🔄 Buscando dados atualizados da API...');
          const fetchedPost = await fetchPostDetails(postId, shareId);
          if (fetchedPost) {
            setPost(fetchedPost);
            hasFetchedFromApi.current = true; // ✅ Marca que já buscou
          }
        } catch (err) {
          console.error('Erro ao atualizar detalhes do post:', err);
        }
      };

      fetchUpdatedPost();
    }
    // ✅ SE NÃO EXISTE NA STORE: Busca normal
    else if (!existing && !hasFetchedFromApi.current) {
      const fetchPost = async () => {
        setLoading(true);
        setError(null);
        try {
          const fetchedPost = await fetchPostDetails(postId, shareId);
          if (fetchedPost) {
            setPost(fetchedPost);
            hasFetchedFromApi.current = true; // ✅ Marca que já buscou
          } else {
            setError('Post não encontrado');
          }
        } catch (err) {
          console.error('Erro ao carregar detalhes do post:', err);
          setError('Erro ao carregar o post');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
    // ✅ ATUALIZAÇÕES DA STORE (sem loop): Só atualiza se for o mesmo post
    else if (existing && post?.uniqueKey !== existing.uniqueKey) {
      setPost(existing);
    }
  }, [postId, shareId, posts, fetchPostDetails, post?.uniqueKey, key]);

  // ✅ Reset do ref quando o postId/shareId mudar
  useEffect(() => {
    hasFetchedFromApi.current = false;
  }, [postId, shareId]);

  const refetch = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedPost = await fetchPostDetails(postId, shareId);
      if (fetchedPost) {
        setPost(fetchedPost);
        hasFetchedFromApi.current = true;
      } else {
        setError('Post não encontrado');
      }
    } catch (err) {
      console.error('Erro ao recarregar detalhes do post:', err);
      setError('Erro ao recarregar o post');
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error, refetch };
};

import { useEffect, useState } from 'react';
import axios from '../services/api';
import { PostListItem } from '../types/Post';
import { usePostStore } from '../stores/postStore';

export const usePostDetails = (postId: number, shareId?: number) => {
  const { posts, updatePost } = usePostStore();
  const [post, setPost] = useState<PostListItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    // chave única do post (share ou original)
    const key = shareId ? `share-${shareId}` : `post-${postId}`;

    // 1️⃣ tenta buscar na store
    const existing = posts.find((p) => {
      const pKey = p.sharedBy?.shareId
        ? `share-${p.sharedBy.shareId}`
        : `post-${p.id}`;
      return pKey === key;
    });

    if (existing) {
      setPost(existing);
      setLoading(false);
      return;
    }

    // 2️⃣ se não achar, busca na API
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${postId}`, {
          params: shareId ? { shareId } : undefined,
        });
        // dentro de fetchPost, antes de setPost
        const fetchedPost = res.data;

        const normalizedPost: PostListItem = {
          ...fetchedPost,
          // id SEMPRE será o id do post original
          id: fetchedPost.postId ?? fetchedPost.id,
          liked: fetchedPost.liked ?? fetchedPost.likedByUser ?? false,
          likeCount: fetchedPost.likeCount ?? fetchedPost.likesCount ?? 0,
          user: fetchedPost.user ?? fetchedPost.author, // feed usa `user`
          images: Array.isArray(fetchedPost.images)
            ? fetchedPost.images.map((img: any) =>
                typeof img === 'string' ? img : img.url
              )
            : [],

          // se backend mandar só shareId/postId, normaliza
          sharedBy: fetchedPost.sharedBy
            ? {
                ...fetchedPost.sharedBy,
                shareId: fetchedPost.sharedBy.shareId ?? fetchedPost.id, // id do share
                postId:
                  fetchedPost.sharedBy.postId ??
                  fetchedPost.postId ??
                  fetchedPost.id, // id do post original
              }
            : undefined,
        };

        setPost(normalizedPost);
        updatePost(normalizedPost);
      } catch (err) {
        console.error('Erro ao carregar detalhes do post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, shareId, posts, updatePost]);

  return { post, loading };
};

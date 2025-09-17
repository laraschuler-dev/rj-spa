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

    const key = shareId ? `share-${shareId}` : `post-${postId}`;

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

    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/posts/${postId}`, {
          params: shareId ? { shareId } : undefined,
        });

        const fetchedPost = res.data;

        const normalizedPost: PostListItem = {
          ...fetchedPost,
          id: fetchedPost.id,
          liked: fetchedPost.liked ?? fetchedPost.likedByUser ?? false,
          likeCount: fetchedPost.likeCount ?? fetchedPost.likesCount ?? 0,
          user: fetchedPost.user ?? fetchedPost.author,
          images: Array.isArray(fetchedPost.images)
            ? fetchedPost.images.map((img: any) =>
                typeof img === 'string' ? img : img.url
              )
            : [],

          sharedBy: fetchedPost.sharedBy
            ? {
                ...fetchedPost.sharedBy,
                shareId: fetchedPost.sharedBy.shareId, // ← Use o valor original
                postId: fetchedPost.sharedBy.postId, // ← Use o valor original
              }
            : undefined,
        };

        setPost(normalizedPost);
        updatePost(normalizedPost, true);
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

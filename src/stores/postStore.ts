// src/stores/usePostStore.ts
import { create } from 'zustand';
import axios from '../services/api';
import { PostListItem } from '../types/Post';

interface PostStoreState {
  posts: PostListItem[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  fetchPosts: (isInitialLoad?: boolean) => Promise<void>;
  refreshPosts: () => Promise<void>;
  setPosts: (posts: PostListItem[]) => void;
  updatePost: (updatedPost: PostListItem) => void;
  addPost: (newPost: PostListItem) => void;
  removePost: (postId: number, shareId?: number) => void;
  toggleLikePost: (postId: number, shareId?: number, liked?: boolean) => void;

  toggleAttendance: (
    postId: number,
    shareId?: number,
    status?: 'interested' | 'confirmed' | null,
    counts?: { interestedCount: number; confirmedCount: number }
  ) => void;
}

export const usePostStore = create<PostStoreState>((set, get) => ({
  posts: [],
  page: 1,
  hasMore: true,
  loading: false,

  setPosts: (posts) => set({ posts }),

  updatePost: (updatedPost: PostListItem) => {
    set((state) => ({
      posts: state.posts.map((p) => {
        const pKey = p.sharedBy?.shareId
          ? `share-${p.sharedBy.shareId}`
          : `post-${p.id}`;
        const updatedKey = updatedPost.sharedBy?.shareId
          ? `share-${updatedPost.sharedBy.shareId}`
          : `post-${updatedPost.id}`;

        if (pKey === updatedKey) {
          return {
            ...p,
            ...updatedPost,
            images: updatedPost.images ?? p.images,
            createdAt: updatedPost.createdAt ?? p.createdAt,
            sharedBy: updatedPost.sharedBy
              ? {
                  shareId: updatedPost.sharedBy.shareId!, // ✅ garante que não é undefined
                  userId: updatedPost.sharedBy.userId,
                  sharedAt: updatedPost.sharedBy.sharedAt,
                  message: updatedPost.sharedBy.message ?? p.sharedBy?.message,
                }
              : p.sharedBy,
            author: updatedPost.author ?? p.author,
            attendance: updatedPost.attendance ?? p.attendance,
          };
        }

        return p;
      }),
    }));
  },

  addPost: (newPost) => {
    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  removePost: (postId, shareId) => {
    set((state) => ({
      posts: state.posts.filter(
        (p) =>
          !(p.id === postId && !shareId) &&
          !(shareId && p.sharedBy?.shareId === shareId)
      ),
    }));
  },

  toggleLikePost: (postId, shareId, liked) => {
    set((state) => ({
      posts: state.posts.map((p) => {
        const isPost = !shareId && p.id === postId;
        const isShare = shareId && p.sharedBy?.shareId === shareId;
        if (isPost || isShare) {
          return { ...p, liked };
        }
        return p;
      }),
    }));
  },

  toggleAttendance: (postId, shareId, status, counts) => {
    set((state) => ({
      posts: state.posts.map((p) => {
        const isPost = !shareId && p.id === postId;
        const isShare = shareId && p.sharedBy?.shareId === shareId;
        if (isPost || isShare) {
          return {
            ...p,
            attendance: {
              ...p.attendance,
              userStatus: status ?? p.attendance?.userStatus ?? null,
              interestedCount:
                counts?.interestedCount ?? p.attendance?.interestedCount ?? 0,
              confirmedCount:
                counts?.confirmedCount ?? p.attendance?.confirmedCount ?? 0,
            },
          };
        }
        return p;
      }),
    }));
  },

  fetchPosts: async (isInitialLoad = false) => {
    const { page, hasMore, loading } = get();
    if (loading || (!isInitialLoad && !hasMore)) return;

    set({ loading: true });
    try {
      const res = await axios.get('/posts', {
        params: {
          page: isInitialLoad ? 1 : page,
          limit: 10,
        },
      });

      if (!res.data?.posts || res.data.posts.length === 0) {
        set({ hasMore: false });
        return;
      }

      set((state) => {
        if (isInitialLoad) {
          return {
            posts: res.data.posts,
            page: 2,
            hasMore: true,
          };
        }

        const newPosts = res.data.posts.filter(
          (newPost: PostListItem) =>
            !state.posts.some(
              (post) =>
                post.id === newPost.id ||
                (post.sharedBy?.shareId &&
                  post.sharedBy.shareId === newPost.sharedBy?.shareId)
            )
        );

        return {
          posts: [...state.posts, ...newPosts],
          page: state.page + 1,
          hasMore: res.data.posts.length > 0,
        };
      });
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
    } finally {
      set({ loading: false });
    }
  },

  refreshPosts: async () => {
    await get().fetchPosts(true);
  },
}));

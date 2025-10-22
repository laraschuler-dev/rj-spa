import { create } from 'zustand';
import axios from '../services/api';
import { PostListItem } from '../types/Post';
import { PostComment } from '../types/Comment';

interface PostStoreState {
  posts: PostListItem[];
  page: number;
  hasMore: boolean;
  loading: boolean;

  fetchPosts: (isInitialLoad?: boolean) => Promise<void>;
  refreshPosts: () => Promise<void>;

  // 👇 Atualize estas assinaturas
  fetchUserPosts: (
    userId: number,
    requestingUserId: number,
    isInitialLoad?: boolean
  ) => Promise<void>;
  refreshUserPosts: (userId: number, requestingUserId: number) => Promise<void>;

  setPosts: (posts: PostListItem[]) => void;
  updatePost: (updatedPost: PostListItem) => void;
  addPost: (newPost: PostListItem) => void;
  removePost: (postId: number, shareId?: number) => void;
  toggleLikePost: (postId: number, liked: boolean, shareId?: number) => void;
  toggleAttendance: (postId: number, postShareId?: number) => void;

  comments: Record<string, PostComment[]>;
  fetchComments: (postId: number, shareId?: number) => Promise<void>;
  addComment: (postId: number, comment: PostComment, shareId?: number) => void;
  updateComment: (
    postId: number,
    updatedComment: PostComment,
    shareId?: number
  ) => void;
  removeComment: (postId: number, commentId: number, shareId?: number) => void;
}

export const usePostStore = create<PostStoreState>((set, get) => ({
  posts: [],
  page: 1,
  hasMore: true,
  loading: false,

  setPosts: (posts) => set({ posts }),

  updatePost: (updatedPost: PostListItem, addIfNotExists = false) => {
    set((state) => {
      const key = updatedPost.sharedBy?.shareId
        ? `share-${updatedPost.sharedBy.shareId}`
        : `post-${updatedPost.id}`;

      const exists = state.posts.some((p) => {
        const pKey = p.sharedBy?.shareId
          ? `share-${p.sharedBy.shareId}`
          : `post-${p.id}`;
        return pKey === key;
      });

      if (exists) {
        return {
          posts: state.posts.map((p) => {
            const pKey = p.sharedBy?.shareId
              ? `share-${p.sharedBy.shareId}`
              : `post-${p.id}`;
            if (pKey === key) return { ...p, ...updatedPost };
            return p;
          }),
        };
      } else if (addIfNotExists) {
        return { posts: [updatedPost, ...state.posts] };
      } else {
        return {}; // não faz nada
      }
    });
  },

  addPost: (newPost) => {
    set((state) => {
      const exists = state.posts.some(
        (p) =>
          // Se for compartilhamento, compara pelo shareId
          (p.sharedBy?.shareId &&
            p.sharedBy.shareId === newPost.sharedBy?.shareId) ||
          // Se for post original, compara pelo id
          (!p.sharedBy && !newPost.sharedBy && p.id === newPost.id)
      );

      if (exists) {
        return state; // não adiciona duplicado
      }

      return { posts: [newPost, ...state.posts] };
    });
  },

  removePost: (postId: number, shareId?: number) => {
    set((state) => ({
      posts: state.posts.filter((p) =>
        // Se for compartilhamento, remove só o compartilhamento específico
        shareId
          ? p.sharedBy?.shareId !== shareId
          : // Se for post original, remove apenas o post original
            !(p.id === postId && !p.sharedBy)
      ),
    }));
  },

  toggleLikePost: (postId: number, liked: boolean, shareId?: number) => {
    set((state) => {
      const updated = state.posts.map((p) => {
        // Se estamos lidando com um post COMPARTILHADO (tem shareId)
        if (shareId) {
          // Só atualiza se for o MESMO post compartilhado
          const isTargetShare = p.sharedBy?.shareId === shareId;
          return isTargetShare ? { ...p, liked } : p;
        }
        // Se estamos lidando com um post ORIGINAL (sem shareId)
        else {
          // Só atualiza se for o MESMO post original E não for um compartilhamento
          const isTargetOriginal = p.id === postId && !p.sharedBy;
          return isTargetOriginal ? { ...p, liked } : p;
        }
      });

      return { posts: updated };
    });
  },

  toggleAttendance: (postId: number, postShareId?: number) =>
    set((state) => {
      const posts = state.posts.map((p) => {
        // Para posts compartilhados: compara pelo shareId
        if (postShareId) {
          if (p.sharedBy?.shareId === postShareId) {
            return {
              ...p,
              attending: !p.attending,
            };
          }
        }
        // Para posts originais: compara pelo id e garante que não é compartilhamento
        else {
          if (p.id === postId && !p.sharedBy) {
            return {
              ...p,
              attending: !p.attending,
            };
          }
        }
        return p;
      });

      return { posts };
    }),

  comments: {},

  fetchComments: async (postId, shareId) => {
    const key = shareId ? `share-${shareId}` : `post-${postId}`;
    try {
      const params = shareId ? { postShareId: shareId } : undefined;
      const res = await axios.get(`/posts/${postId}/comments`, { params });
      set((state) => ({
        comments: { ...state.comments, [key]: res.data.data },
      }));
    } catch (err) {
      console.error('Erro ao buscar comentários no store:', err);
    }
  },

  addComment: (postId, comment, shareId) => {
    const key = shareId ? `share-${shareId}` : `post-${postId}`;
    set((state) => ({
      comments: {
        ...state.comments,
        [key]: [comment, ...(state.comments[key] || [])],
      },
    }));
  },

  updateComment: (postId, updatedComment, shareId) => {
    const key = shareId ? `share-${shareId}` : `post-${postId}`;
    set((state) => ({
      comments: {
        ...state.comments,
        [key]:
          state.comments[key]?.map((c) =>
            c.id === updatedComment.id ? { ...c, ...updatedComment } : c
          ) || [],
      },
    }));
  },

  removeComment: (postId, commentId, shareId) => {
    const key = shareId ? `share-${shareId}` : `post-${postId}`;
    set((state) => ({
      comments: {
        ...state.comments,
        [key]: state.comments[key]?.filter((c) => c.id !== commentId) || [],
      },
    }));
  },

  fetchPosts: async (isInitialLoad: boolean = false) => {
    const { loading, page } = get();
    console.log('📄 fetchPosts chamado', {
      isInitialLoad,
      currentPage: page,
      loading,
    });
    if (loading) {
      console.log('⏳ Já está carregando, ignorando...');
      return;
    }

    set({ loading: true });

    try {
      const currentPage = isInitialLoad ? 1 : page;
      console.log('fetchPosts -> usando page:', currentPage);

      const res = await axios.get('/posts', {
        params: { page: currentPage, limit: 10 },
      });

      const postsFromApi: PostListItem[] = res.data.posts;
      const pagination = res.data.pagination;

      set((state) => {
        const newPosts = isInitialLoad
          ? postsFromApi
          : [
              ...state.posts,
              ...postsFromApi.filter(
                (p) =>
                  !state.posts.some(
                    (existing) => existing.uniqueKey === p.uniqueKey
                  )
              ),
            ];

        return {
          posts: newPosts,
          page: currentPage + 1,
          hasMore: pagination.hasNextPage,
          loading: false,
        };
      });
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      set({ loading: false });
    }
  },

  refreshPosts: async () => {
    await get().fetchPosts(true);
  },

  // Adicione requestingUserId às funções de user posts
  fetchUserPosts: async (
    userId: number,
    requestingUserId: number,
    isInitialLoad: boolean = false
  ) => {
    const { loading, page } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const currentPage = isInitialLoad ? 1 : page;

      const res = await axios.get(`/users/${userId}/posts`, {
        params: {
          page: currentPage,
          limit: 10,
          requestingUserId,
        },
      });

      const postsFromApi: PostListItem[] = res.data.data || [];
      const pagination = res.data.pagination;

      set((state) => {
        const currentPosts = isInitialLoad ? [] : state.posts || [];

        const newPosts = isInitialLoad
          ? postsFromApi
          : [
              ...currentPosts,
              ...postsFromApi.filter(
                (p) =>
                  !currentPosts.some(
                    (existing) => existing.uniqueKey === p.uniqueKey
                  )
              ),
            ];

        return {
          posts: newPosts,
          page: isInitialLoad ? 2 : currentPage + 1,
          hasMore: pagination?.hasNextPage || false,
          loading: false,
        };
      });
    } catch (err) {
      console.error('❌ Erro ao buscar posts do usuário:', err);
      set({ loading: false });
    }
  },

  refreshUserPosts: async (userId: number, requestingUserId: number) => {
    await get().fetchUserPosts(userId, requestingUserId, true);
  },
}));

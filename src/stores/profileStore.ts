// src/stores/profileStore.ts (ATUALIZADO)
import { create } from 'zustand';

export interface UserData {
  id: number;
  name: string;
  email: string;
  fone?: string;
}

export interface UserProfile {
  profile_type?: string;
  translated_type?: string;
  profile_photo?: string;
  bio?: string;
  city?: string;
  state?: string;
  followStats?: {
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
  };
}

export interface ProfileState {
  user: UserData | null;
  profile: UserProfile | null;
  loading: boolean;

  setProfile: (user: UserData, profile: UserProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  updateFollowStats: (followStats: UserProfile['followStats']) => void;
  // 👇 NOVAS AÇÕES para atualização granular
  incrementFollowers: () => void;
  decrementFollowers: () => void;
  incrementFollowing: () => void;
  decrementFollowing: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,

  setProfile: (user: UserData, profile: UserProfile) =>
    set({
      user: user,
      profile: profile,
    }),

  clearProfile: () => set({ user: null, profile: null }),
  setLoading: (loading: boolean) => set({ loading }),

  updateFollowStats: (followStats) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, followStats } : null,
    })),

  // 👇 CORREÇÃO DAS AÇÕES
  incrementFollowers: () =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            followStats: state.profile.followStats
              ? {
                  ...state.profile.followStats,
                  followersCount:
                    (state.profile.followStats.followersCount || 0) + 1,
                }
              : { followersCount: 1, followingCount: 0 },
          }
        : null,
    })),

  decrementFollowers: () =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            followStats: state.profile.followStats
              ? {
                  ...state.profile.followStats,
                  followersCount: Math.max(
                    0,
                    (state.profile.followStats.followersCount || 1) - 1
                  ),
                }
              : { followersCount: 0, followingCount: 0 },
          }
        : null,
    })),

  // 👇 CORREÇÃO CRÍTICA: estava usando followersCount em vez de followingCount
  incrementFollowing: () =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            followStats: state.profile.followStats
              ? {
                  ...state.profile.followStats,
                  followingCount:
                    (state.profile.followStats.followingCount || 0) + 1, // 👈 CORRIGIDO
                }
              : { followersCount: 0, followingCount: 1 },
          }
        : null,
    })),

  decrementFollowing: () =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            followStats: state.profile.followStats
              ? {
                  ...state.profile.followStats,
                  followingCount: Math.max(
                    0,
                    (state.profile.followStats.followingCount || 1) - 1
                  ),
                }
              : { followersCount: 0, followingCount: 0 },
          }
        : null,
    })),
}));

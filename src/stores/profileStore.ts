// src/stores/profileStore.ts
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
}

export interface ProfileState {
  user: UserData | null;
  profile: UserProfile | null;
  loading: boolean;

  setProfile: (user: UserData, profile: UserProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  profile: null,
  loading: false,

  setProfile: (user: UserData, profile: UserProfile) =>
    set((state) => ({
      user: { ...state.user, ...user },
      profile: { ...state.profile, ...profile },
    })),

  clearProfile: () => set({ user: null, profile: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));

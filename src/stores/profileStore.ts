import { create } from 'zustand';

interface UserData {
  id: number;
  name: string;
  email: string;
  fone?: string;
}

interface UserProfile {
  profile_type?: string;
  translated_type?: string;
  profile_photo?: string;
  bio?: string;
  city?: string;
  state?: string;
}

interface ProfileState {
  user: UserData | null;
  profile: UserProfile | null;
  loading: boolean;

  setProfile(user: UserData, profile: UserProfile): void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  profile: null,
  loading: false,

  setProfile: (user, profile) => set({ user, profile }),
  clearProfile: () => set({ user: null, profile: null }),
  setLoading: (loading) => set({ loading }),
}));

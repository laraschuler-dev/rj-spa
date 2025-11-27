import { create } from 'zustand';

interface ScrollStore {
  targetSection: string | null;
  targetScrollY: number | null;
  setScrollTarget: (section: string | null, scrollY: number | null) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  targetSection: null,
  targetScrollY: null,
  setScrollTarget: (section, scrollY) =>
    set({ targetSection: section, targetScrollY: scrollY }),
}));

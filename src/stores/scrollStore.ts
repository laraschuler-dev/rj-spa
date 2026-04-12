// stores/scrollStore.ts - VERSÃO CORRIGIDA
import { create } from 'zustand';

interface ScrollStore {
  targetSection: string | null;
  targetScrollY: number | null;
  setScrollTarget: (section: string | null, scrollY: number | null) => void;

  // ESTADO PARA NOTIFICAÇÕES
  shouldRestoreNotifications: boolean;
  notificationsRestoreSource: string | null; // Para debug e controle
  markNotificationsForRestore: (source?: string) => void;
  clearNotificationsRestore: () => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  targetSection: null,
  targetScrollY: null,
  setScrollTarget: (section, scrollY) =>
    set({ targetSection: section, targetScrollY: scrollY }),

  // ✅ ESTADO MELHORADO
  shouldRestoreNotifications: false,
  notificationsRestoreSource: null,
  markNotificationsForRestore: (source = 'unknown') =>
    set({
      shouldRestoreNotifications: true,
      notificationsRestoreSource: source,
    }),
  clearNotificationsRestore: () =>
    set({
      shouldRestoreNotifications: false,
      notificationsRestoreSource: null,
    }),
}));

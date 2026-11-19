import { create } from 'zustand';

export interface PwaState {
  isOnline: boolean;
  hasPendingUpdate: boolean;
  toastDismissed: boolean;
  pendingUpdateAction: (() => void) | null;
  setOnline: (isOnline: boolean) => void;
  setPendingUpdate: (applyFn: (() => void) | null) => void;
  applyPendingUpdate: () => void;
  dismissPendingUpdate: () => void;
  initOnlineListeners: () => () => void;
}

function detectNavigatorOnline(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') {
    return true;
  }
  return navigator.onLine;
}

export const usePwaStore = create<PwaState>((set, get) => ({
  isOnline: detectNavigatorOnline(),
  hasPendingUpdate: false,
  toastDismissed: false,
  pendingUpdateAction: null,

  setOnline: (isOnline) => set({ isOnline }),

  setPendingUpdate: (applyFn) =>
    set({
      hasPendingUpdate: Boolean(applyFn),
      toastDismissed: false,
      pendingUpdateAction: applyFn,
    }),

  applyPendingUpdate: () => {
    const action = get().pendingUpdateAction;
    if (action) {
      action();
    }
    set({
      hasPendingUpdate: false,
      toastDismissed: false,
      pendingUpdateAction: null,
    });
  },

  dismissPendingUpdate: () => set({ toastDismissed: true }),

  initOnlineListeners: () => {
    set({ isOnline: detectNavigatorOnline() });
    if (typeof window === 'undefined') {
      return () => {};
    }
    const onOnline = () => set({ isOnline: true });
    const onOffline = () => set({ isOnline: false });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  },
}));

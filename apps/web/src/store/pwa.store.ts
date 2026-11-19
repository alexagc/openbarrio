import { create } from 'zustand';
import {
  computeSavedDossierAgeDays,
  isSavedDossierExpired,
  type PropertyAuditReport,
  type SavedVisitDossier,
  type SavedVisitDossierSummary,
} from '@openbarrio/core';
import { trackAnalyticsEvent } from '../analytics';
import {
  defaultVisitDossierStorage,
  VisitStorageUnavailableError,
  type VisitStorageErrorReason,
} from '../pwa/visit-dossier-store';

export interface ActiveSavedDossierMeta {
  id: string;
  savedAt: string;
  ageDays: number;
  isExpired: boolean;
  isLoadedOffline: boolean;
}

export interface PwaState {
  isOnline: boolean;
  hasPendingUpdate: boolean;
  toastDismissed: boolean;
  pendingUpdateAction: (() => void) | null;
  savedDossiers: SavedVisitDossierSummary[];
  activeSavedDossierMeta: ActiveSavedDossierMeta | null;
  storageError: VisitStorageErrorReason | null;
  setOnline: (isOnline: boolean) => void;
  setPendingUpdate: (applyFn: (() => void) | null) => void;
  applyPendingUpdate: () => void;
  dismissPendingUpdate: () => void;
  hydrateSavedDossiers: () => Promise<void>;
  saveDossierForVisit: (report: PropertyAuditReport) => Promise<SavedVisitDossier | null>;
  openSavedDossier: (refcat: string) => Promise<SavedVisitDossier | null>;
  removeSavedDossier: (refcat: string) => Promise<void>;
  markLoadedOffline: (saved: SavedVisitDossier) => void;
  clearActiveSavedDossierMeta: () => void;
  initOnlineListeners: () => () => void;
  initPwaListeners: () => () => void;
}

function detectNavigatorOnline(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') {
    return true;
  }
  return navigator.onLine;
}

function buildMeta(saved: SavedVisitDossier, isLoadedOffline: boolean): ActiveSavedDossierMeta {
  const ageDays = computeSavedDossierAgeDays(saved.savedAt);
  return {
    id: saved.id,
    savedAt: saved.savedAt,
    ageDays,
    isExpired: isSavedDossierExpired(saved.savedAt),
    isLoadedOffline,
  };
}

export const usePwaStore = create<PwaState>((set, get) => ({
  isOnline: detectNavigatorOnline(),
  hasPendingUpdate: false,
  toastDismissed: false,
  pendingUpdateAction: null,
  savedDossiers: [],
  activeSavedDossierMeta: null,
  storageError: null,

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

  hydrateSavedDossiers: async () => {
    if (!defaultVisitDossierStorage.isSupported()) {
      return;
    }
    try {
      const list = await defaultVisitDossierStorage.listSavedDossiers();
      set({ savedDossiers: list, storageError: null });
    } catch (err) {
      if (err instanceof VisitStorageUnavailableError) {
        set({ savedDossiers: [], storageError: err.reason });
      }
    }
  },

  saveDossierForVisit: async (report) => {
    try {
      const { saved } = await defaultVisitDossierStorage.saveDossierForVisit(report);
      const list = await defaultVisitDossierStorage.listSavedDossiers();
      set({
        savedDossiers: list,
        activeSavedDossierMeta: buildMeta(saved, !get().isOnline),
        storageError: null,
      });
      void trackAnalyticsEvent({ event: 'visit_mode_enabled' });
      return saved;
    } catch (err) {
      const reason: VisitStorageErrorReason =
        err instanceof VisitStorageUnavailableError ? err.reason : 'unavailable';
      set({ storageError: reason });
      return null;
    }
  },

  openSavedDossier: async (refcat) => {
    try {
      const saved = await defaultVisitDossierStorage.getSavedDossier(refcat);
      if (!saved) return null;
      const list = await defaultVisitDossierStorage.listSavedDossiers();
      set({
        savedDossiers: list,
        activeSavedDossierMeta: buildMeta(saved, !get().isOnline),
        storageError: null,
      });
      return saved;
    } catch (err) {
      const reason: VisitStorageErrorReason =
        err instanceof VisitStorageUnavailableError ? err.reason : 'unavailable';
      set({ storageError: reason });
      return null;
    }
  },

  removeSavedDossier: async (refcat) => {
    try {
      await defaultVisitDossierStorage.removeSavedDossier(refcat);
      const list = await defaultVisitDossierStorage.listSavedDossiers();
      const currentMeta = get().activeSavedDossierMeta;
      set({
        savedDossiers: list,
        storageError: null,
        activeSavedDossierMeta:
          currentMeta && currentMeta.id === refcat.replace(/[\s\-_.]/g, '').toUpperCase()
            ? null
            : currentMeta,
      });
    } catch (err) {
      const reason: VisitStorageErrorReason =
        err instanceof VisitStorageUnavailableError ? err.reason : 'unavailable';
      set({ storageError: reason });
    }
  },

  markLoadedOffline: (saved) => {
    set({
      activeSavedDossierMeta: buildMeta(saved, true),
    });
  },

  clearActiveSavedDossierMeta: () => set({ activeSavedDossierMeta: null }),

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

  initPwaListeners: () => {
    const cleanupOnline = get().initOnlineListeners();
    void get().hydrateSavedDossiers();
    return cleanupOnline;
  },
}));

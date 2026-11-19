import { create } from 'zustand';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  formatUtcDay,
  isWithinReturningWindow,
  type AnalyticsConsentState,
} from '@openbarrio/core';

interface PersistedAnalyticsConsent {
  consent: 'accepted';
  visitorId: string;
  firstSeenDay: string;
  lastSeenDay: string;
  returning14dDay?: string;
}

export interface ConsentStoreState {
  consent: AnalyticsConsentState;
  isReturning14d: boolean;
  bannerVisible: boolean;
  hydrated: boolean;
  hydrateConsent: (now?: Date) => void;
  acceptConsent: (now?: Date) => void;
  rejectConsent: () => void;
  withdrawConsent: () => void;
  resetForTests: () => void;
}

function generateRandomVisitorId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readStoredConsent(): PersistedAnalyticsConsent | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedAnalyticsConsent>;
    if (
      parsed &&
      parsed.consent === 'accepted' &&
      typeof parsed.visitorId === 'string' &&
      parsed.visitorId.length > 0 &&
      typeof parsed.firstSeenDay === 'string' &&
      typeof parsed.lastSeenDay === 'string'
    ) {
      return parsed as PersistedAnalyticsConsent;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStoredConsent(record: PersistedAnalyticsConsent): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage quota or private-browsing errors
  }
}

function removeStoredConsent(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) !== null) {
      window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors
  }
}

export const useConsentStore = create<ConsentStoreState>((set) => ({
  consent: 'undecided',
  isReturning14d: false,
  bannerVisible: true,
  hydrated: false,

  hydrateConsent: (now = new Date()) => {
    const stored = readStoredConsent();
    if (!stored) {
      // Never write to localStorage when user has not opted in
      set({
        consent: 'undecided',
        isReturning14d: false,
        bannerVisible: true,
        hydrated: true,
      });
      return;
    }

    const today = formatUtcDay(now);
    let isReturning14d = false;

    if (today === stored.lastSeenDay) {
      isReturning14d = stored.returning14dDay === today;
    } else {
      isReturning14d = isWithinReturningWindow(stored.lastSeenDay, today);
      writeStoredConsent({
        ...stored,
        lastSeenDay: today,
        ...(isReturning14d ? { returning14dDay: today } : { returning14dDay: undefined }),
      });
    }

    set({
      consent: 'accepted',
      isReturning14d,
      bannerVisible: false,
      hydrated: true,
    });
  },

  acceptConsent: (now = new Date()) => {
    const today = formatUtcDay(now);
    const record: PersistedAnalyticsConsent = {
      consent: 'accepted',
      visitorId: generateRandomVisitorId(),
      firstSeenDay: today,
      lastSeenDay: today,
    };
    writeStoredConsent(record);
    set({
      consent: 'accepted',
      isReturning14d: false,
      bannerVisible: false,
      hydrated: true,
    });
  },

  rejectConsent: () => {
    removeStoredConsent();
    set({
      consent: 'rejected',
      isReturning14d: false,
      bannerVisible: false,
      hydrated: true,
    });
  },

  withdrawConsent: () => {
    removeStoredConsent();
    set({
      consent: 'rejected',
      isReturning14d: false,
      bannerVisible: false,
      hydrated: true,
    });
  },

  resetForTests: () => {
    set({
      consent: 'undecided',
      isReturning14d: false,
      bannerVisible: true,
      hydrated: false,
    });
  },
}));

export function useConsent() {
  const consent = useConsentStore((s) => s.consent);
  const isReturning14d = useConsentStore((s) => s.isReturning14d);
  const bannerVisible = useConsentStore((s) => s.bannerVisible);
  const acceptConsent = useConsentStore((s) => s.acceptConsent);
  const rejectConsent = useConsentStore((s) => s.rejectConsent);
  const withdrawConsent = useConsentStore((s) => s.withdrawConsent);
  const hydrateConsent = useConsentStore((s) => s.hydrateConsent);

  return {
    consent,
    isReturning14d,
    bannerVisible,
    acceptConsent,
    rejectConsent,
    withdrawConsent,
    hydrateConsent,
  };
}

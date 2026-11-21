import type { AnalyticsEvent } from '@openbarrio/core';
import { useConsentStore } from './consent.store';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Emits a strictly closed-schema aggregate telemetry event.
 * - Never includes visitorId, cookies, IP, cadastral references, addresses, or coordinates.
 * - Attaches `returning14d: true` ONLY after explicit opt-in consent.
 * - Skips silently when offline or if fetch is unavailable.
 */
export async function trackAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return;
  }
  if (typeof fetch !== 'function') {
    return;
  }

  const { consent, isReturning14d } = useConsentStore.getState();
  const includeReturning = consent === 'accepted' && isReturning14d;

  const payload: AnalyticsEvent =
    event.event === 'lens_used'
      ? {
          event: 'lens_used',
          lens: event.lens,
          ...(includeReturning ? { returning14d: true } : {}),
        }
      : {
          event: event.event,
          ...(includeReturning ? { returning14d: true } : {}),
        };

  try {
    await fetch(`${API_BASE_URL}/api/v1/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    });
  } catch {
    // Non-blocking privacy-first telemetry never interrupts user flow
  }
}

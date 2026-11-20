import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ANALYTICS_CONSENT_STORAGE_KEY } from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import { ConsentBanner } from '../src/components/common/ConsentBanner';
import {
  trackAnalyticsEvent,
  useConsentStore,
} from '../src/analytics';
import { useWorkspaceStore } from '../src/store/workspace.store';

describe('Privacy-First Analytics Consent & Telemetry Client', () => {
  beforeEach(() => {
    localStorage.clear();
    useConsentStore.getState().resetForTests();
    useWorkspaceStore.setState({ isEmbed: false, viewMode: 'landing' });
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes ZERO keys to localStorage on initial undecided hydration or explicit Reject, and omits returning14d', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    useConsentStore.getState().hydrateConsent(new Date('2026-11-19T10:00:00.000Z'));

    render(
      <LanguageProvider initialLanguage="es">
        <ConsentBanner />
      </LanguageProvider>
    );

    const region = screen.getByRole('region');
    expect(region).toBeTruthy();

    const rejectBtn = screen.getByTestId('consent-reject-btn');
    const acceptBtn = screen.getByTestId('consent-accept-btn');
    // Equal visual prominence (same button sizing & border classes, no dark patterns)
    expect(rejectBtn.className).toBe(acceptBtn.className);

    fireEvent.click(rejectBtn);

    expect(screen.queryByTestId('consent-banner')).toBeNull();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBeNull();

    await trackAnalyticsEvent({ event: 'dossier_generated' });
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(String(url)).toContain('/api/v1/telemetry');
    expect(init?.credentials).toBe('omit');
    const parsedBody = JSON.parse(String(init?.body));
    expect(parsedBody).toEqual({ event: 'dossier_generated' });
    expect(parsedBody.returning14d).toBeUndefined();
    expect(parsedBody.visitorId).toBeUndefined();
  });

  it('stores local random ID only after Accept, detects 14-day returning visits without sending visitorId, and removes ID on withdraw', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    render(
      <LanguageProvider initialLanguage="en">
        <ConsentBanner />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('consent-accept-btn'));

    const storedRaw = localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    expect(storedRaw).toBeTruthy();
    const stored = JSON.parse(storedRaw!);
    expect(stored.consent).toBe('accepted');
    expect(typeof stored.visitorId).toBe('string');
    expect(stored.visitorId.length).toBeGreaterThan(8);

    // Same-day event: not a returning visit yet
    await trackAnalyticsEvent({ event: 'lens_used', lens: 'layer' });
    expect(JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body))).toEqual({
      event: 'lens_used',
      lens: 'layer',
    });

    // Simulate user returning 5 days later
    const day5 = new Date(Date.now() + 5 * 86_400_000);
    act(() => {
      useConsentStore.getState().hydrateConsent(day5);
    });
    expect(useConsentStore.getState().isReturning14d).toBe(true);

    await trackAnalyticsEvent({ event: 'dossier_generated' });
    const returningPayload = JSON.parse(String(fetchSpy.mock.calls[1]?.[1]?.body));
    expect(returningPayload).toEqual({
      event: 'dossier_generated',
      returning14d: true,
    });
    expect(returningPayload.visitorId).toBeUndefined();

    // Simulate user returning 20 days after day5 (outside 14-day window)
    const day25 = new Date(day5.getTime() + 20 * 86_400_000);
    act(() => {
      useConsentStore.getState().hydrateConsent(day25);
    });
    expect(useConsentStore.getState().isReturning14d).toBe(false);

    // Withdraw consent immediately clears localStorage
    act(() => {
      useConsentStore.getState().withdrawConsent();
    });
    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBeNull();
    expect(useConsentStore.getState().consent).toBe('rejected');
    expect(useConsentStore.getState().isReturning14d).toBe(false);
  });

  it('performs zero fetch calls when offline', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: false,
    });

    await trackAnalyticsEvent({ event: 'visit_mode_enabled' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

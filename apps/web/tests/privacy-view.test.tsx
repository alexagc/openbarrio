import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_EVENTS,
  ANALYTICS_LENS_VALUES,
  ANALYTICS_RETENTION_MONTHS,
} from '@openbarrio/core';
import { LanguageProvider } from '../src/i18n';
import { PrivacyView } from '../src/views/PrivacyView';
import { Footer } from '../src/components/landing/Footer';
import { useConsentStore } from '../src/analytics';
import { useWorkspaceStore } from '../src/store/workspace.store';
import {
  getHreflangAlternates,
  getLocalizedPath,
  parseLocalizedRoute,
} from '../src/utils/seo-routes';

describe('PrivacyView (/privacidad) & Localized Routes', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('openbarrio_lang', 'es');
    useConsentStore.getState().resetForTests();
    useWorkspaceStore.setState({ viewMode: 'landing' });
  });

  it('renders every closed event from ANALYTICS_EVENTS, lens enum values, and 13-month retention', () => {
    render(
      <LanguageProvider initialLanguage="es">
        <PrivacyView />
      </LanguageProvider>
    );

    const eventsTable = screen.getByTestId('privacy-events-table');
    for (const eventName of ANALYTICS_EVENTS) {
      expect(eventsTable.textContent).toContain(eventName);
    }
    for (const lens of ANALYTICS_LENS_VALUES) {
      expect(eventsTable.textContent).toContain(lens);
    }

    expect(document.body.textContent).toContain(String(ANALYTICS_RETENTION_MONTHS));
    expect(screen.getByRole('region', { name: /eventos/i }).getAttribute('tabindex')).toBe('0');
  });

  it('allows immediate opt-out / withdrawal deleting localStorage visitor key', () => {
    useConsentStore.getState().acceptConsent(new Date('2026-11-19T12:00:00.000Z'));
    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBeTruthy();

    render(
      <LanguageProvider initialLanguage="es">
        <PrivacyView />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('privacy-withdraw-btn'));

    expect(localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBeNull();
    expect(useConsentStore.getState().consent).toBe('rejected');
    expect(screen.getByTestId('privacy-withdrawn-notice')).toBeTruthy();
  });

  it('links directly from Footer to the privacy view', () => {
    render(
      <LanguageProvider initialLanguage="es">
        <Footer />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByTestId('footer-privacy-link'));
    expect(useWorkspaceStore.getState().viewMode).toBe('privacy');
  });

  it('resolves all 5 localized slugs and hreflang alternates for privacy', () => {
    expect(parseLocalizedRoute('/privacidad')).toMatchObject({ viewMode: 'privacy', lang: 'es' });
    expect(parseLocalizedRoute('/privacy')).toMatchObject({ viewMode: 'privacy', lang: 'en' });
    expect(parseLocalizedRoute('/privacitat')).toMatchObject({ viewMode: 'privacy', lang: 'ca' });
    expect(parseLocalizedRoute('/privacidade')).toMatchObject({ viewMode: 'privacy', lang: 'gl' });
    expect(parseLocalizedRoute('/pribatutasuna')).toMatchObject({ viewMode: 'privacy', lang: 'eu' });

    expect(getLocalizedPath('privacy', 'es')).toBe('/privacidad');
    expect(getLocalizedPath('privacy', 'en')).toBe('/privacy');
    expect(getLocalizedPath('privacy', 'ca')).toBe('/privacitat');
    expect(getLocalizedPath('privacy', 'gl')).toBe('/privacidade');
    expect(getLocalizedPath('privacy', 'eu')).toBe('/pribatutasuna');

    const alternates = getHreflangAlternates('privacy');
    expect(alternates.map((a) => a.lang)).toEqual(['es', 'en', 'ca', 'gl', 'eu', 'x-default']);
  });
});

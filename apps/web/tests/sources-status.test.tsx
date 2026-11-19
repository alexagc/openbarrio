import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { LanguageProvider } from '../src/i18n';
import { SourcesStatusView } from '../src/views/SourcesStatusView';
import { apiClient } from '../src/services/api.client';
import { parseLocalizedRoute, getLocalizedPath, getHreflangAlternates } from '../src/utils/seo-routes';
import type { SourcesStatusResponse } from '@openbarrio/core';

const MOCK_STATUS_RESPONSE: SourcesStatusResponse = {
  generatedAt: '2026-11-19T12:00:00.000Z',
  overallStatus: 'degraded',
  sources: [
    {
      key: 'catastro',
      sourceName: 'Sede Electrónica del Catastro (OVC)',
      status: 'operational',
      circuitState: 'closed',
      recentFailures: 0,
      lastVerifiedAt: '2026-11-19T11:55:00.000Z',
      sourceDate: '2026-11-19',
    },
    {
      key: 'sica',
      sourceName: 'MITECO SICA Mapas Estratégicos de Ruido',
      status: 'outage',
      circuitState: 'open',
      recentFailures: 5,
      lastVerifiedAt: '2026-11-18T09:00:00.000Z',
      sourceDate: '2024-06-01',
    },
  ],
};

function renderStatusView() {
  return render(
    <LanguageProvider>
      <SourcesStatusView />
    </LanguageProvider>
  );
}

describe('SourcesStatusView (/estado-fuentes)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.setItem('openbarrio_lang', 'es');
  });

  it('renders live operational and degraded/open-circuit provider rows with accessible table markup', async () => {
    vi.spyOn(apiClient, 'getSourcesStatus').mockResolvedValueOnce(MOCK_STATUS_RESPONSE);

    renderStatusView();

    await waitFor(() => {
      expect(screen.getByText('Sede Electrónica del Catastro (OVC)')).toBeTruthy();
    });

    expect(screen.getByText('MITECO SICA Mapas Estratégicos de Ruido')).toBeTruthy();
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');

    // Column headers & row headers
    const table = screen.getByRole('table');
    expect(table.querySelectorAll('thead th[scope="col"]').length).toBe(6);
    expect(table.querySelectorAll('tbody th[scope="row"]').length).toBe(2);
    expect(screen.getByText('Abierto')).toBeTruthy();
    expect(screen.getByText('2024-06-01')).toBeTruthy();
  });

  it('shows honest error alert when API fails and never fabricates healthy operational status', async () => {
    vi.spyOn(apiClient, 'getSourcesStatus').mockRejectedValueOnce(new Error('Upstream status unavailable'));

    renderStatusView();

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Upstream status unavailable');
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('refreshes status when user clicks the refresh button', async () => {
    const spy = vi
      .spyOn(apiClient, 'getSourcesStatus')
      .mockResolvedValueOnce(MOCK_STATUS_RESPONSE)
      .mockResolvedValueOnce({
        ...MOCK_STATUS_RESPONSE,
        overallStatus: 'operational',
        sources: [MOCK_STATUS_RESPONSE.sources[0]!],
      });

    renderStatusView();

    await waitFor(() => {
      expect(screen.getByText('MITECO SICA Mapas Estratégicos de Ruido')).toBeTruthy();
    });

    const refreshBtn = screen.getByRole('button', { name: /Actualizar/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
      expect(screen.queryByText('MITECO SICA Mapas Estratégicos de Ruido')).toBeNull();
    });
  });

  it('resolves all 5 localized slugs and hreflang alternates for sources-status', () => {
    expect(parseLocalizedRoute('/estado-fuentes')).toMatchObject({ viewMode: 'sources-status', lang: 'es' });
    expect(parseLocalizedRoute('/sources-status')).toMatchObject({ viewMode: 'sources-status', lang: 'en' });
    expect(parseLocalizedRoute('/estat-fonts')).toMatchObject({ viewMode: 'sources-status', lang: 'ca' });
    expect(parseLocalizedRoute('/estado-fontes')).toMatchObject({ viewMode: 'sources-status', lang: 'gl' });
    expect(parseLocalizedRoute('/iturrien-egoera')).toMatchObject({ viewMode: 'sources-status', lang: 'eu' });

    expect(getLocalizedPath('sources-status', 'eu')).toBe('/iturrien-egoera');

    const alternates = getHreflangAlternates('sources-status');
    expect(alternates.map((a) => a.lang)).toEqual(['es', 'en', 'ca', 'gl', 'eu', 'x-default']);
  });
});

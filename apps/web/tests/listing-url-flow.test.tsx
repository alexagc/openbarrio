import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../src/i18n';
import { HeroSection } from '../src/components/landing/HeroSection';
import { ApiError, apiClient } from '../src/services/api.client';

describe('Paste Listing URL Flow in HeroSection', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.setItem('openbarrio_lang', 'es');
  });

  it('switches to listing URL mode, resolves pasted listing metadata, lets user edit and launch audit', async () => {
    const onAudit = vi.fn();
    const resolveSpy = vi.spyOn(apiClient, 'resolveListingUrl').mockResolvedValueOnce({
      portal: 'idealista',
      sanitizedUrl: 'https://www.idealista.com/inmueble/104567890',
      extracted: {
        listingId: '104567890',
        cadastralReference: '9872023VH5797S0001WX',
        address: 'Calle Santa Engracia 45, Madrid',
        surfaceM2: 110,
      },
      confidence: 'high',
      extractionMethod: 'url_and_pasted_text',
      auditHint: '/api/v1/audit/refcat/9872023VH5797S0001WX',
      legalNotice: 'Zero fetch.',
    });

    render(
      <LanguageProvider>
        <HeroSection onAudit={onAudit} />
      </LanguageProvider>
    );

    // Switch to URL tab
    const urlTab = screen.getByRole('tab', { name: /Desde URL de anuncio/i });
    fireEvent.click(urlTab);

    const urlInput = screen.getByLabelText(/URL del anuncio inmobiliario/i);
    fireEvent.change(urlInput, {
      target: { value: 'https://www.idealista.com/inmueble/104567890/?utm_source=x' },
    });

    // Open optional pasted snippet textarea
    fireEvent.click(screen.getByRole('button', { name: /Opcional: pegar texto/i }));
    const rawArea = screen.getByLabelText(/Texto o especificaciones copiadas por ti/i);
    fireEvent.change(rawArea, { target: { value: 'Ref 9872023VH5797S0001WX 110 m2' } });

    fireEvent.click(screen.getByRole('button', { name: /Analizar enlace/i }));

    await waitFor(() => {
      expect(screen.getByTestId('listing-confirm-panel')).toBeTruthy();
    });

    expect(resolveSpy).toHaveBeenCalledWith(
      'https://www.idealista.com/inmueble/104567890/?utm_source=x',
      'Ref 9872023VH5797S0001WX 110 m2'
    );

    const refInput = screen.getByLabelText(/Referencia Catastral/i) as HTMLInputElement;
    expect(refInput.value).toBe('9872023VH5797S0001WX');

    fireEvent.click(screen.getByRole('button', { name: /Lanzar Auditoría Oficial/i }));
    expect(onAudit).toHaveBeenCalledWith('9872023VH5797S0001WX', 'refcat');
  });

  it('announces errors accessibly via role="alert", aria-invalid, and supports manual search fallback', async () => {
    const onAudit = vi.fn();
    vi.spyOn(apiClient, 'resolveListingUrl').mockRejectedValueOnce(
      new ApiError(422, 'Unsupported host', {
        type: 'https://openbarrio.org/errors/listing-host-unsupported',
        title: 'Unsupported host',
        status: 422,
        detail: 'Host unsupported',
      })
    );

    render(
      <LanguageProvider>
        <HeroSection onAudit={onAudit} />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('tab', { name: /Desde URL de anuncio/i }));

    const urlInput = screen.getByLabelText(/URL del anuncio inmobiliario/i) as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'https://evil-portal.example/123' } });
    fireEvent.click(screen.getByRole('button', { name: /Analizar enlace/i }));

    const alert = await screen.findByRole('alert');
    expect(alert.getAttribute('aria-live')).toBe('assertive');
    expect(urlInput.getAttribute('aria-invalid')).toBe('true');
    expect(urlInput.getAttribute('aria-describedby')).toBe('listing-url-error');
    expect(document.activeElement).toBe(urlInput);

    // Switch back cleanly to standard search mode via manual search tab
    fireEvent.click(screen.getByRole('tab', { name: /Dirección o Ref\. Catastral/i }));
    expect(document.getElementById('cadastral-search-input')).toBeTruthy();
  });
});

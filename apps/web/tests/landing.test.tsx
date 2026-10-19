import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { App } from '../src/App';
import { LanguageProvider, useTranslation } from '../src/i18n';

// Polyfill URL.createObjectURL for JSDOM environment
if (typeof window !== 'undefined') {
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:mock-url';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}

vi.mock('../src/components/MapView', () => ({
  MapView: () => <div data-testid="mock-mapview" />,
}));

vi.mock('../src/services/api.client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/services/api.client')>();
  return {
    ...actual,
    apiClient: {
      ...actual.apiClient,
      searchAddress: vi.fn().mockImplementation((query: string) => {
        if (query.toLowerCase().includes('gràcia') || query.toLowerCase().includes('gracia') || query.toLowerCase().includes('barcelona')) {
          return Promise.resolve([
            {
              label: "Passeig de Gràcia 43, 08007 Barcelona (L'Eixample)",
              lat: 41.39170,
              lon: 2.16495,
              refcat: '0227802DF3802E',
            },
          ]);
        }
        return Promise.resolve([]);
      }),
      auditByCoordinates: vi.fn().mockImplementation((lat: number, lon: number) => {
        return Promise.resolve(
          actual.auditDataToReport({
            query: 'Passeig de Gràcia 43, Barcelona',
            refcat: '0227802DF3802E',
            address: "Passeig de Gràcia 43, 08007 Barcelona (L'Eixample)",
            score: 82,
            yearBuilt: 1904,
            surfaceM2: 88,
            coordinates: { lat, lon },
          })
        );
      }),
      auditByCadastralReference: vi.fn().mockImplementation((refcat: string) => {
        return Promise.resolve(
          actual.auditDataToReport({
            query: 'Passeig de Gràcia 43, Barcelona',
            refcat: refcat || '0227802DF3802E',
            address: "Passeig de Gràcia 43, 08007 Barcelona (L'Eixample)",
            score: 82,
            yearBuilt: 1904,
            surfaceM2: 88,
          })
        );
      }),
      generateDeterministicAudit: vi.fn().mockImplementation((lat: number, lon: number, overrides?: any) => {
        return actual.apiClient.generateDeterministicAudit(lat, lon, overrides);
      }),
      generateDeterministicAuditFromRefcat: vi.fn().mockImplementation((refcat: string) => {
        return actual.apiClient.generateDeterministicAuditFromRefcat(refcat);
      }),
    },
  };
});

// Test component to verify useTranslation hook behavior
const TranslationConsumer = () => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-title">{t('hero.title')}</span>
      <span data-testid="interpolated">{t('footer.copyright', { year: 2026 })}</span>
      <span data-testid="fallback">{t('non.existent.key')}</span>
      <button onClick={() => setLanguage('en')} data-testid="btn-en">
        Set EN
      </button>
      <button onClick={() => setLanguage('ca')} data-testid="btn-ca">
        Set CA
      </button>
      <button onClick={() => setLanguage('es')} data-testid="btn-es">
        Set ES
      </button>
      <div data-testid="langs-count">{availableLanguages.length}</div>
    </div>
  );
};

describe('Landing Page & i18n Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('LanguageProvider & useTranslation Hook', () => {
    it('should provide default language (es) and allow dynamic switching', () => {
      render(
        <LanguageProvider initialLanguage="es">
          <TranslationConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId('current-lang').textContent).toBe('es');
      expect(screen.getByTestId('translated-title').textContent).toContain('Auditoría Inmobiliaria y Vecinal');
      expect(screen.getByTestId('interpolated').textContent).toContain('© 2026 OpenBarrio');
      expect(screen.getByTestId('fallback').textContent).toBe('non.existent.key');

      // Switch to English
      act(() => {
        fireEvent.click(screen.getByTestId('btn-en'));
      });
      expect(screen.getByTestId('current-lang').textContent).toBe('en');
      expect(screen.getByTestId('translated-title').textContent).toContain('Civic Real Estate & Neighborhood Due Diligence');

      // Switch to Catalan
      act(() => {
        fireEvent.click(screen.getByTestId('btn-ca'));
      });
      expect(screen.getByTestId('current-lang').textContent).toBe('ca');
      expect(screen.getByTestId('translated-title').textContent).toContain('Auditoria Immobiliària i Veïnal');
    });

    it('should persist selected language in localStorage', () => {
      render(
        <LanguageProvider initialLanguage="es">
          <TranslationConsumer />
        </LanguageProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId('btn-en'));
      });

      expect(localStorage.getItem('openbarrio_lang')).toBe('en');
    });
  });

  describe('Full Landing Page Layout (Stitch Civic Precision)', () => {
    it('should render all 7 core sections of the Civic Precision Landing Page', () => {
      render(<App />);

      // 1. Header
      expect(screen.getAllByText('OpenBarrio').length).toBeGreaterThan(0);
      expect(screen.getByText('Civic Tech España')).toBeTruthy();
      expect(screen.getByText('ES')).toBeTruthy();
      expect(screen.getByText('EN')).toBeTruthy();
      expect(screen.getByText('CA')).toBeTruthy();

      // 2. Hero Section
      expect(screen.getByText(/100% Datos Públicos Oficiales Verificables/i)).toBeTruthy();
      expect(screen.getByText(/Auditoría Inmobiliaria y Vecinal con Datos Oficiales de España/i)).toBeTruthy();
      expect(screen.getByPlaceholderText(/Introduce dirección completa/i)).toBeTruthy();
      expect(screen.getByText(/Auditar Inmueble/i)).toBeTruthy();
      expect(screen.getByText('Gran Vía 28, Madrid')).toBeTruthy();
      expect(screen.getByText('Passeig de Gràcia 43, Barcelona')).toBeTruthy();

      // 3. Four-Pillar Grid
      expect(screen.getByText(/AUDITORÍA INTEGRAL MULTIFUENTE/i)).toBeTruthy();
      expect(screen.getByText(/1\. Catastro Inmobiliario/i)).toBeTruthy();
      expect(screen.getByText(/2\. Renta & Demografía INE/i)).toBeTruthy();
      expect(screen.getByText(/3\. Ruido Acústico & Riesgo Fluvial/i)).toBeTruthy();
      expect(screen.getByText(/4\. Regulación del Alquiler \(SERPAVI\)/i)).toBeTruthy();

      // 4. Extension Showcase
      expect(screen.getByText(/EXTENSIÓN DE NAVEGADOR MANIFEST V3/i)).toBeTruthy();
      expect(screen.getByText(/Auditoría instantánea directamente sobre Idealista y Fotocasa/i)).toBeTruthy();
      expect(screen.getByText(/Instalar Extensión Chrome/i)).toBeTruthy();
      expect(screen.getByText(/OpenBarrio Telemetría/i)).toBeTruthy();
      expect(screen.getByText(/82\/100/i)).toBeTruthy();

      // 5. Civic Principles
      expect(screen.getByText(/COMPROMISO CIUDADANO INDEPENDIENTE/i)).toBeTruthy();
      expect(screen.getByText(/Transparencia Radical por Principio/i)).toBeTruthy();
      expect(screen.getByText(/0% Publicidad Inmobiliaria/i)).toBeTruthy();
      expect(screen.getByText(/Sin Rastreo Ni Venta de Datos/i)).toBeTruthy();
      expect(screen.getByText(/Arquitectura Open Data/i)).toBeTruthy();

      // 6. Map CTA Section
      expect(screen.getByText(/Acceso Directo al Visor GIS/i)).toBeTruthy();
      expect(screen.getByText(/Lanzar Visor GIS Completo/i)).toBeTruthy();

      // 7. Footer
      expect(screen.getByText(/Iniciativa Aporta/i)).toBeTruthy();
      expect(screen.getByText(/datos.gob.es/i)).toBeTruthy();
      expect(screen.getByText(/ETRS89 \/ UTM Zone 30N/i)).toBeTruthy();
    });

    it('should switch all landing page content to English when clicking EN pill', () => {
      render(<App />);

      const enButton = screen.getByRole('button', { name: 'EN' });
      act(() => {
        fireEvent.click(enButton);
      });

      // Verify header updated
      expect(screen.getByText('Spain Civic Tech')).toBeTruthy();

      // Verify hero updated
      expect(
        screen.getByText(/Civic Real Estate & Neighborhood Due Diligence with Official Spanish Data/i)
      ).toBeTruthy();
      expect(screen.getByText(/Audit Property/i)).toBeTruthy();

      // Verify pillars updated
      expect(screen.getByText(/MULTI-SOURCE INTEGRAL AUDIT/i)).toBeTruthy();
      expect(screen.getByText(/1\. National Cadastre/i)).toBeTruthy();
      expect(screen.getByText(/2\. INE Income & Demographics/i)).toBeTruthy();
      expect(screen.getByText(/3\. Acoustic Noise & Flood Safety/i)).toBeTruthy();
      expect(screen.getByText(/4\. Statutory Rental Benchmark \(SERPAVI\)/i)).toBeTruthy();

      // Verify extension updated
      expect(screen.getByText(/Install Chrome Extension/i)).toBeTruthy();
      expect(screen.getByText(/OpenBarrio Telemetry/i)).toBeTruthy();
    });

    it('should open and close the AuditModal when an example chip is clicked', async () => {
      render(<App />);

      // Modal should not be open initially
      expect(screen.queryByRole('dialog')).toBeNull();

      // Click on Barcelona example
      const barcelonaChip = screen.getByText('Passeig de Gràcia 43, Barcelona');
      act(() => {
        fireEvent.click(barcelonaChip);
      });

      // Modal should now be open
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeTruthy();

      // Wait for live report hydration
      await waitFor(() => {
        expect(screen.getByText(/Passeig de Gràcia 43, 08007 Barcelona/i)).toBeTruthy();
      });
      expect(screen.getAllByText(/Ref: 0227802DF3802E/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/82\/100/).length).toBeGreaterThan(0);
      expect(screen.getByText(/SÍ \(Topes legales aplicables\)/i)).toBeTruthy();

      // Close modal
      const closeButtons = screen.getAllByRole('button', { name: /Cerrar/i });
      act(() => {
        fireEvent.click(closeButtons[0]);
      });

      // Modal should be gone
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('should handle search input submission and show audit fallback for custom query', () => {
      render(<App />);

      const searchInput = screen.getByPlaceholderText(/Introduce dirección completa/i);
      act(() => {
        fireEvent.change(searchInput, { target: { value: 'Calle Alcalá 50, Madrid' } });
      });

      const auditButton = screen.getByRole('button', { name: /Auditar Inmueble/i });
      act(() => {
        fireEvent.click(auditButton);
      });

      // Modal opens with custom query
      expect(screen.getByRole('dialog')).toBeTruthy();
      expect(screen.getByText(/Calle Alcalá 50, Madrid/i)).toBeTruthy();
    });

    it('should transition to map view showing the exact audited property when clicking openInMap in modal', async () => {
      render(<App />);

      // Click on Barcelona example
      const barcelonaChip = screen.getByText('Passeig de Gràcia 43, Barcelona');
      act(() => {
        fireEvent.click(barcelonaChip);
      });

      // Wait for modal live report to be loaded so the button is enabled
      await waitFor(() => {
        expect(screen.getByText(/Passeig de Gràcia 43, 08007 Barcelona/i)).toBeTruthy();
      });

      // Click "Localizar en Visor Cartográfico" button in modal
      const openInMapButton = screen.getByRole('button', { name: /Localizar en Visor Cartográfico/i });
      act(() => {
        fireEvent.click(openInMapButton);
      });

      // Modal should be closed
      expect(screen.queryByRole('dialog')).toBeNull();

      // Map view should be active
      expect(screen.getByText(/Visor Cartográfico Catastral & Auditoría Territorial/i)).toBeTruthy();

      // The report displayed should be Barcelona, NOT default Gran Vía Madrid
      await waitFor(() => {
        expect(screen.getAllByText(/Passeig de Gràcia 43/i).length).toBeGreaterThan(0);
      });
      expect(screen.getAllByText(/0227802DF3802E/i).length).toBeGreaterThan(0);
    });
  });
});

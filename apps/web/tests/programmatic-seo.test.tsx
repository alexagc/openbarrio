import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import { MunicipalityView } from '../src/views/municipality/MunicipalityView';
import { MunicipalitiesDirectoryView } from '../src/views/municipality/MunicipalitiesDirectoryView';
import { ChromeExtensionBanner } from '../src/components/common/ChromeExtensionBanner';
import { apiClient } from '../src/services/api.client';
import { LanguageProvider } from '../src/i18n';

function renderWithProviders(ui: ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('Phase 21: Programmatic SEO & Extension CTA', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('MunicipalityView (/municipio/:slug)', () => {
    it('renders municipality civic intelligence and metrics', async () => {
      vi.spyOn(apiClient, 'getMunicipality').mockResolvedValueOnce({
        code: '28079',
        name: 'Madrid',
        slug: 'madrid',
        provinceCode: '28',
        provinceName: 'Madrid',
        autonomousCommunity: 'Comunidad de Madrid',
        averageHouseholdIncomeEur: 44250,
        medianHouseholdIncomeEur: 39500,
        averagePersonIncomeEur: 19800,
        percentileNational: 88,
        isStressedMarket: false,
        serpaviMedianEurM2: 14.8,
        serpaviRangeEurM2: { lower: 12.2, upper: 18.5 },
        radonZone: 'Zona I',
        totalCensusSections: 2420,
        medianAge: 44.1,
        singlePersonHouseholdPct: 32.5,
        estimatedBarrioScore: 84,
        sampleProperties: [],
        itpGeneralRatePct: 6.0,
        updatedAt: '2026-11-12T00:00:00Z',
      });

      renderWithProviders(<MunicipalityView slug="madrid" />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 1, name: 'Madrid' })).toBeTruthy();
      });

      expect(screen.getByText(/BarrioScore Estimado/i)).toBeTruthy();
      expect(screen.getByText('84')).toBeTruthy();
      expect(screen.getByText(/44\.250 €/i)).toBeTruthy();
      expect(screen.getByText(/Zona I/i)).toBeTruthy();
      expect(screen.getByText(/Mercado Ordinario/i)).toBeTruthy();
      expect(screen.getByText(/Herramientas de Auditoría para Madrid/i)).toBeTruthy();
    });
  });

  describe('MunicipalitiesDirectoryView (/municipios)', () => {
    it('renders list of municipalities and filters by search query', async () => {
      vi.spyOn(apiClient, 'getMunicipalities').mockResolvedValueOnce({
        items: [
          {
            code: '28079',
            name: 'Madrid',
            slug: 'madrid',
            provinceCode: '28',
            provinceName: 'Madrid',
            autonomousCommunity: 'Comunidad de Madrid',
            averageHouseholdIncomeEur: 44250,
            percentileNational: 88,
            isStressedMarket: false,
            radonZone: 'Zona I',
            totalCensusSections: 2420,
            estimatedBarrioScore: 84,
          },
          {
            code: '08019',
            name: 'Barcelona',
            slug: 'barcelona',
            provinceCode: '08',
            provinceName: 'Barcelona',
            autonomousCommunity: 'Cataluña',
            averageHouseholdIncomeEur: 42100,
            percentileNational: 86,
            isStressedMarket: true,
            radonZone: 'Zona 0',
            totalCensusSections: 1068,
            estimatedBarrioScore: 86,
          },
        ],
        total: 2,
        page: 1,
        limit: 100,
      });

      renderWithProviders(<MunicipalitiesDirectoryView />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 3, name: 'Madrid' })).toBeTruthy();
        expect(screen.getByRole('heading', { level: 3, name: 'Barcelona' })).toBeTruthy();
      });

      const searchInput = screen.getByPlaceholderText(/Buscar por nombre de municipio/i);
      fireEvent.change(searchInput, { target: { value: 'Barce' } });

      expect(screen.queryByRole('heading', { level: 3, name: 'Madrid' })).toBeNull();
      expect(screen.getByRole('heading', { level: 3, name: 'Barcelona' })).toBeTruthy();
    });
  });

  describe('ChromeExtensionBanner', () => {
    it('renders in-content banner with CTA to Chrome Web Store', () => {
      renderWithProviders(
        <ChromeExtensionBanner
          variant="in-content"
          contextText="Audita Idealista gratis"
        />
      );

      expect(screen.getByText('Audita Idealista gratis')).toBeTruthy();
      expect(screen.getByText(/Extensión Chrome Gratuita/i)).toBeTruthy();
    });

    it('renders sticky banner and allows dismissal', () => {
      renderWithProviders(
        <ChromeExtensionBanner
          variant="sticky"
          contextText="Notificación flotante"
        />
      );

      expect(screen.getByText('Notificación flotante')).toBeTruthy();

      const closeBtn = screen.getByLabelText(/Cerrar aviso/i);
      fireEvent.click(closeBtn);

      expect(screen.queryByText('Notificación flotante')).toBeNull();
    });
  });
});

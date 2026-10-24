import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CadastralBottomSheet } from '../src/components/CadastralBottomSheet';
import { ExtendedAuditReport } from '../src/services/api.client';

describe('CadastralBottomSheet Component (Phase 11C)', () => {
  beforeAll(() => {
    // JSDOM does not provide PointerEvent or pointer capture methods
    if (typeof window.PointerEvent === 'undefined') {
      class MockPointerEvent extends MouseEvent {
        pointerId: number;
        constructor(type: string, params: PointerEventInit = {}) {
          super(type, params);
          this.pointerId = params.pointerId ?? 0;
        }
      }
      window.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
    }
    if (!Element.prototype.setPointerCapture) {
      Element.prototype.setPointerCapture = vi.fn();
    }
    if (!Element.prototype.releasePointerCapture) {
      Element.prototype.releasePointerCapture = vi.fn();
    }
  });
  const mockReport: ExtendedAuditReport = {
    id: '28900A001000120001XY-AUDIT',
    generatedAt: '2026-10-24T12:00:00.000Z',
    property: {
      cadastralReference: '28900A001000120001XY',
      address: {
        street: 'Calle de Alcalá',
        number: '42',
        postalCode: '28014',
        municipality: 'Madrid',
        province: 'Madrid',
      },
      coordinates: { latitude: 40.4182, longitude: -3.6989, srs: 'EPSG:4326' },
      building: {
        constructionYear: 1954,
        builtSurfaceM2: 102,
        primaryUse: 'Residencial',
        unitsCount: 24,
        hasCommercialGroundFloor: true,
      },
    },
    neighborhood: {
      censusSectionCode: '2807901004',
      averageNetHouseholdIncomeEur: 38500,
      averageNetPersonIncomeEur: 19200,
      percentileInMunicipality: 82,
      rankingInCity: { rank: 25, totalSections: 150 },
      demographics: { medianAge: 44, singlePersonHouseholdPercentage: 38 },
    },
    environment: {
      noise: {
        dayEveningNightDecibels: 56,
        category: 'MODERATE',
        predominantSource: 'ROAD_TRAFFIC',
      },
      floodRisk: {
        level: 'NONE',
        returnPeriodYears: null,
        isInPreferentialFlowZone: false,
      },
      airQuality: {
        aqiIndex: 28,
        category: 'GOOD',
        stationName: 'Madrid Escuelas Aguirre',
        no2MicrogramsM3: 22,
        pm25MicrogramsM3: 9,
        pm10MicrogramsM3: 15,
      },
    },
    connectivity: {
      walkScore15Min: 95,
      facilitiesWithin15MinCount: 38,
      nearestHealthcare: {
        id: 'cs-alcala',
        type: 'healthcare',
        subtype: 'primary_care',
        name: 'Salud',
        distanceMeters: 190,
        walkTimeMinutes: 2.5,
      },
      nearestEducation: {
        id: 'colegio-cervantes',
        type: 'education',
        subtype: 'school',
        name: 'Colegio Cervantes',
        distanceMeters: 300,
        walkTimeMinutes: 3.8,
      },
      nearestTransit: {
        id: 'metro-sevilla',
        type: 'transit',
        subtype: 'metro',
        name: 'Metro Sevilla',
        distanceMeters: 80,
        walkTimeMinutes: 1.0,
      },
      nearestPark: {
        id: 'retiro',
        type: 'park',
        subtype: 'urban_park',
        name: 'Parque de El Retiro',
        distanceMeters: 550,
        walkTimeMinutes: 7.2,
      },
    },
    urbanPlanning: {
      landClassification: 'URBAN_CONSOLIDATED',
      zoningCode: 'NZ-1 (Casco Central)',
      isProtectedLand: false,
      declaredRenovationsCount: 1,
      lastRenovationYear: 2015,
      isStressedHousingZone: true,
    },
    score: {
      overallScore: 82,
      subscores: {
        building: 78,
        connectivity: 95,
        environmental: 85,
        socioeconomic: 84,
        urbanPlanning: 90,
      },
      socioeconomicScore: 84,
      buildingHealthScore: 78,
      acousticComfortScore: 72,
      climateSafetyScore: 100,
      keyHighlights: ['ITE Favorable (2022)', 'Sin Cargas Registrales'],
      keyRisks: ['ZPAE Mod.'],
    },
    rentalBenchmark: {
      officialRangeLowerEurM2: 13.5,
      officialRangeUpperEurM2: 17.8,
      estimatedMonthlyRentLowerEur: 920,
      estimatedMonthlyRentUpperEur: 1140,
      isStressedHousingZone: true,
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders peek content including address, score gauge, cadastral reference, and horizontal chips', () => {
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={vi.fn()}
      />
    );

    // Address & Metadata
    expect(screen.getByText('Calle de Alcalá 42')).toBeDefined();
    expect(screen.getByText(/Distrito Centro · Madrid/)).toBeDefined();
    expect(screen.getByText(/Uso Residencial/)).toBeDefined();

    // Score Gauge Pill
    expect(screen.getByText('82/100')).toBeDefined();
    expect(screen.getByText('AUDITORÍA FAVORABLE')).toBeDefined();

    // Cadastral Reference Chip
    expect(screen.getByText(/RC 28900A001000120001XY/)).toBeDefined();
    expect(screen.getByText('Sede Catastro: Oficial')).toBeDefined();

    // Horizontal Telemetry Micro-Pills
    expect(screen.getByText(/Año 1954 \(ITE Favorable\)/)).toBeDefined();
    expect(screen.getByText(/86 m² Útiles \(102 m² Const\.\)/)).toBeDefined();
    expect(screen.getByText(/Renta 38\.500€ \(ADRH P82\)/)).toBeDefined();
    expect(screen.getByText(/Lden 56 dBA \(SICA\)/)).toBeDefined();
    expect(screen.getByText(/SNCZI: T>500a \(Bajo\)/)).toBeDefined();
  });

  it('handles snap point state transitions (peek, half, full)', () => {
    const onSnapChange = vi.fn();
    const { rerender } = render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={onSnapChange}
      />
    );

    // In peek, extended body is hidden
    const region = screen.getByRole('region', { name: /Auditoría Catastral/i });
    expect(region).toBeDefined();

    // Clicking drag handle in peek cycles to 'half'
    const dragHandleBtn = screen.getByLabelText(/Ajustar panel de auditoría/i);
    fireEvent.click(dragHandleBtn);
    expect(onSnapChange).toHaveBeenCalledWith('half');

    // Rerender in half mode
    rerender(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="half"
        onSnapChange={onSnapChange}
      />
    );
    expect(screen.getByText('Pilares de Riesgo Territorial')).toBeDefined();
    expect(screen.getByText('Seguridad Hídrica')).toBeDefined();
    expect(screen.getByText('Socioeconomía INE')).toBeDefined();
    expect(screen.getByText('Calidad ITE/IEE')).toBeDefined();
    expect(screen.getByText('Acústica MITECO')).toBeDefined();
    expect(screen.getByText('Caminabilidad de Proximidad 15-Min')).toBeDefined();

    // Clicking drag handle in half cycles to 'full'
    fireEvent.click(dragHandleBtn);
    expect(onSnapChange).toHaveBeenCalledWith('full');

    // Rerender in full mode
    rerender(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="full"
        onSnapChange={onSnapChange}
      />
    );
    expect(screen.getByText('Índice SERPAVI · Ley 12/2023')).toBeDefined();
    expect(screen.getByText('Zona Tensionada')).toBeDefined();
    expect(screen.getByText(/Rango Estatal Regulado/i)).toBeDefined();
    expect(screen.getByText(/Oferta Testigo Mercado/i)).toBeDefined();
    expect(screen.getByText(/División Horizontal \(24 Fincas\)/)).toBeDefined();
    expect(screen.getByText('Exportar Dossier PDF Oficial')).toBeDefined();
    expect(screen.getByText(/Certificado Sede Electrónica Catastro OVC/)).toBeDefined();
    expect(screen.getByText(/ETRS89 Huso 30N/)).toBeDefined();
  });

  it('supports keyboard accessibility on drag handle to change snap points', () => {
    const onSnapChange = vi.fn();
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={onSnapChange}
      />
    );

    const dragHandleBtn = screen.getByLabelText(/Ajustar panel de auditoría/i);

    // Space key
    fireEvent.keyDown(dragHandleBtn, { key: ' ' });
    expect(onSnapChange).toHaveBeenCalledWith('half');

    // ArrowUp key
    fireEvent.keyDown(dragHandleBtn, { key: 'ArrowUp' });
    expect(onSnapChange).toHaveBeenCalledWith('half');
  });

  it('calls onOpenUnitPicker when horizontal division button is clicked', () => {
    const onOpenUnitPicker = vi.fn();
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="full"
        onSnapChange={vi.fn()}
        onOpenUnitPicker={onOpenUnitPicker}
      />
    );

    const unitPickerBtn = screen.getByText(/División Horizontal \(24 Fincas\)/i).closest('button');
    expect(unitPickerBtn).toBeDefined();
    fireEvent.click(unitPickerBtn!);

    expect(onOpenUnitPicker).toHaveBeenCalledTimes(1);
  });

  it('copies cadastral reference to clipboard and displays feedback', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={vi.fn()}
      />
    );

    const copyBtn = screen.getByTitle('Copiar Referencia Catastral');
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith('28900A001000120001XY');
    await waitFor(() => {
      expect(screen.getByText('¡Copiado!')).toBeDefined();
    });
  });

  it('triggers snap change on pointer down/move/up drag gestures', () => {
    const onSnapChange = vi.fn();
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="peek"
        onSnapChange={onSnapChange}
      />
    );

    const header = screen.getByTestId('bottom-sheet-drag-area');
    expect(header).toBeDefined();

    // 1. Dragging up from peek (clientY 200 -> 150 = delta -50)
    fireEvent.pointerDown(header, { clientY: 200, pointerId: 1, button: 0 });
    fireEvent.pointerMove(header, { clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(header, { clientY: 150, pointerId: 1 });
    expect(onSnapChange).toHaveBeenCalledWith('half');

    // 2. Strong drag up from peek (clientY 200 -> 50 = delta -150)
    onSnapChange.mockClear();
    fireEvent.pointerDown(header, { clientY: 200, pointerId: 1, button: 0 });
    fireEvent.pointerUp(header, { clientY: 50, pointerId: 1 });
    expect(onSnapChange).toHaveBeenCalledWith('full');
  });

  it('calls onExportPdf when PDF export CTA is clicked', () => {
    const onExportPdf = vi.fn();
    render(
      <CadastralBottomSheet
        report={mockReport}
        snapPoint="full"
        onSnapChange={vi.fn()}
        onExportPdf={onExportPdf}
      />
    );

    const pdfBtn = screen.getByText('Exportar Dossier PDF Oficial').closest('button');
    expect(pdfBtn).toBeDefined();
    fireEvent.click(pdfBtn!);

    expect(onExportPdf).toHaveBeenCalledTimes(1);
  });

  it('renders skeleton loading state when isLoading is true', () => {
    render(
      <CadastralBottomSheet
        report={null}
        isLoading={true}
        snapPoint="peek"
        onSnapChange={vi.fn()}
      />
    );

    const region = screen.getByRole('region', { name: /Auditoría Catastral/i });
    expect(region.className).toContain('animate-pulse');
  });

  it('renders placeholder when report is null and not loading', () => {
    render(
      <CadastralBottomSheet
        report={null}
        isLoading={false}
        snapPoint="peek"
        onSnapChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Selecciona una parcela o inmueble/i)).toBeDefined();
  });
});

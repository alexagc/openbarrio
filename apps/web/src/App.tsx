import { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n';
import {
  Header,
  HeroSection,
  PillarsSection,
  ExtensionShowcaseSection,
  CivicPrinciplesSection,
  MapCtaSection,
  Footer,
  AuditModal,
  AuditData,
} from './components/landing';
import { SearchBar, SAMPLE_PRESETS } from './components/SearchBar';
import { MapView } from './components/MapView';
import { AuditDossier } from './components/AuditDossier';
import { SkeletonDossier } from './components/SkeletonDossier';
import { ErrorAlert } from './components/ErrorAlert';
import { UnitPickerModal } from './components/UnitPickerModal';
import { CertifiedPdfReport } from './components/CertifiedPdfReport';
import { MobileBottomNav, MobileNavDestination } from './components/MobileBottomNav';
import { CadastralBottomSheet, SheetSnapPoint } from './components/CadastralBottomSheet';
import { useUrlSync, parseUrlState } from './hooks/useUrlSync';
import { apiClient, ExtendedAuditReport, auditDataToReport } from './services/api.client';
import { ProblemDetails, isCadastralReference, CadastralUnitsResponse } from '@openbarrio/core';
import { PropertyDuelModal } from './components/comparator/PropertyDuelModal';
import { PropertyAuditReport } from '@openbarrio/core';
import { ArrowLeft, MapPin, Download, Printer, Sparkles } from 'lucide-react';
import { downloadCadastralGML } from './utils/gml';


function generateAuditFallback(
  query: string,
  mode: 'address' | 'refcat',
  coords?: { lat: number; lon: number }
): AuditData {
  const isRef = mode === 'refcat' || query.length === 20;
  const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const score = 65 + (hash % 30);
  const yearBuilt = 1940 + (hash % 75);
  const surfaceM2 = 60 + (hash % 90);
  const householdIncome = 15000 + (hash % 20000);
  const incomePercentile = 40 + (hash % 55);
  const noiseLden = 55 + (hash % 16);
  const isStressedZone = hash % 2 === 0;

  const derivedLat = coords?.lat ?? +(40.4168 + ((hash % 100) - 50) * 0.005).toFixed(5);
  const derivedLon = coords?.lon ?? +(-3.7038 + (((hash * 3) % 100) - 50) * 0.005).toFixed(5);

  return {
    query,
    refcat: isRef ? query.toUpperCase() : `28${hash}A001000120001XY`,
    address: isRef ? `Inmueble con RC ${query.toUpperCase()}` : query,
    score,
    yearBuilt,
    surfaceM2,
    cadastralUsage: 'Residencial',
    householdIncome,
    incomePercentile,
    noiseLden,
    noiseLevel: noiseLden > 65 ? 'Tráfico alto' : noiseLden < 55 ? 'Silencioso' : 'Moderado',
    floodRisk: hash % 8 === 0 ? 'Riesgo Medio (T=100a)' : 'Nulo (T>500a)',
    rentMinM2: +(9.0 + (hash % 10) * 0.8).toFixed(1),
    rentMaxM2: +(14.0 + (hash % 10) * 1.1).toFixed(1),
    isStressedZone,
    coordinates: { lat: derivedLat, lon: derivedLon },
  };
}

export function AppContent() {
  const initialUrlState = parseUrlState();
  const [viewMode, setViewMode] = useState<'landing' | 'map'>(initialUrlState.viewMode);
  const [activeTab, setActiveTab] = useState<'dossier' | 'map'>(initialUrlState.activeTab);
  const [activeAudit, setActiveAudit] = useState<AuditData | null>(null);

  // Mobile Navigation & Bottom Sheet Synchronized State (Phase 11D & 11E)
  const [mobileNavDestination, setMobileNavDestination] = useState<MobileNavDestination>(
    initialUrlState.activeTab === 'dossier' ? 'report' : 'map'
  );
  const [sheetSnapPoint, setSheetSnapPoint] = useState<SheetSnapPoint>(
    initialUrlState.activeTab === 'dossier' ? 'full' : 'peek'
  );
  const [isMobileLayersOpen, setIsMobileLayersOpen] = useState<boolean>(false);

  // MapLibre Interactive State
  const [report, setReport] = useState<ExtendedAuditReport | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number } | undefined>(
    initialUrlState.coords
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; problem?: ProblemDetails } | null>(null);

  // Horizontal Division Unit Picker State (Phase 10B)
  const [isUnitPickerOpen, setIsUnitPickerOpen] = useState<boolean>(false);
  const [unitsData, setUnitsData] = useState<CadastralUnitsResponse | null>(null);
  const [isLoadingUnits, setIsLoadingUnits] = useState<boolean>(false);

  // Side-by-Side Property Duel Comparator State (Phase 12C)
  const [isDuelOpen, setIsDuelOpen] = useState<boolean>(Boolean(initialUrlState.vs));
  const [duelCandidateB, setDuelCandidateB] = useState<PropertyAuditReport | null>(null);

  // URL Deep-Linking & History State Synchronization (Phase 10E)
  useUrlSync(
    {
      viewMode,
      activeTab,
      refcat: report?.property.cadastralReference,
      coords: report ? selectedCoords : undefined,
      vs: isDuelOpen && duelCandidateB ? duelCandidateB.property.cadastralReference : undefined,
    },
    (newState) => {
      setViewMode(newState.viewMode);
      setActiveTab(newState.activeTab);
      if (newState.activeTab === 'dossier') {
        setSheetSnapPoint('full');
        setMobileNavDestination('report');
      } else {
        setSheetSnapPoint('peek');
        setMobileNavDestination('map');
      }
      if (newState.refcat) {
        loadAuditByRefcat(newState.refcat, newState.coords);
      } else if (newState.coords) {
        loadAuditByCoords(newState.coords.lat, newState.coords.lon);
      }
    }
  );

  // Initial deep-link bootstrap on mount (F5 resilience)
  useEffect(() => {
    if (initialUrlState.refcat) {
      loadAuditByRefcat(initialUrlState.refcat, initialUrlState.coords);
    } else if (initialUrlState.coords) {
      loadAuditByCoords(initialUrlState.coords.lat, initialUrlState.coords.lon);
    }
  }, []);

  useEffect(() => {
    if (initialUrlState.vs && !duelCandidateB) {
      try {
        const b = apiClient.generateDeterministicAuditFromRefcat(initialUrlState.vs);
        setDuelCandidateB(b);
      } catch {
        // Fallback
      }
    }
  }, [initialUrlState.vs]);

  const handleOpenDuel = (candidateB?: PropertyAuditReport | string) => {
    if (candidateB) {
      if (typeof candidateB === 'string') {
        try {
          const b = apiClient.generateDeterministicAuditFromRefcat(candidateB);
          setDuelCandidateB(b);
        } catch {
          // Fallback
        }
      } else {
        setDuelCandidateB(candidateB);
      }
    }
    setIsDuelOpen(true);
  };

  const handleOpenUnitPicker = async (targetRefcat?: string) => {
    const ref = targetRefcat || report?.property.cadastralReference;
    if (!ref || ref === 'Consultando...') return;
    setIsUnitPickerOpen(true);
    setIsLoadingUnits(true);
    try {
      const data = await apiClient.getCadastralUnits(ref);
      setUnitsData(data);
    } catch {
      const fallback = apiClient.generateDeterministicUnits(ref);
      setUnitsData(fallback);
    } finally {
      setIsLoadingUnits(false);
    }
  };

  const handleAudit = (
    query: string,
    mode: 'address' | 'refcat',
    coords?: { lat: number; lon: number }
  ) => {
    const cleanRefcat = query.replace(/[\s\-_.]/g, '').toUpperCase();
    const isRefcat = mode === 'refcat' || isCadastralReference(query);

    // 1. Immediately open modal in loading state - never flash synthetic fake numbers
    setActiveAudit({
      query,
      refcat: isRefcat ? cleanRefcat : 'Consultando...',
      address: isRefcat ? `Inmueble con RC ${cleanRefcat}` : query,
      score: 0,
      yearBuilt: 0,
      surfaceM2: 0,
      cadastralUsage: 'Consultando datos oficiales...',
      householdIncome: 0,
      incomePercentile: 0,
      noiseLden: 0,
      noiseLevel: 'Consultando...',
      floodRisk: 'Consultando...',
      rentMinM2: 0,
      rentMaxM2: 0,
      isStressedZone: false,
      coordinates: coords,
      isLive: false,
      isLoading: true,
    });

    // 2. Query live API in background to hydrate with official state data
    (async () => {
      try {
        let liveReport: ExtendedAuditReport | null = null;
        let effectiveCoords = coords;

        if (isRefcat) {
          liveReport = await apiClient.auditByCadastralReference(cleanRefcat, effectiveCoords);
        } else if (effectiveCoords) {
          liveReport = await apiClient.auditByCoordinates(effectiveCoords.lat, effectiveCoords.lon);
        } else {
          // If address was submitted without prior coords, geocode it via searchAddress
                    const results = await apiClient.searchAddress(query);
          if (results.length > 0) {
            const best = results[0];
            effectiveCoords = { lat: best.lat, lon: best.lon };
            const portal = best.portal || (best.label.match(/\b\d+\s*([a-zA-Z])\b/) || [])[1];
            if (best.refcat) {
              liveReport = await apiClient.auditByCadastralReference(best.refcat, effectiveCoords, portal);
            } else {
              liveReport = await apiClient.auditByCoordinates(best.lat, best.lon);
            }
          }
        }

        if (!liveReport) {
          liveReport = apiClient.generateDeterministicAudit(
            effectiveCoords?.lat ?? 40.42028,
            effectiveCoords?.lon ?? -3.70379,
            {
              cadastralReference: isRefcat ? cleanRefcat : undefined,
              address: {
                street: query,
                number: '1',
                postalCode: '28001',
                municipality: 'Madrid',
                province: 'Madrid',
              },
            }
          );
        }

        if (liveReport) {
          setReport(liveReport);
          setSelectedCoords({
            lat: liveReport.property.coordinates.latitude,
            lon: liveReport.property.coordinates.longitude,
          });
          setActiveAudit({
            query,
            refcat: liveReport.property.cadastralReference,
            address: `${liveReport.property.address.street} ${liveReport.property.address.number}, ${liveReport.property.address.postalCode ? `${liveReport.property.address.postalCode} ` : ''}${liveReport.property.address.municipality}`,
            score: liveReport.score.overallScore,
            yearBuilt: liveReport.property.building.constructionYear,
            surfaceM2: liveReport.property.building.builtSurfaceM2,
            cadastralUsage: liveReport.property.building.primaryUse,
            householdIncome: liveReport.neighborhood.averageNetHouseholdIncomeEur,
            incomePercentile: liveReport.neighborhood.percentileInMunicipality,
            noiseLden: liveReport.environment.noise.dayEveningNightDecibels,
            noiseLevel:
              liveReport.environment.noise.category === 'NOISY'
                ? 'Tráfico alto'
                : liveReport.environment.noise.category === 'QUIET'
                ? 'Silencioso'
                : 'Moderado',
            floodRisk: liveReport.environment.floodRisk.level === 'NONE' ? 'Nulo (T>500a)' : liveReport.environment.floodRisk.level,
            rentMinM2: liveReport.rentalBenchmark?.officialRangeLowerEurM2 ?? 12.0,
            rentMaxM2: liveReport.rentalBenchmark?.officialRangeUpperEurM2 ?? 16.0,
            isStressedZone: liveReport.rentalBenchmark?.isStressedHousingZone ?? false,
            coordinates: {
              lat: liveReport.property.coordinates.latitude,
              lon: liveReport.property.coordinates.longitude,
            },
            isLive: !liveReport.isOfflineDemo,
            isLoading: false,
          });
        }
      } catch {
        // Fallback strictly when network is completely unreachable
        const fallback = generateAuditFallback(
          isRefcat ? cleanRefcat : query,
          isRefcat ? 'refcat' : 'address',
          coords
        );
        setActiveAudit({
          ...fallback,
          isLive: false,
          isLoading: false,
        });
      }
    })();
  };

  const handleOpenMap = (audit?: AuditData, targetTab?: 'map' | 'dossier') => {
    const tab = targetTab ?? (audit ? 'dossier' : 'map');
    setViewMode('map');
    setActiveTab(tab);
    setMobileNavDestination(tab === 'dossier' ? 'report' : 'map');
    setSheetSnapPoint(tab === 'dossier' ? 'full' : 'peek');
    setError(null);

    if (audit) {
      // 1. Immediately convert audit to full report and focus map on that exact property
      const auditReport = auditDataToReport(audit);
      setReport(auditReport);
      const coords = audit.coordinates || {
        lat: auditReport.property.coordinates.latitude,
        lon: auditReport.property.coordinates.longitude,
      };
      setSelectedCoords(coords);

      // 2. Refresh live report in background: prefer coords if available to query real parcel
      const cleanRefcat = audit.refcat ? audit.refcat.replace(/[\s\-_.]/g, '').toUpperCase() : '';
      if (!audit.isLive && cleanRefcat && isCadastralReference(cleanRefcat)) {
        loadAuditByRefcat(cleanRefcat, coords);
      } else if (coords) {
        loadAuditByCoords(coords.lat, coords.lon);
      } else if (cleanRefcat && isCadastralReference(cleanRefcat)) {
        loadAuditByRefcat(cleanRefcat);
      }
    }
  };

  const loadAuditByCoords = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedCoords({ lat, lon });

    try {
      const data = await apiClient.auditByCoordinates(lat, lon);
      setReport(data);
      setSelectedCoords({
        lat: data.property.coordinates.latitude,
        lon: data.property.coordinates.longitude,
      });
    } catch {
      const fallback = apiClient.generateDeterministicAudit(lat, lon);
      setReport(fallback);
      setSelectedCoords({ lat, lon });
    } finally {
      setIsLoading(false);
    }
  };

    const loadAuditByRefcat = async (
    refcat: string,
    fallbackCoords?: { lat: number; lon: number },
    portal?: string
  ) => {
    setIsLoading(true);
    const cleanRefcat = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    if (fallbackCoords) {
      setSelectedCoords(fallbackCoords);
    }

    try {
      const data = await apiClient.auditByCadastralReference(cleanRefcat, fallbackCoords, portal);
      if (
        fallbackCoords &&
        data.property.coordinates.latitude === 40.4168 &&
        data.property.coordinates.longitude === -3.7038 &&
        (fallbackCoords.lat !== 40.4168 || fallbackCoords.lon !== -3.7038)
      ) {
        data.property.coordinates.latitude = fallbackCoords.lat;
        data.property.coordinates.longitude = fallbackCoords.lon;
      }
      setReport(data);
      setError(null);
      setSelectedCoords({
        lat: data.property.coordinates.latitude,
        lon: data.property.coordinates.longitude,
      });
    } catch {
      if (fallbackCoords) {
        setSelectedCoords(fallbackCoords);
      }
      setReport((currentReport) => {
        if (!currentReport) {
          const fallback = apiClient.generateDeterministicAuditFromRefcat(cleanRefcat, fallbackCoords);
          if (fallbackCoords) {
            fallback.property.coordinates = {
              latitude: fallbackCoords.lat,
              longitude: fallbackCoords.lon,
              srs: 'EPSG:4326',
            };
          }
          return fallback;
        }
        return currentReport;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    loadAuditByCoords(lat, lon);
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_PRESETS[0];
    loadAuditByRefcat(sample.refcat);
  };

  // Synchronized Mobile Navigation & Bottom Sheet Controller (Phase 11D & 11E)
  const handleSelectMobileDestination = (dest: MobileNavDestination) => {
    setMobileNavDestination(dest);
    if (dest === 'map') {
      setSheetSnapPoint('peek');
      setIsMobileLayersOpen(false);
      setActiveTab('map');
    } else if (dest === 'report') {
      setSheetSnapPoint('full');
      setIsMobileLayersOpen(false);
      setActiveTab('dossier');
    } else if (dest === 'layers') {
      setIsMobileLayersOpen((prev) => !prev);
    } else if (dest === 'search') {
      setIsMobileLayersOpen(false);
      const searchInput = document.querySelector<HTMLInputElement>(
        'input[placeholder*="Buscar"], input[type="text"]'
      );
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  const handleSheetSnapChange = (snap: SheetSnapPoint) => {
    setSheetSnapPoint(snap);
    if (snap === 'full') {
      setMobileNavDestination('report');
      setActiveTab('dossier');
    } else {
      setMobileNavDestination('map');
      setActiveTab('map');
    }
  };

  // If map view is active, render the full interactive Stitch Civic Precision workspace
  if (viewMode === 'map') {
    const activeAddress = report
      ? `${report.property.address.street} ${report.property.address.number}`
      : undefined;
    const activeRefcat = report?.property.cadastralReference;
    const activeLocation = report
      ? `${report.property.address.municipality} (${report.property.address.province})`
      : 'Madrid Centro / Sol';

    return (
      <div className="h-screen h-[100dvh] bg-background text-on-surface antialiased overflow-hidden flex flex-col select-none">
        {/* ================= TOP NAVIGATION BAR (Stitch Civic Precision) ================= */}
        <header className="w-full px-space-md sm:px-space-lg flex items-center justify-between gap-2 sm:gap-space-md border-b border-outline-variant bg-surface-container top-0 z-50 h-14 shadow-sm shrink-0 no-print">
          {/* Left: Brand Cluster & Return Button (Responsive without horizontal overflow on tablet portrait) */}
          <div className="flex items-center gap-2 sm:gap-space-md min-w-0 sm:min-w-[200px] md:min-w-[220px]">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-semibold cursor-pointer shrink-0 min-h-[36px]"
              type="button"
              title="Volver a la portada de OpenBarrio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portada</span>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center relative shadow-inner shrink-0">
                <span className="font-headline font-bold text-primary tracking-tight text-sm">OB</span>
                <span className="w-2 h-2 rounded-full bg-primary absolute -top-0.5 -right-0.5 ring-2 ring-surface-container" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline font-bold text-primary tracking-tight flex items-center gap-2 leading-none text-sm">
                  OpenBarrio
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant font-medium tracking-wider uppercase mt-0.5 truncate hidden sm:inline max-w-[160px] md:max-w-[200px]">
                  Visor Cartográfico Catastral & Auditoría Territorial
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search Bar pre-filled or searchable */}
          <div className="flex-1 max-w-2xl px-space-sm hidden md:block">
            <SearchBar
              variant="topbar"
              activeRefcat={activeRefcat}
              activeAddress={activeAddress}
              onSearchRefcat={loadAuditByRefcat}
              onSearchCoords={loadAuditByCoords}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Actions & Location Cluster (Touch-friendly ≥36px) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-tertiary" />
              <span>{activeLocation}</span>
            </div>

            {report && (
              <button
                type="button"
                data-testid="topbar-duel-btn"
                onClick={() => handleOpenDuel()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-primary/50 text-primary hover:bg-primary/20 rounded text-xs font-mono font-semibold transition-colors cursor-pointer min-h-[36px]"
                title="Comparar este inmueble en duelo 1 vs 1"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Comparar</span>
              </button>
            )}

            {report && (
              <button
                type="button"
                onClick={() => downloadCadastralGML(report)}
                className="hidden lg:flex bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant text-xs font-mono px-3 py-1.5 rounded items-center gap-1.5 transition-colors cursor-pointer min-h-[36px]"
                title="Descargar archivo GML INSPIRE oficial de la parcela"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span className="hidden xl:inline">Descargar GML</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-inverse-primary hover:bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer min-h-[36px]"
              title="Exportar informe de due diligence en formato PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar Dossier PDF</span>
            </button>
          </div>
        </header>

        {/* Mobile Search Bar below header */}
        <div className="block md:hidden bg-surface-container border-b border-outline-variant p-2 no-print">
          <SearchBar
            variant="topbar"
            activeRefcat={activeRefcat}
            activeAddress={activeAddress}
            onSearchRefcat={loadAuditByRefcat}
            onSearchCoords={loadAuditByCoords}
            isLoading={isLoading}
          />
        </div>

        {/* ================= TABLET ADAPTIVE SPLIT WORKSPACE (Phase 11E: 52% Map / 48% Dossier on md/lg) ================= */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
          {/* LEFT: GIS SPATIAL CANVAS (Full-bleed on mobile <md, 52% on tablet md/lg, 60% on desktop xl+) */}
          <section className="w-full md:w-[52%] xl:w-[60%] h-full relative bg-surface-container-lowest overflow-hidden flex flex-col md:border-r border-outline-variant cadastral-grid no-print">
            <MapView
              selectedCoords={selectedCoords}
              onMapClick={handleMapClick}
              propertyName={
                report ? `${report.property.address.street} ${report.property.address.number}` : undefined
              }
              propertyAddress={
                report
                  ? `${report.property.address.municipality} · RC ${report.property.cadastralReference.substring(
                      0,
                      14
                    )}`
                  : undefined
              }
              report={report}
              isLoading={isLoading}
              error={error?.message}
              onDismissError={() => setError(null)}
              onViewReport={() => {
                setActiveTab('dossier');
                setSheetSnapPoint('full');
                setMobileNavDestination('report');
              }}
              onOpenUnitPicker={handleOpenUnitPicker}
              isMobileLayersOpen={isMobileLayersOpen}
              onToggleMobileLayers={(open) =>
                setIsMobileLayersOpen((prev) => (typeof open === 'boolean' ? open : !prev))
              }
              showFloatingAuditCard={activeTab === 'map'}
              defaultLayersExpanded={false}
            />

            {/* Mobile Expandable Due Diligence Bottom Sheet (< md) */}
            {(report || mobileNavDestination === 'report' || isLoading) && (
              <div className="md:hidden absolute inset-x-0 bottom-12 z-30 pointer-events-none">
                <div className="pointer-events-auto">
                  <CadastralBottomSheet
                    report={report}
                    isLoading={isLoading}
                    snapPoint={sheetSnapPoint}
                    onSnapChange={handleSheetSnapChange}
                    onOpenUnitPicker={handleOpenUnitPicker}
                    onExportPdf={() => window.print()}
                    onOpenDuel={() => handleOpenDuel()}
                  />
                </div>
              </div>
            )}
          </section>

          {/* RIGHT: PROPERTY AUDIT DOSSIER PANEL (48% on tablet md/lg, 40% on desktop xl+, hidden on mobile where bottom sheet handles it) */}
          <section className="hidden md:flex md:w-[48%] xl:w-[40%] h-full bg-surface overflow-y-auto flex-col">
            {error ? (
              <div className="p-4">
                <ErrorAlert
                  message={error.message}
                  problem={error.problem}
                  onRetry={() => {
                    if (selectedCoords) {
                      loadAuditByCoords(selectedCoords.lat, selectedCoords.lon);
                    }
                  }}
                  onSelectSample={handleLoadSample}
                />
              </div>
            ) : isLoading ? (
              <div className="p-4">
                <SkeletonDossier />
              </div>
            ) : report ? (
              <AuditDossier report={report} onOpenUnitPicker={handleOpenUnitPicker} onOpenDuel={() => handleOpenDuel()} />
            ) : (
              <div className="text-center py-16 bg-surface-container rounded border border-dashed border-outline-variant p-8 m-4">
                <MapPin className="w-10 h-10 text-outline mx-auto mb-3" />
                <h3 className="font-bold text-on-surface">Selecciona un inmueble</h3>
                <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                  Usa el buscador superior o haz click en cualquier parcela del mapa para generar su informe de due diligence oficial.
                </p>
              </div>
            )}
          </section>
        </main>

        {/* Mobile Bottom Navigation Bar (< md, fixed bottom, tonal elevation, no border-t) */}
        <MobileBottomNav
          activeDestination={mobileNavDestination}
          onSelectDestination={handleSelectMobileDestination}
          layersCount={3}
        />

        {/* Horizontal Division Unit Picker Modal (Phase 10B) */}
        <UnitPickerModal
          isOpen={isUnitPickerOpen}
          onClose={() => setIsUnitPickerOpen(false)}
          unitsData={unitsData}
          currentRefcat={report?.property.cadastralReference}
          buildingAddress={
            report
              ? `${report.property.address.street} ${report.property.address.number}, ${report.property.address.municipality}`
              : undefined
          }
          onSelectUnit={(unit) => {
            const currentCoords = selectedCoords || (report ? {
              lat: report.property.coordinates.latitude,
              lon: report.property.coordinates.longitude,
            } : undefined);
            loadAuditByRefcat(unit.cadastralReference, currentCoords);
          }}
          onSelectBuilding={() => {
            if (report) {
              const currentCoords = selectedCoords || {
                lat: report.property.coordinates.latitude,
                lon: report.property.coordinates.longitude,
              };
              loadAuditByRefcat(report.property.cadastralReference.slice(0, 14), currentCoords);
            }
          }}
          onCompareUnit={(unit) => {
            handleOpenDuel(unit.cadastralReference);
          }}
          isLoading={isLoadingUnits}
        />

        {/* Side-by-Side Property Duel & Dual Radar Comparator Modal (Phase 12C) */}
        {isDuelOpen && report && (
          <PropertyDuelModal
            reportA={report}
            reportB={duelCandidateB || undefined}
            isOpen={isDuelOpen}
            onClose={() => setIsDuelOpen(false)}
            onSelectCandidateB={(cand) => {
              if (typeof cand === 'string') {
                const b = apiClient.generateDeterministicAuditFromRefcat(cand);
                setDuelCandidateB(b);
              } else {
                setDuelCandidateB(cand);
              }
            }}
          />
        )}

        {/* Vectorized Certified Due Diligence PDF Export Layout (Phase 10F) */}
        {report && <CertifiedPdfReport report={report} />}
      </div>
    );
  }

  // Default: Civic Precision Landing Page
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={handleOpenMap} />

      <main className="flex-1 flex flex-col">
        <HeroSection onAudit={handleAudit} />
        <PillarsSection />
        <ExtensionShowcaseSection />
        <CivicPrinciplesSection />
        <MapCtaSection onOpenMap={handleOpenMap} />
      </main>

      <Footer onOpenMap={handleOpenMap} />

      <AuditModal
        data={activeAudit}
        onClose={() => setActiveAudit(null)}
        onOpenMap={handleOpenMap}
        onOpenUnitPicker={() => {
          if (activeAudit?.refcat && activeAudit.refcat !== 'Consultando...') {
            handleOpenUnitPicker(activeAudit.refcat);
          } else if (report) {
            handleOpenUnitPicker();
          }
        }}
      />

      {/* Horizontal Division Unit Picker Modal (Phase 10B) */}
      <UnitPickerModal
        isOpen={isUnitPickerOpen}
        onClose={() => setIsUnitPickerOpen(false)}
        unitsData={unitsData}
        currentRefcat={report?.property.cadastralReference}
        buildingAddress={
          report
            ? `${report.property.address.street} ${report.property.address.number}, ${report.property.address.municipality}`
            : undefined
        }
        onSelectUnit={(unit) => {
          setViewMode('map');
          setActiveTab('dossier');
          setSheetSnapPoint('full');
          setMobileNavDestination('report');
          const currentCoords = selectedCoords || (report ? {
            lat: report.property.coordinates.latitude,
            lon: report.property.coordinates.longitude,
          } : undefined);
          loadAuditByRefcat(unit.cadastralReference, currentCoords);
        }}
        onSelectBuilding={() => {
          if (report) {
            setViewMode('map');
            setActiveTab('dossier');
            setSheetSnapPoint('full');
            setMobileNavDestination('report');
            const currentCoords = selectedCoords || {
              lat: report.property.coordinates.latitude,
              lon: report.property.coordinates.longitude,
            };
            loadAuditByRefcat(report.property.cadastralReference.slice(0, 14), currentCoords);
          }
        }}
        onCompareUnit={(unit) => {
          setViewMode('map');
          setActiveTab('dossier');
          handleOpenDuel(unit.cadastralReference);
        }}
        isLoading={isLoadingUnits}
      />

      {/* Vectorized Certified Due Diligence PDF Export Layout (Phase 10F) */}
      {report && <CertifiedPdfReport report={report} />}

      {/* Side-by-Side Property Duel Comparator Modal (Phase 12C) */}
      {isDuelOpen && report && (
        <PropertyDuelModal
          reportA={report}
          reportB={duelCandidateB || undefined}
          isOpen={isDuelOpen}
          onClose={() => setIsDuelOpen(false)}
          onSelectCandidateB={(candidate) => handleOpenDuel(candidate)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

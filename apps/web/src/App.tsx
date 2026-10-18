import { useState } from 'react';
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
import { apiClient, ExtendedAuditReport, auditDataToReport } from './services/api.client';
import { ProblemDetails } from '@openbarrio/core';
import { ArrowLeft, MapPin, Download, Printer } from 'lucide-react';
import { downloadCadastralGML } from './utils/gml';

const SAMPLE_AUDITS: Record<string, AuditData> = {
  'gran vía 28, madrid': {
    query: 'Gran Vía 28, Madrid',
    refcat: '28900A012000340001LM',
    address: 'Calle Gran Vía 28, 28013 Madrid (Centro)',
    score: 88,
    yearBuilt: 1924,
    surfaceM2: 120,
    cadastralUsage: 'Residencial Colectivo',
    householdIncome: 28500,
    incomePercentile: 89,
    noiseLden: 58,
    noiseLevel: 'Moderado',
    floodRisk: 'Nulo (T>500a)',
    rentMinM2: 18.5,
    rentMaxM2: 24.2,
    isStressedZone: false,
    coordinates: { lat: 40.42028, lon: -3.70379 },
  },
  'passeig de gràcia 42, barcelona': {
    query: 'Passeig de Gràcia 42, Barcelona',
    refcat: '08019A023000450001JK',
    address: "Passeig de Gràcia 42, 08007 Barcelona (L'Eixample)",
    score: 82,
    yearBuilt: 1954,
    surfaceM2: 88,
    cadastralUsage: 'Residencial Colectivo',
    householdIncome: 19240,
    incomePercentile: 74,
    noiseLden: 64,
    noiseLevel: 'Tráfico alto',
    floodRisk: 'Nulo (T>500a)',
    rentMinM2: 12.0,
    rentMaxM2: 16.4,
    isStressedZone: true,
    coordinates: { lat: 41.39167, lon: 2.16472 },
  },
  'calle sierpes 12, sevilla': {
    query: 'Calle Sierpes 12, Sevilla',
    refcat: '41091A004000120001AB',
    address: 'Calle Sierpes 12, 41004 Sevilla (Casco Antiguo)',
    score: 78,
    yearBuilt: 1968,
    surfaceM2: 95,
    cadastralUsage: 'Residencial Colectivo',
    householdIncome: 16800,
    incomePercentile: 62,
    noiseLden: 60,
    noiseLevel: 'Moderado peatonal',
    floodRisk: 'Nulo (T>500a)',
    rentMinM2: 10.2,
    rentMaxM2: 14.1,
    isStressedZone: false,
    coordinates: { lat: 37.3908, lon: -5.9942 },
  },
};

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
    noiseLevel: noiseLden > 65 ? 'Tráfico alto' : 'Moderado',
    floodRisk: 'Nulo (T>500a)',
    rentMinM2: +(9.0 + (hash % 10) * 0.8).toFixed(1),
    rentMaxM2: +(14.0 + (hash % 10) * 1.1).toFixed(1),
    isStressedZone,
    coordinates: { lat: derivedLat, lon: derivedLon },
  };
}

export function AppContent() {
  const [viewMode, setViewMode] = useState<'landing' | 'map'>('landing');
  const [activeAudit, setActiveAudit] = useState<AuditData | null>(null);

  // MapLibre Interactive State
  const [report, setReport] = useState<ExtendedAuditReport | null>(null);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lon: number }>({
    lat: 40.42028,
    lon: -3.70379,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; problem?: ProblemDetails } | null>(null);
  const [activeTab, setActiveTab] = useState<'dossier' | 'map'>('dossier');

  const handleAudit = (
    query: string,
    mode: 'address' | 'refcat',
    coords?: { lat: number; lon: number }
  ) => {
    const cleanRefcat = query.replace(/[\s\-_.]/g, '').toUpperCase();
    const isRefcat = mode === 'refcat' || /^[0-9A-Z]{14,20}$/.test(cleanRefcat);
    const normalizedKey = query.toLowerCase().trim();
    const sample = SAMPLE_AUDITS[normalizedKey];
    const initialData =
      sample ||
      generateAuditFallback(
        isRefcat ? cleanRefcat : query,
        isRefcat ? 'refcat' : 'address',
        coords
      );
    setActiveAudit(initialData);

    // Query live API in background to hydrate with official state data
    (async () => {
      try {
        let liveReport: ExtendedAuditReport | null = null;
        let effectiveCoords = coords;

        if (isRefcat) {
          liveReport = await apiClient.auditByCadastralReference(cleanRefcat);
        } else if (effectiveCoords) {
          liveReport = await apiClient.auditByCoordinates(effectiveCoords.lat, effectiveCoords.lon);
        } else {
          // If address was submitted without prior coords, geocode it via searchAddress
          const results = await apiClient.searchAddress(query);
          if (results.length > 0) {
            const best = results[0];
            effectiveCoords = { lat: best.lat, lon: best.lon };
            if (best.refcat) {
              liveReport = await apiClient.auditByCadastralReference(best.refcat);
            } else {
              liveReport = await apiClient.auditByCoordinates(best.lat, best.lon);
            }
          }
        }

        if (liveReport && !liveReport.isOfflineDemo) {
          setActiveAudit({
            query,
            refcat: liveReport.property.cadastralReference,
            address: `${liveReport.property.address.street} ${liveReport.property.address.number}, ${liveReport.property.address.municipality}`,
            score: liveReport.score.overallScore,
            yearBuilt: liveReport.property.building.constructionYear,
            surfaceM2: liveReport.property.building.builtSurfaceM2,
            cadastralUsage: liveReport.property.building.primaryUse,
            householdIncome: liveReport.neighborhood.averageNetHouseholdIncomeEur,
            incomePercentile: liveReport.neighborhood.percentileInMunicipality,
            noiseLden: liveReport.environment.noise.dayEveningNightDecibels,
            noiseLevel: liveReport.environment.noise.category === 'NOISY' ? 'Tráfico alto' : 'Moderado',
            floodRisk: liveReport.environment.floodRisk.level === 'NONE' ? 'Nulo (T>500a)' : liveReport.environment.floodRisk.level,
            rentMinM2: liveReport.rentalBenchmark?.officialRangeLowerEurM2 ?? 12.0,
            rentMaxM2: liveReport.rentalBenchmark?.officialRangeUpperEurM2 ?? 16.0,
            isStressedZone: liveReport.rentalBenchmark?.isStressedHousingZone ?? false,
            coordinates: {
              lat: liveReport.property.coordinates.latitude,
              lon: liveReport.property.coordinates.longitude,
            },
            isLive: true,
          });
        }
      } catch {
        // Keep initial fallback if network unreachable
      }
    })();
  };

  const handleOpenMap = (audit?: AuditData) => {
    setViewMode('map');
    setActiveTab('map');
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
      if (audit.isLive && cleanRefcat && /^[0-9A-Z]{14,20}$/.test(cleanRefcat)) {
        loadAuditByRefcat(cleanRefcat, coords);
      } else if (coords) {
        loadAuditByCoords(coords.lat, coords.lon);
      } else if (cleanRefcat && /^[0-9A-Z]{14,20}$/.test(cleanRefcat)) {
        loadAuditByRefcat(cleanRefcat);
      }
    } else if (!report) {
      loadAuditByCoords(40.42028, -3.70379);
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

  const loadAuditByRefcat = async (refcat: string, fallbackCoords?: { lat: number; lon: number }) => {
    setIsLoading(true);
    const cleanRefcat = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    if (fallbackCoords) {
      setSelectedCoords(fallbackCoords);
    }

    try {
      const data = await apiClient.auditByCadastralReference(cleanRefcat);
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
          const fallback = apiClient.generateDeterministicAuditFromRefcat(cleanRefcat);
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
      <div className="h-screen bg-background text-on-surface antialiased overflow-hidden flex flex-col select-none">
        {/* ================= TOP NAVIGATION BAR (Stitch Civic Precision) ================= */}
        <header className="w-full px-space-lg flex items-center justify-between gap-space-md border-b border-outline-variant bg-surface-container top-0 z-50 h-14 shadow-sm shrink-0 no-print">
          {/* Left: Brand Cluster & Return Button */}
          <div className="flex items-center gap-space-md min-w-[280px]">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-semibold cursor-pointer shrink-0"
              type="button"
              title="Volver a la portada de OpenBarrio"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Portada</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center relative shadow-inner">
                <span className="font-headline font-bold text-primary tracking-tight text-sm">OB</span>
                <span className="w-2 h-2 rounded-full bg-primary absolute -top-0.5 -right-0.5 ring-2 ring-surface-container" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-primary tracking-tight flex items-center gap-2 leading-none text-sm">
                  OpenBarrio
                </span>
                <span className="font-mono text-[9px] text-on-surface-variant font-medium tracking-wider uppercase mt-0.5 truncate max-w-[200px]">
                  Visor Cartográfico Catastral & Auditoría Territorial
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden 2xl:flex items-center gap-space-md ml-3 pl-3 border-l border-outline-variant">
              <span className="text-primary border-b-2 border-primary font-medium py-4 text-xs font-mono flex items-center gap-1">
                Visor Catastral
              </span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors py-4 text-xs font-mono flex items-center gap-1 cursor-default">
                Auditoría Urbana
              </span>
              <span className="text-on-surface-variant hover:text-on-surface transition-colors py-4 text-xs font-mono flex items-center gap-1 cursor-default">
                Inteligencia de Suelo
              </span>
            </nav>
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

          {/* Right: Actions & Location Cluster */}
          <div className="flex items-center gap-2">
            {/* Mobile Tab Toggle (Informe vs Mapa) */}
            <div className="flex lg:hidden bg-surface-container-high p-0.5 rounded border border-outline-variant text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('dossier')}
                className={`px-2.5 py-1 rounded transition text-xs ${
                  activeTab === 'dossier' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                Informe
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className={`px-2.5 py-1 rounded transition text-xs ${
                  activeTab === 'map' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                Mapa
              </button>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-high border border-outline-variant text-on-surface-variant text-xs font-mono">
              <MapPin className="w-3.5 h-3.5 text-tertiary" />
              <span>{activeLocation}</span>
            </div>

            {report && (
              <button
                type="button"
                onClick={() => downloadCadastralGML(report)}
                className="hidden sm:flex bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant text-xs font-mono px-3 py-1.5 rounded items-center gap-1.5 transition-colors cursor-pointer"
                title="Descargar archivo GML INSPIRE oficial de la parcela"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Descargar GML</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="bg-inverse-primary hover:bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
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

        {/* ================= SPLIT SCREEN WORKSPACE ================= */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative">
          {/* LEFT: GIS VECTOR MAP (60% Desktop) */}
          <section
            className={`w-full lg:w-[60%] h-full relative bg-surface-container-lowest overflow-hidden flex flex-col border-r border-outline-variant cadastral-grid no-print ${
              activeTab === 'dossier' ? 'hidden lg:flex' : 'flex'
            }`}
          >
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
              onViewReport={() => setActiveTab('dossier')}
            />
          </section>

          {/* RIGHT: PROPERTY AUDIT DOSSIER PANEL (40% Desktop) */}
          <section
            className={`w-full lg:w-[40%] h-full bg-surface overflow-y-auto flex flex-col ${
              activeTab === 'map' ? 'hidden lg:flex' : 'flex'
            }`}
          >
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
              <AuditDossier report={report} />
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
      </div>
    );
  }

  // Default: Civic Precision Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
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
      />
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

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
import { apiClient, ExtendedAuditReport, ApiError, auditDataToReport } from './services/api.client';
import { ProblemDetails } from '@openbarrio/core';
import { ArrowLeft, Building2, MapPin } from 'lucide-react';

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
    const normalizedKey = query.toLowerCase().trim();
    const sample = SAMPLE_AUDITS[normalizedKey];
    const initialData = sample || generateAuditFallback(query, mode, coords);
    setActiveAudit(initialData);

    // Query live API in background to hydrate with official state data
    (async () => {
      try {
        let liveReport: ExtendedAuditReport | null = null;
        if (mode === 'refcat' && /^[0-9A-Za-z]{14,20}$/.test(query.trim())) {
          liveReport = await apiClient.auditByCadastralReference(query.trim());
        } else if (coords) {
          liveReport = await apiClient.auditByCoordinates(coords.lat, coords.lon);
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
            rentMinM2: liveReport.rentalBenchmark.officialRangeLowerEurM2,
            rentMaxM2: liveReport.rentalBenchmark.officialRangeUpperEurM2,
            isStressedZone: liveReport.rentalBenchmark.isStressedHousingZone,
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

      // 2. Refresh live report in background
      if (audit.refcat && /^[0-9A-Za-z]{14,20}$/.test(audit.refcat)) {
        loadAuditByRefcat(audit.refcat, coords);
      } else if (coords) {
        loadAuditByCoords(coords.lat, coords.lon);
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
    } catch (err) {
      if (err instanceof ApiError) {
        setError({ message: err.message, problem: err.problem });
      } else {
        setError({ message: 'Error de conexión al consultar los servicios públicos.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadAuditByRefcat = async (refcat: string, fallbackCoords?: { lat: number; lon: number }) => {
    setIsLoading(true);

    try {
      const data = await apiClient.auditByCadastralReference(refcat);
      setReport(data);
      setError(null);
      setSelectedCoords({
        lat: data.property.coordinates.latitude,
        lon: data.property.coordinates.longitude,
      });
    } catch (err) {
      if (fallbackCoords) {
        setSelectedCoords(fallbackCoords);
      }
      setReport((currentReport) => {
        if (!currentReport) {
          if (err instanceof ApiError) {
            setError({ message: err.message, problem: err.problem });
          } else {
            setError({ message: 'Error de conexión al consultar los servicios públicos.' });
          }
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

  // If map view is active, render the full interactive MapLibre workspace
  if (viewMode === 'map') {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col text-on-surface">
        <header className="sticky top-0 z-40 w-full h-14 bg-surface-container border-b border-outline-variant shadow-sm flex items-center justify-between px-space-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-colors text-xs font-semibold cursor-pointer"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Portada</span>
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="font-headline font-bold text-primary">OpenBarrio GIS</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded border border-outline-variant">
              <span
                className={`w-2 h-2 rounded-full ${
                  report?.isOfflineDemo ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              {report?.isOfflineDemo ? 'Modo Preview / Fixtures' : 'Conectado a Red (D1 + Catastro OVC)'}
            </span>
          </div>
        </header>

        {/* Universal Search Header */}
        <section className="bg-surface-container border-b border-outline-variant px-4 sm:px-6 py-4 shadow-sm no-print">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-on-surface flex items-center gap-2">
                  <span>Visor Cartográfico Catastral & Auditoría Territorial</span>
                </h1>
                <p className="text-xs text-on-surface-variant">
                  Haz click en cualquier punto del mapa o busca por referencia catastral / coordenadas.
                </p>
              </div>

              {/* Mobile Tab Toggle */}
              <div className="flex lg:hidden bg-surface-container-high p-1 rounded border border-outline-variant self-start text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('dossier')}
                  className={`px-3 py-1.5 rounded transition ${
                    activeTab === 'dossier' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Informe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className={`px-3 py-1.5 rounded transition ${
                    activeTab === 'map' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Mapa
                </button>
              </div>
            </div>

            <SearchBar
              onSearchRefcat={loadAuditByRefcat}
              onSearchCoords={loadAuditByCoords}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Dual Workspace (Dossier + Sticky Map) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Dossier */}
            <section
              className={`lg:col-span-7 xl:col-span-7 space-y-6 ${
                activeTab === 'map' ? 'hidden lg:block' : 'block'
              }`}
            >
              {error ? (
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
              ) : isLoading ? (
                <SkeletonDossier />
              ) : report ? (
                <AuditDossier report={report} />
              ) : (
                <div className="text-center py-16 bg-surface-container rounded border border-dashed border-outline-variant p-8">
                  <MapPin className="w-10 h-10 text-outline mx-auto mb-3" />
                  <h3 className="font-bold text-on-surface">Selecciona un inmueble</h3>
                  <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                    Usa el buscador o haz click en cualquier parcela del mapa para generar su informe de due diligence oficial.
                  </p>
                </div>
              )}
            </section>

            {/* Right Column: Sticky MapLibre View */}
            <section
              className={`lg:col-span-5 xl:col-span-5 no-print lg:sticky lg:top-20 ${
                activeTab === 'dossier' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="h-[520px] lg:h-[calc(100vh-140px)] w-full rounded overflow-hidden border border-outline-variant shadow-md">
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
              </div>
            </section>
          </div>
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

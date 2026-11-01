import { ArrowLeft, MapPin, Download, Printer, Sparkles } from 'lucide-react';
import { SearchBar, SAMPLE_PRESETS } from '../components/SearchBar';
import { MapView } from '../components/map/MapView';
import { AuditDossier } from '../components/AuditDossier';
import { SkeletonDossier } from '../components/SkeletonDossier';
import { ErrorAlert } from '../components/ErrorAlert';
import { MobileBottomNav, MobileNavDestination } from '../components/MobileBottomNav';
import { CadastralBottomSheet, SheetSnapPoint } from '../components/CadastralBottomSheet';
import { downloadCadastralGML } from '../utils/gml';
import {
  useWorkspaceStore,
  useReport,
  useSelectedCoords,
  useIsLoading,
  useError,
  useActiveTab,
  useMobileNavDestination,
  useSheetSnapPoint,
  useIsMobileLayersOpen,
} from '../store/workspace.store';
import { apiClient } from '../services/api.client';

export function GisWorkspaceView() {
  const report = useReport();
  const selectedCoords = useSelectedCoords();
  const isLoading = useIsLoading();
  const error = useError();
  const activeTab = useActiveTab();
  const mobileNavDestination = useMobileNavDestination();
  const sheetSnapPoint = useSheetSnapPoint();
  const isMobileLayersOpen = useIsMobileLayersOpen();

  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const setMobileNavDestination = useWorkspaceStore((s) => s.setMobileNavDestination);
  const setSheetSnapPoint = useWorkspaceStore((s) => s.setSheetSnapPoint);
  const setIsMobileLayersOpen = useWorkspaceStore((s) => s.setIsMobileLayersOpen);
  const loadAuditByCoords = useWorkspaceStore((s) => s.loadAuditByCoords);
  const loadAuditByRefcat = useWorkspaceStore((s) => s.loadAuditByRefcat);
  const loadCadastralUnits = useWorkspaceStore((s) => s.loadCadastralUnits);
  const setIsDuelOpen = useWorkspaceStore((s) => s.setIsDuelOpen);
  const setDuelCandidateB = useWorkspaceStore((s) => s.setDuelCandidateB);
  const setError = useWorkspaceStore((s) => s.setError);

  const activeAddress = report
    ? `${report.property.address.street} ${report.property.address.number}`
    : undefined;
  const activeRefcat = report?.property.cadastralReference;
  const activeLocation = report
    ? `${report.property.address.municipality} (${report.property.address.province})`
    : 'Madrid Centro / Sol';

  const handleOpenDuel = (candidateB?: string) => {
    if (candidateB) {
      apiClient.auditByCadastralReference(candidateB).then(setDuelCandidateB).catch(() => {});
    }
    setIsDuelOpen(true);
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_PRESETS[0];
    loadAuditByRefcat(sample.refcat);
  };

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
      setIsMobileLayersOpen(!isMobileLayersOpen);
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

  return (
    <div className="h-screen h-[100dvh] bg-background text-on-surface antialiased overflow-hidden flex flex-col select-none">
      {/* Top Navigation Bar */}
      <header className="w-full px-space-md sm:px-space-lg flex items-center justify-between gap-2 sm:gap-space-md border-b border-outline-variant bg-surface-container top-0 z-50 h-14 shadow-sm shrink-0 no-print">
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

        {/* Center: Search Bar */}
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

      {/* Tablet Adaptive Split Workspace */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative">
        {/* Left: GIS Map Viewport */}
        <section className="w-full md:w-[52%] xl:w-[60%] h-full relative bg-surface-container-lowest overflow-hidden flex flex-col md:border-r border-outline-variant cadastral-grid no-print">
          <MapView
            selectedCoords={selectedCoords}
            onMapClick={loadAuditByCoords}
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
            onOpenUnitPicker={() => loadCadastralUnits()}
            isMobileLayersOpen={isMobileLayersOpen}
            onToggleMobileLayers={(open) =>
              setIsMobileLayersOpen(typeof open === 'boolean' ? open : !isMobileLayersOpen)
            }
            showFloatingAuditCard={activeTab === 'map'}
            defaultLayersExpanded={false}
          />

          {/* Mobile Expandable Due Diligence Bottom Sheet */}
          {(report || mobileNavDestination === 'report' || isLoading) && (
            <div className="md:hidden absolute inset-x-0 bottom-12 z-30 pointer-events-none">
              <div className="pointer-events-auto">
                <CadastralBottomSheet
                  report={report}
                  isLoading={isLoading}
                  snapPoint={sheetSnapPoint}
                  onSnapChange={handleSheetSnapChange}
                  onOpenUnitPicker={() => loadCadastralUnits()}
                  onExportPdf={() => window.print()}
                  onOpenDuel={() => handleOpenDuel()}
                />
              </div>
            </div>
          )}
        </section>

        {/* Right: Property Audit Dossier Panel */}
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
            <AuditDossier
              report={report}
              onOpenUnitPicker={() => loadCadastralUnits()}
              onOpenDuel={() => handleOpenDuel()}
            />
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

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeDestination={mobileNavDestination}
        onSelectDestination={handleSelectMobileDestination}
        layersCount={3}
      />
    </div>
  );
}

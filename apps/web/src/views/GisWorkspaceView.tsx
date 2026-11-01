import { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Download, Printer, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Tablet & Desktop Split Divider and Gestures
  const [splitRatio, setSplitRatio] = useState<number>(52);
  const [isSheetDragging, setIsSheetDragging] = useState<boolean>(false);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const handleDividerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const containerWidth = mainContainerRef.current?.getBoundingClientRect().width || window.innerWidth;
    const initialRatio = splitRatio;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaRatio = (deltaX / containerWidth) * 100;
      const newRatio = Math.max(35, Math.min(65, initialRatio + deltaRatio));
      setSplitRatio(Math.round(newRatio * 10) / 10);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleDividerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplitRatio((prev) => Math.max(35, Math.round((prev - 5) * 10) / 10));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplitRatio((prev) => Math.min(65, Math.round((prev + 5) * 10) / 10));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSplitRatio(50);
    }
  };

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
      <main
        ref={mainContainerRef}
        className="flex-1 flex flex-col md:flex-row overflow-hidden w-full relative"
      >
        {/* Left: GIS Map Viewport */}
        <section
          className="w-full md:w-[52%] xl:w-[60%] h-full relative bg-surface-container-lowest overflow-hidden flex flex-col cadastral-grid no-print"
          style={splitRatio !== 52 ? { width: `${splitRatio}%` } : undefined}
        >
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
            isDragging={isSheetDragging}
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
                  onDraggingChange={setIsSheetDragging}
                />
              </div>
            </div>
          )}
        </section>

        {/* Tablet & Desktop Draggable Split Divider */}
        <div
          role="separator"
          aria-label="Ajustar división del espacio de trabajo"
          aria-orientation="vertical"
          aria-valuenow={Math.round(splitRatio)}
          tabIndex={0}
          onDoubleClick={() => setSplitRatio(50)}
          onKeyDown={handleDividerKeyDown}
          onPointerDown={handleDividerPointerDown}
          className="hidden md:flex items-center justify-center relative w-2 hover:w-2.5 cursor-col-resize bg-surface-container-high border-x border-outline-variant hover:border-primary/50 hover:bg-primary/10 transition-colors z-20 group shrink-0 select-none"
          title="Arrastrar para ajustar tamaño · Doble clic para 50/50"
        >
          <div className="w-0.5 h-8 rounded-full bg-outline-variant group-hover:bg-primary transition-colors" />

          {/* Quick-collapse buttons popup on hover or focus */}
          <div className="absolute top-3 -left-3.5 hidden group-hover:flex items-center gap-0.5 bg-surface-container border border-outline-variant rounded-md shadow-lg p-0.5 z-30 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSplitRatio(35);
              }}
              className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title="Colapsar panel izquierdo (35%)"
              aria-label="Colapsar panel izquierdo a 35%"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSplitRatio(50);
              }}
              className="px-1 py-0.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary font-mono text-[9px] transition-colors"
              title="Centrar 50/50"
            >
              50/50
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSplitRatio(65);
              }}
              className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
              title="Expandir panel izquierdo (65%)"
              aria-label="Expandir panel izquierdo a 65%"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Property Audit Dossier Panel */}
        <section
          className="hidden md:flex md:w-[48%] xl:w-[40%] h-full bg-surface overflow-y-auto flex-col"
          style={splitRatio !== 52 ? { width: `${100 - splitRatio}%` } : undefined}
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

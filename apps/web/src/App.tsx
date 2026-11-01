import { useEffect } from 'react';
import { LanguageProvider } from './i18n';
import { LandingView } from './views/LandingView';
import { GisWorkspaceView } from './views/GisWorkspaceView';
import { UnitPickerModal } from './components/UnitPickerModal';
import { PropertyDuelModal } from './components/comparator/PropertyDuelModal';
import { CertifiedPdfReport } from './components/CertifiedPdfReport';
import {
  useWorkspaceStore,
  useViewMode,
  useReport,
  useSelectedCoords,
  useIsUnitPickerOpen,
  useUnitsData,
  useIsLoadingUnits,
  useIsDuelOpen,
  useDuelCandidateB,
} from './store/workspace.store';
import { apiClient } from './services/api.client';

export function AppContent() {
  const viewMode = useViewMode();
  const report = useReport();
  const selectedCoords = useSelectedCoords();
  const isUnitPickerOpen = useIsUnitPickerOpen();
  const unitsData = useUnitsData();
  const isLoadingUnits = useIsLoadingUnits();
  const isDuelOpen = useIsDuelOpen();
  const duelCandidateB = useDuelCandidateB();

  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const setActiveTab = useWorkspaceStore((s) => s.setActiveTab);
  const setIsUnitPickerOpen = useWorkspaceStore((s) => s.setIsUnitPickerOpen);
  const setIsDuelOpen = useWorkspaceStore((s) => s.setIsDuelOpen);
  const setDuelCandidateB = useWorkspaceStore((s) => s.setDuelCandidateB);
  const loadAuditByRefcat = useWorkspaceStore((s) => s.loadAuditByRefcat);
  const initFromUrl = useWorkspaceStore((s) => s.initFromUrl);

  useEffect(() => {
    initFromUrl();
  }, [initFromUrl]);

  return (
    <>
      {viewMode === 'map' ? <GisWorkspaceView /> : <LandingView />}

      {/* Global Modals Connected to Zustand Store */}
      <UnitPickerModal
        isOpen={isUnitPickerOpen}
        onClose={() => setIsUnitPickerOpen(false)}
        unitsData={unitsData}
        isLoading={isLoadingUnits}
        currentRefcat={report?.property.cadastralReference}
        buildingAddress={
          report
            ? `${report.property.address.street} ${report.property.address.number}, ${report.property.address.municipality}`
            : undefined
        }
        onSelectUnit={(unit) => {
          setIsUnitPickerOpen(false);
          setViewMode('map');
          setActiveTab('dossier');
          loadAuditByRefcat(unit.cadastralReference, selectedCoords);
        }}
        onSelectBuilding={() => {
          setIsUnitPickerOpen(false);
          if (report) {
            setViewMode('map');
            setActiveTab('dossier');
            loadAuditByRefcat(report.property.cadastralReference.slice(0, 14), selectedCoords);
          }
        }}
        onCompareUnit={(unit) => {
          setIsUnitPickerOpen(false);
          setViewMode('map');
          setActiveTab('dossier');
          apiClient.auditByCadastralReference(unit.cadastralReference).then(setDuelCandidateB).catch(() => {});
          setIsDuelOpen(true);
        }}
      />

      {isDuelOpen && report && (
        <PropertyDuelModal
          reportA={report}
          reportB={duelCandidateB || undefined}
          isOpen={isDuelOpen}
          onClose={() => setIsDuelOpen(false)}
          onSelectCandidateB={(cand) => {
            if (typeof cand === 'string') {
              apiClient.auditByCadastralReference(cand).then(setDuelCandidateB).catch(() => {});
            } else {
              setDuelCandidateB(cand);
            }
          }}
        />
      )}

      {report && <CertifiedPdfReport report={report} />}
    </>
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

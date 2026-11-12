import { create } from 'zustand';
import {
  ProblemDetails,
  CadastralUnitsResponse,
  PropertyAuditReport,
} from '@openbarrio/core';
import { apiClient, ExtendedAuditReport, ApiError } from '../services/api.client';
import { parseUrlState, DossierTab } from '../hooks/useUrlSync';
import { AuditData } from '../components/landing';
import { MobileNavDestination } from '../components/MobileBottomNav';
import { SheetSnapPoint } from '../components/CadastralBottomSheet';

export interface WorkspaceState {
  // Navigation & Views
  viewMode: 'landing' | 'map' | 'transparency';
  activeTab: 'dossier' | 'map';
  dossierTab: DossierTab;
  mobileNavDestination: MobileNavDestination;
  sheetSnapPoint: SheetSnapPoint;
  isMobileLayersOpen: boolean;

  // Active Audit Data
  report: ExtendedAuditReport | null;
  activeAudit: AuditData | null;
  selectedCoords?: { lat: number; lon: number };
  isLoading: boolean;
  error: { message: string; problem?: ProblemDetails } | null;

  // Horizontal Division Unit Picker Modal
  isUnitPickerOpen: boolean;
  unitsData: CadastralUnitsResponse | null;
  isLoadingUnits: boolean;

  // Property Duel Comparator Modal
  isDuelOpen: boolean;
  duelCandidateB: PropertyAuditReport | null;
  isLoadingDuelB: boolean;

  // Certified PDF Modal
  isCertifiedPdfOpen: boolean;

  // Actions
  setViewMode: (mode: 'landing' | 'map' | 'transparency') => void;
  setActiveTab: (tab: 'dossier' | 'map') => void;
  setDossierTab: (tab: DossierTab) => void;
  setMobileNavDestination: (dest: MobileNavDestination) => void;
  setSheetSnapPoint: (snap: SheetSnapPoint) => void;
  setIsMobileLayersOpen: (open: boolean) => void;

  setReport: (report: ExtendedAuditReport | null) => void;
  setActiveAudit: (audit: AuditData | null) => void;
  setSelectedCoords: (coords?: { lat: number; lon: number }) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: { message: string; problem?: ProblemDetails } | null) => void;
  clearError: () => void;

  setIsUnitPickerOpen: (open: boolean) => void;
  setUnitsData: (data: CadastralUnitsResponse | null) => void;
  setIsLoadingUnits: (isLoadingUnits: boolean) => void;

  setIsDuelOpen: (open: boolean) => void;
  setDuelCandidateB: (candidate: PropertyAuditReport | null) => void;
  setIsLoadingDuelB: (isLoadingDuelB: boolean) => void;

  setIsCertifiedPdfOpen: (open: boolean) => void;

  // Async Orchestrations
  loadAuditByCoords: (lat: number, lon: number) => Promise<ExtendedAuditReport | null>;
  loadAuditByRefcat: (
    refcat: string,
    fallbackCoords?: { lat: number; lon: number },
    portal?: string
  ) => Promise<ExtendedAuditReport | null>;
  loadCadastralUnits: (parcelRef?: string) => Promise<void>;
  loadDuelCandidateB: (refcatOrCoords: string | { lat: number; lon: number }) => Promise<void>;

  // Sync helpers
  syncUrl: (replace?: boolean) => void;
  initFromUrl: () => void;
}

const initialUrl = parseUrlState();

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  viewMode: initialUrl.viewMode,
  activeTab: initialUrl.activeTab,
  dossierTab: initialUrl.dossierTab,
  mobileNavDestination: initialUrl.activeTab === 'dossier' ? 'report' : 'map',
  sheetSnapPoint: initialUrl.activeTab === 'dossier' ? 'full' : 'peek',
  isMobileLayersOpen: false,

  report: null,
  activeAudit: null,
  selectedCoords: initialUrl.coords,
  isLoading: false,
  error: null,

  isUnitPickerOpen: false,
  unitsData: null,
  isLoadingUnits: false,

  isDuelOpen: Boolean(initialUrl.vs),
  duelCandidateB: null,
  isLoadingDuelB: false,

  isCertifiedPdfOpen: false,

  setViewMode: (viewMode) => {
    set({ viewMode });
    get().syncUrl();
  },

  setActiveTab: (activeTab) => {
    set({
      activeTab,
      sheetSnapPoint: activeTab === 'dossier' ? 'full' : 'peek',
      mobileNavDestination: activeTab === 'dossier' ? 'report' : 'map',
    });
    get().syncUrl();
  },

  setDossierTab: (dossierTab) => {
    set({ dossierTab });
    get().syncUrl();
  },

  setMobileNavDestination: (mobileNavDestination) => set({ mobileNavDestination }),
  setSheetSnapPoint: (sheetSnapPoint) => set({ sheetSnapPoint }),
  setIsMobileLayersOpen: (isMobileLayersOpen) => set({ isMobileLayersOpen }),

  setReport: (report) => {
    set({ report });
    get().syncUrl();
  },

  setActiveAudit: (activeAudit) => set({ activeAudit }),
  setSelectedCoords: (selectedCoords) => set({ selectedCoords }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setIsUnitPickerOpen: (isUnitPickerOpen) => set({ isUnitPickerOpen }),
  setUnitsData: (unitsData) => set({ unitsData }),
  setIsLoadingUnits: (isLoadingUnits) => set({ isLoadingUnits }),

  setIsDuelOpen: (isDuelOpen) => {
    set({ isDuelOpen });
    get().syncUrl();
  },

  setDuelCandidateB: (duelCandidateB) => {
    set({ duelCandidateB });
    get().syncUrl();
  },

  setIsLoadingDuelB: (isLoadingDuelB) => set({ isLoadingDuelB }),
  setIsCertifiedPdfOpen: (isCertifiedPdfOpen) => set({ isCertifiedPdfOpen }),

  loadAuditByCoords: async (lat: number, lon: number) => {
    set({
      isLoading: true,
      error: null,
      selectedCoords: { lat, lon },
      viewMode: 'map',
    });

    try {
      const liveReport = await apiClient.auditByCoordinates(lat, lon);
      set({
        report: liveReport,
        selectedCoords: {
          lat: liveReport.property.coordinates.latitude,
          lon: liveReport.property.coordinates.longitude,
        },
        isLoading: false,
      });
      get().syncUrl();
      return liveReport;
    } catch (err: unknown) {
      const apiErr = err instanceof ApiError ? err : null;
      set({
        isLoading: false,
        error: {
          message: apiErr?.problem?.detail || (err instanceof Error ? err.message : 'Error desconocido de conexión'),
          problem: apiErr?.problem,
        },
      });
      return null;
    }
  },

  loadAuditByRefcat: async (
    refcat: string,
    fallbackCoords?: { lat: number; lon: number },
    portal?: string
  ) => {
    const cleanRefcat = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
    set({
      isLoading: true,
      error: null,
      viewMode: 'map',
    });

    try {
      const liveReport = await apiClient.auditByCadastralReference(cleanRefcat, fallbackCoords, portal);
      set({
        report: liveReport,
        selectedCoords: {
          lat: liveReport.property.coordinates.latitude,
          lon: liveReport.property.coordinates.longitude,
        },
        isLoading: false,
      });
      get().syncUrl();
      return liveReport;
    } catch (err: unknown) {
      const apiErr = err instanceof ApiError ? err : null;
      set({
        isLoading: false,
        error: {
          message: apiErr?.problem?.detail || (err instanceof Error ? err.message : 'Error desconocido de conexión'),
          problem: apiErr?.problem,
        },
      });
      return null;
    }
  },

  loadCadastralUnits: async (parcelRef?: string) => {
    const rawRef =
      parcelRef ||
      get().report?.property.unit?.cadastralReference ||
      get().report?.property.cadastralReference;

    if (!rawRef) return;
    const cleanRef = String(rawRef).replace(/[\s\-_.]/g, '').toUpperCase().slice(0, 14);

    set({ isUnitPickerOpen: true, isLoadingUnits: true, unitsData: null });

    try {
      const data = await apiClient.getCadastralUnits(cleanRef);
      set({ unitsData: data, isLoadingUnits: false });
    } catch (err: unknown) {
      const apiErr = err instanceof ApiError ? err : null;
      set({
        isLoadingUnits: false,
        error: {
          message: apiErr?.problem?.detail || 'No se pudieron recuperar las unidades catastrales.',
          problem: apiErr?.problem,
        },
      });
    }
  },

  loadDuelCandidateB: async (refcatOrCoords: string | { lat: number; lon: number }) => {
    set({ isLoadingDuelB: true });
    try {
      let bReport: ExtendedAuditReport;
      if (typeof refcatOrCoords === 'string') {
        const clean = refcatOrCoords.replace(/[\s\-_.]/g, '').toUpperCase();
        bReport = await apiClient.auditByCadastralReference(clean);
      } else {
        bReport = await apiClient.auditByCoordinates(refcatOrCoords.lat, refcatOrCoords.lon);
      }
      set({ duelCandidateB: bReport, isLoadingDuelB: false });
      get().syncUrl();
    } catch (err: unknown) {
      const apiErr = err instanceof ApiError ? err : null;
      set({
        isLoadingDuelB: false,
        error: {
          message: apiErr?.problem?.detail || 'No se pudo consultar el inmueble B para el duelo.',
          problem: apiErr?.problem,
        },
      });
    }
  },

  syncUrl: (replace = false) => {
    if (typeof window === 'undefined') return;
    const { viewMode, activeTab, dossierTab, report, selectedCoords, isDuelOpen, duelCandidateB } = get();

    if (viewMode === 'landing') {
      const cur = window.location.pathname + window.location.search;
      if (cur !== '/') {
        if (replace) window.history.replaceState({ openbarrio: true }, '', '/');
        else window.history.pushState({ openbarrio: true }, '', '/');
      }
      return;
    }

    if (viewMode === 'transparency') {
      const cur = window.location.pathname + window.location.search;
      const isAlreadyTransparency =
        cur.startsWith('/fuentes-oficiales') ||
        cur.startsWith('/sources') ||
        cur.startsWith('/fonts-oficials') ||
        cur.startsWith('/transparencia');
      if (!isAlreadyTransparency) {
        if (replace) window.history.replaceState({ openbarrio: true }, '', '/fuentes-oficiales');
        else window.history.pushState({ openbarrio: true }, '', '/fuentes-oficiales');
      }
      return;
    }

    const params = new URLSearchParams();
    let targetPath = '/map';

    if (report?.property.cadastralReference) {
      targetPath = `/informe/${report.property.cadastralReference}`;
    } else if (selectedCoords) {
      params.set('lat', selectedCoords.lat.toFixed(5));
      params.set('lon', selectedCoords.lon.toFixed(5));
    }

    if (activeTab === 'map') {
      params.set('tab', 'map');
    } else if (dossierTab && dossierTab !== 'summary') {
      params.set('tab', dossierTab);
    }

    if (isDuelOpen && duelCandidateB?.property.cadastralReference) {
      params.set('vs', duelCandidateB.property.cadastralReference);
    }

    const qs = params.toString();
    const targetUrl = qs ? `${targetPath}?${qs}` : targetPath;
    const cur = window.location.pathname + window.location.search;

    if (cur !== targetUrl) {
      if (replace) window.history.replaceState({ openbarrio: true }, '', targetUrl);
      else window.history.pushState({ openbarrio: true }, '', targetUrl);
    }
  },

  initFromUrl: () => {
    if (typeof window === 'undefined') return;
    const state = parseUrlState();
    set({
      viewMode: state.viewMode,
      activeTab: state.activeTab,
      dossierTab: state.dossierTab,
      sheetSnapPoint: state.activeTab === 'dossier' ? 'full' : 'peek',
      mobileNavDestination: state.activeTab === 'dossier' ? 'report' : 'map',
      isDuelOpen: Boolean(state.vs),
    });

    if (state.refcat) {
      get().loadAuditByRefcat(state.refcat, state.coords);
    } else if (state.coords) {
      get().loadAuditByCoords(state.coords.lat, state.coords.lon);
    }

    if (state.vs) {
      get().loadDuelCandidateB(state.vs);
    }
  },
}));

// Precise Selectors to prevent unnecessary re-rendering
export const useViewMode = () => useWorkspaceStore((state) => state.viewMode);
export const useActiveTab = () => useWorkspaceStore((state) => state.activeTab);
export const useDossierTab = () => useWorkspaceStore((state) => state.dossierTab);
export const useReport = () => useWorkspaceStore((state) => state.report);
export const useSelectedCoords = () => useWorkspaceStore((state) => state.selectedCoords);
export const useIsLoading = () => useWorkspaceStore((state) => state.isLoading);
export const useError = () => useWorkspaceStore((state) => state.error);
export const useActiveAudit = () => useWorkspaceStore((state) => state.activeAudit);
export const useMobileNavDestination = () => useWorkspaceStore((state) => state.mobileNavDestination);
export const useSheetSnapPoint = () => useWorkspaceStore((state) => state.sheetSnapPoint);
export const useIsMobileLayersOpen = () => useWorkspaceStore((state) => state.isMobileLayersOpen);
export const useIsUnitPickerOpen = () => useWorkspaceStore((state) => state.isUnitPickerOpen);
export const useUnitsData = () => useWorkspaceStore((state) => state.unitsData);
export const useIsLoadingUnits = () => useWorkspaceStore((state) => state.isLoadingUnits);
export const useIsDuelOpen = () => useWorkspaceStore((state) => state.isDuelOpen);
export const useDuelCandidateB = () => useWorkspaceStore((state) => state.duelCandidateB);
export const useIsLoadingDuelB = () => useWorkspaceStore((state) => state.isLoadingDuelB);
export const useIsCertifiedPdfOpen = () => useWorkspaceStore((state) => state.isCertifiedPdfOpen);

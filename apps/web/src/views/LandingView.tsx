import {
  Header,
  HeroSection,
  InteractiveSandboxSection,
  DataTransparencyMatrix,
  HorizontalDivisionShowcase,
  PillarsSection,
  ExtensionShowcaseSection,
  CivicPrinciplesSection,
  MapCtaSection,
  Footer,
  AuditModal,
  AuditData,
} from '../components/landing';
import {
  useWorkspaceStore,
  useActiveAudit,
  useReport,
} from '../store/workspace.store';
import {
  apiClient,
  auditDataToReport,
  ExtendedAuditReport,
} from '../services/api.client';
import { isCadastralReference } from '@openbarrio/core';

export function LandingView() {
  const activeAudit = useActiveAudit();
  const report = useReport();
  const setActiveAudit = useWorkspaceStore((s) => s.setActiveAudit);
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);
  const setReport = useWorkspaceStore((s) => s.setReport);
  const setSelectedCoords = useWorkspaceStore((s) => s.setSelectedCoords);
  const loadAuditByRefcat = useWorkspaceStore((s) => s.loadAuditByRefcat);
  const loadAuditByCoords = useWorkspaceStore((s) => s.loadAuditByCoords);
  const loadCadastralUnits = useWorkspaceStore((s) => s.loadCadastralUnits);

  const handleOpenMap = (audit?: AuditData) => {
    setViewMode('map');

    if (audit) {
      const auditReport = auditDataToReport(audit);
      setReport(auditReport);
      const coords = audit.coordinates || {
        lat: auditReport.property.coordinates.latitude,
        lon: auditReport.property.coordinates.longitude,
      };
      setSelectedCoords(coords);

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

  const handleAudit = (
    query: string,
    mode: 'address' | 'refcat',
    coords?: { lat: number; lon: number }
  ) => {
    const cleanRefcat = query.replace(/[\s\-_.]/g, '').toUpperCase();
    const isRefcat = mode === 'refcat' || isCadastralReference(query);

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

    (async () => {
      try {
        let liveReport: ExtendedAuditReport | null = null;
        let effectiveCoords = coords;

        if (isRefcat) {
          liveReport = await apiClient.auditByCadastralReference(cleanRefcat, effectiveCoords);
        } else if (effectiveCoords) {
          liveReport = await apiClient.auditByCoordinates(effectiveCoords.lat, effectiveCoords.lon);
        } else {
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

        if (liveReport) {
          setReport(liveReport);
          setSelectedCoords({
            lat: liveReport.property.coordinates.latitude,
            lon: liveReport.property.coordinates.longitude,
          });
          setActiveAudit({
            query,
            refcat: liveReport.property.cadastralReference,
            address: `${liveReport.property.address.street} ${liveReport.property.address.number}, ${
              liveReport.property.address.postalCode ? `${liveReport.property.address.postalCode} ` : ''
            }${liveReport.property.address.municipality}`,
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
            floodRisk:
              liveReport.environment.floodRisk.level === 'NONE'
                ? 'Nulo (T>500a)'
                : liveReport.environment.floodRisk.level,
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
        // Fallback calculation for preview when network is offline
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

        setActiveAudit({
          query,
          refcat: isRefcat ? cleanRefcat : `28${hash}A001000120001XY`,
          address: isRefcat ? `Inmueble con RC ${cleanRefcat}` : query,
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
          isLive: false,
          isLoading: false,
        });
      }
    })();
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-background text-on-surface">
      <Header onOpenMap={() => handleOpenMap()} />

      <main className="flex-1 flex flex-col items-center">
        <HeroSection onAudit={handleAudit} onOpenMap={() => handleOpenMap()} />
        <InteractiveSandboxSection
          onSelectPreset={(p) => {
            handleAudit(p.address, 'address', p.coords);
          }}
        />
        <HorizontalDivisionShowcase
          onAuditUnit={(refcat, _address) => {
            handleAudit(refcat, 'refcat');
          }}
        />
        <DataTransparencyMatrix />
        <PillarsSection />
        <ExtensionShowcaseSection />
        <CivicPrinciplesSection />
        <MapCtaSection onOpenMap={() => handleOpenMap()} />
      </main>

      <Footer onOpenMap={() => handleOpenMap()} />

      <AuditModal
        data={activeAudit}
        onClose={() => setActiveAudit(null)}
        onOpenMap={handleOpenMap}
        onOpenUnitPicker={() => {
          if (activeAudit?.refcat && activeAudit.refcat !== 'Consultando...') {
            loadCadastralUnits(activeAudit.refcat);
          } else if (report) {
            loadCadastralUnits();
          }
        }}
      />
    </div>
  );
}

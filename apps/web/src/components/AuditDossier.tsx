import { useState } from 'react';
import {
  PropertyAuditReport,
  PropertyTypology,
  LandClassification,
  detectPropertyTypology,
  detectCadastralJurisdiction,
  evaluateBuildingInspectionAlert,
  evaluateSeismicVulnerability,
} from '@openbarrio/core';
import { ScoreGauge } from './ScoreGauge';
import { PillarCards, BuildingCadastralCard } from './PillarCard';
import { RentalModule } from './RentalModule';
import { HighlightsAndRisks } from './HighlightsAndRisks';
import { BuildingCapExCard } from './dossier/BuildingCapExCard';
import { EnergyPerformanceCard } from './dossier/EnergyPerformanceCard';
import { NeighborhoodTrendsCard } from './dossier/NeighborhoodTrendsCard';
import { RadonCard } from './dossier/RadonCard';
import { VutSaturationCard } from './dossier/VutSaturationCard';
import { FiscalSimulatorCard } from './dossier/FiscalSimulatorCard';
import { BuildingInspectionCard } from './dossier/BuildingInspectionCard';
import { SeismicSafetyCard } from './dossier/SeismicSafetyCard';
import { PedestrianIsochronesCard } from './dossier/PedestrianIsochronesCard';
import { downloadCadastralGML } from '../utils/gml';
import { DossierTab } from '../hooks/useUrlSync';
import { useWorkspaceStore } from '../store/workspace.store';
import { useTranslation } from '../i18n';
import { isSubstandardHousing } from '../utils/substandard';
import {
  Printer,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Building,
  Bookmark,
  MapPin,
  Download,
  Sparkles,
  BarChart3,
  Coins,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
} from 'lucide-react';

interface AuditDossierProps {
  report: PropertyAuditReport;
  onOpenUnitPicker?: () => void;
  onOpenDuel?: () => void;
  activeTab?: DossierTab;
  onTabChange?: (tab: DossierTab) => void;
}

export function AuditDossier({
  report,
  onOpenUnitPicker,
  onOpenDuel,
  activeTab: controlledTab,
  onTabChange,
}: AuditDossierProps) {
  const { t, language } = useTranslation();
  const storeDossierTab = useWorkspaceStore((s) => s.dossierTab);
  const setStoreDossierTab = useWorkspaceStore((s) => s.setDossierTab);

  const [internalTab, setInternalTab] = useState<DossierTab>('summary');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const currentTab: DossierTab = controlledTab ?? storeDossierTab ?? internalTab;

  const handleTabClick = (tab: DossierTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setStoreDossierTab(tab);
      setInternalTab(tab);
    }
  };

  const {
    property,
    neighborhood,
    environment,
    score,
    rentalBenchmark,
    connectivity,
    urbanPlanning,
    energy,
    marketTrends,
    radon,
    vut,
    fiscal,
    generatedAt,
    buildingInspection,
    seismicHazard,
    pedestrianIsochrones,
  } = report;

  const fullAddress = property.unit
    ? `${property.address.street} ${property.address.number}${property.unit.block ? `, Portal ${property.unit.block}` : ''}${property.unit.floor ? `, Pl. ${property.unit.floor}` : ''}${property.unit.door ? ` Pta. ${property.unit.door}` : ''}, ${property.address.postalCode} ${property.address.municipality}`
    : `${property.address.street} ${property.address.number}, ${property.address.postalCode} ${property.address.municipality}`;

  const unitDetail = property.unit
    ? [
        property.unit.block ? `Portal ${property.unit.block}` : null,
        property.unit.floor ? `Planta ${property.unit.floor}` : null,
        property.unit.door ? `Puerta ${property.unit.door}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : null;

  const dateLocale =
    language === 'en'
      ? 'en-US'
      : language === 'ca'
      ? 'ca-ES'
      : language === 'gl'
      ? 'gl-ES'
      : language === 'eu'
      ? 'eu-ES'
      : 'es-ES';

  const formattedDate = new Date(generatedAt).toLocaleDateString(dateLocale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleCopyRefcat = () => {
    navigator.clipboard.writeText(property.cadastralReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadGML = () => {
    downloadCadastralGML(report);
  };

  const getCatastroInfo = (
    rc: string,
    jurisdiction?: string
  ): { url: string; label: string; fullTitle: string } => {
    const clean = rc.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const resolvedJurisdiction = jurisdiction || detectCadastralJurisdiction(clean);

    if (resolvedJurisdiction === 'bizkaia') {
      return {
        url: 'https://www.bizkaia.eus/es/catastro-de-bizkaia',
        label: 'Sede Bizkaia',
        fullTitle: 'Ver en Sede del Catastro Foral de Bizkaia',
      };
    }
    if (resolvedJurisdiction === 'gipuzkoa') {
      return {
        url: 'https://www.gipuzkoa.eus/es/web/ogasuna/catastro',
        label: 'Sede Gipuzkoa',
        fullTitle: 'Ver en Sede del Catastro Foral de Gipuzkoa',
      };
    }
    if (resolvedJurisdiction === 'araba') {
      return {
        url: 'https://geo.araba.eus/',
        label: 'Sede Álava',
        fullTitle: 'Ver en GeoAraba / Catastro de Álava',
      };
    }
    if (resolvedJurisdiction === 'navarra') {
      return {
        url: 'https://catastro.navarra.es/',
        label: 'Sede Navarra',
        fullTitle: 'Ver en Sede del Catastro de Navarra (SITNA)',
      };
    }

    const rc1 = clean.slice(0, 7);
    const rc2 = clean.slice(7, 14);
    return {
      url: `https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=${encodeURIComponent(rc1)}&rc2=${encodeURIComponent(rc2)}`,
      label: 'Sede',
      fullTitle: 'Ver en Sede Electrónica del Catastro (Ministerio de Hacienda)',
    };
  };

  const effectiveUse = property.unit?.use || property.building.primaryUse;
  const typology: PropertyTypology = report.typology ?? property.typology ?? detectPropertyTypology(
    effectiveUse,
    property.building.constructionYear,
    property.building.unitsCount,
    property.cadastralReference
  );

  const isRustic = typology === 'RUSTIC';
  const isVacantPlot = typology === 'VACANT_PLOT';
  const isUnbuilt =
    isRustic ||
    isVacantPlot ||
    (property.building.builtSurfaceM2 === 0 && (!property.unit || property.unit.builtSurfaceM2 === 0));
  const plotArea = property.plotSurfaceM2 || property.building.plotSurfaceM2 || 0;

  const getLandClassificationLabel = (
    classification?: LandClassification,
    propTypology?: PropertyTypology
  ): string => {
    switch (classification) {
      case 'RUSTIC_PROTECTED':
        return t('dossier.landClassificationSNUP');
      case 'RUSTIC_COMMON':
        return t('dossier.landClassificationSNUC');
      case 'DEVELOPABLE':
        return t('dossier.landClassificationSURB');
      case 'URBAN_UNCONSOLIDATED':
        return t('dossier.landClassificationSUNC');
      case 'URBAN_CONSOLIDATED':
        return t('dossier.landClassificationSUC');
      default:
        return propTypology === 'RUSTIC'
          ? t('dossier.landClassificationSNUC')
          : propTypology === 'VACANT_PLOT'
            ? t('dossier.typologyVacantPlot')
            : t('dossier.landClassificationSUC');
    }
  };

  const getTypologyBadge = (typ: PropertyTypology, year: number, primaryUse: string) => {
    switch (typ) {
      case 'VACANT_PLOT':
        return {
          label: t('dossier.typologyVacantPlot'),
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'INDUSTRIAL':
        return {
          label: t('dossier.typologyIndustrial'),
          className: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'RUSTIC':
        return {
          label: t('dossier.typologyRustic'),
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'COMMERCIAL':
        return {
          label: t('dossier.typologyCommercial'),
          className: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'EQUIPMENT':
        return {
          label: t('dossier.typologyEquipment'),
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'RESIDENTIAL':
      default:
        return {
          label: year > 0 && year < 1940 ? t('dossier.typologyHistoric') : (primaryUse || t('dossier.typologyResidential')),
          className: 'bg-primary-container/20 text-primary border-primary/40',
        };
    }
  };

  const typologyBadge = getTypologyBadge(typology, property.building.constructionYear, property.building.primaryUse);
  const districtLabel = `${property.address.municipality} · Sección ${neighborhood.censusSectionCode ? neighborhood.censusSectionCode.slice(-3) : '—'}`;

  return (
    <div className="dossier-container w-full h-full bg-surface overflow-y-auto flex flex-col divide-y divide-outline-variant text-on-surface">
      {/* 1. PROPERTY DOSSIER HEADER (Stitch Civic Precision) */}
      <div className="p-space-lg bg-surface-container-low shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                data-testid="dossier-typology-badge"
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border font-semibold ${typologyBadge.className}`}
              >
                {typologyBadge.label}
              </span>
              <span className="text-xs font-mono text-outline">{districtLabel}</span>
            </div>

            <h1 className="font-headline text-xl sm:text-2xl font-bold text-on-surface tracking-tight leading-tight">
              {fullAddress}
            </h1>

            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-outline shrink-0" />
              <span>
                {property.address.province} ·{' '}
                {property.unit
                  ? `${property.unit.builtSurfaceM2.toLocaleString('es-ES')} m² privativos (Edificio Año ${property.building.constructionYear || '—'})`
                  : isUnbuilt || property.building.builtSurfaceM2 === 0
                    ? `${(plotArea || property.building.builtSurfaceM2 || 0).toLocaleString('es-ES')} m² de terreno · ${isRustic ? 'Finca Rústica' : 'Solar Urbano'}`
                    : `${property.building.builtSurfaceM2.toLocaleString('es-ES')} m² ${
                        property.building.constructionYear > 0
                          ? `construidos (Año ${property.building.constructionYear})`
                          : 'superficie (Suelo sin edificar)'
                      }`}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-2 rounded hover:bg-surface-container transition-colors ${
              bookmarked ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
            title={bookmarked ? t('dossier.bookmarkSaved') : t('dossier.bookmarkProperty')}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-primary' : ''}`} />
          </button>
        </div>

        {/* Cadastral Pill Box */}
        <div className="mt-3.5 p-2 bg-surface-container border border-outline-variant rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <MapPin className="text-secondary w-4 h-4 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-mono text-outline uppercase leading-none">
                {t('dossier.cadastralRef')}
              </span>
              <span className="font-mono text-xs sm:text-sm text-on-surface font-semibold truncate tracking-wider mt-0.5">
                {property.cadastralReference}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleCopyRefcat}
              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-mono rounded border border-outline-variant transition-colors flex items-center gap-1 cursor-pointer"
              title={t('dossier.copyRefcat')}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary">{t('dossier.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('dossier.copyRefcat')}</span>
                </>
              )}
            </button>

            {(() => {
              const sedeInfo = getCatastroInfo(property.cadastralReference, property.jurisdiction);
              return (
                <a
                  href={sedeInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-mono rounded border border-outline-variant transition-colors flex items-center gap-1 cursor-pointer"
                  title={sedeInfo.fullTitle}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-tertiary" />
                  <span className="hidden sm:inline">{sedeInfo.label}</span>
                </a>
              );
            })()}
          </div>
        </div>

        {/* Horizontal Division Unit Picker Banner */}
        {onOpenUnitPicker && Boolean(property.unit || (property.building?.unitsCount && property.building.unitsCount > 1)) && (
          <div className="mt-2.5 p-2.5 bg-surface-container-high/80 border border-primary/30 rounded-lg flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <div className="min-w-0">
                {property.unit ? (
                  <p className="font-semibold text-on-surface truncate">
                    {t('dossier.privateUnit')}: {unitDetail} ({property.unit.builtSurfaceM2} m²
                    {property.unit.participationCoefficient ? ` · cpt: ${property.unit.participationCoefficient}%` : ''})
                  </p>
                ) : (
                  <p className="font-semibold text-on-surface truncate">
                    {t('dossier.horizontalDivisionTitle')} ({property.building.unitsCount} {t('dossier.unitsRegistered')})
                  </p>
                )}
                <p className="text-[10px] text-on-surface-variant truncate">
                  {property.unit ? t('dossier.unitPickerSubtitleSpecific') : t('dossier.unitPickerSubtitleBuilding')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenUnitPicker?.()}
              className="px-2.5 py-1.5 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-[11px] font-mono transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{property.unit ? `${t('dossier.changeUnit')} ▾` : `${t('dossier.viewUnits')} ▾`}</span>
            </button>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="mt-3 flex items-center gap-2 no-print flex-wrap">
          {onOpenDuel && (
            <button
              type="button"
              data-testid="dossier-duel-btn"
              onClick={onOpenDuel}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t('dossier.compareDuelTooltip')}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>{t('dossier.addToDuel')}</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadGML}
            className="bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title={t('dossier.downloadGmlTooltip')}
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>{t('dossier.downloadGml')}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="bg-inverse-primary hover:bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title={t('dossier.exportPdfTooltip')}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('dossier.exportPdf')}</span>
          </button>

          <span className="text-[10px] font-mono text-outline ml-auto flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formattedDate}
          </span>
        </div>
      </div>

      {/* 2. SEGMENTED DOSSIER TAB NAVIGATION BAR (Fase 15B) */}
      <nav className="flex items-center border-b border-outline-variant bg-surface-container shrink-0 px-2 no-print" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'summary'}
          onClick={() => handleTabClick('summary')}
          className={`flex-1 py-3 text-center font-mono text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            currentTab === 'summary'
              ? 'text-primary border-primary bg-surface-container-low/50'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{t('dossier.tabSummary')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'building'}
          onClick={() => handleTabClick('building')}
          className={`flex-1 py-3 text-center font-mono text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            currentTab === 'building'
              ? 'text-primary border-primary bg-surface-container-low/50'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{t('dossier.tabBuilding')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'environment'}
          onClick={() => handleTabClick('environment')}
          className={`flex-1 py-3 text-center font-mono text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            currentTab === 'environment'
              ? 'text-primary border-primary bg-surface-container-low/50'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t('dossier.tabEnvironment')}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'market'}
          onClick={() => handleTabClick('market')}
          className={`flex-1 py-3 text-center font-mono text-xs font-semibold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            currentTab === 'market'
              ? 'text-primary border-primary bg-surface-container-low/50'
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>{t('dossier.tabMarket')}</span>
        </button>
      </nav>

      {/* 3. TAB PANELS CONTENT AREA */}
      <div className="flex-1 overflow-y-auto">
        {/* ================= TAB 1: RESUMEN & SCORE ================= */}
        <div
          role="tabpanel"
          data-testid="tab-summary"
          className={currentTab === 'summary' ? 'space-y-4 pt-2' : 'hidden'}
        >
          {/* Critical Alert Banner (Banderas Rojas - Inundación, Discrepancia Catastral, CEE, Infravivienda) */}
          {(() => {
            const hasDiscrepancyAlert = Boolean(
              score.keyRisks.some(
                (r) =>
                  r.toLowerCase().includes('discrepancia') ||
                  r.toLowerCase().includes('superficie') ||
                  r.toLowerCase().includes('m²')
              )
            );
            const hasFloodAlert =
              environment.floodRisk.level !== 'NONE' &&
              (environment.floodRisk.level === 'HIGH' ||
                environment.floodRisk.level === 'MEDIUM' ||
                (environment.floodRisk.returnPeriodYears !== null &&
                  environment.floodRisk.returnPeriodYears <= 500));
            const hasExpiredCee = Boolean(energy?.isExpired);
            const hasSubstandard = isSubstandardHousing(report);
            const activeInspection = buildingInspection || evaluateBuildingInspectionAlert(property);
            const activeSeismic = seismicHazard || evaluateSeismicVulnerability(
              property.address.municipalityCode || '28079',
              property.building.constructionYear,
              undefined,
              property.address.municipality,
              property.address.provinceCode
            );

            const criticalAlerts: string[] = [];
            if (hasSubstandard) {
              criticalAlerts.push(t('dossier.substandardHousingAlert'));
            }
            if (activeInspection.status === 'UNFAVORABLE') {
              criticalAlerts.push(t('dossier.iteUnfavorableAlert'));
            } else if (activeInspection.isPreventiveAlert) {
              criticalAlerts.push(t('dossier.itePreventiveAlert'));
            }
            if (activeSeismic.isVulnerableToSeismic) {
              criticalAlerts.push(t('dossier.seismicVulnerabilityAlert'));
            }
            if (hasDiscrepancyAlert) {
              criticalAlerts.push(t('dossier.discrepancyAlert'));
            }
            if (hasFloodAlert) {
              criticalAlerts.push(t('dossier.floodAlert', { level: environment.floodRisk.level }));
            }
            if (hasExpiredCee) {
              criticalAlerts.push(t('dossier.expiredCeeAlert'));
            }
            if (criticalAlerts.length === 0) return null;

            return (
              <div
                data-testid="dossier-critical-alert-banner"
                className="mx-space-lg p-3 rounded-xl bg-rose-950/60 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold font-mono uppercase text-[10px] tracking-wide text-rose-300 block">
                    {t('dossier.criticalAlertDetected')}
                  </span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-200 font-mono">
                    {criticalAlerts.map((alert, i) => (
                      <li key={i}>{alert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* Prominent Red Warning Banner for Substandard Housing / Presunto Local */}
          {isSubstandardHousing(report) && (
            <div
              data-testid="substandard-housing-warning"
              className="mx-space-lg p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 shadow-xl flex items-start gap-3.5 animate-in fade-in zoom-in-95"
            >
              <div className="p-2 rounded-lg bg-rose-900/80 border border-rose-400 text-rose-300 shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-headline font-bold text-sm text-rose-200 uppercase tracking-wide">
                    {t('dossier.substandardHousingTitle')}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-400 text-[10px] font-mono text-rose-200 uppercase font-semibold">
                    Alerta Crítica
                  </span>
                </div>
                <p className="text-xs font-body text-rose-200/90 leading-relaxed">
                  {t('dossier.substandardHousingDesc')}
                </p>
                <div className="text-[11px] font-mono text-rose-300 pt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{t('dossier.substandardCheckAdvice')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Technical Audit & Pillar Overview */}
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="page-break-inside-avoid">
              <ScoreGauge
                score={score}
                cityOrProvince={property.address.province}
                percentile={neighborhood.percentileInMunicipality}
                typology={typology}
              />
            </div>

            <div className="px-space-lg">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between text-xs">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>{t('dossier.landClassification')}</span>
                </span>
                <span className="font-mono text-primary font-bold">
                  {getLandClassificationLabel(urbanPlanning?.landClassification, typology)}
                </span>
              </div>
            </div>

            <div className="page-break-inside-avoid">
              <HighlightsAndRisks
                highlights={score.keyHighlights}
                risks={score.keyRisks}
                refcat={property.cadastralReference}
                municipality={property.address.municipality}
              />
            </div>
          </div>
        </div>

        {/* ================= TAB 2: EDIFICIO & SOSTENIBILIDAD ================= */}
        <div
          role="tabpanel"
          data-testid="tab-building"
          className={currentTab === 'building' ? 'space-y-4 p-space-lg' : 'hidden'}
        >
          {/* Cadastral Building Technical Overview */}
          <div className="page-break-inside-avoid">
            <BuildingCadastralCard property={property} urbanPlanning={urbanPlanning} />
          </div>

          {/* Technical Building Inspection (ITE/IEE) */}
          {!isUnbuilt && (
            <div className="page-break-inside-avoid">
              <BuildingInspectionCard
                inspection={buildingInspection || evaluateBuildingInspectionAlert(property)}
                property={property}
              />
            </div>
          )}

          {/* IGN NCSE-02 Seismic Hazard & Vulnerability */}
          <div className="page-break-inside-avoid">
            <SeismicSafetyCard
              seismic={
                seismicHazard ||
                evaluateSeismicVulnerability(
                  property.address.municipalityCode || '28079',
                  property.building.constructionYear,
                  undefined,
                  property.address.municipality,
                  property.address.provinceCode
                )
              }
              constructionYear={property.building.constructionYear}
              municipality={property.address.municipality}
            />
          </div>

          {/* Radon Geological Evaluation */}
          {radon && (
            <div className="page-break-inside-avoid">
              <RadonCard
                radon={radon}
                municipality={property.address.municipality}
                floor={property.unit?.floor}
              />
            </div>
          )}

          {/* Building CapEx & Energy Diagnostics (Adapted for Non-Residential Typologies) */}
          {typology === 'VACANT_PLOT' ? (
            <div data-testid="vacant-plot-notice" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <span>{t('dossier.vacantPlotTitle')}</span>
              </div>
              <p className="text-on-surface-variant">
                {t('dossier.vacantPlotDesc')}
              </p>
            </div>
          ) : typology === 'RUSTIC' ? (
            <div data-testid="rustic-plot-notice" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span>{t('dossier.rusticPlotTitle')}</span>
              </div>
              <p className="text-on-surface-variant">
                {t('dossier.rusticPlotDesc')}
              </p>
            </div>
          ) : typology === 'INDUSTRIAL' ? (
            <div data-testid="industrial-notice" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <span>{t('dossier.industrialTitle')}</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {t('dossier.industrialDesc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">{t('dossier.fireRegulation')}</span>
                  <span className="text-primary font-semibold">RSCIEI / CTE DB-SI</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">{t('dossier.roofEnclosure')}</span>
                  <span className="text-on-surface font-semibold">{t('dossier.leakInspection')}</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">{t('dossier.communityRegime')}</span>
                  <span className="text-emerald-400 font-semibold">{t('dossier.exemptDerramas')}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {report.capex && (
                <div className="page-break-inside-avoid">
                  <BuildingCapExCard report={report} />
                </div>
              )}
              {/* CEE Energy Performance */}
              {energy && (
                <div className="page-break-inside-avoid">
                  <EnergyPerformanceCard energy={energy} />
                </div>
              )}
            </>
          )}
        </div>

        {/* ================= TAB 3: ENTORNO & CONECTIVIDAD ================= */}
        <div
          role="tabpanel"
          data-testid="tab-environment"
          className={currentTab === 'environment' ? 'space-y-4 p-space-lg' : 'hidden'}
        >
          {/* VUT Tourist Saturation Risk */}
          {vut && (
            <div className="page-break-inside-avoid">
              <VutSaturationCard vut={vut} />
            </div>
          )}

          {/* 15-Minute City Pedestrian Isochrones & Catchment */}
          <div className="page-break-inside-avoid">
            <PedestrianIsochronesCard
              isochrones={pedestrianIsochrones}
              connectivity={connectivity}
            />
          </div>

          {/* 5 Dedicated Pillars */}
          <div className="page-break-inside-avoid">
            <PillarCards
              property={property}
              neighborhood={neighborhood}
              environment={environment}
              connectivity={connectivity}
              urbanPlanning={urbanPlanning}
              rentalBenchmark={rentalBenchmark}
              hideConnectivityPillar={true}
              hideBuildingPillar={true}
            />
          </div>
        </div>

        {/* ================= TAB 4: MERCADO & FINANZAS ================= */}
        <div
          role="tabpanel"
          data-testid="tab-market"
          className={currentTab === 'market' ? 'space-y-4 p-space-lg' : 'hidden'}
        >
          {/* Fiscal Simulator & Surface Discrepancy */}
          <div className="page-break-inside-avoid">
            <FiscalSimulatorCard property={property} fiscal={fiscal} typology={typology} />
          </div>

          {/* MIVAU SERPAVI Rental Module (Only shown for residential typologies) */}
          {rentalBenchmark && typology === 'RESIDENTIAL' && (
            <div className="page-break-inside-avoid">
              <RentalModule rental={rentalBenchmark} />
            </div>
          )}

          {/* Longitudinal Market & Neighborhood Trends */}
          {marketTrends && (
            <div className="page-break-inside-avoid">
              <NeighborhoodTrendsCard trends={marketTrends} typology={typology} />
            </div>
          )}
        </div>
      </div>

      {/* 4. METHODOLOGICAL & LEGAL DISCLAIMER */}
      <div className="p-space-lg bg-surface text-[11px] text-outline font-mono leading-relaxed space-y-1 shrink-0">
        <p className="font-semibold text-on-surface-variant">
          {t('dossier.methodologicalNote')}
        </p>
        <p>
          {t('dossier.methodologicalDesc')}
        </p>
      </div>
    </div>
  );
}

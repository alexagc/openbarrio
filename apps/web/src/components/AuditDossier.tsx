import { useState } from 'react';
import {
  PropertyAuditReport,
  PropertyTypology,
  LandClassification,
  detectPropertyTypology,
  detectCadastralJurisdiction,
} from '@openbarrio/core';
import { ScoreGauge } from './ScoreGauge';
import { PillarCards } from './PillarCard';
import { RentalModule } from './RentalModule';
import { HighlightsAndRisks } from './HighlightsAndRisks';
import { BuildingCapExCard } from './dossier/BuildingCapExCard';
import { EnergyPerformanceCard } from './dossier/EnergyPerformanceCard';
import { NeighborhoodTrendsCard } from './dossier/NeighborhoodTrendsCard';
import { RadonCard } from './dossier/RadonCard';
import { VutSaturationCard } from './dossier/VutSaturationCard';
import { FiscalSimulatorCard } from './dossier/FiscalSimulatorCard';
import { downloadCadastralGML } from '../utils/gml';
import { DossierTab } from '../hooks/useUrlSync';
import { useWorkspaceStore } from '../store/workspace.store';
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

  const formattedDate = new Date(generatedAt).toLocaleDateString('es-ES', {
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
        return 'Suelo No Urbanizable Protegido (SNU-P) · Régimen Rústico';
      case 'RUSTIC_COMMON':
        return 'Suelo No Urbanizable Común (SNU-C) · Rústico Ordinario';
      case 'DEVELOPABLE':
        return 'Suelo Urbanizable (SURB) · Desarrollo Pendiente';
      case 'URBAN_UNCONSOLIDATED':
        return 'Suelo Urbano No Consolidado (SUNC) · Gestión Pendiente';
      case 'URBAN_CONSOLIDATED':
        return 'Régimen SUC Consolidado · INSPIRE Compliant';
      default:
        return propTypology === 'RUSTIC'
          ? 'Suelo Rústico · No Urbanizable'
          : propTypology === 'VACANT_PLOT'
            ? 'Solar Urbano · Suelo sin edificar'
            : 'Suelo Urbano Consolidado (SUC)';
    }
  };

  const getTypologyBadge = (typ: PropertyTypology, year: number, primaryUse: string) => {
    switch (typ) {
      case 'VACANT_PLOT':
        return {
          label: 'Solar Urbano · Suelo sin edificar',
          className: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        };
      case 'INDUSTRIAL':
        return {
          label: 'Nave Industrial / Logístico',
          className: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        };
      case 'RUSTIC':
        return {
          label: 'Finca Rústica / Agrario',
          className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        };
      case 'COMMERCIAL':
        return {
          label: 'Local Comercial / Terciario',
          className: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
      case 'EQUIPMENT':
        return {
          label: 'Dotacional / Equipamiento',
          className: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        };
      case 'RESIDENTIAL':
      default:
        return {
          label: year > 0 && year < 1940 ? 'Edificio Singular Histórico' : (primaryUse || 'Residencial Colectivo'),
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
            title="Marcar inmueble como guardado"
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
                Referencia Catastral Inmueble
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
              title="Copiar Referencia Catastral"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary">Copiada</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
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
                    Inmueble Privativo: {unitDetail} ({property.unit.builtSurfaceM2} m²
                    {property.unit.participationCoefficient ? ` · cpt: ${property.unit.participationCoefficient}%` : ''})
                  </p>
                ) : (
                  <p className="font-semibold text-on-surface truncate">
                    Edificio en División Horizontal ({property.building.unitsCount} inmuebles registrados)
                  </p>
                )}
                <p className="text-[10px] text-on-surface-variant truncate">
                  {property.unit ? 'Auditoría individualizada con cuota de comunidad y SERPAVI recalculados' : 'Puedes auditar una vivienda o local específico'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenUnitPicker?.()}
              className="px-2.5 py-1.5 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-[11px] font-mono transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{property.unit ? 'Cambiar inmueble ▾' : 'Ver inmuebles ▾'}</span>
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
              title="Comparar este inmueble en duelo 1 vs 1"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Añadir a Comparar</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleDownloadGML}
            className="bg-surface-container-high hover:bg-surface-variant text-on-surface border border-outline-variant text-xs font-mono px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar archivo GML INSPIRE oficial de la parcela"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            <span>Descargar GML</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="bg-inverse-primary hover:bg-primary-container text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            title="Exportar informe de due diligence en formato PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Exportar Dossier PDF</span>
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
          <span>Resumen & Score</span>
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
          <span>Edificio & Sostenibilidad</span>
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
          <span>Entorno & Conectividad</span>
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
          <span>Mercado & Finanzas</span>
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
          {/* Critical Alert Banner (Banderas Rojas - Inundación, Discrepancia Catastral, CEE) */}
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

            const criticalAlerts: string[] = [];
            if (hasDiscrepancyAlert) {
              criticalAlerts.push('Discrepancia de superficie privativa >15% respecto a registros oficiales');
            }
            if (hasFloodAlert) {
              criticalAlerts.push(`Afección por lámina de inundabilidad fluvial SNCZI (${environment.floodRisk.level})`);
            }
            if (hasExpiredCee) {
              criticalAlerts.push('Certificado Energético (CEE) caducado según RD 390/2021');
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
                    Alerta Máxima Detectada · Atención Crítica Requerida
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
                  <span>Régimen Urbanístico del Suelo:</span>
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
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-3">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <span className="font-headline text-sm font-bold text-on-surface">Datos Registrales Catastro</span>
              <span className="font-mono text-xs text-primary font-semibold">Año {property.building.constructionYear}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-on-surface-variant block">
                  {isUnbuilt ? 'Superficie de Parcela' : 'Superficie Construida'}
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {(isUnbuilt ? (plotArea || property.building.builtSurfaceM2 || 0) : property.building.builtSurfaceM2).toLocaleString('es-ES')} m² {isUnbuilt ? 'terreno' : ''}
                </span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Uso Principal</span>
                <span className="font-semibold text-on-surface">{property.building.primaryUse}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Inmuebles Registrados</span>
                <span className="font-mono font-bold text-on-surface">{property.building.unitsCount || 1} unidades</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Planta Baja Comercial</span>
                <span className="font-semibold text-on-surface">{property.building.hasCommercialGroundFloor ? 'Sí (Local PB)' : 'No'}</span>
              </div>
            </div>
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
                <span>🏗️ Parcela sin edificación existente</span>
              </div>
              <p className="text-on-surface-variant">
                Al tratarse de un solar urbano vacante, no aplican inspecciones técnicas de la edificación (ITE/IEE), certificados de eficiencia energética (CEE) ni derramas de conservación comunitaria.
              </p>
            </div>
          ) : typology === 'RUSTIC' ? (
            <div data-testid="rustic-plot-notice" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span>🌾 Finca rústica / Parcela no residencial</span>
              </div>
              <p className="text-on-surface-variant">
                Inmueble de naturaleza rústica o agraria no sujeto a régimen de propiedad horizontal residencial ni certificados energéticos de edificación continua.
              </p>
            </div>
          ) : typology === 'INDUSTRIAL' ? (
            <div data-testid="industrial-notice" className="p-4 rounded-lg bg-surface-container-low border border-outline-variant text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <span>🏭 Diagnóstico Técnico & CapEx Industrial (RSCIEI)</span>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Inmueble de naturaleza industrial / logística. No aplican derramas vecinales de propiedad horizontal residencial. La diligencia técnica se rige por el <strong>RSCIEI (Reglamento de Seguridad Contra Incendios en Establecimientos Industriales, RD 2267/2004)</strong>, sobrecargas de solera, altura libre y estanqueidad de cubiertas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">Normativa de Incendios</span>
                  <span className="text-primary font-semibold">RSCIEI / CTE DB-SI</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">Cubiertas & Envolvente</span>
                  <span className="text-on-surface font-semibold">Inspección de estanqueidad</span>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant/60">
                  <span className="text-outline block text-[10px]">Régimen de Comunidad</span>
                  <span className="text-emerald-400 font-semibold">Exento de derramas vecinales</span>
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

          {/* 5 Dedicated Pillars */}
          <div className="page-break-inside-avoid">
            <PillarCards
              property={property}
              neighborhood={neighborhood}
              environment={environment}
              connectivity={connectivity}
              urbanPlanning={urbanPlanning}
              rentalBenchmark={rentalBenchmark}
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
          Nota Metodológica & Descargo Cívico:
        </p>
        <p>
          Este informe ha sido generado de forma automatizada por la plataforma de código abierto OpenBarrio mediante agregación y normalización en tiempo real de registros públicos de la Sede Electrónica del Catastro (OVC), Instituto Nacional de Estadística (INE ADRH), Ministerio para la Transición Ecológica (MITECO SICA y SNCZI) y Ministerio de Vivienda y Agenda Urbana (MIVAU SERPAVI). Los datos ofrecidos tienen carácter informativo y no sustituyen certificaciones administrativas formales ni tasaciones periciales oficiales.
        </p>
      </div>
    </div>
  );
}

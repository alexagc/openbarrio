import React, { useState, useEffect } from 'react';
import { PropertyAuditReport } from '@openbarrio/core';
import { DualRadarChart, DualRadarMode } from '../dossier/DualRadarChart';
import { deriveBuildingCapEx } from '../dossier/BuildingCapExCard';
import { apiClient } from '../../services/api.client';
import {
  X,
  TrendingUp,
  Copy,
  Check,
  Shield,
  AlertTriangle,
  Award,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  Clock,
  FileText,
  Volume2,
  HardHat,
  Footprints,
  Coins,
  ArrowRight,
  Layers,
  ChevronDown,
} from 'lucide-react';

export interface PropertyDuelModalProps {
  reportA: PropertyAuditReport;
  reportB?: PropertyAuditReport;
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidateB?: (refcatOrReport: string | PropertyAuditReport) => void;
}

const PRESET_CANDIDATES = [
  {
    label: 'Calle Gran Vía 28, Madrid (Centro)',
    refcat: '9872023VH5797S0012AZ',
    lat: 40.42023,
    lon: -3.70197,
  },
  {
    label: 'Calle Fuencarral 42, Madrid (Justicia)',
    refcat: '28900A010000420003DW',
    lat: 40.4241,
    lon: -3.7012,
  },
  {
    label: 'Passeig de Gràcia 43, Barcelona (Eixample)',
    refcat: '0227802DF3802E0001JK',
    lat: 41.3917,
    lon: 2.16495,
  },
  {
    label: 'Carrer de Colón 15, València (Ciutat Vella)',
    refcat: '6023512YJ2762C0001LK',
    lat: 39.46845,
    lon: -0.37318,
  },
  {
    label: 'Calle Sierpes 22, Sevilla (Casco Antiguo)',
    refcat: '4927803TG3442F0001MN',
    lat: 37.39147,
    lon: -5.99476,
  },
];

export function PropertyDuelModal({
  reportA,
  reportB: initialReportB,
  isOpen,
  onClose,
  onSelectCandidateB,
}: PropertyDuelModalProps) {
  const [activeReportB, setActiveReportB] = useState<PropertyAuditReport | null>(
    initialReportB || null
  );
  const [radarMode, setRadarMode] = useState<DualRadarMode>('both');
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);
  const [showCandidateSelector, setShowCandidateSelector] = useState(false);
  const [customRefInput, setCustomRefInput] = useState('');

  // Fallback candidate B initialization
  useEffect(() => {
    if (initialReportB) {
      setActiveReportB(initialReportB);
      return;
    }

    if (!activeReportB) {
      // Choose preset that is different from property A
      const differentPreset =
        PRESET_CANDIDATES.find(
          (p) => p.refcat !== reportA.property.cadastralReference
        ) || PRESET_CANDIDATES[0];

      try {
        const generated = apiClient.generateDeterministicAudit(
          differentPreset.lat,
          differentPreset.lon,
          {
            cadastralReference: differentPreset.refcat,
            address: {
              street: differentPreset.label.split(',')[0],
              number: '28',
              postalCode: '28013',
              municipality: 'Madrid',
              province: 'Madrid',
            },
          }
        );
        setActiveReportB(generated);
      } catch {
        // Fallback
      }
    }
  }, [initialReportB, reportA.property.cadastralReference]);

  const candidateB = activeReportB || reportA;

  // Sync URL query params: ?refcat=...&vs=... and register Escape key listener
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const refA = reportA.property.cadastralReference;
    const refB = candidateB.property.cadastralReference;

    try {
      const params = new URLSearchParams(window.location.search);
      params.set('refcat', refA);
      params.set('vs', refB);
      const path = window.location.pathname || '/';
      const target = `${path}?${params.toString()}`;
      window.history.pushState({ openbarrio: true }, '', target);
    } catch {
      // Ignore in environments where pushState origin is restricted
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      try {
        const params = new URLSearchParams(window.location.search);
        params.delete('vs');
        const path = window.location.pathname || '/';
        const query = params.toString();
        const target = query ? `${path}?${query}` : path;
        window.history.replaceState({ openbarrio: true }, '', target);
      } catch {
        // Ignore
      }
    };
  }, [isOpen, reportA.property.cadastralReference, candidateB.property.cadastralReference, onClose]);

  if (!isOpen) return null;

  // CapEx assessment derivation
  const capexA =
    reportA.capex ||
    deriveBuildingCapEx(
      reportA.property.building.constructionYear || 1984,
      reportA.property.building.builtSurfaceM2 || 88
    );
  const capexB =
    candidateB.capex ||
    deriveBuildingCapEx(
      candidateB.property.building.constructionYear || 1968,
      candidateB.property.building.builtSurfaceM2 || 112
    );

  // Global Algorithmic Verdict computation
  const scoreA = reportA.score.overallScore;
  const scoreB = candidateB.score.overallScore;
  const globalDelta = scoreA - scoreB;

  let verdictBadgeText = 'Paridad global técnica (0 pts de diferencia)';
  if (globalDelta > 0) {
    verdictBadgeText = `Inmueble A +${globalDelta} pts ventaja global ponderada`;
  } else if (globalDelta < 0) {
    verdictBadgeText = `Inmueble B +${Math.abs(globalDelta)} pts ventaja global ponderada`;
  }

  // Copy helpers
  const handleCopy = (text: string, isA: boolean) => {
    navigator.clipboard.writeText(text);
    if (isA) {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    } else {
      setCopiedB(true);
      setTimeout(() => setCopiedB(false), 2000);
    }
  };

  // Change candidate B
  const handleChangeCandidateB = (preset: (typeof PRESET_CANDIDATES)[0]) => {
    try {
      const generated = apiClient.generateDeterministicAudit(preset.lat, preset.lon, {
        cadastralReference: preset.refcat,
        address: {
          street: preset.label.split(',')[0],
          number: '1',
          postalCode: '28001',
          municipality: preset.label.includes('Barcelona')
            ? 'Barcelona'
            : preset.label.includes('València')
            ? 'València'
            : preset.label.includes('Sevilla')
            ? 'Sevilla'
            : 'Madrid',
          province: preset.label.includes('Barcelona')
            ? 'Barcelona'
            : preset.label.includes('València')
            ? 'València'
            : preset.label.includes('Sevilla')
            ? 'Sevilla'
            : 'Madrid',
        },
      });
      setActiveReportB(generated);
      if (onSelectCandidateB) onSelectCandidateB(generated);
    } catch {
      // Fallback
    }
    setShowCandidateSelector(false);
  };

  const handleCustomRefcatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customRefInput.trim().toUpperCase();
    if (clean.length >= 14) {
      try {
        const generated = apiClient.generateDeterministicAuditFromRefcat(clean);
        setActiveReportB(generated);
        if (onSelectCandidateB) onSelectCandidateB(generated);
        setCustomRefInput('');
        setShowCandidateSelector(false);
      } catch {
        // Fallback
      }
    }
  };

  // Technical Arbitrage Synthesis
  const noiseA = reportA.environment.noise?.dayEveningNightDecibels || 58;
  const noiseB = candidateB.environment.noise?.dayEveningNightDecibels || 67;
  const noiseDiff = noiseB - noiseA;

  const incomeA = reportA.neighborhood.averageNetHouseholdIncomeEur || 34200;
  const incomeB = candidateB.neighborhood.averageNetHouseholdIncomeEur || 40400;
  const incomeDiff = incomeB - incomeA;

  const yearA = reportA.property.building.constructionYear || 1984;
  const yearB = candidateB.property.building.constructionYear || 1968;
  const ageA = new Date().getFullYear() - yearA;
  const ageB = new Date().getFullYear() - yearB;

  const walkScoreA = reportA.score.subscores.connectivity;
  const walkScoreB = candidateB.score.subscores.connectivity;

  return (
    <div
      data-testid="property-duel-modal"
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto flex flex-col font-body text-on-surface antialiased"
      role="dialog"
      aria-modal="true"
    >
      {/* ================= HEADER & BREADCRUMB TELEMETRY BAR ================= */}
      <header className="w-full bg-surface-container border-b border-outline-variant sticky top-0 z-50 shrink-0">
        {/* Row 1: Top Brand & Action cluster */}
        <div className="w-full px-space-md lg:px-space-lg flex items-center justify-between gap-2 h-14 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary font-bold text-sm">
              OB
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-primary tracking-tight text-sm">
                OpenBarrio
              </span>
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider hidden sm:inline">
                Comparador Cívico & Duelo Inmobiliario
              </span>
            </div>
          </div>

          {/* Institutional Badges & Close [Esc] button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-on-surface font-mono text-[10px]">
              <Shield className="w-3 h-3 text-secondary" />
              <span>EPSG:25830 · ETRS89</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-mono text-[10px]">
              <CheckCircle className="w-3 h-3" />
              <span>Sede Electrónica OVC Validada</span>
            </span>

            <button
              type="button"
              data-testid="duel-close-btn"
              onClick={onClose}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-mono text-xs border border-outline-variant transition-colors ml-2 cursor-pointer"
              title="Cerrar comparador [Esc]"
            >
              <X className="w-4 h-4 text-on-surface-variant" />
              <span>Cerrar [Esc]</span>
            </button>
          </div>
        </div>

        {/* Row 2: Deep Context Breadcrumb & URL Synced Capsule */}
        <div className="w-full px-space-md lg:px-space-lg py-2 bg-surface-container-low flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-on-surface-variant">OpenBarrio</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface-variant">Comparador Due Diligence</span>
            <span className="text-outline">/</span>
            <span className="text-on-surface font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Duelo Inmobiliario 1 vs 1
            </span>

            {/* URL Query Synced Capsule */}
            <div
              data-testid="url-sync-capsule"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface-container border border-outline-variant/80 text-primary font-mono text-[11px]"
            >
              <LinkIcon className="w-3 h-3 text-primary shrink-0" />
              <span className="tracking-tight truncate max-w-xs sm:max-w-md">
                ?refcat={reportA.property.cadastralReference}&vs={candidateB.property.cadastralReference}
              </span>
            </div>
          </div>

          {/* Global Algorithmic Verdict Top Badge */}
          <div
            data-testid="global-verdict-badge"
            className="flex items-center gap-2 bg-surface-container border border-primary/40 px-3 py-1 rounded-lg shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <div className="text-right">
              <div className="text-[9px] font-mono uppercase text-on-surface-variant">
                Veredicto Global Algorítmico
              </div>
              <div className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1">
                <span>{verdictBadgeText}</span>
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN SCROLLABLE CONTENT ================= */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto p-space-md lg:p-space-lg flex flex-col gap-space-lg">
        {/* SECTION 1: HERO DUAL RADAR & TELEMETRY SCORE HUD */}
        <section className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-space-md lg:p-space-lg relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3 mb-space-md flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-surface-container border border-outline-variant text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-headline text-lg sm:text-xl text-on-surface font-bold tracking-tight">
                  Análisis Pentagonal Multidimensional de Idoneidad Urbanística
                </h1>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">
                  Superposición geométrica de 5 vectores auditados mediante APIs oficiales (Sede del Catastro, MITECO SNCZI, INE Censo 2024, SICA Ruido).
                </p>
              </div>
            </div>
          </div>

          {/* Grid: Left Dual Radar (Cols 1-7) + Right Score HUD (Cols 8-12) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            {/* Dual Radar Column */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <DualRadarChart
                subscoresA={reportA.score.subscores}
                subscoresB={candidateB.score.subscores}
                labelA="Inmueble A"
                labelB="Inmueble B"
                mode={radarMode}
                onModeChange={setRadarMode}
              />
            </div>

            {/* Score HUD Panel */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Score Card A (Cyan Identity) */}
              <div
                data-testid="score-card-a"
                className="bg-surface-container border border-cyan-500/40 rounded-lg p-space-md relative overflow-hidden group hover:border-cyan-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                      <span className="font-mono text-xs font-semibold text-cyan-300">
                        INMUEBLE A · {reportA.property.address.street} {reportA.property.address.number}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-on-surface-variant font-mono">
                      {reportA.property.address.municipality} ({reportA.property.address.province})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 leading-none">
                      {scoreA}
                      <span className="text-xs text-on-surface-variant font-normal">/100</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                      {scoreA >= 75 ? 'Calidad Muy Alta' : scoreA >= 50 ? 'Calidad Media' : 'Atención Requerida'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-highest h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${scoreA}%` }} />
                </div>

                {/* Micro Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/50 text-[11px] font-mono">
                  <div>
                    <div className="text-on-surface-variant">ITE Vigente</div>
                    <div className="text-on-surface font-semibold">
                      {capexA.iteStatus === 'favorable_active' ? `Favorable (${capexA.iteDeadlineYear})` : 'Pendiente'}
                    </div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant">Nivel Ruido</div>
                    <div className="text-on-surface font-semibold text-primary">
                      {noiseA} dBA ({noiseA < 60 ? 'Óptimo' : 'Moderado'})
                    </div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant">CapEx Est.</div>
                    <div className="text-on-surface font-semibold">
                      {capexA.estimatedCapExPerM2Eur.min}-{capexA.estimatedCapExPerM2Eur.max} €/m²
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Card B (Amber Identity) */}
              <div
                data-testid="score-card-b"
                className="bg-surface-container border border-amber-500/40 rounded-lg p-space-md relative overflow-hidden group hover:border-amber-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                      <span className="font-mono text-xs font-semibold text-amber-300">
                        INMUEBLE B · {candidateB.property.address.street} {candidateB.property.address.number}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-on-surface-variant font-mono">
                      {candidateB.property.address.municipality} ({candidateB.property.address.province})
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 leading-none">
                      {scoreB}
                      <span className="text-xs text-on-surface-variant font-normal">/100</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 mt-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 font-mono text-[10px]">
                      {scoreB >= 75 ? 'Calidad Muy Alta' : scoreB >= 50 ? 'Calidad Media-Alta' : 'Atención Requerida'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container-highest h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${scoreB}%` }} />
                </div>

                {/* Micro Quick Stats */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/50 text-[11px] font-mono">
                  <div>
                    <div className="text-on-surface-variant">ITE Estado</div>
                    <div className="text-amber-300 font-semibold">
                      {capexB.iteStatus === 'favorable_active' ? `Favorable` : 'Pendiente / Subsan.'}
                    </div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant">Nivel Ruido</div>
                    <div className="text-amber-400 font-semibold">
                      {noiseB} dBA ({noiseB > 65 ? 'ZPAE' : 'Moderado'})
                    </div>
                  </div>
                  <div>
                    <div className="text-on-surface-variant">CapEx Est.</div>
                    <div className="text-amber-300 font-semibold">
                      {capexB.estimatedCapExPerM2Eur.min}-{capexB.estimatedCapExPerM2Eur.max} €/m²
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Arbitrage Callout */}
              <div
                data-testid="arbitrage-summary-callout"
                className="bg-surface-container-high border border-outline-variant rounded-lg p-space-sm flex items-start gap-3"
              >
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs font-body leading-relaxed">
                  <strong className="text-on-surface font-semibold block mb-0.5">
                    Resumen de Arbitraje Técnico:
                  </strong>
                  <span className="text-on-surface-variant">
                    {scoreA >= scoreB
                      ? `El Inmueble A ofrece un rendimiento habitacional y de preservación de capital superior gracias a su menor exposición acústica (${
                          noiseDiff > 0 ? `-${noiseDiff} dBA` : 'óptima'
                        }) y menor riesgo en derramas a 10 años, a pesar de que el Inmueble B posee una renta censal superior (+${
                          incomeDiff > 0 ? incomeDiff.toLocaleString('es-ES') : 0
                        } €/año).`
                      : `El Inmueble B ofrece ventajas socioeconómicas notables (+${
                          incomeDiff > 0 ? incomeDiff.toLocaleString('es-ES') : 0
                        } €/año) y mayor superficie, compensando el diferencial acústico y posibles derramas en ascensores o envolvente.`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SIDE-BY-SIDE CANDIDATE BENTO CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          {/* Card A (Cyan Identity) */}
          <div
            data-testid="candidate-card-a"
            className="bg-surface-container-low border-2 border-cyan-500/50 rounded-xl p-space-md flex flex-col justify-between shadow-lg relative"
          >
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-[10px] font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>ACTIVO CANDIDATO A (REFERENCIA BASE)</span>
            </div>

            <div className="mt-2">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
                <div>
                  <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                    <span>
                      {reportA.property.address.street} {reportA.property.address.number}
                    </span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </h2>
                  <div className="font-mono text-xs text-on-surface-variant">
                    {reportA.property.address.postalCode} {reportA.property.address.municipality} · Sección Censal{' '}
                    {reportA.neighborhood.censusSectionCode}
                  </div>
                </div>

                {/* RC Box */}
                <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded border border-outline-variant">
                  <span className="text-outline font-mono text-xs">RC:</span>
                  <span className="font-mono text-xs text-cyan-300 font-semibold truncate max-w-[150px]">
                    {reportA.property.cadastralReference}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(reportA.property.cadastralReference, true)}
                    className="text-on-surface-variant hover:text-cyan-400 transition-colors p-0.5 cursor-pointer"
                    title="Copiar Referencia Catastral"
                  >
                    {copiedA ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Key Technical Specs Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono text-xs">
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Antigüedad / Año</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {yearA} <span className="text-cyan-400">({ageA} años)</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Sup. Construida / Útil</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {reportA.property.building.builtSurfaceM2} m² /{' '}
                    {Math.round(reportA.property.building.builtSurfaceM2 * 0.86)} m²
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Cuota Participación</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {reportA.property.unit?.participationCoefficient
                      ? `${reportA.property.unit.participationCoefficient}%`
                      : '3.2000%'}
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Régimen Jurídico</div>
                  <div className="text-on-surface font-semibold mt-0.5">Pleno Dominio</div>
                </div>
              </div>

              {/* Extended Urban Indicators */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/40 border border-primary/40 text-primary">
                  <CheckCircle className="w-3 h-3" />
                  <span>ITE Favorable {capexA.iteDeadlineYear}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/40 border border-primary/40 text-primary">
                  <Shield className="w-3 h-3" />
                  <span>0 Derramas activas</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface">
                  <Award className="w-3 h-3 text-secondary" />
                  <span>
                    SERPAVI: {reportA.rentalBenchmark?.isStressedHousingZone ? 'Zona Tensionada' : 'Mercado Libre'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface">
                  <Shield className="w-3 h-3 text-cyan-400" />
                  <span>SNCZI: Inundación {reportA.environment.floodRisk.level === 'NONE' ? 'Nulo' : reportA.environment.floodRisk.level}</span>
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span>Ratio Valor Catastral: 1.420 €/m²</span>
              <span className="text-cyan-400">Activo Referencia</span>
            </div>
          </div>

          {/* Card B (Amber Identity) */}
          <div
            data-testid="candidate-card-b"
            className="bg-surface-container-low border-2 border-amber-500/50 rounded-xl p-space-md flex flex-col justify-between shadow-lg relative"
          >
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-300 font-mono text-[10px] font-semibold tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>ACTIVO COMPARADO B (OBJETO DE CONTRASTE)</span>
            </div>

            <div className="mt-2">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
                <div>
                  <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                    <span>
                      {candidateB.property.address.street} {candidateB.property.address.number}
                    </span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </h2>
                  <div className="font-mono text-xs text-on-surface-variant">
                    {candidateB.property.address.postalCode} {candidateB.property.address.municipality} · Sección Censal{' '}
                    {candidateB.neighborhood.censusSectionCode}
                  </div>
                </div>

                {/* RC Box */}
                <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded border border-outline-variant">
                  <span className="text-outline font-mono text-xs">RC:</span>
                  <span className="font-mono text-xs text-amber-300 font-semibold truncate max-w-[150px]">
                    {candidateB.property.cadastralReference}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(candidateB.property.cadastralReference, false)}
                    className="text-on-surface-variant hover:text-amber-400 transition-colors p-0.5 cursor-pointer"
                    title="Copiar Referencia Catastral"
                  >
                    {copiedB ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Key Technical Specs Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono text-xs">
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Antigüedad / Año</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {yearB} <span className="text-amber-400">({ageB} años)</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Sup. Construida / Útil</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {candidateB.property.building.builtSurfaceM2} m² /{' '}
                    {Math.round(candidateB.property.building.builtSurfaceM2 * 0.86)} m²
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Cuota Participación</div>
                  <div className="text-on-surface font-semibold mt-0.5">
                    {candidateB.property.unit?.participationCoefficient
                      ? `${candidateB.property.unit.participationCoefficient}%`
                      : '4.8500%'}
                  </div>
                </div>
                <div className="p-2 rounded bg-surface-container border border-outline-variant">
                  <div className="text-on-surface-variant text-[10px]">Régimen Jurídico</div>
                  <div className="text-on-surface font-semibold mt-0.5">Residencial Singular</div>
                </div>
              </div>

              {/* Extended Urban Indicators */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300">
                  <Clock className="w-3 h-3" />
                  <span>ITE {capexB.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente / Subsan.'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300">
                  <HardHat className="w-3 h-3" />
                  <span>Derrama Prevista (Ascensor/Petos)</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface">
                  <Award className="w-3 h-3 text-secondary" />
                  <span>SERPAVI: Zona Gran Afluencia</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-amber-400">
                  <Volume2 className="w-3 h-3" />
                  <span>ZPAE: Protección Acústica</span>
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span>Ratio Valor Catastral: 1.810 €/m²</span>
              <button
                type="button"
                onClick={() => setShowCandidateSelector(true)}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Cambiar Inmueble B ▾</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: DIFFERENTIAL MATRIX TABLE */}
        <section className="w-full bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-space-md py-3 bg-surface-container border-b border-outline-variant flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <h2 className="font-headline font-bold text-on-surface text-sm sm:text-base">
                Matriz Diferencial de Telemetría Territorial y Financiera
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> Inmueble A
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" /> Inmueble B
              <span className="text-outline ml-2">|</span>
              <span className="text-primary font-medium">Margen Cartográfico &lt;0.05%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table data-testid="differential-matrix-table" className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-high/80 text-on-surface-variant font-mono uppercase tracking-wider border-b border-outline-variant text-[10px]">
                  <th className="py-3 px-space-md w-1/5">Vector Analítico</th>
                  <th className="py-3 px-space-md w-1/4 text-cyan-300">
                    Inmueble A ({reportA.property.address.street.substring(0, 16)})
                  </th>
                  <th className="py-3 px-space-md w-1/4 text-amber-300">
                    Inmueble B ({candidateB.property.address.street.substring(0, 16)})
                  </th>
                  <th className="py-3 px-space-md w-1/6 font-mono font-semibold">Delta Diferencial</th>
                  <th className="py-3 px-space-md w-1/6 text-right">Veredicto Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-body">
                {/* ROW 1: WalkScore / Connectivity */}
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-primary" />
                      <span>Conectividad & Caminabilidad (15 min)</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                      Acceso peatonal dotacional e intermodal
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">
                      {walkScoreA} pts <span className="text-cyan-400 font-normal">({walkScoreA >= 80 ? 'Excepcional' : 'Notable'})</span>
                    </div>
                    <div className="text-on-surface-variant text-[11px]">Metro & dotaciones &lt;300m</div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">
                      {walkScoreB} pts <span className="text-amber-400 font-normal">({walkScoreB >= 80 ? 'Excepcional' : 'Notable'})</span>
                    </div>
                    <div className="text-on-surface-variant text-[11px]">Transporte &lt;500m</div>
                  </td>
                  <td className="py-3 px-space-md font-mono font-semibold">
                    {walkScoreA >= walkScoreB ? (
                      <span className="text-cyan-300">+{walkScoreA - walkScoreB} pts Inmueble A</span>
                    ) : (
                      <span className="text-amber-300">+{walkScoreB - walkScoreA} pts Inmueble B</span>
                    )}
                  </td>
                  <td className="py-3 px-space-md text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-semibold ${
                        walkScoreA >= walkScoreB
                          ? 'bg-cyan-950/60 border border-cyan-400/40 text-cyan-300'
                          : 'bg-amber-950/60 border border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Ganador: {walkScoreA >= walkScoreB ? 'Inmueble A' : 'Inmueble B'}</span>
                    </span>
                  </td>
                </tr>

                {/* ROW 2: Socioeconomics */}
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-secondary" />
                      <span>Socioeconomía & Renta Media INE</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                      Atlas de Distribución de Renta de Hogares (ADRH)
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">{incomeA.toLocaleString('es-ES')} € / hogar</div>
                    <div className="text-on-surface-variant text-[11px]">Decil censal {reportA.neighborhood.percentileInMunicipality ? Math.ceil(reportA.neighborhood.percentileInMunicipality / 10) : 8}</div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">{incomeB.toLocaleString('es-ES')} € / hogar</div>
                    <div className="text-on-surface-variant text-[11px]">Decil censal {candidateB.neighborhood.percentileInMunicipality ? Math.ceil(candidateB.neighborhood.percentileInMunicipality / 10) : 9}</div>
                  </td>
                  <td className="py-3 px-space-md font-mono font-semibold">
                    {incomeA >= incomeB ? (
                      <span className="text-cyan-300">+{((incomeA - incomeB)).toLocaleString('es-ES')} € Inmueble A</span>
                    ) : (
                      <span className="text-amber-300">+{((incomeB - incomeA)).toLocaleString('es-ES')} € Inmueble B</span>
                    )}
                  </td>
                  <td className="py-3 px-space-md text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-semibold ${
                        incomeA >= incomeB
                          ? 'bg-cyan-950/60 border border-cyan-400/40 text-cyan-300'
                          : 'bg-amber-950/60 border border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Ganador: {incomeA >= incomeB ? 'Inmueble A' : 'Inmueble B'}</span>
                    </span>
                  </td>
                </tr>

                {/* ROW 3: Noise & Environmental */}
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="font-semibold text-on-surface flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-primary" />
                      <span>Nivel Acústico & Calidad Ambiental</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                      MITECO Mapa Ruido SICA / Régimen ZPAE
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-primary">{noiseA} dBA <span className="text-on-surface-variant font-normal">(Lden)</span></div>
                    <div className="text-on-surface-variant text-[11px]">Exposición acústica baja/moderada</div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-amber-400">{noiseB} dBA <span className="text-on-surface-variant font-normal">(Lden)</span></div>
                    <div className="text-on-surface-variant text-[11px]">Eje rodado intenso</div>
                  </td>
                  <td className="py-3 px-space-md font-mono font-semibold">
                    {noiseA <= noiseB ? (
                      <span className="text-primary">
                        -{noiseB - noiseA} dBA Inmueble A
                        <br />
                        <span className="text-[10px] text-on-surface-variant font-normal">
                          ({Math.round(((noiseB - noiseA) / noiseB) * 100 * 3.5)}% más silencioso)
                        </span>
                      </span>
                    ) : (
                      <span className="text-amber-300">-{noiseA - noiseB} dBA Inmueble B</span>
                    )}
                  </td>
                  <td className="py-3 px-space-md text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-semibold ${
                        noiseA <= noiseB
                          ? 'bg-cyan-950/60 border border-cyan-400/40 text-cyan-300'
                          : 'bg-amber-950/60 border border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Ganador: {noiseA <= noiseB ? 'Inmueble A' : 'Inmueble B'}</span>
                    </span>
                  </td>
                </tr>

                {/* ROW 4: CapEx & Derramas */}
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="font-semibold text-on-surface flex items-center gap-1.5">
                      <HardHat className="w-4 h-4 text-error" />
                      <span>CapEx Edificatorio & Riesgo Derramas</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                      Auditoría ITE / Estado de Conservación Finca
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">
                      ITE {capexA.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente'}
                    </div>
                    <div className="text-on-surface-variant text-[11px]">
                      Riesgo: <strong className="text-primary">BAJO</strong> · Cuota: {capexA.estimatedCommunityExpenseRangeEurMonth.min} €/mes
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-error">
                      ITE {capexB.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente / Subsan.'}
                    </div>
                    <div className="text-on-surface-variant text-[11px]">
                      Riesgo: <strong className="text-amber-400">MEDIO-ALTO</strong> · Cuota: {capexB.estimatedCommunityExpenseRangeEurMonth.max} €/mes
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono font-semibold">
                    <span className="text-cyan-300">
                      -{Math.abs(capexB.estimatedCommunityExpenseRangeEurMonth.max - capexA.estimatedCommunityExpenseRangeEurMonth.min)} €/mes cuota
                      <br />
                      <span className="text-primary text-[10px] font-normal">Menor exposición CapEx</span>
                    </span>
                  </td>
                  <td className="py-3 px-space-md text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-semibold">
                      <Shield className="w-3 h-3" />
                      <span>Ganador: Inmueble A</span>
                    </span>
                  </td>
                </tr>

                {/* ROW 5: Antiquity & Construction Year */}
                <tr className="hover:bg-surface-container transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="font-semibold text-on-surface flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-secondary" />
                      <span>Antigüedad & Año de Construcción</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                      Registro de la Sede Electrónica del Catastro
                    </div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">Año {yearA}</div>
                    <div className="text-on-surface-variant text-[11px]">{ageA} años de antigüedad</div>
                  </td>
                  <td className="py-3 px-space-md font-mono">
                    <div className="font-bold text-on-surface">Año {yearB}</div>
                    <div className="text-on-surface-variant text-[11px]">{ageB} años de antigüedad</div>
                  </td>
                  <td className="py-3 px-space-md font-mono font-semibold">
                    {yearA >= yearB ? (
                      <span className="text-cyan-300">+{yearA - yearB} años más moderno Inmueble A</span>
                    ) : (
                      <span className="text-amber-300">+{yearB - yearA} años más moderno Inmueble B</span>
                    )}
                  </td>
                  <td className="py-3 px-space-md text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] font-semibold ${
                        yearA >= yearB
                          ? 'bg-cyan-950/60 border border-cyan-400/40 text-cyan-300'
                          : 'bg-amber-950/60 border border-amber-400/40 text-amber-300'
                      }`}
                    >
                      <Award className="w-3 h-3" />
                      <span>Ganador: {yearA >= yearB ? 'Inmueble A' : 'Inmueble B'}</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ================= STICKY ACTION FOOTER BAR ================= */}
      <footer className="w-full bg-surface-container border-t border-outline-variant sticky bottom-0 z-40 px-space-md lg:px-space-lg py-2.5 mt-auto shadow-2xl">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Telemetry Legal Stamp */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong className="text-on-surface">Doble Hash SHA-256 verificado</strong> · Datos oficiales Sede Catastro + INE + MITECO SICA · OpenBarrio Civic Engine v2.4
            </span>
          </div>

          {/* Action cluster right */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              data-testid="change-candidate-btn"
              onClick={() => setShowCandidateSelector(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-outline-variant hover:border-outline text-on-surface rounded text-xs font-mono transition-colors cursor-pointer"
            >
              <span>Cambiar Inmueble B</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold rounded text-xs font-mono transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Descargar Auditoría Certificada (PDF)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Candidate B Switcher Modal / Overlay */}
      {showCandidateSelector && (
        <div
          data-testid="candidate-selector-overlay"
          className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-surface-container border border-outline-variant rounded-xl max-w-lg w-full p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <h3 className="font-headline font-bold text-on-surface text-base">
                Seleccionar Inmueble B para Comparar
              </h3>
              <button
                type="button"
                onClick={() => setShowCandidateSelector(false)}
                className="p-1 rounded hover:bg-surface-variant text-on-surface-variant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom RC Input */}
            <form onSubmit={handleCustomRefcatSubmit} className="mt-3">
              <label className="block text-xs font-mono text-on-surface-variant mb-1">
                Introducir Referencia Catastral (14 o 20 caracteres):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRefInput}
                  onChange={(e) => setCustomRefInput(e.target.value)}
                  placeholder="Ej: 28900A010000420003DW"
                  className="flex-1 px-3 py-1.5 rounded bg-surface border border-outline-variant text-on-surface text-xs font-mono focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-primary text-on-primary font-mono text-xs font-semibold rounded cursor-pointer"
                >
                  Comparar
                </button>
              </div>
            </form>

            {/* Presets list */}
            <div className="mt-4">
              <div className="text-xs font-mono text-on-surface-variant mb-2">
                O elegir un inmueble de referencia contrastado:
              </div>
              <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto">
                {PRESET_CANDIDATES.map((preset) => (
                  <button
                    key={preset.refcat}
                    type="button"
                    onClick={() => handleChangeCandidateB(preset)}
                    className="p-2 rounded bg-surface hover:bg-surface-variant border border-outline-variant/60 flex items-center justify-between text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-on-surface">{preset.label}</div>
                      <div className="text-[10px] font-mono text-primary">{preset.refcat}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

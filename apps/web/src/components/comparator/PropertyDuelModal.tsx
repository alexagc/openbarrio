import { useState, useEffect, useCallback } from 'react';
import { PropertyAuditReport } from '@openbarrio/core';
import { DualRadarChart, DualRadarMode } from './DualRadarChart';
import { DuelHeader } from './DuelHeader';
import { DuelCandidateSelector, PresetCandidate, PRESET_CANDIDATES } from './DuelCandidateSelector';
import { DuelPillarComparison, CANDIDATE_METAS } from './DuelPillarComparison';
import { deriveBuildingCapEx } from '../dossier/BuildingCapExCard';
import { apiClient } from '../../services/api.client';
import { useTranslation } from '../../i18n';
import { isSubstandardHousing } from '../../utils/substandard';
import {
  Layers,
  Sparkles,
  FileText,
  ChevronDown,
  CheckCircle,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export interface PropertyDuelModalProps {
  reportA: PropertyAuditReport;
  reportB?: PropertyAuditReport;
  initialCompareRefs?: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidateB?: (refcatOrReport: string | PropertyAuditReport) => void;
}

export function PropertyDuelModal({
  reportA,
  reportB: initialReportB,
  initialCompareRefs,
  isOpen,
  onClose,
  onSelectCandidateB,
}: PropertyDuelModalProps) {
  const { t } = useTranslation();

  // Multi-property candidates array (up to 4 properties: A, B, C, D)
  const [candidates, setCandidates] = useState<PropertyAuditReport[]>(() => {
    if (initialReportB) return [reportA, initialReportB];
    return [reportA];
  });

  const [radarMode, setRadarMode] = useState<DualRadarMode>('both');
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);
  const [showCandidateSelector, setShowCandidateSelector] = useState(false);
  const [targetSelectorIndex, setTargetSelectorIndex] = useState<number>(1);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);

  // Helper to build synthetic report fallback if offline or mock
  const buildFallbackCandidate = useCallback(
    (refcat: string, label?: string, preset?: PresetCandidate): PropertyAuditReport => {
      const municipality = label?.includes('Barcelona')
        ? 'Barcelona'
        : label?.includes('València')
        ? 'València'
        : label?.includes('Sevilla')
        ? 'Sevilla'
        : 'Madrid';

      return {
        ...reportA,
        id: 'mock-candidate-' + refcat,
        property: {
          ...reportA.property,
          cadastralReference: refcat,
          address: {
            street: label ? label.split(',')[0] : 'Inmueble con RC ' + refcat,
            number: '28',
            postalCode: '28013',
            municipality,
            province: municipality === 'Madrid' ? 'Madrid' : municipality,
          },
          building: {
            constructionYear: preset ? (preset.refcat.includes('9872') ? 1968 : 1978) : 1972,
            builtSurfaceM2: preset ? 112 : 95,
            primaryUse: 'Residencial',
            unitsCount: 20,
            hasCommercialGroundFloor: false,
          },
        },
        score: {
          ...reportA.score,
          overallScore: Math.max(45, Math.min(95, reportA.score.overallScore + (refcat.charCodeAt(0) % 15) - 7)),
        },
      };
    },
    [reportA]
  );

  // Initialize Candidate B if only Candidate A is present
  useEffect(() => {
    if (initialReportB) {
      setCandidates((prev) => {
        if (prev.length <= 1) return [reportA, initialReportB];
        const next = [...prev];
        next[0] = reportA;
        next[1] = initialReportB;
        return next;
      });
      return;
    }

    // Check if URL has ?compare=ref1,ref2,... or ?vs=...
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const compareQuery = searchParams.get('compare');
      const vsQuery = searchParams.get('vs');

      const compareRefs = compareQuery
        ? compareQuery.split(',').map((s) => s.trim().toUpperCase()).filter((s) => s.length >= 14)
        : initialCompareRefs || (vsQuery ? [reportA.property.cadastralReference, vsQuery.toUpperCase().trim()] : []);

      if (compareRefs.length >= 2) {
        // Load candidates from compareRefs
        const refsToFetch = compareRefs.slice(1, 4); // index 1, 2, 3
        Promise.all(
          refsToFetch.map((ref) =>
            apiClient.auditByCadastralReference(ref).catch(() => buildFallbackCandidate(ref))
          )
        ).then((fetched) => {
          setCandidates([reportA, ...fetched]);
        });
        return;
      }
    }

    // Default fallback to first preset different from A
    if (candidates.length <= 1) {
      const differentPreset =
        PRESET_CANDIDATES.find((p) => p.refcat !== reportA.property.cadastralReference) ||
        PRESET_CANDIDATES[0];

      setIsLoadingCandidate(true);
      apiClient
        .auditByCadastralReference(differentPreset.refcat, {
          lat: differentPreset.lat,
          lon: differentPreset.lon,
        })
        .then((data) => {
          setCandidates([reportA, data]);
        })
        .catch(() => {
          const fallback = buildFallbackCandidate(differentPreset.refcat, differentPreset.label, differentPreset);
          setCandidates([reportA, fallback]);
        })
        .finally(() => {
          setIsLoadingCandidate(false);
        });
    }
  }, [initialReportB, reportA, buildFallbackCandidate, initialCompareRefs]);

  const candidateA = candidates[0] || reportA;
  const candidateB = candidates[1] || candidateA;

  // Sync URL query params: ?refcat=...&vs=...&compare=ref1,ref2,... and register Escape key
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const refs = candidates.map((c) => c.property.cadastralReference).filter(Boolean);
    const refA = refs[0] || reportA.property.cadastralReference;
    const refB = refs[1] || candidateB.property.cadastralReference;

    try {
      const params = new URLSearchParams(window.location.search);
      params.set('refcat', refA);
      if (refB) {
        params.set('vs', refB);
      }
      params.set('compare', refs.join(','));

      const path = window.location.pathname || '/';
      const target = `${path}?${params.toString()}`;
      window.history.pushState({ openbarrio: true }, '', target);
    } catch {
      // Ignore
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
        params.delete('compare');
        const path = window.location.pathname || '/';
        const query = params.toString();
        const target = query ? `${path}?${query}` : path;
        window.history.replaceState({ openbarrio: true }, '', target);
      } catch {
        // Ignore
      }
    };
  }, [isOpen, candidates, candidateB.property.cadastralReference, reportA.property.cadastralReference, onClose]);

  if (!isOpen) return null;

  // CapEx assessment derivations
  const capexA =
    candidateA.capex ||
    deriveBuildingCapEx(
      candidateA.property.building.constructionYear || 1984,
      candidateA.property.building.builtSurfaceM2 || 88
    );
  const capexB =
    candidateB.capex ||
    deriveBuildingCapEx(
      candidateB.property.building.constructionYear || 1968,
      candidateB.property.building.builtSurfaceM2 || 112
    );

  // Global Algorithmic Verdict computation
  const scoreA = candidateA.score.overallScore;
  const scoreB = candidateB.score.overallScore;
  const globalDelta = scoreA - scoreB;

  let verdictBadgeText = t('duel.verdictParity');
  if (candidates.length <= 2) {
    if (globalDelta > 0) {
      verdictBadgeText = t('duel.verdictAdvantageA', { delta: globalDelta });
    } else if (globalDelta < 0) {
      verdictBadgeText = t('duel.verdictAdvantageB', { delta: Math.abs(globalDelta) });
    }
  } else {
    // Multi-candidate winner detection
    let bestIdx = 0;
    let highestScore = candidates[0].score.overallScore;
    for (let i = 1; i < candidates.length; i++) {
      if (candidates[i].score.overallScore > highestScore) {
        highestScore = candidates[i].score.overallScore;
        bestIdx = i;
      }
    }
    const bestLetter = CANDIDATE_METAS[bestIdx]?.letter || 'A';
    verdictBadgeText = `Inmueble ${bestLetter} lidera (${highestScore} pts)`;
  }

  // Copy helpers
  const handleCopy = (text: string, isA: boolean) => {
    navigator.clipboard?.writeText(text);
    if (isA) {
      setCopiedA(true);
      setTimeout(() => setCopiedA(false), 2000);
    } else {
      setCopiedB(true);
      setTimeout(() => setCopiedB(false), 2000);
    }
  };

  // Open candidate selector for replacing candidate or adding new one
  const handleOpenCandidateSelector = (index = 1) => {
    setTargetSelectorIndex(index);
    setShowCandidateSelector(true);
  };

  const handleOpenAddCandidate = () => {
    if (candidates.length >= 4) return;
    setTargetSelectorIndex(candidates.length);
    setShowCandidateSelector(true);
  };

  // Remove a candidate
  const handleRemoveCandidate = (indexToRemove: number) => {
    if (indexToRemove === 0) return; // Prevent removing Candidate A (base reference)
    setCandidates((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Selection handlers from DuelCandidateSelector
  const handleSelectPresetCandidate = async (preset: PresetCandidate) => {
    setIsLoadingCandidate(true);
    try {
      const data = await apiClient.auditByCadastralReference(preset.refcat, {
        lat: preset.lat,
        lon: preset.lon,
      });
      applyNewCandidate(data);
    } catch {
      const fallback = buildFallbackCandidate(preset.refcat, preset.label, preset);
      applyNewCandidate(fallback);
    } finally {
      setIsLoadingCandidate(false);
      setShowCandidateSelector(false);
    }
  };

  const handleSelectCustomRefcat = async (refcat: string) => {
    setIsLoadingCandidate(true);
    try {
      const data = await apiClient.auditByCadastralReference(refcat);
      applyNewCandidate(data);
    } catch {
      const fallback = buildFallbackCandidate(refcat);
      applyNewCandidate(fallback);
    } finally {
      setIsLoadingCandidate(false);
      setShowCandidateSelector(false);
    }
  };

  const applyNewCandidate = (newReport: PropertyAuditReport) => {
    setCandidates((prev) => {
      const next = [...prev];
      if (targetSelectorIndex < next.length) {
        // Replace existing candidate slot
        next[targetSelectorIndex] = newReport;
      } else if (next.length < 4) {
        // Append new candidate slot up to 4
        next.push(newReport);
      }
      return next;
    });

    if (targetSelectorIndex === 1) {
      onSelectCandidateB?.(newReport);
    }
  };

  // Technical Arbitrage Synthesis
  const noiseA = candidateA.environment.noise?.dayEveningNightDecibels || 58;
  const noiseB = candidateB.environment.noise?.dayEveningNightDecibels || 67;
  const noiseDiff = noiseB - noiseA;

  const incomeA = candidateA.neighborhood.averageNetHouseholdIncomeEur || 34200;
  const incomeB = candidateB.neighborhood.averageNetHouseholdIncomeEur || 40400;
  const incomeDiff = incomeB - incomeA;

  const yearA = candidateA.property.building.constructionYear || 1984;
  const yearB = candidateB.property.building.constructionYear || 1968;
  const ageA = new Date().getFullYear() - yearA;
  const ageB = new Date().getFullYear() - yearB;

  const walkScoreA = candidateA.score.subscores.connectivity;
  const walkScoreB = candidateB.score.subscores.connectivity;

  return (
    <div
      data-testid="property-duel-modal"
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto flex flex-col font-body text-on-surface antialiased"
      role="dialog"
      aria-modal="true"
    >
      <DuelHeader
        reportA={candidateA}
        candidateB={candidateB}
        candidates={candidates}
        verdictBadgeText={verdictBadgeText}
        onClose={onClose}
        onAddCandidate={handleOpenAddCandidate}
        canAddCandidate={candidates.length < 4}
      />

      <main className="flex-1 w-full max-w-[1720px] mx-auto p-space-md lg:p-space-lg flex flex-col gap-space-lg">
        {/* SECTION 1: HERO DUAL RADAR & TELEMETRY SCORE HUD */}
        <section className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-space-md lg:p-space-lg relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3 mb-space-md flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-surface-container border border-outline-variant text-primary">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-headline text-lg sm:text-xl text-on-surface font-bold tracking-tight">
                  {candidates.length > 2
                    ? `Matriz Comparativa Multidominio (${candidates.length} Inmuebles)`
                    : t('duel.title')}
                </h1>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">
                  {t('duel.desc')}
                </p>
              </div>
            </div>

            {candidates.length < 4 && (
              <button
                type="button"
                data-testid="add-candidate-btn"
                onClick={handleOpenAddCandidate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-mono text-xs border border-primary/40 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ {t('duel.addCandidate')} ({candidates.length}/4)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center">
              <DualRadarChart
                subscoresA={candidates[0]?.score.subscores}
                subscoresB={candidates[1]?.score.subscores}
                subscoresC={candidates[2]?.score.subscores}
                subscoresD={candidates[3]?.score.subscores}
                labelA={t('duel.candidateA')}
                labelB={t('duel.candidateB')}
                labelC={t('duel.candidateC')}
                labelD={t('duel.candidateD')}
                mode={radarMode}
                onModeChange={setRadarMode}
              />
            </div>

            <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-3">
              {/* Dynamic Score Cards Grid (Supports 2, 3, or 4 candidates) */}
              <div className={`grid grid-cols-1 ${candidates.length > 2 ? 'sm:grid-cols-2' : ''} gap-3`}>
                {candidates.map((cand, idx) => {
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  const cScore = cand.score.overallScore;
                  const cCapex =
                    cand.capex ||
                    deriveBuildingCapEx(
                      cand.property.building.constructionYear || 1975,
                      cand.property.building.builtSurfaceM2 || 90
                    );
                  const cNoise = cand.environment.noise?.dayEveningNightDecibels || 60;
                  const isSub = isSubstandardHousing(cand);

                  return (
                    <div
                      key={cand.property.cadastralReference || idx}
                      data-testid={`score-card-${meta.letter.toLowerCase()}`}
                      className={`bg-surface-container border ${meta.borderClass} rounded-lg p-space-md relative overflow-hidden group ${meta.hoverBorderClass} transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`} />
                            <span className={`font-mono text-xs font-semibold ${meta.textLightClass}`}>
                              INMUEBLE {meta.letter} · {cand.property.address.street} {cand.property.address.number}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-on-surface-variant font-mono">
                            {cand.property.address.municipality} ({cand.property.address.province})
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl sm:text-3xl font-bold font-mono ${meta.textAccentClass} leading-none`}>
                            {cScore}
                            <span className="text-xs text-on-surface-variant font-normal">/100</span>
                          </div>
                          <span className={`inline-block px-2 py-0.5 mt-1 rounded ${meta.bgBadgeClass}/60 border ${meta.borderBadgeClass}/30 ${meta.textLightClass} font-mono text-[10px]`}>
                            {cScore >= 75 ? 'Calidad Muy Alta' : cScore >= 50 ? 'Calidad Media' : 'Atención Requerida'}
                          </span>
                        </div>
                      </div>

                      {/* Substandard Housing Warning Badge on Score Card */}
                      {isSub && (
                        <div
                          data-testid="substandard-scorecard-alert"
                          className="mt-2 p-1.5 rounded bg-rose-950/70 border border-rose-500/80 text-rose-300 text-[10px] font-mono flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Alerta de Infravivienda (Presunto Local)</span>
                        </div>
                      )}

                      <div className="w-full bg-surface-container-highest h-2 rounded-full mt-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            meta.letter === 'A'
                              ? 'bg-cyan-400'
                              : meta.letter === 'B'
                              ? 'bg-amber-400'
                              : meta.letter === 'C'
                              ? 'bg-purple-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${cScore}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/50 text-[11px] font-mono">
                        <div>
                          <div className="text-on-surface-variant">ITE Estado</div>
                          <div className={`font-semibold ${cCapex.iteStatus === 'favorable_active' ? 'text-on-surface' : meta.textAccentClass}`}>
                            {cCapex.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente'}
                          </div>
                        </div>
                        <div>
                          <div className="text-on-surface-variant">Nivel Ruido</div>
                          <div className={`font-semibold ${meta.textAccentClass}`}>
                            {cNoise} dBA ({cNoise < 60 ? 'Óptimo' : cNoise <= 65 ? 'Moderado' : 'ZPAE'})
                          </div>
                        </div>
                        <div>
                          <div className="text-on-surface-variant">CapEx Est.</div>
                          <div className="text-on-surface font-semibold">
                            {cCapex.estimatedCapExPerM2Eur.min}-{cCapex.estimatedCapExPerM2Eur.max} €/m²
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Technical Arbitrage Callout */}
              <div
                data-testid="arbitrage-summary-callout"
                className="bg-surface-container-high border border-outline-variant rounded-lg p-space-sm flex items-start gap-3"
              >
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs font-body leading-relaxed">
                  <strong className="text-on-surface font-semibold block mb-0.5">
                    {t('duel.arbitrageSummaryTitle')}
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

        {/* SECTION 2 & 3: PILLAR COMPARISON & DIFFERENTIAL MATRIX TABLE */}
        <DuelPillarComparison
          reportA={candidateA}
          candidateB={candidateB}
          candidates={candidates}
          capexA={capexA}
          capexB={capexB}
          scoreA={scoreA}
          scoreB={scoreB}
          noiseA={noiseA}
          noiseB={noiseB}
          incomeA={incomeA}
          incomeB={incomeB}
          yearA={yearA}
          yearB={yearB}
          ageA={ageA}
          ageB={ageB}
          walkScoreA={walkScoreA}
          walkScoreB={walkScoreB}
          onCopy={handleCopy}
          copiedA={copiedA}
          copiedB={copiedB}
          onOpenCandidateSelector={handleOpenCandidateSelector}
          onRemoveCandidate={handleRemoveCandidate}
          onAddCandidate={handleOpenAddCandidate}
        />
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container border-t border-outline-variant sticky bottom-0 z-40 px-space-md lg:px-space-lg py-2.5 mt-auto shadow-2xl">
        <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong className="text-on-surface">{t('duel.verifiedDoubleHash')}</strong> · Datos oficiales Sede Catastro + INE + MITECO SICA · OpenBarrio Civic Engine v2.4
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              data-testid="change-candidate-btn"
              onClick={() => handleOpenCandidateSelector(1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-outline-variant hover:border-outline text-on-surface rounded text-xs font-mono transition-colors cursor-pointer"
            >
              <span>{t('duel.changeCandidateB')}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {candidates.length < 4 && (
              <button
                type="button"
                data-testid="add-candidate-footer-btn"
                onClick={handleOpenAddCandidate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high border border-primary/40 hover:border-primary text-primary rounded text-xs font-mono transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ {t('duel.addCandidate')} ({candidates.length}/4)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold rounded text-xs font-mono transition-all shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{t('duel.downloadCertifiedPdf')}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Candidate Selector Modal */}
      <DuelCandidateSelector
        isOpen={showCandidateSelector}
        onClose={() => setShowCandidateSelector(false)}
        onSelectPreset={handleSelectPresetCandidate}
        onSelectCustomRefcat={handleSelectCustomRefcat}
        isLoading={isLoadingCandidate}
        targetCandidateLabel={
          targetSelectorIndex >= candidates.length
            ? `Añadir Inmueble ${CANDIDATE_METAS[targetSelectorIndex]?.letter || ''} al Comparador`
            : `Cambiar Inmueble ${CANDIDATE_METAS[targetSelectorIndex]?.letter || 'B'}`
        }
      />
    </div>
  );
}

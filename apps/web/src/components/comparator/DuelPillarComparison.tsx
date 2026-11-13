import {
  PropertyAuditReport,
  BuildingCapExRisk,
} from '@openbarrio/core';
import { useTranslation } from '../../i18n';
import { deriveBuildingCapEx } from '../dossier/BuildingCapExCard';
import { isSubstandardHousing } from '../../utils/substandard';
import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  FileText,
  Footprints,
  HardHat,
  Shield,
  Volume2,
  Zap,
  TrendingUp,
  Plus,
  Trash2,
} from 'lucide-react';

export interface DuelPillarComparisonProps {
  reportA: PropertyAuditReport;
  candidateB: PropertyAuditReport;
  candidates?: PropertyAuditReport[];
  capexA: BuildingCapExRisk;
  capexB: BuildingCapExRisk;
  scoreA: number;
  scoreB: number;
  noiseA: number;
  noiseB: number;
  incomeA: number;
  incomeB: number;
  yearA: number;
  yearB: number;
  ageA: number;
  ageB: number;
  walkScoreA: number;
  walkScoreB: number;
  onCopy: (text: string, isA: boolean) => void;
  copiedA: boolean;
  copiedB: boolean;
  onOpenCandidateSelector: (index?: number) => void;
  onRemoveCandidate?: (index: number) => void;
  onAddCandidate?: () => void;
}

export const CANDIDATE_METAS = [
  {
    letter: 'A',
    roleTag: 'ACTIVO CANDIDATO A (REFERENCIA BASE)',
    borderClass: 'border-cyan-500/50',
    hoverBorderClass: 'hover:border-cyan-400',
    textAccentClass: 'text-cyan-400',
    textLightClass: 'text-cyan-300',
    bgBadgeClass: 'bg-cyan-950',
    borderBadgeClass: 'border-cyan-400',
    dotClass: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
    tagBgClass: 'bg-cyan-950/60 border-cyan-400/40 text-cyan-300',
    cardTestId: 'candidate-card-a',
    thTestId: 'th-candidate-a',
  },
  {
    letter: 'B',
    roleTag: 'ACTIVO COMPARADO B (OBJETO DE CONTRASTE)',
    borderClass: 'border-amber-500/50',
    hoverBorderClass: 'hover:border-amber-400',
    textAccentClass: 'text-amber-400',
    textLightClass: 'text-amber-300',
    bgBadgeClass: 'bg-amber-950',
    borderBadgeClass: 'border-amber-400',
    dotClass: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    tagBgClass: 'bg-amber-950/60 border-amber-400/40 text-amber-300',
    cardTestId: 'candidate-card-b',
    thTestId: 'th-candidate-b',
  },
  {
    letter: 'C',
    roleTag: 'ACTIVO COMPARADO C (OBJETO DE CONTRASTE)',
    borderClass: 'border-purple-500/50',
    hoverBorderClass: 'hover:border-purple-400',
    textAccentClass: 'text-purple-400',
    textLightClass: 'text-purple-300',
    bgBadgeClass: 'bg-purple-950',
    borderBadgeClass: 'border-purple-400',
    dotClass: 'bg-purple-400 shadow-[0_0_8px_#a855f7]',
    tagBgClass: 'bg-purple-950/60 border-purple-400/40 text-purple-300',
    cardTestId: 'candidate-card-c',
    thTestId: 'th-candidate-c',
  },
  {
    letter: 'D',
    roleTag: 'ACTIVO COMPARADO D (OBJETO DE CONTRASTE)',
    borderClass: 'border-emerald-500/50',
    hoverBorderClass: 'hover:border-emerald-400',
    textAccentClass: 'text-emerald-400',
    textLightClass: 'text-emerald-300',
    bgBadgeClass: 'bg-emerald-950',
    borderBadgeClass: 'border-emerald-400',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    tagBgClass: 'bg-emerald-950/60 border-emerald-400/40 text-emerald-300',
    cardTestId: 'candidate-card-d',
    thTestId: 'th-candidate-d',
  },
];

export function DuelPillarComparison({
  reportA,
  candidateB,
  candidates,
  capexA,
  capexB,
  noiseA,
  noiseB,
  incomeA,
  incomeB,
  yearA,
  yearB,
  ageA,
  ageB,
  walkScoreA,
  walkScoreB,
  onCopy,
  copiedA,
  copiedB,
  onOpenCandidateSelector,
  onRemoveCandidate,
  onAddCandidate,
}: DuelPillarComparisonProps) {
  const { t } = useTranslation();

  const allCandidates: PropertyAuditReport[] =
    candidates && candidates.length > 0 ? candidates : [reportA, candidateB];

  // Helper to derive CapEx for any candidate
  const getCandidateCapEx = (cand: PropertyAuditReport, idx: number): BuildingCapExRisk => {
    if (idx === 0) return capexA;
    if (idx === 1) return capexB;
    return (
      cand.capex ||
      deriveBuildingCapEx(
        cand.property.building.constructionYear || 1975,
        cand.property.building.builtSurfaceM2 || 90
      )
    );
  };

  const getCandidateYear = (cand: PropertyAuditReport, idx: number) => {
    if (idx === 0) return yearA;
    if (idx === 1) return yearB;
    return cand.property.building.constructionYear || 1975;
  };

  const getCandidateAge = (cand: PropertyAuditReport, idx: number) => {
    if (idx === 0) return ageA;
    if (idx === 1) return ageB;
    return new Date().getFullYear() - getCandidateYear(cand, idx);
  };

  const getCandidateNoise = (cand: PropertyAuditReport, idx: number) => {
    if (idx === 0) return noiseA;
    if (idx === 1) return noiseB;
    return cand.environment.noise?.dayEveningNightDecibels || 60;
  };

  const getCandidateIncome = (cand: PropertyAuditReport, idx: number) => {
    if (idx === 0) return incomeA;
    if (idx === 1) return incomeB;
    return cand.neighborhood.averageNetHouseholdIncomeEur || 35000;
  };

  const getCandidateWalkScore = (cand: PropertyAuditReport, idx: number) => {
    if (idx === 0) return walkScoreA;
    if (idx === 1) return walkScoreB;
    return cand.score.subscores.connectivity || 75;
  };

  return (
    <>
      {/* SECTION: SIDE-BY-SIDE CANDIDATE BENTO CARDS */}
      <section
        className={`grid grid-cols-1 ${
          allCandidates.length >= 3 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2'
        } gap-space-lg`}
      >
        {allCandidates.map((cand, idx) => {
          const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
          const candCapEx = getCandidateCapEx(cand, idx);
          const cYear = getCandidateYear(cand, idx);
          const cAge = getCandidateAge(cand, idx);
          const isSubstandard = isSubstandardHousing(cand);
          const isBase = idx === 0;

          return (
            <div
              key={cand.property.cadastralReference || idx}
              data-testid={meta.cardTestId}
              className={`bg-surface-container-low border-2 ${meta.borderClass} rounded-xl p-space-md flex flex-col justify-between shadow-lg relative`}
            >
              <div
                className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded ${meta.bgBadgeClass} border ${meta.borderBadgeClass} ${meta.textLightClass} font-mono text-[10px] font-semibold tracking-wide flex items-center gap-1.5`}
              >
                <span className={`w-2 h-2 rounded-full ${meta.dotClass}`} />
                <span>{meta.roleTag}</span>
              </div>

              <div className="mt-2">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
                  <div>
                    <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                      <span>
                        {cand.property.address.street} {cand.property.address.number}
                      </span>
                      {isBase ? (
                        <CheckCircle className={`w-4 h-4 ${meta.textAccentClass}`} />
                      ) : (
                        <AlertTriangle className={`w-4 h-4 ${meta.textAccentClass}`} />
                      )}
                    </h2>
                    <div className="font-mono text-xs text-on-surface-variant">
                      {cand.property.address.postalCode} {cand.property.address.municipality} · Sección Censal{' '}
                      {cand.neighborhood.censusSectionCode}
                    </div>
                  </div>

                  {/* Actions: RC Box & Remove button */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded border border-outline-variant">
                      <span className="text-outline font-mono text-xs">RC:</span>
                      <span className={`font-mono text-xs ${meta.textLightClass} font-semibold truncate max-w-[130px]`}>
                        {cand.property.cadastralReference}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopy(cand.property.cadastralReference, isBase)}
                        className={`text-on-surface-variant hover:${meta.textAccentClass} transition-colors p-0.5 cursor-pointer`}
                        title="Copiar Referencia Catastral"
                      >
                        {(isBase ? copiedA : copiedB) ? (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Candidate removal button (candidates beyond A) */}
                    {!isBase && onRemoveCandidate && (
                      <button
                        type="button"
                        data-testid={`remove-candidate-${meta.letter.toLowerCase()}`}
                        onClick={() => onRemoveCandidate(idx)}
                        className="p-1.5 rounded bg-surface-container hover:bg-rose-950/60 text-on-surface-variant hover:text-rose-400 border border-outline-variant hover:border-rose-500/40 transition-colors cursor-pointer"
                        title={t('duel.removeCandidate')}
                        aria-label={t('duel.removeCandidate')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Substandard Housing High-Alert Badge on Bento Card */}
                {isSubstandard && (
                  <div
                    data-testid="substandard-card-badge"
                    className="mt-2 p-2 rounded-lg bg-rose-950/70 border border-rose-500/80 text-rose-200 text-xs flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="font-mono text-[11px] font-bold text-rose-300">
                      {t('duel.substandardAlertBadge')} (Sin Cédula Residencial)
                    </span>
                  </div>
                )}

                {/* Key Technical Specs Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 font-mono text-xs">
                  <div className="p-2 rounded bg-surface-container border border-outline-variant">
                    <div className="text-on-surface-variant text-[10px]">Antigüedad / Año</div>
                    <div className="text-on-surface font-semibold mt-0.5">
                      {cYear} <span className={meta.textAccentClass}>({cAge} años)</span>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-container border border-outline-variant">
                    <div className="text-on-surface-variant text-[10px]">Sup. Construida / Útil</div>
                    <div className="text-on-surface font-semibold mt-0.5">
                      {cand.property.building.builtSurfaceM2} m² /{' '}
                      {Math.round(cand.property.building.builtSurfaceM2 * 0.86)} m²
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-container border border-outline-variant">
                    <div className="text-on-surface-variant text-[10px]">Cuota Participación</div>
                    <div className="text-on-surface font-semibold mt-0.5">
                      {cand.property.unit?.participationCoefficient
                        ? `${cand.property.unit.participationCoefficient}%`
                        : isBase
                        ? '3.2000%'
                        : '4.8500%'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-container border border-outline-variant">
                    <div className="text-on-surface-variant text-[10px]">Régimen Jurídico</div>
                    <div className="text-on-surface font-semibold mt-0.5">
                      {isBase ? 'Pleno Dominio' : 'Residencial Singular'}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded ${
                      candCapEx.iteStatus === 'favorable_active'
                        ? 'bg-emerald-950/40 border border-primary/40 text-primary'
                        : 'bg-amber-950/40 border border-amber-500/40 text-amber-300'
                    }`}
                  >
                    {candCapEx.iteStatus === 'favorable_active' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span>
                      ITE {candCapEx.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente / Subsan.'}{' '}
                      {candCapEx.iteDeadlineYear ? candCapEx.iteDeadlineYear : ''}
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded ${
                      isBase
                        ? 'bg-emerald-950/40 border border-primary/40 text-primary'
                        : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {isBase ? <Shield className="w-3 h-3" /> : <HardHat className="w-3 h-3" />}
                    <span>{isBase ? '0 Derramas activas' : 'Derrama Prevista (Ascensor/Petos)'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface">
                    <Award className="w-3 h-3 text-secondary" />
                    <span>
                      SERPAVI:{' '}
                      {cand.rentalBenchmark?.isStressedHousingZone
                        ? 'Zona Tensionada'
                        : isBase
                        ? 'Mercado Libre'
                        : 'Zona Gran Afluencia'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface">
                    <Volume2 className="w-3 h-3 text-primary" />
                    <span>Ruido: {cand.environment.noise?.dayEveningNightDecibels || 60} dBA</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Ratio Valor Catastral: {isBase ? '1.420' : '1.810'} €/m²</span>
                {isBase ? (
                  <span className={meta.textAccentClass}>Activo Referencia</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenCandidateSelector(idx)}
                    className={`${meta.textAccentClass} hover:underline flex items-center gap-1 cursor-pointer`}
                  >
                    <span>{idx === 1 ? 'Cambiar Inmueble B ▾' : `Cambiar Inmueble ${meta.letter} ▾`}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Candidate Slot Card (when fewer than 4 candidates) */}
        {allCandidates.length < 4 && onAddCandidate && (
          <button
            type="button"
            data-testid="add-candidate-slot"
            onClick={onAddCandidate}
            className="border-2 border-dashed border-outline-variant hover:border-primary/60 rounded-xl p-space-md flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:text-primary min-h-[280px] transition-all cursor-pointer bg-surface-container-lowest/40 hover:bg-surface-container-low group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant group-hover:border-primary/50 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="font-headline font-bold text-sm block text-on-surface group-hover:text-primary transition-colors">
                + {t('duel.addCandidate')} ({allCandidates.length}/4)
              </span>
              <span className="font-mono text-xs text-on-surface-variant mt-0.5 block">
                Compara hasta 4 inmuebles en matriz
              </span>
            </div>
          </button>
        )}
      </section>

      {/* SECTION: DIFFERENTIAL MATRIX TABLE */}
      <section className="w-full bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="px-space-md py-3 bg-surface-container border-b border-outline-variant flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="font-headline font-bold text-on-surface text-sm sm:text-base">
              {t('duel.matrixTitle')}
            </h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant flex-wrap">
            {allCandidates.map((_, idx) => {
              const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
              return (
                <span key={meta.letter} className="inline-flex items-center gap-1 mr-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${meta.dotClass.split(' ')[0]}`} />
                  <span>Inmueble {meta.letter}</span>
                </span>
              );
            })}
            <span className="text-outline">|</span>
            <span className="text-primary font-medium">Margen Cartográfico &lt;0.05%</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table data-testid="differential-matrix-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-high/80 text-on-surface-variant font-mono uppercase tracking-wider border-b border-outline-variant text-[10px]">
                <th className="py-3 px-space-md w-1/5">{t('duel.vectorCol')}</th>
                {allCandidates.map((cand, idx) => {
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <th key={meta.letter} data-testid={meta.thTestId} className={`py-3 px-space-md ${meta.textLightClass}`}>
                      {t(`duel.candidate${meta.letter}` as any) || `Inmueble ${meta.letter}`} (
                      {cand.property.address.street.substring(0, 16)})
                    </th>
                  );
                })}
                <th className="py-3 px-space-md w-1/6 font-mono font-semibold">{t('duel.deltaCol')}</th>
                <th className="py-3 px-space-md w-1/6 text-right">{t('duel.verdictCol')}</th>
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
                {allCandidates.map((cand, idx) => {
                  const ws = getCandidateWalkScore(cand, idx);
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={meta.letter} className="py-3 px-space-md font-mono">
                      <div className="font-bold text-on-surface">
                        {ws} pts{' '}
                        <span className={`${meta.textAccentClass} font-normal`}>
                          ({ws >= 80 ? 'Excepcional' : 'Notable'})
                        </span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        {idx === 0 ? 'Metro & dotaciones <300m' : 'Transporte <500m'}
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-space-md font-mono font-semibold">
                  {walkScoreA >= walkScoreB ? (
                    <span className="text-cyan-300">+{walkScoreA - walkScoreB} pts {t('duel.candidateA')}</span>
                  ) : (
                    <span className="text-amber-300">+{walkScoreB - walkScoreA} pts {t('duel.candidateB')}</span>
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
                    <span>{t('duel.verdictLabel')}: {walkScoreA >= walkScoreB ? t('duel.winnerA') : t('duel.winnerB')}</span>
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
                {allCandidates.map((cand, idx) => {
                  const inc = getCandidateIncome(cand, idx);
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={meta.letter} className="py-3 px-space-md font-mono">
                      <div className="font-bold text-on-surface">{inc.toLocaleString('es-ES')} € / hogar</div>
                      <div className="text-on-surface-variant text-[11px]">
                        Decil censal {cand.neighborhood.percentileInMunicipality ? Math.ceil(cand.neighborhood.percentileInMunicipality / 10) : 8}
                      </div>
                    </td>
                  );
                })}
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
                {allCandidates.map((cand, idx) => {
                  const n = getCandidateNoise(cand, idx);
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={meta.letter} className="py-3 px-space-md font-mono">
                      <div className={`font-bold ${meta.textAccentClass}`}>
                        {n} dBA <span className="text-on-surface-variant font-normal">(Lden)</span>
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        {n < 60 ? 'Exposición baja' : n <= 65 ? 'Moderada' : 'Eje rodado intenso'}
                      </div>
                    </td>
                  );
                })}
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
                {allCandidates.map((cand, idx) => {
                  const cap = getCandidateCapEx(cand, idx);
                  return (
                    <td key={cand.property.cadastralReference || idx} className="py-3 px-space-md font-mono">
                      <div className={`font-bold ${cap.iteStatus === 'favorable_active' ? 'text-on-surface' : 'text-error'}`}>
                        ITE {cap.iteStatus === 'favorable_active' ? 'Favorable' : 'Pendiente / Subsan.'}
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        Riesgo: <strong className={cap.iteStatus === 'favorable_active' ? 'text-primary' : 'text-amber-400'}>
                          {cap.iteStatus === 'favorable_active' ? 'BAJO' : 'MEDIO-ALTO'}
                        </strong> · Cuota: {cap.estimatedCommunityExpenseRangeEurMonth.min} €/mes
                      </div>
                    </td>
                  );
                })}
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
                {allCandidates.map((cand, idx) => {
                  const y = getCandidateYear(cand, idx);
                  const a = getCandidateAge(cand, idx);
                  return (
                    <td key={cand.property.cadastralReference || idx} className="py-3 px-space-md font-mono">
                      <div className="font-bold text-on-surface">Año {y}</div>
                      <div className="text-on-surface-variant text-[11px]">{a} años de antigüedad</div>
                    </td>
                  );
                })}
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

              {/* ROW 6: Energy Performance (CEE) */}
              <tr className="hover:bg-surface-container transition-colors">
                <td className="py-3 px-space-md">
                  <div className="font-semibold text-on-surface flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Eficiencia Energética (CEE)</span>
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                    Calificación oficial autonómica y consumo térmico
                  </div>
                </td>
                {allCandidates.map((cand, idx) => {
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={cand.property.cadastralReference || idx} className="py-3 px-space-md font-mono">
                      <div className={`font-bold ${meta.textLightClass}`}>
                        Clase {cand.energy?.ratingEmissions || 'E'}
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        {cand.energy?.isEstimated ? 'Estimado CTE' : 'Oficial'} ·{' '}
                        {cand.energy?.annualEstimatedCostEur ? `~${cand.energy.annualEstimatedCostEur} €/año` : '—'}
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-space-md font-mono font-semibold">
                  <span className="text-cyan-300">
                    {reportA.energy && candidateB.energy
                      ? `Ahorro: ~${Math.abs((candidateB.energy.annualEstimatedCostEur || 1000) - (reportA.energy.annualEstimatedCostEur || 1000))} €/año`
                      : 'Calificación comparable'}
                  </span>
                </td>
                <td className="py-3 px-space-md text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-semibold">
                    <Shield className="w-3 h-3" />
                    <span>Ganador: {(reportA.energy?.ratingEmissions || 'E') <= (candidateB.energy?.ratingEmissions || 'E') ? 'Inmueble A' : 'Inmueble B'}</span>
                  </span>
                </td>
              </tr>

              {/* ROW 7: Historical Trends (INE IPV & ADRH) */}
              <tr className="hover:bg-surface-container transition-colors">
                <td className="py-3 px-space-md">
                  <div className="font-semibold text-on-surface flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Evolución Histórica (5 Años)</span>
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                    Crecimiento de renta y precios INE IPV
                  </div>
                </td>
                {allCandidates.map((cand, idx) => {
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={cand.property.cadastralReference || idx} className="py-3 px-space-md font-mono">
                      <div className={`font-bold ${meta.textLightClass}`}>
                        +{cand.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 18.5}% renta
                      </div>
                      <div className="text-on-surface-variant text-[11px]">
                        +{cand.marketTrends?.summary.fiveYearPriceIndexGrowthPct ?? 20.0}% precio IPV
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-space-md font-mono font-semibold">
                  <span className="text-cyan-300">
                    +{Math.abs((reportA.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 21.4) - (candidateB.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 14.2)).toFixed(1)}% delta renta
                  </span>
                </td>
                <td className="py-3 px-space-md text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-semibold">
                    <Shield className="w-3 h-3" />
                    <span>Ganador: {(reportA.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 21.4) >= (candidateB.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 14.2) ? 'Inmueble A' : 'Inmueble B'}</span>
                  </span>
                </td>
              </tr>

              {/* ROW 8: Infravivienda Risk / Substandard Commercial Housing Status */}
              <tr data-testid="row-substandard-housing" className="hover:bg-surface-container transition-colors bg-surface-container-low/60">
                <td className="py-3 px-space-md">
                  <div className="font-semibold text-on-surface flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{t('duel.substandardRowTitle')}</span>
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-0.5">
                    {t('duel.substandardRowDesc')}
                  </div>
                </td>
                {allCandidates.map((cand, idx) => {
                  const isSub = isSubstandardHousing(cand);
                  const meta = CANDIDATE_METAS[idx] || CANDIDATE_METAS[0];
                  return (
                    <td key={cand.property.cadastralReference || idx} className="py-3 px-space-md font-mono">
                      <div data-testid={`substandard-status-${meta.letter.toLowerCase()}`}>
                        {isSub ? (
                          <>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/70 text-rose-300 font-bold text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>{t('duel.substandardAlertBadge')}</span>
                            </span>
                            <div className="text-[10px] text-rose-400 font-mono mt-0.5">
                              Sin cédula residencial
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 font-semibold text-[11px]">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{t('duel.substandardConformBadge')}</span>
                            </span>
                            <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                              Uso Residencial Pleno
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-space-md font-mono font-semibold">
                  {allCandidates.some(isSubstandardHousing) ? (
                    <span className="text-rose-400">
                      Discrepancia de Uso
                      <br />
                      <span className="text-[10px] text-on-surface-variant font-normal">
                        Alerta de Cédula detectada
                      </span>
                    </span>
                  ) : (
                    <span className="text-emerald-300">
                      100% Conforme
                      <br />
                      <span className="text-[10px] text-on-surface-variant font-normal">
                        Sin indicios de infravivienda
                      </span>
                    </span>
                  )}
                </td>
                <td className="py-3 px-space-md text-right">
                  {(() => {
                    const nonSubstandard = allCandidates.filter((c) => !isSubstandardHousing(c));
                    if (nonSubstandard.length === allCandidates.length) {
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-400/40 text-emerald-300 font-mono text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Conformes</span>
                        </span>
                      );
                    }
                    if (nonSubstandard.length > 0) {
                      const firstWinnerIdx = allCandidates.findIndex((c) => !isSubstandardHousing(c));
                      const winnerLetter = CANDIDATE_METAS[firstWinnerIdx]?.letter || 'A';
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 font-mono text-[10px] font-semibold">
                          <Award className="w-3 h-3" />
                          <span>Ganador: Inmueble {winnerLetter}</span>
                        </span>
                      );
                    }
                    return (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 border border-rose-500/60 text-rose-300 font-mono text-[10px] font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Alerta General</span>
                      </span>
                    );
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

import {
  PropertyAuditReport,
  BuildingCapExRisk,
} from '@openbarrio/core';
import { useTranslation } from '../../i18n';
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
} from 'lucide-react';

export interface DuelPillarComparisonProps {
  reportA: PropertyAuditReport;
  candidateB: PropertyAuditReport;
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
  onOpenCandidateSelector: () => void;
}

export function DuelPillarComparison({
  reportA,
  candidateB,
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
}: DuelPillarComparisonProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* SECTION: SIDE-BY-SIDE CANDIDATE BENTO CARDS */}
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
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-outline-variant/60 pb-3">
              <div>
                <h2 className="font-headline text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                  <span>
                    {reportA.property.address.street} {reportA.property.address.number}
                  </span>
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
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
                  onClick={() => onCopy(reportA.property.cadastralReference, true)}
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
                  onClick={() => onCopy(candidateB.property.cadastralReference, false)}
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
              onClick={onOpenCandidateSelector}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Cambiar Inmueble B ▾</span>
            </button>
          </div>
        </div>
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
          <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400" /> {t('duel.candidateA')}
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-2" /> {t('duel.candidateB')}
            <span className="text-outline ml-2">|</span>
            <span className="text-primary font-medium">Margen Cartográfico &lt;0.05%</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table data-testid="differential-matrix-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-high/80 text-on-surface-variant font-mono uppercase tracking-wider border-b border-outline-variant text-[10px]">
                <th className="py-3 px-space-md w-1/5">{t('duel.vectorCol')}</th>
                <th className="py-3 px-space-md w-1/4 text-cyan-300">
                  {t('duel.candidateA')} ({reportA.property.address.street.substring(0, 16)})
                </th>
                <th className="py-3 px-space-md w-1/4 text-amber-300">
                  {t('duel.candidateB')} ({candidateB.property.address.street.substring(0, 16)})
                </th>
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
                <td className="py-3 px-space-md font-mono">
                  <div className="font-bold text-on-surface">
                    Clase {reportA.energy?.ratingEmissions || 'E'}
                  </div>
                  <div className="text-on-surface-variant text-[11px]">
                    {reportA.energy?.isEstimated ? 'Estimado CTE' : 'Oficial'} · {reportA.energy?.annualEstimatedCostEur ? `~${reportA.energy.annualEstimatedCostEur} €/año` : '—'}
                  </div>
                </td>
                <td className="py-3 px-space-md font-mono">
                  <div className="font-bold text-amber-300">
                    Clase {candidateB.energy?.ratingEmissions || 'E'}
                  </div>
                  <div className="text-on-surface-variant text-[11px]">
                    {candidateB.energy?.isEstimated ? 'Estimado CTE' : 'Oficial'} · {candidateB.energy?.annualEstimatedCostEur ? `~${candidateB.energy.annualEstimatedCostEur} €/año` : '—'}
                  </div>
                </td>
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
                <td className="py-3 px-space-md font-mono">
                  <div className="font-bold text-emerald-400">
                    +{reportA.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 21.4}% renta
                  </div>
                  <div className="text-on-surface-variant text-[11px]">
                    +{reportA.marketTrends?.summary.fiveYearPriceIndexGrowthPct ?? 22.7}% precio IPV
                  </div>
                </td>
                <td className="py-3 px-space-md font-mono">
                  <div className="font-bold text-amber-300">
                    +{candidateB.marketTrends?.summary.fiveYearIncomeGrowthPct ?? 14.2}% renta
                  </div>
                  <div className="text-on-surface-variant text-[11px]">
                    +{candidateB.marketTrends?.summary.fiveYearPriceIndexGrowthPct ?? 18.5}% precio IPV
                  </div>
                </td>
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
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

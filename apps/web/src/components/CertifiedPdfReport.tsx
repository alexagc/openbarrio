import { useEffect, useState } from 'react';
import {
  isLayerUsable,
  STALE_AMBER_DAYS,
  type LayerKey,
  type LayerStatusInfo,
  type PropertyAuditReport,
} from '@openbarrio/core';
import { computeAuditSha256, buildCatastroVerificationUrl } from '../utils/cryptoSeal';
import { Shield } from 'lucide-react';
import { useTranslation } from '../i18n';
import { LayerStatusBadge } from './common/LayerStatusBadge';

interface CertifiedPdfReportProps {
  report: PropertyAuditReport;
}

const DEFAULT_WEIGHTS = {
  connectivity: 0.25,
  building: 0.25,
  socioeconomic: 0.2,
  environmental: 0.15,
  urbanPlanning: 0.15,
};

function formatPdfDate(iso?: string, locale = 'es'): string {
  if (!iso) return '—';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  try {
    return parsed.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export function CertifiedPdfReport({ report }: CertifiedPdfReportProps) {
  const { language, t } = useTranslation();
  const [shaSeal, setShaSeal] = useState<string>('Calculando sello criptográfico...');
  const catastroUrl = buildCatastroVerificationUrl(
    report.property.cadastralReference,
    report.property.jurisdiction
  );

  useEffect(() => {
    let isMounted = true;
    computeAuditSha256(report).then((hash) => {
      if (isMounted) setShaSeal(hash);
    });
    return () => {
      isMounted = false;
    };
  }, [report]);

  const {
    property,
    score,
    environment,
    rentalBenchmark,
    connectivity,
    energy,
    marketTrends,
    layers,
  } = report;
  const unit = property.unit;

  const isUncertain = score.trafficLight === 'UNCERTAIN';
  const sicaStatus = layers?.sica?.status;
  const sncziStatus = layers?.snczi?.status;
  const criticalNotEvaluated =
    (score.coverage?.missingCriticalLayers?.length ?? 0) > 0 ||
    !environment.noise ||
    !environment.floodRisk ||
    (sicaStatus !== undefined && !isLayerUsable(sicaStatus)) ||
    (sncziStatus !== undefined && !isLayerUsable(sncziStatus));

  const weights = score.weightsUsed ?? DEFAULT_WEIGHTS;
  const coverage = score.coverage ?? {
    ok: 5,
    total: 5,
    pillarsWithData: 5,
    pillarsTotal: 5 as const,
    level: 'high' as const,
    missingCriticalLayers: [],
  };

  const layerRows: Array<{ key: LayerKey; label: string; info?: LayerStatusInfo }> = [
    { key: 'catastro', label: 'Catastro OVC', info: layers?.catastro },
    { key: 'ine', label: 'INE ADRH', info: layers?.ine },
    { key: 'sica', label: 'MITECO SICA (Ruido)', info: layers?.sica },
    { key: 'snczi', label: 'MITECO SNCZI (Inundabilidad)', info: layers?.snczi },
    { key: 'mivau', label: 'MIVAU SERPAVI', info: layers?.mivau },
    { key: 'cee', label: 'CEE Autonómico', info: layers?.cee },
    { key: 'ite', label: 'ITE / IEE Municipal', info: layers?.ite },
  ];

  // Generate SVG QR matrix pattern
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    catastroUrl
  )}`;

  return (
    <div
      data-testid="certified-pdf-report"
      data-traffic-light={score.trafficLight ?? 'GREEN'}
      className="hidden print:block print:w-full print:p-8 bg-white text-slate-900 font-sans print:text-xs"
    >
      {/* ================= PAGE 1: OFFICIAL CERTIFICATE HEADER ================= */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-slate-900 text-white font-bold tracking-wider rounded">
              CERTIFICADO OFICIAL
            </span>
            <span className="text-xs text-slate-600 font-mono">
              EXPEDIENTE: OB-{report.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-headline tracking-tight text-slate-900">
            Informe Oficial de Due Diligence Inmobiliaria
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Agregación y normalización de registros públicos oficiales del Reino de España
          </p>
        </div>

        {/* QR Code to Sede del Catastro */}
        <div className="text-center">
          <img
            src={qrSvgUrl}
            alt="Código QR Verificación Sede Catastro"
            className="w-20 h-20 border border-slate-300 p-1 mx-auto"
          />
          <span className="text-[9px] font-mono text-slate-500 block mt-1">
            Verificar en Catastro
          </span>
        </div>
      </div>

      {/* ================= CRYPTOGRAPHIC INTEGRITY SEAL BAR ================= */}
      <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide font-mono">
              Sello Criptográfico de Integridad SHA-256 (Snapshot Registral)
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">
            BarrioScore v{score.methodologyVersion || '2.0.0'}
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-600 break-all bg-white p-1.5 border border-slate-200 rounded select-all">
          {shaSeal}
        </div>
        <div className="flex flex-wrap items-center justify-between text-[9px] text-slate-500 mt-1 font-mono gap-2">
          <span>Fecha de Emisión: {new Date(report.generatedAt).toLocaleString('es-ES')}</span>
          <span>
            {t('uncertainty.coverageLabel', {
              ok: coverage.pillarsWithData,
              total: coverage.pillarsTotal,
            })}
          </span>
          <span>Proyección: EPSG:4326 (WGS84) / ETRS89</span>
        </div>
      </div>

      {/* ================= SECTION 1: CADASTRAL IDENTIFICATION ================= */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
          1. Identificación Catastral y Régimen de Propiedad
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <table className="w-full text-[10px] border border-slate-200">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold w-1/3">Dirección Oficial</td>
                <td className="p-1.5 font-mono">
                  {property.address.street} {property.address.number}
                  {unit?.block && `, Portal ${unit.block}`}
                  {unit?.floor && `, Pl. ${unit.floor}`}
                  {unit?.door && ` Pta. ${unit.door}`}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Municipio / CP</td>
                <td className="p-1.5">
                  {property.address.municipality} ({property.address.postalCode})
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Referencia Catastral</td>
                <td className="p-1.5 font-mono font-bold">{property.cadastralReference}</td>
              </tr>
              <tr>
                <td className="p-1.5 bg-slate-100 font-semibold">Coordenadas Centroidales</td>
                <td className="p-1.5 font-mono">
                  {property.coordinates.latitude.toFixed(5)}, {property.coordinates.longitude.toFixed(5)}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="w-full text-[10px] border border-slate-200">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold w-1/3">Año de Construcción</td>
                <td className="p-1.5">
                  {property.building.constructionYear > 0
                    ? property.building.constructionYear
                    : t('uncertainty.notAvailableShort')}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Superficie Parcela / Total</td>
                <td className="p-1.5 font-mono">{property.building.builtSurfaceM2} m²</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Uso Principal</td>
                <td className="p-1.5">{property.building.primaryUse}</td>
              </tr>
              <tr>
                <td className="p-1.5 bg-slate-100 font-semibold">División Horizontal</td>
                <td className="p-1.5">
                  {unit ? (
                    <span className="font-bold text-emerald-800">
                      {unit.block ? `Portal ${unit.block} · ` : ''}Planta {unit.floor} · Puerta{' '}
                      {unit.door} ({unit.builtSurfaceM2} m² · cpt: {unit.participationCoefficient || '—'}%)
                    </span>
                  ) : (
                    `Edificio Completo (${property.building.unitsCount} inmuebles registrados)`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SECTION 2: 5-PILLAR AUDIT SCORECARD ================= */}
      <div className="mb-6">
        <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
            2. Barrio Due Diligence Score (Calificación 0 - 100)
          </h2>
          {isUncertain && (
            <span
              data-testid="pdf-uncertain-badge"
              className="px-2 py-0.5 rounded bg-slate-200 border border-slate-400 text-slate-800 font-mono text-[10px] font-bold uppercase"
            >
              {t('uncertainty.uncertainBadge')}
            </span>
          )}
        </div>

        {(isUncertain || criticalNotEvaluated) && (
          <div
            data-testid="pdf-uncertainty-notice"
            className="mb-3 p-2.5 rounded border border-slate-400 bg-slate-100 text-slate-800 text-[10px] space-y-1"
          >
            {isUncertain && (
              <p className="font-semibold">
                {t('uncertainty.uncertainTitle')}: {t('uncertainty.uncertainDesc')}
              </p>
            )}
            {criticalNotEvaluated && (
              <p className="font-semibold text-amber-900">
                {t('uncertainty.criticalRiskNotEvaluated')}
              </p>
            )}
          </div>
        )}

        <div
          className={`flex items-center gap-6 p-4 border rounded ${
            isUncertain ? 'bg-slate-100 border-slate-400' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="text-center px-4 border-r border-slate-300">
            <span
              className={`text-3xl font-extrabold font-headline block ${
                isUncertain ? 'text-slate-600' : 'text-slate-900'
              }`}
            >
              {score.overallScore}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              {isUncertain ? t('uncertainty.uncertainBadge') : 'Puntuación Global'}
            </span>
          </div>

          <div className="flex-1 grid grid-cols-5 gap-2 text-center text-[10px]">
            {(
              [
                { key: 'connectivity', label: 'Conectividad', val: score.subscores.connectivity },
                { key: 'building', label: 'Edificación', val: score.subscores.building },
                { key: 'socioeconomic', label: 'Socioeconomía', val: score.subscores.socioeconomic },
                { key: 'environmental', label: 'Medio Ambiente', val: score.subscores.environmental },
                { key: 'urbanPlanning', label: 'Urbanismo', val: score.subscores.urbanPlanning },
              ] as const
            ).map((pillar) => {
              const weightPct = Math.round((weights[pillar.key] ?? 0) * 100);
              return (
                <div key={pillar.key} className="p-2 bg-white rounded border border-slate-200">
                  <span className="block font-bold text-slate-800 text-sm">
                    {weightPct === 0 ? '—' : pillar.val}
                  </span>
                  <span className="text-slate-500 text-[9px] block">
                    {pillar.label} ({weightPct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECTION 2B: ENVIRONMENTAL & SOURCE PROVENANCE ================= */}
      <div className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
          2B. Seguridad Ambiental & Trazabilidad de Fuentes Oficiales
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="p-2 border border-slate-200 rounded text-[10px]">
            <span className="font-semibold text-slate-700 block">Acústica (MITECO SICA):</span>
            <span className="font-mono text-slate-900">
              {layers?.sica && !isLayerUsable(layers.sica.status)
                ? layers.sica.status === 'out_of_coverage'
                  ? t('uncertainty.outOfCoverage')
                  : t('uncertainty.unavailable')
                : environment.noise
                ? `${Math.round(environment.noise.dayEveningNightDecibels)} dBA (${environment.noise.category})`
                : t('uncertainty.unavailable')}
            </span>
          </div>
          <div className="p-2 border border-slate-200 rounded text-[10px]">
            <span className="font-semibold text-slate-700 block">Inundabilidad (MITECO SNCZI):</span>
            <span className="font-mono text-slate-900">
              {layers?.snczi && !isLayerUsable(layers.snczi.status)
                ? layers.snczi.status === 'out_of_coverage'
                  ? t('uncertainty.outOfCoverage')
                  : t('uncertainty.unavailable')
                : environment.floodRisk
                ? environment.floodRisk.level
                : t('uncertainty.unavailable')}
            </span>
          </div>
        </div>

        {layers && (
          <table className="w-full text-[9px] border border-slate-200">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-mono">
                <th className="p-1 text-left">Fuente</th>
                <th className="p-1 text-left">Estado</th>
                <th className="p-1 text-left">Verificación / Fecha dato</th>
              </tr>
            </thead>
            <tbody>
              {layerRows.map(({ key, label, info }) => {
                if (!info) return null;
                const staleDays = info.staleDays ?? 0;
                return (
                  <tr key={key} className="border-b border-slate-200 last:border-b-0">
                    <td className="p-1 font-semibold">{label}</td>
                    <td className="p-1">
                      <LayerStatusBadge info={info} showOk />
                    </td>
                    <td className="p-1 font-mono text-slate-600">
                      {info.status === 'stale' && info.verifiedAt
                        ? `${t('uncertainty.staleVerified', { date: formatPdfDate(info.verifiedAt, language) })}${
                            staleDays >= STALE_AMBER_DAYS ? ' (!)' : ''
                          }`
                        : info.sourceDate || (info.verifiedAt ? formatPdfDate(info.verifiedAt, language) : '—')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= SECTION 3: MIVAU RENTAL BENCHMARK & CIVIC CONNECTIVITY ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
            3. Alquiler de Referencia (MIVAU SERPAVI)
          </h2>
          {rentalBenchmark ? (
            <table className="w-full text-[10px] border border-slate-200">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Horquilla Oficial (€/m²)</td>
                  <td className="p-1.5 font-mono">
                    {rentalBenchmark.officialRangeLowerEurM2.toFixed(1)} -{' '}
                    {rentalBenchmark.officialRangeUpperEurM2.toFixed(1)} €/m²
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Estimación Mensual</td>
                  <td className="p-1.5 font-mono font-bold">
                    {Math.round(rentalBenchmark.estimatedMonthlyRentLowerEur)} -{' '}
                    {Math.round(rentalBenchmark.estimatedMonthlyRentUpperEur)} €/mes
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 bg-slate-100 font-semibold">Zona Tensionada (Ley 12/2023)</td>
                  <td className="p-1.5">
                    {rentalBenchmark.isStressedHousingZone ? (
                      <span className="text-amber-800 font-bold">
                        SÍ (Tope legal de renta vigente)
                      </span>
                    ) : (
                      <span className="text-slate-600">No declarada como zona tensionada</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-[10px] text-slate-500">{t('uncertainty.unavailable')}</p>
          )}
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
            4. Dotaciones Cívicas a 15 Minutos
          </h2>
          <table className="w-full text-[10px] border border-slate-200">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Sanidad Pública (CAP)</td>
                <td className="p-1.5">
                  {connectivity?.nearestHealthcare
                    ? `${connectivity.nearestHealthcare.name} (${Math.round(
                        connectivity.nearestHealthcare.walkTimeMinutes
                      )} min · ${connectivity.nearestHealthcare.distanceMeters}m)`
                    : t('uncertainty.unavailable')}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Transporte Masivo</td>
                <td className="p-1.5">
                  {connectivity?.nearestTransit
                    ? `${connectivity.nearestTransit.name} (${Math.round(
                        connectivity.nearestTransit.walkTimeMinutes
                      )} min · ${connectivity.nearestTransit.distanceMeters}m)`
                    : t('uncertainty.unavailable')}
                </td>
              </tr>
              <tr>
                <td className="p-1.5 bg-slate-100 font-semibold">Espacios Verdes / Parques</td>
                <td className="p-1.5">
                  {connectivity?.nearestPark
                    ? `${connectivity.nearestPark.name} (${Math.round(
                        connectivity.nearestPark.walkTimeMinutes
                      )} min · ${connectivity.nearestPark.distanceMeters}m)`
                    : t('uncertainty.unavailable')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SECTION 5: ENERGY PERFORMANCE (CEE) & MARKET TRENDS ================= */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
            5. Eficiencia Energética (CEE)
          </h2>
          {energy ? (
            <table className="w-full text-[10px] border border-slate-200">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Calificación Emisiones</td>
                  <td className="p-1.5 font-bold font-mono">
                    Clase {energy.ratingEmissions} (
                    {energy.isEstimated ? 'Estimación Normativa CTE' : 'Oficial Registrado'})
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Consumo Energía Primaria</td>
                  <td className="p-1.5 font-mono">
                    {energy.primaryEnergyConsumption || '—'} kWh/m²·año
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 bg-slate-100 font-semibold">Gasto Estimado</td>
                  <td className="p-1.5 font-mono">
                    {energy.annualEstimatedCostEur
                      ? `~${energy.annualEstimatedCostEur.toLocaleString('es-ES')} €/año`
                      : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-[10px] text-slate-500">{t('uncertainty.unavailable')}</p>
          )}
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
            6. Serie Histórica de Mercado (INE IPV & ADRH)
          </h2>
          {marketTrends ? (
            <table className="w-full text-[10px] border border-slate-200">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Crecimiento Renta (5A)</td>
                  <td className="p-1.5 font-bold text-emerald-800 font-mono">
                    +{marketTrends.summary.fiveYearIncomeGrowthPct}% en sección censal
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Crecimiento IPV Vivienda</td>
                  <td className="p-1.5 font-mono font-bold">
                    +{marketTrends.summary.fiveYearPriceIndexGrowthPct}% en{' '}
                    {marketTrends.autonomousCommunity}
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 bg-slate-100 font-semibold">Dinámica del Vecindario</td>
                  <td className="p-1.5 font-semibold capitalize">
                    {marketTrends.summary.gentrificationIndicator === 'high'
                      ? 'Revalorización Rápida / Gentrificación'
                      : marketTrends.summary.gentrificationIndicator === 'moderate'
                      ? 'Crecimiento Sostenido'
                      : 'Estable'}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-[10px] text-slate-500">{t('uncertainty.unavailable')}</p>
          )}
        </div>
      </div>

      {/* ================= OFFICIAL FOOTER & LEGAL DISCLAIMER ================= */}
      <div className="border-t-2 border-slate-900 pt-3 mt-8 text-[9px] text-slate-500 flex items-start justify-between">
        <div className="max-w-xl">
          <p className="font-semibold text-slate-700">Fuentes Oficiales Públicas Agregadas:</p>
          <p>
            Dirección General del Catastro (OVC REST/WFS) · Instituto Nacional de Estadística (INE ADRH) ·
            Ministerio para la Transición Ecológica (MITECO SICA Ruido & SNCZI Inundabilidad) ·
            Ministerio de Vivienda y Agenda Urbana (MIVAU SERPAVI & SIU).
          </p>
          <p className="mt-1">
            Metodología pública BarrioScore v{score.methodologyVersion || '2.0.0'}: https://openbarrio.org/metodologia ·
            OpenBarrio es una plataforma de telemetría cívica abierta (Civic-Tech). Este informe digital no sustituye una tasación
            pericial oficial ECO ni una certificación registral del Registro de la Propiedad.
          </p>
        </div>

        <div className="text-right font-mono">
          <span className="block font-bold text-slate-800">OPENBARRIO DUE DILIGENCE</span>
          <span>https://openbarrio.org</span>
        </div>
      </div>
    </div>
  );
}

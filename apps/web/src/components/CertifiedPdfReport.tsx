import { useEffect, useState } from 'react';
import { PropertyAuditReport } from '@openbarrio/core';
import { computeAuditSha256, buildCatastroVerificationUrl } from '../utils/cryptoSeal';
import { Shield } from 'lucide-react';

interface CertifiedPdfReportProps {
  report: PropertyAuditReport;
}

export function CertifiedPdfReport({ report }: CertifiedPdfReportProps) {
  const [shaSeal, setShaSeal] = useState<string>('Calculando sello criptográfico...');
  const catastroUrl = buildCatastroVerificationUrl(report.property.cadastralReference);

  useEffect(() => {
    let isMounted = true;
    computeAuditSha256(report).then((hash) => {
      if (isMounted) setShaSeal(hash);
    });
    return () => {
      isMounted = false;
    };
  }, [report]);

  const { property, score, rentalBenchmark, connectivity } = report;
  const unit = property.unit;

  // Generate SVG QR matrix pattern
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    catastroUrl
  )}`;

  return (
    <div className="hidden print:block print:w-full print:p-8 bg-white text-slate-900 font-sans print:text-xs">
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
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide font-mono">
            Sello Criptográfico de Integridad SHA-256 (Snapshot Registral)
          </span>
        </div>
        <div className="font-mono text-[9px] text-slate-600 break-all bg-white p-1.5 border border-slate-200 rounded select-all">
          {shaSeal}
        </div>
        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-mono">
          <span>Fecha de Emisión: {new Date(report.generatedAt).toLocaleString('es-ES')}</span>
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
                <td className="p-1.5 font-mono">{property.address.street} {property.address.number}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Municipio / CP</td>
                <td className="p-1.5">{property.address.municipality} ({property.address.postalCode})</td>
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
                <td className="p-1.5">{property.building.constructionYear || 'Sin datos'}</td>
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
                      Planta {unit.floor} · Puerta {unit.door} ({unit.builtSurfaceM2} m² · cpt: {unit.participationCoefficient || '—'}%)
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-300 pb-1 mb-2 font-mono">
          2. Barrio Due Diligence Score (Calificación 0 - 100)
        </h2>

        <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded">
          <div className="text-center px-4 border-r border-slate-300">
            <span className="text-3xl font-extrabold font-headline text-slate-900 block">
              {score.overallScore}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase">
              Puntuación Global
            </span>
          </div>

          <div className="flex-1 grid grid-cols-5 gap-2 text-center text-[10px]">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="block font-bold text-slate-800 text-sm">
                {score.subscores.connectivity}
              </span>
              <span className="text-slate-500 text-[9px] block">Conectividad (25%)</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="block font-bold text-slate-800 text-sm">
                {score.subscores.building}
              </span>
              <span className="text-slate-500 text-[9px] block">Edificación (25%)</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="block font-bold text-slate-800 text-sm">
                {score.subscores.socioeconomic}
              </span>
              <span className="text-slate-500 text-[9px] block">Socioeconomía (20%)</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="block font-bold text-slate-800 text-sm">
                {score.subscores.environmental}
              </span>
              <span className="text-slate-500 text-[9px] block">Medio Ambiente (15%)</span>
            </div>
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="block font-bold text-slate-800 text-sm">
                {score.subscores.urbanPlanning}
              </span>
              <span className="text-slate-500 text-[9px] block">Urbanismo (15%)</span>
            </div>
          </div>
        </div>
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
                    {rentalBenchmark.officialRangeLowerEurM2.toFixed(1)} - {rentalBenchmark.officialRangeUpperEurM2.toFixed(1)} €/m²
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-1.5 bg-slate-100 font-semibold">Estimación Mensual</td>
                  <td className="p-1.5 font-mono font-bold">
                    {Math.round(rentalBenchmark.estimatedMonthlyRentLowerEur)} - {Math.round(rentalBenchmark.estimatedMonthlyRentUpperEur)} €/mes
                  </td>
                </tr>
                <tr>
                  <td className="p-1.5 bg-slate-100 font-semibold">Zona Tensionada (Ley 12/2023)</td>
                  <td className="p-1.5">
                    {rentalBenchmark.isStressedHousingZone ? (
                      <span className="text-amber-800 font-bold">SÍ (Tope legal de renta vigente)</span>
                    ) : (
                      <span className="text-slate-600">No declarada como zona tensionada</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-[10px] text-slate-500">Benchmark de alquiler no disponible.</p>
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
                    ? `${connectivity.nearestHealthcare.name} (${Math.round(connectivity.nearestHealthcare.walkTimeMinutes)} min · ${connectivity.nearestHealthcare.distanceMeters}m)`
                    : 'No detectado en radio próximo'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 bg-slate-100 font-semibold">Transporte Masivo</td>
                <td className="p-1.5">
                  {connectivity?.nearestTransit
                    ? `${connectivity.nearestTransit.name} (${Math.round(connectivity.nearestTransit.walkTimeMinutes)} min · ${connectivity.nearestTransit.distanceMeters}m)`
                    : 'No detectado en radio próximo'}
                </td>
              </tr>
              <tr>
                <td className="p-1.5 bg-slate-100 font-semibold">Espacios Verdes / Parques</td>
                <td className="p-1.5">
                  {connectivity?.nearestPark
                    ? `${connectivity.nearestPark.name} (${Math.round(connectivity.nearestPark.walkTimeMinutes)} min · ${connectivity.nearestPark.distanceMeters}m)`
                    : 'No detectado en radio próximo'}
                </td>
              </tr>
            </tbody>
          </table>
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

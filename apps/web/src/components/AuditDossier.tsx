import React, { useState } from 'react';
import { PropertyAuditReport } from '@openbarrio/core';
import { ScoreGauge } from './ScoreGauge';
import { PillarCards } from './PillarCard';
import { RentalModule } from './RentalModule';
import { HighlightsAndRisks } from './HighlightsAndRisks';
import {
  MapPin,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  FileCheck,
} from 'lucide-react';

interface AuditDossierProps {
  report: PropertyAuditReport;
}

export function AuditDossier({ report }: AuditDossierProps) {
  const [copied, setCopied] = useState(false);

  const { property, neighborhood, environment, score, rentalBenchmark, generatedAt } = report;
  const fullAddress = `${property.address.street} ${property.address.number}, ${property.address.postalCode} ${property.address.municipality} (${property.address.province})`;
  const formattedDate = new Date(generatedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyRefcat = () => {
    navigator.clipboard.writeText(property.cadastralReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="dossier-container space-y-4 max-w-4xl mx-auto">
      {/* Dossier Header / Identification Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Dossier Oficial de Due Diligence Inmobiliario</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {fullAddress}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500">
            <div className="flex items-center space-x-1 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
              <span className="font-sans text-[10px] text-slate-400 font-bold uppercase mr-1">RC</span>
              <span>{property.cadastralReference}</span>
              <button
                type="button"
                onClick={handleCopyRefcat}
                className="ml-1 text-slate-400 hover:text-indigo-600 transition"
                title="Copiar Referencia Catastral"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <span className="flex items-center text-slate-400">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Auditado el {formattedDate}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-2 no-print self-end sm:self-center">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
            title="Imprimir informe en PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir / PDF</span>
          </button>

          <a
            href={`https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx?rc1=${property.cadastralReference.substring(
              0,
              7
            )}&rc2=${property.cadastralReference.substring(7, 14)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
            title="Abrir en Sede Electrónica del Catastro"
          >
            <span>Ficha Catastro</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Barrio Score Hero Gauge */}
      <div className="page-break-inside-avoid">
        <ScoreGauge score={score} />
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="page-break-inside-avoid">
        <PillarCards
          property={property}
          neighborhood={neighborhood}
          environment={environment}
        />
      </div>

      {/* MIVAU SERPAVI Rental Module */}
      {rentalBenchmark && (
        <div className="page-break-inside-avoid">
          <RentalModule rental={rentalBenchmark} />
        </div>
      )}

      {/* Highlights & Risks Section */}
      <div className="page-break-inside-avoid">
        <HighlightsAndRisks
          highlights={score.keyHighlights}
          risks={score.keyRisks}
        />
      </div>

      {/* Legal & Methodological Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-1">
        <p className="font-semibold text-slate-700">Nota Metodológica & Descargo Cívico:</p>
        <p>
          Este informe ha sido generado de forma automatizada por la plataforma de código abierto OpenBarrio mediante agregación y normalización en tiempo real de registros públicos de la Sede Electrónica del Catastro, Instituto Nacional de Estadística (INE ADRH), Ministerio para la Transición Ecológica (MITECO SICA y SNCZI) y Ministerio de Vivienda y Agenda Urbana (MIVAU SERPAVI). Los datos ofrecidos tienen carácter informativo y no sustituyen certificaciones administrativas formales, tasaciones periciales oficiales ni auditorías técnicas de arquitectura (ITE/IEE).
        </p>
      </div>
    </div>
  );
}

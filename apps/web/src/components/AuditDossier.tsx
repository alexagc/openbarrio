import { useState } from 'react';
import { PropertyAuditReport } from '@openbarrio/core';
import { ScoreGauge } from './ScoreGauge';
import { PillarCards } from './PillarCard';
import { RentalModule } from './RentalModule';
import { HighlightsAndRisks } from './HighlightsAndRisks';
import { downloadCadastralGML } from '../utils/gml';
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
} from 'lucide-react';

interface AuditDossierProps {
  report: PropertyAuditReport;
  onOpenUnitPicker?: () => void;
}

export function AuditDossier({ report, onOpenUnitPicker }: AuditDossierProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const {
    property,
    neighborhood,
    environment,
    score,
    rentalBenchmark,
    connectivity,
    urbanPlanning,
    generatedAt,
  } = report;

  const fullAddress = `${property.address.street} ${property.address.number}, ${property.address.postalCode} ${property.address.municipality}`;
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

  const getCatastroUrl = (rc: string): string => {
    const sanitized = rc.replace(/[^A-Za-z0-9]/g, '');
    const url = new URL('https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx');
    url.searchParams.set('rc1', sanitized.slice(0, 7));
    url.searchParams.set('rc2', sanitized.slice(7, 14));
    return url.toString();
  };

  const usageLabel = property.building.primaryUse || 'Residencial Colectivo';
  const districtLabel = `${property.address.municipality} · Sección ${neighborhood.censusSectionCode.slice(-3)}`;

  return (
    <div className="dossier-container w-full h-full bg-surface overflow-y-auto flex flex-col divide-y divide-outline-variant text-on-surface">
      {/* 1. PROPERTY DOSSIER HEADER (Stitch Civic Precision) */}
      <div className="p-space-lg bg-surface-container-low">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary-container/20 text-primary border border-primary/40 font-semibold">
                {property.building.constructionYear > 0 && property.building.constructionYear < 1940
                  ? 'Edificio Singular Histórico'
                  : usageLabel}
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
                {property.building.builtSurfaceM2.toLocaleString('es-ES')} m²{' '}
                {property.building.constructionYear > 0
                  ? `construidos (Año ${property.building.constructionYear})`
                  : 'superficie (Suelo sin edificar)'}
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
              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-mono rounded border border-outline-variant transition-colors flex items-center gap-1"
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

            <a
              href={getCatastroUrl(property.cadastralReference)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-mono rounded border border-outline-variant transition-colors flex items-center gap-1"
              title="Ver en Sede Electrónica del Catastro"
            >
              <ExternalLink className="w-3.5 h-3.5 text-tertiary" />
              <span className="hidden sm:inline">Sede</span>
            </a>
          </div>
        </div>

        {/* Horizontal Division Unit Picker Banner */}
        {(property.building.unitsCount > 1 || property.unit) && (
          <div className="mt-2.5 p-2.5 bg-surface-container-high/80 border border-primary/30 rounded-lg flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              <div className="min-w-0">
                {property.unit ? (
                  <p className="font-semibold text-on-surface truncate">
                    Inmueble Privativo: Planta {property.unit.floor} · Puerta {property.unit.door} ({property.unit.builtSurfaceM2} m²
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

            {onOpenUnitPicker && (
              <button
                type="button"
                onClick={onOpenUnitPicker}
                className="px-2.5 py-1.5 rounded bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 font-semibold text-[11px] font-mono transition-colors shrink-0 cursor-pointer flex items-center gap-1"
              >
                <span>{property.unit ? 'Cambiar inmueble ▾' : 'Ver inmuebles ▾'}</span>
              </button>
            )}
          </div>
        )}

        {/* Action Toolbar */}
        <div className="mt-3 flex items-center gap-2 no-print flex-wrap">
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

      {/* 2. HERO BENTO CELL: BARRIO SCORE + 5-AXIS RADAR */}
      <div className="page-break-inside-avoid">
        <ScoreGauge
          score={score}
          cityOrProvince={property.address.province}
          percentile={neighborhood.percentileInMunicipality}
        />
      </div>

      {/* 3. BENTO GRID: 5 DEDICATED PILLARS */}
      <div className="page-break-inside-avoid p-space-lg">
        <PillarCards
          property={property}
          neighborhood={neighborhood}
          environment={environment}
          connectivity={connectivity}
          urbanPlanning={urbanPlanning}
          rentalBenchmark={rentalBenchmark}
        />
      </div>

      {/* 4. MIVAU SERPAVI RENTAL MODULE */}
      {rentalBenchmark && (
        <div className="page-break-inside-avoid">
          <RentalModule rental={rentalBenchmark} />
        </div>
      )}

      {/* 5. DUE DILIGENCE CLEARANCE & RISKS */}
      <div className="page-break-inside-avoid">
        <HighlightsAndRisks
          highlights={score.keyHighlights}
          risks={score.keyRisks}
          refcat={property.cadastralReference}
          municipality={property.address.municipality}
        />
      </div>

      {/* 6. METHODOLOGICAL & LEGAL DISCLAIMER */}
      <div className="p-space-lg bg-surface text-[11px] text-outline font-mono leading-relaxed space-y-1">
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

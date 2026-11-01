import React from 'react';
import { Database, ExternalLink } from 'lucide-react';

interface DataSourceRow {
  issuer: string;
  dataset: string;
  protocol: string;
  updateFreq: string;
  status: string;
  license: string;
}

const SOURCES: DataSourceRow[] = [
  {
    issuer: 'Sede Electrónica del Catastro (OVC)',
    dataset: 'Cartografía vectorial, huella de edificios, coeficientes de reparto',
    protocol: 'REST / WFS INSPIRE v2.0',
    updateFreq: 'Semanal',
    status: 'En línea (200 OK)',
    license: 'Licencia Abierta OVC',
  },
  {
    issuer: 'Instituto Nacional de Estadística (INE)',
    dataset: 'Atlas de Distribución de Renta de los Hogares (ADRH) por sección',
    protocol: 'API JSON REST',
    updateFreq: 'Anual (2024)',
    status: 'En línea (200 OK)',
    license: 'Abierto (Licencia INE)',
  },
  {
    issuer: 'MITECO (Agua y Biodiversidad)',
    dataset: 'SNCZI Cartografía Fluvial & Periodos de Retorno T=10, 100, 500',
    protocol: 'WMS / WFS Geoportal',
    updateFreq: 'Trimestral',
    status: 'En línea (200 OK)',
    license: 'INSPIRE Dir. 2007/2/CE',
  },
  {
    issuer: 'MITECO (Calidad Ambiental)',
    dataset: 'SICA Mapa Estratégico de Ruido y Zonas ZPAE',
    protocol: 'Vectorial SHP / GeoJSON',
    updateFreq: 'Bienal',
    status: 'En línea (200 OK)',
    license: 'Abierto SICA',
  },
  {
    issuer: 'MIVAU (Vivienda y Agenda Urbana)',
    dataset: 'Índice SERPAVI Precios de Referencia & Zonas Tensionadas',
    protocol: 'Microdatos BOE / CSV',
    updateFreq: 'Mensual',
    status: 'En línea (200 OK)',
    license: 'Dominio Público Estatal',
  },
];

export const DataTransparencyMatrix: React.FC = () => {
  return (
    <section className="w-full max-w-7xl px-space-md sm:px-space-lg py-12 border-b border-outline-variant" id="fuentes">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-primary font-semibold tracking-wider uppercase">
            Interoperabilidad Abierta
          </span>
        </div>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
          Datos Públicos Abiertos & Protocolos de Interconexión
        </h2>
        <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1 max-w-3xl">
          Accedemos exclusivamente a APIs soberanas, servicios WFS/WMS y microdatos oficiales del Reino de España bajo el marco regulatorio europeo INSPIRE.
        </p>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-low shadow-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
              <th className="p-3.5 font-semibold">Organismo Emisor</th>
              <th className="p-3.5 font-semibold">Capa & Dataset</th>
              <th className="p-3.5 font-semibold">Protocolo Técnico</th>
              <th className="p-3.5 font-semibold">Actualización</th>
              <th className="p-3.5 font-semibold">Estado de API</th>
              <th className="p-3.5 font-semibold">Licencia Cívica</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-body text-xs text-on-surface">
            {SOURCES.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-container/60 transition-colors">
                <td className="p-3.5 font-semibold text-primary">{row.issuer}</td>
                <td className="p-3.5 text-on-surface-variant">{row.dataset}</td>
                <td className="p-3.5 font-mono text-[11px] text-on-surface-variant">{row.protocol}</td>
                <td className="p-3.5">{row.updateFreq}</td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/40 font-mono text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span>{row.status}</span>
                  </span>
                </td>
                <td className="p-3.5 font-mono text-[11px] text-outline flex items-center gap-1">
                  <span>{row.license}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

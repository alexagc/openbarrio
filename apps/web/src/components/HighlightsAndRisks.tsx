import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface HighlightsAndRisksProps {
  highlights: string[];
  risks: string[];
  refcat?: string;
  municipality?: string;
}

export function HighlightsAndRisks({
  highlights,
  risks,
  refcat = '28900A012000340001LM',
  municipality = 'Madrid',
}: HighlightsAndRisksProps) {
  const shortRef = refcat.substring(0, 8);
  const prefix = municipality.substring(0, 3).toUpperCase();
  const expedienteId = `${prefix}-AUD-2026-${shortRef}`;

  return (
    <div className="p-space-lg bg-surface-container-low space-y-3 pb-8">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-mono text-outline uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Dictámenes de Due Diligence & Afecciones Legales</span>
        </h4>
        <span className="text-[10px] font-mono text-outline">
          {highlights.length + risks.length} dictámenes
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Positive Clearance Chips */}
        {highlights.map((item, idx) => (
          <div
            key={`hl-${idx}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-primary-container/20 border border-primary/40 text-primary text-xs font-mono"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{item}</span>
          </div>
        ))}

        {/* Risk & Caution Chips */}
        {risks.map((item, idx) => (
          <div
            key={`rk-${idx}`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/20 border border-secondary/40 text-secondary text-xs font-mono"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{item}</span>
          </div>
        ))}

        {highlights.length === 0 && risks.length === 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-on-surface-variant text-xs font-mono">
            <span>Sin afecciones registrales críticas detectadas.</span>
          </div>
        )}
      </div>

      {/* Municipal Sign-off Bar */}
      <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-[10px] font-mono text-outline">
        <span>Expediente: {expedienteId}</span>
        <span>Sede Electrónica Catastro & INE Telemetría</span>
      </div>
    </div>
  );
}

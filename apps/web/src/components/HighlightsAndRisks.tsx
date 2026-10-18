import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, AlertOctagon } from 'lucide-react';

interface HighlightsAndRisksProps {
  highlights: string[];
  risks: string[];
}

export function HighlightsAndRisks({ highlights, risks }: HighlightsAndRisksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Key Highlights Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm mb-3.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3>Fortalezas & Ventajas Identificadas ({highlights.length})</h3>
        </div>

        {highlights.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No se han registrado fortalezas singulares.</p>
        ) : (
          <ul className="space-y-2.5 text-xs text-slate-700 flex-1">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Key Risks & Alerts Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-3.5">
          <AlertOctagon className="w-4 h-4 text-amber-600" />
          <h3>Alertas de Due Diligence & Riesgos ({risks.length})</h3>
        </div>

        {risks.length === 0 ? (
          <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sin riesgos ni alertas críticas detectadas en registros oficiales.</span>
          </div>
        ) : (
          <ul className="space-y-2.5 text-xs text-slate-700 flex-1">
            {risks.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

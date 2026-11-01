import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';

export interface PresetCandidate {
  label: string;
  refcat: string;
  lat: number;
  lon: number;
}

export const PRESET_CANDIDATES: PresetCandidate[] = [
  {
    label: 'Calle Gran Vía 28, Madrid (Centro)',
    refcat: '9872023VH5797S0012AZ',
    lat: 40.42023,
    lon: -3.70197,
  },
  {
    label: 'Calle Fuencarral 42, Madrid (Justicia)',
    refcat: '28900A010000420003DW',
    lat: 40.4241,
    lon: -3.7012,
  },
  {
    label: 'Passeig de Gràcia 43, Barcelona (Eixample)',
    refcat: '0227802DF3802E0001JK',
    lat: 41.3917,
    lon: 2.16495,
  },
  {
    label: 'Carrer de Colón 15, València (Ciutat Vella)',
    refcat: '6023512YJ2762C0001LK',
    lat: 39.46845,
    lon: -0.37318,
  },
  {
    label: 'Calle Sierpes 22, Sevilla (Casco Antiguo)',
    refcat: '4927803TG3442F0001MN',
    lat: 37.39147,
    lon: -5.99476,
  },
];

export interface DuelCandidateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetCandidate) => void;
  onSelectCustomRefcat: (refcat: string) => void;
  isLoading?: boolean;
}

export function DuelCandidateSelector({
  isOpen,
  onClose,
  onSelectPreset,
  onSelectCustomRefcat,
  isLoading = false,
}: DuelCandidateSelectorProps) {
  const [customRefInput, setCustomRefInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customRefInput.trim().toUpperCase();
    if (clean.length >= 14) {
      onSelectCustomRefcat(clean);
      setCustomRefInput('');
    }
  };

  return (
    <div
      data-testid="candidate-selector-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-surface-container border border-outline-variant rounded-2xl p-6 shadow-2xl space-y-6 text-on-surface animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Seleccionar Inmueble B para el Duelo
            </h3>
            <p className="font-body text-xs text-on-surface-variant">
              Compara Inmueble A contra referencias emblemáticas o introduce una Referencia Catastral.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading Banner */}
        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-mono animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consultando datos oficiales en Catastro OVC...</span>
          </div>
        )}

        {/* Preset Candidates List */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold block">
            Candidatos Preestablecidos
          </span>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {PRESET_CANDIDATES.map((preset) => (
              <button
                key={preset.refcat}
                type="button"
                onClick={() => onSelectPreset(preset)}
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/60 text-left transition flex items-center justify-between cursor-pointer group disabled:opacity-50"
              >
                <div>
                  <div className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                    {preset.label}
                  </div>
                  <div className="font-mono text-[10px] text-on-surface-variant">
                    RC: {preset.refcat}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-surface-container text-primary border border-outline-variant">
                  Comparar
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Refcat Search Input */}
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-outline-variant/60">
          <span className="text-[10px] font-mono uppercase tracking-wider text-outline font-bold block">
            Referencia Catastral Personalizada (14 o 20 dígitos)
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              value={customRefInput}
              onChange={(e) => setCustomRefInput(e.target.value.toUpperCase())}
              placeholder="Ej. 28900A010000420003DW"
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-mono text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary"
            />
            <button
              type="submit"
              disabled={isLoading || customRefInput.trim().length < 14}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-primary-container disabled:opacity-40 transition cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Consultar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { Footprints, Volume2, Waves, Sun } from 'lucide-react';
import { useTranslation } from '../../i18n';

export type ThematicLens = 'urban' | 'silence' | 'risks' | 'solar';

export interface ThematicLensSelectorProps {
  activeLens: ThematicLens;
  onSelectLens: (lens: ThematicLens) => void;
  className?: string;
}

interface LensDefinition {
  id: ThematicLens;
  labelKey: string;
  defaultLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  activeColor: string;
}

const LENSES: LensDefinition[] = [
  {
    id: 'urban',
    labelKey: 'map.lensUrban',
    defaultLabel: 'Vida Urbana',
    icon: Footprints,
    description: 'Servicios a 15 min, renta INE y parcela catastral',
    activeColor: 'bg-primary text-on-primary shadow-sm',
  },
  {
    id: 'silence',
    labelKey: 'map.lensSilence',
    defaultLabel: 'Silencio',
    icon: Volume2,
    description: 'Mapa estratégico de ruido ambiental MITECO SICA',
    activeColor: 'bg-amber-500 text-slate-950 font-bold shadow-sm',
  },
  {
    id: 'risks',
    labelKey: 'map.lensRisks',
    defaultLabel: 'Riesgos Naturales',
    icon: Waves,
    description: 'Zonas inundables SNCZI y afección fluvial T=10..500',
    activeColor: 'bg-sky-500 text-slate-950 font-bold shadow-sm',
  },
  {
    id: 'solar',
    labelKey: 'map.lensSolar3D',
    defaultLabel: 'Luz 3D',
    icon: Sun,
    description: 'Huella 3D y simulación solar con sombras en tiempo real',
    activeColor: 'bg-yellow-400 text-slate-950 font-bold shadow-sm',
  },
];

export const ThematicLensSelector: React.FC<ThematicLensSelectorProps> = ({
  activeLens,
  onSelectLens,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      data-testid="thematic-lens-tabs"
      className={`flex items-center gap-1 p-1 rounded-full bg-surface-container-low/95 backdrop-blur-md border border-outline-variant shadow-2xl ${className}`}
    >
      {LENSES.map((lens) => {
        const Icon = lens.icon;
        const isActive = activeLens === lens.id;
        const label = t(lens.labelKey) || lens.defaultLabel;
        return (
          <button
            key={lens.id}
            type="button"
            data-testid={`lens-tab-${lens.id}`}
            onClick={() => onSelectLens(lens.id)}
            title={lens.description}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs transition-all duration-150 cursor-pointer ${
              isActive
                ? lens.activeColor
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/80'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive && lens.id === 'solar' ? 'animate-spin-slow' : ''}`} />
            <span className="font-semibold">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

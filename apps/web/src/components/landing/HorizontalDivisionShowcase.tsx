import React from 'react';
import { CheckCircle2, ArrowRight, Home, Store } from 'lucide-react';

interface SubUnitItem {
  id: string;
  name: string;
  coef: string;
  surface: string;
  usage: string;
  privilege?: string;
  refcat: string;
  location: string;
  icon: 'home' | 'store';
  highlight?: boolean;
}

const SUBUNITS: SubUnitItem[] = [
  {
    id: '1a',
    name: 'Planta 1ª — Pta. A',
    coef: '3.15%',
    surface: '92 m² útiles',
    usage: 'Residencial',
    refcat: '28900A001000120001AZ',
    location: 'Interior/Exterior',
    icon: 'home',
  },
  {
    id: '1b',
    name: 'Planta 1ª — Pta. B',
    coef: '2.90%',
    surface: '84 m² útiles',
    usage: 'Residencial',
    refcat: '28900A001000120002BY',
    location: 'Interior Patio',
    icon: 'home',
  },
  {
    id: '4atico',
    name: 'Planta 4ª — Ático',
    coef: '5.80%',
    surface: '145 m² + 40m² ter.',
    usage: 'Residencial Sing.',
    privilege: 'Terraza Privativa',
    refcat: '28900A001000120008XT',
    location: 'Fachada Principal',
    icon: 'home',
    highlight: true,
  },
  {
    id: 'pblocal',
    name: 'PB — Local 1',
    coef: '6.20%',
    surface: '180 m²',
    usage: 'Terciario / Com.',
    privilege: 'Vía Pública',
    refcat: '28900A001000120000PB',
    location: 'Acceso Directo',
    icon: 'store',
  },
];

interface HorizontalDivisionShowcaseProps {
  onAuditUnit?: (refcat: string, address: string) => void;
}

export const HorizontalDivisionShowcase: React.FC<HorizontalDivisionShowcaseProps> = ({ onAuditUnit }) => {
  return (
    <section className="w-full max-w-7xl px-space-md sm:px-space-lg py-12 border-b border-outline-variant" id="comparador">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-primary font-mono text-xs font-semibold">
              SEDES ELECTRÓNICAS DESAGREGADAS
            </span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            Desglose de División Horizontal Catastral
          </h2>
          <p className="font-body text-xs sm:text-sm text-on-surface-variant mt-1">
            Edificio Residencial C/ Alcalá 42, 28014 Madrid · Ref. Matriz:{' '}
            <span className="font-mono text-xs text-on-surface font-semibold">28900A00100012</span>
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/40 self-start md:self-auto">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-primary font-semibold">
            100.00% Coeficiente Total · Suma verificada matemáticamente
          </span>
        </div>
      </div>

      {/* Horizontal Breakdown Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {SUBUNITS.map((unit) => (
          <div
            key={unit.id}
            className={`border rounded-lg p-space-md transition-all flex flex-col justify-between ${
              unit.highlight
                ? 'bg-surface-container border-primary/50 shadow-md ring-1 ring-primary/30'
                : 'bg-surface-container-low border-outline-variant hover:border-primary/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                <span className="font-headline text-sm font-bold text-on-surface flex items-center gap-1.5">
                  {unit.icon === 'store' ? <Store className="w-3.5 h-3.5 text-secondary" /> : <Home className="w-3.5 h-3.5 text-primary" />}
                  <span>{unit.name}</span>
                </span>
                <span className={`px-1.5 py-0.5 rounded font-mono text-xs font-semibold ${
                  unit.highlight ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-primary'
                }`}>
                  Coef: {unit.coef}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between font-body text-xs">
                  <span className="text-on-surface-variant">Superficie:</span>
                  <span className={`font-mono font-semibold ${unit.highlight ? 'text-primary' : 'text-on-surface'}`}>
                    {unit.surface}
                  </span>
                </div>
                <div className="flex justify-between font-body text-xs">
                  <span className="text-on-surface-variant">Uso principal:</span>
                  <span className="text-on-surface">{unit.usage}</span>
                </div>
                {unit.privilege && (
                  <div className="flex justify-between font-body text-xs">
                    <span className="text-on-surface-variant">Privilegios:</span>
                    <span className="font-mono text-secondary font-medium">{unit.privilege}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-xs">
                  <span className="text-on-surface-variant">Ref. individual:</span>
                  <span className="font-mono text-[11px] text-outline truncate max-w-[130px]">
                    ...{unit.refcat.slice(-7)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
              <span>{unit.location}</span>
              <button
                type="button"
                onClick={() => onAuditUnit?.(unit.refcat, `C/ Alcalá 42, ${unit.name}, Madrid`)}
                className="text-primary hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>Ver Ficha</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

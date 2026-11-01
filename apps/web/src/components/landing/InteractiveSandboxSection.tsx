import React, { useState } from 'react';
import { Sun, Footprints, Flame, MapPin, ArrowRight, Layers, Navigation, Maximize2 } from 'lucide-react';

interface PresetData {
  id: string;
  name: string;
  shortName: string;
  address: string;
  refcat: string;
  coords: { lat: number; lon: number };
  score: number;
  scoreLabel: string;
  income: string;
  noise: string;
  flood: string;
  rentCap: string;
  edificabilidad: string;
  solarZenitBase: number;
}

const PRESETS: PresetData[] = [
  {
    id: 'madrid',
    name: 'Madrid Centro / Sol',
    shortName: 'Madrid Sol',
    address: 'Puerta del Sol 1, 28013 Madrid',
    refcat: '28900A00100012',
    coords: { lat: 40.4168, lon: -3.7038 },
    score: 88,
    scoreLabel: 'Excelente caminabilidad',
    income: '44.200 € (Decil 9 Censo)',
    noise: '58 dB(A) (Confort acústico medio)',
    flood: 'Nulo (Fuera de zona de flujo)',
    rentCap: '940 €/mes máx.',
    edificabilidad: '96.4%',
    solarZenitBase: 62,
  },
  {
    id: 'barcelona',
    name: 'Barcelona / Eixample Dret',
    shortName: 'Barcelona Eixample',
    address: 'Passeig de Gràcia 43, 08007 Barcelona',
    refcat: '0227802DF3802E',
    coords: { lat: 41.3917, lon: 2.16495 },
    score: 92,
    scoreLabel: 'Caminabilidad excepcional',
    income: '48.900 € (Decil 10 Censo)',
    noise: '62 dB(A) (Tráfico urbano)',
    flood: 'Nulo (T>500a)',
    rentCap: '1.180 €/mes máx.',
    edificabilidad: '98.1%',
    solarZenitBase: 60,
  },
  {
    id: 'valencia',
    name: 'Valencia / Ruzafa',
    shortName: 'Valencia Ruzafa',
    address: 'Carrer de Cuba 12, 46006 València',
    refcat: '46900A01230056',
    coords: { lat: 39.4622, lon: -0.3734 },
    score: 85,
    scoreLabel: 'Muy alta conectividad',
    income: '36.800 € (Decil 8 Censo)',
    noise: '56 dB(A) (ZPAE Ruzafa)',
    flood: 'Bajo (T>100a)',
    rentCap: '820 €/mes máx.',
    edificabilidad: '91.7%',
    solarZenitBase: 64,
  },
];

const CEE_CAPEX: Record<string, { capex: string; color: string; bg: string }> = {
  A: { capex: '+0 € (Alta Eficiencia)', color: '#008000', bg: 'rgba(0,128,0,0.2)' },
  B: { capex: '+2.500 € (Aislamiento SATE)', color: '#33a02c', bg: 'rgba(51,160,44,0.2)' },
  C: { capex: '+5.000 € (Ventanas Climalit)', color: '#b2df8a', bg: 'rgba(178,223,138,0.2)' },
  D: { capex: '+8.500 € (CapEx estimado CTE)', color: '#f59e0b', bg: 'rgba(245,158,11,0.2)' },
  E: { capex: '+14.000 € (Envolvente térmica)', color: '#fdbf6f', bg: 'rgba(253,191,111,0.2)' },
  F: { capex: '+19.500 € (Rehabilitación estructural)', color: '#ff7f00', bg: 'rgba(255,127,0,0.2)' },
  G: { capex: '+28.000 € (CapEx crítico)', color: '#e31a1c', bg: 'rgba(227,26,28,0.2)' },
};

interface InteractiveSandboxSectionProps {
  onSelectPreset?: (preset: PresetData) => void;
}

export const InteractiveSandboxSection: React.FC<InteractiveSandboxSectionProps> = ({ onSelectPreset }) => {
  const [activePreset, setActivePreset] = useState<PresetData>(PRESETS[0]);
  const [solarHour, setSolarHour] = useState<number>(14);
  const [isochroneMinutes, setIsochroneMinutes] = useState<number>(5);
  const [ceeRating, setCeeRating] = useState<string>('D');

  // Compute solar vector angle and radiation based on hour
  const hourRatio = (solarHour - 8) / 12; // 0 at 8:00, 1 at 20:00
  const angleRad = Math.PI * (1 - hourRatio); // from PI to 0
  const sunX = Math.round(200 - Math.cos(angleRad) * 140);
  const sunY = Math.round(150 - Math.sin(angleRad) * 115);
  const radiation = Math.round(Math.max(80, Math.sin(angleRad) * 890));
  const zenitAngle = Math.round(Math.sin(angleRad) * activePreset.solarZenitBase);

  return (
    <section className="w-full max-w-7xl px-space-md sm:px-space-lg py-12 border-b border-outline-variant" id="sandbox">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/40 text-primary font-mono text-xs font-semibold tracking-wider">
              LABORATORIO CATASTRAL EN VIVO
            </span>
            <span className="text-on-surface-variant font-mono text-xs">INSPIRE Compliant</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
            ¿No tienes una dirección? Experimenta en vivo con nuestros presets cívicos
          </h2>
        </div>

        {/* Presets Buttons */}
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded border border-outline-variant self-start md:self-auto flex-wrap">
          {PRESETS.map((p) => {
            const isActive = p.id === activePreset.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePreset(p)}
                className={`px-3 py-1.5 rounded font-mono text-xs transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {p.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Interactive Playground Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md lg:gap-space-lg border border-outline-variant rounded-xl overflow-hidden bg-surface-container-low shadow-xl">
        {/* Left: Simulated 2D/3D Cadastral Canvas Viewer (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest relative p-4 sm:p-6 flex flex-col justify-between min-h-[460px] border-b lg:border-b-0 lg:border-r border-outline-variant overflow-hidden">
          {/* Canvas HUD Overlays (Top) */}
          <div className="flex items-center justify-between z-10 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-surface-container/90 border border-outline-variant font-mono text-xs text-on-surface flex items-center gap-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="font-semibold">{activePreset.name}</span>
              </span>
              <span className="px-2 py-1 rounded bg-surface-container/90 border border-outline-variant font-mono text-xs text-primary">
                ETRS89 / UTM 30N
              </span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container/90 border border-outline-variant rounded p-1">
              <span className="p-1 text-on-surface-variant"><Layers className="w-3.5 h-3.5" /></span>
              <span className="p-1 text-on-surface-variant"><Navigation className="w-3.5 h-3.5" /></span>
              <span className="p-1 text-on-surface-variant"><Maximize2 className="w-3.5 h-3.5" /></span>
            </div>
          </div>

          {/* Vector Cadastral Graphic Representation */}
          <div className="relative my-auto flex items-center justify-center py-6">
            <svg
              className="w-full max-w-md h-64 overflow-visible"
              fill="none"
              viewBox="0 0 400 240"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Isochrone distance rings */}
              <ellipse
                cx="200"
                cy="120"
                rx="170"
                ry="90"
                stroke={isochroneMinutes === 15 ? '#38bdf8' : '#3d4a42'}
                strokeWidth={isochroneMinutes === 15 ? '2' : '1.2'}
                strokeDasharray="4 4"
                opacity={isochroneMinutes === 15 ? '0.9' : '0.4'}
              />
              <ellipse
                cx="200"
                cy="120"
                rx="115"
                ry="60"
                stroke={isochroneMinutes === 10 ? '#38bdf8' : '#3d4a42'}
                strokeWidth={isochroneMinutes === 10 ? '2' : '1.2'}
                strokeDasharray="4 4"
                opacity={isochroneMinutes === 10 ? '0.9' : '0.6'}
              />
              <ellipse
                cx="200"
                cy="120"
                rx="60"
                ry="32"
                stroke={isochroneMinutes === 5 ? '#68dba9' : '#3d4a42'}
                strokeWidth={isochroneMinutes === 5 ? '2.2' : '1.5'}
                strokeDasharray="2 2"
                opacity={isochroneMinutes === 5 ? '1' : '0.7'}
              />

              <text fill={isochroneMinutes === 15 ? '#38bdf8' : '#87948b'} fontFamily="JetBrains Mono" fontSize="9" x="345" y="125">15 min</text>
              <text fill={isochroneMinutes === 10 ? '#38bdf8' : '#87948b'} fontFamily="JetBrains Mono" fontSize="9" x="290" y="125">10 min</text>
              <text fill={isochroneMinutes === 5 ? '#68dba9' : '#87948b'} fontFamily="JetBrains Mono" fontSize="9" x="235" y="125">5 min</text>

              {/* Surrounding parcel footprints */}
              <polygon fill="#171f33" points="60,40 120,35 110,80 50,75" stroke="#3d4a42" strokeWidth="1" />
              <polygon fill="#171f33" points="270,30 350,25 335,80 260,75" stroke="#3d4a42" strokeWidth="1" />
              <polygon fill="#171f33" points="70,150 130,145 120,205 60,195" stroke="#3d4a42" strokeWidth="1" />
              <polygon fill="#171f33" points="280,150 360,160 340,210 270,195" stroke="#3d4a42" strokeWidth="1" />

              {/* Main Target Parcel Polygon (Cadastral Highlight) */}
              <polygon
                fill="#25a475"
                fillOpacity="0.3"
                points="160,85 245,80 235,155 150,150"
                stroke="#68dba9"
                strokeWidth="2.5"
              />
              <circle cx="197" cy="117" r="4.5" fill="#68dba9" />

              {/* Solar Azimuth Vector Ray */}
              <line
                x1="197"
                y1="117"
                x2={sunX}
                y2={sunY}
                stroke="#ffb77d"
                strokeWidth="1.8"
                strokeDasharray="3 3"
              />
              <circle cx={sunX} cy={sunY} r="7" fill="#ffb77d" />
              <circle cx={sunX} cy={sunY} r="12" fill="#ffb77d" fillOpacity="0.2" />
              <text
                fill="#ffb77d"
                fontFamily="JetBrains Mono"
                fontSize="10"
                fontWeight="600"
                x={Math.max(20, Math.min(270, sunX - 50))}
                y={Math.max(20, sunY - 12)}
              >
                {radiation} W/m² (Zenit {zenitAngle}°)
              </text>

              {/* Surrounding Civics Markers */}
              <g transform="translate(110, 60)">
                <rect fill="#131b2e" height="18" rx="2" stroke="#3d4a42" width="92" />
                <text fill="#bccac0" fontFamily="JetBrains Mono" fontSize="9" x="6" y="12">Metro 240m (3')</text>
              </g>
              <g transform="translate(240, 165)">
                <rect fill="#131b2e" height="18" rx="2" stroke="#3d4a42" width="98" />
                <text fill="#bccac0" fontFamily="JetBrains Mono" fontSize="9" x="6" y="12">C. Salud 450m (6')</text>
              </g>
              <g transform="translate(60, 130)">
                <rect fill="#131b2e" height="18" rx="2" stroke="#3d4a42" width="92" />
                <text fill="#bccac0" fontFamily="JetBrains Mono" fontSize="9" x="6" y="12">Escuela 620m (8')</text>
              </g>
            </svg>
          </div>

          {/* Bottom Canvas Status Line */}
          <div className="flex items-center justify-between text-on-surface-variant font-mono text-xs pt-2.5 border-t border-outline-variant z-10 flex-wrap gap-2">
            <span>Escala: 1:1.000 · Catastro Toponimia OVC</span>
            <span>Edificabilidad: <strong className="text-on-surface">{activePreset.edificabilidad}</strong></span>
          </div>
        </div>

        {/* Right: Telemetry Controls & Reactive KPIs (5 Cols) */}
        <div className="lg:col-span-5 p-space-md sm:p-space-lg flex flex-col justify-between bg-surface-container">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant mb-4">
              <span className="font-headline text-base font-bold text-on-surface">Simulación y Parámetros</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant">
                En tiempo real
              </span>
            </div>

            {/* Slider 1: Solar Simulation */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-xs sm:text-sm text-on-surface font-semibold flex items-center gap-1.5" htmlFor="solar-range">
                  <Sun className="w-4 h-4 text-amber" />
                  <span>Simulación Solar</span>
                </label>
                <span className="font-mono text-xs text-amber font-semibold">
                  {solarHour.toString().padStart(2, '0')}:00 (Zenit {zenitAngle}°)
                </span>
              </div>
              <input
                id="solar-range"
                type="range"
                min="8"
                max="20"
                value={solarHour}
                onChange={(e) => setSolarHour(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-on-surface-variant font-mono text-[10px] mt-1">
                <span>08:00 (Amanecer)</span>
                <span>14:00</span>
                <span>20:00 (Ocaso)</span>
              </div>
            </div>

            {/* Control 2: Radio Isócrona a Pie */}
            <div className="mb-4">
              <label className="font-body text-xs sm:text-sm text-on-surface font-semibold flex items-center gap-1.5 mb-1.5">
                <Footprints className="w-4 h-4 text-sky" />
                <span>Radio Isócrona a Pie</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 15].map((mins) => {
                  const isActive = isochroneMinutes === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setIsochroneMinutes(mins)}
                      className={`py-1.5 px-2 rounded font-mono text-xs transition-colors cursor-pointer text-center ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container font-bold border border-primary'
                          : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant border border-outline-variant'
                      }`}
                    >
                      {mins === 5 ? '5m (Hiperlocal)' : mins === 10 ? '10 min' : "15m (Ciudad 15')"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Control 3: Calificación Energética CEE */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-body text-xs sm:text-sm text-on-surface font-semibold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-coral" />
                  <span>Calificación Energética CEE</span>
                </label>
                <span className="font-mono text-xs text-amber font-semibold">
                  {CEE_CAPEX[ceeRating]?.capex}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const).map((grade) => {
                  const isActive = ceeRating === grade;
                  const item = CEE_CAPEX[grade];
                  return (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setCeeRating(grade)}
                      style={{
                        backgroundColor: isActive ? item.color : item.bg,
                        borderColor: item.color,
                        color: isActive ? '#ffffff' : undefined,
                      }}
                      className={`flex-1 py-1 rounded text-center font-mono text-xs font-bold border transition cursor-pointer ${
                        isActive ? 'ring-2 ring-white/60 shadow-xs' : 'text-on-surface-variant'
                      }`}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reactive KPI Metrics Grid */}
            <div className="border-t border-outline-variant pt-3 space-y-2">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                <span className="font-body text-xs text-on-surface-variant">Barrio Score Cívico:</span>
                <span className="font-mono text-xs text-primary font-bold">{activePreset.score}/100 ({activePreset.scoreLabel})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                <span className="font-body text-xs text-on-surface-variant">Renta Media INE ADRH:</span>
                <span className="font-mono text-xs text-on-surface font-semibold">{activePreset.income}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                <span className="font-body text-xs text-on-surface-variant">Ruido Diurno MITECO SICA:</span>
                <span className="font-mono text-xs text-amber font-semibold">{activePreset.noise}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                <span className="font-body text-xs text-on-surface-variant">Riesgo SNCZI T100:</span>
                <span className="font-mono text-xs text-primary font-semibold">{activePreset.flood}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-outline-variant">
                <span className="font-body text-xs text-on-surface-variant">Tope Alquiler MIVAU (SERPAVI):</span>
                <span className="font-mono text-xs text-primary font-bold">{activePreset.rentCap}</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-xs text-on-surface-variant flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>RC: {activePreset.refcat}</span>
            </span>
            <button
              type="button"
              onClick={() => onSelectPreset?.(activePreset)}
              className="px-3.5 py-1.5 rounded bg-primary-container text-on-primary-container hover:bg-primary font-body text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Auditar en Visor GIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

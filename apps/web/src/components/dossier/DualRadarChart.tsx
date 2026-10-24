import { useState } from 'react';
import { AuditSubscores } from '@openbarrio/core';

export type DualRadarMode = 'both' | 'a' | 'b' | 'diff';

export interface DualRadarChartProps {
  subscoresA?: Partial<AuditSubscores>;
  subscoresB?: Partial<AuditSubscores>;
  labelA?: string;
  labelB?: string;
  mode?: DualRadarMode;
  onModeChange?: (mode: DualRadarMode) => void;
  className?: string;
}

interface AxisConfig {
  key: keyof AuditSubscores;
  title: string;
  subtitle: string;
  angleRad: number;
  textAnchor: 'start' | 'middle' | 'end';
  x: number;
  y: number;
}

const AXIS_CONFIGS: AxisConfig[] = [
  {
    key: 'connectivity',
    title: 'Conectividad (WalkScore)',
    subtitle: 'Acceso peatonal dotacional',
    angleRad: -Math.PI / 2, // -90 deg (Top)
    textAnchor: 'middle',
    x: 200,
    y: 22,
  },
  {
    key: 'building',
    title: 'Edificación',
    subtitle: 'Salud ITE & CapEx',
    angleRad: -Math.PI / 2 + (2 * Math.PI) / 5, // -18 deg (Upper Right)
    textAnchor: 'start',
    x: 368,
    y: 148,
  },
  {
    key: 'socioeconomic',
    title: 'Socioeconomía',
    subtitle: 'Renta INE Deciles',
    angleRad: -Math.PI / 2 + (4 * Math.PI) / 5, // 54 deg (Lower Right)
    textAnchor: 'start',
    x: 306,
    y: 346,
  },
  {
    key: 'environmental',
    title: 'Medioambiente',
    subtitle: 'Acústica & Inundación',
    angleRad: -Math.PI / 2 + (6 * Math.PI) / 5, // 126 deg (Lower Left)
    textAnchor: 'end',
    x: 94,
    y: 346,
  },
  {
    key: 'urbanPlanning',
    title: 'Urbanismo',
    subtitle: 'SERPAVI / Mercado',
    angleRad: -Math.PI / 2 + (8 * Math.PI) / 5, // 198 deg (Upper Left)
    textAnchor: 'end',
    x: 32,
    y: 148,
  },
];

const GRID_RINGS = [20, 40, 60, 80, 100];
const CX = 200;
const CY = 200;
const MAX_RADIUS = 160;

function polarToCartesian(radius: number, angleRad: number): { x: number; y: number } {
  return {
    x: Number((CX + radius * Math.cos(angleRad)).toFixed(1)),
    y: Number((CY + radius * Math.sin(angleRad)).toFixed(1)),
  };
}

export function DualRadarChart({
  subscoresA = {},
  subscoresB = {},
  labelA = 'Inmueble A',
  labelB = 'Inmueble B',
  mode: controlledMode,
  onModeChange,
  className = '',
}: DualRadarChartProps) {
  const [internalMode, setInternalMode] = useState<DualRadarMode>('both');
  const activeMode = controlledMode ?? internalMode;

  const handleSelectMode = (newMode: DualRadarMode) => {
    if (onModeChange) {
      onModeChange(newMode);
    } else {
      setInternalMode(newMode);
    }
  };

  // Safe normalized numeric scores (0 to 100)
  const getScore = (scores: Partial<AuditSubscores>, key: keyof AuditSubscores, fallback: number): number => {
    const val = scores[key];
    if (typeof val === 'number' && !isNaN(val)) {
      return Math.min(100, Math.max(0, Math.round(val)));
    }
    return fallback;
  };

  const valuesA = AXIS_CONFIGS.map((axis, i) =>
    getScore(subscoresA, axis.key, [92, 88, 70, 90, 80][i])
  );

  const valuesB = AXIS_CONFIGS.map((axis, i) =>
    getScore(subscoresB, axis.key, [74, 52, 88, 54, 85][i])
  );

  // Compute vertices for Property A
  const pointsA = AXIS_CONFIGS.map((axis, idx) => {
    const r = (valuesA[idx] / 100) * MAX_RADIUS;
    return polarToCartesian(r, axis.angleRad);
  });
  const polyStringA = pointsA.map((p) => `${p.x},${p.y}`).join(' ');

  // Compute vertices for Property B
  const pointsB = AXIS_CONFIGS.map((axis, idx) => {
    const r = (valuesB[idx] / 100) * MAX_RADIUS;
    return polarToCartesian(r, axis.angleRad);
  });
  const polyStringB = pointsB.map((p) => `${p.x},${p.y}`).join(' ');

  // Concentric pentagons
  const ringPolygons = GRID_RINGS.map((pct) => {
    const r = (pct / 100) * MAX_RADIUS;
    const pts = AXIS_CONFIGS.map((axis) => polarToCartesian(r, axis.angleRad));
    return {
      pct,
      points: pts.map((p) => `${p.x},${p.y}`).join(' '),
    };
  });

  // Spokes from center to outer ring (100%)
  const spokes = AXIS_CONFIGS.map((axis) => {
    const outer = polarToCartesian(MAX_RADIUS, axis.angleRad);
    return {
      x1: CX,
      y1: CY,
      x2: outer.x,
      y2: outer.y,
    };
  });

  // Opacities based on visual display mode
  let opacityA = 1;
  let opacityB = 1;

  if (activeMode === 'a') {
    opacityA = 1;
    opacityB = 0.12;
  } else if (activeMode === 'b') {
    opacityA = 0.12;
    opacityB = 1;
  } else if (activeMode === 'diff') {
    opacityA = 0.85;
    opacityB = 0.45;
  }

  return (
    <div className={`flex flex-col items-center justify-center relative select-none ${className}`}>
      {/* Dual Radar SVG Container */}
      <div className="w-full max-w-[540px] aspect-square relative flex items-center justify-center">
        <svg
          data-testid="dual-radar-svg"
          className="w-full h-full drop-shadow-2xl overflow-visible"
          viewBox="-40 -40 480 480"
          aria-label="Gráfico de radar dual comparativo de 5 ejes"
        >
          <defs>
            {/* Neon Cyan filter for Property A */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Neon Amber filter for Property B */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Linear/Radial gradients for polygon fillings */}
            <radialGradient id="cyan-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
            </radialGradient>
            <radialGradient id="amber-radial" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.08" />
            </radialGradient>
          </defs>

          {/* Concentric Pentagon Web Rings */}
          {ringPolygons.map(({ pct, points }) => {
            if (pct === 100) {
              return (
                <polygon
                  key={pct}
                  data-testid="radar-ring-100"
                  points={points}
                  fill="#131b2e"
                  fillOpacity="0.5"
                  stroke="#87948b"
                  strokeWidth="1.5"
                />
              );
            }
            return (
              <polygon
                key={pct}
                data-testid={`radar-ring-${pct}`}
                points={points}
                fill="none"
                opacity={pct >= 60 ? 0.8 : 0.6}
                stroke="#3d4a42"
                strokeDasharray={pct <= 40 ? '2 3' : '3 3'}
                strokeWidth="1"
              />
            );
          })}

          {/* Axis Spokes from center to outer ring */}
          {spokes.map((spoke, idx) => (
            <line
              key={idx}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
              stroke="#3d4a42"
              strokeWidth="1.2"
            />
          ))}

          {/* Monospaced Percentage Labels along central vertical spoke (Top spoke) */}
          <text x="204" y="165" fill="#87948b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="500">
            20%
          </text>
          <text x="204" y="133" fill="#87948b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="500">
            40%
          </text>
          <text x="204" y="101" fill="#87948b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="500">
            60%
          </text>
          <text x="204" y="69" fill="#87948b" fontFamily="JetBrains Mono" fontSize="8" fontWeight="500">
            80%
          </text>
          <text x="204" y="38" fill="#bccac0" fontFamily="JetBrains Mono" fontSize="9" fontWeight="700">
            100%
          </text>

          {/* ================= PROPERTY A POLYGON (Solid Cyan) ================= */}
          <polygon
            id="radar-poly-a"
            data-testid="radar-poly-a"
            points={polyStringA}
            fill="url(#cyan-radial)"
            filter="url(#glow-cyan)"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ opacity: opacityA, transition: 'opacity 300ms ease' }}
          />

          {/* Property A Glowing Vertex Circles */}
          {pointsA.map((p, idx) => (
            <circle
              key={`vertex-a-${idx}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#06b6d4"
              stroke="#0b1326"
              strokeWidth="1.5"
              style={{ opacity: opacityA, transition: 'opacity 300ms ease' }}
            />
          ))}

          {/* ================= PROPERTY B POLYGON (Dashed Amber) ================= */}
          <polygon
            id="radar-poly-b"
            data-testid="radar-poly-b"
            points={polyStringB}
            fill="url(#amber-radial)"
            filter="url(#glow-amber)"
            stroke="#f59e0b"
            strokeDasharray="6 3"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={{ opacity: opacityB, transition: 'opacity 300ms ease' }}
          />

          {/* Property B Glowing Vertex Circles */}
          {pointsB.map((p, idx) => (
            <circle
              key={`vertex-b-${idx}`}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="#f59e0b"
              stroke="#0b1326"
              strokeWidth="1.5"
              style={{ opacity: opacityB, transition: 'opacity 300ms ease' }}
            />
          ))}

          {/* 5 Axis Text Labels & Comparative Values */}
          {AXIS_CONFIGS.map((axis, idx) => {
            const valA = valuesA[idx];
            const valB = valuesB[idx];
            const isTop = axis.angleRad === -Math.PI / 2;

            if (isTop) {
              return (
                <g key={axis.key}>
                  <text
                    x={axis.x}
                    y={axis.y}
                    fill="#dae2fd"
                    fontFamily="Plus Jakarta Sans"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor={axis.textAnchor}
                  >
                    {axis.title}
                  </text>
                  <text
                    x={axis.x}
                    y={axis.y + 12}
                    fill="#87948b"
                    fontFamily="JetBrains Mono"
                    fontSize="9"
                    textAnchor={axis.textAnchor}
                  >
                    A: {valA} | B: {valB}
                  </text>
                </g>
              );
            }

            return (
              <g key={axis.key}>
                <text
                  x={axis.x}
                  y={axis.y}
                  fill="#dae2fd"
                  fontFamily="Plus Jakarta Sans"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor={axis.textAnchor}
                >
                  {axis.title}
                </text>
                <text
                  x={axis.x}
                  y={axis.y + 12}
                  fill="#87948b"
                  fontFamily="Inter"
                  fontSize="9"
                  textAnchor={axis.textAnchor}
                >
                  {axis.subtitle}
                </text>
                <text
                  x={axis.x}
                  y={axis.y + 24}
                  fill="#87948b"
                  fontFamily="JetBrains Mono"
                  fontSize="9"
                  textAnchor={axis.textAnchor}
                >
                  A: {valA} | B: {valB}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Layer Toggle Buttons underneath */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          data-testid="mode-both"
          onClick={() => handleSelectMode('both')}
          className={`px-3 py-1 rounded text-label-sm font-label-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeMode === 'both'
              ? 'bg-surface-container-high border border-primary text-primary font-semibold'
              : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>Ambos Superpuestos</span>
        </button>

        <button
          type="button"
          data-testid="mode-a"
          onClick={() => handleSelectMode('a')}
          className={`px-3 py-1 rounded text-label-sm font-label-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeMode === 'a'
              ? 'bg-surface-container-high border border-cyan-400 text-cyan-300 font-semibold'
              : 'bg-surface-container border border-outline-variant hover:border-cyan-400/50 text-cyan-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Solo {labelA}</span>
        </button>

        <button
          type="button"
          data-testid="mode-b"
          onClick={() => handleSelectMode('b')}
          className={`px-3 py-1 rounded text-label-sm font-label-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeMode === 'b'
              ? 'bg-surface-container-high border border-amber-400 text-amber-300 font-semibold'
              : 'bg-surface-container border border-outline-variant hover:border-amber-400/50 text-amber-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Solo {labelB}</span>
        </button>

        <button
          type="button"
          data-testid="mode-diff"
          onClick={() => handleSelectMode('diff')}
          className={`px-3 py-1 rounded text-label-sm font-label-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
            activeMode === 'diff'
              ? 'bg-surface-container-high border border-primary text-primary font-semibold'
              : 'bg-surface-container border border-outline-variant hover:border-on-surface text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="text-xs font-mono font-bold">Δ</span>
          <span>Diferencial Neto</span>
        </button>
      </div>
    </div>
  );
}

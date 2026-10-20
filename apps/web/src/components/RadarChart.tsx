import React from 'react';
import { AuditSubscores } from '@openbarrio/core';

export interface RadarChartProps {
  subscores?: Partial<AuditSubscores>;
  overallScore?: number;
  labels?: Partial<Record<keyof AuditSubscores, string>>;
  className?: string;
  size?: number;
  showBadges?: boolean;
}

interface AxisDefinition {
  key: keyof AuditSubscores;
  defaultLabel: string;
  angleRad: number;
  textAnchor: 'start' | 'middle' | 'end';
  labelOffset: { x: number; y: number };
}

const AXES: AxisDefinition[] = [
  {
    key: 'connectivity',
    defaultLabel: 'Conectividad (15-min)',
    angleRad: -Math.PI / 2, // -90 deg (Top)
    textAnchor: 'middle',
    labelOffset: { x: 0, y: -20 },
  },
  {
    key: 'building',
    defaultLabel: 'Salud Edificatoria',
    angleRad: -Math.PI / 2 + (2 * Math.PI) / 5, // -18 deg (Upper Right)
    textAnchor: 'start',
    labelOffset: { x: 14, y: -6 },
  },
  {
    key: 'socioeconomic',
    defaultLabel: 'Nivel Socioeconómico',
    angleRad: -Math.PI / 2 + (4 * Math.PI) / 5, // 54 deg (Lower Right)
    textAnchor: 'start',
    labelOffset: { x: 12, y: 16 },
  },
  {
    key: 'environmental',
    defaultLabel: 'Confort Ambiental',
    angleRad: -Math.PI / 2 + (6 * Math.PI) / 5, // 126 deg (Lower Left)
    textAnchor: 'end',
    labelOffset: { x: -12, y: 16 },
  },
  {
    key: 'urbanPlanning',
    defaultLabel: 'Planeamiento SIU',
    angleRad: -Math.PI / 2 + (8 * Math.PI) / 5, // 198 deg (Upper Left)
    textAnchor: 'end',
    labelOffset: { x: -14, y: -6 },
  },
];

const GRID_LEVELS = [20, 40, 60, 80, 100];

export function RadarChart({
  subscores = {},
  overallScore,
  labels = {},
  className = '',
  showBadges = true,
}: RadarChartProps) {
  const cx = 180;
  const cy = 145;
  const maxRadius = 82;

  // Extract clamped values for all 5 axes
  const values = AXES.map((axis) => {
    const raw = subscores[axis.key];
    const val = typeof raw === 'number' && !isNaN(raw) ? raw : 70;
    return Math.min(100, Math.max(0, Math.round(val)));
  });

  // Determine dynamic styling based on average or overall score
  const computedAverage = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
  const effectiveScore = typeof overallScore === 'number' ? overallScore : computedAverage;

  let strokeColor = '#10B981'; // Stitch Emerald >= 75
  let glowColor = '#00F5A0';
  let fillColor = 'rgba(16, 185, 129, 0.22)';
  let badgeColor = 'text-emerald-400';

  if (effectiveScore < 50) {
    strokeColor = '#EF4444'; // Rose < 50
    glowColor = '#F87171';
    fillColor = 'rgba(239, 68, 68, 0.22)';
    badgeColor = 'text-rose-400';
  } else if (effectiveScore < 75) {
    strokeColor = '#F59E0B'; // Amber 50-74
    glowColor = '#FBBF24';
    fillColor = 'rgba(245, 158, 11, 0.22)';
    badgeColor = 'text-amber-400';
  }

  // Calculate coordinates for a given radius and angle
  const getPoint = (radius: number, angle: number) => {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  // Concentric polygon points for grid levels
  const gridPolygons = GRID_LEVELS.map((level) => {
    const r = (maxRadius * level) / 100;
    const points = AXES.map((axis) => {
      const pt = getPoint(r, axis.angleRad);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');
    return { level, points, r };
  });

  // Data polygon points
  const dataPoints = AXES.map((axis, index) => {
    const val = values[index];
    const r = (maxRadius * val) / 100;
    return getPoint(r, axis.angleRad);
  });

  const dataPointsString = dataPoints
    .map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    .join(' ');

  return (
    <div className={`radar-chart-container relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 360 270"
        className="w-full h-auto max-w-[380px] overflow-visible"
        role="img"
        aria-label="5-axis Barrio Due Diligence Radar Chart"
      >
        <defs>
          <radialGradient id="radarCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient center radial glow */}
        <circle cx={cx} cy={cy} r={maxRadius} fill="url(#radarCenterGlow)" />

        {/* Concentric grid pentagons */}
        {gridPolygons.map(({ level, points }) => (
          <polygon
            key={`grid-${level}`}
            points={points}
            fill="none"
            stroke="currentColor"
            className={level === 100 ? 'text-outline-variant/60' : 'text-outline-variant/25'}
            strokeWidth={level === 100 ? 1.5 : 0.8}
            strokeDasharray={level === 100 ? undefined : '2 3'}
          />
        ))}

        {/* Grid level tick numbers along the vertical top axis */}
        {GRID_LEVELS.filter((l) => l % 40 === 0).map((level) => {
          const r = (maxRadius * level) / 100;
          return (
            <text
              key={`tick-${level}`}
              x={cx + 4}
              y={cy - r + 3}
              className="fill-outline/50 text-[8px] font-mono pointer-events-none"
            >
              {level}
            </text>
          );
        })}

        {/* Radial axes from center to 100% boundary */}
        {AXES.map((axis) => {
          const edge = getPoint(maxRadius, axis.angleRad);
          return (
            <line
              key={`axis-${axis.key}`}
              x1={cx}
              y1={cy}
              x2={edge.x}
              y2={edge.y}
              stroke="currentColor"
              className="text-outline-variant/35"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon filled shape */}
        <polygon
          points={dataPointsString}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-out"
        />

        {/* Vertex data points with white ring */}
        {dataPoints.map((pt, index) => (
          <g key={`vertex-${AXES[index].key}`}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill={strokeColor}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-500 ease-out"
            />
          </g>
        ))}

        {/* Center anchor dot */}
        <circle cx={cx} cy={cy} r="2.5" fill="currentColor" className="text-outline/40" />

        {/* Axis labels & vertex score badges */}
        {AXES.map((axis, index) => {
          const edge = getPoint(maxRadius, axis.angleRad);
          const labelX = edge.x + axis.labelOffset.x;
          const labelY = edge.y + axis.labelOffset.y;
          const labelText = labels[axis.key] || axis.defaultLabel;
          const val = values[index];

          return (
            <g key={`label-group-${axis.key}`} className="pointer-events-none">
              <text
                x={labelX}
                y={labelY - (showBadges ? 3 : 0)}
                textAnchor={axis.textAnchor}
                className="fill-on-surface text-[10px] font-sans font-medium"
              >
                {labelText}
              </text>
              {showBadges && (
                <text
                  x={labelX}
                  y={labelY + 10}
                  textAnchor={axis.textAnchor}
                  className={`text-[9px] font-mono font-bold ${badgeColor}`}
                  fill={strokeColor}
                >
                  {val}/100
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

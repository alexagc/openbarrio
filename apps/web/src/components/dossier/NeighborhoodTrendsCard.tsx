import { useState } from 'react';
import { NeighborhoodTrends } from '@openbarrio/core';
import { TrendingUp } from 'lucide-react';

interface NeighborhoodTrendsCardProps {
  trends?: NeighborhoodTrends;
}

export function NeighborhoodTrendsCard({ trends }: NeighborhoodTrendsCardProps) {
  const [metric, setMetric] = useState<'income' | 'ipv'>('income');
  const [windowYears, setWindowYears] = useState<3 | 5>(5);

  if (!trends || !trends.timeSeries || trends.timeSeries.length === 0) {
    return null;
  }

  const series = windowYears === 3 ? trends.timeSeries.slice(-3) : trends.timeSeries;

  // Extract metric values
  const values = series.map((pt) =>
    metric === 'income' ? pt.householdIncome || 0 : pt.housingPriceIndex || 0
  );

  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // SVG Chart Geometry
  const width = 360;
  const height = 90;
  const paddingX = 24;
  const paddingY = 16;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const points = values.map((val, idx) => {
    const x = paddingX + (idx / (values.length - 1 || 1)) * innerWidth;
    const y = paddingY + innerHeight - ((val - minVal) / range) * innerHeight;
    return { x, y, val, period: series[idx].period };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const gentrificationLabels: Record<string, { label: string; color: string }> = {
    high: { label: 'Revalorización Rápida / Gentrificación', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    moderate: { label: 'Crecimiento Sostenido', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    stable: { label: 'Tendencia Estable', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    cooling: { label: 'Enfriamiento de Renta', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  };

  const status = gentrificationLabels[trends.summary.gentrificationIndicator] || gentrificationLabels.moderate;

  return (
    <div
      data-testid="neighborhood-trends-card"
      className="p-space-lg bg-surface-container-low border-b border-outline-variant"
    >
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-on-surface">
            Evolución y Tendencia Histórica del Barrio
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          {/* Metric Selector */}
          <div className="flex rounded bg-surface-container-high p-0.5 border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setMetric('income')}
              className={`px-2 py-0.5 rounded transition-colors ${
                metric === 'income' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              Renta (€)
            </button>
            <button
              type="button"
              onClick={() => setMetric('ipv')}
              className={`px-2 py-0.5 rounded transition-colors ${
                metric === 'ipv' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              IPV Precios
            </button>
          </div>

          {/* Time Window Selector */}
          <div className="flex rounded bg-surface-container-high p-0.5 border border-outline-variant/60">
            <button
              type="button"
              onClick={() => setWindowYears(3)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                windowYears === 3 ? 'bg-surface-variant text-on-surface font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              3A
            </button>
            <button
              type="button"
              onClick={() => setWindowYears(5)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                windowYears === 5 ? 'bg-surface-variant text-on-surface font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              5A
            </button>
          </div>
        </div>
      </div>

      {/* SVG Time Series Chart */}
      <div className="relative w-full h-[100px] bg-surface-container-high/40 rounded border border-outline-variant/40 overflow-hidden mb-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill Area */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Points */}
          {points.map((pt, idx) => (
            <g key={idx} className="cursor-pointer group">
              <circle cx={pt.x} cy={pt.y} r="3.5" fill="#00E5FF" stroke="#0B1326" strokeWidth="1.5" />
              <text
                x={pt.x}
                y={height - 3}
                textAnchor="middle"
                fontSize="9"
                fill="#94A3B8"
                fontFamily="monospace"
              >
                {pt.period}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Telemetry Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-surface-container-high border border-outline-variant/40">
          <span className="text-[10px] text-outline uppercase block">Crecimiento Renta (5A)</span>
          <span className="text-sm font-semibold text-emerald-400">
            {trends.summary.fiveYearIncomeGrowthPct > 0 ? '+' : ''}
            {trends.summary.fiveYearIncomeGrowthPct}%
          </span>
        </div>

        <div className="p-2 rounded bg-surface-container-high border border-outline-variant/40">
          <span className="text-[10px] text-outline uppercase block">Crecimiento IPV Vivienda</span>
          <span className="text-sm font-semibold text-primary">
            {trends.summary.fiveYearPriceIndexGrowthPct > 0 ? '+' : ''}
            {trends.summary.fiveYearPriceIndexGrowthPct}%
          </span>
        </div>

        <div className="p-2 rounded bg-surface-container-high border border-outline-variant/40">
          <span className="text-[10px] text-outline uppercase block">Dinámica del Barrio</span>
          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border ${status.color} mt-0.5`}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
}

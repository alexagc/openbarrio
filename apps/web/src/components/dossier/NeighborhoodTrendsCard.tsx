import { useState } from 'react';
import { NeighborhoodTrends } from '@openbarrio/core';
import { TrendingUp, Info } from 'lucide-react';

interface NeighborhoodTrendsCardProps {
  trends?: NeighborhoodTrends;
}

export function NeighborhoodTrendsCard({ trends }: NeighborhoodTrendsCardProps) {
  const [metric, setMetric] = useState<'income' | 'ipv'>('income');
  const [windowYears, setWindowYears] = useState<3 | 5>(5);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

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
  const width = 380;
  const height = 120;
  const paddingX = 32;
  const paddingTop = 26;
  const paddingBottom = 22;
  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const points = values.map((val, idx) => {
    const x = paddingX + (idx / (values.length - 1 || 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((val - minVal) / range) * innerHeight;
    return {
      x,
      y,
      val,
      period: series[idx].period,
      annualVar: series[idx].annualVariationPct,
    };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  const gentrificationLabels: Record<string, { label: string; color: string }> = {
    high: { label: 'Revalorización Rápida / Gentrificación', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    moderate: { label: 'Crecimiento Sostenido', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    stable: { label: 'Tendencia Estable', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    cooling: { label: 'Enfriamiento de Renta', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  };

  const status = gentrificationLabels[trends.summary.gentrificationIndicator] || gentrificationLabels.moderate;

  const formatPointValue = (val: number) => {
    if (metric === 'income') {
      return val >= 1000 ? `${(val / 1000).toFixed(1)}k €` : `${val} €`;
    }
    return val.toFixed(1);
  };

  const activePoint = activeIdx !== null ? points[activeIdx] : null;

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
              onClick={() => {
                setMetric('income');
                setActiveIdx(null);
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                metric === 'income' ? 'bg-primary text-on-primary font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              Renta Media (€)
            </button>
            <button
              type="button"
              onClick={() => {
                setMetric('ipv');
                setActiveIdx(null);
              }}
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
              onClick={() => {
                setWindowYears(3);
                setActiveIdx(null);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                windowYears === 3 ? 'bg-surface-variant text-on-surface font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              3A
            </button>
            <button
              type="button"
              onClick={() => {
                setWindowYears(5);
                setActiveIdx(null);
              }}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                windowYears === 5 ? 'bg-surface-variant text-on-surface font-semibold' : 'text-outline hover:text-on-surface'
              }`}
            >
              5A
            </button>
          </div>
        </div>
      </div>

      {/* SVG Time Series Chart with explicit data point values */}
      <div className="relative w-full bg-surface-container-high/40 rounded border border-outline-variant/40 p-2 mb-3">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[120px]"
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid baseline */}
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#334155"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Fill Area */}
          <path d={areaD} fill="url(#trendGradient)" />

          {/* Stroke Line */}
          <path d={pathD} fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Vertical Guides & Data Points with Explicit Values */}
          {points.map((pt, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer group"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                onClick={() => setActiveIdx(idx)}
              >
                {/* Vertical helper line to bottom */}
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={height - paddingBottom}
                  stroke={isHovered ? '#00E5FF' : '#334155'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  strokeDasharray={isHovered ? 'none' : '2 2'}
                  opacity={isHovered ? 0.9 : 0.4}
                />

                {/* Point Value (Always visible above point) */}
                <text
                  x={pt.x}
                  y={pt.y - 7}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isHovered ? '#FFFFFF' : '#38BDF8'}
                  fontFamily="monospace"
                >
                  {formatPointValue(pt.val)}
                </text>

                {/* Point Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 4}
                  fill={isHovered ? '#FFFFFF' : '#00E5FF'}
                  stroke="#0B1326"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

                {/* Period Label (Year) */}
                <text
                  x={pt.x}
                  y={height - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                  fontFamily="monospace"
                >
                  {pt.period}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Hover/Click Inspection Pill */}
        {activePoint && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-surface-container-lowest/90 border border-primary/50 text-xs font-mono shadow-md backdrop-blur flex items-center gap-2">
            <span className="text-on-surface font-semibold">{activePoint.period}:</span>
            <span className="text-primary font-bold">
              {metric === 'income' ? `${activePoint.val.toLocaleString('es-ES')} € / año` : `${activePoint.val.toFixed(1)} pts`}
            </span>
            {activePoint.annualVar !== undefined && activePoint.annualVar !== 0 && (
              <span className={`text-[11px] font-semibold ${activePoint.annualVar > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ({activePoint.annualVar > 0 ? '+' : ''}{activePoint.annualVar}%)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Telemetry Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono mb-2.5">
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

      {/* Official Data Source Provenance Footnote */}
      <div className="flex items-start gap-1.5 text-[10px] text-outline font-mono pt-1 border-t border-outline-variant/30">
        <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
        <span>
          <strong>Fuentes Oficiales INE:</strong> Renta de Hogares del <em>Atlas ADRH</em> (sección censal {trends.censusSectionId}) e <em>Índice de Precios de Vivienda (IPV)</em> de {trends.autonomousCommunity || trends.provinceName}.
        </span>
      </div>
    </div>
  );
}

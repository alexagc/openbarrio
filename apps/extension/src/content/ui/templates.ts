import { PropertyAuditReport, AuditSubscores } from '@openbarrio/core';
import {
  getScoreStyle,
  formatNoiseLabel,
  formatFloodRiskLabel,
  buildWebDossierUrl,
} from '../../shared/utils.js';

export function renderLoadingSkeleton(portalName: string): string {
  return `
    <div class="ob-card">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo">OB</div>
          <span class="ob-title">OpenBarrio</span>
          <span class="ob-badge-official">Público</span>
        </div>
      </div>
      <div class="ob-body">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
          <div class="ob-skeleton-shimmer ob-skeleton-score"></div>
          <div style="flex: 1;">
            <div class="ob-skeleton-shimmer ob-skeleton-line md"></div>
            <div class="ob-skeleton-shimmer ob-skeleton-line sm"></div>
          </div>
        </div>
        <div class="ob-grid">
          <div class="ob-skeleton-shimmer" style="height: 48px;"></div>
          <div class="ob-skeleton-shimmer" style="height: 48px;"></div>
        </div>
        <div class="ob-skeleton-shimmer" style="height: 34px; margin-top: 10px;"></div>
        <p style="font-size: 11px; color: #64748b; margin: 10px 0 0 0; text-align: center;">
          Extrayendo datos oficiales de Catastro, INE y MITECO para ${portalName}...
        </p>
      </div>
    </div>
  `;
}

export function renderMiniRadar(subscores?: Partial<AuditSubscores>): string {
  const cx = 60;
  const cy = 60;
  const maxRadius = 40;

  // 5 Pillars from report.score.subscores
  const pillars = [
    { key: 'connectivity', val: subscores?.connectivity ?? 75, label: 'CON' },
    { key: 'building', val: subscores?.building ?? 75, label: 'EDI' },
    { key: 'socioeconomic', val: subscores?.socioeconomic ?? 75, label: 'SOC' },
    { key: 'environmental', val: subscores?.environmental ?? 75, label: 'AMB' },
    { key: 'urbanPlanning', val: subscores?.urbanPlanning ?? 75, label: 'URB' },
  ];

  // Helper for computing coordinates on pentagon
  const getPoint = (radius: number, angleRad: number) => ({
    x: Number((cx + radius * Math.cos(angleRad)).toFixed(1)),
    y: Number((cy + radius * Math.sin(angleRad)).toFixed(1)),
  });

  // Background concentric grid pentagons (25%, 50%, 75%, 100%)
  const gridLevels = [25, 50, 75, 100];
  const gridSvg = gridLevels
    .map((lvl) => {
      const r = (maxRadius * lvl) / 100;
      const pts = pillars
        .map((_, i) => {
          const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
          const pt = getPoint(r, angle);
          return `${pt.x},${pt.y}`;
        })
        .join(' ');
      const isOuter = lvl === 100;
      return `<polygon points="${pts}" fill="none" stroke="#222a3d" stroke-width="${isOuter ? '1' : '0.6'}" ${isOuter ? '' : 'stroke-dasharray="2 2"'} />`;
    })
    .join('');

  // Radial spoke lines from center to outer pentagon vertices
  const spokesSvg = pillars
    .map((_, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
      const edge = getPoint(maxRadius, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${edge.x}" y2="${edge.y}" stroke="#222a3d" stroke-width="0.8" />`;
    })
    .join('');

  // Data polygon points calculated symmetrically from clamped subscore values
  const dataPoints = pillars.map((p, i) => {
    const clampedVal = Math.min(100, Math.max(0, typeof p.val === 'number' && !isNaN(p.val) ? p.val : 70));
    const r = (maxRadius * clampedVal) / 100;
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
    return getPoint(r, angle);
  });

  const dataPointsStr = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');

  // Vertex dots for data points
  const vertexDotsSvg = dataPoints
    .map((pt) => `<circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="#68dba9" stroke="#0b1326" stroke-width="1" />`)
    .join('');

  // Pillar labels positioned at outer perimeter
  const labelRadius = 51;
  const labelsSvg = pillars
    .map((p, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
      const pos = getPoint(labelRadius, angle);
      let anchor = 'middle';
      if (Math.abs(Math.cos(angle)) > 0.3) {
        anchor = Math.cos(angle) > 0 ? 'start' : 'end';
      }
      return `<text x="${pos.x}" y="${pos.y + 2.5}" text-anchor="${anchor}" fill="#87948b" font-size="7" font-weight="600" font-family="monospace">${p.label}</text>`;
    })
    .join('');

  return `
    <svg class="ob-mini-radar" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Mini Radar de 5 Ejes">
      <rect width="120" height="120" rx="10" fill="#0b1326" />
      ${gridSvg}
      ${spokesSvg}
      <circle cx="${cx}" cy="${cy}" r="1.5" fill="#3d4a42" />
      <polygon points="${dataPointsStr}" fill="rgba(104, 219, 169, 0.25)" stroke="#68dba9" stroke-width="1.8" stroke-linejoin="round" />
      ${vertexDotsSvg}
      ${labelsSvg}
    </svg>
  `.trim();
}

export function renderAuditCard(report: PropertyAuditReport, webUrl: string): string {
  const score = report.score.overallScore;
  const style = getScoreStyle(score);
  const property = report.property;
  const building = property.building;
  const environment = report.environment;
  const rental = report.rentalBenchmark;
  const dossierUrl = buildWebDossierUrl(
    webUrl,
    property.cadastralReference,
    property.coordinates
  );

  const noiseText = formatNoiseLabel(
    environment.noise.category,
    environment.noise.dayEveningNightDecibels
  );

  const floodText = formatFloodRiskLabel(
    environment.floodRisk.level,
    environment.floodRisk.isInPreferentialFlowZone
  );

  // Unit switcher badge for buildings with multiple units
  const unitsCount = building.unitsCount;
  let unitPillHtml = '';
  if (unitsCount && unitsCount > 1) {
    const cleanWebUrl = webUrl.replace(/\/+$/, '');
    const unitsDossierUrl = `${cleanWebUrl}/map?refcat=${encodeURIComponent(property.cadastralReference)}&tab=dossier`;
    unitPillHtml = `
      <a href="${unitsDossierUrl}" target="_blank" rel="noopener noreferrer" class="ob-unit-pill-link">
        <div class="ob-unit-pill">🏢 Edificio (${unitsCount} inmuebles) · Ver unidades</div>
      </a>
    `;
  }

  // Stressed zone section
  let stressedHtml = '';
  if (rental && rental.isStressedHousingZone) {
    stressedHtml = `
      <div class="ob-stressed-alert">
        <div class="ob-stressed-icon">⚠️</div>
        <div class="ob-stressed-content">
          <div class="ob-stressed-title">Zona Tensionada (Ley 12/2023)</div>
          <p class="ob-stressed-detail">
            Alquiler máx. MIVAU: <strong>${rental.officialRangeLowerEurM2.toFixed(1)} - ${rental.officialRangeUpperEurM2.toFixed(1)} €/m²</strong> (aprox. ${Math.round(rental.estimatedMonthlyRentLowerEur)} - ${Math.round(rental.estimatedMonthlyRentUpperEur)} €/mes).
          </p>
        </div>
      </div>
    `;
  }

  // 15-minute Civic Connectivity Telemetry Chips
  const conn = report.connectivity;
  const walkScore = conn?.walkScore15Min ?? (score >= 80 ? 92 : score >= 60 ? 82 : 68);
  const capLabel = conn?.nearestHealthcare
    ? `🏥 ${conn.nearestHealthcare.name.replace(/^(Centro de Salud|CAP)\s*/i, 'CAP ')} (${Math.round(conn.nearestHealthcare.walkTimeMinutes)}m)`
    : '🏥 CAP (~4m)';
  const transitLabel = conn?.nearestTransit
    ? `🚇 ${conn.nearestTransit.name.replace(/^(Estación\s*(de\s*)?|Metro\s*)/i, '')} (${Math.round(conn.nearestTransit.walkTimeMinutes)}m)`
    : '🚇 Metro/Bus (~2m)';
  const parkLabel = conn?.nearestPark
    ? `🌳 ${conn.nearestPark.name.replace(/^(Parque\s*(de\s*)?|Jardines\s*(de\s*)?)/i, '')} (${Math.round(conn.nearestPark.walkTimeMinutes)}m)`
    : '🌳 Parque (~5m)';

  const connectivityChipsHtml = `
    <!-- Connectivity Telemetry Chips (v0.3.0) -->
    <div class="ob-connectivity-chips">
      <span class="ob-telemetry-chip highlight" title="Índice de caminabilidad a servicios en 15 minutos">
        🚶 15-min WalkScore ${walkScore}
      </span>
      <span class="ob-telemetry-chip" title="Centro de Salud de Atención Primaria más próximo">
        ${capLabel}
      </span>
      <span class="ob-telemetry-chip" title="Estación de metro o cercanías más próxima">
        ${transitLabel}
      </span>
      <span class="ob-telemetry-chip" title="Zona verde o parque urbano más próximo">
        ${parkLabel}
      </span>
      <span class="ob-telemetry-chip" title="CEE">
        ⚡ CEE ${report.energy?.ratingEmissions || 'E'}
      </span>
    </div>
  `;

  // 5-Axis SVG Mini Radar
  const miniRadarHtml = renderMiniRadar(report.score.subscores);

  return `
    <div class="ob-card" id="ob-card-main">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo">OB</div>
          <span class="ob-title">OpenBarrio</span>
          <span class="ob-badge-official">Auditoría Oficial</span>
        </div>
        <div class="ob-actions">
          <button class="ob-btn-icon" id="ob-btn-collapse" title="Minimizar">▾</button>
          <button class="ob-btn-icon" id="ob-btn-close" title="Cerrar">✕</button>
        </div>
      </div>

      <div class="ob-body">
        <!-- Main Score -->
        <div class="ob-score-banner" style="background-color: ${style.bgColor}; border-color: ${style.borderColor}; color: ${style.textColor};">
          <div class="ob-score-circle" style="border-color: ${style.color}; color: ${style.color}; background: #ffffff;">
            <span class="ob-score-number">${style.score}</span>
            <span class="ob-score-max">/100</span>
          </div>
          <div class="ob-score-info">
            <h4 class="ob-score-title" style="color: ${style.textColor};">Barrio Score · ${style.badgeLabel}</h4>
            <p class="ob-score-desc" style="color: ${style.textColor};">
              ${report.property.address.municipality} · Percentil de renta top ${Math.max(1, 100 - Math.round(report.neighborhood.percentileInMunicipality))}%
            </p>
          </div>
        </div>

        <!-- Horizontal Division Unit Switcher Pill -->
        ${unitPillHtml}

        <!-- Stressed Housing Alert if active -->
        ${stressedHtml}

        <!-- Breakdown Grid -->
        <div class="ob-grid">
          <div class="ob-stat-box">
            <div class="ob-stat-label">Construcción</div>
            <div class="ob-stat-value">${building.constructionYear} · ${building.builtSurfaceM2} m²</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">Renta Media</div>
            <div class="ob-stat-value">€${report.neighborhood.averageNetHouseholdIncomeEur.toLocaleString('es-ES')}</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">Acústica (SICA)</div>
            <div class="ob-stat-value">${noiseText}</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">Inundación (SNCZI)</div>
            <div class="ob-stat-value">${floodText}</div>
          </div>
        </div>

        <!-- 5-Axis Mini-Radar & Telemetry Section -->
        <div class="ob-radar-telemetry-row">
          <div class="ob-mini-radar-container" title="Radar de 5 Ejes: Edificación, Conectividad, Ambiental, Socioeconómico y Urbanismo">
            ${miniRadarHtml}
          </div>
          ${connectivityChipsHtml}
        </div>

        <!-- Reference Catastral Note -->
        <div style="font-size: 11px; color: #64748b; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>Ref. Catastral:</span>
          <strong style="font-family: monospace; color: #334155;">${property.cadastralReference.substring(0, 14)}...</strong>
        </div>

        <!-- CTA Button -->
        <div class="ob-footer">
          <a href="${dossierUrl}" target="_blank" rel="noopener noreferrer" class="ob-btn-primary">
            Ver Auditoría Completa en OpenBarrio Web ↗
          </a>
        </div>
      </div>
    </div>
  `;
}

export function renderCollapsedPill(score: number): string {
  const style = getScoreStyle(score);
  return `
    <div class="ob-pill" id="ob-pill-expand" title="Expandir auditoría OpenBarrio">
      <div class="ob-logo" style="width: 20px; height: 20px; font-size: 10px;">OB</div>
      <span class="ob-pill-label">OpenBarrio</span>
      <span class="ob-pill-score" style="background-color: ${style.bgColor}; color: ${style.color}; border: 1px solid ${style.borderColor};">
        ${style.score}/100
      </span>
      <span style="font-size: 11px; color: #64748b;">▲</span>
    </div>
  `;
}

export function renderErrorState(errorMessage: string, webUrl: string): string {
  return `
    <div class="ob-card" style="width: 280px;">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo" style="background: #94a3b8;">OB</div>
          <span class="ob-title">OpenBarrio</span>
        </div>
        <div class="ob-actions">
          <button class="ob-btn-icon" id="ob-btn-close" title="Cerrar">✕</button>
        </div>
      </div>
      <div class="ob-body" style="padding: 12px 14px;">
        <p style="font-size: 11px; color: #64748b; margin: 0 0 10px 0; line-height: 1.4;">
          No se pudieron sincronizar los datos de Catastro automáticamente para este anuncio.
        </p>
        <a href="${webUrl}" target="_blank" rel="noopener noreferrer" class="ob-btn-primary" style="padding: 6px 10px; font-size: 11px;">
          Buscar manualmente en OpenBarrio Web ↗
        </a>
      </div>
    </div>
  `;
}

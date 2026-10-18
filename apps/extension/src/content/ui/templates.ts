import { PropertyAuditReport } from '@openbarrio/core';
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
              ${report.neighborhood.municipality} · Percentil de renta top ${Math.max(1, 100 - Math.round(report.neighborhood.percentileInMunicipality))}%
            </p>
          </div>
        </div>

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

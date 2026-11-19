import {
  isLayerUsable,
  type AuditSubscores,
  type PropertyAuditReport,
  type PropertyTypology,
  type TrafficLightState,
  detectPropertyTypology,
} from '@openbarrio/core';
import {
  formatExtMessage,
  getExtensionTranslations,
  type ExtensionLanguage,
} from '../../shared/i18n.js';
import {
  buildWebDossierUrl,
  escapeHtml,
  formatExtDateShort,
  formatFloodDisplay,
  formatNoiseDisplay,
  getScoreStyle,
  sanitizeUrl,
} from '../../shared/utils.js';

export function renderLoadingSkeleton(
  portalName: string,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const prompt = formatExtMessage(dict.loadingPrompt, {
    portal: escapeHtml(portalName),
  });

  return `
    <div class="ob-card">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo">OB</div>
          <span class="ob-title">OpenBarrio</span>
          <span class="ob-badge-official">${escapeHtml(dict.officialPublic)}</span>
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
          ${prompt}
        </p>
      </div>
    </div>
  `;
}

export function renderMiniRadar(
  subscores?: Partial<AuditSubscores>,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const cx = 60;
  const cy = 60;
  const maxRadius = 40;

  const pillars = [
    { key: 'connectivity', val: subscores?.connectivity ?? 0, label: 'CON' },
    { key: 'building', val: subscores?.building ?? 0, label: 'EDI' },
    { key: 'socioeconomic', val: subscores?.socioeconomic ?? 0, label: 'SOC' },
    { key: 'environmental', val: subscores?.environmental ?? 0, label: 'AMB' },
    { key: 'urbanPlanning', val: subscores?.urbanPlanning ?? 0, label: 'URB' },
  ];

  const getPoint = (radius: number, angleRad: number) => ({
    x: Number((cx + radius * Math.cos(angleRad)).toFixed(1)),
    y: Number((cy + radius * Math.sin(angleRad)).toFixed(1)),
  });

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

  const spokesSvg = pillars
    .map((_, i) => {
      const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
      const edge = getPoint(maxRadius, angle);
      return `<line x1="${cx}" y1="${cy}" x2="${edge.x}" y2="${edge.y}" stroke="#222a3d" stroke-width="0.8" />`;
    })
    .join('');

  const dataPoints = pillars.map((p, i) => {
    const clampedVal = Math.min(
      100,
      Math.max(0, typeof p.val === 'number' && !Number.isNaN(p.val) ? p.val : 0)
    );
    const r = (maxRadius * clampedVal) / 100;
    const angle = -Math.PI / 2 + i * ((2 * Math.PI) / 5);
    return getPoint(r, angle);
  });

  const dataPointsStr = dataPoints.map((pt) => `${pt.x},${pt.y}`).join(' ');
  const vertexDotsSvg = dataPoints
    .map(
      (pt) =>
        `<circle cx="${pt.x}" cy="${pt.y}" r="2.5" fill="#68dba9" stroke="#0b1326" stroke-width="1" />`
    )
    .join('');

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
    <svg class="ob-mini-radar" viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="${escapeHtml(dict.radarAriaLabel)}">
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

export function isSubstandardHousingReport(
  report: PropertyAuditReport,
  _extracted?: { builtSurfaceM2?: number; priceEur?: number; isRental?: boolean }
): boolean {
  if (report.substandardHousing) {
    if (report.substandardHousing.severity === 'HIGH' || report.substandardHousing.isAlert) {
      return true;
    }
    if (report.substandardHousing.severity === 'NONE') {
      return false;
    }
  }

  const property = report.property;
  const building = property?.building;
  const typology: PropertyTypology =
    report.typology ??
    property?.typology ??
    detectPropertyTypology(
      building?.primaryUse,
      building?.constructionYear,
      building?.unitsCount,
      property?.cadastralReference
    );

  const hasSubstandardRisk = Boolean(
    report.score?.keyRisks?.some((r) =>
      /local\s*comercial|infravivienda|substandard|cambio\s*de\s*uso|sin\s*c[eé]dula/i.test(r)
    )
  );

  const hasExplicitFlag = Boolean(
    (report as unknown as { isSubstandardHousing?: boolean; substandardAlert?: boolean })
      .isSubstandardHousing ||
      (report as unknown as { isSubstandardHousing?: boolean; substandardAlert?: boolean })
        .substandardAlert ||
      (property as unknown as { isSubstandardHousing?: boolean; substandardAlert?: boolean })
        ?.isSubstandardHousing ||
      (property as unknown as { isSubstandardHousing?: boolean; substandardAlert?: boolean })
        ?.substandardAlert
  );

  const isCommercialUse =
    typology === 'COMMERCIAL' ||
    Boolean(
      property?.unit?.use &&
        /comercial|almac[eé]n|industrial|oficina|local/i.test(property.unit.use)
    ) ||
    Boolean(
      building?.primaryUse &&
        /comercial|almac[eé]n|industrial|local/i.test(building.primaryUse)
    );

  const isGroundFloorCommercial =
    Boolean(
      property?.unit && /PB|00|BAJO|ENTRESUELO|EN/i.test(property.unit.floor || '')
    ) && Boolean(property?.unit?.use && !/residencial|vivienda/i.test(property.unit.use));

  return (
    hasSubstandardRisk || hasExplicitFlag || isCommercialUse || isGroundFloorCommercial
  );
}

export function renderAuditCard(
  report: PropertyAuditReport,
  webUrl: string,
  extracted?: { builtSurfaceM2?: number; priceEur?: number; isRental?: boolean },
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const score = report.score.overallScore;
  const trafficLightState: TrafficLightState | undefined = report.score.trafficLight;
  const style = getScoreStyle(score, trafficLightState, lang);
  const property = report.property;
  const building = property.building;
  const environment = report.environment;
  const layers = report.layers;
  const rental = report.rentalBenchmark;

  const dossierUrl = sanitizeUrl(
    buildWebDossierUrl(webUrl, property.cadastralReference, property.coordinates)
  );

  const noiseText = formatNoiseDisplay(environment.noise, layers?.sica, lang);
  const floodText = formatFloodDisplay(environment.floodRisk, layers?.snczi, lang);

  const sicaUnavailable = Boolean(
    !environment.noise || (layers?.sica && !isLayerUsable(layers.sica.status))
  );
  const sncziUnavailable = Boolean(
    !environment.floodRisk || (layers?.snczi && !isLayerUsable(layers.snczi.status))
  );
  const criticalNotEvaluated =
    (report.score.coverage?.missingCriticalLayers?.length ?? 0) > 0 ||
    sicaUnavailable ||
    sncziUnavailable;

  const staleDates = Object.values(layers ?? {})
    .filter((l) => l && l.status === 'stale' && l.verifiedAt)
    .map((l) => l!.verifiedAt!);

  const uncertaintyBannerHtml =
    trafficLightState === 'UNCERTAIN' || criticalNotEvaluated
      ? `
        <div class="ob-uncertainty-banner" data-testid="ob-uncertainty-banner" style="margin-bottom: 10px; padding: 8px 10px; background: rgba(100, 116, 139, 0.16); border: 1px solid rgba(148, 163, 184, 0.45); border-radius: 6px; font-size: 11px; color: #e2e8f0;">
          ${
            trafficLightState === 'UNCERTAIN'
              ? `<div><strong>${escapeHtml(dict.scoreBadgeUncertain)}</strong> · ${escapeHtml(dict.uncertainDesc)}</div>`
              : ''
          }
          ${
            criticalNotEvaluated
              ? `<div style="color: #cbd5e1; margin-top: 2px;">⚠ ${escapeHtml(dict.criticalRiskNotEvaluated)}</div>`
              : ''
          }
          ${
            staleDates.length > 0
              ? `<div style="color: #fbbf24; font-family: monospace; font-size: 10px; margin-top: 2px;">🕒 ${escapeHtml(formatExtDateShort(staleDates[0]!, lang))}</div>`
              : ''
          }
        </div>
      `
      : staleDates.length > 0
      ? `<div class="ob-stale-badge" style="margin-bottom: 10px; padding: 5px 8px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 6px; font-size: 10px; color: #fbbf24; font-family: monospace;">🕒 ${escapeHtml(formatExtDateShort(staleDates[0]!, lang))}</div>`
      : '';

  const typology: PropertyTypology =
    report.typology ??
    property.typology ??
    detectPropertyTypology(
      building.primaryUse,
      building.constructionYear,
      building.unitsCount,
      property.cadastralReference
    );

  const unitsCount = building.unitsCount;
  let unitPillHtml = '';
  if (unitsCount && unitsCount > 1 && typology === 'RESIDENTIAL') {
    const cleanWebUrl = webUrl.replace(/\/+$/, '');
    const unitsDossierUrl = sanitizeUrl(
      `${cleanWebUrl}/map?refcat=${encodeURIComponent(property.cadastralReference)}&tab=dossier`
    );
    unitPillHtml = `
      <a href="${escapeHtml(unitsDossierUrl)}" target="_blank" rel="noopener noreferrer" class="ob-unit-pill-link">
        <div class="ob-unit-pill">${escapeHtml(formatExtMessage(dict.buildingCardUnits, { count: unitsCount }))}</div>
      </a>
    `;
  }

  let substandardHtml = '';
  if (isSubstandardHousingReport(report, extracted)) {
    const commercialUseDesc =
      report.substandardHousing?.detectedUse ||
      property.unit?.use ||
      (building.primaryUse && !/residencial/i.test(building.primaryUse)
        ? building.primaryUse
        : '') ||
      (typology === 'COMMERCIAL' ? dict.typologyCommercial : dict.substandardFallbackUse);

    substandardHtml = `
      <div class="ob-substandard-alert" data-testid="ob-substandard-alert">
        <div class="ob-substandard-icon">🚨</div>
        <div class="ob-substandard-content">
          <div class="ob-substandard-title">${escapeHtml(dict.substandardTitle)}</div>
          <p class="ob-substandard-detail">
            ${escapeHtml(dict.substandardDetailPrefix)}<strong>${escapeHtml(commercialUseDesc)}</strong>${escapeHtml(dict.substandardDetailSuffix)}
          </p>
        </div>
      </div>
    `;
  }

  let stressedHtml = '';
  if (rental && rental.isStressedHousingZone && typology === 'RESIDENTIAL') {
    stressedHtml = `
      <div class="ob-stressed-alert">
        <div class="ob-stressed-icon">⚠️</div>
        <div class="ob-stressed-content">
          <div class="ob-stressed-title">${escapeHtml(dict.stressedTitle)}</div>
          <p class="ob-stressed-detail">
            ${escapeHtml(dict.stressedMaxPrefix)} <strong>${rental.officialRangeLowerEurM2.toFixed(1)} - ${rental.officialRangeUpperEurM2.toFixed(1)} €/m²</strong> (${escapeHtml(dict.stressedApprox)} ${Math.round(rental.estimatedMonthlyRentLowerEur)} - ${Math.round(rental.estimatedMonthlyRentUpperEur)} ${escapeHtml(dict.perMonth)}).
          </p>
        </div>
      </div>
    `;
  }

  const conn = report.connectivity;
  const connUnavailable = Boolean(layers?.connectivity && !isLayerUsable(layers.connectivity.status));
  const walkScoreVal =
    !connUnavailable && typeof conn?.walkScore15Min === 'number'
      ? String(conn.walkScore15Min)
      : dict.notAvailableShort;

  const capLabel =
    !connUnavailable && conn?.nearestHealthcare
      ? `🏥 ${escapeHtml(conn.nearestHealthcare.name.replace(/^(Centro de Salud|CAP)\s*/i, 'CAP '))} (${Math.round(conn.nearestHealthcare.walkTimeMinutes)}m)`
      : escapeHtml(dict.noHealthCenter);
  const transitLabel =
    !connUnavailable && conn?.nearestTransit
      ? `🚇 ${escapeHtml(conn.nearestTransit.name.replace(/^(Estación\s*(de\s*)?|Metro\s*)/i, ''))} (${Math.round(conn.nearestTransit.walkTimeMinutes)}m)`
      : escapeHtml(dict.noTransit);
  const parkLabel =
    !connUnavailable && conn?.nearestPark
      ? `🌳 ${escapeHtml(conn.nearestPark.name.replace(/^(Parque\s*(de\s*)?|Jardines\s*(de\s*)?)/i, ''))} (${Math.round(conn.nearestPark.walkTimeMinutes)}m)`
      : escapeHtml(dict.noPark);

  let ceeChipHtml = '';
  if (typology !== 'VACANT_PLOT' && typology !== 'RUSTIC' && report.energy) {
    const ceeRating = escapeHtml(report.energy.ratingEmissions);
    if (report.energy.isExpired) {
      ceeChipHtml = `<span class="ob-telemetry-chip alert">⚡ CEE ${ceeRating} (${escapeHtml(dict.ceeExpired)})</span>`;
    } else if (report.energy.isEstimated === false) {
      ceeChipHtml = `<span class="ob-telemetry-chip">⚡ CEE ${ceeRating} (${escapeHtml(dict.ceeOfficial)})</span>`;
    } else {
      ceeChipHtml = `<span class="ob-telemetry-chip">⚡ CEE ${ceeRating} (${escapeHtml(dict.ceeEstimated)})</span>`;
    }
  }

  const connectivityChipsHtml = `
    <div class="ob-connectivity-chips">
      <span class="ob-telemetry-chip highlight">
        ${escapeHtml(dict.walkScoreLabel)} ${escapeHtml(walkScoreVal)}
      </span>
      <span class="ob-telemetry-chip">${capLabel}</span>
      <span class="ob-telemetry-chip">${transitLabel}</span>
      <span class="ob-telemetry-chip">${parkLabel}</span>
      ${ceeChipHtml}
    </div>
  `;

  const miniRadarHtml = renderMiniRadar(report.score.subscores, lang);

  const advertisedM2 = extracted?.builtSurfaceM2;
  const cadastralM2 = property.unit?.builtSurfaceM2 || building.builtSurfaceM2 || 0;
  let discrepancyHtml = '';

  if (advertisedM2 && cadastralM2 > 0) {
    const diffPct = ((advertisedM2 - cadastralM2) / cadastralM2) * 100;
    if (diffPct > 15) {
      discrepancyHtml = `
        <div class="ob-discrepancy-alert" style="margin-bottom: 12px; padding: 8px 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 6px; font-size: 11px; color: #fcd34d; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 13px; line-height: 1;">⚠️</span>
          <div>
            <strong>${escapeHtml(formatExtMessage(dict.discrepancyTitle, { pct: Math.round(diffPct) }))}</strong>: ${escapeHtml(dict.discrepancyAdvertised)} ${advertisedM2} m² ${escapeHtml(dict.discrepancyVs)} ${cadastralM2} m² ${escapeHtml(dict.discrepancyNote)}
          </div>
        </div>
      `;
    }
  }

  let fiscalHtml = '';
  if (extracted?.priceEur && !extracted.isRental) {
    const price = extracted.priceEur;
    const provCode =
      property.address.provinceCode || property.address.postalCode.slice(0, 2) || '28';
    let itpRate = 8.0;
    let commName = 'Comunidad Autónoma';
    if (provCode === '28') { itpRate = 6.0; commName = 'Madrid'; }
    else if (provCode === '31') { itpRate = 6.0; commName = 'Navarra'; }
    else if (['01', '20', '48'].includes(provCode)) { itpRate = 4.0; commName = 'País Vasco'; }
    else if (['08', '17', '25', '43'].includes(provCode)) { itpRate = 10.0; commName = 'Cataluña'; }
    else if (['03', '12', '46'].includes(provCode)) { itpRate = 10.0; commName = 'Comunitat Valenciana'; }
    else if (['15', '27', '32', '36'].includes(provCode)) { itpRate = 9.0; commName = 'Galicia'; }
    else if (['04', '11', '14', '18', '21', '23', '29', '41'].includes(provCode)) {
      itpRate = 7.0;
      commName = 'Andalucía';
    }

    const itpAmount = Math.round(price * (itpRate / 100));
    const estimatedIbi = Math.round(price * 0.45 * 0.005);

    fiscalHtml = `
      <div class="ob-fiscal-box" style="margin-bottom: 12px; padding: 8px 10px; background: #131b2e; border: 1px solid #222a3d; border-radius: 6px; font-size: 11px; color: #dae2fd;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="color: #94a3b8;">${escapeHtml(formatExtMessage(dict.itpEstimated, { rate: itpRate, comm: commName }))}</span>
          <strong style="color: #68dba9; font-family: monospace;">€${itpAmount.toLocaleString('es-ES')}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #94a3b8;">${escapeHtml(dict.ibiEstimated)}</span>
          <span style="color: #dae2fd; font-family: monospace;">~€${estimatedIbi.toLocaleString('es-ES')} / ${escapeHtml(dict.perYear)}</span>
        </div>
      </div>
    `;
  }

  let iteHtml = '';
  const ite = report.buildingInspection;
  if (ite) {
    if (ite.status === 'FAVORABLE') {
      iteHtml = `
        <div class="ob-ite-badge" style="margin-bottom: 10px; padding: 6px 10px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; font-size: 11px; color: #34d399; display: flex; align-items: center; justify-content: space-between;">
          <span>${escapeHtml(dict.iteFavorable)}</span>
          <span style="font-family: monospace; font-size: 10px;">${ite.inspectionYear ? `${escapeHtml(dict.iteYearPrefix)} ${ite.inspectionYear}` : escapeHtml(dict.iteValid)}</span>
        </div>
      `;
    } else if (ite.status === 'UNFAVORABLE') {
      iteHtml = `
        <div class="ob-ite-badge" style="margin-bottom: 10px; padding: 6px 10px; background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.4); border-radius: 6px; font-size: 11px; color: #fb7185; display: flex; align-items: center; justify-content: space-between;">
          <span>${escapeHtml(dict.iteUnfavorable)}</span>
          <span style="font-family: monospace; font-size: 10px;">${escapeHtml(dict.iteRemediation)}</span>
        </div>
      `;
    } else if (ite.isPreventiveAlert) {
      iteHtml = `
        <div class="ob-ite-badge" style="margin-bottom: 10px; padding: 6px 10px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 6px; font-size: 11px; color: #fcd34d; display: flex; align-items: center; justify-content: space-between;">
          <span>${escapeHtml(dict.itePending)}</span>
          <span style="font-family: monospace; font-size: 10px;">${escapeHtml(dict.iteConservation)}</span>
        </div>
      `;
    }
  }

  const typologyBadgeLabel =
    typology === 'VACANT_PLOT'
      ? dict.typologyPlot
      : typology === 'INDUSTRIAL'
      ? dict.typologyIndustrial
      : typology === 'RUSTIC'
      ? dict.typologyRustic
      : typology === 'COMMERCIAL'
      ? dict.typologyCommercial
      : typology === 'EQUIPMENT'
      ? dict.typologyEquipment
      : dict.typologyOfficial;

  let constructionTitle = dict.fieldConstruction;
  let constructionLabel = `${building.constructionYear > 0 ? building.constructionYear : '—'} · ${building.builtSurfaceM2} m²`;
  if (typology === 'VACANT_PLOT') {
    constructionTitle = dict.fieldTypology;
    constructionLabel = `${dict.typologyPlot} (${building.builtSurfaceM2} m²)`;
  } else if (typology === 'INDUSTRIAL') {
    constructionTitle = dict.fieldUse;
    constructionLabel = `${dict.typologyIndustrial} (${building.builtSurfaceM2} m²)`;
  } else if (typology === 'RUSTIC') {
    constructionTitle = dict.fieldTypology;
    constructionLabel = `${dict.typologyRustic} (${building.builtSurfaceM2} m²)`;
  } else if (typology === 'COMMERCIAL') {
    constructionTitle = dict.fieldUse;
    constructionLabel = `${dict.typologyCommercial} (${building.builtSurfaceM2} m²)`;
  }

  const incomeDisplay = report.neighborhood
    ? `€${report.neighborhood.averageNetHouseholdIncomeEur.toLocaleString('es-ES')}`
    : escapeHtml(dict.sourceUnavailable);

  const percentileSubtitle = report.neighborhood
    ? formatExtMessage(dict.incomePercentileTop, {
        pct: Math.max(1, 100 - Math.round(report.neighborhood.percentileInMunicipality)),
      })
    : report.score.coverage
    ? formatExtMessage(dict.coverageLabel, {
        ok: report.score.coverage.pillarsWithData,
        total: report.score.coverage.pillarsTotal,
      })
    : escapeHtml(dict.notAvailableShort);

  const statusAttr = trafficLightState === 'UNCERTAIN' ? 'uncertain' : style.level;

  return `
    <div class="ob-card" id="ob-card-main" data-status="${statusAttr}">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo">OB</div>
          <span class="ob-title">OpenBarrio</span>
          <span class="ob-badge-official">${escapeHtml(typologyBadgeLabel)}</span>
        </div>
        <div class="ob-actions">
          <button class="ob-btn-icon" id="ob-btn-collapse" title="${escapeHtml(dict.collapseTitle)}">▾</button>
          <button class="ob-btn-icon" id="ob-btn-close" title="${escapeHtml(dict.closeTitle)}">✕</button>
        </div>
      </div>

      <div class="ob-body">
        <div class="ob-score-banner" style="background-color: ${style.bgColor}; border-color: ${style.borderColor}; color: ${style.textColor};">
          <div class="ob-score-circle" style="border-color: ${style.color}; color: ${style.color}; background: #ffffff;">
            <span class="ob-score-number">${style.score}</span>
            <span class="ob-score-max">/100</span>
          </div>
          <div class="ob-score-info">
            <h4 class="ob-score-title" style="color: ${style.textColor};">Barrio Score · ${escapeHtml(style.badgeLabel)}</h4>
            <p class="ob-score-desc" style="color: ${style.textColor};">
              ${escapeHtml(report.property.address.municipality)} · ${escapeHtml(percentileSubtitle)}
            </p>
          </div>
        </div>

        ${uncertaintyBannerHtml}
        ${substandardHtml}
        ${iteHtml}
        ${unitPillHtml}
        ${stressedHtml}
        ${discrepancyHtml}
        ${fiscalHtml}

        <div class="ob-grid">
          <div class="ob-stat-box">
            <div class="ob-stat-label">${escapeHtml(constructionTitle)}</div>
            <div class="ob-stat-value">${escapeHtml(constructionLabel)}</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">${escapeHtml(dict.fieldMeanIncome)}</div>
            <div class="ob-stat-value">${incomeDisplay}</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">${escapeHtml(dict.fieldAcoustics)}</div>
            <div class="ob-stat-value">${escapeHtml(noiseText)}</div>
          </div>
          <div class="ob-stat-box">
            <div class="ob-stat-label">${escapeHtml(dict.fieldFlood)}</div>
            <div class="ob-stat-value">${escapeHtml(floodText)}</div>
          </div>
        </div>

        <div class="ob-radar-telemetry-row">
          <div class="ob-mini-radar-container" title="${escapeHtml(dict.radarTitle)}">
            ${miniRadarHtml}
          </div>
          ${connectivityChipsHtml}
        </div>

        <div style="font-size: 11px; color: #64748b; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>${escapeHtml(dict.fieldRefcat)}</span>
          <strong style="font-family: monospace; color: #dae2fd;">${escapeHtml(property.cadastralReference.substring(0, 14))}...</strong>
        </div>

        <div class="ob-footer">
          <a href="${escapeHtml(dossierUrl)}" target="_blank" rel="noopener noreferrer" class="ob-btn-primary">
            ${escapeHtml(dict.viewFullAudit)}
          </a>
        </div>
      </div>
    </div>
  `;
}

export function renderCollapsedPill(
  score: number,
  trafficLightState?: TrafficLightState,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const style = getScoreStyle(score, trafficLightState, lang);
  return `
    <div class="ob-pill" id="ob-pill-expand" data-status="${trafficLightState === 'UNCERTAIN' ? 'uncertain' : style.level}" title="${escapeHtml(dict.expandTitle)}">
      <div class="ob-logo" style="width: 20px; height: 20px; font-size: 10px;">OB</div>
      <span class="ob-pill-label">OpenBarrio</span>
      <span class="ob-pill-score" style="background-color: ${style.bgColor}; color: ${style.color}; border: 1px solid ${style.borderColor};">
        ${style.score}/100${trafficLightState === 'UNCERTAIN' ? ` · ${escapeHtml(dict.scoreBadgeUncertain)}` : ''}
      </span>
      <span style="font-size: 11px; color: #64748b;">▲</span>
    </div>
  `;
}

export function renderErrorState(
  errorMessage: string,
  webUrl: string,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const safeWebUrl = sanitizeUrl(webUrl);
  return `
    <div class="ob-card" style="width: 280px;">
      <div class="ob-header">
        <div class="ob-brand">
          <div class="ob-logo" style="background: #94a3b8;">OB</div>
          <span class="ob-title">OpenBarrio</span>
        </div>
        <div class="ob-actions">
          <button class="ob-btn-icon" id="ob-btn-close" title="${escapeHtml(dict.closeTitle)}">✕</button>
        </div>
      </div>
      <div class="ob-body" style="padding: 12px 14px;">
        <p style="font-size: 11px; color: #64748b; margin: 0 0 10px 0; line-height: 1.4;">
          ${escapeHtml(errorMessage || dict.errorFallback)}
        </p>
        <a href="${escapeHtml(safeWebUrl)}" target="_blank" rel="noopener noreferrer" class="ob-btn-primary" style="padding: 6px 10px; font-size: 11px;">
          ${escapeHtml(dict.searchManually)}
        </a>
      </div>
    </div>
  `;
}

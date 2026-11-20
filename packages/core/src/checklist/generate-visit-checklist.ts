import { type PropertyAuditReport } from '../types/audit.js';
import { detectPropertyTypology } from '../types/catastro.js';
import {
  ALL_LAYER_KEYS,
  CRITICAL_LAYER_KEYS,
  type LayerKey,
  type LayerStatus,
  type LayerStatusInfo,
} from '../types/data-status.js';
import { detectSubstandardHousingAlert } from '../types/substandard-housing.js';
import {
  type ActiveProfileId,
  type ProfileId,
  type VisitChecklist,
  type VisitChecklistItem,
  type VisitChecklistSeverity,
} from '../types/visit-checklist.js';

export const VISIT_CHECKLIST_ITEM_IDS = [
  'substandard_housing',
  'flood_hazard',
  'ite_action_required',
  'radon_ground_contact',
  'noise_high',
  'seismic_vulnerable',
  'vut_high_pressure',
  'capex_high',
  'urban_planning_risk',
  'age_old_building',
  'cee_expired',
  'cee_missing',
] as const;

export type KnownChecklistAlertId = (typeof VISIT_CHECKLIST_ITEM_IDS)[number];

export interface GenerateVisitChecklistOptions {
  profile?: ActiveProfileId;
  now?: Date;
}

const SEVERITY_RANK: Record<VisitChecklistSeverity, number> = {
  critical: 0,
  important: 1,
  info: 2,
};

/**
 * Deterministic profile-specific priority boosts (negative = earlier in list).
 * Does not alter data validity or layer status; only orders actionable checks.
 */
const PROFILE_CHECKLIST_BOOSTS: Record<ProfileId, Partial<Record<string, number>>> = {
  family: {
    noise_high: -1.5,
    flood_hazard: -1.2,
    radon_ground_contact: -1.0,
    unverified_sica: -1.0,
    unverified_snczi: -1.0,
    unverified_connectivity: -0.8,
  },
  investor: {
    capex_high: -1.5,
    ite_action_required: -1.4,
    vut_high_pressure: -1.3,
    urban_planning_risk: -1.1,
    substandard_housing: -1.0,
    unverified_mivau: -0.9,
  },
  senior: {
    ite_action_required: -1.5,
    capex_high: -1.4,
    noise_high: -1.2,
    unverified_connectivity: -1.0,
    unverified_ite: -0.9,
  },
  renter: {
    substandard_housing: -1.6,
    cee_expired: -1.3,
    cee_missing: -1.2,
    noise_high: -1.1,
    urban_planning_risk: -1.0,
    unverified_mivau: -0.9,
  },
};

function resolveLayerStatus(
  layers: Partial<Record<string, LayerStatusInfo>> | undefined,
  key: LayerKey
): LayerStatus {
  return layers?.[key]?.status ?? 'ok';
}

function isCriticalLayer(key: LayerKey): boolean {
  return (CRITICAL_LAYER_KEYS as readonly string[]).includes(key);
}

function compareAscii(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Pure, byte-for-byte deterministic visit checklist generator derived from
 * typed alerts and layer statuses (`ok | stale | unavailable | out_of_coverage`).
 */
export function generateVisitChecklist(
  report: PropertyAuditReport,
  options: GenerateVisitChecklistOptions = {}
): VisitChecklist {
  const profile: ActiveProfileId = options.profile ?? 'none';
  const now = options.now ?? new Date(report.generatedAt);
  const generatedAt = Number.isNaN(now.getTime())
    ? report.generatedAt
    : now.toISOString();
  const refYear = Number.isNaN(now.getTime()) ? 2026 : now.getUTCFullYear();

  const items: VisitChecklistItem[] = [];
  const layers = report.layers;

  const typology =
    report.typology ??
    report.property.typology ??
    detectPropertyTypology(
      report.property.unit?.use || report.property.building.primaryUse,
      report.property.building.constructionYear,
      report.property.building.unitsCount,
      report.property.cadastralReference
    );
  const isUnbuilt = typology === 'VACANT_PLOT' || typology === 'RUSTIC';

  // 1. Substandard housing (Infravivienda HIGH)
  const substandard =
    report.substandardHousing ??
    report.score.substandardHousing ??
    detectSubstandardHousingAlert(report.property);
  if (substandard.severity === 'HIGH') {
    items.push({
      id: 'substandard_housing',
      category: 'legal',
      severity: 'critical',
      trigger: { alertId: 'substandard_housing', value: substandard.detectedUse },
      titleKey: 'checklist.items.substandard_housing.title',
      askKey: 'checklist.items.substandard_housing.ask',
      verifyKey: 'checklist.items.substandard_housing.verify',
      params: { use: substandard.detectedUse, floor: substandard.floor ?? 'PB' },
      sourceLayer: 'catastro',
      layerStatus: resolveLayerStatus(layers, 'catastro'),
    });
  }

  // 2. Building antiquity (>= 50 years)
  const year = report.property.building.constructionYear;
  const ageYears = year > 0 ? Math.max(0, refYear - year) : 0;
  if (!isUnbuilt && year > 0 && ageYears >= 50) {
    items.push({
      id: 'age_old_building',
      category: 'structural',
      severity: 'important',
      trigger: { alertId: 'age_old_building', value: ageYears },
      titleKey: 'checklist.items.age_old_building.title',
      askKey: 'checklist.items.age_old_building.ask',
      verifyKey: 'checklist.items.age_old_building.verify',
      params: { year, age: ageYears },
      sourceLayer: 'catastro',
      layerStatus: resolveLayerStatus(layers, 'catastro'),
    });
  }

  // 3. ITE / IEE status (UNFAVORABLE / PENDING / PREVENTIVE_REQUIRED)
  const inspection = report.buildingInspection ?? report.score.buildingInspection;
  if (
    !isUnbuilt &&
    inspection &&
    (inspection.status === 'UNFAVORABLE' ||
      inspection.status === 'PENDING' ||
      inspection.status === 'PREVENTIVE_REQUIRED' ||
      inspection.isPreventiveAlert)
  ) {
    items.push({
      id: 'ite_action_required',
      category: 'structural',
      severity: inspection.status === 'UNFAVORABLE' ? 'critical' : 'important',
      trigger: { alertId: 'ite_action_required', value: inspection.status },
      titleKey: 'checklist.items.ite_action_required.title',
      askKey: 'checklist.items.ite_action_required.ask',
      verifyKey: 'checklist.items.ite_action_required.verify',
      params: { status: inspection.status },
      sourceLayer: 'ite',
      layerStatus: resolveLayerStatus(layers, 'ite'),
    });
  }

  // 4. SICA Noise (>= 65 dBA Lden)
  const lden = report.environment?.noise?.dayEveningNightDecibels;
  if (typeof lden === 'number' && lden >= 65) {
    items.push({
      id: 'noise_high',
      category: 'environmental',
      severity: lden >= 75 ? 'critical' : 'important',
      trigger: { alertId: 'noise_high', value: lden },
      titleKey: 'checklist.items.noise_high.title',
      askKey: 'checklist.items.noise_high.ask',
      verifyKey: 'checklist.items.noise_high.verify',
      params: { lden },
      sourceLayer: 'sica',
      layerStatus: resolveLayerStatus(layers, 'sica'),
    });
  }

  // 5. SNCZI Flood hazard (MEDIUM / HIGH / Preferential Flow Zone)
  const flood = report.environment?.floodRisk;
  if (
    flood &&
    (flood.level === 'HIGH' || flood.level === 'MEDIUM' || flood.isInPreferentialFlowZone)
  ) {
    items.push({
      id: 'flood_hazard',
      category: 'environmental',
      severity:
        flood.level === 'HIGH' || flood.isInPreferentialFlowZone ? 'critical' : 'important',
      trigger: { alertId: 'flood_hazard', value: flood.level },
      titleKey: 'checklist.items.flood_hazard.title',
      askKey: 'checklist.items.flood_hazard.ask',
      verifyKey: 'checklist.items.flood_hazard.verify',
      params: {
        level: flood.level,
        returnPeriod: flood.returnPeriodYears ?? 100,
      },
      sourceLayer: 'snczi',
      layerStatus: resolveLayerStatus(layers, 'snczi'),
    });
  }

  // 6. Radon (Zona I / II with ground contact or floor <= 0)
  const radon = report.radon;
  if (
    radon &&
    (radon.municipalityZone === 'Zona I' || radon.municipalityZone === 'Zona II') &&
    (radon.isGroundContact ||
      radon.requiresMitigation ||
      (typeof radon.floorLevel === 'number' && radon.floorLevel <= 0))
  ) {
    items.push({
      id: 'radon_ground_contact',
      category: 'environmental',
      severity: radon.municipalityZone === 'Zona II' ? 'critical' : 'important',
      trigger: { alertId: 'radon_ground_contact', value: radon.municipalityZone },
      titleKey: 'checklist.items.radon_ground_contact.title',
      askKey: 'checklist.items.radon_ground_contact.ask',
      verifyKey: 'checklist.items.radon_ground_contact.verify',
      params: { zone: radon.municipalityZone },
      sourceLayer: 'radon',
      layerStatus: resolveLayerStatus(layers, 'radon'),
    });
  }

  // 7. CEE expired or missing
  const ceeStatus = resolveLayerStatus(layers, 'cee');
  if (!isUnbuilt) {
    if (report.energy?.isExpired) {
      items.push({
        id: 'cee_expired',
        category: 'energy',
        severity: 'important',
        trigger: { alertId: 'cee_expired', value: report.energy.validUntil ?? 'expired' },
        titleKey: 'checklist.items.cee_expired.title',
        askKey: 'checklist.items.cee_expired.ask',
        verifyKey: 'checklist.items.cee_expired.verify',
        params: { validUntil: report.energy.validUntil ?? '—' },
        sourceLayer: 'cee',
        layerStatus: ceeStatus,
      });
    } else if (
      (ceeStatus === 'ok' || ceeStatus === 'stale') &&
      (!report.energy?.ratingEmissions || report.energy.isEstimated)
    ) {
      items.push({
        id: 'cee_missing',
        category: 'energy',
        severity: 'important',
        trigger: { alertId: 'cee_missing', value: true },
        titleKey: 'checklist.items.cee_missing.title',
        askKey: 'checklist.items.cee_missing.ask',
        verifyKey: 'checklist.items.cee_missing.verify',
        sourceLayer: 'cee',
        layerStatus: ceeStatus,
      });
    }
  }

  // 8. Seismic hazard (pre-1994 vulnerable or ab >= 0.12g)
  const seismic = report.seismicHazard ?? report.score.seismicHazard;
  if (
    seismic &&
    (seismic.isVulnerableToSeismic ||
      seismic.basicAccelerationG >= 0.12 ||
      seismic.riskLevel === 'HIGH')
  ) {
    items.push({
      id: 'seismic_vulnerable',
      category: 'structural',
      severity:
        seismic.isVulnerableToSeismic && seismic.basicAccelerationG >= 0.12
          ? 'critical'
          : 'important',
      trigger: { alertId: 'seismic_vulnerable', value: seismic.basicAccelerationG },
      titleKey: 'checklist.items.seismic_vulnerable.title',
      askKey: 'checklist.items.seismic_vulnerable.ask',
      verifyKey: 'checklist.items.seismic_vulnerable.verify',
      params: { ab: seismic.basicAccelerationG },
      sourceLayer: 'seismic',
      layerStatus: resolveLayerStatus(layers, 'seismic'),
    });
  }

  // 9. VUT tourist pressure (>= 3%)
  if (report.vut && report.vut.vutRatioPct >= 3.0) {
    items.push({
      id: 'vut_high_pressure',
      category: 'neighborhood',
      severity: report.vut.vutRatioPct >= 8.0 ? 'critical' : 'important',
      trigger: { alertId: 'vut_high_pressure', value: report.vut.vutRatioPct },
      titleKey: 'checklist.items.vut_high_pressure.title',
      askKey: 'checklist.items.vut_high_pressure.ask',
      verifyKey: 'checklist.items.vut_high_pressure.verify',
      params: { ratio: report.vut.vutRatioPct },
      sourceLayer: 'vut',
      layerStatus: resolveLayerStatus(layers, 'vut'),
    });
  }

  // 10. CapEx high risk
  if (
    !isUnbuilt &&
    report.capex &&
    (report.capex.capexRiskScore < 50 ||
      report.capex.reserveFundAdequacy === 'deficit_severe' ||
      report.capex.elevatorRisk)
  ) {
    items.push({
      id: 'capex_high',
      category: 'structural',
      severity:
        report.capex.capexRiskScore < 40 || report.capex.reserveFundAdequacy === 'deficit_severe'
          ? 'critical'
          : 'important',
      trigger: { alertId: 'capex_high', value: report.capex.capexRiskScore },
      titleKey: 'checklist.items.capex_high.title',
      askKey: 'checklist.items.capex_high.ask',
      verifyKey: 'checklist.items.capex_high.verify',
      params: { score: report.capex.capexRiskScore },
      sourceLayer: 'catastro',
      layerStatus: resolveLayerStatus(layers, 'catastro'),
    });
  }

  // 11. Urban planning risk (protected land, unconsolidated, rustic, stressed zone)
  const up = report.urbanPlanning;
  if (
    up &&
    (up.isProtectedLand ||
      up.landClassification === 'URBAN_UNCONSOLIDATED' ||
      up.landClassification === 'RUSTIC_COMMON' ||
      up.landClassification === 'RUSTIC_PROTECTED' ||
      up.isStressedHousingZone)
  ) {
    items.push({
      id: 'urban_planning_risk',
      category: 'legal',
      severity:
        up.isProtectedLand || up.landClassification === 'RUSTIC_PROTECTED'
          ? 'critical'
          : 'important',
      trigger: { alertId: 'urban_planning_risk', value: up.landClassification },
      titleKey: 'checklist.items.urban_planning_risk.title',
      askKey: 'checklist.items.urban_planning_risk.ask',
      verifyKey: 'checklist.items.urban_planning_risk.verify',
      params: { classification: up.landClassification },
      sourceLayer: 'urbanPlanning',
      layerStatus: resolveLayerStatus(layers, 'urbanPlanning'),
    });
  }

  // 12. Unverified / Stale / Out-of-coverage layers (never omitted)
  if (layers) {
    for (const layerKey of ALL_LAYER_KEYS) {
      const info = layers[layerKey];
      if (!info || info.reason === 'not_applicable') {
        continue;
      }
      if (
        info.status === 'unavailable' ||
        info.status === 'out_of_coverage' ||
        info.status === 'stale'
      ) {
        const severity: VisitChecklistSeverity =
          info.status === 'stale'
            ? isCriticalLayer(layerKey)
              ? 'important'
              : 'info'
            : isCriticalLayer(layerKey)
              ? 'critical'
              : 'important';

        items.push({
          id: `unverified_${layerKey}`,
          category: 'verification',
          severity,
          trigger: { alertId: `layer_${info.status}`, value: layerKey },
          titleKey:
            info.status === 'stale'
              ? 'checklist.unverified.stale.title'
              : info.status === 'out_of_coverage'
                ? 'checklist.unverified.out_of_coverage.title'
                : 'checklist.unverified.unavailable.title',
          askKey: `checklist.unverified.layers.${layerKey}.ask`,
          verifyKey: `checklist.unverified.layers.${layerKey}.verify`,
          params: {
            layer: layerKey,
            source: info.sourceName,
            ...(typeof info.staleDays === 'number' ? { days: info.staleDays } : {}),
          },
          sourceLayer: layerKey,
          layerStatus: info.status,
        });
      }
    }
  }

  // Deterministic sort: effective severity (with profile boost) -> base severity -> id ASCII
  const boosts = profile !== 'none' ? PROFILE_CHECKLIST_BOOSTS[profile] : undefined;
  items.sort((a, b) => {
    const aScore = SEVERITY_RANK[a.severity] + (boosts?.[a.id] ?? 0);
    const bScore = SEVERITY_RANK[b.severity] + (boosts?.[b.id] ?? 0);
    if (aScore !== bScore) {
      return aScore - bScore;
    }
    const baseDiff = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
    if (baseDiff !== 0) {
      return baseDiff;
    }
    return compareAscii(a.id, b.id);
  });

  const counts = {
    critical: items.filter((i) => i.severity === 'critical').length,
    important: items.filter((i) => i.severity === 'important').length,
    info: items.filter((i) => i.severity === 'info').length,
    unverified: items.filter((i) => i.layerStatus !== 'ok').length,
    total: items.length,
  };

  return {
    refcat: report.property.cadastralReference,
    generatedAt,
    profile,
    items,
    counts,
  };
}

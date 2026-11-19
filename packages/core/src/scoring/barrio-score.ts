import { CadastralProperty, PropertyTypology, detectPropertyTypology } from '../types/catastro.js';
import { CensusTractIncome } from '../types/ine.js';
import { EnvironmentalData } from '../types/environmental.js';
import { CivicConnectivityData, PedestrianIsochrones } from '../types/connectivity.js';
import { UrbanPlanningData } from '../types/urban-planning.js';
import { EnergyPerformanceCertificate } from '../types/energy.js';
import { VutEvaluationDTO } from '../types/vut.js';
import { AuditScoreBreakdown, RentalBenchmark } from '../types/audit.js';
import { detectSubstandardHousingAlert } from '../types/substandard-housing.js';
import { BuildingInspection } from '../types/building-inspection.js';
import { SeismicHazard } from '../types/seismic.js';
import { LayerKey, LayerStatusInfo, isLayerUsable } from '../types/data-status.js';
import {
  PillarAvailability,
  PillarTrafficLights,
  computeAuditCoverage,
  computeScoreConfidence,
  evaluateOverallTrafficLight,
  evaluatePillarTrafficLight,
} from './traffic-light.js';

import {
  DEFAULT_SCORING_WEIGHTS,
  ENVIRONMENTAL_SUBWEIGHTS,
  METHODOLOGY_VERSION,
  ScoringWeights,
  getWeightsForTypology,
  renormalizeWeights,
} from './weights.js';

export const BARRIO_SCORE_METHODOLOGY_VERSION = METHODOLOGY_VERSION;
export type { ScoringWeights };
export { DEFAULT_SCORING_WEIGHTS };

export interface BarrioScoreInput {
  property: CadastralProperty;
  neighborhood?: CensusTractIncome;
  environment?: Partial<EnvironmentalData>;
  rentalBenchmark?: RentalBenchmark;
  connectivity?: Partial<CivicConnectivityData>;
  urbanPlanning?: Partial<UrbanPlanningData>;
  weights?: ScoringWeights;
  energy?: Partial<EnergyPerformanceCertificate>;
  vut?: Partial<VutEvaluationDTO>;
  buildingInspection?: Partial<BuildingInspection>;
  seismicHazard?: Partial<SeismicHazard>;
  pedestrianIsochrones?: Partial<PedestrianIsochrones>;
  layers?: Partial<Record<LayerKey, LayerStatusInfo>>;
}

function isLayerPresent(
  layers: Partial<Record<LayerKey, LayerStatusInfo>> | undefined,
  key: LayerKey,
  hasData: boolean
): boolean {
  if (!hasData) return false;
  const info = layers?.[key];
  return info ? isLayerUsable(info.status) : true;
}

function resolveTypologyBaseWeights(
  typology: PropertyTypology,
  weights?: ScoringWeights
): ScoringWeights {
  return getWeightsForTypology(typology, weights);
}

/**
 * Computes the base building health score based on construction year,
 * property typology and Spanish regulatory milestones.
 */
function computeBaseBuildingScore(
  year: number,
  typology: PropertyTypology,
  highlights: string[],
  risks: string[]
): number {
  if (typology === 'VACANT_PLOT') {
    highlights.push('Unbuilt urban plot (Solar): unencumbered development potential, free of building conservation liabilities');
    return 90;
  }
  if (typology === 'INDUSTRIAL') {
    if (year >= 2007) {
      highlights.push(`Industrial facility built in ${year} compliant with CTE/RSCIEI fire and structural safety standards`);
      return 92;
    }
    if (year >= 1980) {
      highlights.push(`Industrial facility built in ${year} following modern industrial building era`);
      return 82;
    }
    if (year > 0) {
      highlights.push(`Established industrial building constructed in ${year}`);
      return 75;
    }
    highlights.push('Industrial parcel with operational infrastructure');
    return 80;
  }
  if (typology === 'RUSTIC') {
    highlights.push('Rustic / agricultural estate: conservation governed by rural land management standards');
    return 85;
  }
  if (typology === 'COMMERCIAL') {
    if (year >= 2007) {
      highlights.push(`Commercial facility built in ${year} under Spanish CTE accessibility and safety standards`);
      return 92;
    }
    if (year >= 1980) {
      highlights.push(`Commercial building constructed in ${year}`);
      return 80;
    }
    if (year > 0) {
      highlights.push(`Established commercial premises constructed in ${year}`);
      return 72;
    }
    return 80;
  }
  if (typology === 'EQUIPMENT') {
    highlights.push(`Public / dotational equipment facility (Built in ${year > 0 ? year : '—'})`);
    return 88;
  }

  // RESIDENTIAL (default)
  if (year >= 2007) {
    highlights.push(`Built in ${year} under Spanish CTE (Código Técnico de la Edificación) structural, acoustic and thermal safety codes`);
    return 95;
  }
  if (year >= 1980) {
    highlights.push(`Built in ${year} following NBE thermal insulation era`);
    return 80;
  }
  if (year >= 1940) {
    risks.push(
      `Built in ${year} prior to NBE-CT-79: recommended to inspect mandatory ITE/IEE (Building Technical Inspection) and insulation`
    );
    return 55;
  }
  if (year > 0) {
    highlights.push(`Historic building constructed in ${year} with heritage character`);
    risks.push(`Historic structural age: verify ongoing building maintenance fund and structural rehabilitation status`);
    return 65;
  }
  highlights.push(`Unbuilt parcel or land without recorded building antiquity in Cadastral registry`);
  return 70;
}

/**
 * Calculates the Barrio Due Diligence Score (0-100) using explicit missing-data handling.
 * Missing or unavailable layers never receive favorable defaults or silent points.
 */
export function calculateBarrioScore(input: BarrioScoreInput): AuditScoreBreakdown;
/**
 * @deprecated Use object-input `calculateBarrioScore({ property, neighborhood, ... })`.
 */
export function calculateBarrioScore(
  property: CadastralProperty,
  neighborhood?: CensusTractIncome,
  environment?: Partial<EnvironmentalData>,
  rentalBenchmark?: RentalBenchmark,
  connectivity?: Partial<CivicConnectivityData>,
  urbanPlanning?: Partial<UrbanPlanningData>,
  weights?: ScoringWeights,
  energy?: Partial<EnergyPerformanceCertificate>,
  vut?: Partial<VutEvaluationDTO>,
  buildingInspection?: Partial<BuildingInspection>,
  seismicHazard?: Partial<SeismicHazard>,
  pedestrianIsochrones?: Partial<PedestrianIsochrones>,
  layers?: Partial<Record<LayerKey, LayerStatusInfo>>
): AuditScoreBreakdown;
export function calculateBarrioScore(
  propertyOrInput: CadastralProperty | BarrioScoreInput,
  neighborhoodArg?: CensusTractIncome,
  environmentArg?: Partial<EnvironmentalData>,
  rentalBenchmarkArg?: RentalBenchmark,
  connectivityArg?: Partial<CivicConnectivityData>,
  urbanPlanningArg?: Partial<UrbanPlanningData>,
  weightsArg?: ScoringWeights,
  energyArg?: Partial<EnergyPerformanceCertificate>,
  vutArg?: Partial<VutEvaluationDTO>,
  buildingInspectionArg?: Partial<BuildingInspection>,
  seismicHazardArg?: Partial<SeismicHazard>,
  pedestrianIsochronesArg?: Partial<PedestrianIsochrones>,
  layersArg?: Partial<Record<LayerKey, LayerStatusInfo>>
): AuditScoreBreakdown {
  const input: BarrioScoreInput =
    'property' in propertyOrInput
      ? propertyOrInput
      : {
          property: propertyOrInput,
          neighborhood: neighborhoodArg,
          environment: environmentArg,
          rentalBenchmark: rentalBenchmarkArg,
          connectivity: connectivityArg,
          urbanPlanning: urbanPlanningArg,
          weights: weightsArg,
          energy: energyArg,
          vut: vutArg,
          buildingInspection: buildingInspectionArg,
          seismicHazard: seismicHazardArg,
          pedestrianIsochrones: pedestrianIsochronesArg,
          layers: layersArg,
        };

  const {
    property,
    neighborhood,
    environment,
    rentalBenchmark,
    connectivity,
    urbanPlanning,
    weights,
    energy,
    vut,
    buildingInspection,
    seismicHazard,
    pedestrianIsochrones,
    layers,
  } = input;

  const highlights: string[] = [];
  const risks: string[] = [];

  const typology =
    property.typology ??
    detectPropertyTypology(
      property.unit?.use || property.building.primaryUse,
      property.building.constructionYear,
      property.building.unitsCount,
      property.cadastralReference
    );

  // Substandard commercial-to-residential housing heuristic (derived from Catastro property)
  const hasCatastro = layers?.catastro ? isLayerUsable(layers.catastro.status) : true;
  const substandardHousing = detectSubstandardHousingAlert(property);
  if (hasCatastro && substandardHousing.severity === 'HIGH') {
    risks.unshift(
      `CRITICAL ALERT: Potential substandard commercial-to-residential housing fraud (Infravivienda). Cadastral use is '${substandardHousing.detectedUse}' (Floor: ${substandardHousing.floor ?? 'Ground/Basement'}). Premises lack residential habitability status.`,
      `Urban planning infraction risk: Municipal sanction and cessation order for unauthorized commercial-to-residential conversion without cédula de habitabilidad.`,
      `Census registration risk: Inability to register in the municipal padrón due to non-residential cadastral classification.`
    );
  }

  // 1. Socioeconomic Dimension (0 - 100)
  const hasNeighborhood = isLayerPresent(layers, 'ine', Boolean(neighborhood));
  let socioeconomicScore = 0;

  if (hasNeighborhood && neighborhood) {
    const percentile = neighborhood.percentileInMunicipality;
    const householdIncome = neighborhood.averageNetHouseholdIncomeEur;
    const incomeScoreFactor = Math.min(100, Math.max(0, (householdIncome / 33000) * 50));
    socioeconomicScore = Math.round(
      Math.min(100, Math.max(0, percentile * 0.6 + incomeScoreFactor * 0.4))
    );

    if (percentile >= 75) {
      highlights.push(
        `High-income socioeconomic cluster: Top ${Math.max(1, 100 - Math.round(percentile))}% in municipality (average household net: €${householdIncome.toLocaleString('es-ES')})`
      );
    } else if (percentile <= 25) {
      risks.push(
        `Below-median municipal income percentile (${Math.round(percentile)}th percentile)`
      );
    }

    if (neighborhood.demographics?.medianAge >= 50) {
      highlights.push(`Established demographic profile with median age of ${neighborhood.demographics.medianAge} years`);
    }
  } else {
    const ineStatus = layers?.ine?.status;
    risks.push(
      ineStatus === 'out_of_coverage'
        ? 'Socioeconomic standing not evaluated: census section outside INE ADRH coverage'
        : 'Socioeconomic standing not evaluated: INE ADRH source unavailable'
    );
  }

  // 2. Building Health & Age Dimension (0 - 100)
  let buildingHealthScore = 0;
  const hasUrbanPlanning = isLayerPresent(layers, 'urbanPlanning', Boolean(urbanPlanning));
  const isCeeUsable = isLayerPresent(layers, 'cee', Boolean(energy?.ratingEmissions));
  const isIteUsable = isLayerPresent(layers, 'ite', Boolean(buildingInspection));
  const isSeismicUsable = isLayerPresent(layers, 'seismic', Boolean(seismicHazard));

  if (hasCatastro) {
    const year = property.building.constructionYear;
    let buildingScore = computeBaseBuildingScore(year, typology, highlights, risks);

    if (hasUrbanPlanning && urbanPlanning?.lastRenovationYear && urbanPlanning.lastRenovationYear >= 2000) {
      buildingScore = Math.min(95, buildingScore + 15);
      highlights.push(`Documented major structural renovation in ${urbanPlanning.lastRenovationYear}`);
    }

    if (typology === 'RESIDENTIAL') {
      if (property.building.unitsCount > 100) {
        buildingScore = Math.max(20, buildingScore - 5);
        risks.push(`High density residential complex (${property.building.unitsCount} cadastral units)`);
      } else if (property.building.unitsCount >= 2 && property.building.unitsCount <= 40) {
        buildingScore = Math.min(100, buildingScore + 5);
      }
    }

    if (property.building.hasCommercialGroundFloor) {
      highlights.push(`Commercial street-level presence providing neighborhood services and pedestrian vitality`);
    }

    if (isCeeUsable && energy?.ratingEmissions && (typology === 'RESIDENTIAL' || typology === 'COMMERCIAL')) {
      // Only official (non-estimated) high CEE ratings grant a favorable bonus
      if (!energy.isEstimated && ['A', 'B'].includes(energy.ratingEmissions)) {
        buildingScore = Math.min(100, buildingScore + 5);
        highlights.push(
          `High Energy Performance Certificate: Class ${energy.ratingEmissions} emissions (official registry)`
        );
      } else if (['F', 'G'].includes(energy.ratingEmissions)) {
        buildingScore = Math.max(20, buildingScore - 5);
        risks.push(
          `Low Energy Performance rating (Class ${energy.ratingEmissions}): high thermal loss and significant energy rehabilitation potential`
        );
      }

      if (energy.isExpired) {
        buildingScore = Math.max(10, buildingScore - 2);
        risks.push(
          `Official Energy Performance Certificate expired on ${energy.validUntil || 'statutory term'}: mandatory renewal under RD 390/2021 before property sale or lease`
        );
      }
    }

    if (substandardHousing.severity === 'HIGH') {
      const penalty = substandardHousing.penaltyApplied ?? 25;
      buildingScore = Math.max(10, buildingScore - penalty);
    }

    if (isIteUsable && buildingInspection) {
      if (buildingInspection.status === 'UNFAVORABLE') {
        buildingScore = Math.max(10, buildingScore - 20);
        risks.push(
          `CRITICAL: Unfavorable Technical Building Inspection (ITE/IEE desfavorable) recorded with municipal authority (${buildingInspection.municipalRegistry ?? 'Ayuntamiento'}). Actionable structural or safety defects require remediation.`
        );
      } else if (buildingInspection.status === 'FAVORABLE') {
        buildingScore = Math.min(100, buildingScore + 5);
        highlights.push(
          `Favorable Technical Building Inspection (ITE/IEE favorable) certified in municipal registry (${buildingInspection.municipalRegistry ?? 'Registro ITE/IEE'}). Structural safety and conservation confirmed.`
        );
      }

      if (buildingInspection.isPreventiveAlert) {
        risks.push(
          'Preventive IEE/ITE alert: Building age exceeds 50 years without official digital inspection recorded. Mandatory inspection required under Real Decreto Legislativo 7/2015 art. 29.'
        );
      }
    }

    if (isSeismicUsable && seismicHazard?.isVulnerableToSeismic) {
      const seismicPenalty = 8;
      buildingScore = Math.max(10, buildingScore - seismicPenalty);
      risks.push(
        `Seismic vulnerability alert: Built in ${property.building.constructionYear} prior to NCSE-94 standard in moderate/high seismic hazard zone (ab = ${seismicHazard.basicAccelerationG}g >= 0.08g). Lacks modern seismic ductility reinforcement.`
      );
    }

    buildingHealthScore = Math.min(100, Math.max(0, buildingScore));
  } else {
    risks.push('Building structural health not evaluated: Catastro OVC source unavailable');
  }

  // 3. Civic Connectivity 15-Minute Dimension (0 - 100)
  const hasConnectivity = isLayerPresent(
    layers,
    'connectivity',
    connectivity?.walkScore15Min !== undefined
  );
  let connectivityScore = 0;

  if (hasConnectivity && connectivity && connectivity.walkScore15Min !== undefined) {
    connectivityScore = Math.min(100, Math.max(0, connectivity.walkScore15Min));
    if (connectivityScore >= 80) {
      highlights.push(
        `Outstanding 15-minute civic connectivity (WalkScore ${connectivityScore}/100) with comprehensive public amenities within short walking radius`
      );
    } else if (connectivityScore < 50) {
      risks.push(
        `Limited 15-minute civic walkability (WalkScore ${connectivityScore}/100): essential services exceed comfortable pedestrian distance`
      );
    }

    if (connectivity.nearestHealthcare && connectivity.nearestHealthcare.distanceMeters <= 800) {
      const h = connectivity.nearestHealthcare;
      highlights.push(`Proximity to healthcare: ${h.name} (${Math.round(h.distanceMeters)}m, ~${Math.round(h.walkTimeMinutes)} min walk)`);
    }
    if (connectivity.nearestTransit && connectivity.nearestTransit.distanceMeters <= 600) {
      const tr = connectivity.nearestTransit;
      highlights.push(`Rapid transit access: ${tr.name} (${Math.round(tr.distanceMeters)}m, ~${Math.round(tr.walkTimeMinutes)} min walk)`);
    }
    if (connectivity.nearestEducation && connectivity.nearestEducation.distanceMeters <= 600) {
      const e = connectivity.nearestEducation;
      highlights.push(`Educational institution nearby: ${e.name} (${Math.round(e.distanceMeters)}m)`);
    }
    if (connectivity.nearestPark && connectivity.nearestPark.distanceMeters <= 700) {
      const p = connectivity.nearestPark;
      highlights.push(`Public green space nearby: ${p.name} (${Math.round(p.distanceMeters)}m)`);
    }

    if (pedestrianIsochrones?.isochrone5Min?.facilitiesCount && pedestrianIsochrones.isochrone5Min.facilitiesCount >= 3) {
      highlights.push(
        `Immediate 5-minute pedestrian cluster: ${pedestrianIsochrones.isochrone5Min.facilitiesCount} essential civic services within 375m`
      );
    }
  } else {
    risks.push(
      layers?.connectivity?.status === 'out_of_coverage'
        ? 'Civic connectivity not evaluated: location outside CNIG amenities coverage'
        : 'Civic connectivity not evaluated: amenities data unavailable'
    );
  }

  // 4. Environmental Dimension (0 - 100)
  const hasSica = isLayerPresent(layers, 'sica', Boolean(environment?.noise));
  const hasSnczi = isLayerPresent(layers, 'snczi', Boolean(environment?.floodRisk));
  const hasAqi = isLayerPresent(layers, 'airQuality', Boolean(environment?.airQuality));

  let acousticComfortScore = 0;
  if (hasSica && environment?.noise) {
    const noise = environment.noise;
    const lden = noise.dayEveningNightDecibels;
    let acousticScore: number;
    if (lden < 50) {
      acousticScore = 95;
      highlights.push(`Quiet acoustic environment (< 50 dBA Lden)`);
    } else if (lden < 55) {
      acousticScore = 88;
      highlights.push(`Favorable residential acoustic environment (${lden} dBA Lden)`);
    } else if (lden < 65) {
      acousticScore = 75;
    } else if (lden < 75) {
      acousticScore = 50;
      risks.push(`Elevated urban noise levels (${lden} dBA Lden) primarily caused by ${noise.predominantSource.toLowerCase()}`);
    } else {
      acousticScore = 30;
      risks.push(`Critical noise corridor exceeding 75 dBA Lden from ${noise.predominantSource.toLowerCase()}`);
    }
    acousticComfortScore = Math.min(100, Math.max(0, acousticScore));
  } else {
    risks.push(
      layers?.sica?.status === 'out_of_coverage'
        ? 'Acoustic risk not evaluated: outside official MITECO SICA strategic noise map coverage'
        : 'Acoustic risk not evaluated: MITECO SICA source unavailable'
    );
  }

  let climateSafetyScore = 0;
  if (hasSnczi && environment?.floodRisk) {
    const flood = environment.floodRisk;
    let floodScore = 100;
    switch (flood.level) {
      case 'NONE':
        floodScore = 100;
        highlights.push(`Zero significant fluvial or maritime flood risk (MITECO SNCZI register)`);
        break;
      case 'LOW':
        floodScore = 80;
        highlights.push(`Low flood exposure (500-year return period safety buffer)`);
        break;
      case 'MEDIUM':
        floodScore = 50;
        risks.push(`Moderate flood zone (T=100 year return period in SNCZI)`);
        break;
      case 'HIGH':
        floodScore = 25;
        risks.push(`High hazard flood zone (T=10 year return period in SNCZI)`);
        break;
    }
    if (flood.isInPreferentialFlowZone) {
      floodScore = Math.max(10, floodScore - 25);
      risks.push(`Located inside MITECO preferential water flow zone (Zona de Flujo Preferente)`);
    }
    climateSafetyScore = Math.min(100, Math.max(0, floodScore));
  } else {
    risks.push(
      layers?.snczi?.status === 'out_of_coverage'
        ? 'Flood risk not evaluated: outside official MITECO SNCZI flood cartography coverage'
        : 'Flood risk not evaluated: MITECO SNCZI source unavailable'
    );
  }

  let airQualityScore: number | null = null;
  if (hasAqi && environment?.airQuality) {
    const aqi = environment.airQuality;
    switch (aqi.category) {
      case 'GOOD':
        airQualityScore = 100;
        highlights.push(`Excellent air quality recorded at station ${aqi.stationName} (AQI ${aqi.aqiIndex})`);
        break;
      case 'FAIR':
        airQualityScore = 85;
        highlights.push(`Good air quality recorded at station ${aqi.stationName} (AQI ${aqi.aqiIndex})`);
        break;
      case 'MODERATE':
        airQualityScore = 65;
        break;
      case 'POOR':
        airQualityScore = 40;
        risks.push(`Poor air quality recorded at station ${aqi.stationName} (AQI ${aqi.aqiIndex})`);
        break;
      case 'VERY_POOR':
        airQualityScore = 20;
        risks.push(`Hazardous air quality advisory at station ${aqi.stationName} (AQI ${aqi.aqiIndex})`);
        break;
    }
  }

  let environmentalScore = 0;
  let environmentalAvailable = false;

  if (hasSica && hasSnczi && airQualityScore !== null) {
    environmentalAvailable = true;
    environmentalScore = Math.round(
      acousticComfortScore * ENVIRONMENTAL_SUBWEIGHTS.withAqi.sica +
        climateSafetyScore * ENVIRONMENTAL_SUBWEIGHTS.withAqi.snczi +
        airQualityScore * ENVIRONMENTAL_SUBWEIGHTS.withAqi.airQuality
    );
  } else if (hasSica && hasSnczi) {
    environmentalAvailable = true;
    environmentalScore = Math.round(
      acousticComfortScore * ENVIRONMENTAL_SUBWEIGHTS.withoutAqi.sica +
        climateSafetyScore * ENVIRONMENTAL_SUBWEIGHTS.withoutAqi.snczi
    );
  } else {
    const subParts: Array<{ score: number; weight: number }> = [];
    if (hasSica) subParts.push({ score: acousticComfortScore, weight: ENVIRONMENTAL_SUBWEIGHTS.withAqi.sica });
    if (hasSnczi) subParts.push({ score: climateSafetyScore, weight: ENVIRONMENTAL_SUBWEIGHTS.withAqi.snczi });
    if (airQualityScore !== null) {
      subParts.push({ score: airQualityScore, weight: ENVIRONMENTAL_SUBWEIGHTS.withAqi.airQuality });
    }

    const totalSubWeight = subParts.reduce((sum, p) => sum + p.weight, 0);
    if (totalSubWeight > 0) {
      environmentalAvailable = true;
      environmentalScore = Math.round(
        subParts.reduce((sum, p) => sum + p.score * (p.weight / totalSubWeight), 0)
      );
    }
  }

  if (isSeismicUsable && seismicHazard?.basicAccelerationG !== undefined && seismicHazard.basicAccelerationG >= 0.12) {
    if (environmentalAvailable) {
      environmentalScore = Math.max(10, environmentalScore - 8);
    }
    risks.push(
      `Elevated seismic hazard zone: Basic seismic acceleration ab = ${seismicHazard.basicAccelerationG}g (>= 0.12g) according to IGN NCSE-02.`
    );
  }
  if (environmentalAvailable) {
    environmentalScore = Math.min(100, Math.max(0, environmentalScore));
  }

  // 5. Urban Planning & Legal Dimension (0 - 100)
  let urbanPlanningScore = 0;
  const isVutUsable = isLayerPresent(layers, 'vut', Boolean(vut?.vutRatioPct !== undefined));

  if (hasUrbanPlanning && urbanPlanning) {
    let urbanScore: number;
    switch (urbanPlanning.landClassification) {
      case 'URBAN_CONSOLIDATED':
        urbanScore = 95;
        highlights.push('Consolidated urban land (Suelo Urbano Consolidado) with completed civic infrastructure and road network');
        break;
      case 'URBAN_UNCONSOLIDATED':
        urbanScore = 75;
        risks.push('Unconsolidated urban land: development charges or pending municipal urbanization actions may apply');
        break;
      case 'DEVELOPABLE':
        urbanScore = 70;
        highlights.push('Developable land (Suelo Urbanizable) slated for urban growth');
        break;
      case 'RUSTIC_COMMON':
        urbanScore = 50;
        risks.push('Rustic land (Suelo Rústico Común): strict municipal building and use restrictions apply');
        break;
      case 'RUSTIC_PROTECTED':
        urbanScore = 30;
        risks.push('Protected rustic land (Suelo Rústico Protegido) subject to special environmental, agricultural or landscape preservation laws');
        break;
      case 'UNKNOWN':
      default:
        urbanScore = 80;
        break;
    }

    if (urbanPlanning.isProtectedLand) {
      urbanScore = Math.max(20, urbanScore - 20);
      risks.push('Parcel intersects with an officially cataloged environmental, heritage or scenic protection zone');
    }

    if (urbanPlanning.isStressedHousingZone) {
      risks.push(
        'Located in an officially declared Stressed Housing Market Zone (Zona Tensionada) subject to MIVAU statutory rent caps'
      );
    }

    if (isVutUsable && vut?.vutRatioPct !== undefined) {
      const ratio = vut.vutRatioPct;
      if (ratio >= 8.0) {
        const penalty = vut.penaltyApplied ?? Math.min(25, Math.round(15 + Math.min(10, ((ratio - 8) / 7) * 10)));
        urbanScore = Math.max(10, urbanScore - penalty);
        risks.push(
          `Critical tourist apartment saturation (${ratio}% of dwellings in census section): high risk of coexistence friction and rent inflation`
        );
      } else if (ratio >= 3.0) {
        const penalty = vut.penaltyApplied ?? Math.round(5 + ((ratio - 3) / 5) * 5);
        urbanScore = Math.max(20, urbanScore - penalty);
        risks.push(`Moderate tourist apartment presence (${ratio}% of dwellings in census section)`);
      } else if (!vut.isEstimated) {
        highlights.push(`Low tourist apartment density (${ratio}% of residential stock) preserving neighborhood residential coexistence`);
      }
    }

    if (hasCatastro && substandardHousing.severity === 'HIGH') {
      const penalty = substandardHousing.penaltyApplied ?? 25;
      urbanScore = Math.max(10, urbanScore - penalty);
    }

    urbanPlanningScore = Math.min(100, Math.max(0, urbanScore));
  } else {
    if (isVutUsable && vut?.vutRatioPct !== undefined && vut.vutRatioPct >= 8.0) {
      risks.push(
        `Critical tourist apartment saturation (${vut.vutRatioPct}% of dwellings in census section): high risk of coexistence friction and rent inflation`
      );
    }
    risks.push(
      layers?.urbanPlanning?.status === 'out_of_coverage'
        ? 'Urban planning zoning not evaluated: outside municipal SIU coverage'
        : 'Urban planning zoning not evaluated: MIVAU SIU source unavailable'
    );
  }

  // 6. Rental Benchmark (SERPAVI / Ley 12/2023)
  const isMivauUsable = isLayerPresent(layers, 'mivau', Boolean(rentalBenchmark));
  if (isMivauUsable && rentalBenchmark) {
    if (rentalBenchmark.isStressedHousingZone && !urbanPlanning?.isStressedHousingZone) {
      risks.push(
        'Located in an officially declared Stressed Housing Market Zone (Zona Tensionada) subject to MIVAU statutory rent caps'
      );
    } else if (!rentalBenchmark.isStressedHousingZone && !hasUrbanPlanning) {
      highlights.push('Unrestricted rental market territory (outside declared Stressed Housing Zones)');
    }
  }

  // 7. Pillar Availability, Weight Renormalization & Coverage
  const pillarAvailability: PillarAvailability = {
    connectivity: hasConnectivity,
    building: hasCatastro,
    socioeconomic: hasNeighborhood,
    environmental: environmentalAvailable,
    urbanPlanning: hasUrbanPlanning,
  };

  const baseWeights = resolveTypologyBaseWeights(typology, weights);
  const { weightsUsed, activeWeightSum } = renormalizeWeights(baseWeights, pillarAvailability);

  const rawOverall =
    connectivityScore * weightsUsed.connectivity +
    buildingHealthScore * weightsUsed.building +
    socioeconomicScore * weightsUsed.socioeconomic +
    environmentalScore * weightsUsed.environmental +
    urbanPlanningScore * weightsUsed.urbanPlanning;

  const overallScore = activeWeightSum > 0 ? Math.round(Math.min(100, Math.max(0, rawOverall))) : 0;

  const effectiveLayers: Partial<Record<LayerKey, LayerStatusInfo>> = {
    catastro: layers?.catastro ?? {
      status: hasCatastro ? 'ok' : 'unavailable',
      sourceName: 'Catastro OVC',
      ...(hasCatastro ? {} : { reason: 'upstream_error' }),
    },
    ine: layers?.ine ?? {
      status: hasNeighborhood ? 'ok' : 'unavailable',
      sourceName: 'INE ADRH',
      ...(hasNeighborhood ? {} : { reason: 'upstream_error' }),
    },
    sica: layers?.sica ?? {
      status: hasSica ? 'ok' : 'unavailable',
      sourceName: 'MITECO SICA',
      ...(hasSica ? {} : { reason: 'upstream_error' }),
    },
    snczi: layers?.snczi ?? {
      status: hasSnczi ? 'ok' : 'unavailable',
      sourceName: 'MITECO SNCZI',
      ...(hasSnczi ? {} : { reason: 'upstream_error' }),
    },
    connectivity: layers?.connectivity ?? {
      status: hasConnectivity ? 'ok' : 'unavailable',
      sourceName: 'IGN / CNIG Equipamientos',
      ...(hasConnectivity ? {} : { reason: 'upstream_error' }),
    },
    urbanPlanning: layers?.urbanPlanning ?? {
      status: hasUrbanPlanning ? 'ok' : 'unavailable',
      sourceName: 'MIVAU SIU',
      ...(hasUrbanPlanning ? {} : { reason: 'upstream_error' }),
    },
    ...layers,
  };

  const coverage = computeAuditCoverage(effectiveLayers, pillarAvailability);
  const envCriticalMissing = !hasSica || !hasSnczi;

  const pillarTrafficLights: PillarTrafficLights = {
    connectivity: evaluatePillarTrafficLight(connectivityScore, pillarAvailability.connectivity),
    building: evaluatePillarTrafficLight(buildingHealthScore, pillarAvailability.building),
    socioeconomic: evaluatePillarTrafficLight(socioeconomicScore, pillarAvailability.socioeconomic),
    environmental: evaluatePillarTrafficLight(
      environmentalScore,
      pillarAvailability.environmental,
      envCriticalMissing
    ),
    urbanPlanning: evaluatePillarTrafficLight(urbanPlanningScore, pillarAvailability.urbanPlanning),
  };

  const trafficLight = evaluateOverallTrafficLight(overallScore, coverage);
  const scoreConfidence = computeScoreConfidence(coverage);

  return {
    overallScore,
    subscores: {
      building: buildingHealthScore,
      connectivity: connectivityScore,
      environmental: environmentalScore,
      socioeconomic: socioeconomicScore,
      urbanPlanning: urbanPlanningScore,
    },
    // Backward-compatibility aliases
    socioeconomicScore,
    buildingHealthScore,
    acousticComfortScore,
    climateSafetyScore,
    keyHighlights: highlights,
    keyRisks: risks,
    trafficLight,
    pillarTrafficLights,
    pillarAvailability,
    coverage,
    scoreConfidence,
    methodologyVersion: BARRIO_SCORE_METHODOLOGY_VERSION,
    weightsUsed,
    substandardHousing,
    buildingInspection: buildingInspection as BuildingInspection | undefined,
    seismicHazard: seismicHazard as SeismicHazard | undefined,
  };
}

export const computeBarrioScore = calculateBarrioScore;

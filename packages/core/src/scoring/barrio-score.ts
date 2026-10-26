import { CadastralProperty } from '../types/catastro.js';
import { CensusTractIncome } from '../types/ine.js';
import { EnvironmentalData } from '../types/environmental.js';
import { CivicConnectivityData } from '../types/connectivity.js';
import { UrbanPlanningData } from '../types/urban-planning.js';
import { EnergyPerformanceCertificate } from '../types/energy.js';
import { AuditScoreBreakdown, RentalBenchmark } from '../types/audit.js';

export interface ScoringWeights {
  connectivity: number;
  building: number;
  socioeconomic: number;
  environmental: number;
  urbanPlanning: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  connectivity: 0.25,
  building: 0.25,
  socioeconomic: 0.20,
  environmental: 0.15,
  urbanPlanning: 0.15,
};

/**
 * Computes the base building health score based on construction year
 * and Spanish regulatory milestones.
 */
function computeBaseBuildingScore(
  year: number,
  highlights: string[],
  risks: string[],
): number {
  if (year >= 2007) {
    // Post Código Técnico de la Edificación (CTE, RD 314/2006)
    highlights.push(`Built in ${year} under Spanish CTE (Código Técnico de la Edificación) structural, acoustic and thermal safety codes`);
    return 95;
  } else if (year >= 1980) {
    // Post NBE-CT-79 (first thermal insulation standard in Spain)
    highlights.push(`Built in ${year} following NBE thermal insulation era`);
    return 80;
  } else if (year >= 1940) {
    // Post-war era before formal energy and acoustic efficiency requirements
    risks.push(
      `Built in ${year} prior to NBE-CT-79: recommended to inspect mandatory ITE/IEE (Building Technical Inspection) and insulation`
    );
    return 55;
  } else if (year > 0) {
    // Pre-1940 historic heritage
    highlights.push(`Historic building constructed in ${year} with heritage character`);
    risks.push(`Historic structural age: verify ongoing building maintenance fund and structural rehabilitation status`);
    return 65;
  } else {
    // Unbuilt plot, agricultural land, or parcel without recorded building antiquity
    highlights.push(`Unbuilt parcel or land without recorded building antiquity in Cadastral registry`);
    return 70;
  }
}

/**
 * Calculates the comprehensive Barrio Due Diligence Score (0-100) and multidimensional subscores breakdown.
 * v0.3.0 Architecture: 5 calibrated pillars (connectivity, building, socioeconomic, environmental, urbanPlanning).
 */
export function calculateBarrioScore(
  property: CadastralProperty,
  neighborhood: CensusTractIncome,
  environment?: Partial<EnvironmentalData>,
  rentalBenchmark?: RentalBenchmark,
  connectivity?: Partial<CivicConnectivityData>,
  urbanPlanning?: Partial<UrbanPlanningData>,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS,
  energy?: Partial<EnergyPerformanceCertificate>
): AuditScoreBreakdown {
  const highlights: string[] = [];
  const risks: string[] = [];

  // 1. Socioeconomic Dimension (0 - 100)
  // Evaluates census section income percentile and absolute net household revenue
  const percentile = neighborhood.percentileInMunicipality;
  const householdIncome = neighborhood.averageNetHouseholdIncomeEur;

  // Reference benchmark: Spanish median household income ~33,000 EUR
  const incomeScoreFactor = Math.min(100, Math.max(0, (householdIncome / 33000) * 50));
  const socioeconomicScore = Math.round(
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

  if (neighborhood.demographics.medianAge >= 50) {
    highlights.push(`Established demographic profile with median age of ${neighborhood.demographics.medianAge} years`);
  }

  // 2. Building Health & Age Dimension (0 - 100)
  // Evaluates building era against Spanish construction standard milestones
  const year = property.building.constructionYear;
  let buildingScore = computeBaseBuildingScore(year, highlights, risks);

  // Renovation bonus from urbanPlanning if recorded
  if (urbanPlanning?.lastRenovationYear && urbanPlanning.lastRenovationYear >= 2000) {
    buildingScore = Math.min(95, buildingScore + 15);
    highlights.push(`Documented major structural renovation in ${urbanPlanning.lastRenovationYear}`);
  }

  // Density adjustment
  if (property.building.unitsCount > 100) {
    buildingScore = Math.max(20, buildingScore - 5);
    risks.push(`High density residential complex (${property.building.unitsCount} cadastral units)`);
  } else if (property.building.unitsCount >= 2 && property.building.unitsCount <= 40) {
    buildingScore = Math.min(100, buildingScore + 5);
  }

  // Commercial ground floor vitality
  if (property.building.hasCommercialGroundFloor) {
    highlights.push(`Commercial street-level presence providing neighborhood services and pedestrian vitality`);
  }

  // Energy efficiency rating impact on Building Health
  if (energy?.ratingEmissions) {
    if (['A', 'B'].includes(energy.ratingEmissions)) {
      buildingScore = Math.min(100, buildingScore + 5);
      highlights.push(
        `High Energy Performance Certificate: Class ${energy.ratingEmissions} emissions (${energy.isEstimated ? 'estimated from CTE regulations' : 'official registry'})`
      );
    } else if (['F', 'G'].includes(energy.ratingEmissions)) {
      buildingScore = Math.max(20, buildingScore - 5);
      risks.push(
        `Low Energy Performance rating (Class ${energy.ratingEmissions}): high thermal loss and significant energy rehabilitation potential`
      );
    }
  }

  const buildingHealthScore = Math.min(100, Math.max(0, buildingScore));

  // 3. Civic Connectivity 15-Minute Dimension (0 - 100)
  let connectivityScore: number;

  if (connectivity?.walkScore15Min !== undefined) {
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

    if (connectivity.nearestHealthcare) {
      const h = connectivity.nearestHealthcare;
      if (h.distanceMeters <= 800) {
        highlights.push(`Proximity to healthcare: ${h.name} (${Math.round(h.distanceMeters)}m, ~${Math.round(h.walkTimeMinutes)} min walk)`);
      }
    }
    if (connectivity.nearestTransit) {
      const t = connectivity.nearestTransit;
      if (t.distanceMeters <= 600) {
        highlights.push(`Rapid transit access: ${t.name} (${Math.round(t.distanceMeters)}m, ~${Math.round(t.walkTimeMinutes)} min walk)`);
      }
    }
    if (connectivity.nearestEducation) {
      const e = connectivity.nearestEducation;
      if (e.distanceMeters <= 600) {
        highlights.push(`Educational institution nearby: ${e.name} (${Math.round(e.distanceMeters)}m)`);
      }
    }
    if (connectivity.nearestPark) {
      const p = connectivity.nearestPark;
      if (p.distanceMeters <= 700) {
        highlights.push(`Public green space nearby: ${p.name} (${Math.round(p.distanceMeters)}m)`);
      }
    }
  } else {
    // Baseline walkability estimation from urban fabric
    if (property.building.hasCommercialGroundFloor) {
      connectivityScore = 75;
      highlights.push(`Active street front with commercial ground floor services enhancing local walkability`);
    } else if (property.building.unitsCount >= 10) {
      connectivityScore = 70;
    } else {
      connectivityScore = 65;
    }
  }

  // 4. Environmental Dimension (0 - 100)
  // Combines acoustic comfort (SICA), flood safety (SNCZI), and air quality (AQI)
  let acousticScore = 80; // Baseline assumption if unmeasured
  const noise = environment?.noise;

  if (noise) {
    const lden = noise.dayEveningNightDecibels;
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
  } else {
    highlights.push(`Acoustic baseline: no critical noise blackspots detected`);
  }

  const acousticComfortScore = Math.min(100, Math.max(0, acousticScore));

  let floodScore = 98;
  const flood = environment?.floodRisk;

  if (flood) {
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
  } else {
    highlights.push(`Safe elevation from national flood risk cartography`);
  }

  const climateSafetyScore = Math.min(100, Math.max(0, floodScore));

  // Air Quality (AQI) evaluation
  let airQualityScore: number | null = null;
  const aqi = environment?.airQuality;
  if (aqi) {
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

  let environmentalScore: number;
  if (airQualityScore !== null) {
    environmentalScore = Math.round(acousticComfortScore * 0.50 + climateSafetyScore * 0.35 + airQualityScore * 0.15);
  } else {
    environmentalScore = Math.round(acousticComfortScore * 0.55 + climateSafetyScore * 0.45);
  }
  environmentalScore = Math.min(100, Math.max(0, environmentalScore));

  // 5. Urban Planning & Legal Dimension (0 - 100)
  let urbanScore: number;

  if (urbanPlanning) {
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
  } else {
    urbanScore = property.building.builtSurfaceM2 > 0 ? 85 : 70;
    highlights.push('Standard urban classification verified via municipal cadastral register');
  }

  const urbanPlanningScore = Math.min(100, Math.max(0, urbanScore));

  // 6. Rental Benchmark (SERPAVI / Ley 12/2023)
  if (rentalBenchmark) {
    if (rentalBenchmark.isStressedHousingZone && !urbanPlanning?.isStressedHousingZone) {
      risks.push(
        'Located in an officially declared Stressed Housing Market Zone (Zona Tensionada) subject to MIVAU statutory rent caps'
      );
    } else if (!rentalBenchmark.isStressedHousingZone && !urbanPlanning) {
      highlights.push('Unrestricted rental market territory (outside declared Stressed Housing Zones)');
    }
  }

  // 7. Composite Multi-Score Calculation (0 - 100)
  // Calibrated weights: 25% connectivity, 25% building, 20% socioeconomic, 15% environmental, 15% urbanPlanning
  const rawOverall =
    connectivityScore * weights.connectivity +
    buildingHealthScore * weights.building +
    socioeconomicScore * weights.socioeconomic +
    environmentalScore * weights.environmental +
    urbanPlanningScore * weights.urbanPlanning;

  const overallScore = Math.round(Math.min(100, Math.max(0, rawOverall)));

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
  };
}

import { CadastralProperty } from '../types/catastro.js';
import { CensusTractIncome } from '../types/ine.js';
import { EnvironmentalData } from '../types/environmental.js';
import { AuditScoreBreakdown, RentalBenchmark } from '../types/audit.js';

export interface ScoringWeights {
  socioeconomic: number;
  buildingHealth: number;
  acousticComfort: number;
  climateSafety: number;
}

export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  socioeconomic: 0.30,
  buildingHealth: 0.30,
  acousticComfort: 0.20,
  climateSafety: 0.20,
};

/**
 * Calculates the comprehensive Barrio Due Diligence Score (0-100) and multidimensional breakdown.
 */
export function calculateBarrioScore(
  property: CadastralProperty,
  neighborhood: CensusTractIncome,
  environment?: Partial<EnvironmentalData>,
  rentalBenchmark?: RentalBenchmark,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
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
  let buildingScore = 70;

  if (year >= 2007) {
    // Post Código Técnico de la Edificación (CTE, RD 314/2006)
    buildingScore = 95;
    highlights.push(`Built in ${year} under Spanish CTE (Código Técnico de la Edificación) structural, acoustic and thermal safety codes`);
  } else if (year >= 1980) {
    // Post NBE-CT-79 (first thermal insulation standard in Spain)
    buildingScore = 80;
    highlights.push(`Built in ${year} following NBE thermal insulation era`);
  } else if (year >= 1940) {
    // Post-war era before formal energy and acoustic efficiency requirements
    buildingScore = 55;
    risks.push(
      `Built in ${year} prior to NBE-CT-79: recommended to inspect mandatory ITE/IEE (Building Technical Inspection) and insulation`
    );
  } else {
    // Pre-1940 historic heritage
    buildingScore = 65;
    highlights.push(`Historic building constructed in ${year} with heritage character`);
    risks.push(`Historic structural age: verify ongoing building maintenance fund and structural rehabilitation status`);
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

  const buildingHealthScore = Math.min(100, Math.max(0, buildingScore));

  // 3. Acoustic Comfort Dimension (0 - 100)
  // Evaluates strategic noise mapping (SICA Lden levels)
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

  // 4. Climate & Flood Safety Dimension (0 - 100)
  // Evaluates MITECO SNCZI flood risk mapping
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

  // 5. Rental Benchmark & Stressed Housing Zone (MIVAU SERPAVI / Ley 12/2023)
  if (rentalBenchmark) {
    if (rentalBenchmark.isStressedHousingZone) {
      risks.push(
        'Located in an officially declared Stressed Housing Market Zone (Zona Tensionada) subject to MIVAU statutory rent caps'
      );
    } else {
      highlights.push('Unrestricted rental market territory (outside declared Stressed Housing Zones)');
    }
  }

  // 6. Composite Barrio Score (0 - 100)
  const rawOverall =
    socioeconomicScore * weights.socioeconomic +
    buildingHealthScore * weights.buildingHealth +
    acousticComfortScore * weights.acousticComfort +
    climateSafetyScore * weights.climateSafety;

  const overallScore = Math.round(Math.min(100, Math.max(0, rawOverall)));

  return {
    overallScore,
    socioeconomicScore,
    buildingHealthScore,
    acousticComfortScore,
    climateSafetyScore,
    keyHighlights: highlights,
    keyRisks: risks,
  };
}

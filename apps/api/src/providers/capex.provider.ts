import { CadastralProperty, BuildingCapExRisk } from '@openbarrio/core';

/**
 * Calculates Building CapEx and Community Risk Intelligence for a Spanish cadastral property.
 * Evaluates ITE/IEE regulatory status, accessibility compliance (LPH / RDL 1/2013),
 * community expenses, reserve fund deficits (LPH art. 9.1.f), and priority renovations.
 */
export function calculateBuildingCapExRisk(property: CadastralProperty): BuildingCapExRisk {
  const currentYear = new Date().getFullYear();
  const constructionYear =
    property.building?.constructionYear && property.building.constructionYear > 1000
      ? property.building.constructionYear
      : 1980;

  const buildingAgeYears = Math.max(0, currentYear - constructionYear);

  // 1. ITE / IEE Status & Deadlines (Spanish National & Regional Housing Regulations)
  // Buildings >= 50 years old are subject to mandatory Technical Building Inspection (ITE / IEE).
  const iteDeadlineYear = constructionYear + 50;
  let iteStatus: BuildingCapExRisk['iteStatus'];
  let iteRequired: boolean;

  if (buildingAgeYears >= 50) {
    iteRequired = true;
    if (constructionYear < 1974) {
      iteStatus = 'mandatory_overdue';
    } else {
      iteStatus = 'mandatory_in_progress';
    }
  } else if (buildingAgeYears >= 45) {
    iteRequired = true;
    iteStatus = 'due_soon';
  } else if (buildingAgeYears >= 20) {
    iteRequired = false;
    iteStatus = 'favorable_active';
  } else {
    iteRequired = false;
    iteStatus = 'exempt';
  }

  // 2. Floor count & Elevator Presence Analysis
  const unitFloorParsed = property.unit?.floor ? parseInt(property.unit.floor, 10) : NaN;
  const floorsFromUnits = Math.ceil((property.building?.unitsCount || 1) / 3);
  const floorsFromSurface = Math.ceil((property.building?.builtSurfaceM2 || 100) / 250);
  const estimatedFloors = Math.max(
    !isNaN(unitFloorParsed) ? unitFloorParsed : 1,
    floorsFromUnits,
    floorsFromSurface
  );

  const isMultiFamily = (property.building?.unitsCount ?? 1) > 2 || estimatedFloors > 2;

  let hasElevator = false;
  if (!isMultiFamily) {
    // Single-family / low-rise chalet
    hasElevator = false;
  } else if (constructionYear >= 2006) {
    // CTE DB-SUA mandate: lifts required in multi-family buildings
    hasElevator = estimatedFloors >= 2;
  } else if (constructionYear >= 1981) {
    hasElevator = estimatedFloors >= 3;
  } else {
    // Pre-1981: older buildings originally constructed without elevators
    hasElevator = false;
  }

  // 3. Accessibility & Elevator Risk (RDL 1/2013 and LPH art. 10.1.b)
  let accessibilityRisk: BuildingCapExRisk['accessibilityRisk'];
  let elevatorRisk = false;

  if (estimatedFloors > 3 && constructionYear < 1981 && !hasElevator) {
    accessibilityRisk = 'high';
    elevatorRisk = true;
  } else if (!hasElevator && estimatedFloors > 2) {
    accessibilityRisk = 'medium';
    elevatorRisk = true;
  } else if (constructionYear < 2006) {
    accessibilityRisk = 'medium';
    elevatorRisk = false;
  } else {
    accessibilityRisk = 'low';
    elevatorRisk = false;
  }

  // 4. Community Expense Estimation (Gastos de comunidad ordinarios)
  // Derived from participation coefficient (cpt), surface area, elevator presence, and age bracket.
  const unitsCount = Math.max(1, property.building?.unitsCount || 1);
  const cpt = property.unit?.participationCoefficient ?? Number((100 / unitsCount).toFixed(2));
  const effectiveCpt = cpt > 0 ? cpt : 3.5;

  const unitSurfaceM2 =
    property.unit?.builtSurfaceM2 ??
    Math.round((property.building?.builtSurfaceM2 || 100) / unitsCount);
  const surface = unitSurfaceM2 > 0 ? unitSurfaceM2 : 80;

  const surfaceFactor = Math.max(0.6, surface / 80);
  const cptWeight = effectiveCpt / 3.5;

  let ageExpenseMultiplier = 1.0;
  if (buildingAgeYears >= 50) {
    ageExpenseMultiplier = 1.35;
  } else if (buildingAgeYears >= 30) {
    ageExpenseMultiplier = 1.2;
  } else if (buildingAgeYears >= 15) {
    ageExpenseMultiplier = 1.1;
  }

  const elevatorCostImpact = hasElevator ? 30 : 0;
  const estimatedMinFee = Math.max(
    40,
    Math.round((35 * surfaceFactor * Math.sqrt(cptWeight) + elevatorCostImpact * 0.8) * ageExpenseMultiplier)
  );
  const estimatedMaxFee = Math.max(
    60,
    Math.max(
      estimatedMinFee + 25,
      Math.round((55 * surfaceFactor * Math.sqrt(cptWeight) + elevatorCostImpact * 1.3) * ageExpenseMultiplier)
    )
  );

  const estimatedCommunityExpenseRangeEurMonth = {
    min: estimatedMinFee,
    max: estimatedMaxFee,
  };

  // 5. CapEx Renovation Cost per M2 (Derramas y obras extraordinarias)
  let estimatedCapExPerM2Eur: { min: number; max: number };
  if (buildingAgeYears >= 50) {
    estimatedCapExPerM2Eur = { min: 140, max: 290 };
  } else if (buildingAgeYears >= 40) {
    estimatedCapExPerM2Eur = { min: 85, max: 180 };
  } else if (buildingAgeYears >= 25) {
    estimatedCapExPerM2Eur = { min: 45, max: 95 };
  } else if (buildingAgeYears >= 10) {
    estimatedCapExPerM2Eur = { min: 20, max: 45 };
  } else {
    estimatedCapExPerM2Eur = { min: 5, max: 20 };
  }

  // 6. Reserve Fund Adequacy (LPH art. 9.1.f requires minimum 10% ordinary budget)
  let reserveFundAdequacy: BuildingCapExRisk['reserveFundAdequacy'];
  let estimatedReserveFundDeficitPct: number;

  if (buildingAgeYears >= 50 && (iteStatus === 'mandatory_overdue' || iteStatus === 'mandatory_in_progress')) {
    reserveFundAdequacy = 'deficit_severe';
    estimatedReserveFundDeficitPct = Math.min(45, 28 + Math.round((buildingAgeYears - 50) * 0.6));
  } else if (buildingAgeYears >= 40 || iteStatus === 'due_soon') {
    reserveFundAdequacy = 'deficit_moderate';
    estimatedReserveFundDeficitPct = Math.min(25, 14 + Math.round((buildingAgeYears - 40) * 0.9));
  } else {
    reserveFundAdequacy = 'optimal';
    estimatedReserveFundDeficitPct = 0;
  }

  // 7. Renovation Priorities
  const renovationPriorities: string[] = [];
  if (elevatorRisk || (!hasElevator && estimatedFloors > 2)) {
    renovationPriorities.push('Accesibilidad cota cero e instalación de ascensor');
  } else if (accessibilityRisk === 'high' || accessibilityRisk === 'medium') {
    renovationPriorities.push('Salvaescaleras o rampa accesible en zaguán');
  }

  if (buildingAgeYears >= 40) {
    renovationPriorities.push('Fachada y petos de cubierta');
    renovationPriorities.push('Impermeabilización de cubierta y bajantes');
  }

  if (constructionYear < 2007) {
    renovationPriorities.push('SATE / Aislamiento térmico de envolvente');
  }

  if (buildingAgeYears >= 50) {
    renovationPriorities.push('Renovación de montantes y canalizaciones comunitarias');
  }

  if (renovationPriorities.length === 0) {
    renovationPriorities.push('Mantenimiento preventivo ordinario');
    renovationPriorities.push('Optimización de alumbrado y eficiencia común');
  }

  // 8. Thermal Envelope Loss Percentage based on building code era
  let thermalEnvelopeLossPct: number;
  if (constructionYear < 1980) {
    thermalEnvelopeLossPct = 48;
  } else if (constructionYear < 2007) {
    thermalEnvelopeLossPct = 32;
  } else if (constructionYear < 2020) {
    thermalEnvelopeLossPct = 18;
  } else {
    thermalEnvelopeLossPct = 8;
  }

  // 9. CapEx Risk Score (0-100: 100 = brand new/perfect, lower for high risk)
  const agePenalty = Math.min(35, Math.round(buildingAgeYears * 0.55));

  let itePenalty = 0;
  if (iteStatus === 'mandatory_overdue') itePenalty = 25;
  else if (iteStatus === 'mandatory_in_progress') itePenalty = 15;
  else if (iteStatus === 'due_soon') itePenalty = 8;

  let accessibilityPenalty = 0;
  if (accessibilityRisk === 'high') accessibilityPenalty = 20;
  else if (accessibilityRisk === 'medium') accessibilityPenalty = 10;

  let reservePenalty = 0;
  if (reserveFundAdequacy === 'deficit_severe') reservePenalty = 15;
  else if (reserveFundAdequacy === 'deficit_moderate') reservePenalty = 8;

  const capexRiskScore = Math.max(
    5,
    Math.min(100, 100 - agePenalty - itePenalty - accessibilityPenalty - reservePenalty)
  );

  return {
    buildingAgeYears,
    iteStatus,
    iteDeadlineYear,
    iteRequired,
    accessibilityRisk,
    hasElevator,
    elevatorRisk,
    estimatedCommunityExpenseRangeEurMonth,
    estimatedCapExPerM2Eur,
    reserveFundAdequacy,
    estimatedReserveFundDeficitPct,
    renovationPriorities,
    thermalEnvelopeLossPct,
    capexRiskScore,
  };
}

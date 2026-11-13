import {
  PropertyAuditReport,
  calculateBarrioScore,
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  RentalBenchmark,
  CivicConnectivityData,
  UrbanPlanningData,
  CadastralUnitsResponse,
  CadastralUnit,
  CadastralGeometry,
  CivicFacility,
  evaluateBuildingInspectionAlert,
  evaluateSeismicVulnerability,
  calculatePedestrianIsochrones,
} from '@openbarrio/core';

export interface ExtendedAuditReport extends PropertyAuditReport {
  isOfflineDemo?: boolean;
}

export interface RawAuditDataInput {
  query?: string;
  refcat: string;
  address: string;
  score?: number;
  yearBuilt?: number;
  surfaceM2?: number;
  cadastralUsage?: string;
  householdIncome?: number;
  incomePercentile?: number;
  noiseLden?: number;
  noiseLevel?: string;
  floodRisk?: string;
  rentMinM2?: number;
  rentMaxM2?: number;
  isStressedZone?: boolean;
  coordinates?: { lat: number; lon: number };
  isLive?: boolean;
}

export function generateDeterministicGeometry(refcat: string): CadastralGeometry {
  const clean = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
  const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const centerLat = 40.42028 + (hash % 100) * 0.0001;
  const centerLon = -3.70379 + (hash % 120) * 0.0001;
  const dLat = 0.00018 + (hash % 6) * 0.00002;
  const dLon = 0.00022 + (hash % 7) * 0.00002;
  const cut = 0.00006 + (hash % 3) * 0.00002;

  const coords = [
    [
      [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
      [Number((centerLon + dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
      [Number((centerLon + dLon).toFixed(6)), Number((centerLat + dLat - cut).toFixed(6))],
      [Number((centerLon + dLon - cut).toFixed(6)), Number((centerLat + dLat - cut).toFixed(6))],
      [Number((centerLon + dLon - cut).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
      [Number((centerLon - dLon).toFixed(6)), Number((centerLat + dLat).toFixed(6))],
      [Number((centerLon - dLon).toFixed(6)), Number((centerLat - dLat).toFixed(6))],
    ],
  ];

  return {
    cadastralReference: clean,
    type: 'building',
    geometry: {
      type: 'Polygon',
      coordinates: coords,
    },
    properties: {
      numberOfFloors: 5,
      height: 16.0,
    },
  };
}

export function generateDeterministicUnits(refcat: string): CadastralUnitsResponse {
  const clean = refcat.replace(/[\s\-_.]/g, '').toUpperCase();
  const parcelRef = clean.slice(0, 14);
  const doors = ['A', 'B', 'C', 'D'];
  const units: CadastralUnit[] = [];
  const totalUnits = 24;
  const cpt = Number((100 / totalUnits).toFixed(2));

  for (let f = 0; f <= 5; f++) {
    const floorStr = f === 0 ? 'PB' : `0${f}`;
    for (let d = 0; d < 4; d++) {
      const idx = f * 4 + d + 1;
      const carStr = idx.toString().padStart(4, '0');
      const isCommercial = f === 0 && d === 0;
      units.push({
        cadastralReference: `${parcelRef}${carStr}AB`,
        floor: floorStr,
        door: doors[d],
        staircase: '1',
        use: isCommercial ? 'Comercial' : 'Residencial',
        builtSurfaceM2: isCommercial ? 140 : 75 + (idx % 4) * 12,
        participationCoefficient: cpt,
      });
    }
  }

  return {
    parcelCadastralReference: parcelRef,
    totalUnits: units.length,
    units,
  };
}

export function generateDeterministicAudit(
  lat: number,
  lon: number,
  overrides?: Partial<CadastralProperty>
): ExtendedAuditReport {
  const hasExplicitOverrides = Boolean(
    overrides?.address?.street ||
    (overrides?.cadastralReference &&
      !overrides.cadastralReference.startsWith('0549711VK4704') &&
      !overrides.cadastralReference.startsWith('9872023VH5797S') &&
      !overrides.cadastralReference.startsWith('28900A01200034'))
  );
  const isGranVia =
    !hasExplicitOverrides &&
    ((Math.abs(lat - 40.42023) < 0.0002 && Math.abs(lon - -3.70197) < 0.0002) ||
      (Math.abs(lat - 40.42028) < 0.0002 && Math.abs(lon - -3.70379) < 0.0002));
  const isGracia =
    !hasExplicitOverrides &&
    ((Math.abs(lat - 41.39170) < 0.0002 && Math.abs(lon - 2.16495) < 0.0002) ||
      (Math.abs(lat - 41.39167) < 0.0002 && Math.abs(lon - 2.16472) < 0.0002));
  const isColon =
    !hasExplicitOverrides &&
    ((Math.abs(lat - 39.46845) < 0.0002 && Math.abs(lon - -0.37318) < 0.0002) ||
      (Math.abs(lat - 39.4699) < 0.0002 && Math.abs(lon - -0.3735) < 0.0002));
  const isSierpes =
    !hasExplicitOverrides &&
    ((Math.abs(lat - 37.39147) < 0.0002 && Math.abs(lon - -5.99476) < 0.0002) ||
      (Math.abs(lat - 37.3908) < 0.0002 && Math.abs(lon - -5.9942) < 0.0002));

  const isMadridRegion = lat >= 40.0 && lat <= 41.2 && lon >= -4.5 && lon <= -3.0;
  const isCatalunya = lat >= 40.5 && lat <= 42.8 && lon >= 0.2 && lon <= 3.3;
  const isValenciana = lat >= 37.8 && lat <= 40.8 && lon >= -1.5 && lon <= 0.6;
  const isAndalucia = lat >= 36.0 && lat <= 38.7 && lon >= -7.5 && lon <= -1.7;
  const isNavarra = lat >= 41.9 && lat <= 43.4 && lon >= -2.55 && lon <= -0.7 && lon > -1.75;
  const isEuskadi = !isNavarra && lat >= 42.4 && lat <= 43.6 && lon >= -3.5 && lon <= -1.7;

  let city = 'Madrid';
  let province = 'Madrid';
  let postalPrefix = '28';

  if (isCatalunya) {
    city = 'Barcelona';
    province = 'Barcelona';
    postalPrefix = '08';
  } else if (isValenciana) {
    city = 'València';
    province = 'València';
    postalPrefix = '46';
  } else if (isAndalucia) {
    city = 'Sevilla';
    province = 'Sevilla';
    postalPrefix = '41';
  } else if (isNavarra) {
    city = 'Pamplona / Iruña';
    province = 'Navarra';
    postalPrefix = '31';
  } else if (isEuskadi) {
    const isBizkaia = lon < -2.4;
    const isGipuzkoa = lon >= -2.4 && lon < -1.7;
    city = isBizkaia ? 'Bilbao' : isGipuzkoa ? 'Donostia / San Sebastián' : 'Vitoria-Gasteiz';
    province = isBizkaia ? 'Bizkaia' : isGipuzkoa ? 'Gipuzkoa' : 'Álava';
    postalPrefix = isBizkaia ? '48' : isGipuzkoa ? '20' : '01';
  } else if (!isMadridRegion) {
    city = 'Toledo';
    province = 'Toledo';
    postalPrefix = '45';
  }

  const hash = Math.abs(Math.round(lat * 100000 + lon * 100000));
  let streetNum = String((hash % 85) + 1);
  let postalCode = `${postalPrefix}${String(100 + (hash % 899)).padStart(3, '0')}`;
  const streetNames = [
    'Calle Mayor',
    'Avenida de la Constitución',
    'Calle Real',
    'Paseo de la Alameda',
    'Carrer Nou',
    'Avenida de la Libertad',
    'Calle San Fernando',
    'Calle Cervantes',
    'Ronda de Poniente',
    'Calle de la Paz',
  ];
  let street = streetNames[hash % streetNames.length];
  let refcat = `${postalPrefix}${String(hash).slice(0, 7)}VK${String(hash).slice(0, 4)}A`;
  let year = 1950 + (hash % 70);
  let surface = 55 + (hash % 120);
  let units = 1 + (hash % 30);
  let income = 22000 + (hash % 28000);
  let percentile = 25 + (hash % 70);
  let isStressed = isCatalunya ? true : hash % 3 === 0;

  if (isGranVia) {
    city = 'Madrid';
    province = 'Madrid';
    street = 'Calle Gran Vía';
    streetNum = '28';
    postalCode = '28013';
    refcat = '0549711VK4704H';
    year = 1924;
    surface = 31500;
    units = 48;
    income = 52000;
    percentile = 91;
    isStressed = false;
  } else if (isGracia) {
    city = 'Barcelona';
    province = 'Barcelona';
    street = 'Passeig de Gràcia';
    streetNum = '43';
    postalCode = '08007';
    refcat = '0227802DF3802E';
    year = 1904;
    surface = 4300;
    units = 12;
    income = 58500;
    percentile = 96;
    isStressed = true;
  } else if (isColon) {
    city = 'València';
    province = 'València';
    street = 'Carrer de Colón';
    streetNum = '15';
    postalCode = '46004';
    refcat = '6023512YJ2762C';
    year = 1986;
    surface = 1850;
    units = 22;
    income = 41200;
    percentile = 84;
    isStressed = false;
  } else if (isSierpes) {
    city = 'Sevilla';
    province = 'Sevilla';
    street = 'Calle Sierpes';
    streetNum = '22';
    postalCode = '41004';
    refcat = '4927803TG3442F';
    year = 1968;
    surface = 95;
    units = 8;
    income = 34500;
    percentile = 68;
    isStressed = false;
  }

  const finalAddress = {
    street: overrides?.address?.street || street,
    number: overrides?.address?.number || streetNum,
    postalCode: overrides?.address?.postalCode || postalCode,
    municipality: overrides?.address?.municipality || city,
    province: overrides?.address?.province || province,
  };

  const finalRefcat = overrides?.cadastralReference || refcat;

  let unit: CadastralUnit | undefined = overrides?.unit;
  if (!unit && finalRefcat.length === 20) {
    const order = finalRefcat.slice(14, 18);
    const floorNum = parseInt(order, 10);
    const floor = !isNaN(floorNum) ? String(Math.floor(floorNum / 4)).padStart(2, '0') : '02';
    const doorIdx = !isNaN(floorNum) ? floorNum % 4 : 0;
    const door = ['A', 'B', 'C', 'D'][doorIdx] || 'A';
    const totalBldgSurface = overrides?.building?.builtSurfaceM2 || surface;
    const totalUnits = overrides?.building?.unitsCount || units || 20;
    unit = {
      cadastralReference: finalRefcat,
      floor,
      door,
      use: overrides?.building?.primaryUse || 'Residencial',
      builtSurfaceM2: Math.min(180, Math.max(50, Math.round(totalBldgSurface / totalUnits))),
      participationCoefficient: +(100 / totalUnits).toFixed(2),
    };
  }

  const effectiveSurface = unit ? unit.builtSurfaceM2 : (overrides?.building?.builtSurfaceM2 || surface);

  const property: CadastralProperty = {
    cadastralReference: finalRefcat,
    address: finalAddress,
    coordinates: { latitude: lat, longitude: lon, srs: 'EPSG:4326' },
    building: {
      constructionYear: overrides?.building?.constructionYear || year,
      builtSurfaceM2: effectiveSurface,
      primaryUse: overrides?.building?.primaryUse || 'Residencial',
      unitsCount: overrides?.building?.unitsCount || units,
      hasCommercialGroundFloor: overrides?.building?.hasCommercialGroundFloor ?? (hash % 2 === 0),
    },
    unit,
  };

  const neighborhood: CensusTractIncome = {
    censusSectionCode: `${finalAddress.postalCode.slice(0, 2)}001${String(1 + (hash % 20)).padStart(2, '0')}${String(1 + (hash % 50)).padStart(3, '0')}`,
    averageNetHouseholdIncomeEur: income,
    averageNetPersonIncomeEur: Math.round(income / 2.3),
    percentileInMunicipality: percentile,
    rankingInCity: { rank: Math.max(1, Math.round((100 - percentile) * 1.5)), totalSections: 150 },
    demographics: {
      medianAge: 38 + (hash % 16),
      singlePersonHouseholdPercentage: 20 + (hash % 25),
    },
  };

  const isNoisyZone = (hash % 16) > 10;
  const environment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: isNoisyZone ? 64 + (hash % 7) : 49 + (hash % 6),
      category: isNoisyZone ? 'NOISY' : 'QUIET',
      predominantSource: isNoisyZone ? 'ROAD_TRAFFIC' : 'NONE',
    },
    floodRisk: {
      level: 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
    airQuality: {
      aqiIndex: 28 + (hash % 18),
      category: 'GOOD',
      stationName: `${finalAddress.municipality} Centro`,
      no2MicrogramsM3: 22,
      pm25MicrogramsM3: 9,
      pm10MicrogramsM3: 16,
    },
  };

  const rentalSurface = unit ? unit.builtSurfaceM2 : Math.min(surface, 90);
  const rentalBenchmark: RentalBenchmark = {
    officialRangeLowerEurM2: isStressed ? 16.5 : 13.8,
    officialRangeUpperEurM2: isStressed ? 21.0 : 17.5,
    estimatedMonthlyRentLowerEur: Math.round((isStressed ? 16.5 : 13.8) * rentalSurface),
    estimatedMonthlyRentUpperEur: Math.round((isStressed ? 21.0 : 17.5) * rentalSurface),
    isStressedHousingZone: isStressed,
  };

  const walkScore = isGranVia ? 98 : isGracia ? 96 : isColon ? 92 : isSierpes ? 90 : Math.min(95, 65 + (hash % 30));

  const calcOffsetCoord = (distMeters: number, bearingDeg: number) => {
    const rad = (bearingDeg * Math.PI) / 180;
    const dKm = distMeters / 1000;
    const dLat = (dKm / 110.574) * Math.cos(rad);
    const dLon = (dKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(rad);
    return {
      latitude: Number((lat + dLat).toFixed(6)),
      longitude: Number((lon + dLon).toFixed(6)),
    };
  };

  const healthDist = isGranVia ? 320 : isGracia ? 380 : 250 + (hash % 350);
  const eduDist = isGranVia ? 450 : isGracia ? 310 : 300 + (hash % 300);
  const transitDist = isGranVia ? 80 : isGracia ? 120 : 150 + (hash % 250);
  const parkDist = isGranVia ? 750 : isGracia ? 520 : 350 + (hash % 350);

  const healthCoords = isGranVia ? { latitude: 40.4261, longitude: -3.7042 } : calcOffsetCoord(healthDist, 315);
  const eduCoords = isGranVia ? { latitude: 40.4222, longitude: -3.7078 } : calcOffsetCoord(eduDist, 225);
  const transitCoords = isGranVia ? { latitude: 40.4201, longitude: -3.7018 } : calcOffsetCoord(transitDist, 45);
  const parkCoords = isGranVia ? { latitude: 40.4195, longitude: -3.7126 } : calcOffsetCoord(parkDist, 135);

  const healthFacility: CivicFacility = {
    id: 'cap-' + finalAddress.postalCode,
    type: 'healthcare',
    subtype: 'primary_care',
    name: isGranVia ? 'CS Palma Norte' : isGracia ? 'CAP Eixample Dreta' : `CAP ${finalAddress.municipality}`,
    distanceMeters: healthDist,
    walkTimeMinutes: +(healthDist / 75).toFixed(1),
    latitude: healthCoords.latitude,
    longitude: healthCoords.longitude,
  };

  const eduFacility: CivicFacility = {
    id: 'esc-' + finalAddress.postalCode,
    type: 'education',
    subtype: 'school',
    name: isGranVia ? 'IES Isabel la Católica' : isGracia ? 'Escola Pia Diputació' : `Colegio Público ${finalAddress.municipality}`,
    distanceMeters: eduDist,
    walkTimeMinutes: +(eduDist / 75).toFixed(1),
    latitude: eduCoords.latitude,
    longitude: eduCoords.longitude,
  };

  const transitFacility: CivicFacility = {
    id: 'transit-' + finalAddress.postalCode,
    type: 'transit',
    subtype: 'metro',
    name: isGranVia ? 'Metro Gran Vía (L1, L5)' : isGracia ? 'Passeig de Gràcia (L2, L3, L4)' : `Metro / Bus ${finalAddress.street.split(' ').slice(-1)[0]}`,
    distanceMeters: transitDist,
    walkTimeMinutes: +(transitDist / 75).toFixed(1),
    latitude: transitCoords.latitude,
    longitude: transitCoords.longitude,
  };

  const parkFacility: CivicFacility = {
    id: 'park-' + finalAddress.postalCode,
    type: 'park',
    subtype: 'urban_park',
    name: isGranVia ? 'Jardines de Sabatini' : isGracia ? 'Jardins de la Torre de les Aigües' : `Parque ${finalAddress.municipality}`,
    distanceMeters: parkDist,
    walkTimeMinutes: +(parkDist / 75).toFixed(1),
    latitude: parkCoords.latitude,
    longitude: parkCoords.longitude,
  };

  const connectivity: CivicConnectivityData = {
    walkScore15Min: walkScore,
    facilitiesWithin15MinCount: isGranVia ? 44 : isGracia ? 39 : 22 + (hash % 20),
    nearestHealthcare: healthFacility,
    nearestEducation: eduFacility,
    nearestTransit: transitFacility,
    nearestPark: parkFacility,
    nearbyFacilities: [transitFacility, healthFacility, eduFacility, parkFacility],
  };

  const urbanPlanning: UrbanPlanningData = {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: isGranVia ? 'NZ-1 (Casco Central)' : isGracia ? '13b (Eixample Cerdà)' : 'NZ-Residencial',
    isProtectedLand: isGracia ? true : false,
    declaredRenovationsCount: year < 1980 ? 2 : 0,
    lastRenovationYear: year < 1980 ? 2018 : null,
    isStressedHousingZone: isStressed,
  };

  const energy = {
    ratingEmissions: (year >= 2020 ? 'A' : year >= 2007 ? 'D' : year >= 1980 ? 'E' : 'G') as any,
    ratingConsumption: (year >= 2020 ? 'A' : year >= 2007 ? 'D' : year >= 1980 ? 'E' : 'G') as any,
    co2Emissions: year >= 2020 ? 7.1 : year >= 2007 ? 23.5 : year >= 1980 ? 38.9 : 59.2,
    primaryEnergyConsumption: year >= 2020 ? 34.0 : year >= 2007 ? 115.0 : year >= 1980 ? 190.0 : 290.0,
    scope: 'building' as const,
    isEstimated: isGranVia ? false : true,
    registrationNumber: isGranVia ? 'MDR-2023-CEE-09412' : undefined,
    annualEstimatedCostEur: Math.round((property.building.builtSurfaceM2 || 90) * (year >= 2020 ? 34 : 190) * 0.16),
    estimationBasis: year >= 2020 ? 'CTE DB-HE 2019 nZEB' : year >= 2007 ? 'CTE DB-HE 2006' : year >= 1980 ? 'NBE-CT-79' : 'Pre-1979 Uninsulated',
  };

  const marketTrends = {
    censusSectionId: neighborhood.censusSectionCode,
    provinceName: finalAddress.province,
    autonomousCommunity: finalAddress.province === 'Barcelona' ? 'Cataluña' : finalAddress.province === 'Bizkaia' ? 'País Vasco' : 'Comunidad de Madrid',
    timeSeries: [
      { period: '2018', housingPriceIndex: 116.8, householdIncome: Math.round(income * 0.84) },
      { period: '2019', housingPriceIndex: 122.8, householdIncome: Math.round(income * 0.88) },
      { period: '2020', housingPriceIndex: 125.4, householdIncome: Math.round(income * 0.90) },
      { period: '2021', housingPriceIndex: 133.4, householdIncome: Math.round(income * 0.94) },
      { period: '2022', housingPriceIndex: 143.3, householdIncome: income },
    ],
    summary: {
      fiveYearIncomeGrowthPct: 19.0,
      fiveYearPriceIndexGrowthPct: 22.7,
      gentrificationIndicator: 'moderate' as const,
    },
  };

  const buildingInspection = evaluateBuildingInspectionAlert(property);
  const seismicHazard = evaluateSeismicVulnerability(
    property.address.municipalityCode || '28079',
    property.building.constructionYear,
    undefined,
    property.address.municipality
  );
  const pedestrianIsochrones = calculatePedestrianIsochrones(
    [property.coordinates.longitude, property.coordinates.latitude],
    connectivity.nearbyFacilities || []
  );

  const score = calculateBarrioScore(
    property,
    neighborhood,
    environment,
    rentalBenchmark,
    connectivity,
    urbanPlanning,
    undefined,
    energy,
    undefined,
    buildingInspection,
    seismicHazard,
    pedestrianIsochrones
  );

  return {
    id: 'demo-audit-' + Math.random().toString(36).substring(2, 9),
    generatedAt: new Date().toISOString(),
    property,
    neighborhood,
    environment,
    connectivity,
    urbanPlanning,
    score,
    rentalBenchmark,
    energy,
    marketTrends,
    buildingInspection,
    seismicHazard,
    pedestrianIsochrones,
    isOfflineDemo: true,
  };
}

export function generateDeterministicAuditFromRefcat(
  refcat: string,
  fallbackCoords?: { lat: number; lon: number }
): ExtendedAuditReport {
  const clean = refcat.trim().toUpperCase();

  let unit: CadastralUnit | undefined;
  if (clean.length === 20) {
    unit = {
      cadastralReference: clean,
      floor: '02',
      door: 'B',
      staircase: '1',
      use: 'Residencial',
      builtSurfaceM2: 85,
      participationCoefficient: 4.15,
    };
  }

  if (fallbackCoords && (fallbackCoords.lat !== 40.4168 || fallbackCoords.lon !== -3.7038)) {
    const report = generateDeterministicAudit(fallbackCoords.lat, fallbackCoords.lon, {
      cadastralReference: clean,
    });
    if (unit) report.property.unit = unit;
    return report;
  }

  if (clean.startsWith('0227802DF3802E') || clean.startsWith('08019A00200005') || clean.startsWith('08019A02300045')) {
    return generateDeterministicAudit(41.3917, 2.16495, {
      cadastralReference: clean,
      address: {
        street: 'Passeig de Gràcia',
        number: '43',
        postalCode: '08007',
        municipality: 'Barcelona',
        province: 'Barcelona',
      },
    });
  }

  if (clean.startsWith('6023512YJ2762C') || clean.startsWith('4625001VK4722E')) {
    return generateDeterministicAudit(39.46845, -0.37318, {
      cadastralReference: clean,
      address: {
        street: 'Carrer de Colón',
        number: '15',
        postalCode: '46004',
        municipality: 'València',
        province: 'València',
      },
    });
  }

  if (clean.startsWith('4927803TG3442F') || clean.startsWith('4190001TG3449S') || clean.startsWith('41091A00400012')) {
    return generateDeterministicAudit(37.39147, -5.99476, {
      cadastralReference: clean,
      address: {
        street: 'Calle Sierpes',
        number: '22',
        postalCode: '41004',
        municipality: 'Sevilla',
        province: 'Sevilla',
      },
    });
  }

  if (clean.startsWith('0549711VK4704') || clean.startsWith('9872023VH5797S') || clean.startsWith('28900A01200034')) {
    return generateDeterministicAudit(40.42023, -3.70197, {
      cadastralReference: clean,
      address: {
        street: 'Calle Gran Vía',
        number: '28',
        postalCode: '28013',
        municipality: 'Madrid',
        province: 'Madrid',
      },
    });
  }

  const provCode = clean.slice(0, 2);
  if (provCode === '08') {
    return generateDeterministicAudit(41.3851, 2.1734, { cadastralReference: clean });
  }
  if (provCode === '46') {
    return generateDeterministicAudit(39.4699, -0.3735, { cadastralReference: clean });
  }
  if (provCode === '41') {
    return generateDeterministicAudit(37.3891, -5.9845, { cadastralReference: clean });
  }
  if (provCode === '29') {
    return generateDeterministicAudit(36.7213, -4.4214, { cadastralReference: clean });
  }
  if (provCode === '48') {
    return generateDeterministicAudit(43.263, -2.935, { cadastralReference: clean });
  }
  if (provCode === '50') {
    return generateDeterministicAudit(41.6561, -0.8773, { cadastralReference: clean });
  }
  if (provCode === '28') {
    return generateDeterministicAudit(40.4168, -3.7038, { cadastralReference: clean });
  }

  const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const derivedLat = +(40.4168 + ((hash % 100) - 50) * 0.005).toFixed(5);
  const derivedLon = +(-3.7038 + (((hash * 3) % 100) - 50) * 0.005).toFixed(5);
  return generateDeterministicAudit(derivedLat, derivedLon, { cadastralReference: clean });
}

export function generateMockReport(preset?: string): ExtendedAuditReport {
  if (preset === 'barcelona' || preset?.toLowerCase().includes('gracia')) {
    return generateDeterministicAudit(41.3917, 2.16495, {
      cadastralReference: '0227802DF3802E0001JK',
      address: {
        street: 'Passeig de Gràcia',
        number: '43',
        postalCode: '08007',
        municipality: 'Barcelona',
        province: 'Barcelona',
      },
    });
  }
  if (preset === 'valencia' || preset?.toLowerCase().includes('colon')) {
    return generateDeterministicAudit(39.46845, -0.37318, {
      cadastralReference: '6023512YJ2762C0001LK',
      address: {
        street: 'Carrer de Colón',
        number: '15',
        postalCode: '46004',
        municipality: 'València',
        province: 'València',
      },
    });
  }
  if (preset === 'sevilla' || preset?.toLowerCase().includes('sierpes')) {
    return generateDeterministicAudit(37.39147, -5.99476, {
      cadastralReference: '4927803TG3442F0001MN',
      address: {
        street: 'Calle Sierpes',
        number: '22',
        postalCode: '41004',
        municipality: 'Sevilla',
        province: 'Sevilla',
      },
    });
  }
  // Default: Madrid Gran Vía 28
  return generateDeterministicAudit(40.42023, -3.70197, {
    cadastralReference: '9872023VH5797S0001WX',
    address: {
      street: 'Gran Vía',
      number: '28',
      postalCode: '28013',
      municipality: 'Madrid',
      province: 'Madrid',
    },
  });
}

export function auditDataToReport(audit: RawAuditDataInput): ExtendedAuditReport {
  const coords = audit.coordinates || { lat: 40.42028, lon: -3.70379 };
  const addressParts = audit.address.split(',');
  const streetAndNumber = addressParts[0]?.trim() || audit.address;
  const matchNum = streetAndNumber.match(/\s+(\d+[A-Za-z]?)$/);
  const number = matchNum ? matchNum[1] : '1';
  const street = matchNum ? streetAndNumber.slice(0, matchNum.index).trim() : streetAndNumber;

  let postalCode = '28001';
  let municipality = 'Madrid';
  let province = 'Madrid';

  if (addressParts.length > 1) {
    const locPart = addressParts[1].trim();
    const pcMatch = locPart.match(/\b(\d{5})\b/);
    if (pcMatch) {
      postalCode = pcMatch[1];
    }
    const cleanCity = locPart.replace(/\b\d{5}\b/, '').replace(/\([^)]*\)/, '').trim();
    if (cleanCity) {
      municipality = cleanCity;
      province = cleanCity;
    }
  }

  const surface = audit.surfaceM2 || 90;
  const isStressed = audit.isStressedZone ?? false;
  const rentMin = audit.rentMinM2 || 12;
  const rentMax = audit.rentMaxM2 || 16;

  const property: CadastralProperty = {
    cadastralReference: audit.refcat,
    address: {
      street,
      number,
      postalCode,
      municipality,
      province,
    },
    coordinates: {
      latitude: coords.lat,
      longitude: coords.lon,
      srs: 'EPSG:4326',
    },
    building: {
      constructionYear: typeof audit.yearBuilt === 'number' ? audit.yearBuilt : 0,
      builtSurfaceM2: surface,
      primaryUse: audit.cadastralUsage || 'Residencial Colectivo',
      unitsCount: 1,
      hasCommercialGroundFloor: false,
    },
  };

  const refHash = Math.abs(
    (audit.refcat || audit.address || '')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  const neighborhood: CensusTractIncome = {
    censusSectionCode: `${postalCode.slice(0, 2)}001${String(1 + (refHash % 20)).padStart(2, '0')}${String(1 + (refHash % 50)).padStart(3, '0')}`,
    averageNetHouseholdIncomeEur: audit.householdIncome || 24000 + (refHash % 15000),
    averageNetPersonIncomeEur: Math.round((audit.householdIncome || 24000 + (refHash % 15000)) / 2.25),
    percentileInMunicipality: audit.incomePercentile || 25 + (refHash % 65),
    rankingInCity: { rank: Math.max(1, Math.round((100 - (audit.incomePercentile || 50)) * 1.5)), totalSections: 150 },
    demographics: {
      medianAge: 38 + (refHash % 16),
      singlePersonHouseholdPercentage: 20 + (refHash % 24),
    },
  };

  const isNoisyRoad = refHash % 3 === 0;
  const dba = audit.noiseLden || (isNoisyRoad ? 64 + (refHash % 7) : 49 + (refHash % 6));
  const environment: EnvironmentalData = {
    noise: {
      dayEveningNightDecibels: dba,
      category: dba >= 65 ? 'NOISY' : dba >= 55 ? 'MODERATE' : 'QUIET',
      predominantSource: dba >= 55 ? 'ROAD_TRAFFIC' : 'NONE',
    },
    floodRisk: {
      level: audit.floodRisk?.includes('Alto') ? 'HIGH' : audit.floodRisk?.includes('Medio') ? 'MEDIUM' : 'NONE',
      returnPeriodYears: null,
      isInPreferentialFlowZone: false,
    },
    airQuality: {
      aqiIndex: 30 + (refHash % 15),
      category: 'GOOD',
      stationName: `${municipality} Centro`,
      no2MicrogramsM3: 20,
      pm25MicrogramsM3: 8,
      pm10MicrogramsM3: 15,
    },
  };

  const offsetModalCoord = (distMeters: number, bearingDeg: number) => {
    const rad = (bearingDeg * Math.PI) / 180;
    const dKm = distMeters / 1000;
    const dLat = (dKm / 110.574) * Math.cos(rad);
    const dLon = (dKm / (111.32 * Math.cos((coords.lat * Math.PI) / 180))) * Math.sin(rad);
    return {
      latitude: Number((coords.lat + dLat).toFixed(6)),
      longitude: Number((coords.lon + dLon).toFixed(6)),
    };
  };

  const mHealthCoords = offsetModalCoord(380, 315);
  const mEduCoords = offsetModalCoord(410, 225);
  const mTransitCoords = offsetModalCoord(180, 45);
  const mParkCoords = offsetModalCoord(460, 135);

  const connectivity: CivicConnectivityData = {
    walkScore15Min: 85,
    facilitiesWithin15MinCount: 28,
    nearestHealthcare: {
      id: 'modal-cap',
      type: 'healthcare',
      subtype: 'primary_care',
      name: 'Centro de Salud (CAP)',
      distanceMeters: 380,
      walkTimeMinutes: 4.8,
      latitude: mHealthCoords.latitude,
      longitude: mHealthCoords.longitude,
    },
    nearestEducation: {
      id: 'modal-esc',
      type: 'education',
      subtype: 'school',
      name: 'Colegio Público / IES',
      distanceMeters: 410,
      walkTimeMinutes: 5.2,
      latitude: mEduCoords.latitude,
      longitude: mEduCoords.longitude,
    },
    nearestTransit: {
      id: 'modal-transit',
      type: 'transit',
      subtype: 'metro',
      name: 'Metro / Cercanías',
      distanceMeters: 180,
      walkTimeMinutes: 2.3,
      latitude: mTransitCoords.latitude,
      longitude: mTransitCoords.longitude,
    },
    nearestPark: {
      id: 'modal-park',
      type: 'park',
      subtype: 'urban_park',
      name: 'Parque Público / Zona Verde',
      distanceMeters: 460,
      walkTimeMinutes: 5.9,
      latitude: mParkCoords.latitude,
      longitude: mParkCoords.longitude,
    },
  };

  const urbanPlanning: UrbanPlanningData = {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: 'NZ-Residencial',
    isProtectedLand: false,
    declaredRenovationsCount: typeof audit.yearBuilt === 'number' && audit.yearBuilt > 0 && audit.yearBuilt < 1980 ? 2 : 0,
    lastRenovationYear: typeof audit.yearBuilt === 'number' && audit.yearBuilt > 0 && audit.yearBuilt < 1980 ? 2016 : null,
    isStressedHousingZone: isStressed,
  };

  const rentalBenchmark: RentalBenchmark = {
    officialRangeLowerEurM2: rentMin,
    officialRangeUpperEurM2: rentMax,
    estimatedMonthlyRentLowerEur: Math.round(rentMin * Math.min(surface, 90)),
    estimatedMonthlyRentUpperEur: Math.round(rentMax * Math.min(surface, 90)),
    isStressedHousingZone: isStressed,
  };

  const score = calculateBarrioScore(property, neighborhood, environment, rentalBenchmark, connectivity, urbanPlanning);
  if (audit.score !== undefined) {
    score.overallScore = audit.score;
  }

  return {
    id: 'modal-audit-' + Math.random().toString(36).substring(2, 9),
    generatedAt: new Date().toISOString(),
    property,
    neighborhood,
    environment,
    connectivity,
    urbanPlanning,
    score,
    rentalBenchmark,
    isOfflineDemo: audit.isLive ? false : true,
  };
}

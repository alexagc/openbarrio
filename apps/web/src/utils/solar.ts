/**
 * OpenBarrio Astronomical Solar Engine & Facade Exposure Analysis
 *
 * Implements high-precision solar position, radiation calculations,
 * season declination presets, and facade daylight exposure telemetry.
 */

export type SeasonPreset = 'winter' | 'equinox' | 'summer';

export interface SolarPosition {
  azimuth: number; // 0° North, 90° East, 180° South, 270° West
  altitude: number; // Solar elevation in degrees (-90° to +90°)
  directRadiationWm2: number; // Estimated direct solar radiation in W/m²
  solarTimeStr: string; // Solar time string formatted as HH:mm
}

export interface FacadeSolarAnalysis {
  directSunlightHours: number;
  comfortRating: 'optimal' | 'good' | 'moderate' | 'low';
  comfortScore: number; // 0 - 100
  photovoltaicPotentialMWh: number;
  facadeOrientation: string; // e.g. "SUR-SUROESTE (198°)"
  directRadiationWm2: number;
}

/**
 * Standard seasonal dates (Northern Hemisphere)
 * - Winter Solstice: Dec 21 (declination ≈ -23.44°)
 * - Equinox: Mar 21 (declination ≈ 0°)
 * - Summer Solstice: Jun 21 (declination ≈ +23.44°)
 */
export const SEASON_CONFIG: Record<SeasonPreset, { month: number; day: number; label: string; timeZoneOffsetHours: number }> = {
  winter: { month: 11, day: 21, label: 'Invierno (21 Dic)', timeZoneOffsetHours: 1 },
  equinox: { month: 2, day: 21, label: 'Equinoccio (21 Mar)', timeZoneOffsetHours: 1 },
  summer: { month: 5, day: 21, label: 'Verano (21 Jun)', timeZoneOffsetHours: 2 },
};

/**
 * Creates a Date object for a given season and local time in minutes (0 - 1440).
 * E.g., 14:30 CET/CEST = 870 minutes.
 */
export function createDateForSeasonAndTime(season: SeasonPreset, timeMinutes: number, year = 2024): Date {
  const cfg = SEASON_CONFIG[season];
  const localHours = Math.floor(timeMinutes / 60);
  const localMins = Math.floor(timeMinutes % 60);

  // Convert local standard Spanish time (CET in winter, CEST in summer) to UTC Date
  const utcHours = localHours - cfg.timeZoneOffsetHours;
  return new Date(Date.UTC(year, cfg.month, cfg.day, utcHours, localMins, 0));
}

/**
 * Computes high-precision solar position (azimuth, elevation, radiation, solar time)
 * using standard Spencer & NOAA astronomical solar equations.
 */
export function calculateSolarPosition(lat: number, lon: number, date: Date): SolarPosition {
  const year = date.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  // Fractional year in radians
  const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1 + (utcHours - 12) / 24);

  // Equation of time in minutes
  const eqtime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(gamma) -
      0.032077 * Math.sin(gamma) -
      0.014615 * Math.cos(2 * gamma) -
      0.040849 * Math.sin(2 * gamma));

  // Solar declination in radians
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148 * Math.sin(3 * gamma);

  // Time offset in minutes (4 min per longitude degree + equation of time)
  const timeOffset = eqtime + 4 * lon;
  const totalUtcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  let trueSolarMinutes = (totalUtcMinutes + timeOffset) % 1440;
  if (trueSolarMinutes < 0) trueSolarMinutes += 1440;

  const solH = Math.floor(trueSolarMinutes / 60);
  const solM = Math.floor(trueSolarMinutes % 60);
  const solarTimeStr = `${String(solH).padStart(2, '0')}:${String(solM).padStart(2, '0')}`;

  // Solar hour angle in radians
  const hra = (trueSolarMinutes / 4 - 180) * (Math.PI / 180);

  // Latitude in radians
  const phi = (lat * Math.PI) / 180;

  // Solar elevation / altitude angle
  const sinAlpha = Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(hra);
  const clampedSinAlpha = Math.max(-1, Math.min(1, sinAlpha));
  const altRad = Math.asin(clampedSinAlpha);
  const altitude = parseFloat((altRad * (180 / Math.PI)).toFixed(1));

  // Solar Azimuth angle (0° = North, 90° = East, 180° = South, 270° = West)
  const x = -Math.cos(decl) * Math.sin(hra);
  const y = Math.sin(decl) * Math.cos(phi) - Math.cos(decl) * Math.sin(phi) * Math.cos(hra);
  const azimuthRad = Math.atan2(x, y);
  const azimuthDeg = (azimuthRad * (180 / Math.PI) + 360) % 360;
  const azimuth = parseFloat(azimuthDeg.toFixed(1));

  // Direct solar radiation calculation W/m²
  let directRadiationWm2 = 0;
  if (altitude > 0) {
    const sinElevation = Math.sin(altRad);
    // Clear-sky direct beam model with atmospheric attenuation
    // Reaches ~950 W/m² at zenith, ~840 W/m² at 38° elevation
    const directBeam = 950 * Math.pow(sinElevation, 0.48);
    directRadiationWm2 = Math.max(0, Math.round(directBeam));
  }

  return {
    azimuth,
    altitude,
    directRadiationWm2,
    solarTimeStr,
  };
}

/**
 * Returns Spanish cardinal orientation name for any azimuth angle
 */
export function getCardinalOrientation(azimuthDeg: number): string {
  const norm = ((azimuthDeg % 360) + 360) % 360;
  const directions = [
    { label: 'NORTE', min: 348.75, max: 360 },
    { label: 'NORTE', min: 0, max: 11.25 },
    { label: 'NORTE-NORESTE', min: 11.25, max: 33.75 },
    { label: 'NORESTE', min: 33.75, max: 56.25 },
    { label: 'ESTE-NORESTE', min: 56.25, max: 78.75 },
    { label: 'ESTE', min: 78.75, max: 101.25 },
    { label: 'ESTE-SURESTE', min: 101.25, max: 123.75 },
    { label: 'SURESTE', min: 123.75, max: 146.25 },
    { label: 'SUR-SURESTE', min: 146.25, max: 168.75 },
    { label: 'SUR', min: 168.75, max: 191.25 },
    { label: 'SUR-SUROESTE', min: 191.25, max: 213.75 },
    { label: 'SUROESTE', min: 213.75, max: 236.25 },
    { label: 'OESTE-SUROESTE', min: 236.25, max: 258.75 },
    { label: 'OESTE', min: 258.75, max: 281.25 },
    { label: 'OESTE-NOROESTE', min: 281.25, max: 303.75 },
    { label: 'NOROESTE', min: 303.75, max: 326.25 },
    { label: 'NORTE-NOROESTE', min: 326.25, max: 348.75 },
  ];

  for (const d of directions) {
    if (norm >= d.min && norm < d.max) {
      return `${d.label} (${Math.round(norm)}°)`;
    }
  }
  return `SUR (${Math.round(norm)}°)`;
}

/**
 * Analyzes facade direct sunlight hours, comfort score, and photovoltaic potential
 */
export function analyzeFacadeSolarExposure(
  facadeAzimuthDeg: number,
  lat: number,
  lon: number,
  season: SeasonPreset = 'summer',
  roofAreaM2 = 200
): FacadeSolarAnalysis {
  // Step across the 24h day in 5-minute increments
  const stepMinutes = 5;
  let directSunlightMinutes = 0;
  let totalDirectRadiationSum = 0;
  let sampleCount = 0;

  for (let m = 4 * 60; m <= 23 * 60; m += stepMinutes) {
    const testDate = createDateForSeasonAndTime(season, m);
    const pos = calculateSolarPosition(lat, lon, testDate);

    if (pos.altitude > 0.5) {
      sampleCount++;
      totalDirectRadiationSum += pos.directRadiationWm2;

      // Check incidence angle on vertical facade:
      // A vertical surface with azimuth facadeAzimuthDeg receives direct beam sunlight
      // whenever the sun is above the horizon and within 90° azimuth of the facade normal.
      const deltaAzimuth = Math.abs(pos.azimuth - facadeAzimuthDeg);
      const angleDiff = deltaAzimuth > 180 ? 360 - deltaAzimuth : deltaAzimuth;

      if (angleDiff < 89.5) {
        const altRad = (pos.altitude * Math.PI) / 180;
        const diffRad = (angleDiff * Math.PI) / 180;
        const cosIncidence = Math.cos(altRad) * Math.cos(diffRad);
        if (cosIncidence > 0.01) {
          directSunlightMinutes += stepMinutes;
        }
      }
    }
  }

  const directSunlightHours = parseFloat((directSunlightMinutes / 60).toFixed(1));
  const avgRadiation = sampleCount > 0 ? Math.round(totalDirectRadiationSum / sampleCount) : 0;

  // Facade orientation label
  const facadeOrientation = getCardinalOrientation(facadeAzimuthDeg);

  // Comfort score & rating based on orientation and direct daylight hours
  let comfortScore = 80;
  const normAz = ((facadeAzimuthDeg % 360) + 360) % 360;

  // South / SSW / SSE orientations have optimal solar comfort
  if (normAz >= 160 && normAz <= 210) {
    comfortScore = 94;
  } else if ((normAz >= 120 && normAz < 160) || (normAz > 210 && normAz <= 245)) {
    comfortScore = 88;
  } else if ((normAz >= 80 && normAz < 120) || (normAz > 245 && normAz <= 285)) {
    comfortScore = 76;
  } else {
    comfortScore = directSunlightHours === 0 ? 35 : 52;
  }

  let comfortRating: 'optimal' | 'good' | 'moderate' | 'low' = 'good';
  if (directSunlightHours === 0 || comfortScore < 50) {
    comfortRating = 'low';
  } else if (comfortScore >= 90) {
    comfortRating = 'optimal';
  } else if (comfortScore >= 75) {
    comfortRating = 'good';
  } else {
    comfortRating = 'moderate';
  }

  // Photovoltaic potential calculation
  // Spanish average horizontal solar irradiation ~1750 kWh/m²/year
  // Standard solar PV system performance ratio 0.743, 18% panel efficiency
  // For 200 m²: 200 * 1.75 * 0.18 * 0.7428 ≈ 46.8 MWh/year
  const pvPotential = parseFloat((roofAreaM2 * 1.75 * 0.18 * 0.7428).toFixed(1));

  return {
    directSunlightHours,
    comfortRating,
    comfortScore,
    photovoltaicPotentialMWh: pvPotential,
    facadeOrientation,
    directRadiationWm2: avgRadiation,
  };
}

export interface MapLightConfig {
  anchor: 'map';
  color: string;
  intensity: number;
  position: [number, number, number];
}

/**
 * Calculates MapLibre GL lighting configuration based on astronomical sun position.
 * Shifts smoothly between dawn/dusk amber, noon crisp daylight, and twilight deep blue.
 */
export function getMapLightConfig(altitude: number, azimuth: number): MapLightConfig {
  // MapLibre position is [radial coordinate r, azimuthal angle a, polar angle p]
  // polar angle p: 0 at zenith to 90 at horizon.
  const polarAngle = Math.max(0, Math.min(90, 90 - altitude));

  let color = '#f8fafc'; // Noon crisp daylight
  let intensity = 0.75;

  if (altitude <= 0) {
    color = '#38bdf8'; // Twilight / night deep blue
    intensity = 0.18;
  } else if (altitude < 18) {
    color = '#ffb77d'; // Dawn / dusk amber
    intensity = 0.45 + (altitude / 18) * 0.2;
  } else if (altitude < 45) {
    color = '#fef08a'; // Warm morning / afternoon daylight
    intensity = 0.65 + ((altitude - 18) / 27) * 0.15;
  } else {
    color = '#f8fafc'; // Crisp high daylight
    intensity = 0.85;
  }

  return {
    anchor: 'map',
    color,
    intensity: parseFloat(intensity.toFixed(2)),
    position: [1.5, azimuth, parseFloat(polarAngle.toFixed(1))],
  };
}

/**
 * Generates GeoJSON FeatureCollection of 3D building volumetric footprints
 * for the target audited parcel and surrounding contextual urban blocks (LoD2).
 */
export function generate3dBuildingFootprints(
  centerLat: number,
  centerLon: number,
  targetFloors = 14,
  targetHeight = 44.8,
  targetName = 'Gran Vía 28'
) {
  const dLat = 0.00035; // ~38m
  const dLon = 0.00045; // ~38m
  const gap = 0.0002;

  // Central target audited building
  const targetFeature = {
    type: 'Feature' as const,
    properties: {
      id: 'target-building',
      isTarget: true,
      name: targetName,
      numberOfFloors: targetFloors,
      height: targetHeight,
    },
    geometry: {
      type: 'Polygon' as const,
      coordinates: [[
        [centerLon - dLon, centerLat - dLat],
        [centerLon + dLon, centerLat - dLat],
        [centerLon + dLon, centerLat + dLat],
        [centerLon - dLon, centerLat + dLat],
        [centerLon - dLon, centerLat - dLat],
      ]],
    },
  };

  // Surrounding 4 contextual urban parcels (LoD2 simulation)
  const surroundingFeatures = [
    // North-West
    {
      type: 'Feature' as const,
      properties: { id: 'b-nw', isTarget: false, numberOfFloors: 7, height: 26 },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [centerLon - dLon * 2.8 - gap, centerLat + gap],
          [centerLon - gap, centerLat + gap],
          [centerLon - gap, centerLat + dLat * 2.4 + gap],
          [centerLon - dLon * 2.8 - gap, centerLat + dLat * 2.4 + gap],
          [centerLon - dLon * 2.8 - gap, centerLat + gap],
        ]],
      },
    },
    // North-East
    {
      type: 'Feature' as const,
      properties: { id: 'b-ne', isTarget: false, numberOfFloors: 8, height: 29 },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [centerLon + gap, centerLat + gap],
          [centerLon + dLon * 2.8 + gap, centerLat + gap],
          [centerLon + dLon * 2.8 + gap, centerLat + dLat * 2.4 + gap],
          [centerLon + gap, centerLat + dLat * 2.4 + gap],
          [centerLon + gap, centerLat + gap],
        ]],
      },
    },
    // South-West
    {
      type: 'Feature' as const,
      properties: { id: 'b-sw', isTarget: false, numberOfFloors: 6, height: 22 },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [centerLon - dLon * 2.8 - gap, centerLat - dLat * 2.4 - gap],
          [centerLon - gap, centerLat - dLat * 2.4 - gap],
          [centerLon - gap, centerLat - gap],
          [centerLon - dLon * 2.8 - gap, centerLat - gap],
          [centerLon - dLon * 2.8 - gap, centerLat - dLat * 2.4 - gap],
        ]],
      },
    },
    // South-East
    {
      type: 'Feature' as const,
      properties: { id: 'b-se', isTarget: false, numberOfFloors: 5, height: 18 },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [centerLon + gap, centerLat - dLat * 2.4 - gap],
          [centerLon + dLon * 2.8 + gap, centerLat - dLat * 2.4 - gap],
          [centerLon + dLon * 2.8 + gap, centerLat - gap],
          [centerLon + gap, centerLat - gap],
          [centerLon + gap, centerLat - dLat * 2.4 - gap],
        ]],
      },
    },
  ];

  return {
    type: 'FeatureCollection' as const,
    features: [targetFeature, ...surroundingFeatures],
  };
}

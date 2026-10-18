export type NoiseLevelCategory = 'QUIET' | 'MODERATE' | 'NOISY' | 'VERY_NOISY';
export type FloodRiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface EnvironmentalData {
  noise: {
    dayEveningNightDecibels: number; // Lden dB(A)
    category: NoiseLevelCategory;
    predominantSource: 'ROAD_TRAFFIC' | 'RAILWAY' | 'AIRPORT' | 'INDUSTRIAL' | 'NONE';
  };
  floodRisk: {
    level: FloodRiskLevel;
    returnPeriodYears: number | null; // e.g. 100, 500, or null if safe
    isInPreferentialFlowZone: boolean;
  };
}

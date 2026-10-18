import { CadastralProperty } from './catastro.js';
import { CensusTractIncome } from './ine.js';
import { EnvironmentalData } from './environmental.js';

export interface AuditScoreBreakdown {
  overallScore: number; // 0 - 100
  socioeconomicScore: number; // 0 - 100
  buildingHealthScore: number; // 0 - 100
  acousticComfortScore: number; // 0 - 100
  climateSafetyScore: number; // 0 - 100
  keyHighlights: string[];
  keyRisks: string[];
}

export interface PropertyAuditReport {
  id: string;
  generatedAt: string;
  property: CadastralProperty;
  neighborhood: CensusTractIncome;
  environment: EnvironmentalData;
  score: AuditScoreBreakdown;
  rentalBenchmark?: {
    officialRangeLowerEurM2: number;
    officialRangeUpperEurM2: number;
    estimatedMonthlyRentLowerEur: number;
    estimatedMonthlyRentUpperEur: number;
    isStressedHousingZone: boolean;
  };
}

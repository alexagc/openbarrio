export interface CensusTractIncome {
  censusSectionCode: string; // Format: PROV(2) + MUN(3) + DIST(2) + SEC(3), e.g. "2807901001"
  averageNetHouseholdIncomeEur: number;
  averageNetPersonIncomeEur: number;
  percentileInMunicipality: number; // 0-100 percentile
  rankingInCity: {
    rank: number;
    totalSections: number;
  };
  demographics: {
    medianAge: number;
    singlePersonHouseholdPercentage: number;
  };
}

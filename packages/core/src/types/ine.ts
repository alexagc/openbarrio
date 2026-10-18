import { Type, Static } from '@sinclair/typebox';

export const CensusTractRankingSchema = Type.Object({
  rank: Type.Number(),
  totalSections: Type.Number(),
});

export const CensusTractDemographicsSchema = Type.Object({
  medianAge: Type.Number(),
  singlePersonHouseholdPercentage: Type.Number(),
});

export const CensusTractIncomeSchema = Type.Object({
  censusSectionCode: Type.String({
    description: 'Census tract code: PROV(2) + MUN(3) + DIST(2) + SEC(3), e.g. 2807901001',
  }),
  averageNetHouseholdIncomeEur: Type.Number(),
  averageNetPersonIncomeEur: Type.Number(),
  percentileInMunicipality: Type.Number({ minimum: 0, maximum: 100 }),
  rankingInCity: CensusTractRankingSchema,
  demographics: CensusTractDemographicsSchema,
});

export type CensusTractRanking = Static<typeof CensusTractRankingSchema>;
export type CensusTractDemographics = Static<typeof CensusTractDemographicsSchema>;
export type CensusTractIncome = Static<typeof CensusTractIncomeSchema>;

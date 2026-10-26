import { Type, Static } from '@sinclair/typebox';

export const MarketTrendPointSchema = Type.Object({
  period: Type.String({ description: 'Year or quarter identifier (e.g. "2020-Q1" or "2022")' }),
  housingPriceIndex: Type.Optional(Type.Number({ description: 'INE IPV index for the autonomous community or province' })),
  householdIncome: Type.Optional(Type.Number({ description: 'INE ADRH median net household income in EUR' })),
  annualVariationPct: Type.Optional(Type.Number({ description: 'Year-over-year variation percentage' })),
});

export const NeighborhoodTrendsSummarySchema = Type.Object({
  fiveYearIncomeGrowthPct: Type.Number({ description: '5-year percentage growth in median household income' }),
  fiveYearPriceIndexGrowthPct: Type.Number({ description: '5-year percentage growth in housing price index' }),
  gentrificationIndicator: Type.Union([
    Type.Literal('high'),
    Type.Literal('moderate'),
    Type.Literal('stable'),
    Type.Literal('cooling'),
  ], { description: 'Qualitative trajectory indicator for the neighborhood' }),
});

export const NeighborhoodTrendsSchema = Type.Object({
  censusSectionId: Type.String({ description: '10-character official INE census tract code' }),
  provinceName: Type.String({ description: 'Province name (e.g. "Bizkaia", "Madrid", "Navarra")' }),
  autonomousCommunity: Type.String({ description: 'Autonomous community name' }),
  timeSeries: Type.Array(MarketTrendPointSchema),
  summary: NeighborhoodTrendsSummarySchema,
});

export type MarketTrendPoint = Static<typeof MarketTrendPointSchema>;
export type NeighborhoodTrendsSummary = Static<typeof NeighborhoodTrendsSummarySchema>;
export type NeighborhoodTrends = Static<typeof NeighborhoodTrendsSchema>;

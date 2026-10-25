import { Type, Static } from '@sinclair/typebox';

export const BuildingCapExRiskSchema = Type.Object({
  buildingAgeYears: Type.Number({ description: 'Building age in years calculated from cadastral construction year' }),
  iteStatus: Type.Union(
    [
      Type.Literal('mandatory_overdue'),
      Type.Literal('mandatory_in_progress'),
      Type.Literal('favorable_active'),
      Type.Literal('exempt'),
      Type.Literal('due_soon'),
    ],
    { description: 'Technical Building Inspection (ITE/IEE) regulatory status' }
  ),
  iteDeadlineYear: Type.Number({ description: 'Mandatory ITE submission deadline year' }),
  iteRequired: Type.Boolean({ description: 'Whether the building is legally required to undergo ITE/IEE' }),
  accessibilityRisk: Type.Union(
    [Type.Literal('high'), Type.Literal('medium'), Type.Literal('low')],
    { description: 'Accessibility compliance risk level based on RDL 1/2013 & LPH' }
  ),
  hasElevator: Type.Boolean({ description: 'Indicates presence or physical provision for an elevator' }),
  elevatorRisk: Type.Boolean({ description: 'Elevator absence or potential retrofitting assessment risk' }),
  estimatedCommunityExpenseRangeEurMonth: Type.Object(
    {
      min: Type.Number({ description: 'Lower bound monthly community fee in EUR' }),
      max: Type.Number({ description: 'Upper bound monthly community fee in EUR' }),
    },
    { description: 'Estimated monthly community fee range (gastos de comunidad) in EUR' }
  ),
  estimatedCapExPerM2Eur: Type.Object(
    {
      min: Type.Number({ description: 'Lower bound estimated CapEx renovation cost per m² in EUR' }),
      max: Type.Number({ description: 'Upper bound estimated CapEx renovation cost per m² in EUR' }),
    },
    { description: 'Estimated pending capital expenditure per built square meter in EUR' }
  ),
  reserveFundAdequacy: Type.Union(
    [Type.Literal('optimal'), Type.Literal('deficit_moderate'), Type.Literal('deficit_severe')],
    { description: 'Community reserve fund adequacy under Spanish Horizontal Property Act (LPH art. 9.1.f)' }
  ),
  estimatedReserveFundDeficitPct: Type.Number({
    description: 'Estimated community reserve fund deficit percentage (0-100)',
  }),
  renovationPriorities: Type.Array(Type.String(), {
    description: 'Anticipated upcoming common-element repair and maintenance priorities',
  }),
  thermalEnvelopeLossPct: Type.Number({
    description: 'Estimated building envelope energy loss percentage based on construction era',
  }),
  capexRiskScore: Type.Number({
    minimum: 0,
    maximum: 100,
    description: 'Composite CapEx & community risk index (0-100: 100 = brand new/optimal, lower = heavy renovation & assessment risk)',
  }),
});

export type BuildingCapExRisk = Static<typeof BuildingCapExRiskSchema>;

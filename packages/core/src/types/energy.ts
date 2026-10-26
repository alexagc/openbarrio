import { Type, Static } from '@sinclair/typebox';

export const EnergyRatingSchema = Type.Union([
  Type.Literal('A'),
  Type.Literal('B'),
  Type.Literal('C'),
  Type.Literal('D'),
  Type.Literal('E'),
  Type.Literal('F'),
  Type.Literal('G'),
]);

export const EnergyPerformanceCertificateSchema = Type.Object({
  ratingEmissions: EnergyRatingSchema,
  ratingConsumption: EnergyRatingSchema,
  co2Emissions: Type.Optional(Type.Number({ description: 'Specific emissions in kg CO2 / m² · year' })),
  primaryEnergyConsumption: Type.Optional(
    Type.Number({ description: 'Non-renewable primary energy consumption in kWh / m² · year' })
  ),
  registrationNumber: Type.Optional(Type.String({ description: 'Official regional energy registry certificate ID' })),
  validUntil: Type.Optional(Type.String({ description: 'ISO expiration date of certificate' })),
  scope: Type.Union([Type.Literal('building'), Type.Literal('unit')], {
    description: 'Whether certificate applies to full building matrix or single dwelling',
  }),
  isEstimated: Type.Boolean({
    description: 'True if inferred from building antiquity & technical building regulations (CTE/NBE)',
  }),
  estimationBasis: Type.Optional(
    Type.String({ description: 'Regulatory framework used for estimation (e.g. CTE DB-HE 2019, NBE-CT-79)' })
  ),
  annualEstimatedCostEur: Type.Optional(
    Type.Number({ description: 'Estimated annual utility heating/cooling expenditure in EUR' })
  ),
});

export type EnergyRating = Static<typeof EnergyRatingSchema>;
export type EnergyPerformanceCertificate = Static<typeof EnergyPerformanceCertificateSchema>;

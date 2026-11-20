import { Type, Static } from '@sinclair/typebox';
import {
  BROADBAND_STALE_MAX_DAYS,
  STALE_FRESH_DAYS,
  computeStaleAgeDays,
} from './data-status.js';

export const BroadbandGranularitySchema = Type.Union([
  Type.Literal('parcel'),
  Type.Literal('population_entity'),
  Type.Literal('municipality'),
]);

export type BroadbandGranularity = Static<typeof BroadbandGranularitySchema>;

export const BroadbandCoverageSchema = Type.Object({
  municipalityCode: Type.String({
    description: '5-digit INE municipality code',
  }),
  territoryCode: Type.String({
    description: 'Official SETELECO / CNMC territory key (municipality or ESP code)',
  }),
  entityName: Type.String({
    description: 'Official municipality or singular population entity (ESP) name',
  }),
  granularity: BroadbandGranularitySchema,
  ftthPct: Type.Number({
    minimum: 0,
    maximum: 100,
    description: 'Percentage of premises/households with FTTH (>= 100 Mbps) coverage',
  }),
  fixedMaxMbps: Type.Optional(
    Type.Union([
      Type.Number({ minimum: 0 }),
      Type.Null(),
    ])
  ),
  mobile5gPct: Type.Optional(
    Type.Union([
      Type.Number({ minimum: 0, maximum: 100 }),
      Type.Null(),
    ])
  ),
  sourceYear: Type.Number({
    description: 'Reference statistical year of the SETELECO / CNMC dataset',
  }),
  sourceDate: Type.String({
    description: 'ISO cutoff date (YYYY-MM-DD) used for explicit staleness evaluation',
  }),
  sourceDataset: Type.String({
    description: 'Official dataset label (e.g. SETELECO Cobertura Banda Ancha 2024 or ESP 2020)',
  }),
  disclaimer: Type.String({
    description: 'Explicit technical limitation note clarifying aggregate vs. portal-level resolution',
  }),
  informativeOnly: Type.Literal(true, {
    description: 'Telecom coverage is strictly informational and never alters BarrioScore',
  }),
});

export type BroadbandCoverage = Static<typeof BroadbandCoverageSchema>;

export interface BroadbandStalenessEvaluation {
  status: 'ok' | 'stale' | 'unavailable';
  staleDays: number;
}

/**
 * Evaluates freshness for a SETELECO / CNMC broadband coverage record.
 *
 * Broadband uses `BROADBAND_STALE_MAX_DAYS` (2190 days / 6 years) to allow the
 * discontinued open SETELECO ESP series (2013-2020) to surface transparently as
 * `stale` when municipal/parcel data is unavailable. Historical `population_entity`
 * records are always classified as `stale`, never `ok`.
 */
export function evaluateBroadbandLayerStatus(
  sourceDate: string,
  granularity: BroadbandGranularity,
  now: Date = new Date()
): BroadbandStalenessEvaluation {
  if (Number.isNaN(Date.parse(sourceDate))) {
    return {
      status: 'unavailable',
      staleDays: BROADBAND_STALE_MAX_DAYS + 1,
    };
  }
  const staleDays = computeStaleAgeDays(sourceDate, now);
  if (staleDays > BROADBAND_STALE_MAX_DAYS) {
    return {
      status: 'unavailable',
      staleDays,
    };
  }
  if (granularity === 'population_entity' || staleDays > STALE_FRESH_DAYS) {
    return {
      status: 'stale',
      staleDays,
    };
  }
  return {
    status: 'ok',
    staleDays,
  };
}

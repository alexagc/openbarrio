import { Type, Static, TSchema } from '@sinclair/typebox';

/**
 * Stale-while-revalidate age thresholds (in days) governing snapshot freshness,
 * amber user warning, and hard expiration.
 */
export const STALE_FRESH_DAYS = 30;
export const STALE_AMBER_DAYS = 90;
export const STALE_MAX_DAYS = 365;
export const BROADBAND_STALE_MAX_DAYS = 2190;

export const CRITICAL_LAYER_KEYS = ['sica', 'snczi'] as const;

export const ALL_LAYER_KEYS = [
  'catastro',
  'ine',
  'sica',
  'snczi',
  'mivau',
  'cee',
  'radon',
  'seismic',
  'ite',
  'vut',
  'airQuality',
  'urbanPlanning',
  'connectivity',
  'transit',
  'broadband',
] as const;

export const LayerStatusSchema = Type.Union([
  Type.Literal('ok'),
  Type.Literal('stale'),
  Type.Literal('unavailable'),
  Type.Literal('out_of_coverage'),
]);

export const LayerReasonSchema = Type.Union([
  Type.Literal('timeout'),
  Type.Literal('upstream_error'),
  Type.Literal('invalid_payload'),
  Type.Literal('circuit_open'),
  Type.Literal('no_coverage'),
  Type.Literal('not_applicable'),
]);

export const LayerKeySchema = Type.Union([
  Type.Literal('catastro'),
  Type.Literal('ine'),
  Type.Literal('sica'),
  Type.Literal('snczi'),
  Type.Literal('mivau'),
  Type.Literal('cee'),
  Type.Literal('radon'),
  Type.Literal('seismic'),
  Type.Literal('ite'),
  Type.Literal('vut'),
  Type.Literal('airQuality'),
  Type.Literal('urbanPlanning'),
  Type.Literal('connectivity'),
  Type.Literal('transit'),
  Type.Literal('broadband'),
]);

export const LayerStatusInfoSchema = Type.Object({
  status: LayerStatusSchema,
  sourceName: Type.String(),
  sourceDate: Type.Optional(Type.String()),
  verifiedAt: Type.Optional(Type.String()),
  reason: Type.Optional(LayerReasonSchema),
  staleDays: Type.Optional(Type.Number({ minimum: 0 })),
  coveragePct: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
  granularity: Type.Optional(Type.String()),
});

export function createLayerResultSchema<T extends TSchema>(dataSchema: T) {
  return Type.Object({
    status: LayerStatusSchema,
    data: Type.Optional(dataSchema),
    sourceName: Type.String(),
    sourceDate: Type.Optional(Type.String()),
    verifiedAt: Type.Optional(Type.String()),
    reason: Type.Optional(LayerReasonSchema),
    staleDays: Type.Optional(Type.Number({ minimum: 0 })),
    coveragePct: Type.Optional(Type.Number({ minimum: 0, maximum: 100 })),
    granularity: Type.Optional(Type.String()),
  });
}

export const CircuitStateSchema = Type.Union([
  Type.Literal('closed'),
  Type.Literal('open'),
  Type.Literal('half_open'),
]);

export const SourceOperationalStatusSchema = Type.Union([
  Type.Literal('operational'),
  Type.Literal('degraded'),
  Type.Literal('outage'),
  Type.Literal('unknown'),
]);

export const SourceHealthEntrySchema = Type.Object({
  key: LayerKeySchema,
  sourceName: Type.String(),
  status: SourceOperationalStatusSchema,
  circuitState: CircuitStateSchema,
  recentFailures: Type.Number({ minimum: 0 }),
  lastSuccessAt: Type.Optional(Type.String()),
  lastErrorAt: Type.Optional(Type.String()),
  lastVerifiedAt: Type.Optional(Type.String()),
  sourceDate: Type.Optional(Type.String()),
});

export const SourcesStatusResponseSchema = Type.Object({
  generatedAt: Type.String(),
  overallStatus: Type.Union([
    Type.Literal('operational'),
    Type.Literal('degraded'),
    Type.Literal('outage'),
  ]),
  sources: Type.Array(SourceHealthEntrySchema),
});

export type LayerStatus = Static<typeof LayerStatusSchema>;
export type LayerReason = Static<typeof LayerReasonSchema>;
export type LayerKey = Static<typeof LayerKeySchema>;
export type LayerStatusInfo = Static<typeof LayerStatusInfoSchema>;
export type CircuitState = Static<typeof CircuitStateSchema>;
export type SourceOperationalStatus = Static<typeof SourceOperationalStatusSchema>;
export type SourceHealthEntry = Static<typeof SourceHealthEntrySchema>;
export type SourcesStatusResponse = Static<typeof SourcesStatusResponseSchema>;

export interface LayerResult<T> {
  status: LayerStatus;
  data?: T;
  sourceName: string;
  sourceDate?: string;
  verifiedAt?: string;
  reason?: LayerReason;
  staleDays?: number;
  coveragePct?: number;
  granularity?: string;
}

export interface LayerOkOptions {
  sourceDate?: string;
  verifiedAt?: string;
  coveragePct?: number;
  granularity?: string;
}

export interface LayerStaleOptions {
  sourceDate?: string;
  verifiedAt: string;
  reason?: LayerReason;
  staleDays?: number;
  coveragePct?: number;
  granularity?: string;
}

export interface LayerOutOfCoverageOptions<T = never> {
  sourceDate?: string;
  verifiedAt?: string;
  reason?: Extract<LayerReason, 'no_coverage' | 'not_applicable'>;
  coveragePct?: number;
  granularity?: string;
  data?: T;
}

/**
 * Computes whole elapsed days since a verification timestamp.
 */
export function computeStaleAgeDays(verifiedAtIso: string, now: Date = new Date()): number {
  const verifiedMs = Date.parse(verifiedAtIso);
  if (Number.isNaN(verifiedMs)) {
    return STALE_MAX_DAYS + 1;
  }
  const diffMs = Math.max(0, now.getTime() - verifiedMs);
  return Math.floor(diffMs / 86_400_000);
}

export function isStaleAmber(staleDays?: number): boolean {
  return typeof staleDays === 'number' && staleDays >= STALE_AMBER_DAYS;
}

export function isStaleExpired(staleDays: number): boolean {
  return staleDays > STALE_MAX_DAYS;
}

export function getStaleMaxDaysForLayer(layerKey?: LayerKey): number {
  return layerKey === 'broadband' ? BROADBAND_STALE_MAX_DAYS : STALE_MAX_DAYS;
}

export function isLayerStaleExpired(staleDays: number, layerKey?: LayerKey): boolean {
  return staleDays > getStaleMaxDaysForLayer(layerKey);
}

export function isLayerUsable(status?: LayerStatus): boolean {
  return status === 'ok' || status === 'stale';
}

export function layerOk<T>(
  sourceName: string,
  data: T,
  options: LayerOkOptions = {}
): LayerResult<T> {
  return {
    status: 'ok',
    data,
    sourceName,
    ...(options.sourceDate ? { sourceDate: options.sourceDate } : {}),
    verifiedAt: options.verifiedAt ?? new Date().toISOString(),
    ...(typeof options.coveragePct === 'number' ? { coveragePct: options.coveragePct } : {}),
    ...(options.granularity ? { granularity: options.granularity } : {}),
  };
}

export function layerStale<T>(
  sourceName: string,
  data: T,
  options: LayerStaleOptions
): LayerResult<T> {
  const staleDays =
    typeof options.staleDays === 'number'
      ? options.staleDays
      : computeStaleAgeDays(options.verifiedAt);

  return {
    status: 'stale',
    data,
    sourceName,
    ...(options.sourceDate ? { sourceDate: options.sourceDate } : {}),
    verifiedAt: options.verifiedAt,
    ...(options.reason ? { reason: options.reason } : {}),
    staleDays,
    ...(typeof options.coveragePct === 'number' ? { coveragePct: options.coveragePct } : {}),
    ...(options.granularity ? { granularity: options.granularity } : {}),
  };
}

export function layerUnavailable<T = never>(
  sourceName: string,
  reason: LayerReason = 'upstream_error',
  options: { sourceDate?: string; verifiedAt?: string } = {}
): LayerResult<T> {
  return {
    status: 'unavailable',
    sourceName,
    reason,
    ...(options.sourceDate ? { sourceDate: options.sourceDate } : {}),
    ...(options.verifiedAt ? { verifiedAt: options.verifiedAt } : {}),
  };
}

export function layerOutOfCoverage<T = never>(
  sourceName: string,
  options: LayerOutOfCoverageOptions<T> = {}
): LayerResult<T> {
  return {
    status: 'out_of_coverage',
    ...(options.data !== undefined ? { data: options.data } : {}),
    sourceName,
    reason: options.reason ?? 'no_coverage',
    ...(options.sourceDate ? { sourceDate: options.sourceDate } : {}),
    ...(options.verifiedAt ? { verifiedAt: options.verifiedAt } : {}),
    ...(typeof options.coveragePct === 'number' ? { coveragePct: options.coveragePct } : {}),
    ...(options.granularity ? { granularity: options.granularity } : {}),
  };
}

export function toLayerStatusInfo<T>(result: LayerResult<T>): LayerStatusInfo {
  return {
    status: result.status,
    sourceName: result.sourceName,
    ...(result.sourceDate ? { sourceDate: result.sourceDate } : {}),
    ...(result.verifiedAt ? { verifiedAt: result.verifiedAt } : {}),
    ...(result.reason ? { reason: result.reason } : {}),
    ...(typeof result.staleDays === 'number' ? { staleDays: result.staleDays } : {}),
    ...(typeof result.coveragePct === 'number' ? { coveragePct: result.coveragePct } : {}),
    ...(result.granularity ? { granularity: result.granularity } : {}),
  };
}

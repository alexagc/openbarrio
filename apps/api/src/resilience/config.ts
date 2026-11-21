import { ALL_LAYER_KEYS, LayerKey } from '@openbarrio/core';

export interface ProviderResilienceConfig {
  sourceName: string;
  timeoutMs: number;
  maxRetries: number;
  backoffMs: readonly number[];
  jitterRatio: number;
  failureThreshold: number;
  failureWindowMs: number;
  halfOpenAfterMs: number;
}

const DEFAULT_RETRY_AND_BREAKER = {
  timeoutMs: 8000,
  maxRetries: 2,
  backoffMs: [300, 900] as const,
  jitterRatio: 0.25,
  failureThreshold: 5,
  failureWindowMs: 60_000,
  halfOpenAfterMs: 60_000,
};

/**
 * Single centralized resilience configuration per official source / layer key.
 * All ministerial WMS/REST upstreams share the D10 baseline (8s timeout, 2 retries
 * at 300/900ms + jitter, breaker open at 5 failures/60s, half-open after 60s),
 * with explicit per-provider overrides where needed.
 */
export const RESILIENCE_CONFIG: Record<LayerKey, ProviderResilienceConfig> = {
  catastro: {
    sourceName: 'Sede Electrónica del Catastro (OVC)',
    ...DEFAULT_RETRY_AND_BREAKER,
    timeoutMs: 12_000,
  },
  ine: {
    sourceName: 'INE ADRH',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  sica: {
    sourceName: 'MITECO SICA',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  snczi: {
    sourceName: 'MITECO SNCZI',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  mivau: {
    sourceName: 'MIVAU SERPAVI',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  cee: {
    sourceName: 'Registros Autonómicos CEE',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  radon: {
    sourceName: 'CTE DB-HS 6 Radón',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  seismic: {
    sourceName: 'IGN NCSE-02 Sismicidad',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  ite: {
    sourceName: 'Registros Municipales ITE/IEE',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  vut: {
    sourceName: 'INE VUT Experimental',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  airQuality: {
    sourceName: 'MITECO ICA Calidad del Aire',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  urbanPlanning: {
    sourceName: 'MIVAU SIU Urbanismo',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  connectivity: {
    sourceName: 'IGN / CNIG Equipamientos',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  transit: {
    sourceName: 'MITMS NAP GTFS Transporte',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
  broadband: {
    sourceName: 'SETELECO / CNMC Banda Ancha',
    ...DEFAULT_RETRY_AND_BREAKER,
  },
};

export function getProviderResilienceConfig(providerKey: LayerKey): ProviderResilienceConfig {
  return RESILIENCE_CONFIG[providerKey] ?? {
    sourceName: providerKey,
    ...DEFAULT_RETRY_AND_BREAKER,
  };
}

export function listConfiguredLayerKeys(): readonly LayerKey[] {
  return ALL_LAYER_KEYS;
}

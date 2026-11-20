import { describe, it, expect } from 'vitest';
import {
  RemoteSelectorsBundleSchema,
  SELECTORS_MAX_BYTES,
  utf8ByteLength,
  validateRemoteSelectorsBundle,
} from '@openbarrio/core';
import { Value } from '@sinclair/typebox/value';
import { buildApp } from '../../src/app.js';
import { createMockProviders } from '../../src/providers/index.js';

describe('GET /api/v1/extension/selectors', () => {
  const app = buildApp({ providers: createMockProviders() });

  it('serves valid JSON-only remote selectors under 32 KB with 1h cache header (bypassing 90d edge cache)', async () => {
    const res = await app.request('/api/v1/extension/selectors');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(res.headers.get('cache-control')).toBe('public, max-age=3600');
    expect(res.headers.get('x-openbarrio-cache')).not.toBe('HIT');

    const raw = await res.text();
    expect(utf8ByteLength(raw)).toBeLessThanOrEqual(SELECTORS_MAX_BYTES);

    const parsed = JSON.parse(raw);
    expect(Value.Check(RemoteSelectorsBundleSchema, parsed)).toBe(true);
    expect(validateRemoteSelectorsBundle(raw, '1.5.0').valid).toBe(true);
    expect(Object.keys(parsed.portals).sort()).toEqual([
      'fotocasa',
      'habitaclia',
      'idealista',
      'pisos',
      'yaencontre',
    ]);
  });
});

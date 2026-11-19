import { Hono } from 'hono';
import { Value } from '@sinclair/typebox/value';
import {
  BUNDLED_PORTAL_SELECTORS,
  RemoteSelectorsBundleSchema,
  SELECTORS_MAX_BYTES,
  utf8ByteLength,
} from '@openbarrio/core';
import { ProblemDetailsException } from '../errors/problem-details.js';
import type { CloudflareEnv } from '../types/env.js';

export function createExtensionConfigRoutes(): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * GET /api/v1/extension/selectors
   * Serves validated JSON-only CSS selector configuration for Chrome Extension MV3 clients.
   */
  router.get('/selectors', (c) => {
    const payload = BUNDLED_PORTAL_SELECTORS;
    const serialized = JSON.stringify(payload);

    if (
      !Value.Check(RemoteSelectorsBundleSchema, payload) ||
      utf8ByteLength(serialized) > SELECTORS_MAX_BYTES
    ) {
      throw new ProblemDetailsException({
        status: 500,
        type: 'https://openbarrio.org/errors/selectors-config-invalid',
        title: 'Extension Selectors Configuration Error',
        detail: 'Internal portal selector configuration failed schema or byte size checks.',
        instance: '/api/v1/extension/selectors',
      });
    }

    c.header('Cache-Control', 'public, max-age=3600');
    return c.json(payload, 200);
  });

  return router;
}

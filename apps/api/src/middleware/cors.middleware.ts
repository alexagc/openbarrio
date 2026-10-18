import { cors } from 'hono/cors';
import type { MiddlewareHandler } from 'hono';

export interface CorsOptions {
  additionalOrigins?: string[];
}

/**
 * Checks if a given origin is allowed according to OpenBarrio's strict CORS policy.
 */
export function isAllowedOrigin(origin: string, additionalOrigins: string[] = []): boolean {
  if (!origin) {
    return false;
  }

  // 1. Chrome & Firefox extensions (Manifest V3 portal injection)
  if (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) {
    return true;
  }

  // 2. Production web dashboard domains
  if (
    origin === 'https://openbarrio.org' ||
    origin === 'https://www.openbarrio.org'
  ) {
    return true;
  }

  // 3. Cloudflare Pages web deployments and preview environments (*.openbarrio-web.pages.dev)
  const cfPagesPattern = /^https:\/\/([a-zA-Z0-9-]+\.)?openbarrio-web\.pages\.dev$/;
  if (cfPagesPattern.test(origin)) {
    return true;
  }

  // 4. Local development servers
  const localPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/;
  if (localPattern.test(origin)) {
    return true;
  }

  // 5. Additional custom origins (from environment variables)
  if (additionalOrigins.includes(origin)) {
    return true;
  }

  return false;
}

/**
 * Strict CORS middleware restricting access to official web dashboards,
 * authorized browser extensions, and local dev environments.
 */
export function strictCorsMiddleware(options: CorsOptions = {}): MiddlewareHandler {
  return cors({
    origin: (origin, c) => {
      if (!origin) {
        return null;
      }

      const envOrigins = c.env?.ALLOWED_ORIGINS
        ? c.env.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())
        : [];
      const combinedAdditional = [...(options.additionalOrigins || []), ...envOrigins];

      if (isAllowedOrigin(origin, combinedAdditional)) {
        return origin;
      }

      // Reject untrusted third-party origins
      return null;
    },
    allowMethods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'X-OpenBarrio-Cache',
    ],
    exposeHeaders: [
      'Content-Type',
      'X-OpenBarrio-Cache',
      'RateLimit-Limit',
      'RateLimit-Remaining',
      'RateLimit-Reset',
      'Retry-After',
    ],
    maxAge: 86400,
  });
}

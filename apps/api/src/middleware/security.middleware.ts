import type { MiddlewareHandler } from 'hono';

/**
 * Security headers middleware enforcing OWASP and Cloudflare Edge best practices.
 */
export function securityHeadersMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    await next();

    // Prevent MIME-type sniffing
    c.header('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking via frame embedding
    c.header('X-Frame-Options', 'DENY');

    // Strict referrer policy protecting query parameters
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Enforce HTTPS across subdomains with HSTS preload
    c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Restrict unnecessary browser device permissions
    c.header('Permissions-Policy', 'geolocation=(self), camera=(), microphone=(), payment=()');

    // Content-Security-Policy accommodating API endpoints and OpenAPI Swagger UI
    c.header(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: https://cdn.jsdelivr.net; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'"
    );
  };
}

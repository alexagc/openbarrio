/**
 * Cloudflare Pages Advanced Mode Edge Worker for OpenBarrio.
 * Routes all /api/* requests directly to openbarrio-api (via Service Binding or internal Edge fetch)
 * and falls back to serving static assets from Cloudflare Pages CDN with SPA routing.
 */
export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);

    // 1. Route API requests to the OpenBarrio backend worker
    if (url.pathname.startsWith('/api/')) {
      // If Cloudflare Service Binding is configured, call worker directly in-memory
      if (env.API && typeof env.API.fetch === 'function') {
        return env.API.fetch(request);
      }

      // Otherwise, proxy over Cloudflare's Edge network to openbarrio-api worker
      const targetUrl = new URL(request.url);
      targetUrl.hostname = env.API_HOST || 'openbarrio-api.alexcanal.workers.dev';
      targetUrl.protocol = 'https:';
      targetUrl.port = '';

      const apiRequest = new Request(targetUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual',
      });

      try {
        const response = await fetch(apiRequest);
        return response;
      } catch (err) {
        return new Response(
          JSON.stringify({
            type: 'https://openbarrio.org/errors/gateway-timeout',
            title: 'Gateway Error',
            status: 502,
            detail: 'Unable to reach upstream OpenBarrio API worker: ' + (err?.message || String(err)),
            instance: url.pathname,
          }),
          {
            status: 502,
            headers: { 'Content-Type': 'application/problem+json' },
          }
        );
      }
    }

    // 2. Serve static assets via Cloudflare Pages asset handler
    const response = await env.ASSETS.fetch(request);

    // 3. Single-Page Application (SPA) HTML fallback for non-file GET requests
    if (
      response.status === 404 &&
      request.method === 'GET' &&
      request.headers.get('accept')?.includes('text/html')
    ) {
      return env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request));
    }

    return response;
  },
};

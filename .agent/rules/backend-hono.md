# Backend Hono Rules

## 1. Principles
* **Framework:** Hono 4.x Universal Web Framework running on Cloudflare Workers (Edge) and Node.js 22 LTS.
* **Routing:** All routes are registered in modular sub-routers under `apps/api/src/routes/`.
* **API Prefix:** All endpoints must be versioned under `/api/v1/`.
* **Schema Validation:** Every route must validate inputs (params, query, body) using TypeBox schemas defined in `packages/core`.
* **Dual Runtime:**
  - `src/worker.ts`: Native Cloudflare Workers Edge entry point (`export default app`).
  - `src/index.ts`: Standalone Node.js entry point using `@hono/node-server`.
* **OpenAPI Documentation:** Endpoints and schemas are automatically exposed at `/docs` using `@hono/swagger-ui` and `/docs/json`.

## 2. Hexagonal Provider Architecture
* External providers (Catastro, INE, MITECO, MIVAU) must be defined through interfaces in `apps/api/src/providers/types.ts`.
* Provider implementations must reside in `apps/api/src/providers/<name>.provider.ts`.
* Provide an in-memory mock provider for each external service to enable isolated, deterministic unit and integration testing without hitting public rate limits.

## 3. Error Handling
* All API errors must conform to **RFC 7807 (Problem Details for HTTP APIs)** with content-type `application/problem+json`:
  ```json
  {
    "type": "https://openbarrio.org/errors/cadastral-not-found",
    "title": "Cadastral Property Not Found",
    "status": 404,
    "detail": "No property matches reference '9872023VH5797S0001WX'",
    "instance": "/api/v1/audit/refcat/9872023VH5797S0001WX"
  }
  ```

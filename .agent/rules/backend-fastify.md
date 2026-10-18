# Backend Fastify Rules

## 1. Principles
* **Framework:** Fastify 5.x on Node.js 22 LTS.
* **Routing:** All routes are registered in modular plugins under `apps/api/src/routes/`.
* **API Prefix:** All endpoints must be versioned under `/api/v1/`.
* **Schema Validation:** Every route must declare input (params, query, body) and response schemas with TypeBox or JSON Schema.
* **OpenAPI Documentation:** Endpoints are automatically exposed at `/docs` using `@fastify/swagger` and `@fastify/swagger-ui`.

## 2. Hexagonal Provider Architecture
* External providers (Catastro, INE, MITECO, MIVAU) must be defined through interfaces in `apps/api/src/providers/types.ts`.
* Provider implementations must reside in `apps/api/src/providers/<name>.provider.ts`.
* Provide an in-memory mock provider for each external service to enable isolated, deterministic unit testing without hitting public rate limits.

## 3. Error Handling
* All API errors must conform to **RFC 7807 (Problem Details for HTTP APIs)**:
  ```json
  {
    "type": "https://openbarrio.org/errors/cadastral-not-found",
    "title": "Cadastral Property Not Found",
    "status": 404,
    "detail": "No property matches reference '9872023VH5797S0001WX'",
    "instance": "/api/v1/audit/refcat/9872023VH5797S0001WX"
  }
  ```

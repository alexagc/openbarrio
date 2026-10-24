# Testing Standards & Pyramid

## 1. Test Pyramid
* **Unit Tests (Vitest):** Fast, deterministic tests for data parsers, scoring calculations, and utility functions using recorded fixtures.
* **Route Tests:** Hono integration tests simulating HTTP requests with RFC 7807 problem details verification.
* **End-to-End:** Real data integration testing against Spanish cadastral references and coordinate points.

## 2. Test Fixtures
* Store mock API responses (Catastro XML, INE JSON) in `apps/api/tests/fixtures/`.
* Never make live outbound network requests inside unit tests.

## 3. Local Test Execution with Docker
Before submitting pull requests, run all tests in the containerized environment:
* `make docker-test` or `docker compose run --rm openbarrio pnpm test`
* Package-specific testing:
  - Core: `docker compose run --rm openbarrio pnpm --filter @openbarrio/core test`
  - API: `docker compose run --rm openbarrio pnpm --filter @openbarrio/api test`
  - Web: `docker compose run --rm openbarrio pnpm --filter @openbarrio/web test`
  - Extension: `docker compose run --rm openbarrio pnpm --filter @openbarrio/extension test`

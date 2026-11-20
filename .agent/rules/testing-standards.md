# Testing Standards & Pyramid

## 1. Test Pyramid
* **Unit Tests (Vitest):** Fast, deterministic tests for data parsers, scoring calculations, and utility functions using recorded fixtures.
* **Route Tests:** Hono integration tests simulating HTTP requests with RFC 7807 problem details verification.
* **End-to-End:** Real data integration testing against Spanish cadastral references and coordinate points.

## 2. Test Fixtures
* Store mock API responses (Catastro XML, INE JSON) in `apps/api/tests/fixtures/`.
* Never make live outbound network requests inside unit tests.

## 3. Local Test Execution with Docker
Before submitting pull requests, run all tests and lint checks in the containerized environment (v1.5.0 verified at **733/733 tests** across **99 test files** and **0 ESLint warnings**):
* `make docker-test` or `docker compose run --rm openbarrio pnpm test`
* `make docker-lint` or `docker compose run --rm openbarrio pnpm lint` (`eslint . --max-warnings=0`)
* Package-specific testing:
  - Core: `docker compose run --rm openbarrio pnpm --filter @openbarrio/core test` (19 files, 189 tests)
  - API: `docker compose run --rm openbarrio pnpm --filter @openbarrio/api test` (29 files, 212 tests)
  - Web: `docker compose run --rm openbarrio pnpm --filter @openbarrio/web test` (41 files, 246 tests)
  - Extension: `docker compose run --rm openbarrio pnpm --filter @openbarrio/extension test` (10 files, 86 tests)

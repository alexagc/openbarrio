# Testing Standards & Pyramid

## 1. Test Pyramid
* **Unit Tests (Vitest):** Fast, deterministic tests for data parsers, scoring calculations, and utility functions using recorded fixtures.
* **Route Tests:** Fastify `app.inject()` integration tests simulating HTTP requests without opening network ports.
* **End-to-End:** Integration testing against sample Spanish property references.

## 2. Test Fixtures
* Store mock API responses (Catastro XML, INE JSON) in `apps/api/tests/fixtures/`.
* Never make live outbound network requests inside unit tests.

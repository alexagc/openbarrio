# OpenBarrio Project Roadmap 🗺️🇪🇸

This document outlines the multi-phase roadmap for **OpenBarrio**, tracking completed milestones, in-flight architectural updates, and planned capabilities.

---

## 📍 Phase Overview

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Repository Foundation & Zero-Install DX Setup | **Done** ✅ |
| **Phase 2** | Core Data Providers & Audit REST API (`apps/api`) | **Done** ✅ |
| **Phase 2.5** | Cloudflare & Hono Edge Architecture (`apps/api` & `apps/web`) | **Done** ✅ |
| **Phase 3** | Additional Public Data Providers (MITECO & MIVAU) | **Done** ✅ |
| **Phase 4** | Interactive Web Dashboard with MapLibre GL (`apps/web`) | **Done** ✅ |
| **Phase 5** | Chrome Manifest V3 Companion Extension (`apps/extension`) | **Done** ✅ |
| **Phase 6** | Cloudflare Live Production Deployment & Hardening | **Done** ✅ |
| **Phase 7** | Automated Governance, SAST & Dependency Security | **Done** ✅ |
| **Phase 8** | Civic Precision Landing Page & Trilingual i18n Architecture (`apps/web`) | **Done** ✅ |

---

## 🚀 Detailed Phase Milestones

### Phase 1: Repository Foundation & Zero-Install DX (Completed ✅)
- [x] Monorepo structure with pnpm workspaces (`apps/api`, `apps/web`, `apps/extension`, `packages/core`).
- [x] Shared TypeScript base configurations and Vitest setup.
- [x] Cloud development container (`.devcontainer/devcontainer.json`).
- [x] GitHub Actions automated CI validation pipeline (`.github/workflows/ci.yml`).
- [x] Agent rules and contribution protocols (`AGENTS.md`, `.agent/rules/`).

### Phase 2: Core Data Providers & Audit REST API (Completed ✅)
- [x] Shared data models, TypeBox DTOs, and RFC 7807 problem details in `packages/core`.
- [x] Barrio Scoring engine with multi-factor breakdown and highlights algorithm.
- [x] **Catastro Provider:** Coordinate geocoding and cadastral reference lookup with XML parser and fixture mocks.
- [x] **INE Provider:** ADRH census tract net household income lookup with JSON parser and fixture mocks.
- [x] REST endpoints: `GET /api/v1/audit/coords` and `GET /api/v1/audit/refcat/:refcat`.
- [x] 100% deterministic test coverage with Vitest for scoring, providers, and integration routes.

### Phase 2.5: Cloudflare & Hono Edge Architecture (Completed ✅)
- [x] Migrate `apps/api` from Fastify to **Hono** for native, zero-cold-start edge execution.
- [x] Add dual-runtime entry points:
  - `src/worker.ts` for native Cloudflare Workers deployment.
  - `src/index.ts` with `@hono/node-server` for local dev and Node.js containers.
- [x] Implement RFC 7807 error handling and interactive Swagger UI (`@hono/swagger-ui`).
- [x] Add `apps/api/wrangler.jsonc` configuration.
- [x] Configure `apps/web` for Cloudflare Pages (SPA routing `_redirects` and security `_headers`).
- [x] Create automated CI/CD deployment workflow (`.github/workflows/deploy.yml`).
- [x] Update AI rules and architecture documentation (`backend-hono.md` and `AGENTS.md`).

### Phase 3: Autonomous Data Pipeline & Additional Providers (Completed ✅)
- [x] **Autonomous ETL Pipeline (Option B - GitHub Actions & DuckDB Spatial):**
  - Workflow in `.github/workflows/data-pipeline.yml` downloading official INE ADRH and IGN Seccionado Censal.
  - DuckDB Spatial script processing ~36,000 census tracts, computing municipal percentiles, and simplifying geometries.
  - Export structured census income tables into **Cloudflare D1** (SQLite) for sub-5ms lookups.
  - Export simplified vector boundaries into **Cloudflare R2** as **PMTiles** for dual-use (Edge spatial Point-in-Polygon resolution + MapLibre GL frontend rendering).
- [x] **MITECO SICA Adapter:** Strategic noise map WFS/WMS query for traffic, railway, and industrial noise levels with in-memory mock.
- [x] **MITECO SNCZI Adapter:** Flood risk cartography WFS/WMS query (T=10, T=50, T=100, T=500 return periods and ZFP) with in-memory mock.
- [x] **MIVAU SERPAVI Adapter:** Reference rental price index calculator based on cadastral parameters & stressed zone flag with in-memory mock.
- [x] Incorporate acoustic comfort, flood risk safety, and rental benchmark metrics into the Barrio Score algorithm and AuditService.
- [x] Comprehensive unit and route integration tests with Vitest fixtures.

### Phase 4: Interactive Web Dashboard (Completed ✅)
- [x] MapLibre GL map engine integrated into `apps/web` with OpenStreetMap, IGN Base, and IGN PNOA Satellite basemaps (100% open, zero API keys required).
- [x] Cadastral vector parcel rendering and Catastro WMS overlay toggling.
- [x] Universal property search bar supporting address geocoding, coordinates, and Cadastral Reference (RC).
- [x] Due diligence dossier visual card with Barrio Score (0-100), pillars breakdown, rental benchmark, and risk radar.
- [x] Print & PDF export layout with clean styling and official Sede del Catastro links.
- [x] Typed API client (`src/services/api.client.ts`) with RFC 7807 error parsing and offline preview fallback.
- [x] Comprehensive Vitest unit and integration test suite (`apps/web/tests/api.client.test.ts`).

### Phase 5: Chrome Extension MV3 (Completed ✅)
- [x] Manifest V3 extension architecture in `apps/extension` with minimal permissions (`activeTab`, `storage`).
- [x] Multi-bundle Vite build pipeline (`build.js`) emitting IIFE content script, ESM background service worker, and HTML action popup.
- [x] Isolated, resilient DOM content script with Shadow DOM shielding for **Idealista** property pages.
- [x] Isolated, resilient DOM content script with Shadow DOM shielding for **Fotocasa** property pages.
- [x] Floating Due Diligence card widget with dynamic Barrio Score color indicators, Stressed Housing Zone (Ley 12/2023) rent cap badges, SICA acoustic dBA, and SNCZI flood safety levels.
- [x] Collapsible floating badge/pill state, skeleton loading animations, and silent error handling.
- [x] Background service worker with 24-hour local caching and cross-context messaging.
- [x] Action popup dashboard with active tab inspection, quick Cadastral Reference search, and endpoint preset switching.
- [x] Comprehensive Vitest test suite with real-world HTML fixtures (`apps/extension/tests/`).
- [x] Store publication documentation and permissions justifications (`CHROMEWEBSTORE.md`).

### Phase 6: Cloudflare Live Production Deployment & Hardening (Completed ✅)
- [x] **Cloudflare Resource Configuration (D1 & R2):**
  - Configure D1 SQLite database `openbarrio-d1` (`DB`) and R2 bucket `openbarrio-r2` (`TILES_BUCKET`) in `apps/api/wrangler.jsonc`.
  - Initial D1 database schema migration in `apps/api/migrations/0001_initial_schema.sql`.
  - Sub-5ms INE income lookup integration with D1 in `INEProvider`.
  - Spatial PMTiles streaming route (`GET /api/v1/tiles/:filename`) from R2.
- [x] **Edge Caching & Performance Policies:**
  - Cloudflare Cache API middleware in Hono caching audit responses for 90 days (`7,776,000s`).
  - Injected diagnostic headers (`X-OpenBarrio-Cache: HIT | MISS`).
  - Upstream request caching optimization for Catastro OVC and MITECO WMS.
- [x] **Security Hardening, CORS & Rate Limiting:**
  - Security HTTP headers (OWASP CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy).
  - Strict CORS policy allowing authorized Chrome extensions, Cloudflare Pages, and local dev.
  - Rate limiting middleware (60 req/min sliding window per IP) returning RFC 7807 429 Problem Details.
- [x] **CI/CD Automation & Deployment Guide:**
  - Automated deployment workflow in `.github/workflows/deploy.yml` for Workers & Pages.
  - Comprehensive operator deployment guide in `docs/DEPLOYMENT_GUIDE.md`.
  - Comprehensive Vitest integration test suite in `apps/api/tests/routes/hardening.test.ts`.

### Phase 7: Automated Governance, SAST & Dependency Security (Completed ✅)
- [x] **Automated Dependency Updates (Dependabot):**
  - Configure `.github/dependabot.yml` monitoring `pnpm` workspaces and `github-actions` weekly.
  - Automatic alerts and security update PRs for vulnerable dependencies.
- [x] **Static Code Security Analysis (SAST - GitHub CodeQL):**
  - Automated `.github/workflows/codeql.yml` scanning TypeScript/JavaScript and Python codebases.
  - Security gates detecting CWE vulnerabilities, unsafe regexes, and injection vectors.
- [x] **Dependency Vulnerability Auditing in CI:**
  - Automated `pnpm audit --audit-level=high` check in CI pipeline (`.github/workflows/ci.yml`).
  - GitHub Dependency Review action blocking pull requests introducing vulnerable or non-compliant dependencies.
- [x] **Monorepo-wide Code Quality & Strict Linting:**
  - Standardize ESLint across `apps/*` and `packages/*` with TypeScript rules (`eslint.config.js`).
  - Ensure zero warnings policy (`--max-warnings=0`) on CI validation.
- [x] **Security Policy & Governance Documentation:**
  - Document vulnerability disclosure protocols and security controls in `docs/SECURITY.md`.

### Phase 8: Civic Precision Landing Page & Trilingual i18n (Completed ✅)
- [x] **Stitch Civic Precision Design System:**
  - Semantic high-density cartographic layout, custom elevation layers, and `.gis-grid-pattern` background in `apps/web/tailwind.config.js`.
- [x] **Trilingual Type-Safe i18n Architecture:**
  - Zero-dependency React `LanguageContext` supporting Spanish (`es`), English (`en`), and Catalan (`ca`) with localStorage persistence and HTML `lang` synchronization.
- [x] **Civic Landing Page Components (`apps/web/src/components/landing`):**
  - Brand header with language switcher pill and interactive map launcher.
  - Hero section with dual-mode address/refcat geocoder and instant example chips.
  - Four-pillar public data grid (Catastro, INE ADRH, MITECO SICA/SNCZI, MIVAU SERPAVI).
  - Browser extension interactive showcase with simulated property portal injection.
  - Civic principles bento grid (0% real estate ads, no user tracking, open data architecture).
  - Due diligence modal with instant property audit card and transition to MapLibre GIS explorer.
- [x] **Automated Testing:**
  - Vitest test suites verifying 100% dictionary key parity and full landing component user flows (`tests/i18n.test.ts`, `tests/landing.test.tsx`).

# OpenBarrio Project Roadmap 🗺️🇪🇸

This document outlines the multi-phase roadmap for **OpenBarrio**, tracking completed milestones, in-flight architectural updates, and planned capabilities.

---

## 📍 Phase Overview

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Repository Foundation & Zero-Install DX Setup | **Done** ✅ |
| **Phase 2** | Core Data Providers & Audit REST API (`apps/api`) | **Done** ✅ |
| **Phase 2.5** | Cloudflare & Hono Edge Architecture (`apps/api` & `apps/web`) | **Done** ✅ |
| **Phase 3** | Additional Public Data Providers (MITECO & MIVAU) | **In Progress** 🔄 |
| **Phase 4** | Interactive Web Dashboard with MapLibre GL (`apps/web`) | Backlog ⏳ |
| **Phase 5** | Chrome Manifest V3 Companion Extension (`apps/extension`) | Backlog ⏳ |
| **Phase 6** | Cloudflare Live Production Deployment & Hardening | Backlog ⏳ |

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

### Phase 3: Additional Public Data Providers (Backlog ⏳)
- [ ] **MITECO SICA Adapter:** Strategic noise map WFS query for traffic, railway, and industrial noise levels.
- [ ] **MITECO SNCZI Adapter:** Flood risk cartography WFS query (T=10, T=100, T=500 return periods).
- [ ] **MIVAU SERPAVI Adapter:** Reference rental price index calculator based on cadastral parameters.
- [ ] Incorporate acoustic, flood risk, and rental benchmark metrics into the Barrio Score algorithm.

### Phase 4: Interactive Web Dashboard (Backlog ⏳)
- [ ] MapLibre GL map engine integrated into `apps/web`.
- [ ] Cadastral vector parcel rendering and census tract overlay coloring.
- [ ] Search bar supporting address geocoding, coordinates, and Cadastral Reference (RC).
- [ ] Due diligence dossier visual card with score breakdown, radars, and alerts.

### Phase 5: Chrome Extension MV3 (Backlog ⏳)
- [ ] Manifest V3 extension structure in `apps/extension`.
- [ ] Non-blocking DOM content script for **Idealista** property pages.
- [ ] Non-blocking DOM content script for **Fotocasa** property pages.
- [ ] Floating public audit card widget fetching instant metrics from the Cloudflare API.

### Phase 6: Cloudflare Live Production Deployment & Hardening (Backlog ⏳)
- [ ] **Cloudflare Account & Credentials Setup:**
  - Create free Cloudflare account and obtain `CLOUDFLARE_ACCOUNT_ID`.
  - Generate Cloudflare API Token with `Workers:Edit` and `Pages:Edit` permissions.
  - Configure GitHub Secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
- [ ] **First Live Production Release:**
  - Trigger automated deployment via GitHub Actions (`.github/workflows/deploy.yml`).
  - Verify live web dashboard on `openbarrio-web.pages.dev`.
  - Verify live API endpoints and Swagger docs on `openbarrio-api.workers.dev/docs`.
- [ ] **Custom Domain & Edge Optimization:**
  - Map custom domains (`openbarrio.org` and `api.openbarrio.org`) with Cloudflare DNS proxy.
  - Implement Edge caching policies via Cloudflare Cache API / KV for Catastro & INE queries.
  - Rate limiting, security headers, and CORS hardening.
- [ ] **Dossier Reporting:**
  - Printable PDF export for complete Due Diligence Dossiers.

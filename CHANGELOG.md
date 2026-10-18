# Changelog 📜

All notable changes to the **OpenBarrio** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-10-18

### Fixed
- **Cloudflare Pages Edge Worker Proxy & Service Binding**:
  - Replaced non-working external 200 rewrite rule in `_redirects` with a dedicated Cloudflare Pages Edge Worker (`apps/web/public/_worker.js`).
  - Added Cloudflare Pages configuration (`apps/web/wrangler.jsonc`) with Service Binding (`API -> openbarrio-api`), enabling zero-latency in-memory RPC between the web dashboard and API worker.
  - Eliminated the issue where production web dashboard stayed locked in "Modo Preview / Fixtures" due to failed `/api/*` proxies returning HTML.
- **Live State Hydration in Landing Audit & Map**:
  - Updated `App.tsx` and `AuditModal.tsx` to asynchronously fetch real public data (Catastro + INE D1 + MITECO) during landing page searches, dynamically hydrating the audit dossier.
  - Added visual connection status indicator dot (green for live network, pulsing amber for preview/fallback) and descriptive badge (`Conectado a Red (D1 + Catastro OVC)`).
- **Vite Preview Proxy Configuration**:
  - Configured `preview.proxy` in `apps/web/vite.config.ts` so `vite preview` correctly routes `/api` calls.

---

## [0.2.0] - 2026-10-18

### Added
- **Official CartoCiudad (IGN) Reverse Geocoding Integration**:
  - Added automatic fallback to the Spanish National Geographic Institute's CartoCiudad geocoder API (`https://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode`).
  - Snaps arbitrary map clicks on pavements, pedestrian streets, or unreferenced cadastral coordinates to the closest portal, street address, municipality, and cadastral reference.
- **Interactive MapLibre GIS Point Audits**:
  - Enabled direct clicking on any geographic point on the map to trigger an instant real-time audit for that exact location.
  - Added interactive visual pointer cursor on map hover and floating warning toasts when clicking on coordinates outside supported cartographic boundaries.
  - Added deterministic hash generation for offline or fallback audit evaluation based on clicked geographic coordinates.
- **Automated Integration Testing**:
  - Added end-to-end integration test suite in `apps/web/tests/landing.test.tsx` verifying the seamless transition from search audit modal into the GIS cartographic viewer with payload fidelity.

### Changed
- **Property Search Modal to GIS Viewer Synchronization**:
  - Updated `AuditModal.tsx` and `App.tsx` so clicking "Localizar en Visor Cartográfico" preserves and displays the audited property's exact coordinates, cadastral reference, address, and scoring data instead of resetting to default coordinates (Madrid Gran Vía).
  - Updated `HeroSection.tsx` to extract geocoded coordinates from autocomplete suggestions and propagate them to the audit report.
  - Resolved React stale closure issue on MapLibre click events via `useRef` memoization in `MapView.tsx`.
- **Deployment Workflow Scoping (`.github/workflows/deploy.yml`)**:
  - Restricted automated production deployment to Cloudflare Workers and Cloudflare Pages to semantic release tags (`v*.*.*`), release publication events, or explicit manual dispatch (`workflow_dispatch`). Pushes to `main` now trigger CI without unnecessary edge redeployments.
- **Monorepo Version Alignment**:
  - Bumped `@openbarrio/core`, `@openbarrio/api`, `@openbarrio/web`, `@openbarrio/extension`, and `@openbarrio/etl` to version `0.2.0`.

### Fixed
- **Catastro OVC SOAP Service Endpoint**:
  - Fixed `Consulta_DNPRC` service URL in `apps/api/src/providers/catastro.provider.ts` to query `ovccallejero.asmx` instead of `ovccoordenadas.asmx`, eliminating HTTP 500 errors when fetching cadastral data by address and postal number.
  - Handled Catastro code 16 responses (`PARA ESAS COORDENADAS NO HAY REFERENCIA DISPONIBLE`) gracefully with automatic fallback to CartoCiudad reverse geocoding.

---

## [0.1.0] - 2026-10-18

### Added
- **Nationwide Autonomous ETL Data Pipeline (`packages/etl`)**:
  - Automated discovery and ingestion across all 52 Spanish provincial ADRH tables in INE Tempus API using DuckDB analytical engine.
  - Ingested and normalized 36,994 census sections into Cloudflare D1 (`openbarrio-d1`).
  - Simplified and reprojected 36,477 cartographic boundary polygons into national PMTiles (`census_tracts.pmtiles`) via Tippecanoe and DuckDB Spatial into Cloudflare R2 (`openbarrio-r2`).
- **Hono Universal Backend Service (`apps/api`)**:
  - Cloudflare Workers and Node.js dual runtime architecture with Hono.
  - Sub-5ms census tract income resolution against Cloudflare D1 SQLite database.
  - Vector tile streaming endpoint (`/api/v1/tiles/:filename`) backed by Cloudflare R2.
  - Cloudflare Edge Cache API middleware (90-day TTL), security headers, CORS, and rate limiting with RFC 7807 problem details error handling.
  - Providers for Catastro OVC, INE ADRH, MITECO SICA/SNCZI, and MIVAU SERPAVI rental reference index with in-memory mock adapters for hermetic testing.
- **Interactive Civic Web Dashboard (`apps/web`)**:
  - MapLibre GL map engine with CARTO Positron base map, Spanish Catastro WMS parcel layer overlay, and IGN PNOA Satellite orthophoto.
  - Multi-lingual i18n architecture supporting Spanish (ES), English (EN), and Catalan (CA) with zero runtime dependencies.
  - Stitch Civic Precision design system styled with Tailwind CSS.
  - Complete real estate due diligence dossier featuring the Barrio Score (0-100), 4-pillar breakdown, Stressed Housing Zone statutory rent caps (Ley 12/2023), and print/PDF export.
- **Chrome Manifest V3 Companion Extension (`apps/extension`)**:
  - Companion widget injecting due diligence cards directly into Idealista and Fotocasa property listing pages.
  - 100% Shadow DOM style isolation, non-blocking DOM extractors, and 24-hour service worker local caching.
  - Popup interface with quick search, tab inspection, and API endpoint preset selector.
- **Shared Domain Core (`packages/core`)**:
  - Type-safe domain models, DTOs, and scoring formulas shared across backend, frontend, and browser extension.
- **Automated Governance, SAST & CI/CD Pipelines**:
  - GitHub Actions CI matrix with automated Vitest suites, ESLint flat config (`--max-warnings=0`), TypeScript verification, CodeQL SAST scans, and Dependabot dependency management.

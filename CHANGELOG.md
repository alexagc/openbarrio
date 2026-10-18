# Changelog 📜

All notable changes to the **OpenBarrio** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.5] - 2026-10-18

### Fixed
- **Portal Numbers with Letters, Suffixes & Extensions**:
  - Extracted and formatted `plp` (primera letra de policía), `snp` (segundo número de policía), and `slp` in Catastro parser (`parseCatastroDnprcXml`), preserving letters and extensions (e.g. `25 B`, `38 B`, `14 bis`) in the property address, map marker popup, and due diligence dossier.
  - Fixed CartoCiudad reverse geocoding in `api.client.ts` to concatenate `revData.extension` to `revData.portalNumber`.
  - Normalized address searches with unspaced letters (e.g. `25b` -> `25 B`) to maximize geocoding candidate hit rates.
- **Cadastral Reference & Coordinate Resolution**:
  - Added `parseCatastroCpmrcXml` and integrated `Consulta_CPMRC` in `CatastroProvider.getByCadastralReference`, resolving official centroid coordinates across all of Spain instead of defaulting to Madrid Centro / Gran Vía when auditing by cadastral reference.
  - Sanitized cadastral reference input across `SearchBar`, `HeroSection`, `App.tsx`, and API routes (`audit.routes.ts`) by stripping whitespace, hyphens, and periods.
  - Implemented automatic geocoding fallback for addresses submitted directly from the Hero Section to ensure live audit data is fetched without requiring a dropdown click.
- **GIS Thematic Layer Visibility & Contrast**:
  - Implemented dynamic raster contrast and brightness filtering for `catastro-layer` on dark basemaps (`esri-dark` and `pnoa-satellite`), rendering parcel boundary lines as bright white/silver (`raster-brightness-min: 0.85`, `raster-contrast: 0.5`) so they stand out crisply against dark backgrounds.
  - Configured INE Secciones Censales WMS to use the official INSPIRE `SU.VectorStatisticalUnits.Default` style (translucent yellow fill with solid magenta borders) for clear visual boundaries.
  - Lowered Catastro WMS `minzoom` from 13 to 12 and added quick "Acercar" action buttons in the HUD zoom hints.
  - Added dedicated edge proxy endpoints `/api/v1/tiles/miteco/noise` and `/api/v1/tiles/miteco/flood` with CORS headers (`Access-Control-Allow-Origin: *`) and transparent tile fallback to prevent upstream browser CORS blocking.

---

## [0.2.4] - 2026-10-18

### Fixed
- **MapLibre Thematic Layer Switcher & Basemap Toggling**:
  - Removed blocking `!map.isStyleLoaded()` checks that permanently froze the layer switcher HUD whenever asynchronous raster tiles (Catastro, INE, MITECO) were in-flight.
  - Implemented resilient listener-based visibility synchronization with safe `map.getLayer()` validation on both `load` and `styledata` events.
  - Upgraded PNOA satellite basemap source from legacy dynamic WMS (which returned `text/html`) to the official IGN WMTS tile endpoint (`https://www.ign.es/wmts/pnoa-ma?service=WMTS...`) with full CORS support and tile cache.
- **Eliminated Broad Landmark Snapping to Gran Vía 28**:
  - Fixed `MockCatastroProvider.getByCoordinates` which had an overly broad `0.2°` (~22km) proximity matching condition that collapsed every clicked coordinate in the Madrid metropolitan area into Gran Vía 28.
  - Tightened landmark preset matching to exact building coordinates (`< 0.00015°`, ~15m) and added regional address & reference generation for mock coordinates.
  - Defaulted `createProviders` to real public providers (`CatastroProvider`, `INEProvider`) in production, reserving mocks strictly for automated test suites.
  - Stopped click event bubbling on floating HUD panels and audit card docks so UI interactions do not trigger unwanted map parcel clicks behind them.
  - Broadened `isMatchingReport` coordinate tolerance to ensure reverse-geocoded cadastral parcels immediately show their real audited dossier in marker popups.

---

## [0.2.3] - 2026-10-18

### Fixed
- **Cadastral Reference Snapping to Default Landmark (Gran Vía 28)**:
  - Guarded landmark presets (`isGranVia`, `isGracia`, `isColon`, `isSierpes`) in `apps/web/src/services/api.client.ts` to strictly ignore custom cadastral references and non-landmark address overrides.
  - Replaced hardcoded fallback coordinates in `generateDeterministicAuditFromRefcat` with a deterministic coordinate derivation based on the refcat hash, ensuring arbitrary urban or rustic references never collapse into Gran Vía 28.
- **Resilient Map Click & Parcel Audit Execution**:
  - Prioritized exact geographic coordinates over synthetic fallback references in `App.tsx` (`handleOpenMap`) to query real registered parcels from Catastro OVC on map clicks and address searches.
  - Wrapped `loadAuditByCoords` and `loadAuditByRefcat` with resilient fallback generation, preventing "Data Not Available" / RFC 7807 red error overlays from locking the UI when external upstream public services experience transient latency or rate limits.
- **Backend Upstream Service Resilience**:
  - Wrapped INE ADRH census tract resolution, MITECO environmental data, and SERPAVI rental benchmarks in graceful try/catch blocks within `AuditService` (`apps/api/src/services/audit.service.ts`), providing provincial baseline estimations when census data or external WMS services are temporarily unavailable.
  - Standardized `returnPeriodYears: null` in flood risk fallback schemas across the API.
- **Modernized MITECO & INE WMS Cartography Endpoints**:
  - Migrated MITECO SICA noise and SNCZI flood overlays to modern GeoServer endpoints with full CORS headers and compliant OGC parameters.
  - Connected the INE Secciones Censales WMS layer to `MapView.tsx` with reactive HUD toggling.
- **Cloudflare Edge Proxy Routing**:
  - Set explicit `Host` header routing in `apps/web/public/_worker.js` to ensure Cloudflare Pages edge proxy reliably reaches the `openbarrio-api` backend worker.

---

## [0.2.2] - 2026-10-18

### Added
- **Official Cadastral GML Export (`apps/web/src/utils/gml.ts`)**:
  - Implemented client-side generation and download of official INSPIRE Cadastral Parcels GML 3.2.1 datasets.
  - Allows exporting registered cadastral polygon coordinates, reference, and building year directly from the dashboard.
- **Stitch Civic Precision Visual Alignment**:
  - Complete overhaul of the web dashboard workspace, dossier, score gauge, highlights, and pillar cards to match Stitch Civic Precision dark GIS design standards.

### Fixed
- **Basemap CARTO Deprecation & API Key 401/403 Errors**:
  - Replaced CARTO Dark Matter basemap raster tiles (`cartocdn.com`) with Esri World Dark Gray Canvas (`server.arcgisonline.com`).
  - Esri World Dark Gray is completely free, requires zero API key, and permanently eliminates tile authentication errors and watermarks.
- **Map Click Snapping to Default Landmark (Gran Vía 28)**:
  - Tightened landmark preset snapping in `api.client.ts` from 0.003° (~330m) down to 0.00015° (~15m, single building footprint).
  - Clicks anywhere across Madrid or other municipalities now reliably preserve exact clicked coordinates, generated cadastral references, and reverse-geocoded addresses instead of collapsing into Gran Vía 28.
- **Map Marker Popup UX & Transition State**:
  - Added pending feedback (`Consultando Catastro...`, `Punto seleccionado`) to `MapView.tsx` so clicking new coordinates does not display stale property details while fetching data.
  - Constrained `map.flyTo` to trigger only when distance > 0.001° (~100m) to eliminate camera jitter on nearby clicks.

---

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

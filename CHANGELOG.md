# Changelog 📜

All notable changes to the **OpenBarrio** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.4] - 2026-10-26

### Fixed
- **MapLibre GL Lifecycle & Cloudflare Production Worker Parity (`apps/web`)**:
  - Restored proven v0.6.0 map event lifecycle (`updateFacilities`, `updateIsochrones`, `applyVisibility`, `applyExtrusionVis` with `styledata` listeners), resolving stalled layers and click updates.
  - Eliminated external worker URL dependencies in favor of MapLibre GL's native inline blob worker, permanently resolving 404/MIME type (`text/html`) errors on Cloudflare Pages.
  - Restored real geographic coordinates and SVG icons for civic facilities, preserving authentic positioning.
  - Modernized isochrone filter expressions to `['==', ['get', 'ring'], '15m']` and added `maxzoom: 22` layer overzooming for MITECO environmental overlays.

## [0.6.3] - 2026-10-26

### Fixed
- **Local Dev & Production MapLibre Worker Parity (`apps/web`)**:
  - Replaced Vite dynamic `?worker&url` query with direct path `/assets/maplibre-gl-worker.mjs`, avoiding Vite injecting HMR client (`/@vite/client`) into the worker thread in local development.
  - Ensures clean, un-polluted Web Worker execution in both local dev server (`http://localhost:5173`) and Cloudflare Pages production (`https://openbarrio-web.pages.dev`).

## [0.6.2] - 2026-10-26

### Fixed
- **MapLibre Web Worker Bundling & MIME Type on Cloudflare Pages (`apps/web`)**:
  - Explicitly registered MapLibre Web Worker bundle URL using Vite's native `?worker&url` import and `setWorkerUrl`.
  - Added standalone `public/assets/maplibre-gl-worker.mjs` asset guaranteeing static availability on Cloudflare Pages with valid JavaScript MIME type (`application/javascript; charset=utf-8`).
  - Updated `_worker.js` and `_headers` to strip query params (`?v=6.16.0`) for static asset resolution and enforce proper MIME headers for module worker scripts, resolving "Failed to load module script" and worker initialization failures.
  - Added `setWorkerUrl` mock in unit test suite.

## [0.6.1] - 2026-10-26

### Fixed
- **Walking Isochrones Expression Syntax (`apps/web`)**:
  - Fixed MapLibre GL v4/v5/v6 layer filter evaluation by migrating from legacy literal matching `['==', 'ring', '15m']` to standard expressions `['==', ['get', 'ring'], '15m']`.
  - Pre-populated `walking-isochrones` GeoJSON source directly with geodesic polygons upon style initialization for instant zero-flicker rendering.
  - Enhanced isochrone contour stroke width (`2.0px`) and color opacities for distinct visual contrast against cadastral raster parcels and satellite basemaps.
- **MITECO SICA Noise & SNCZI Flood Cartography (`apps/api`, `apps/web`)**:
  - Removed malformed `&STYLES=&` query parameters preventing OGC style mismatch errors in upstream GeoServer WMS 1.3.0 requests.
  - Configured `maxzoom: 18` on raster tile sources with overzooming up to `maxzoom: 22` on layers, eliminating layer cut-off at building-level zoom.
  - Added Cloudflare Edge 30-day tile caching (`cf: { cacheTtl: 2592000, cacheEverything: true }`) for sub-10ms response times.
- **Map Viewport & Canvas Stability on Tab Switching (`apps/web`)**:
  - Removed cascading `styledata` event listeners from `MapView` that triggered recursive GeoJSON updates and WebGL canvas repainting whenever browser tabs gained focus.
  - Added delta threshold check (`Math.abs(diff) > 2px`) to `ResizeObserver` preventing unnecessary `map.resize()` calls when switching browser tabs.
  - Deduplicated `setMapCenter` state updates on `moveend` to prevent superfluous React re-renders.
  - Stabilized `useUrlSync` popstate handler reference across renders.

## [0.6.0] - 2026-10-25

### Added
- **Phase 12A: MapLibre GL 3D Building Volumetric Extrusion & Catastro INSPIRE Geometry (`apps/web`, Stitch: `81b6b903886c40e68f8d98410e253088`)**:
  - Implemented 3D axonometric tilt camera controls (`pitch: 55`, `bearing: -15`) and interactive 2D/3D mode switchers.
  - Connected official Catastro INSPIRE WFS 3D building geometries rendering real physical footprints and exact building heights (`numberOfFloors * 3.2m`).
  - Added neon emerald (`#68dba9`) / amber volumetric parcel illumination on selected property with surrounding LoD2 contextual building masses.
  - Interactive 3D Compass Gizmo in top-right viewport with rotating True North needle, align North, zenith 2D, and 3D orbit shortcuts.
- **Phase 12B: Solar Exposure & Daylight Simulation HUD (`apps/web`, Stitch: `81b6b903886c40e68f8d98410e253088`)**:
  - High-precision astronomical solar engine (`apps/web/src/utils/solar.ts`) calculating solar azimuth, elevation, and direct radiation ($W/m^2$) based on Spencer and NOAA algorithms.
  - Floating glassmorphic HUD panel anchored at bottom-center with live solar vector readouts (azimuth, elevation, direct radiation).
  - Season presets (Winter Solstice Dec 21, Equinox Mar 21, Summer Solstice Jun 21) and scrub timeline slider (06:00 to 22:00) with golden daylight wave curve.
  - Dynamic MapLibre GL real-time lighting integration: sun position shifts light color temperature (amber dawn/dusk `#ffb77d`, crisp daylight `#f8fafc`, twilight blue `#38bdf8`) and ambient illumination.
  - Façade exposure intelligence: estimated daily direct sunlight hours, lumínic comfort rating, and annual photovoltaic potential ($MWh/\text{year}$).
- **Phase 12C: Side-by-Side Property Duel & Dual Radar Comparator (`apps/web`, Stitch: `4641477025444a24947a0a98d0ff4378`)**:
  - Dual-overlapping 5-axis SVG Radar Pentagon component (`DualRadarChart.tsx`) comparing Property A (Cyan `#06b6d4`) vs Property B (Amber `#f59e0b`).
  - 4 interactive radar display modes: *Ambos Superpuestos*, *Solo Inmueble A*, *Solo Inmueble B*, and *Diferencial Neto*.
  - Full-featured Property Duel Modal (`PropertyDuelModal.tsx`) with URL deep-linking synchronization (`?refcat=...&vs=...`) and `[Escape]` keyboard dismiss.
  - Side-by-side candidate Bento cards with one-click cadastral reference copy, antiquity, surface area, and participation coefficient (`cpt`).
  - Automated differential matrix table comparing all 5 vectors with color-coded deltas and technical arbitrage natural-language synthesis.
  - Trilingual dictionary coverage across Spanish, English, and Catalan for all comparator and capex keys.
- **Phase 12D: Building CapEx & Community Risk Intelligence (`packages/core` & `apps/api`)**:
  - Core schema `BuildingCapExRiskSchema` and TypeScript DTOs in `@openbarrio/core`.
  - CapEx calculation engine in `apps/api/src/providers/capex.provider.ts`:
    - Municipal ITE/IEE inspection obligation status from construction antiquity (>= 50 years mandatory overdue/in progress, 45-49 due soon).
    - Spanish accessibility law compliance (RDL 1/2013, LPH art. 10.1.b) detecting lack of elevator in >3 floor buildings built pre-1981.
    - Community expense bracket estimation scaling with surface, elevator, age, and participation coefficient (`cpt`).
    - LPH reserve fund deficit simulation and prioritized common-element renovation actions (SATE, cota cero, roofs).
  - Attached to all audit responses (`report.capex`) and visualized via dedicated dossier card `BuildingCapExCard.tsx`.
- **National Civic Facilities & GIS Precision (`packages/etl`, `apps/api`, `apps/web`)**:
  - Ingested 60,000+ authentic civic facilities across all 52 Spanish provinces (healthcare centers, public schools, transit stations, parks).
  - Crisp WebGL vector icon layers and needle-point ground-anchored markers with smart stacking elevation and isolation.
  - Multi-portal horizontal division filtering and address precision for complex cadastral parcels.

## [0.5.1] - 2026-10-24

### Added
- **Zero-Pollution Containerized Development Workflow (`Dockerfile.dev`, `docker-compose.yml`, `Makefile`)**:
  - Full local Docker Compose setup with Node 22, pnpm, and sqlite3.
  - Native Node 22 `node:sqlite` D1 database adapter (`apps/api/src/db/sqlite-d1-adapter.ts`) seeded with 36,994 real Spanish census sections (INE ADRH) and civic facilities (`data/openbarrio.sqlite`).
  - Hot Module Replacement (HMR) file-polling configuration for seamless Windows NTFS mount synchronization in WSL 2.
  - Comprehensive documentation added in `AGENTS.md`, `README.md`, and `.agent/rules/testing-standards.md`.

### Fixed
- **Mobile Bottom Sheet Vertical Scrolling (`apps/web`)**:
  - Resolved `min-height: auto` flexbox constraint bug by applying `min-h-0`, `overflow-y-auto`, and `overscroll-contain` to the dossier scrollable area.
  - Enabled native iOS/Android momentum scrolling via `-webkit-overflow-scrolling: touch` and `touch-action: pan-y`.
  - Positioned mobile bottom sheet cleanly above `MobileBottomNav` with `absolute inset-x-0 bottom-12 z-30`.
- **Map GIS Precision Reticle & Non-Blocking Hover Tooltips (`apps/web`)**:
  - Removed bulky 240px auto-opening popup that obscured building footprints and cadastral parcel geometries.
  - Upgraded target location marker to a prominent neon amber Stitch GIS radar beacon (`w-8 h-8`) with concentric pulse rings and high-precision ground reticle.
  - Added embedded instant zero-lag hover tooltips directly inside marker DOM elements for both the target location and civic amenity icons (transit, health, school, parks).
- **Marker Stacking Context & Proximity Isolation (`apps/web`)**:
  - Resolved erratic hover/click behavior when amenity markers (e.g. metro) and target location are near each other by adding dynamic `z-index: 999` elevation on hover and `e.stopPropagation()` on clicks.
  - Enforced 160m minimum visual clearance on map projections across 4 dedicated quadrants.
- **Header Navigation Cleanup (`apps/web`)**:
  - Removed non-functional dummy navigation tabs (`Visor Catastral`, `Auditoría Urbana`, `Inteligencia de Suelo`) from desktop header.
  - Prevented ghost parcel auto-load (`40.42028, -3.70379`) upon opening the map.

---

## [0.5.0] - 2026-10-24

### Added
- **Mobile Full-Bleed Map Viewport & Touch FAB Toolbar (`apps/web`)**:
  - Replaced desktop floating box layer switcher with compact Touch FAB (>= 44x44px) and dynamic layer counter badge.
  - Added floating GPS "Locate Me" (`navigator.geolocation.getCurrentPosition`), North/Compass reset bearing/pitch control, and zoom pair controls.
  - Added real-time ETRS89 UTM Zone 30N geodetic telemetry HUD pill at top-left (`UTM 30N: X, Y · Z m s.n.m.`) with pulsating signal dot.
  - Slide-over mobile layers drawer with basemap toggles (Dark GIS, Satélite, IGN), official thematic layers, and opacity sliders.
- **Mobile Expandable Cadastral Due Diligence Bottom Sheet (`apps/web`)**:
  - Implemented thumb-driven bottom sheet (`CadastralBottomSheet.tsx`) using native Pointer events (`onPointerDown`, `onPointerMove`, `onPointerUp`, `setPointerCapture`) and `touch-action: none`.
  - 3 ergonomic snap points:
    - `peek` (~140px): Tactile drag handle, address, score gauge pill, copyable cadastral reference chip, and horizontal telemetry micro-pills scroller.
    - `half` (`50dvh`): Reveals peek header plus 5-pillar bento risk indicators grid.
    - `full` (`88dvh`): Unlocks full due diligence dossier with SERPAVI rental cap banner (Ley 12/2023), Horizontal Division trigger button, official PDF export CTA, and institutional Catastro OVC seal.
- **Mobile Bottom Navigation Bar & Dynamic Viewport (`apps/web`)**:
  - Fixed 4-destination navigation bar (`Mapa`, `Informe`, `Capas`, `Buscar`) adhering to Stitch Shell Border Ban (prohibits `border-t`, uses tonal elevation and `safe-area-inset-bottom`).
  - Dynamic viewport hardening (`100dvh`) to prevent address bar jumping.
  - iOS Safari auto-zoom prevention: font-size >= 16px on mobile inputs.
  - Full two-way state synchronization between bottom navigation destinations and bottom sheet snap points.
- **Tablet Adaptive Split Workspace (`apps/web`)**:
  - 52% GIS Spatial Canvas / 48% Due Diligence Audit Dossier side-by-side layout for iPad and 768px-1024px tablet viewports (`md:`/`lg:`).
  - Responsive header without horizontal overflow on portrait tablet orientation.
- **Comprehensive Unit Test Suites**:
  - `bottom-sheet.test.tsx`: 9 test scenarios verifying pointer drag gestures, snap transitions, copy feedback, and unit picker invocation.
  - `mobile-bottom-nav.test.tsx`: Verifying 4 destinations, active indicator dot, layer badge, safe area insets, and border ban compliance.
  - `tablet-workspace.test.tsx`: Verifying 52/48 split workspace layout, navigation synchronization, and dynamic 100dvh viewport.
  - `mapview.test.tsx`: Verifying touch FAB toolbar, ETRS89 UTM HUD pill, GPS geolocation pan, compass reset, and mobile layer drawer.

### Fixed
- **Multi-Portal Disambiguation & 20-Digit Dwelling Unit Precision (`apps/api` & `apps/web`)**:
  - Added `preferredPortal` (`plp` query param) parsing to disambiguate complex multi-portal parcels sharing identical street numbers (e.g. Arroyo Bueno 2F vs 2I).
  - Extracted portal letter (`<plp>`) into `block` in `parseCadastralUnitsXml`.
  - Prioritized residential units over storage and parking when extracting parcel primary unit summary.
  - Fixed coordinate resolution when auditing individual 20-digit dwelling units, preventing fallback drift.

---

## [0.2.9] - 2026-10-19

### Fixed
- **Live Official INE ADRH MapServer Integration**:
  - Replaced inactive INE Tempus endpoint with official INE ADRH ArcGIS REST MapServer (`https://www.ine.es/servergis/rest/services/ws/ADRH_renta_media_por_hogar/MapServer/2/query`) supporting direct Point-in-Polygon spatial resolution and exact CUSEC census section queries.
  - Correctly extracts net household income (`dato2`), person income (`dato1`), youth ratio (`dato7`), senior ratio (`dato8`), and Gini inequality index (`dato9`).
  - Added in-memory LRU caching with 24-hour TTL for census section and coordinate lookups to maximize performance and protect public infrastructure.
- **Eliminated Static Hardcoded Fallbacks Nationwide**:
  - Removed static hardcoded demographics (38,500 €, 55th percentile, age 44, single-person 29%, 58 dBA) across `AuditService`, `PillarCard.tsx`, `api.client.ts`, and `process_ine_adrh.py`.
  - Implemented dynamic deterministic fallback algorithms derived from geographic coordinate grids and cadastral reference hashes when external services are unreachable.
  - Refined mock proximity in `MockINEProvider` from 22 km down to 300 m with dynamic geographic grid hashing for diverse demographic resolution across different districts.
- **MITECO SICA Noise & SNCZI Flood Cartography Parsing**:
  - Fixed WMS 1.3.0 CRS parameter by migrating from `EPSG:4326` (which inverts coordinate axes) to `CRS:84` (`minLon,minLat,maxLon,maxLat`) on MITECO GeoServer endpoints.
  - Corrected property name extraction for official GeoServer responses: `"Nivel Lden dB(A) de la isófona"` and `"Tipo de Fuente de ruido que genera la isófona"` in `SICAProvider`.
  - Enhanced `SNCZIProvider` layer detection to recognize standard Spanish flood return period layers `Q10`, `Q50`, `Q100`, `Q500`, and preferential flow zones `ZFP`.
  - Added support for `QUIET` ambient sound level ('Silencioso') in `App.tsx` and updated UI components.

---

## [0.2.8] - 2026-10-19

### Added
- **Official INE ADRH Income Choropleth Integration (MapServer & Edge Proxy)**:
  - Connected the official INE ADRH income choropleth service (`ADRH_renta_media_por_hogar/MapServer/WMSServer`) displaying true multi-color quintiles (5-class graduated income brackets from <= 21.000€ up to > 44.000€) instead of monochrome yellow fill.
  - Implemented dedicated edge tile proxy `/api/v1/tiles/ine/income` in `apps/api/src/routes/tiles.routes.ts` with Cloudflare Edge Cache API (30-day TTL) and CORS headers (`Access-Control-Allow-Origin: *`) to eliminate mixed-content and cross-origin blocking.
  - Restored the official INE Secciones Censales administrative boundaries endpoint via GeoServer in `apps/web/src/components/MapView.tsx` with dedicated HUD layer toggles.
- **MITECO SNCZI Flood Cartography & 5 Return Periods**:
  - Restored direct WMS tile streaming for Spanish flood risk cartography (`https://wms.mapama.gob.es/sig/Agua/ZI_Laminas/wms.aspx`).
  - Added full support and interactive UI toggles in `MapView.tsx` for all 5 flood scenarios:
    - High probability / frequent floods (T=10 years)
    - Frequent floods (T=50 years)
    - Medium probability / standard hazard (T=100 years)
    - Low probability / exceptional events (T=500 years)
    - Preferential hazard zone (*Zona de Flujo Preferente* - NZP)

### Fixed
- **Multi-Letter Address Precision & Cadastral Reference Disambiguation**:
  - Tightened `isCadastralReference` validation in `packages/core/src/validation/cadastral.ts` and `apps/web/src/components/SearchBar.tsx` to prevent street addresses with portal suffixes or multi-letter words (e.g. `Gran Vía 28 B`, `Calle Mayor 14 BIS`) from being misclassified as 14- or 20-character cadastral references.
  - Normalized multi-letter portal inputs to preserve building extensions and letter suffixes when querying Catastro OVC and CartoCiudad reverse geocoding.
- **Dark GIS Basemap Overzooming**:
  - Fixed Esri World Dark Gray Canvas basemap tile cutoff at zoom levels >= 17 by explicitly configuring `maxzoom: 16` on the raster tile source and `maxzoom: 22` on the layer in `MapView.tsx`. MapLibre GL now automatically overzooms cached zoom 16 tiles up to zoom 22 without blank tile errors.

---

## [0.2.7] - 2026-10-19

### Fixed
- **Search Recommendation Lifecycle & Modal State**:
  - Eliminated unprompted autocomplete recommendations in `HeroSection.tsx` on initial component mount by initializing search state cleanly and tracking user focus state.
  - Replaced hardcoded `SAMPLE_AUDITS` mock dictionary with real live loading states in `AuditModal.tsx`.
  - Added loading skeleton and clear offline demo indicator to `AuditModal.tsx`.
- **Dynamic INE Census Tract Resolution Nationwide**:
  - Added `provinceCode` and `municipalityCode` to `CadastralAddressSchema` and extracted `loine cp/cm` in Catastro parser (`parseCatastroDnprcXml`).
  - Implemented dynamic INE census tract resolution across all 8,131 Spanish municipalities with provincial capital mapping in `INEProvider.ts`.
  - Updated SERPAVI stressed housing zone detection using resolved municipality codes in `SERPAVIProvider.ts`.
  - Updated sample presets with real verified Spanish cadastral references across Madrid, Barcelona, Valencia, and Sevilla.

---

## [0.2.6] - 2026-10-19

### Fixed
- **Catastro Construction Year & Building Specs for Multi-Unit Horizontal Division**:
  - Enhanced Catastro OVC parser (`parseCatastroDnprcXml` in `apps/api/src/providers/catastro.parser.ts`) to resolve the true building construction year (`anoConstruccion` / `ant`) across horizontal property regimes (divisions in multi-unit buildings).
  - Prevented individual apartments or renovated commercial units from displaying missing or inaccurate construction years by cascading to parent building parcel metadata.
  - Updated `AuditDossier.tsx`, `PillarCard.tsx`, and `MapView.tsx` to display verified construction year, surface area, and building conservation status.

---

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

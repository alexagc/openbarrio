# OpenBarrio Autonomous Data Pipeline (ETL) 🦆🇪🇸

This package provides the autonomous ETL pipeline implementing **Option B (Data Sovereignty)** from `AGENTS.md`. It eliminates external rate limits and latency for INE, census tract, and 15-minute civic connectivity queries by pre-processing official public open datasets into:

1. **Cloudflare D1 (SQLite):**
   - Ingests Spanish census tracts from the **INE ADRH** (Atlas de Distribución de Renta de los Hogares) with municipal percentiles, rankings, and demographic metrics for sub-5ms edge lookups.
   - Ingests verified Spanish civic facilities across 4 essential 15-minute walkability categories (**Healthcare**, **Education**, **Transit**, **Parks**) from official public registries (**REPS**, **MEFP**, **Adif/Metro**, **IGN CartoCiudad/SIOSE**) for sub-5ms geodesic proximity calculations.
2. **Cloudflare R2 (PMTiles):** Simplifies geometry polygons from the **INE/IGN Cartografía Seccionado Censal** into optimized PMTiles for dual-use (Edge Point-in-Polygon spatial resolution in Cloudflare Workers and vector heatmaps in MapLibre GL frontend).

---

## 🛠️ Architecture & Tools

* **Dataset Downloader (`src/download_datasets.py`):** Automatically fetches official tables from the INE Tempus API (`https://servicios.ine.es/wstempus/js/ES/TABLAS_OPERACION/353`) and cartography shapefiles (`https://www.ine.es/prodyser/cartografia/seccionado_2024.zip`).
* **DuckDB:** High-performance analytical columnar database engine executing vectorized income aggregation and municipal window ranking calculations (`src/process_ine_adrh.py`).
* **DuckDB Spatial:** Native OGC geospatial extension (`INSTALL spatial; LOAD spatial;`) reading official shapefiles, reprojecting UTM to WGS84 (EPSG:4326), and simplifying topological boundaries (`src/process_ign_boundaries.py`).
* **Civic Facilities Processor (`src/process_civic_facilities.py` & `src/sample_facilities.py`):** Ingests, normalizes, and exports Spanish civic facilities for Phase 9B 15-minute walkability connectivity. Covers healthcare (REPS / Catálogo Nacional de Hospitales), education (MEFP Centros Docentes), transit (Adif / Cercanías / Metro), and urban parks (CartoCiudad / SIOSE) into `civic_facilities.sql`.
* **Tippecanoe:** Compiles simplified GeoJSON into compact, multi-scale PMTiles archives (zooms 6 to 14) for low-cost Cloudflare R2 object storage.
* **GitHub Actions:** Scheduled and on-demand workflow (`.github/workflows/data-pipeline.yml`) automating ingestion, processing, artifact archiving, and Cloudflare D1/R2 synchronization.

---

## 📋 Database Schemas

### 1. Census Tract Income (`census_tract_income`)

```sql
CREATE TABLE IF NOT EXISTS census_tract_income (
  census_section_code TEXT PRIMARY KEY,        -- 10-char CUSEC (e.g. 2807901001)
  municipality_code TEXT NOT NULL,             -- 5-char CUMUN (e.g. 28079)
  average_net_household_income_eur REAL NOT NULL,
  average_net_person_income_eur REAL NOT NULL,
  median_net_household_income_eur REAL NOT NULL,
  median_net_person_income_eur REAL NOT NULL,
  percentile_in_municipality REAL NOT NULL,    -- 0 to 100 within municipality
  rank_in_municipality INTEGER NOT NULL,
  total_sections_in_municipality INTEGER NOT NULL,
  median_age REAL NOT NULL,
  single_person_household_percentage REAL NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_census_tract_muni ON census_tract_income (municipality_code);
```

### 2. Civic Facilities (`civic_facilities` - Phase 9B)

```sql
CREATE TABLE IF NOT EXISTS civic_facilities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,                          -- 'healthcare' | 'education' | 'transit' | 'park'
  subtype TEXT,                                -- 'primary_care', 'hospital', 'school', 'high_school', 'metro', 'train', 'bus_hub', 'urban_park', 'metropolitan_park'
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  municipality_code TEXT NOT NULL,             -- 5-char CUMUN (e.g. 28079)
  postal_code TEXT                             -- 5-digit postal code (e.g. 28004)
);

CREATE INDEX IF NOT EXISTS idx_facilities_coords ON civic_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON civic_facilities(type);
```

---

## 🚀 Execution Commands

### 1. Trigger Autonomous Pipeline via GitHub Actions
Run the automated cloud pipeline directly via the GitHub CLI:

```bash
# Run pipeline with metropolitan provinces + upload to D1/R2
gh workflow run data-pipeline.yml

# Run pipeline downloading all 52 Spanish provinces
gh workflow run data-pipeline.yml -f all_provinces=true

# Dry run (compile and archive artifacts without modifying Cloudflare)
gh workflow run data-pipeline.yml -f dry_run=true
```

### 2. Local / Codespaces Execution
Within GitHub Codespaces or a Linux environment with GDAL & Tippecanoe:

```bash
# 1. Download official INE tables and cartography (or use --force-sample)
python3 src/download_datasets.py

# 2. Process INE ADRH into Cloudflare D1 SQL file & SQLite DB
python3 src/process_ine_adrh.py \
  --input data/ine_adrh_raw.csv \
  --output-sql dist/ine_adrh.sql \
  --output-db dist/ine_adrh.db

# 3. Process cartography into simplified GeoJSON and PMTiles
python3 src/process_ign_boundaries.py \
  --input data/ign_secciones_censales.geojson \
  --output-pmtiles dist/census_tracts.pmtiles

# 4. Process Civic Facilities for 15-Minute Connectivity (Phase 9B)
python3 src/process_civic_facilities.py \
  --output-sql dist/openbarrio-etl-dist/civic_facilities.sql \
  --output-db dist/civic_facilities.db

# 5. Apply SQL to Cloudflare D1 (Production)
npx wrangler d1 execute openbarrio-d1 --file=dist/ine_adrh.sql --remote
npx wrangler d1 execute openbarrio-d1 --file=dist/openbarrio-etl-dist/civic_facilities.sql --remote

# 6. Upload PMTiles to Cloudflare R2 (Production)
npx wrangler r2 object put openbarrio-r2/census_tracts.pmtiles --file=dist/census_tracts.pmtiles
```

---

## 📦 Pipeline Artifacts
Every GitHub Actions run publishes the processed artifacts to the workflow summary with 30-day retention:
* `ine_adrh.sql`: Complete D1 batched SQL insert script for all census tracts.
* `civic_facilities.sql`: Complete D1 batched SQL insert script for verified civic facilities across Spain.
* `census_tracts.pmtiles`: Optimized multi-zoom vector tile package for Cloudflare R2.
* `census_tracts_simplified.geojson`: Lightweight WGS84 GeoJSON for spatial analysis.

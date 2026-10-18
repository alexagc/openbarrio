# OpenBarrio Autonomous Data Pipeline (ETL) 🦆🇪🇸

This package provides the autonomous ETL pipeline implementing **Option B (Data Sovereignty)** from `AGENTS.md`. It eliminates external rate limits and latency for INE and census tract queries by pre-processing official public open datasets into:

1. **Cloudflare D1 (SQLite):** Ingests ~36,000 Spanish census tracts from the **INE ADRH** (Atlas de Distribución de Renta de los Hogares) with municipal percentiles, rankings, and demographic metrics for sub-5ms edge lookups.
2. **Cloudflare R2 (PMTiles):** Simplifies geometry polygons from the **IGN Seccionado Censal** into optimized PMTiles for dual-use (Edge Point-in-Polygon spatial resolution in Cloudflare Workers and vector heatmaps in MapLibre GL frontend).

---

## 🛠️ Architecture & Tools

* **DuckDB:** High-performance analytical columnar database engine executing vectorised income aggregation and municipal window ranking calculations.
* **DuckDB Spatial:** Native OGC geospatial extension (`INSTALL spatial; LOAD spatial;`) reading official shapefiles, reprojecting to WGS84 (EPSG:4326), and simplifying topological boundaries (`ST_SimplifyPreserveTopology`).
* **Tippecanoe:** Compiles simplified GeoJSON into compact, multi-scale PMTiles archives (zooms 6 to 14) for low-cost Cloudflare R2 object storage.
* **GitHub Actions:** Runs on a scheduled pipeline (`.github/workflows/data-pipeline.yml`) to download raw datasets, execute DuckDB processing, and synchronize Cloudflare D1 and R2.

---

## 📋 Database Schema (`census_tract_income`)

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

---

## 🚀 Execution Commands

```bash
# Generate sample data for dry-run
python3 src/sample_data.py

# Process INE ADRH into Cloudflare D1 SQL file & SQLite DB
python3 src/process_ine_adrh.py --input data/ine_adrh_raw.csv --output-sql dist/ine_adrh.sql --output-db dist/ine_adrh.db

# Process IGN cartography into simplified GeoJSON and PMTiles
python3 src/process_ign_boundaries.py --input data/ign_secciones_censales.geojson --output-pmtiles dist/census_tracts.pmtiles

# Apply SQL to Cloudflare D1 (Production)
npx wrangler d1 execute openbarrio-d1 --file=dist/ine_adrh.sql --remote

# Upload PMTiles to Cloudflare R2 (Production)
npx wrangler r2 object put openbarrio-r2/census_tracts.pmtiles --file=dist/census_tracts.pmtiles
```

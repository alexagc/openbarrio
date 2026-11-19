# Data Sovereignty, Storage Hierarchy & Autonomous ETL Rules 🇪🇸🏛️

> **Universal Architecture Reference:** This document establishes why, where, and how OpenBarrio ingests, normalizes, and stores official Spanish administrative datasets. It must be consulted whenever data ingestion, table counts, or Edge storage architecture is addressed.

---

## 1. Core Philosophy: Data Sovereignty & Edge Zero-Latency

1. **Zero External API Reliance for Core Real Estate Metrics:**
   External public administration APIs (INE, IGN, MITECO) frequently suffer from rate limits, downtime, maintenance windows, or CORS blocks. OpenBarrio guarantees sub-10ms response times at the Edge by pre-ingesting and normalizing canonical public datasets into Cloudflare infrastructure.
2. **Dual-Tier Edge Storage Hierarchy:**
   * **Cloudflare D1 (Edge Relational SQLite):** Used for lightweight tabular metadata, postal lookups, demographic income, radon zones, energy certificates, and seismic hazards.
   * **Cloudflare R2 (Zero-Egress Object Storage + PMTiles):** Used for heavy spatial vector layers (flood polygons, acoustic noise contours, census boundaries) streamed directly to MapLibre GL frontend and queried serverless via Edge Point-in-Polygon.
3. **Containerized & Host Zero-Pollution Ingestion:**
   Data ingestion pipelines run either inside containerized environments (Docker Desktop via WSL 2) or via automated GitHub Actions workflows (`.github/workflows/data-pipeline.yml`). Never pollute the developer host machine with native build toolchains.

---

## 2. Definitive Table Inventory & Row Count Rationale

Every table in Cloudflare D1 and local SQLite (`data/openbarrio.sqlite`) has an exact statutory or technical justification for its row count:

| Table Name | Target Rows | Data Source & Authority | Statutory / Technical Rationale |
| :--- | :--- | :--- | :--- |
| `building_energy_certificates` | ~196,875 | Autonomous Communities Open Data (Catalunya ICAEN Socrata, Madrid Open Data, Euskadi) | Official registered Energy Performance Certificates (CEE) from regions with open bulk portals. For non-open regions, OpenBarrio applies the statutory CTE HE normative estimation engine based on Catastro building typology and year. |
| `civic_facilities` | ~60,397 | IGN National Topographic Base & Open Data portals | Complete national inventory of essential civic amenities across all 52 Spanish provinces: healthcare, schools, green spaces, and transit hubs. |
| `census_tract_income` | ~37,157 | INE Atlas de Distribución de Renta de los Hogares (ADRH) | Complete national coverage of every Spanish census section (~37,000 *secciones censales*). Provides instant median net household income. |
| `census_tract_vut` | ~36,480 | INE Experimental Housing Statistics (VUT) | Complete national census section mapping of tourist apartments and tourist pressure percentages. |
| `ign_seismic_hazard` | **8,132** | Instituto Geográfico Nacional (IGN) / Real Decreto 997/2002 (NCSE-02 Anejo 1) | **100% National Coverage of all 8,131 Spanish municipalities + autonomous cities (Ceuta & Melilla).** Granular basic acceleration $a_b$ for seismic clusters (Granada, Lorca/Murcia, Almería, Alicante, Málaga, Pyrenees); official provincial baselines for seismic provinces; standard normative baseline ($a_b = 0.04g$, `VERY_LOW`) for the remaining 33 provinces. |
| `cte_radon_municipalities` | **4,043** | Real Decreto 732/2019 / CTE DB-HS 6 (Apéndice B) | **100% Statutory Completeness.** The Spanish building code (CTE DB-HS 6) strictly classifies only 4,043 municipalities into 'Zona I' (moderate risk) and 'Zona II' (high risk). The remaining 4,088 Spanish municipalities are legally 'Zona 0' (sedimentary, unclassified risk). |
| `mivau_serpavi_benchmarks` | ~377 | Ministerio de Vivienda / Ley 12/2023 por el Derecho a la Vivienda | Only municipalities legally declared *Zonas de Mercado Residencial Tensionado* have statutory rent control limits (mainly Catalunya's 140/271 declared municipalities + test regions). Non-declared municipalities have no statutory benchmarks under Spanish law. |
| `municipal_ite_records` | Seed / Municipal Open Data | Ley 7/1985 (LRBRL) & Municipal Councils | In Spain, ITE/IEE is strictly a municipal competency. Cities like Madrid, Barcelona, and Valencia do **not** publish bulk downloadable CSV registries due to GDPR/data protection regulations (they only provide single-cadastral web forms). Only Euskadi (Euskoregite) publishes open bulk data. For all other regions, OpenBarrio computes ITE statutory obligation deterministically via Real Decreto-Ley 7/2015 art. 29 based on Cadastral construction antiquity (>50 years). |
| `census_tract_sica_noise` | **0 in D1** (157.7 MB in R2) | MITECO SICA Cartography | **Zero rows in D1 by design.** All 42,670+ strategic noise map line strings are compiled into `noise.pmtiles` and stored in Cloudflare R2 to save D1 row write quotas and enable direct vector rendering. Fallback queries use live MITECO WMS GetFeatureInfo. |
| `census_tract_snczi_risk` | **0 in D1** (583.5 MB in R2) | MITECO SNCZI Cartography | **Zero rows in D1 by design.** All 28,142+ flood hazard polygons ($T=10, 50, 100, 500$ years) are compiled into `floods.pmtiles` (cloud vector tiles) in Cloudflare R2 for zero-egress map streaming. Fallback queries use live MITECO WMS. |
| `source_snapshots` | Dynamic Cache (D1) | Ministerial SWR Snapshot Store (`0009_source_snapshots.sql`) | Stores SHA-256 hashed JSON snapshots for resilient stale-while-revalidate serving (30d fresh, >=90d amber badge, 365d max lifetime) with zero-write cache hits and 24h timestamp write throttling. |

---

## 3. Cloudflare D1 FinOps & Modular Chunking Strategy

1. **Daily Row Write Quota Budget:**
   * Cloudflare D1 free-tier allows **100,000 row writes per day** (resetting daily at 00:00 UTC).
   * Monolithic national ingestion (e.g. 196k CEEs + 60k facilities) exceeds the daily limit if executed simultaneously in a single day.
2. **Chunking Standard (`split-d1-chunks.mjs`):**
   * SQL files are automatically partitioned into chunks under **1 MB and max 2,500 SQL statements**.
   * Chunks are stored under `packages/etl/chunks/<dataset>/` (e.g. `ign_seismic_part_01.sql`).
3. **Sequential Executor (`apply-d1-chunks.mjs`):**
   * Applies chunks sequentially with a 3-attempt exponential backoff to prevent HTTP payload rejections or rate limiting.
4. **Idempotence & Transaction Syntax:**
   * Cloudflare D1 does **not** allow standard SQL `BEGIN TRANSACTION;` or `COMMIT;` statements in `wrangler d1 execute`. Scripts must output bare idempotent `INSERT OR REPLACE INTO ...` statements.

---

## 4. Autonomous GitHub Actions Workflow (`data-pipeline.yml`)

The production pipeline is governed by `.github/workflows/data-pipeline.yml`:
* **Job 1 (INE & IGN Boundaries):** Uses DuckDB Spatial to process IGN census polygons into `census_tracts.pmtiles` (R2) and `ine_adrh.sql` (D1).
* **Job 2 (MITECO SNCZI Floods):** Downloads national flood shapefiles across 10 river basins, producing `floods.pmtiles` (R2).
* **Job 3 (MITECO SICA Noise):** Downloads national road, rail, and agglomeration noise layers, producing `noise.pmtiles` (R2).
* **Job 4 (Civic, CEE, Radon, SERPAVI, Seismic & ITE):** Ingests tabular open datasets, executes `process_ign_seismic.py`, and chunks them into D1-ready batches.
* **Job 5 (Gatekeeper & D1/R2 Deployer):** Runs `scripts/verify-etl-integrity.mjs` and selectively applies chunks to remote Cloudflare D1 and R2 using input flags (`sync_vut_radon_serpavi`, `sync_civic_cee`, `sync_ine`, etc.).

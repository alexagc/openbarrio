# Spanish Broadband Coverage Datasets (SETELECO & CNMC) — Availability, Granularity & Staleness Policy

- **Status:** Research Baseline for v1.5.0 (`broadband` layer)
- **Primary Authorities:**
  - **SETELECO** (Secretaría de Estado de Telecomunicaciones e Infraestructuras Digitales — Ministerio para la Transformación Digital y de la Función Pública)
  - **CNMC** (Comisión Nacional de los Mercados y la Competencia — `CNMCData` Open Data Portal)
- **Regulatory & Licensing Framework:** Spanish Law 37/2007 (RISP), EU Broadband Cost Reduction / State Aid mapping guidelines (`UNICO-DATOS`), `datos.gob.es` / CNMC Open Data terms (commercial & non-commercial reuse permitted with source attribution and unmodified publication dates).

---

## 1. Dataset Evolution & Real Granularity Available in Open Data

### 1.1. SETELECO Series (2013–2020 vs. 2021–2024+)
1. **2013–2020 Series — Entidad Singular de Población (`population_entity`):**
   - Historical SETELECO downloadable spreadsheets/CSVs reported fixed broadband (FTTH, HFC, >=30 Mbps, >=100 Mbps) and mobile (4G/5G) coverage by INE **Entidad Singular de Población (ESP)** (`11-digit` INE territory code).
   - Limitation: an ESP often groups dozens of streets or dispersed rural hamlets under a single percentage. **ESP coverage does not guarantee FTTH availability at an individual street portal.**
2. **2021–2024+ Methodology Shift — Cadastral Parcel vs. Open Downloads (`parcel` vs. `municipality`):**
   - From 2021 onward (annual June 30 cutoff under `UNICO-DATOS`), SETELECO collects operator availability at the **14-digit cadastral parcel** (`parcel`) level for fixed technologies (FTTH/FTTP, HFC, FWA) and grid cells for **5G** mobile coverage.
   - **Open Bulk Availability Finding:** While SETELECO exposes interactive ArcGIS Experience Builder viewers for single-address / single-parcel lookup, **bulk national parcel-level raw dumps are NOT published for open bulk download** due to confidentiality / operator NDA constraints under `UNICO-DATOS`.
   - Open downloadable multi-year XLSX workbooks (`digital.gob.es` / `datos.gob.es`) are aggregated at **municipality (`municipality`)**, province, and autonomous community levels:
     - `Cobertura_BA_España_2021-2025_MUN_PROV_CCAA_Nacional_datosgob_DEF.xlsx` (sheet `Municipio_%hogar`, June 2025 cutoff `2025-06-30`, covering all ~8,131 Spanish municipalities).

### 1.2. CNMC (`CNMCData`) Open Datasets
- **Portal:** `data.cnmc.es` (Telecomunicaciones — panel interactivo y descargas CSV/JSON/API).
- **Content:** Active fixed broadband lines by technology (FTTH, HFC, xDSL), speed brackets, and mobile broadband lines through 2023–2025 at **provincial and municipal** granularity (`municipality`).
- **License:** CNMC Open Data / Spanish RISP (free reuse with mandatory attribution).

---

## 2. Granularity Limitation & Informative-Only Policy (Rule R-F1)

1. **Zero BarrioScore Impact:** In `v1.5.0`, `broadband` is strictly an **informative layer**. It contributes **0 points** and **0 weight** to BarrioScore (`calculateBarrioScore`), and decision profiles may only use it for dossier section ordering (`sectionOrder`), never scoring.
2. **Mandatory Granularity & Year Disclosure:**
   - Every response (`BroadbandCoverage`) and UI card (`BroadbandConnectivityCard`, `/estado-fuentes`) explicitly displays `granularity` (`parcel | population_entity | municipality`) and `sourceYear`.
   - Whenever `granularity` is `population_entity` or `municipality`, UI copy and `/estado-fuentes` explicitly warn that the metric is a territorial reference and **does not guarantee fiber or 5G coverage at the specific building portal**.
3. **Visit Checklist Integration:** Whenever `broadband` is non-parcel (`granularity !== 'parcel'`) or `ftthPct < 90`, `generateVisitChecklist()` emits a deterministic verification item (`broadband_verify_portal`) advising the user to confirm optical fiber termination (CTO/ONT) and indoor 5G signal directly with operators during the visit.
4. **No Synthetic Fallbacks:** Municipalities missing from `broadband_coverage` emit `status: 'out_of_coverage'`, `reason: 'no_coverage'`, never interpolated numbers.

---

## 3. Broadband-Only Staleness Exception (Rule R-F2)

Because the historical SETELECO ESP series stopped after `2020`, applying the global `365`-day cutoff (`STALE_MAX_DAYS = 365`) would discard valid historical reference indicators for rural entities lacking newer municipal tables.

- **Global Rule (Unchanged):** All 14 non-broadband layers retain `STALE_MAX_DAYS = 365`.
- **Broadband-Only Exception:** `BROADBAND_STALE_MAX_DAYS = 2190` (~6 years) applies **exclusively** to `LayerKey = 'broadband'`.
- **Mandatory Stale Classification for Historical ESP (2013–2020):** Any record with `granularity = 'population_entity'` and `sourceYear <= 2020` (or any record older than `STALE_FRESH_DAYS = 30`) is **always** returned with `status: 'stale'`, never `'ok'`, displaying its exact `sourceYear` and `granularity`. Records exceeding `BROADBAND_STALE_MAX_DAYS = 2190` days expire to `status: 'unavailable'`.

---

## 4. Cloudflare D1 FinOps Budget

- **Municipal Coverage Table (`broadband_coverage`):** ~8,131 Spanish municipalities ≈ **4 D1 SQL chunks** (`<= 2,500` statements and `< 1 MB` per chunk).
- **Daily Write Quota Impact:** ~8.1% of Cloudflare D1's `100,000` writes/day free-tier limit, gated in `.github/workflows/data-pipeline.yml` via `sync_broadband`.

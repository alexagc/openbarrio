# GTFS / National Access Point (NAP) Availability, Licensing & Go/No-Go Matrix

- **Status:** Research Baseline for v1.5.0 (`transit` layer)
- **Primary Authority:** Ministerio de Transportes y Movilidad Sostenible (MITMS) — Punto de Acceso Nacional (NAP) (`https://nap.transportes.gob.es`)
- **Regulatory Framework:** Commission Delegated Regulation (EU) 2017/1926 (Multimodal Travel Information Services — MMTIS) & Spanish Law 37/2007 on Public Sector Information Reuse (RISP)

---

## 1. National Access Point (NAP) Access & Credential Model

1. **Discovery & Download API:**
   - Feed catalog listing: `GET https://nap.transportes.gob.es/api/Fichero/GetList`
   - Binary feed download: `GET https://nap.transportes.gob.es/api/Fichero/download/{id}`
   - Required authentication header: `ApiKey: <token>` (obtained via free developer/institutional registration on `nap.transportes.gob.es`).
2. **Credential Hygiene Policy:**
   - `NAP_API_KEY` **must never** be committed to the repository, `.env`, or container images.
   - Automated ingestion reads `NAP_API_KEY` strictly from GitHub Actions repository secrets (`secrets.NAP_API_KEY`) during `data-pipeline.yml` runs.
3. **Standard NAP Licensing Terms:**
   - Feeds published directly under the MITMS Open Data / RISP baseline permit both non-commercial and commercial reuse, derivative aggregation, and redistribution provided that:
     1. Clear attribution to the Ministerio de Transportes y Movilidad Sostenible and the originating transport authority/operator is preserved.
     2. Original `source_date` / last-updated metadata and usage terms are never stripped or altered.
   - However, **NAP aggregates heterogeneous regional/municipal datasets**: each feed declares its own license metadata (`license_id`), so every operator feed must pass an explicit per-feed Go/No-Go check before ETL ingestion.

---

## 2. Per-Feed Go/No-Go Licensing & Quality Matrix

Only feeds whose license explicitly permits **derivative redistribution and edge storage** (D1/R2) are approved (`GO`) for ingestion in `packages/etl/src/process_gtfs_transit.py`.

| Region / Area | Authority / Feed | Modes | License / Reuse Terms | Status | Notes & Caveats |
|---|---|---|---|---|---|
| **Madrid (MVP)** | CRTM (Consorcio Regional de Transportes de Madrid) & EMT Madrid | Metro, EMT Bus, Metro Ligero, Interurban, Cercanías Madrid | CRTM Open Data / NAP RISP (attribution required) | **GO** | High frequency; separated GTFS archives per mode (M4 Metro, M6 EMT, M5 Cercanías, M8 Interurbanos, M10 Metro Ligero). |
| **Barcelona (MVP)** | TMB (Transports Metropolitans de Barcelona) & ATM (T-mobilitat) | Metro, TMB Bus, Rodalies, FGC, TRAM | TMB Open Data / CC BY 4.0 / NAP | **GO** | TMB updates weekly (`developer.tmb.cat` + NAP); ATM consolidates metropolitan rail/tram schedules. |
| **València (MVP)** | EMT València & ATMV (Generalitat Valenciana) | EMT Urban Bus, Metrovalencia | CC BY 4.0 (Datos Abiertos València / GVA / NAP) | **GO** | EMT distributes explicit CC BY 4.0 GTFS; Metrovalencia published via GVA open data / NAP. |
| **Sevilla (MVP)** | TUSSAM (Ayto. Sevilla) & CTAN (Consorcio de Transporte de Andalucía) | Urban Bus, MetroCentro Tram, Metro Sevilla, Metropolitan Bus | CC BY 4.0 (IDE Sevilla / Junta de Andalucía Open Data) | **GO** | Requires joining TUSSAM urban stops with CTAN metropolitan network for 100% area coverage. |
| **National Commuter Rail (MVP)** | Renfe Viajeros (Cercanías) | Commuter Rail | MITMS RISP Open Data (NAP / `datos.gob.es`) | **GO** | Covers national Cercanías nuclei; often lacks granular frequencies in some nuclei (uses explicit `stop_times.txt`). |
| **Zaragoza (Partial)** | Ayuntamiento de Zaragoza (Tranvía / Avanza Bus) | Tram + Urban Bus | Ayto. Zaragoza Open Data (CC BY 4.0) | **PARTIAL (`50%`)** | Municipal tram/bus feeds are open (`1/2` expected feeds), while regional/Cercanías schedule integration in NAP can be incomplete (`coveragePct = 50`, emitted as `out_of_coverage`). |
| **Málaga (Partial)** | EMT Málaga | Urban Bus | Málaga Open Data (CC BY 4.0) | **PARTIAL (`50%`)** | Urban EMT bus open (`1/2` expected feeds); Metro Málaga / regional rail feeds excluded unless verified under compatible license (`coveragePct = 50`, `out_of_coverage`). |
| **Private / NDA Operators** | Private long-distance concessions & non-open local concessions | Intercity Coach / Private | Proprietary / No redistribution clause / NDA | **NO-GO** | Excluded from ingestion. Must never be scraped or redistributed without written license compatibility. |
| **Malformed / Schedule-less Feeds** | Operators missing `calendar.txt` & `calendar_dates.txt` or valid `stop_times.txt` | Mixed | Variable | **NO-GO** | Rejected by ETL validation gate; areas lacking valid open feeds emit `out_of_coverage` (`coveragePct = 0`). |

---

## 3. Data Quality Risks, Normalization Rules & Parametric Disclosure

1. **Service Calendar Variants (`calendar.txt` vs `calendar_dates.txt`):**
   - Several Spanish operators (notably regional bus consortia) omit `calendar.txt` and enumerate active service dates exclusively in `calendar_dates.txt` (`exception_type = 1`). The ETL pipeline inspects both tables and selects a representative weekday service window.
2. **Headway Computation (`frequencies.txt` vs `stop_times.txt`):**
   - Where `frequencies.txt` exists with `headway_secs`, peak headway is derived directly for weekday peak hours (`07:30–09:30` and `17:30–19:30`) and off-peak hours (`10:00–16:00`).
   - Where `frequencies.txt` is absent (typical for commuter rail and EMT bus), headways are computed from consecutive sorted `departure_time` differences in `stop_times.txt`, handling GTFS post-midnight timestamps (`>= 24:00:00`, e.g. `25:10:00`).
3. **Partial Coverage Rule (`out_of_coverage` with Real `coveragePct`):**
   - When an audited municipality has only partial feed coverage (`0 < coveragePct < 100`), the API **must never** report `status: 'ok'`. It emits `status: 'out_of_coverage'`, `reason: 'no_coverage'`, and the exact measured `coveragePct` alongside any available stops from approved feeds.
   - Areas with no approved feeds emit `status: 'out_of_coverage'`, `reason: 'no_coverage'`, `coveragePct: 0`.
4. **Parametric Walking Segment Disclosure:**
   - Walking times from the cadastral parcel to nearby GTFS stops are calculated **parametrically** (`4.5 km/h` pedestrian speed, `1.25x` street tortuosity factor), **not** via street-network multimodal routing. Both the API contract (`walkSegmentMethod: 'parametric'`) and the UI disclose this limitation explicitly.

---

## 4. Cloudflare D1 FinOps Budget & Rollout Strategy

- **Cloudflare D1 Free-Tier Ceiling:** `100,000` row writes per day (resets 00:00 UTC).
- **Estimated MVP Row Footprint (`transit_stops` + `transit_feed_coverage`):**
  - Madrid (CRTM Metro + EMT + Cercanías + Metro Ligero): ~12,000 stops
  - Barcelona (TMB Metro/Bus + ATM/Rodalies): ~6,500 stops
  - València (EMT + Metrovalencia): ~3,200 stops
  - Sevilla (TUSSAM + CTAN): ~2,800 stops
  - Renfe Cercanías national nuclei: ~600 stops
  - **Total MVP Footprint:** ~25,100 rows (~11 SQL chunks at `<= 2,500` statements and `< 1 MB` per chunk).
- **Multi-Day / Isolated Sync Plan:**
  - `data-pipeline.yml` exposes an explicit `sync_transit` dispatch flag (default `false`) so GTFS D1 writes run independently of the 197k CEE / 60k civic facility syncs, consuming ~25% of the daily write quota on sync days.

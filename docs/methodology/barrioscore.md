# BarrioScore Public Methodology Specification

- **Methodology Version:** `2.1.0`
- **Source of Truth:** `packages/core/src/scoring/weights.ts`, `packages/core/src/scoring/barrio-score.ts`, `packages/core/src/scoring/traffic-light.ts`, and `packages/core/src/types/data-status.ts`
- **Published Public Page:** `https://openbarrio.org/metodologia` (`es`, `en`, `ca`, `gl`, `eu`)

---

## 1. Purpose & Design Principles

BarrioScore quantifies physical, environmental, socioeconomic, urban-planning, and 15-minute civic connectivity risks for any Spanish cadastral parcel (`0–100`).

Version `2.0.0` eliminates silent favorable assumptions when official data sources fail, time out, or lack spatial coverage:

1. **No fabricated defaults:** Missing or unavailable public layers receive zero weight and zero bonus points.
2. **Explicit uncertainty:** When fewer than 3 of 5 pillars have usable data (`pillarsWithData < 3`, i.e., `< 60%` pillar coverage), the global traffic light is marked `UNCERTAIN` (neutral gray).
3. **Critical environmental safety gate:** If MITECO SICA (strategic noise) or MITECO SNCZI (flood hazard) is `unavailable` or `out_of_coverage`, the global traffic light can **never** show `GREEN` (green ceiling = `AMBER` / `UNCERTAIN`), and the environmental pillar turns gray with an explicit "unevaluated risk" warning.

---

## 2. Composite Formula & Five Pillars

$$
\text{BarrioScore} = \text{round}\left(\sum_{p \in \mathcal{P}_{\text{usable}}} w'_p \cdot S_p\right), \quad w'_p = \frac{w_p}{\sum_{q \in \mathcal{P}_{\text{usable}}} w_q}
$$

Each pillar subscore $S_p \in [0, 100]$ aggregates official public datasets:

| Pillar | Primary Official Sources | Key Signals |
|---|---|---|
| **Connectivity (`connectivity`)** | IGN / CNIG Equipamientos | 15-minute walkability score, healthcare, rapid transit, education, green spaces, 5-min isochrone |
| **Building (`building`)** | Catastro OVC, Autonomic CEE, Municipal ITE/IEE, IGN NCSE-94 | Construction era (CTE / NBE-CT-79), density, CEE class/expiration, ITE status, substandard use, seismic reinforcement |
| **Socioeconomic (`socioeconomic`)** | INE ADRH (Census Sections) | Municipal income percentile (`60%`) + net household income factor (`40%`), median age context |
| **Environmental (`environmental`)** | MITECO SICA, MITECO SNCZI, Air Quality Stations, IGN NCSE-02 | Lden noise (`50%` with AQI / `55%` without), flood return period & Preferential Flow (`35%` / `45%`), AQI (`15%`), `ab >= 0.12g` seismic alert |
| **Urban Planning (`urbanPlanning`)** | MIVAU SIU, MIVAU SERPAVI, INE VUT | Land classification (`URBAN_CONSOLIDATED`, `URBAN_UNCONSOLIDATED`, `DEVELOPABLE`, `RUSTIC_*`), protected overlays, Ley 12/2023 stressed zones, VUT saturation |

---

## 3. Declarative Typology Weight Matrix

Effective weights per cadastral property typology (`SCORING_WEIGHTS_BY_TYPOLOGY`):

| Typology | Connectivity | Building | Socioeconomic | Environmental | Urban Planning | Sum |
|---|---:|---:|---:|---:|---:|---:|
| `RESIDENTIAL` | `25%` | `25%` | `20%` | `15%` | `15%` | 100% |
| `COMMERCIAL` | `25%` | `25%` | `20%` | `15%` | `15%` | 100% |
| `EQUIPMENT` | `25%` | `25%` | `20%` | `15%` | `15%` | 100% |
| `VACANT_PLOT` | `25%` | `5%` | `20%` | `25%` | `25%` | 100% |
| `RUSTIC` | `15%` | `5%` | `20%` | `30%` | `30%` | 100% |
| `INDUSTRIAL` | `15%` | `35%` | `10%` | `15%` | `25%` | 100% |

---

## 4. Explicit Bonuses & Penalties (`SCORING_MODIFIERS`)

| Modifier ID | Pillar | Adjustment | Trigger Condition |
|---|---|---|---|
| `renovation_post_2000` | `building` | `+15` | Documented major structural renovation from year 2000 onward (capped at 95). |
| `low_density_residential` | `building` | `+5` | Residential building with balanced multi-unit count between 2 and 40 units. |
| `high_density_residential` | `building` | `-5` | High-density residential complex exceeding 100 cadastral units. |
| `cee_official_ab` | `building` | `+5` | Official non-estimated Energy Performance Certificate rated Class A or B. |
| `cee_low_fg` | `building` | `-5` | Low Energy Performance Certificate rating Class F or G. |
| `cee_expired` | `building` | `-2` | Expired Energy Performance Certificate requiring renewal under RD 390/2021. |
| `substandard_housing` | `building_and_urbanPlanning` | `-25` | High-severity commercial-to-residential conversion risk without habitability status. |
| `ite_favorable` | `building` | `+5` | Favorable Technical Building Inspection (ITE/IEE favorable) in municipal registry. |
| `ite_unfavorable` | `building` | `-20` | Unfavorable Technical Building Inspection (ITE/IEE desfavorable) with active defects. |
| `seismic_vulnerability` | `building` | `-8` | Pre-NCSE-94 structure in seismic zone ab >= 0.08g, or environmental penalty when ab >= 0.12g. |
| `preferential_flood_zone` | `environmental` | `-25` | Flood safety sub-score penalty when parcel lies within MITECO Preferential Flow Zone. |
| `protected_land` | `urbanPlanning` | `-20` | Parcel intersects an environmental, heritage, or scenic protection overlay. |
| `vut_moderate` | `urbanPlanning` | `-5 to -10` | Moderate tourist-apartment density (3% <= VUT ratio < 8% in census tract). |
| `vut_critical` | `urbanPlanning` | `-15 to -25` | Critical tourist-apartment saturation (VUT ratio >= 8% in census tract). |

---

## 5. Missing Data, Stale Snapshots & Traffic Light Policy

### Layer States
- `ok`: Live or fresh cached verification within **30** days (`STALE_FRESH_DAYS = 30`).
- `stale`: Last verified snapshot served while upstream is degraded, aged up to **365** days (`STALE_MAX_DAYS = 365`). UI displays an amber age warning from **90** days onward (`STALE_AMBER_DAYS = 90`).
  - **Broadband coverage exception (SETELECO / CNMC):** Because open SETELECO Singular Population Entity (ESP) datasets ceased open publication after 2020, the `broadband` layer applies a dedicated 6-year maximum staleness window (`BROADBAND_STALE_MAX_DAYS = 2190`). Historical ESP records (`population_entity`) are always served transparently as `stale` (never `ok`), while all other 14 layers retain `STALE_MAX_DAYS = 365`.
- `out_of_coverage`: Official registry/map does not cover the parcel (never treated as safe or zero risk; zero pillar credit).
- `unavailable`: Upstream timeout/error/circuit-open or snapshot older than `STALE_MAX_DAYS` (or `BROADBAND_STALE_MAX_DAYS` for broadband) — never receives favorable points.
- **Informative-only v1.5.0 layers (`transit`, `broadband`):** GTFS/NAP transit accessibility and SETELECO/CNMC broadband coverage surface transparently alongside declared coverage/granularity and carry **zero** weight in BarrioScore calculation.

### Traffic Light Rules
- **`GREEN`**: `overallScore >= 70`, `pillarsWithData >= 3`, AND both critical layers (`sica`, `snczi`) are usable (`ok` or `stale`).
- **`AMBER`**: `overallScore >= 50` (or `overallScore >= 70` when a critical layer is missing and pillarsWithData >= 3).
- **`RED`**: `overallScore < 50` with `pillarsWithData >= 3`.
- **`UNCERTAIN`**: `pillarsWithData < 3` (`< 60%` pillar coverage).

---

## 6. Golden Reference Cases

Verified continuously in `packages/core/tests/barrio-score.golden.test.ts` and `packages/core/tests/barrio-score.property.test.ts`:

1. **Golden 1 (`RESIDENTIAL` modern prime, all pillars favorable):** Expected `overallScore = 93`, subscores `{ connectivity: 92, building: 100, socioeconomic: 84, environmental: 94, urbanPlanning: 95 }`.
2. **Minimum Property Invariant:** Marking any single layer `unavailable` or `out_of_coverage` strictly prevents the score from increasing or receiving points for that layer, and marking `sica` or `snczi` unavailable forces `trafficLight !== 'GREEN'`.

---

## 7. Methodology Changelog

- **`2.1.0`** (`2026-11-20`): Added deterministic decision-profile weight multipliers (family, investor, senior, renter) with [0.6-1.5] clamp and renormalization while preserving immutable base BarrioScore and UNCERTAIN/critical-layer caps.
- **`2.0.0`** (`2026-11-19`): Eliminated silent favorable defaults on unavailable/out-of-coverage layers; added proportional weight renormalization across verified pillars, UNCERTAIN (<3/5 pillars) traffic-light state, and SICA/SNCZI critical-layer green ceiling.
- **`1.0.0`** (`2026-10-01`): Initial 5-pillar weighted BarrioScore across Catastro OVC, INE ADRH, MITECO SICA/SNCZI, MIVAU SERPAVI/SIU, and CNIG 15-minute civic connectivity.

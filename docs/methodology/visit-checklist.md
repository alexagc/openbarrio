# On-Site Visit Checklist Specification

- **Methodology Version:** `2.1.0`
- **Source of Truth:** `packages/core/src/types/visit-checklist.ts`, `packages/core/src/checklist/generate-visit-checklist.ts`
- **Design Principle:** 100% deterministic, zero-LLM rule engine. Identical `PropertyAuditReport`, `profile`, and injected `now` timestamp always produce byte-for-byte identical output.

---

## 1. Deterministic Alert Rules (`VISIT_CHECKLIST_ITEM_IDS`)

| Item ID | Category | Source Layer | Trigger Condition | Severity |
|---|---|---|---|---|
| `substandard_housing` | `legal` | `catastro` | Non-residential cadastral use (`COMERCIAL`, `ALMACÉN`, `INDUSTRIAL`, `OFICINAS`) on ground/basement floor (`HIGH` severity) | `critical` |
| `flood_hazard` | `environmental` | `snczi` | MITECO SNCZI `MEDIUM` / `HIGH` return period or Preferential Flow Zone | `critical` (`HIGH` / ZFP) / `important` (`MEDIUM`) |
| `ite_action_required` | `structural` | `ite` | Municipal ITE/IEE status is `UNFAVORABLE`, `PENDING`, `PREVENTIVE_REQUIRED`, or `isPreventiveAlert` | `critical` (`UNFAVORABLE`) / `important` |
| `radon_ground_contact` | `environmental` | `radon` | CTE DB-HS 6 `Zona I` or `Zona II` with ground contact (`floorLevel <= 0`) or `requiresMitigation` | `critical` (`Zona II`) / `important` (`Zona I`) |
| `noise_high` | `environmental` | `sica` | MITECO SICA `dayEveningNightDecibels >= 65` dBA Lden | `critical` (`>= 75`) / `important` (`>= 65`) |
| `seismic_vulnerable` | `structural` | `seismic` | Pre-NCSE-94 vulnerability (`isVulnerableToSeismic`) or `ab >= 0.12g` / `HIGH` | `critical` (`>= 0.12g` & vulnerable) / `important` |
| `vut_high_pressure` | `neighborhood` | `vut` | Tourist apartment ratio `vutRatioPct >= 3.0%` in census section | `critical` (`>= 8.0%`) / `important` (`>= 3.0%`) |
| `capex_high` | `structural` | `catastro` | `capexRiskScore < 50`, `reserveFundAdequacy === 'deficit_severe'`, or `elevatorRisk` | `critical` (`< 40` / `deficit_severe`) / `important` |
| `urban_planning_risk` | `legal` | `urbanPlanning` | `isProtectedLand`, `URBAN_UNCONSOLIDATED`, `RUSTIC_COMMON`, `RUSTIC_PROTECTED`, or `isStressedHousingZone` | `critical` (`isProtectedLand` / `RUSTIC_PROTECTED`) / `important` |
| `age_old_building` | `structural` | `catastro` | Built building age `>= 50` years relative to injected `now` | `important` |
| `cee_expired` | `energy` | `cee` | Official CEE `isExpired === true` (RD 390/2021) | `important` |
| `cee_missing` | `energy` | `cee` | Built property with missing or estimated CEE when `cee` layer is `ok`/`stale` | `important` |
| `broadband_verify_portal` | `neighborhood` | `broadband` | Official SETELECO / CNMC dataset granularity !== `'parcel'` or FTTH coverage < 90% | `info` (`important` if `< 50%`) |

---

## 2. Unverified & Stale Layer Rule (`unverified_<layer>`)

For every layer in `ALL_LAYER_KEYS` (except `reason === 'not_applicable'`):

- **`unavailable`** or **`out_of_coverage`**: Always emits an `unverified_<layer>` verification item with concrete document/on-site check actions. Never omitted silently.
  - Critical layers (`sica`, `snczi`) emit `critical` severity.
  - All other layers emit `important` severity.
- **`stale`**: Always emits an `unverified_<layer>` verification item with snapshot age (`staleDays`) and currency verification prompt (`important` for critical layers, `info` for non-critical layers).

---

## 3. Ordering & Export Formats

- Items are sorted deterministically by:
  1. Effective severity rank (`critical: 0`, `important: 1`, `info: 2`) adjusted by `PROFILE_CHECKLIST_BOOSTS[profile]`.
  2. Base severity rank.
  3. ASCII `id` ascending.
- **Exports:** Client-side downloadable Markdown (`.md`), plain text (`.txt`), and A4 print stylesheet (`window.print()`) with physical checkboxes.

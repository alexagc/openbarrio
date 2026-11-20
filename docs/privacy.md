# OpenBarrio Privacy & Telemetry Policy

- **Policy Version:** `1.5.0`
- **Source of Truth:** `packages/core/src/types/analytics.ts` and `packages/core/src/types/visit-mode.ts`
- **Published Public Page:** `https://openbarrio.org/privacidad` (`es`, `en`, `ca`, `gl`, `eu`)

---

## 1. Privacy-by-Design Guarantees

OpenBarrio is built on strict data minimization: **what is never collected cannot be leaked, sold, or profiled**.

- **Zero third-party cookies or ad trackers.**
- **Zero Personally Identifiable Information (PII):** no names, emails, accounts, login sessions, or device fingerprints.
- **Zero stored IP addresses:** transient IP rate-limiting buckets exist only in volatile Cloudflare Worker isolate memory (`30` req/min, `300` req/day per IP) and are never logged or written to D1.
- **Zero geographic or cadastral tracking:** telemetry payloads never contain `refcat`, street addresses, municipality codes, postal codes, or coordinates (`lat`/`lon`), and aggregate storage has no geographic dimension.
- **Strict payload & schema firewall:** `POST /api/v1/telemetry` enforces `ANALYTICS_MAX_PAYLOAD_BYTES = 1024` bytes and TypeBox `additionalProperties: false`. Any payload with unknown keys or extra fields is rejected with HTTP `400` RFC 7807.

---

## 2. Legal Basis & Consent Model (ePrivacy & GDPR)

OpenBarrio applies Spanish and EU privacy law (**Art. 22.2 LSSI-CE / ePrivacy Directive** and **Art. 6.1.a GDPR**):

1. **Before decision or when rejected (zero device storage):**
   - Nothing is written to `localStorage`, `sessionStorage`, or cookies.
   - No `returning14d` linkage is computed or sent across visits.
   - Only non-linkable daily aggregate event counters (`standard` or lens enum buckets) may be incremented in memory and flushed in batches to D1.
2. **Only after explicit opt-in acceptance (`Accept`):**
   - A random client-side identifier is stored locally under `openbarrio_analytics_v1` solely to detect whether a browser returns within `ANALYTICS_RETURNING_WINDOW_DAYS = 14` days.
   - Even after acceptance, **the random local identifier itself is never transmitted** to OpenBarrio servers — the client computes a boolean `returning14d: true` flag locally and transmits only that boolean with the closed event name.
3. **Equal prominence & instant withdrawal:**
   - The consent banner presents **Reject** and **Accept** controls with equal visual weight and zero dark patterns.
   - Withdrawing consent in the `/privacidad` view immediately deletes `openbarrio_analytics_v1` from `localStorage`.

---

## 3. Exact Telemetry Events Collected

The closed `AnalyticsEventName` enum defines the **only** events accepted by `/api/v1/telemetry`:

| Event ID | Trigger | Allowed Properties | Purpose |
|---|---|---|---|
| `dossier_generated` | Live property due diligence audit succeeds | `returning14d` (optional boolean, only if opted in) | Measure core civic audit demand without storing property details |
| `lens_used` | User switches thematic lens, profile, or checklist lens | `lens` (`profile`, `layer`, `checklist`), `returning14d` (optional boolean) | Understand which analytical lenses help citizens most |
| `checklist_exported` | User prints or exports an on-site visit checklist | `returning14d` (optional boolean, only if opted in) | Measure field-visit checklist utility |
| `visit_mode_enabled` | User explicitly saves a dossier locally for offline Visit Mode | `returning14d` (optional boolean, only if opted in) | Measure offline field-visit adoption |

### Closed `lens` Enum (`ANALYTICS_LENS_VALUES`)
- `profile`
- `layer`
- `checklist`

---

## 4. Retention, Storage & Technical Limits

- **Maximum payload size:** `ANALYTICS_MAX_PAYLOAD_BYTES = 1024` bytes (`1 KB`).
- **Returning-visit measurement window:** `ANALYTICS_RETURNING_WINDOW_DAYS = 14` days.
- **Aggregate retention period:** `ANALYTICS_RETENTION_MONTHS = 13` months.
- **Storage model:** Batched daily aggregates `(day, event, bucket, count)` in Cloudflare D1 (`telemetry_daily_aggregates`). There are **no per-user or per-event rows**.
- **Automated deletion:** The monthly maintenance cron (`scheduled()` in `apps/api/src/worker.ts`) automatically executes `DELETE FROM telemetry_daily_aggregates WHERE day < cutoffDay` for aggregates strictly older than `13` months.

---

## 5. Measurement Bias Disclosure

Because 14-day returning-visit tracking is strictly opt-in under Art. 22.2 LSSI-CE, devices that reject or dismiss consent never store a local identifier and are counted solely as standard non-linkable daily events. Consequently, the `returning14d` ratio reflects only consenting visitors and under-counts total returning usage. OpenBarrio accepts this measurement bias as an intentional trade-off for user autonomy.

---

## 6. Browser Extension & Local Visit Mode Storage

- **Chrome / Browser Extension (`apps/extension`):** Collects **zero analytics** in v1.5.0 to avoid requiring extra permissions or transmitting browsing context from third-party property portals.
- **PWA Visit Mode (`ob-dossier-v1` IndexedDB):** When you explicitly click *"Save for visit"*, the dossier, checklist, profile, and source status snapshot are stored **exclusively in your browser's local IndexedDB** (maximum `VISIT_MODE_MAX_DOSSIERS = 10` dossiers with automatic LRU eviction of the oldest unused entry). OpenBarrio never syncs or uploads saved visit dossiers to any server.

---

## 7. Exercising Your Rights

Because OpenBarrio stores zero personal data, zero IP addresses, and zero user accounts on its servers, there is no server-side personal profile to access or rectify. You can immediately:

1. **Withdraw opt-in measurement consent** on `/privacidad` (which wipes `openbarrio_analytics_v1` from `localStorage`).
2. **Delete locally saved Visit Mode dossiers** individually from the Saved Visits panel or via your browser's site-data settings.

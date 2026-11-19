# Frontend React Rules

## 1. Principles
* **Framework:** React 19 / 18 with TypeScript and Vite.
* **Styling:** Tailwind CSS with modern, clean components inspired by Shadcn UI.
* **Icons:** Lucide React (`lucide-react`).
* **State & Data Fetching:** React Query / TanStack Query or native typed fetch wrappers.

## 2. Interactive Map (MapLibre GL)
* Use MapLibre GL for rendering maps without proprietary API keys.
* Overlay layers:
  * Cadastral parcel footprint (from Catastro WMS/WFS).
  * Census tract income heatmap (from INE ADRH).
  * Points of interest (health centers, schools).

## 3. Due Diligence Scoring Display
* Visual indicators must strictly reflect `TrafficLightState` from `@openbarrio/core` without masking missing or unverified layers as safe:
  * **Green (`GREEN`):** Score >= 70 with >= 3/5 pillars and critical environmental layers (`sica`, `snczi`) verified.
  * **Amber (`AMBER`):** Moderate risk or critical layer unevaluated ceiling (never shown green while `sica` or `snczi` is missing).
  * **Red (`RED`):** High risk (low score, flood zone, or severe alerts).
  * **Gray (`UNCERTAIN`):** Insufficient pillar coverage (`<3/5` pillars) or missing/uncovered layer cards (`LayerStatusBadge` / `DataUnavailableState`, showing explicit verification date when `stale`).
* Keep public routes `/estado-fuentes` and `/metodologia` localized across all 5 languages (`es`, `en`, `ca`, `gl`, `eu`) and linked cleanly from `Header`, `Footer`, `AuditDossier`, and `CertifiedPdfReport`.

## 4. Multilingual i18n & Programmatic SEO Mandate
* Zero hardcoded user-facing strings: every component must consume copy via `useTranslation()` (`t('namespace.key')`).
* Full 5-language support and key parity: Spanish (`es`), English (`en`), Catalan/Valencian (`ca`), Galician (`gl`), Basque (`eu`), all exported from `apps/web/src/i18n/index.ts`.
* Localized path routing and dynamic `<SeoHead>` (`<link rel="canonical">` + `<link rel="alternate" hreflang="...">` for all 5 languages + `x-default`).
* Refer to [i18n & Programmatic SEO Rules](file:///.agent/rules/i18n-and-seo.md).

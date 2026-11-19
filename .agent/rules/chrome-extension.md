# Chrome Extension Rules

## 1. Principles
* **Architecture:** Manifest V3 strictly (no remotely hosted executable scripts or `eval()`).
* **Build System:** Vite + TypeScript.
* **Permissions:** Minimal permissions (`activeTab`, `storage` only — never add broader permissions without explicit user review).

## 2. Content Scripts & Remote Selectors
* **Targets:**
  * Idealista (`idealista.com`), Fotocasa (`fotocasa.es`), Habitaclia (`habitaclia.com`), Pisos.com (`pisos.com`), YaEncontre (`yaencontre.com`).
* **DOM & Uncertainty Safety:**
  * Never block page render; use idempotent injection checks (`#openbarrio-audit-root`) and escape all rendered fields (`escapeHtml`, `sanitizeUrl`).
  * Propagate `UNCERTAIN` (gray state), missing environmental layers (`sica`, `snczi`), and stale verification dates via 5-language `shared/i18n.ts` without fabricating defaults.
  * Remote CSS selectors from `/api/v1/extension/selectors` must be JSON-only (`<= 32 KB`), TypeBox-validated, non-downgrading semver, and fall back to `BUNDLED_PORTAL_SELECTORS`.

## 3. Communication
* Use typed message passing (`GET_CONFIG`, `GET_SELECTORS`, `AUDIT_COORDS`, `AUDIT_REFCAT`, `CHECK_HEALTH`) between content scripts and background service worker.
* Connect directly to the OpenBarrio Core API.

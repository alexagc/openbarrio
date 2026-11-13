# Internationalization (i18n) & Programmatic SEO Rules 🌐🇪🇸

> **Mandatory Standard for AI Agents & Contributors:** All frontend components, routes, and views in `apps/web` must strictly adhere to these multilingual and search engine optimization rules.

---

## 1. Zero-Hardcoding Copy Policy

* **Strict Prohibition:** Never write hardcoded user-facing text strings in JSX/TSX components (headings, paragraphs, buttons, tooltips, placeholders, table headers, error banners, or modal contents).
* **Single Source of Truth:** All copy must be defined in `apps/web/src/i18n/types.ts` (`TranslationSchema`) and implemented across all active language dictionaries (`es.ts`, `en.ts`, `ca.ts`, `gl.ts`, `eu.ts`).
* **Hook Usage:** Components must consume text using `const { t, language } = useTranslation()`.
  ```tsx
  // ❌ Bad
  <button>Comprobar Metros</button>

  // ✅ Good
  <button>{t('surfaceChecker.title')}</button>
  ```
* **Dynamic Interpolation:** Use named placeholder parameters `{{param}}` for dynamic numbers or entities:
  ```tsx
  // Dictionary: auditToolsTitle: 'Herramientas de Auditoría para {{name}}'
  t('municipalities.auditToolsTitle', { name: data.name })
  ```

---

## 2. Five Supported Territorial Languages

OpenBarrio covers the entire territory of Spain, including autonomous communities with co-official languages and historical foral taxation regimes:

1. **`es` (Español / Castellano):** Default baseline language (`x-default` canonical fallback).
2. **`en` (English):** Tailored for international investors, expats, and non-resident buyers.
3. **`ca` (Català / Valencià):** Official terminology for Catalunya and Comunitat Valenciana (e.g. *Llei 12/2023*, *zones tensionades*).
4. **`gl` (Galego):** Official terminology for Galicia, particularly crucial for radon mitigation (*Zona II*) and rural cadastral parceling.
5. **`eu` (Euskera):** Official terminology for Euskadi (Bizkaia, Gipuzkoa, Araba) and Navarra, aligned with our native Foral Connectors (*Foru Ogasunak*).

---

## 3. Programmatic SEO & Routing Protocol

* **Bidirectional Localized Paths:** Defined in `apps/web/src/utils/seo-routes.ts`. Every tool and programmatic directory page must provide SEO-friendly slugs per language:
  - ES: `/herramientas/comprobar-metros`
  - EN: `/en/tools/surface-checker`
  - CA: `/ca/eines/comprovar-metres`
  - GL: `/gl/ferramentas/comprobar-metros`
  - EU: `/eu/tresnak/metroak-egiaztatu`
* **Canonical & Hreflang Tags:** Every view must render `<SeoHead>` generating:
  - Exact `<link rel="canonical">` for the current page and language.
  - `<link rel="alternate" hreflang="...">` tags for all 5 languages plus `x-default`.
  - Dynamic localized `<title>` and `<meta name="description">`.
  - Up-to-date `<html lang="...">` attribute.
* **Sitemap Generation:** `sitemap.xml` and API sitemap endpoints must publish valid Google-compliant `<url>` entries with `<xhtml:link rel="alternate" hreflang="..." />` children.
* **SPA Navigation & URL Sync:**
  - Switching languages via the Header pill (`ES | EN | CA | GL | EU`) must update the browser URL via `history.pushState` to the equivalent localized path.
  - Navigation transitions between view modes or municipalities must trigger `window.scrollTo({ top: 0, left: 0, behavior: 'instant' })`.

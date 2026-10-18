# Chrome Web Store Listing & Publication Guide 🏬

This document serves as the single source of truth for the **OpenBarrio** Chrome Web Store listing metadata, permissions justifications, privacy disclosures, and pre-publish readiness.

---

## 1. Store Listing Details

* **Extension Name:** OpenBarrio - Due Diligence Inmobiliario Oficial
* **Version:** 0.1.0
* **Short Description (max 132 chars):**
  Auditoría pública en tiempo real de Catastro, INE, MITECO y MIVAU para anuncios en Idealista y Fotocasa.
* **Category:** Productivity / Real Estate & Tools
* **Primary Language:** Spanish (Spain)
* **Pricing:** Free / Open Source (Apache-2.0)

### Detailed Description (Markdown formatted for Store Dashboard):
```markdown
OpenBarrio es tu auditor inmobiliario público en el navegador. Cuando buscas vivienda en Idealista o Fotocasa, OpenBarrio consulta de forma instantánea y automática las fuentes oficiales del Estado español para ofrecerte transparencia total antes de tomar una decisión inmobiliaria:

🔹 Barrio Score (0-100): Puntuación integral de idoneidad basada en el nivel socioeconómico de la sección censal, la calidad constructiva del edificio, el confort acústico y la seguridad climática.

🔹 Alerta de Zona Tensionada (Ley 12/2023 por el Derecho a la Vivienda): Detecta si la vivienda se encuentra en una zona con mercado de alquiler tensionado y calcula la horquilla oficial de precios de referencia del MIVAU (SERPAVI) en €/m² y cuota mensual estimada.

🔹 Confort Acústico (MITECO SICA): Conoce el nivel de ruido en decibelios (dBA Lden) procedente del tráfico rodado, ferrocarril o industria en la fachada del inmueble.

🔹 Cartografía de Inundabilidad (MITECO SNCZI): Verifica si el edificio se sitúa en zona inundable según períodos de retorno (T=10, T=50, T=100, T=500 años) o en Zona de Flujo Preferente.

🔹 Datos Oficiales de Catastro: Año real de construcción según la Sede Electrónica del Catastro, metros cuadrados construidos reales y verificación de la Referencia Catastral.

🔹 Privacidad Garantizada: OpenBarrio no recopila datos personales, historial de navegación ni información de cuentas de usuario. Solo consulta registros públicos oficiales abiertos para la propiedad visualizada.
```

---

## 2. Permissions Justification

| Permission / Host | Specific Review Justification |
| :--- | :--- |
| `activeTab` | Required to read the URL and property coordinates of the currently active tab when the user interacts with the extension popup or views a property listing on Idealista or Fotocasa. |
| `storage` | Used exclusively to cache public audit responses locally on the user's device for 24 hours to prevent redundant network requests, and to persist user-configured API endpoints. |
| `*://*.idealista.com/*` | Required to inject the non-blocking due diligence audit card on Idealista property listing pages (`/inmueble/*`). |
| `*://*.fotocasa.es/*` | Required to inject the non-blocking due diligence audit card on Fotocasa property listing pages (`/comprar/*` and `/alquiler/*`). |
| `http://localhost:3001/*` | Required for local development to communicate with the self-hosted OpenBarrio API server. |
| `https://*.workers.dev/*` | Required to query official normalized property audits from the OpenBarrio production Cloudflare Workers API. |
| `https://api.openbarrio.org/*` | Required to query official normalized property audits from the OpenBarrio primary production API domain. |

---

## 3. Privacy & Data Use Disclosures

* **Data Collection Status:** **Does not collect or transmit user personal data.**
* **Browsing History:** Not collected. The extension only inspects URLs matching the declared host permissions (`idealista.com/inmueble/*` and `fotocasa.es/*/comprar/*`, `fotocasa.es/*/alquiler/*`).
* **Personal Communications:** None.
* **Financial and Payment Information:** None.
* **Authentication Information:** None.
* **Location Data:** Coordinates extracted from public property listings are used strictly in real-time to query official public cadastral, demographic, and acoustic registers. No device geolocation or user location is accessed or stored.

---

## 4. Assets & Store Media

* **Icons:**
  * `apps/extension/icons/icon-16.png` (16×16px)
  * `apps/extension/icons/icon-48.png` (48×48px)
  * `apps/extension/icons/icon-128.png` (128×128px)
* **Promotional Screenshots (Planned for Store Submission):**
  * Screenshot 1: Audit card injected on an Idealista listing showing Barrio Score and CTE building era.
  * Screenshot 2: Stressed Housing Zone (Ley 12/2023) rent cap alert card.
  * Screenshot 3: Acoustic comfort and flood safety metrics.
  * Screenshot 4: Action popup with quick search and settings.

---

## 5. Pre-Publish Review Checklist

- [x] Manifest V3 compliance with no legacy V2 APIs.
- [x] Minimal permissions (`activeTab`, `storage`).
- [x] All icon files exist as valid PNG images with exact pixel dimensions.
- [x] Isolated Shadow DOM ensuring no CSS pollution with host websites.
- [x] Plain-English justifications for all permissions and host permissions.
- [x] Zero tracking, analytics, or third-party ad libraries.
- [x] Asynchronous message passing between content script and background service worker.

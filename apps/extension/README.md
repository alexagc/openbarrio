# OpenBarrio Chrome Extension (Manifest V3) 🏘️🧩

Companion browser extension for **OpenBarrio** that injects real-time public due diligence audits directly into Spanish real estate listing portals (**Idealista** and **Fotocasa**).

---

## 🚀 Key Features

* **Instant Barrio Score (0-100):** Visual indicator with dynamic color coding (Green: >=70, Amber: 50-69, Red: <50) evaluating socioeconomic standing, building age, acoustic comfort, and flood safety.
* **Stressed Housing Zone Badge (Ley 12/2023):** Displays official statutory rent price caps (`€/m²` and estimated monthly rent range) when a property is located in an officially declared *Zona Tensionada*.
* **Environmental & Risk Due Diligence:**
  * **SICA Acoustic Level:** Day-evening-night decibel rating (`Lden dBA`) and category (Quiet, Moderate, Noisy).
  * **SNCZI Flood Risk Cartography:** MITECO flood hazard level (`T=10`, `T=50`, `T=100`, `T=500` return periods) and *Zona de Flujo Preferente* warnings.
* **Shadow DOM Isolation:** 100% style isolation ensuring the widget never conflicts with host portal styles or breaks portal layouts.
* **Non-Blocking & Resilient Extraction:**
  * Supports JSON-LD (`schema.org/Apartment`, `Product`, `Place`), Next.js `__NEXT_DATA__`, meta tags, and DOM selectors.
  * Robust fallback to Cadastral Reference (RC) or coordinates geocoding.
  * Silent error handling ensuring a clean, non-intrusive user experience.
* **Collapsible & Dismissible:** Switch between full audit card and compact floating pill with a single click.
* **Action Popup:** Displays active tab portal detection, custom endpoint configuration (Local Dev vs Cloudflare Workers Edge), and quick Cadastral Reference search.

---

## 🛠️ Architecture & Manifest V3 Design

```
apps/extension/
├── manifest.json              # Chrome Manifest V3 configuration
├── build.js                   # Vite multi-bundle build script (IIFE content, ESM background, HTML popup)
├── icons/                     # Official PNG icons (16px, 48px, 128px)
├── src/
│   ├── background.ts          # MV3 Service Worker (API proxy, 24h caching, endpoint management)
│   ├── content/
│   │   ├── index.ts           # Content script entry (portal detection, SPA observer)
│   │   ├── extractors/        # Resilient extractors (Idealista & Fotocasa)
│   │   │   ├── types.ts       # Extractor interfaces & ExtractedPropertyData
│   │   │   ├── idealista.ts   # JSON-LD & DOM extractor for Idealista
│   │   │   └── fotocasa.ts    # JSON-LD, NextData & DOM extractor for Fotocasa
│   │   └── ui/                # Isolated Shadow DOM widget
│   │       ├── widget.ts      # OpenBarrioWidget controller
│   │       ├── styles.ts      # Encapsulated CSS stylesheet
│   │       └── templates.ts   # HTML templates (skeleton, card, pill, error)
│   ├── popup/                 # Action popup UI
│   │   ├── index.html         # Popup markup
│   │   ├── popup.ts           # Popup logic & active tab inspection
│   │   └── styles.css         # Popup modern styling
│   └── shared/                # Cross-context contracts
│       ├── config.ts          # Default and production endpoints
│       ├── messages.ts        # Typed Chrome message passing
│       └── utils.ts           # Score styles, labels & URL builders
└── tests/
    ├── fixtures/              # Real-world HTML fixtures (Idealista & Fotocasa)
    ├── idealista.extractor.test.ts
    ├── fotocasa.extractor.test.ts
    ├── widget.test.ts
    └── messaging.test.ts
```

---

## 📦 Building and Testing

In accordance with OpenBarrio's **Zero-Install local workflow**, all builds and tests are executed automatically in **GitHub Actions CI**. When developing in Codespaces or locally:

```bash
# Run unit tests across all extractors and widget logic
pnpm --filter @openbarrio/extension run test

# Compile TypeScript and bundle extension assets into apps/extension/dist/
pnpm --filter @openbarrio/extension run build
```

---

## 🌐 Loading Unpacked Extension in Google Chrome

1. Build the extension artifacts: `pnpm run build`
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in upper right corner).
4. Click **Load unpacked** and select `apps/extension/dist/`.
5. Open any property listing on [Idealista](https://www.idealista.com) or [Fotocasa](https://www.fotocasa.es) to see the OpenBarrio Due Diligence widget.

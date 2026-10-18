# Chrome Extension Rules

## 1. Principles
* **Architecture:** Manifest V3 strictly.
* **Build System:** Vite + TypeScript.
* **Permissions:** Minimal permissions (`activeTab`, `storage`).

## 2. Content Scripts
* **Targets:**
  * `https://www.idealista.com/inmueble/*`
  * `https://www.fotocasa.es/*/comprar/*`
  * `https://www.fotocasa.es/*/alquiler/*`
* **DOM Safety:**
  * Never block page render.
  * Use safe DOM mutation observers or idempotent injection checks (`#openbarrio-audit-root`).
  * Injected card must match portal aesthetics (clean floating badge or integrated side card).

## 3. Communication
* Use typed message passing between content scripts and background service worker.
* Connect directly to the OpenBarrio Core API.

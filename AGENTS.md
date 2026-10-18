# OpenBarrio: AI Agent Guidelines & Architecture Rules 🏘️🇪🇸

> **Universal Agent Instructions:** This document serves as the single source of truth for all AI coding assistants (Google Antigravity, Cursor, Claude Code, GitHub Copilot) and human contributors working on **OpenBarrio**.

---

## 1. Core Mission & Philosophy

* **What is OpenBarrio:** An open-source civic-tech and real estate due diligence platform that aggregates, normalizes, and visualizes official open data from Spanish public administrations:
  * **Sede Electrónica del Catastro** (OVC REST/WFS: construction year, surface area, usage, horizontal division).
  * **INE** (Instituto Nacional de Estadística: Atlas de Distribución de Renta de los Hogares - ADRH, demographics).
  * **MITECO** (SICA noise levels and SNCZI flood risk mapping).
  * **MIVAU** (SERPAVI rental price reference index).
* **Delivery Formats:**
  1. **Core API:** High-performance Hono Universal backend (Cloudflare Workers & Node.js) with automatic OpenAPI/Swagger documentation.
  2. **Web Dashboard:** Interactive React + MapLibre GL exploration app with printable due diligence reports.
  3. **Browser Extension:** Chrome Manifest V3 companion widget injecting instant public audit cards directly into property portals (Idealista & Fotocasa).
* **Strict English Mandate:** All code, identifiers, comments, documentation, commit messages, issue templates, and internal notes **MUST be written in English**. No exceptions.

---

## 2. Zero-Install Workflow (Crucial Rule)

* **Local Machine Policy:** Do **NOT** assume or require local installation of Node.js, pnpm, Docker, or native build tools on the developer's workstation. The local environment is strictly for code authoring and Git version control.
* **Build & Validation Authority:** All compilation, linting, formatting checks, and automated Vitest suites run in **GitHub Actions CI**.
* **Cloud Debugging & Execution:** When an interactive runtime environment is needed, launch **GitHub Codespaces** (`.devcontainer/devcontainer.json`).
* **Contribution Flow:** Edit files locally -> Commit/Push to a feature branch -> Open PR -> Verify via GitHub Actions CI pipeline.

---

## 3. Architecture & Monorepo Boundaries

OpenBarrio is structured as a **pnpm workspaces monorepo** with strict boundary separation:

```
openbarrio/
├── .agent/rules/           # Domain-specific AI rules
├── .devcontainer/          # Codespaces configuration (Node 22 + pnpm)
├── .github/workflows/      # Automated CI pipelines
├── .notes/                 # Local developer boards (gitignored)
├── apps/
│   ├── api/                # Hono Universal backend service (Cloudflare Workers & Node.js)
│   ├── web/                # React + Vite web dashboard (Cloudflare Pages)
│   └── extension/          # Chrome Extension (Manifest V3)
├── packages/
│   └── core/               # Shared TypeScript schemas, DTOs & scoring formulas
├── Makefile                # Standard workflow commands
├── pnpm-workspace.yaml     # Monorepo workspace configuration
└── tsconfig.base.json      # Shared TypeScript configuration
```

### 3.1. Shared Core Rules (`packages/core`)
* All data transfer objects (DTOs), API request/response contracts, and domain models **MUST** be defined in `packages/core`.
* **Zero duplication:** Never duplicate Catastro, INE, or Audit models across `apps/api`, `apps/web`, or `apps/extension`.
* Use TypeBox or native TypeScript types for compile-time and runtime validation parity.

### 3.2. Hono Backend Rules (`apps/api`)
* **Hexagonal Architecture:** External services (`catastro`, `ine`, `miteco`, `mivau`) must be implemented behind provider interfaces with in-memory mock implementations for isolated testing.
* **Standardized Error Handling:** All API errors must conform to **RFC 7807 (Problem Details for HTTP APIs)**.
* **Schema Validation:** Every route must declare input (params, query, body) and response schemas.

### 3.3. Web Application Rules (`apps/web`)
* **Component Design:** Clean, modular React components styled with Tailwind CSS.
* **Map Engine:** Use **MapLibre GL** for rendering vector tiles, cadastral parcels, and census tract overlays.
* **Resilience:** Handle missing or partial provider data gracefully (e.g. when an address is found in Catastro but noise data is unavailable).

### 3.4. Chrome Extension Rules (`apps/extension`)
* **Manifest V3 Only:** Strictly adhere to Chrome Manifest V3 standards.
* **Content Script Isolation:** Content scripts injected into Idealista or Fotocasa must be isolated, perform non-blocking DOM checks, and communicate securely with the OpenBarrio API.

### 3.5. Data Ingestion & Sovereignty Rules (Option B)
* **Zero External Rate Limits for INE:** Census tract income (INE ADRH) and geographic boundary resolution (IGN Seccionado Censal) **MUST NOT** rely on synchronous external APIs in production.
* **Autonomous ETL Pipeline:** A GitHub Actions workflow (`.github/workflows/data-pipeline.yml`) using **DuckDB Spatial** processes official raw census files:
  - Ingests INE ADRH CSVs (~36,000 tracts) -> stored in **Cloudflare D1** (SQLite) for sub-5ms income queries.
  - Ingests IGN boundary polygons -> simplified and stored in **Cloudflare R2** as **PMTiles** for dual-use (Edge Point-in-Polygon spatial resolution and MapLibre GL frontend vector heatmaps).
* **Catastro & MITECO Hybrid Access:**
  - Catastro OVC: On-demand live queries proxied and protected via Cloudflare Cache API (60-day TTL).
  - MITECO: On-demand WMS `GetFeatureInfo` queries.

---

## 4. Multi-Agent & Git Protocol

To support concurrent work between humans and autonomous AI agents:

1. **Check Task Board:**
   * Always inspect `.notes/TASK_BOARD.md` before claiming a task.
   * Update task status (`In Progress`, `Done`).
2. **Branching & Commits:**
   * Branch naming: `feat/<feature>`, `fix/<bug>`, `docs/<topic>`, `chore/<task>`.
   * **Conventional Commits:** `feat:`, `fix:`, `docs:`, `test:`, `chore:` in English.
   * Merging is strictly via **Squash & Merge**.
3. **Protect Private Context:**
   * Never commit `.notes/`, `.env`, or credential tokens.

---

## 5. Specialized Rules
Refer to `.agent/rules/` for in-depth guidelines:
* [Backend Hono Rules](file:///.agent/rules/backend-hono.md)
* [Frontend React Rules](file:///.agent/rules/frontend-react.md)
* [Chrome Extension Rules](file:///.agent/rules/chrome-extension.md)
* [Git & Workflow Rules](file:///.agent/rules/git-workflow.md)
* [Testing Standards](file:///.agent/rules/testing-standards.md)

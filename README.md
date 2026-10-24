# OpenBarrio 🏘️🇪🇸

[![CI Pipeline](https://github.com/alexagc/openbarrio/actions/workflows/ci.yml/badge.svg)](https://github.com/alexagc/openbarrio/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Runtime: Node.js 22 LTS](https://img.shields.io/badge/Runtime-Node.js_22_LTS-green.svg)](https://nodejs.org/)
[![Monorepo: pnpm](https://img.shields.io/badge/Monorepo-pnpm_workspaces-orange.svg)](https://pnpm.io/)
[![Docker: Ready](https://img.shields.io/badge/Docker-Zero--Pollution_Ready-2496ED.svg)](docker-compose.yml)

**OpenBarrio** is an open-source civic-tech and real estate due diligence platform that aggregates, normalizes, and visualizes official open data from Spanish public institutions:
* **Sede Electrónica del Catastro** (Construction year, built surface area, property usage, cadastral parcel, horizontal division).
* **INE (Instituto Nacional de Estadística)** (Atlas de Distribución de Renta de los Hogares - ADRH, demographics).
* **MITECO** (SICA strategic noise maps, SNCZI flood vulnerability areas, and official Air Quality).
* **MIVAU** (SERPAVI rental price reference index under Ley 12/2023).

---

## 🚀 Quick Start with Docker (Zero Host Pollution)

You can run the full OpenBarrio stack locally using **Docker Desktop** without installing Node.js, pnpm, or databases on your host machine:

### 1. Launch the Stack
```bash
make docker-up
# or:
docker compose up -d
```

### 2. Available Local Endpoints
* **Web Dashboard:** [http://localhost:5173](http://localhost:5173) (Vite React + MapLibre GL)
* **REST API:** [http://localhost:3001](http://localhost:3001) (Hono Universal API)
* **OpenAPI / Swagger:** [http://localhost:3001/docs](http://localhost:3001/docs)

### 3. Preloaded Official Real Data
The local container automatically seeds and connects to a local SQLite database (`data/openbarrio.sqlite`) containing:
* **~37,000 Spanish census sections** from the official INE ADRH dataset (household income, percentiles, demographics).
* **National civic facilities database** (schools, health centers, transit hubs) for sub-5ms 15-Minute City walkability scores.
* **Direct live connection** to Sede del Catastro OVC and MITECO WMS services.

### 4. Running Tests in Docker
Before committing or submitting a PR, validate all tests inside Docker:
```bash
make docker-test
# or for linting:
make docker-lint
```

---

## 🏛️ Ecosystem Overview

The project is structured as a TypeScript monorepo with 100% shared types across three client/server tiers:

```
openbarrio/
├── packages/core/       # Shared TypeScript schemas, DTOs & scoring algorithms
├── packages/etl/        # Autonomous DuckDB Spatial pipeline for INE ADRH & IGN boundaries
├── apps/api/            # Hono Universal REST API (Cloudflare Workers & Node.js) with Swagger docs & RFC 7807 errors
├── apps/web/            # Interactive React + MapLibre GL due diligence dashboard
└── apps/extension/      # Chrome Extension (Manifest V3) for Idealista & Fotocasa
```

---

## 📋 Documentation & Architecture Rules
* See [AGENTS.md](file:///AGENTS.md) for universal contributor & AI assistant instructions.
* See [CHANGELOG.md](file:///CHANGELOG.md) for detailed version history and release notes.
* See [.agent/rules/](file:///.agent/rules/) for detailed backend, frontend, extension, and testing guidelines.

---

## ⚖️ License
Licensed under the [Apache License, Version 2.0](file:///LICENSE).

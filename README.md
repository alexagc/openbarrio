# OpenBarrio 🏘️🇪🇸

[![CI Pipeline](https://github.com/alexagc/openbarrio/actions/workflows/ci.yml/badge.svg)](https://github.com/alexagc/openbarrio/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Runtime: Node.js 22 LTS](https://img.shields.io/badge/Runtime-Node.js_22_LTS-green.svg)](https://nodejs.org/)
[![Monorepo: pnpm](https://img.shields.io/badge/Monorepo-pnpm_workspaces-orange.svg)](https://pnpm.io/)

**OpenBarrio** is an open-source civic-tech and real estate due diligence platform that aggregates, normalizes, and visualizes official open data from Spanish public institutions:
* **Sede Electrónica del Catastro** (Construction year, built surface area, property usage, cadastral parcel).
* **INE (Instituto Nacional de Estadística)** (Atlas de Distribución de Renta de los Hogares - ADRH, demographics).
* **MITECO** (SICA strategic noise maps and SNCZI flood vulnerability areas).
* **MIVAU** (SERPAVI rental price reference index).

---

## 🏛️ Ecosystem Overview

The project is structured as a TypeScript monorepo with 100% shared types across three client/server tiers:

```
openbarrio/
├── packages/core/       # Shared TypeScript schemas, DTOs & scoring algorithms
├── apps/api/            # Hono Universal REST API (Cloudflare Workers & Node.js) with Swagger docs & RFC 7807 errors
├── apps/web/            # Interactive React + MapLibre GL due diligence dashboard
└── apps/extension/      # Chrome Extension (Manifest V3) for Idealista & Fotocasa
```

---

## ⚡ Zero-Install Workflow

OpenBarrio enforces a **Zero Local Dependency Policy**:
* You do **not** need to install Node.js, pnpm, or build tools on your local host machine.
* **Continuous Integration:** All linting, testing, and building runs automatically on **GitHub Actions**.
* **Cloud Development:** One-click launch in **GitHub Codespaces** (`.devcontainer/devcontainer.json`) with an out-of-the-box preconfigured Node 22 + pnpm environment.

---

## 📋 Documentation & Architecture Rules
* See [AGENTS.md](file:///AGENTS.md) for universal contributor & AI assistant instructions.
* See [.agent/rules/](file:///.agent/rules/) for detailed backend, frontend, extension, and testing guidelines.

---

## ⚖️ License
Licensed under the [Apache License, Version 2.0](file:///LICENSE).

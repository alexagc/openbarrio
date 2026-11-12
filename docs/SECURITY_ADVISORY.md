# OpenBarrio Security Advisory & Hotfix Release v0.12.4 🛡️

**Release Date:** 2026-11-12  
**Advisory Severity:** Critical / High  
**Release Version:** `v0.12.4`  
**Classification:** Security Hotfix (OWASP Top 10 / OWASP API Security / CIS Benchmark)

---

## Executive Summary

The `v0.12.4` hotfix resolves multiple critical and high-severity security vulnerabilities discovered during a comprehensive codebase pentesting audit. The audit evaluated OpenBarrio's multi-tier architecture spanning Cloudflare Edge Workers, Cloudflare Pages, the Chrome Extension (Manifest V3), and containerized execution.

---

## Remediated Vulnerabilities

### 1. [CRITICAL] Arbitrary Local File Read / Path Traversal (CWE-22 / OWASP API8:2023)
* **Vulnerability:** Unsanitized file parameter in `GET /api/v1/tiles/:filename` allowed path traversal sequences (`../../`) in local/containerized environments.
* **Affected File:** `apps/api/src/routes/tiles.routes.ts`
* **CVSS v3.1:** **9.1** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
* **Remediation:** 
  - Implemented an immutable strict whitelist (`ALLOWED_TILE_FILES`) restricting requests to legitimate vector assets (`census_tracts.pmtiles`, `floods.pmtiles`, `noise.pmtiles`, `census_tracts_simplified.geojson`, `census_tracts.geojson`).
  - Added strict path validation using `path.basename` preventing directory traversal sequences.
  - Returned standardized RFC 7807 Problem Details (`400 Bad Request`) for any unauthorized access attempt.

### 2. [HIGH] Insecure Client Cache Bypass & Upstream DoS Amplification (CWE-400 / OWASP API4:2023)
* **Vulnerability:** Unauthenticated clients could send `Cache-Control: no-cache` to force edge cache bypass, causing request flooding against upstream Spanish public services (Sede Electrónica del Catastro, MITECO, INE).
* **Affected File:** `apps/api/src/middleware/cache.middleware.ts`
* **CVSS v3.1:** **7.5** (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:N/I:N/A:H)
* **Remediation:** 
  - Disabled arbitrary client cache bypass by default.
  - Restricted cache bypass to explicit internal testing configurations (`allowClientBypass: true`), protecting upstream government infrastructure from denial of service.

### 3. [HIGH] DOM Cross-Site Scripting (XSS) in Chrome Extension Injection (CWE-79 / OWASP A03:2021)
* **Vulnerability:** Dynamically extracted facility names, addresses, and portal strings were interpolated directly into `wrapper.innerHTML` on Idealista and Fotocasa pages without escaping.
* **Affected Files:** `apps/extension/src/content/ui/templates.ts`, `apps/extension/src/shared/utils.ts`
* **CVSS v3.1:** **7.4** (CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:L/A:N)
* **Remediation:** 
  - Added universal `escapeHtml` utility encoding `&`, `<`, `>`, `"`, `'`.
  - Added `sanitizeUrl` validating protocol schemes against `javascript:` and `data:` pseudo-protocols.
  - Escaped all external text attributes rendered inside the Shadow DOM widget.

### 4. [HIGH] Broken Access Control in Extension Message Passing (CWE-284 / OWASP A01:2021)
* **Vulnerability:** `chrome.runtime.onMessage` accepted `SET_CONFIG` requests from any context, allowing third-party webpage scripts to potentially reconfigure the API target.
* **Affected File:** `apps/extension/src/background.ts`
* **CVSS v3.1:** **7.1** (CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:H/A:N)
* **Remediation:** 
  - Added verification of `sender.tab`. Messages originating from content scripts are strictly forbidden from executing `SET_CONFIG`.

### 5. [MEDIUM] CI/CD Supply-Chain Determinism (CWE-829 / OWASP A08:2021)
* **Vulnerability:** Deployment workflow used `pnpm install --no-frozen-lockfile`, exposing production releases to dependency drifting or compromised package updates.
* **Affected File:** `.github/workflows/deploy.yml`
* **Remediation:** Enforced strict `pnpm install --frozen-lockfile`.

### 6. [MEDIUM] Cloudflare R2 Credentials & Masking in ETL (CWE-522 / OWASP A02:2021)
* **Vulnerability:** Raw token verification JSON was logged to CI output on error; pseudo-derivation was relied upon if secrets were unconfigured.
* **Affected File:** `.github/workflows/data-pipeline.yml`
* **Remediation:** Masked token ID logging and added explicit warnings requiring standard R2 S3 secrets.

### 7. [LOW] Dependency Harmonization
* **Remediation:** Updated `wrangler` in `apps/api/package.json` to match the root `^3.114.17` specification, eliminating CLI tooling discrepancies.

---

## Versioning & Deployment Matrix

| Workspace / Package | Previous Version | New Version | Status |
| :--- | :--- | :--- | :--- |
| **`openbarrio-monorepo` (root)** | `0.12.3` | **`0.12.4`** | ✅ Fixed |
| **`@openbarrio/api`** | `0.12.3` | **`0.12.4`** | ✅ Fixed |
| **`@openbarrio/web`** | `0.12.3` | **`0.12.4`** | ✅ Fixed |
| **`@openbarrio/extension`** | `0.12.3` | **`0.12.4`** | ✅ Fixed |
| **`@openbarrio/core`** | `0.12.3` | **`0.12.4`** | ✅ Fixed |
| **`@openbarrio/etl`** | `0.12.3` | **`0.12.4`** | ✅ Fixed |

---

## Automated Verification

The entire test suite covers all newly hardened boundaries:
- `apps/api/tests/routes/hardening.test.ts`: Verifies path traversal prevention, tile whitelist rejection, and edge cache DoS defense.
- `apps/extension/tests/messaging.test.ts`: Verifies sender origin isolation and HTML/URL sanitization.

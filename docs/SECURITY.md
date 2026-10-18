# OpenBarrio Security Policy & Governance 🛡️🇪🇸

OpenBarrio is an open-source civic-tech platform aggregating sensitive public data (Catastro, INE, MITECO, MIVAU) for real estate due diligence. We take the security, integrity, and privacy of our codebase, supply chain, and data pipelines with the highest engineering rigor.

---

## 1. Supported Versions

We actively provide security patches and dependency updates for the following release branches:

| Version | Supported | Security Policy |
| :--- | :---: | :--- |
| `0.2.x` (Edge & Hono Universal API) | ✅ | Active support, high/critical CVE patching |
| `0.1.x` (Initial foundation) | ❌ | Deprecated — upgrade to `0.2.x` |
| `main` (Development branch) | ✅ | Continuous SAST and supply chain analysis |

---

## 2. Reporting a Vulnerability

We appreciate responsible disclosure from security researchers and community contributors.

> [!IMPORTANT]
> **Please do NOT report security vulnerabilities through public GitHub issues or discussions.**

### 2.1. Responsible Disclosure Channels
* **GitHub Private Vulnerability Reporting (Preferred):**  
  Submit an advisory directly via the GitHub repository under **Security** &rarr; **Advisories** &rarr; **Report a vulnerability**.
* **Direct Security Contact:**  
  Email our core maintainer team at `security@openbarrio.org` (or directly to project maintainers) with the subject tag `[SECURITY] OpenBarrio Vulnerability Report`.

### 2.2. What to Include in Your Report
To help us triage and remediate the issue promptly, please include:
1. **Description:** Clear explanation of the vulnerability and its potential impact.
2. **Affected Components:** Affected packages or apps (`apps/api`, `apps/web`, `apps/extension`, `packages/core`, `packages/etl`).
3. **Reproduction Steps:** Minimal proof-of-concept (PoC) code, HTTP request sample, or step-by-step instructions.
4. **Proposed Mitigation:** Any suggested patch or remediation if available.

### 2.3. Response SLA & Timelines
* **Initial Acknowledgment:** Within **48 hours** of report receipt.
* **Triage & Impact Assessment:** Within **7 calendar days**.
* **Patch Release & Disclosure:** Coordinated release with CVE assignment where applicable, typically within **30 days**.

---

## 3. Security Architecture & Automated Governance

OpenBarrio enforces enterprise-grade security controls through automated CI pipelines and architectural boundaries:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Continuous CI Security Gate                     │
├───────────────────────┬────────────────────────┬───────────────────────┤
│    GitHub CodeQL      │   pnpm audit & Review  │    Automated Linters  │
│  (Extended SAST Scan) │ (Supply Chain Audits)  │ (ESLint Zero Warnings)│
│  • ReDoS / SSRF       │ • High/Crit CVE blocks │ • Strict TypeScript   │
│  • Injection checks   │ • License conformance  │ • RFC 7807 hygiene    │
└───────────────────────┴────────────────────────┴───────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Cloudflare Edge Runtime Guard                     │
│  • WAF & DDoS mitigation                       • Sub-5ms SQLite read   │
│  • Strict CSP & HTTP Security Headers          • Cache API isolation   │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Static Application Security Testing (SAST)
* **GitHub CodeQL:** Automated workflow (`.github/workflows/codeql.yml`) scanning on every `push` to `main`, every `pull_request`, and weekly cron.
* **Extended Query Suites:** Configured with `+security-extended,security-and-quality` targeting:
  - CWE-79 / Cross-Site Scripting (XSS).
  - CWE-918 / Server-Side Request Forgery (SSRF) in public data scrapers and proxies.
  - CWE-1333 / Inefficient Regular Expression Complexity (ReDoS).
  - SQL / Query injection in DuckDB spatial operations and Cloudflare D1 queries.

### 3.2. Automated Supply Chain & Dependency Management
* **Dependabot:** Monitored weekly across all monorepo scopes (`/`, `/apps/api`, `/apps/web`, `/apps/extension`, `/packages/core`, `/packages/etl`) and `github-actions`.
* **CI Audit Gate:** Every build executes `pnpm audit --audit-level=high` in `.github/workflows/ci.yml`.
* **GitHub Dependency Review:** Pull requests are automatically analyzed via `actions/dependency-review-action@v4` to prevent introduction of vulnerable packages or unauthorized licenses.

### 3.3. Zero-Install & Local Isolation Principle
* As specified in `AGENTS.md`, developers and autonomous agents operate under a **Zero-Install Workflow**.
* Untrusted external binaries or unvetted npm scripts are never executed locally. All compilation, linting, and automated tests run inside reproducible GitHub Actions runners and GitHub Codespaces devcontainers.

### 3.4. Secrets & Credentials Policy
* **Zero Secret Leaks:** `.env`, `.notes/`, private keys, and Cloudflare credentials are strictly gitignored.
* **Least Privilege Tokens:** Cloudflare deployment tokens in CI only carry scoped permissions (`Workers:Edit`, `Pages:Edit`, `D1:Edit`, `R2:Edit`).
* **Client Sanitization:** RFC 7807 error responses strictly sanitize system internals; database structure and stack traces are suppressed in production mode.

---

## 4. Security Checklist for Contributors

Before opening a pull request:
1. Ensure `pnpm run lint` passes with `--max-warnings=0`.
2. Ensure `pnpm audit --audit-level=high` reports zero vulnerabilities.
3. Validate that no private tokens, API keys, or `.env` files are tracked in git (`git status`).
4. Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`) in English.

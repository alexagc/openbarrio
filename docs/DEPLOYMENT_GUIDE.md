# OpenBarrio Cloudflare Production Deployment & Hardening Guide 🚀🇪🇸

This guide documents the end-to-step operational procedure for provisioning, configuring, and hardening OpenBarrio's production infrastructure on Cloudflare Edge.

---

## 1. Cloudflare Infrastructure Architecture

OpenBarrio is designed for zero-cold-start execution and edge sovereignty across the global Cloudflare network:

```
[ Idealista / Fotocasa Portal ]   [ Web Dashboard (openbarrio-web.pages.dev) ]
                \                               /
                 \                             /
        [ Cloudflare Edge Workers API (openbarrio-api.workers.dev) ]
         ├── Security & Strict CORS Middleware
         ├── Rate Limiter (Sliding Window per IP)
         ├── Cloudflare Cache API (90-day TTL: 7,776,000s)
         ├── Cloudflare D1 (openbarrio-d1 SQLite: ~36,000 INE Census Tracts)
         └── Cloudflare R2 (openbarrio-r2 Bucket: PMTiles Vector Boundaries)
```

---

## 2. Step 1: Cloudflare Account & Credentials Setup

### 2.1. Obtain your Cloudflare Account ID
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select any domain or navigate to **Workers & Pages** in the left sidebar.
3. On the right-hand overview pane, locate **Account ID**.
4. Click to copy this 32-character hexadecimal string (e.g. `a1b2c3d4e5f60718293a4b5c6d7e8f90`).

### 2.2. Generate Least-Privilege Cloudflare API Token
1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens).
2. Click **Create Token** -> Select **Create Custom Token**.
3. Name the token: `openbarrio-ci-deploy`.
4. Configure the following permissions under **Permissions**:
   * **Account** -> **Workers Scripts** -> **Edit**
   * **Account** -> **Workers KV Storage** -> **Edit**
   * **Account** -> **Workers R2 Storage** -> **Edit**
   * **Account** -> **D1** -> **Edit**
   * **Account** -> **Cloudflare Pages** -> **Edit**
   * **User** -> **User Details** -> **Read**
5. Under **Account Resources**, select **Include** -> **All accounts** (or your specific account).
6. Under **TTL**, set your preferred expiration or leave as default.
7. Click **Continue to summary** -> **Create Token**.
8. **Save the token immediately** (it will only be displayed once).

---

## 3. Step 2: Provision Cloudflare Edge Resources (D1 & R2)

OpenBarrio utilizes **Cloudflare D1** (distributed SQLite) for sub-5ms INE income queries and **Cloudflare R2** for serving IGN PMTiles vector boundaries.

### 3.1. Create the D1 Database
Run the following command from the repository root:

```bash
# Using pnpm in apps/api
pnpm --filter @openbarrio/api d1:create

# Or directly with wrangler
npx wrangler d1 create openbarrio-d1
```

Wrangler will output configuration details containing the generated `database_id`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "openbarrio-d1"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 3.2. Update `wrangler.jsonc`
Open `apps/api/wrangler.jsonc` and replace the placeholder `database_id` with your actual database UUID:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "openbarrio-d1",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "migrations_dir": "migrations"
  }
]
```

### 3.3. Apply Remote Database Migrations
Apply the initial census tract schema to your live D1 database:

```bash
pnpm --filter @openbarrio/api d1:migrate:remote

# Or directly with wrangler:
npx wrangler d1 execute openbarrio-d1 --file=apps/api/migrations/0001_initial_schema.sql --remote
```

### 3.4. Create the Cloudflare R2 Storage Bucket
Create the storage bucket for hosting the compiled census tract PMTiles files:

```bash
pnpm --filter @openbarrio/api r2:create

# Or directly with wrangler:
npx wrangler r2 bucket create openbarrio-r2
```

---

## 4. Step 3: Configure GitHub Repository Secrets

To allow GitHub Actions CI/CD to build, migrate, and deploy automatically on every push to `main`:

1. Open your repository on GitHub: `https://github.com/alexagc/openbarrio/settings/secrets/actions`.
2. Click **New repository secret**.
3. Add the following secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | API Token created in Step 2.2 | `v_4xYz1234567890abcdef...` |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID copied in Step 2.1 | `a1b2c3d4e5f60718293a4b5c6d7e8f90` |

---

## 5. Step 4: Automated CI/CD Pipeline (Release-Driven Deployment)

To ensure production stability, deployment to Cloudflare Edge is triggered strictly upon **publishing a release** or **pushing a version tag** (as well as via manual `workflow_dispatch`):

* **Triggers:**
  * **GitHub Release:** Publishing a release in GitHub (`release: [published]`).
  * **Git Version Tag:** Pushing a semantic version tag (e.g. `v0.2.0`, `v1.0.0`).
  * **Manual Trigger:** Running the `workflow_dispatch` event in the GitHub Actions UI.

* **Pipeline Execution Steps (`.github/workflows/deploy.yml`):**
  1. **Build Monorepo:** Runs `pnpm run build` across `@openbarrio/core`, `@openbarrio/api`, and `@openbarrio/web`.
  2. **Apply D1 Migrations:** Runs `d1 execute openbarrio-d1 --file=migrations/0001_initial_schema.sql --remote --yes` to ensure schema updates are applied.
  3. **Deploy API to Cloudflare Workers:** Deploys `apps/api` to `openbarrio-api.workers.dev`.
  4. **Deploy Web Dashboard to Cloudflare Pages:** Deploys `apps/web/dist` to `openbarrio-web.pages.dev`.

* **How to trigger a deployment:**
  ```bash
  # Option 1: Create and push a git tag
  git tag -a v0.2.0 -m "Release v0.2.0: Cloudflare production deployment"
  git push origin v0.2.0

  # Option 2: Publish a GitHub Release via UI or CLI
  gh release create v0.2.0 --title "v0.2.0: Cloudflare Live Deployment" --generate-notes
  ```

---

## 6. Step 5: Verification & Smoke Testing

### 6.1. Health & Liveness Probe
```bash
curl -i https://openbarrio-api.workers.dev/health
```
**Expected Response:**
```http
HTTP/2 200
content-type: application/json; charset=UTF-8
x-content-type-options: nosniff
x-frame-options: DENY

{"status":"ok","service":"openbarrio-api","timestamp":"2026-10-18T14:00:00.000Z"}
```

### 6.2. Interactive OpenAPI & Swagger Documentation
Navigate in your browser to:
* **Swagger UI:** `https://openbarrio-api.workers.dev/docs`
* **OpenAPI 3.0 JSON Spec:** `https://openbarrio-api.workers.dev/docs/json`

### 6.3. Edge Caching Verification (Cloudflare Cache API)
Send an audit query to verify the `X-OpenBarrio-Cache` and `Cache-Control` headers:

```bash
# 1st request (Cache Miss)
curl -I "https://openbarrio-api.workers.dev/api/v1/audit/refcat/9872023VH5797S0001WX"
# -> X-OpenBarrio-Cache: MISS
# -> Cache-Control: public, max-age=7776000, s-maxage=7776000, stale-while-revalidate=86400

# 2nd request (Edge Cache Hit)
curl -I "https://openbarrio-api.workers.dev/api/v1/audit/refcat/9872023VH5797S0001WX"
# -> X-OpenBarrio-Cache: HIT
```

### 6.4. Rate Limiting Verification
Verify rate limiting protection (60 requests/minute per client IP):
```bash
curl -I "https://openbarrio-api.workers.dev/api/v1/audit/refcat/9872023VH5797S0001WX"
# -> RateLimit-Limit: 60
# -> RateLimit-Remaining: 59
# -> RateLimit-Reset: 1729267260
```
Upon exceeding 60 requests within a minute, the server responds with:
* **HTTP 429 Too Many Requests**
* **Retry-After: `<seconds>`**
* **RFC 7807 Payload:**
```json
{
  "type": "https://openbarrio.org/errors/rate-limit-exceeded",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "Rate limit exceeded. Please wait 45 seconds before retrying.",
  "instance": "/api/v1/audit/refcat/9872023VH5797S0001WX"
}
```

### 6.5. Strict CORS Policy Verification
* **Authorized Origin (Chrome Extension / Web Dashboard):**
  ```bash
  curl -I -H "Origin: https://openbarrio-web.pages.dev" \
    "https://openbarrio-api.workers.dev/api/v1/audit/coords?lat=40.42028&lon=-3.70379"
  # -> Access-Control-Allow-Origin: https://openbarrio-web.pages.dev
  ```
* **Untrusted Origin:**
  ```bash
  curl -I -H "Origin: https://unauthorized-crawler.com" \
    "https://openbarrio-api.workers.dev/api/v1/audit/coords?lat=40.42028&lon=-3.70379"
  # -> Access-Control-Allow-Origin header is omitted (request blocked by browser)
  ```

---

## 7. Step 6: Custom Domain Mapping (Production)

Once ready to point official domains (`openbarrio.org` and `api.openbarrio.org`):

1. **Web Dashboard:**
   * In Cloudflare Dashboard -> **Pages** -> Select `openbarrio-web` -> **Custom domains**.
   * Add `openbarrio.org` and `www.openbarrio.org`.
2. **API Edge Gateway:**
   * In Cloudflare Dashboard -> **Workers & Pages** -> Select `openbarrio-api` -> **Settings** -> **Domains & Routes**.
   * Click **Add** -> **Custom Domain** -> enter `api.openbarrio.org`.
   * Cloudflare automatically issues and manages the SSL/TLS certificates with zero downtime.

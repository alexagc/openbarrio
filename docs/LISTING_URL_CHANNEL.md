# Listing URL Channel: Architecture, Portal ToS Boundaries & Legal Limits

- **Version:** `1.5.0`
- **Endpoint:** `POST /api/v1/listing/resolve`
- **Web Flow:** Landing Page -> "Desde URL de anuncio" / "From listing URL" (`HeroSection` / `ListingUrlResolver`)
- **Primary Implementation:** `packages/core/src/types/listing.ts`, `apps/api/src/services/listing-resolver.service.ts`, `apps/api/src/routes/listing.routes.ts`

---

## 1. Zero Server-Side Fetch Architecture (Anti-Scraping & Anti-SSRF by Design)

OpenBarrio's listing channel strictly avoids automated server-side crawling, headless scraping, or HTTP fetching of third-party real-estate portals:

1. **No Outbound `fetch`:** `resolveListingMetadata()` executes purely in memory against the user-submitted URL string and optional user-pasted text snippet. The API Worker never initiates outbound HTTP connections, DNS lookups, or redirect follows to portal servers or arbitrary hosts.
2. **Protocol & Anti-SSRF Hardening:** Incoming URLs are parsed using the WHATWG `URL` parser and rejected unless:
   - Scheme is `https:`,
   - No embedded `username` or `password` credentials exist,
   - Hostname is not an IPv4/IPv6 literal, `localhost`, `.local`, or `.internal`,
   - Hostname strictly matches `PORTAL_HOST_ALLOWLIST` (exact apex + `www.` hostnames for the 5 supported Spanish portals: `idealista.com`, `fotocasa.es`, `habitaclia.com`, `pisos.com`, `yaencontre.com`).
3. **Query & Fragment Stripping:** All query strings (`?utm_*`, tracking tokens, session identifiers) and URL fragments are discarded immediately during sanitization. Query strings are never persisted or included in API responses.

---

## 2. Real-Estate Portal Terms of Service (ToS) Compliance

Spanish property portals prohibit automated scraping, bulk data harvesting, and commercial redistribution of listing photographs, seller contact details, or proprietary editorial descriptions.

Accordingly, OpenBarrio enforces three structural boundaries:

- **User-Initiated Input Only:** The user supplies either a listing permalink directly or explicitly pastes visible text from their browser session.
- **Minimal Cadastral Bridge:** Only location/property identification hints needed to query **official public registries** (20-character Cadastral Reference, municipal/district slug, street name hint, numeric surface area `m²`, listing ID, operation type `sale`/`rent`) are extracted.
- **No Content Redistribution:** Listing prices, photographs, seller names, agency branding, and full editorial text are **not** stored, proxied, cached, or republished. All audit panels present official Catastro OVC, INE ADRH, MITECO, and MIVAU data.
- **User Confirmation Step:** Before invoking an official audit, the web flow displays editable extracted fields so the user verifies or corrects the address / cadastral reference and retains a 1-click fallback to manual search.

---

## 3. Data Protection & Retention Policy (LSSI-CE / GDPR)

- **Zero Persistence (0 Storage / 0 Retention):** `POST /api/v1/listing/resolve` performs zero writes to Cloudflare D1, R2, or KV. Request payloads and pasted snippets (`rawText`) exist only in volatile Worker memory for the duration of the synchronous request and are garbage-collected immediately upon response (`Cache-Control: no-store`).
- **Payload Cap:** Optional `rawText` is bounded to **200 KB** (`LISTING_MAX_PASTE_BYTES = 204800` bytes) and requires strict `Content-Type: application/json`.
- **Log Hygiene:** Error objects and API responses omit query strings and user-pasted text to prevent accidental PII or portal content leakage into platform logs.

---

## 4. Rate Limiting & Operational Caveats

- Dedicated per-IP sliding-window limits apply specifically to `POST /api/v1/listing/resolve`:
  - **`10` requests / minute / IP** (`LISTING_RATE_LIMIT_PER_MIN = 10`)
  - **`100` requests / day / IP** (`LISTING_RATE_LIMIT_PER_DAY = 100`)
- **Cloudflare Workers Isolate Caveat:** Counters are maintained in volatile memory per edge isolate (zero external state writes), meaning limits are best-effort across multiple edge POPs rather than globally synchronized.
- Exceeding either limit returns HTTP **`429 Too Many Requests`** with `Retry-After` and an RFC 7807 `application/problem+json` body.

---

## 5. RFC 7807 Error Catalog

| HTTP Status | Problem `type` | Trigger Condition |
|---:|---|---|
| `400` | `https://openbarrio.org/errors/listing-url-invalid` | Malformed URL/JSON, non-HTTPS protocol, embedded URL credentials, or schema mismatch |
| `413` | `https://openbarrio.org/errors/listing-payload-too-large` | Request/pasted text exceeds 200 KB (`204,800` bytes) |
| `415` | `https://openbarrio.org/errors/unsupported-media-type` | Non-JSON `Content-Type` header |
| `422` | `https://openbarrio.org/errors/listing-host-unsupported` | Hostname outside exact 5-portal allowlist, IP literal, `localhost`, `.local`, `.internal` |
| `422` | `https://openbarrio.org/errors/listing-extraction-failed` | Valid portal host without extractable listing ID, street hint, or cadastral reference |
| `429` | `https://openbarrio.org/errors/rate-limit-exceeded` | Per-IP `10/min` or `100/day` limit exceeded |

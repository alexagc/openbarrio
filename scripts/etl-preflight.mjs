import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DEFAULT_FALLBACK_RUN_ID = '44945067042';
const DEFAULT_FRESHNESS_DAYS = 90;

/**
 * Returns true if the ISO timestamp is within `maxAgeDays` of `now`.
 */
export function isWithinFreshnessWindow(isoTimestamp, maxAgeDays = DEFAULT_FRESHNESS_DAYS, now = new Date()) {
  if (!isoTimestamp) return false;
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) return false;
  const ageMs = now.getTime() - parsed;
  return ageMs >= 0 && ageMs < maxAgeDays * 24 * 60 * 60 * 1000;
}

/**
 * Compares stored ETag/Last-Modified against live HTTP HEAD headers.
 * Only flags a change when both stored and live values exist and differ.
 */
export function hasHttpMetadataChanged(dataset, liveHeaders) {
  if (!dataset || !liveHeaders) return false;
  const liveEtag = liveHeaders.etag?.trim();
  const storedEtag = dataset.etag?.trim();
  if (storedEtag && liveEtag && storedEtag !== liveEtag) {
    return true;
  }
  const liveLastMod = liveHeaders.lastModified?.trim();
  const storedLastMod = dataset.last_modified?.trim();
  if (storedLastMod && liveLastMod && storedLastMod !== liveLastMod) {
    return true;
  }
  return false;
}

async function probeHttpHead(url, timeoutMs = 10_000) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return {
      etag: res.headers.get('etag') || undefined,
      lastModified: res.headers.get('last-modified') || undefined,
      contentLength: res.headers.get('content-length') || undefined,
    };
  } catch {
    return null;
  }
}

async function probeNapListFingerprint(apiKey, timeoutMs = 15_000) {
  if (!apiKey) return null;
  try {
    const res = await fetch('https://nap.transportes.gob.es/api/Fichero/GetList', {
      headers: {
        ApiKey: apiKey,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const payload = await res.json();
    const items = Array.isArray(payload)
      ? payload
      : payload?.conjuntosDatoDto || payload?.ficheros || payload?.data || [];
    const summary = items
      .map((item) => {
        if (Array.isArray(item.ficherosDto)) {
          const files = item.ficherosDto
            .map((f) => `${f.ficheroId ?? ''}:${f.fechaActualizacion ?? ''}`)
            .sort()
            .join(',');
          return `${item.conjuntoDatoId ?? ''}[${files}]`;
        }
        return `${item.ficheroId ?? item.id ?? ''}:${item.fechaActualizacion ?? item.lastUpdate ?? ''}`;
      })
      .sort()
      .join('|');
    return crypto.createHash('sha256').update(summary).digest('hex');
  } catch {
    return null;
  }
}

function resolveLatestSuccessfulRunId(fallback = DEFAULT_FALLBACK_RUN_ID) {
  try {
    const repo = process.env.GITHUB_REPOSITORY || 'alexagc/openbarrio';
    const out = execSync(
      `gh api "repos/${repo}/actions/artifacts?name=openbarrio-etl-dist&per_page=10"`,
      { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const parsed = JSON.parse(out);
    const valid = (parsed?.artifacts || [])
      .filter((a) => !a.expired && a.workflow_run?.head_branch === 'main' && a.workflow_run?.id)
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    if (valid[0]?.workflow_run?.id) {
      return String(valid[0].workflow_run.id);
    }
  } catch {
    // Fallback when running locally or outside GitHub Actions
  }
  return fallback;
}

/**
 * Evaluates which ETL jobs need to run based on manifest freshness and live upstream metadata.
 */
export async function evaluatePreflight(manifest, options = {}) {
  const {
    forceRebuild = false,
    applyOnly = false,
    runIneIgn = true,
    runSnczi = true,
    runSica = true,
    runCivicCee = true,
    runTransit = true,
    runBroadband = true,
    napApiKey = '',
    now = new Date(),
    headProbe = probeHttpHead,
    napProbe = probeNapListFingerprint,
  } = options;

  const datasets = manifest?.datasets || {};
  const meta = {};

  if (applyOnly) {
    return {
      needIneIgn: false,
      needSnczi: false,
      needSica: false,
      needCivicCee: false,
      needTransit: false,
      needBroadband: false,
      anyEtlNeeded: false,
      reasons: { mode: 'apply_only=true (skipping all ETL build jobs)' },
      meta,
    };
  }

  const reasons = {};

  // 1. INE ADRH & IGN Boundaries
  let needIneIgn = false;
  if (runIneIgn) {
    const ds = datasets.ine_adrh;
    const head = await headProbe(ds?.upstream_url);
    if (head) meta.ine_adrh = head;
    if (forceRebuild) {
      needIneIgn = true;
      reasons.ine_adrh = 'force_rebuild=true';
    } else if (!ds || ds.status !== 'UP_TO_DATE') {
      needIneIgn = true;
      reasons.ine_adrh = `status=${ds?.status ?? 'MISSING'}`;
    } else if (hasHttpMetadataChanged(ds, head)) {
      needIneIgn = true;
      reasons.ine_adrh = 'upstream HTTP ETag/Last-Modified changed';
    } else if (!isWithinFreshnessWindow(ds.last_processed_at, DEFAULT_FRESHNESS_DAYS, now)) {
      needIneIgn = true;
      reasons.ine_adrh = 'freshness window (>90d) expired';
    } else {
      reasons.ine_adrh = 'UP_TO_DATE (cached)';
    }
  } else {
    reasons.ine_adrh = 'disabled by input';
  }

  // 2. MITECO SNCZI Floods
  let needSnczi = false;
  if (runSnczi) {
    const ds = datasets.miteco_snczi;
    if (forceRebuild) {
      needSnczi = true;
      reasons.miteco_snczi = 'force_rebuild=true';
    } else if (!ds || ds.status !== 'UP_TO_DATE') {
      needSnczi = true;
      reasons.miteco_snczi = `status=${ds?.status ?? 'MISSING'}`;
    } else if (!isWithinFreshnessWindow(ds.last_processed_at, DEFAULT_FRESHNESS_DAYS, now)) {
      needSnczi = true;
      reasons.miteco_snczi = 'freshness window (>90d) expired';
    } else {
      reasons.miteco_snczi = 'UP_TO_DATE (cached)';
    }
  } else {
    reasons.miteco_snczi = 'disabled by input';
  }

  // 3. MITECO SICA Noise
  let needSica = false;
  if (runSica) {
    const ds = datasets.miteco_sica;
    if (forceRebuild) {
      needSica = true;
      reasons.miteco_sica = 'force_rebuild=true';
    } else if (!ds || ds.status !== 'UP_TO_DATE') {
      needSica = true;
      reasons.miteco_sica = `status=${ds?.status ?? 'MISSING'}`;
    } else if (!isWithinFreshnessWindow(ds.last_processed_at, DEFAULT_FRESHNESS_DAYS, now)) {
      needSica = true;
      reasons.miteco_sica = 'freshness window (>90d) expired';
    } else {
      reasons.miteco_sica = 'UP_TO_DATE (cached)';
    }
  } else {
    reasons.miteco_sica = 'disabled by input';
  }

  // 4. Civic Facilities, ITE, Seismic & CEE
  let needCivicCee = false;
  if (runCivicCee) {
    const civic = datasets.civic_facilities;
    const cee = datasets.energy_certificates;
    if (forceRebuild) {
      needCivicCee = true;
      reasons.civic_cee = 'force_rebuild=true';
    } else if (!civic || civic.status !== 'UP_TO_DATE' || !cee || cee.status !== 'UP_TO_DATE') {
      needCivicCee = true;
      reasons.civic_cee = 'status not UP_TO_DATE';
    } else if (
      !isWithinFreshnessWindow(civic.last_processed_at, DEFAULT_FRESHNESS_DAYS, now) ||
      !isWithinFreshnessWindow(cee.last_processed_at, DEFAULT_FRESHNESS_DAYS, now)
    ) {
      needCivicCee = true;
      reasons.civic_cee = 'freshness window (>90d) expired';
    } else {
      reasons.civic_cee = 'UP_TO_DATE (cached)';
    }
  } else {
    reasons.civic_cee = 'disabled by input';
  }

  // 5. GTFS / NAP Transit
  let needTransit = false;
  if (!runTransit) {
    reasons.transit_stops = 'disabled by input';
  } else if (!napApiKey) {
    reasons.transit_stops = 'skipped (NAP_API_KEY not configured)';
  } else {
    const ds = datasets.transit_stops;
    const fp = await napProbe(napApiKey);
    if (fp) meta.transit_stops = { upstream_fingerprint: fp };
    if (forceRebuild) {
      needTransit = true;
      reasons.transit_stops = 'force_rebuild=true';
    } else if (!ds || ds.status !== 'UP_TO_DATE') {
      needTransit = true;
      reasons.transit_stops = `status=${ds?.status ?? 'MISSING'}`;
    } else if (ds.upstream_fingerprint && fp && ds.upstream_fingerprint !== fp) {
      needTransit = true;
      reasons.transit_stops = 'NAP GetList fingerprint changed';
    } else if (!isWithinFreshnessWindow(ds.last_processed_at, 30, now)) {
      needTransit = true;
      reasons.transit_stops = 'transit freshness window (>30d) expired';
    } else {
      reasons.transit_stops = 'UP_TO_DATE (cached)';
    }
  }

  // 6. SETELECO Broadband Coverage
  let needBroadband = false;
  if (runBroadband) {
    const ds = datasets.broadband_coverage;
    const head = await headProbe(ds?.upstream_url);
    if (head) meta.broadband_coverage = head;
    if (forceRebuild) {
      needBroadband = true;
      reasons.broadband_coverage = 'force_rebuild=true';
    } else if (!ds || ds.status !== 'UP_TO_DATE') {
      needBroadband = true;
      reasons.broadband_coverage = `status=${ds?.status ?? 'MISSING'}`;
    } else if (hasHttpMetadataChanged(ds, head)) {
      needBroadband = true;
      reasons.broadband_coverage = 'upstream HTTP ETag/Last-Modified changed';
    } else if (!isWithinFreshnessWindow(ds.last_processed_at, DEFAULT_FRESHNESS_DAYS, now)) {
      needBroadband = true;
      reasons.broadband_coverage = 'freshness window (>90d) expired';
    } else {
      reasons.broadband_coverage = 'UP_TO_DATE (cached)';
    }
  } else {
    reasons.broadband_coverage = 'disabled by input';
  }

  const anyEtlNeeded =
    needIneIgn || needSnczi || needSica || needCivicCee || needTransit || needBroadband;

  return {
    needIneIgn,
    needSnczi,
    needSica,
    needCivicCee,
    needTransit,
    needBroadband,
    anyEtlNeeded,
    reasons,
    meta,
  };
}

function asBool(val, defaultVal = true) {
  if (val === undefined || val === '') return defaultVal;
  return String(val).toLowerCase() === 'true';
}

async function main() {
  const manifestPath = path.resolve('data/etl_manifest.json');
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : { datasets: {} };

  const result = await evaluatePreflight(manifest, {
    forceRebuild: asBool(process.env.FORCE_REBUILD, false),
    applyOnly: asBool(process.env.APPLY_ONLY, false),
    runIneIgn: asBool(process.env.RUN_INE_IGN, true),
    runSnczi: asBool(process.env.RUN_SNCZI, true),
    runSica: asBool(process.env.RUN_SICA, true),
    runCivicCee: asBool(process.env.RUN_CIVIC_CEE, true),
    runTransit: asBool(process.env.RUN_TRANSIT, true),
    runBroadband: asBool(process.env.RUN_BROADBAND, true),
    napApiKey: process.env.NAP_API_KEY || '',
  });

  const fallbackRunId = process.env.ARTIFACT_RUN_ID || resolveLatestSuccessfulRunId();

  console.log('================================================================');
  console.log('🔍 [OpenBarrio] ETL Pre-flight Probe & Cache Evaluation');
  console.log('================================================================');
  for (const [key, reason] of Object.entries(result.reasons)) {
    console.log(`  • ${key}: ${reason}`);
  }
  console.log(`  • any_etl_needed=${result.anyEtlNeeded}`);
  console.log(`  • fallback_run_id=${fallbackRunId}`);

  fs.mkdirSync(path.resolve('packages/etl/dist'), { recursive: true });
  fs.writeFileSync(
    path.resolve('packages/etl/dist/preflight_meta.json'),
    JSON.stringify(result.meta, null, 2) + '\n',
    'utf-8',
  );

  if (process.env.GITHUB_OUTPUT) {
    const lines = [
      `need_ine_ign=${result.needIneIgn}`,
      `need_snczi=${result.needSnczi}`,
      `need_sica=${result.needSica}`,
      `need_civic_cee=${result.needCivicCee}`,
      `need_transit=${result.needTransit}`,
      `need_broadband=${result.needBroadband}`,
      `any_etl_needed=${result.anyEtlNeeded}`,
      `fallback_run_id=${fallbackRunId}`,
    ];
    fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n', 'utf-8');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ ETL Pre-flight failed:', err);
    process.exit(1);
  });
}

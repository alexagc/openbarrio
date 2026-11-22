import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function findFirstExisting(candidates) {
  for (const rel of candidates) {
    const abs = path.resolve(rel);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

/**
 * Determines whether a target dataset requires a remote D1/R2 write
 * by comparing the artifact SHA-256 against `data/etl_manifest.json`.
 */
export function evaluateSyncNeeded(manifest, options = {}) {
  const {
    forceSync = false,
    inputs = {},
    need = {},
  } = options;

  const datasets = manifest?.datasets || {};

  const checks = [
    {
      outputKey: 'sync_ine',
      manifestKey: 'ine_adrh',
      files: ['packages/etl/dist/ine_adrh.sql', 'packages/etl/dist/census_tracts.pmtiles'],
      enabled: inputs.syncIne !== false,
    },
    {
      outputKey: 'sync_snczi_floods',
      manifestKey: 'miteco_snczi',
      files: ['packages/etl/dist/floods.pmtiles', 'packages/etl/dist/snczi_risk.sql'],
      enabled: inputs.syncSnczi !== false,
    },
    {
      outputKey: 'sync_sica_noise',
      manifestKey: 'miteco_sica',
      files: ['packages/etl/dist/noise.pmtiles', 'packages/etl/dist/sica_noise.sql'],
      enabled: inputs.syncSica !== false,
    },
    {
      outputKey: 'sync_civic_cee',
      manifestKey: 'civic_facilities',
      files: ['packages/etl/dist/civic_facilities.sql', 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql'],
      enabled: inputs.syncCivicCee !== false,
    },
    {
      outputKey: 'sync_transit',
      manifestKey: 'transit_stops',
      files: ['packages/etl/dist/transit_stops.sql'],
      enabled: inputs.syncTransit === true || need.transit === true,
    },
    {
      outputKey: 'sync_broadband',
      manifestKey: 'broadband_coverage',
      files: ['packages/etl/dist/broadband_coverage.sql'],
      enabled: inputs.syncBroadband === true || need.broadband === true,
    },
  ];

  const outputs = {};
  const details = {};

  for (const check of checks) {
    if (!check.enabled) {
      outputs[check.outputKey] = false;
      details[check.outputKey] = 'disabled';
      continue;
    }

    const existing = findFirstExisting(check.files);
    if (!existing) {
      outputs[check.outputKey] = false;
      details[check.outputKey] = 'no artifact on disk';
      continue;
    }

    if (forceSync) {
      outputs[check.outputKey] = true;
      details[check.outputKey] = 'force_sync=true';
      continue;
    }

    const currentSha = sha256File(existing);
    const ds = datasets[check.manifestKey];
    if (ds && ds.status === 'UP_TO_DATE' && ds.sha256 && ds.sha256 === currentSha) {
      outputs[check.outputKey] = false;
      details[check.outputKey] = `SHA-256 unchanged (${currentSha.slice(0, 12)}...)`;
    } else {
      outputs[check.outputKey] = true;
      details[check.outputKey] = `SHA-256 changed or PENDING (${currentSha.slice(0, 12)}...)`;
    }
  }

  // R2 sync is needed only if any of the PMTiles-backed layers changed (or forceSync)
  const r2Enabled = inputs.syncR2 !== false;
  outputs.sync_r2 =
    r2Enabled && (forceSync || outputs.sync_ine || outputs.sync_snczi_floods || outputs.sync_sica_noise);
  details.sync_r2 = outputs.sync_r2 ? 'PMTiles layer changed or force_sync' : 'PMTiles unchanged (skipped)';

  // VUT / Radon / SERPAVI: skip unless forceSync or any dataset status is not UP_TO_DATE
  const vutEnabled = inputs.syncVutRadonSerpavi !== false;
  const vutNeedsSync =
    forceSync ||
    ['ine_vut', 'cte_radon', 'mivau_serpavi'].some((k) => datasets[k]?.status !== 'UP_TO_DATE');
  outputs.sync_vut_radon_serpavi = vutEnabled && vutNeedsSync;
  details.sync_vut_radon_serpavi = outputs.sync_vut_radon_serpavi
    ? 'status not UP_TO_DATE or force_sync'
    : 'UP_TO_DATE (skipped)';

  return { outputs, details };
}

function asBool(val, defaultVal = true) {
  if (val === undefined || val === '') return defaultVal;
  return String(val).toLowerCase() === 'true';
}

function main() {
  const manifestPath = path.resolve('data/etl_manifest.json');
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
    : { datasets: {} };

  const { outputs, details } = evaluateSyncNeeded(manifest, {
    forceSync: asBool(process.env.FORCE_SYNC, false),
    inputs: {
      syncIne: asBool(process.env.INPUT_SYNC_INE, true),
      syncSnczi: asBool(process.env.INPUT_SYNC_SNCZI, true),
      syncSica: asBool(process.env.INPUT_SYNC_SICA, true),
      syncCivicCee: asBool(process.env.INPUT_SYNC_CIVIC_CEE, true),
      syncTransit: asBool(process.env.INPUT_SYNC_TRANSIT, false),
      syncBroadband: asBool(process.env.INPUT_SYNC_BROADBAND, false),
      syncR2: asBool(process.env.INPUT_SYNC_R2, true),
      syncVutRadonSerpavi: asBool(process.env.INPUT_SYNC_VUT_RADON_SERPAVI, true),
    },
    need: {
      transit: asBool(process.env.NEED_TRANSIT, false),
      broadband: asBool(process.env.NEED_BROADBAND, false),
    },
  });

  console.log('================================================================');
  console.log('💰 [OpenBarrio] FinOps Selective Sync Evaluation');
  console.log('================================================================');
  for (const [k, v] of Object.entries(outputs)) {
    console.log(`  • ${k}=${v} (${details[k]})`);
  }

  if (process.env.GITHUB_OUTPUT) {
    const lines = Object.entries(outputs).map(([k, v]) => `${k}=${v}`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, lines.join('\n') + '\n', 'utf-8');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}

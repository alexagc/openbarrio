import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MANIFEST_PATH = path.resolve('data/etl_manifest.json');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.log('⚠️ Manifest not found at', MANIFEST_PATH);
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
let modified = false;

const targetArtifacts = [
  {
    key: 'miteco_snczi',
    files: ['packages/etl/dist/floods.pmtiles', 'data/floods.pmtiles'],
  },
  {
    key: 'miteco_sica',
    files: ['packages/etl/dist/noise.pmtiles', 'data/noise.pmtiles'],
  },
  {
    key: 'ine_adrh',
    files: ['packages/etl/dist/census_tracts.pmtiles', 'data/census_tracts.pmtiles'],
  },
];

for (const target of targetArtifacts) {
  const existingFile = target.files.map((f) => path.resolve(f)).find((f) => fs.existsSync(f));
  if (existingFile && manifest.datasets?.[target.key]) {
    const fileBuffer = fs.readFileSync(existingFile);
    const sha = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const dataset = manifest.datasets[target.key];

    if (dataset.sha256 !== sha || dataset.status !== 'UP_TO_DATE') {
      dataset.sha256 = sha;
      if (dataset.fingerprint !== undefined) {
        dataset.fingerprint = sha;
      }
      dataset.status = 'UP_TO_DATE';
      dataset.last_processed_at = new Date().toISOString();
      modified = true;
      console.log(`[ETL-MANIFEST] Updated ${target.key} SHA-256: ${sha.slice(0, 16)}...`);
    }
  }
}

if (modified) {
  manifest.generated_at = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
  console.log('✅ data/etl_manifest.json successfully updated.');
} else {
  console.log('ℹ️ data/etl_manifest.json is already up to date.');
}

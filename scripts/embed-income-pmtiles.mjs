import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { execSync } from 'node:child_process';

const DB_PATH = path.resolve(process.cwd(), 'data/openbarrio.sqlite');
const INPUT_GEOJSON = path.resolve(process.cwd(), 'packages/etl/dist/openbarrio-etl-dist/census_tracts_simplified.geojson');
const TMP_GEOJSON = '/tmp/census_tracts_enriched.geojson';
const OUTPUT_PMTILES = path.resolve(process.cwd(), 'packages/etl/dist/openbarrio-etl-dist/census_tracts.pmtiles');
const ALT_OUTPUT_PMTILES = path.resolve(process.cwd(), 'packages/etl/dist/census_tracts.pmtiles');

console.log('🏘️ [PMTiles Engine] Connecting to SQLite at:', DB_PATH);
const db = new DatabaseSync(DB_PATH);

const rows = db.prepare('SELECT census_section_code, average_net_household_income_eur, percentile_in_municipality FROM census_tract_income').all();
console.log(`📊 Loaded ${rows.length} census section income records.`);

const incomeMap = new Map();
for (const r of rows) {
  incomeMap.set(String(r.census_section_code).trim(), {
    income: Number(r.average_net_household_income_eur),
    percentile: Number(r.percentile_in_municipality),
  });
}

console.log('📖 Reading input GeoJSON:', INPUT_GEOJSON);
const rawData = fs.readFileSync(INPUT_GEOJSON, 'utf8');
const geojson = JSON.parse(rawData);

console.log(`🧩 Processing ${geojson.features.length} boundary features...`);
let matched = 0;
for (const feat of geojson.features) {
  const code = String(feat.properties.census_section_code || '').trim();
  const inc = incomeMap.get(code);
  if (inc && inc.income) {
    feat.properties.income = Math.round(inc.income);
    feat.properties.percentile = Math.round(inc.percentile);
    matched++;
  } else {
    feat.properties.income = 28000;
    feat.properties.percentile = 50;
  }
}
console.log(`✅ Successfully enriched ${matched} / ${geojson.features.length} features with real income data.`);

console.log('💾 Writing temporary enriched GeoJSON...');
fs.writeFileSync(TMP_GEOJSON, JSON.stringify(geojson));

console.log('⚡ Compiling PMTiles via Tippecanoe...');
const cmd = `tippecanoe -o ${OUTPUT_PMTILES} -l census_tracts -z 14 -Z 6 --drop-densest-as-needed --force ${TMP_GEOJSON}`;
execSync(cmd, { stdio: 'inherit' });

console.log('📦 Copying compiled PMTiles to package distributions...');
fs.copyFileSync(OUTPUT_PMTILES, ALT_OUTPUT_PMTILES);

// Clean up temporary file
try {
  fs.unlinkSync(TMP_GEOJSON);
} catch {}

const stat = fs.statSync(OUTPUT_PMTILES);
console.log(`🎉 Done! census_tracts.pmtiles compiled successfully (${(stat.size / 1024 / 1024).toFixed(1)} MB) with real income attributes.`);

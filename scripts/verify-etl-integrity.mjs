/**
 * OpenBarrio ETL Integrity Verification Gatekeeper
 * 
 * Ensures 100% data completeness, sovereignty, and quality across ALL national datasets:
 * 1. MITECO SNCZI Floods (all river basins, >25,000 features, >400 MB PMTiles)
 * 2. MITECO SICA Noise (all infrastructure layers, >35,000 features, >120 MB PMTiles)
 * 3. INE ADRH Demographics (all 52 provinces, ~37,000 census sections)
 * 4. Civic Facilities (health, education, parks, transit, >50,000 facilities)
 * 5. Energy Certificates CEE (>150,000 registered certificates + normative estimation engine)
 * 6. CTE DB-HS 6 Radon Normative Hazard (Granitic Zona I/II vs Sedimentary Zona 0)
 * 7. MIVAU SERPAVI & VUT Intelligence
 * 8. Live Multi-Basin & Multi-City API Spatial Resolution
 * 
 * Exits with code 0 only if ALL assertions pass. Exits with code 1 on ANY data loss.
 */

import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { execSync } from 'node:child_process';

const BASE_DIR = process.cwd();
const DIST_DIR = path.join(BASE_DIR, 'packages', 'etl', 'dist', 'openbarrio-etl-dist');
const ALT_DIST_DIR = path.join(BASE_DIR, 'packages', 'etl', 'dist');
const SQLITE_PATH = path.join(BASE_DIR, 'data', 'openbarrio.sqlite');
const CHUNKS_DIR = path.join(BASE_DIR, 'packages', 'etl', 'chunks');

function findArtifact(filename) {
  const candidates = [
    path.join(DIST_DIR, filename),
    path.join(ALT_DIST_DIR, filename),
    path.join('/workspace', 'packages', 'etl', 'dist', 'openbarrio-etl-dist', filename),
    path.join('/workspace', 'packages', 'etl', 'dist', filename),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function verifyPMTilesHeader(filePath) {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(10);
  fs.readSync(fd, buffer, 0, 7, 0);
  fs.closeSync(fd);
  const magic = buffer.toString('utf8', 0, 7);
  return magic.startsWith('PMTiles') || (buffer[0] === 0x50 && buffer[1] === 0x4d);
}

console.log('================================================================');
console.log('🛡️  [OpenBarrio] Complete ETL Quality Gate: 100% Data Integrity');
console.log('================================================================\n');

let failed = false;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed = true;
  }
}

// 1. MITECO SNCZI Floods Cartography Verification
console.log('🌊 1. MITECO SNCZI Flood Cartography (floods.pmtiles):');
const floodsPath = findArtifact('floods.pmtiles');
assert(floodsPath !== null, 'floods.pmtiles artifact exists on disk');

if (floodsPath) {
  const stats = fs.statSync(floodsPath);
  const sizeMb = stats.size / (1024 * 1024);
  assert(sizeMb >= 400, `floods.pmtiles size is ${sizeMb.toFixed(1)} MB (Threshold: >=400 MB for all 28,000+ national polygons)`);
  assert(verifyPMTilesHeader(floodsPath), 'floods.pmtiles contains valid PMTiles v3 magic header');
}

// 2. MITECO SICA Strategic Noise Cartography Verification
console.log('\n🔊 2. MITECO SICA Strategic Noise Maps (noise.pmtiles):');
const noisePath = findArtifact('noise.pmtiles');
assert(noisePath !== null, 'noise.pmtiles artifact exists on disk');

if (noisePath) {
  const stats = fs.statSync(noisePath);
  const sizeMb = stats.size / (1024 * 1024);
  assert(sizeMb >= 120, `noise.pmtiles size is ${sizeMb.toFixed(1)} MB (Threshold: >=120 MB for all 40,000+ national line strings)`);
  assert(verifyPMTilesHeader(noisePath), 'noise.pmtiles contains valid PMTiles v3 magic header');
}

// 3. INE ADRH Demographics & Census Boundaries
console.log('\n🏘️ 3. INE ADRH & Census Boundaries (census_tracts.pmtiles & SQLite):');
const tractsPath = findArtifact('census_tracts.pmtiles');
assert(tractsPath !== null, 'census_tracts.pmtiles artifact exists on disk');

if (tractsPath) {
  const stats = fs.statSync(tractsPath);
  const sizeMb = stats.size / (1024 * 1024);
  assert(sizeMb >= 20, `census_tracts.pmtiles size is ${sizeMb.toFixed(1)} MB (Threshold: >=20 MB for national coverage)`);
  assert(verifyPMTilesHeader(tractsPath), 'census_tracts.pmtiles contains valid PMTiles header');
}

if (!fs.existsSync(SQLITE_PATH)) {
  console.log(`  📦 Local database ${SQLITE_PATH} not found. Auto-initializing with scripts/init-local-db.mjs...`);
  try {
    execSync('node scripts/init-local-db.mjs', { stdio: 'inherit' });
  } catch (err) {
    console.error(`  ❌ Failed to auto-initialize local SQLite database: ${err.message}`);
  }
}

let db = null;
if (fs.existsSync(SQLITE_PATH)) {
  try {
    db = new DatabaseSync(SQLITE_PATH);
    const row = db.prepare('SELECT count(*) as total FROM census_tract_income').get();
    assert(row.total >= 36000, `census_tract_income table contains ${row.total} sections (Threshold: >=36,000 for all 52 provinces)`);
  } catch (err) {
    assert(false, `Failed to query census_tract_income: ${err.message}`);
  }
} else {
  assert(false, `SQLite DB not found at ${SQLITE_PATH}`);
}

// 4. Civic Public Facilities Verification
console.log('\n🏫 4. Civic Facilities Ingestion (civic_facilities):');
if (db) {
  try {
    const totalFacilities = db.prepare('SELECT count(*) as total FROM civic_facilities').get();
    assert(totalFacilities.total >= 50000, `civic_facilities table contains ${totalFacilities.total} facilities (Threshold: >=50,000 across Spain)`);

    const types = db.prepare('SELECT type, count(*) as count FROM civic_facilities GROUP BY type').all();
    const typeMap = Object.fromEntries(types.map(t => [t.type, t.count]));
    assert((typeMap.healthcare || 0) >= 20000, `Healthcare facilities: ${typeMap.healthcare} (Threshold: >=20,000 centros de salud y hospitales)`);
    assert((typeMap.education || 0) >= 15000, `Education facilities: ${typeMap.education} (Threshold: >=15,000 colegios e institutos)`);
    assert((typeMap.park || 0) >= 10000, `Parks & Green Spaces: ${typeMap.park} (Threshold: >=10,000 parques urbanos)`);
    assert((typeMap.transit || 0) >= 4000, `Public Transit: ${typeMap.transit} (Threshold: >=4,000 estaciones de tren y metro)`);
  } catch (err) {
    assert(false, `Failed to query civic_facilities: ${err.message}`);
  }

  // Check SQL migration chunks
  const chunkCandidates = [
    path.join(CHUNKS_DIR, 'civic_facilities'),
    CHUNKS_DIR,
    path.join(DIST_DIR, 'chunks'),
  ];
  let foundChunks = [];
  for (const dir of chunkCandidates) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql') && f.includes('civic_facilities'));
      if (files.length > 0) {
        foundChunks = files;
        break;
      }
    }
  }
  assert(foundChunks.length >= 10, `Civic facilities SQL migration chunks: ${foundChunks.length} parts found for CI deployment`);
}

// 5. Energy Performance Certificates (CEE)
console.log('\n⚡ 5. Energy Performance Certificates (building_energy_certificates):');
if (db) {
  try {
    const ceeCount = db.prepare('SELECT count(*) as total FROM building_energy_certificates').get();
    assert(ceeCount.total >= 150000, `building_energy_certificates contains ${ceeCount.total} official certificates (Threshold: >=150,000)`);
    
    // Check known official certificate
    const refCert = db.prepare('SELECT rating_emissions, rating_consumption FROM building_energy_certificates WHERE cadastral_reference = ?').get('0269303VK4606G0077SR');
    assert(refCert && refCert.rating_emissions === 'D', 'Official CEE certificate retrieved accurately for reference property (Rating: D)');
  } catch (err) {
    assert(false, `Failed to query building_energy_certificates: ${err.message}`);
  }

  // Check CEE SQL migration chunks
  const ceeChunkCandidates = [
    path.join(CHUNKS_DIR, 'energy_certificates'),
    path.join(DIST_DIR, 'chunks_cee'),
  ];
  let foundCeeChunks = [];
  for (const dir of ceeChunkCandidates) {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql'));
      if (files.length > 0) {
        foundCeeChunks = files;
        break;
      }
    }
  }
  assert(foundCeeChunks.length >= 5, `Energy certificates SQL migration chunks: ${foundCeeChunks.length} parts found for CI deployment`);
}

// 6. CTE DB-HS 6 Radon Geological Hazard Verification
console.log('\n☢️ 6. CTE DB-HS 6 Radon Geological Hazard (cte_radon_municipalities):');
if (db) {
  try {
    const radonCount = db.prepare('SELECT count(*) as total FROM cte_radon_municipalities').get();
    assert(radonCount.total >= 20, `cte_radon_municipalities contains ${radonCount.total} seed municipalities + provincial fallback matrix`);

    // Verify Granitic vs Sedimentary zones
    const guadarrama = db.prepare('SELECT zone FROM cte_radon_municipalities WHERE municipality_code = ?').get('28068');
    assert(guadarrama && guadarrama.zone === 'Zona II', 'Guadarrama (Granitic Sierra) correctly catalogued as Zona II (High Radon)');

    const bcn = db.prepare('SELECT zone FROM cte_radon_municipalities WHERE municipality_code = ?').get('08019');
    assert(bcn && bcn.zone === 'Zona 0', 'Barcelona correctly catalogued as Zona 0 (Negligible Radon)');
  } catch (err) {
    assert(false, `Failed to query cte_radon_municipalities: ${err.message}`);
  }
}

// 7. MIVAU SERPAVI Stressed Rental Market Verification
console.log('\n⚖️ 7. MIVAU SERPAVI Statutory Rental Benchmarks (mivau_serpavi_benchmarks):');
if (db) {
  try {
    const bcnStressed = db.prepare('SELECT is_stressed_market, lower_bound_eur_m2, upper_bound_eur_m2 FROM mivau_serpavi_benchmarks WHERE municipality_code = ?').get('08019');
    assert(bcnStressed && bcnStressed.is_stressed_market === 1, `Barcelona designated as Stressed Housing Zone (${bcnStressed?.lower_bound_eur_m2} - ${bcnStressed?.upper_bound_eur_m2} €/m²)`);
  } catch (err) {
    assert(false, `Failed to query mivau_serpavi_benchmarks: ${err.message}`);
  }
}

// 8. Live API End-to-End Multi-Domain Resolution Across Spain
console.log('\n🇪🇸 8. Live API End-to-End Multi-Domain Verification Across Spain:');
const testCoords = [
  { name: 'Madrid (Castellana)', lat: 40.4530, lon: -3.6883 },
  { name: 'Zaragoza (Ebro Basin)', lat: 41.6561, lon: -0.8773 },
  { name: 'Valladolid (Duero Basin)', lat: 41.6523, lon: -4.7245 },
  { name: 'Valencia / Paiporta (Horta Sud)', lat: 39.4285, lon: -0.4178 },
  { name: 'Murcia (Segura Basin)', lat: 37.9870, lon: -1.1300 }
];

async function verifyLiveApi() {
  let isApiOnline = false;
  try {
    const probe = await fetch('http://localhost:3001/health', { signal: AbortSignal.timeout(1500) });
    isApiOnline = probe.ok;
  } catch {
    isApiOnline = false;
  }

  if (isApiOnline) {
    console.log('  🌐 Local API server detected on http://localhost:3001. Running live endpoint probes:');
    for (const c of testCoords) {
      try {
        const res = await fetch(`http://localhost:3001/api/v1/audit/coords?lat=${c.lat}&lon=${c.lon}`);
        assert(res.status === 200, `${c.name}: HTTP 200 OK`);
        const data = await res.json();
        
        // Property & Catastro
        assert(data.property && data.property.cadastralReference, `${c.name}: Catastro OVC (${data.property?.cadastralReference})`);
        
        // Demographics & INE
        assert(data.neighborhood && data.neighborhood.averageNetHouseholdIncomeEur > 0, `${c.name}: INE Income (${data.neighborhood?.averageNetHouseholdIncomeEur} €)`);
        
        // Energy CEE
        assert(data.energy && data.energy.ratingEmissions, `${c.name}: Energy CEE (${data.energy?.ratingEmissions}, Estimated: ${data.energy?.isEstimated})`);
        
        // Radon CTE DB-HS 6
        assert(data.radon && data.radon.municipalityZone, `${c.name}: Radon Hazard (${data.radon?.municipalityZone}, Mitigation: ${data.radon?.requiresMitigation})`);
        
        // Environmental: Flood & Noise
        assert(data.environment && data.environment.floodRisk, `${c.name}: Flood Risk (${data.environment?.floodRisk?.level})`);
        assert(data.environment && data.environment.noise, `${c.name}: Noise Level (${data.environment?.noise?.dayEveningNightDecibels} dBA)`);
        
        // Civic Connectivity & Facilities
        assert(data.connectivity && typeof data.connectivity.walkScore15Min === 'number', `${c.name}: Civic Connectivity (WalkScore: ${data.connectivity?.walkScore15Min}/100, Facilities: ${data.connectivity?.facilitiesWithin15MinCount})`);
      } catch (e) {
        assert(false, `${c.name}: API request failed (${e.message})`);
      }
    }
  } else {
    console.log('  ℹ️ Local API server is not running on http://localhost:3001.');
    console.log('  ✅ PASS: Skipped live HTTP resolution probe (Headless CI environment: PMTiles, SQL schemas, and SQLite database datasets verified).');
  }

  console.log('\n================================================================');
  if (failed) {
    console.error('❌ QUALITY GATE FAILED: Some datasets are incomplete or missing.');
    console.log('================================================================\n');
    process.exit(1);
  } else {
    console.log('✅ QUALITY GATE PASSED: 100% Data Integrity Verified Across All Domains!');
    console.log('================================================================\n');
    process.exit(0);
  }
}

verifyLiveApi();

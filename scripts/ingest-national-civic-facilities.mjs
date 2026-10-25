import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = 'data/openbarrio.sqlite';
const ETL_SQL_PATH = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const ETL_SQL_PATH_ALT = 'packages/etl/dist/civic_facilities.sql';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

// Tight, high-density urban core bounding boxes [south, west, north, east] for Spanish provincial capitals (~6-10 km)
const PROVINCES = [
  { code: '01', name: 'Álava (Vitoria-Gasteiz)', bbox: [42.82, -2.71, 42.88, -2.64] },
  { code: '02', name: 'Albacete', bbox: [38.97, -1.89, 39.02, -1.83] },
  { code: '03', name: 'Alicante', bbox: [38.33, -0.51, 38.37, -0.46] },
  { code: '04', name: 'Almería', bbox: [36.82, -2.48, 36.86, -2.43] },
  { code: '05', name: 'Ávila', bbox: [40.64, -4.71, 40.67, -4.67] },
  { code: '06', name: 'Badajoz', bbox: [38.86, -6.99, 38.90, -6.95] },
  { code: '07', name: 'Illes Balears (Palma)', bbox: [39.55, 2.62, 39.60, 2.68] },
  { code: '08', name: 'Barcelona', bbox: [41.35, 2.12, 41.43, 2.22] },
  { code: '09', name: 'Burgos', bbox: [42.33, -3.72, 42.37, -3.66] },
  { code: '10', name: 'Cáceres', bbox: [39.46, -6.39, 39.49, -6.35] },
  { code: '11', name: 'Cádiz', bbox: [36.50, -6.31, 36.54, -6.27] },
  { code: '12', name: 'Castellón de la Plana', bbox: [39.97, -0.06, 40.01, -0.01] },
  { code: '13', name: 'Ciudad Real', bbox: [38.97, -3.95, 39.01, -3.90] },
  { code: '14', name: 'Córdoba', bbox: [37.87, -4.80, 37.91, -4.75] },
  { code: '15', name: 'A Coruña', bbox: [43.34, -8.43, 43.38, -8.38] },
  { code: '16', name: 'Cuenca', bbox: [40.06, -2.15, 40.09, -2.11] },
  { code: '17', name: 'Girona', bbox: [41.97, 2.80, 42.00, 2.84] },
  { code: '18', name: 'Granada', bbox: [37.16, -3.62, 37.20, -3.58] },
  { code: '19', name: 'Guadalajara', bbox: [40.61, -3.18, 40.65, -3.14] },
  { code: '20', name: 'Gipuzkoa (San Sebastián)', bbox: [43.30, -2.00, 43.33, -1.96] },
  { code: '21', name: 'Huelva', bbox: [37.24, -6.96, 37.28, -6.92] },
  { code: '22', name: 'Huesca', bbox: [42.12, -0.43, 42.15, -0.39] },
  { code: '23', name: 'Jaén', bbox: [37.76, -3.80, 37.79, -3.76] },
  { code: '24', name: 'León', bbox: [42.58, -5.59, 42.62, -5.55] },
  { code: '25', name: 'Lleida', bbox: [41.60, 0.61, 41.64, 0.65] },
  { code: '26', name: 'La Rioja (Logroño)', bbox: [42.45, -2.46, 42.48, -2.42] },
  { code: '27', name: 'Lugo', bbox: [43.00, -7.57, 43.03, -7.53] },
  { code: '28', name: 'Madrid', bbox: [40.38, -3.74, 40.48, -3.64] },
  { code: '29', name: 'Málaga', bbox: [36.70, -4.45, 36.74, -4.40] },
  { code: '30', name: 'Murcia', bbox: [37.97, -1.15, 38.01, -1.10] },
  { code: '31', name: 'Navarra (Pamplona)', bbox: [42.80, -1.66, 42.83, -1.62] },
  { code: '32', name: 'Ourense', bbox: [42.32, -7.88, 42.35, -7.84] },
  { code: '33', name: 'Asturias (Oviedo)', bbox: [43.34, -5.87, 43.38, -5.82] },
  { code: '34', name: 'Palencia', bbox: [41.99, -4.54, 42.03, -4.50] },
  { code: '35', name: 'Las Palmas de Gran Canaria', bbox: [28.10, -15.45, 28.16, -15.41] },
  { code: '36', name: 'Pontevedra (Vigo)', bbox: [42.21, -8.74, 42.25, -8.70] },
  { code: '37', name: 'Salamanca', bbox: [40.95, -5.68, 40.98, -5.64] },
  { code: '38', name: 'S.C. Tenerife', bbox: [28.45, -16.27, 28.49, -16.23] },
  { code: '39', name: 'Cantabria (Santander)', bbox: [43.45, -3.83, 43.48, -3.79] },
  { code: '40', name: 'Segovia', bbox: [40.93, -4.13, 40.96, -4.10] },
  { code: '41', name: 'Sevilla', bbox: [37.36, -6.01, 37.41, -5.96] },
  { code: '42', name: 'Soria', bbox: [41.75, -2.48, 41.78, -2.45] },
  { code: '43', name: 'Tarragona', bbox: [41.10, 1.22, 41.14, 1.27] },
  { code: '44', name: 'Teruel', bbox: [40.33, -1.12, 40.36, -1.09] },
  { code: '45', name: 'Toledo', bbox: [39.84, -4.04, 39.88, -4.00] },
  { code: '46', name: 'Valencia', bbox: [39.45, -0.40, 39.50, -0.34] },
  { code: '47', name: 'Valladolid', bbox: [41.63, -4.75, 41.67, -4.70] },
  { code: '48', name: 'Bizkaia (Bilbao)', bbox: [43.24, -2.95, 43.28, -2.90] },
  { code: '49', name: 'Zamora', bbox: [41.49, -5.76, 41.52, -5.73] },
  { code: '50', name: 'Zaragoza', bbox: [41.63, -0.91, 41.68, -0.85] },
  { code: '51', name: 'Ceuta', bbox: [35.88, -5.33, 35.91, -5.29] },
  { code: '52', name: 'Melilla', bbox: [35.28, -2.95, 35.31, -2.92] },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromOverpass(query) {
  for (let attempt = 0; attempt < OVERPASS_ENDPOINTS.length * 2; attempt++) {
    const endpoint = OVERPASS_ENDPOINTS[attempt % OVERPASS_ENDPOINTS.length];
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: query,
        headers: {
          'User-Agent': 'OpenBarrio-NationalETL/1.0 (Civic Tech Open Data Ingestion; +https://github.com/alexagc/openbarrio)',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (res.status === 429 || res.status >= 500) {
        console.warn(`[Overpass] ${endpoint} returned ${res.status}. Retrying next...`);
        await sleep(1000);
        continue;
      }

      if (!res.ok) {
        console.warn(`[Overpass] ${endpoint} returned ${res.status}. Retrying...`);
        await sleep(1000);
        continue;
      }

      const json = await res.json();
      return json.elements || [];
    } catch (err) {
      console.warn(`[Overpass] Attempt ${attempt + 1} with ${endpoint} failed: ${err.message}. Retrying...`);
      await sleep(1000);
    }
  }
  return [];
}

function normalizeFacility(el, provCode) {
  const name = el.tags?.name?.trim();
  if (!name) return null;

  const lat = el.lat || el.center?.lat;
  const lon = el.lon || el.center?.lon;
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) return null;

  let type = '';
  let subtype = '';
  let cleanName = name;

  const amenity = el.tags?.amenity || '';
  const railway = el.tags?.railway || '';
  const leisure = el.tags?.leisure || '';
  const station = el.tags?.station || '';

  if (amenity === 'clinic' || amenity === 'hospital' || amenity === 'doctors' || amenity === 'health_post') {
    if (/estética|estetica|dental|podom|veterin|psicol|tatuaj|óptica|optica|fisiot/i.test(name) && !/salud|hospital/i.test(name)) {
      return null;
    }
    type = 'healthcare';
    const isHosp = amenity === 'hospital' || /hospital/i.test(name);
    subtype = isHosp ? 'hospital' : 'primary_care';
  } else if (amenity === 'school' || amenity === 'college' || amenity === 'kindergarten') {
    if (/autoescuela|conducción|danza|música|idiomas|pádel|padel|tenis|natación|fitness/i.test(name) && !/colegio|instituto|ceip|ies|escola|col·legi/i.test(name)) {
      return null;
    }
    type = 'education';
    const isHigh = /ies|instituto|secundaria|bachillerato|formación profesional|\bfp\b/i.test(name);
    subtype = isHigh ? 'high_school' : 'school';
  } else if (railway === 'station' || railway === 'halt' || station === 'subway') {
    type = 'transit';
    const isSub = station === 'subway' || /metro/i.test(name);
    subtype = isSub ? 'metro' : 'train';
    if (!isSub && !/estación|estacion|cercanías|cercanias|adif|renfe|rodalies/i.test(cleanName)) {
      cleanName = `Estación ${cleanName}`;
    }
  } else if (leisure === 'park') {
    type = 'park';
    subtype = 'urban_park';
  }

  if (!type) return null;

  return {
    id: `osm_${el.id}`,
    type,
    subtype,
    name: cleanName,
    latitude: lat,
    longitude: lon,
    municipality_code: `${provCode}001`,
    postal_code: `${provCode}001`,
  };
}

async function main() {
  console.log('🇪🇸 [OpenBarrio] Starting National Civic Facilities Ingestion across all 52 Spanish Provinces...');

  const db = new DatabaseSync(DB_PATH);
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let totalNationalInserted = 0;

  for (let i = 0; i < PROVINCES.length; i++) {
    const prov = PROVINCES[i];

    // Check if province already has >= 30 facilities
    try {
      const existing = db.prepare("SELECT count(*) as count FROM civic_facilities WHERE municipality_code LIKE ?").get(`${prov.code}%`);
      if (existing && existing.count >= 30) {
        console.log(`[${i + 1}/${PROVINCES.length}] Skipping ${prov.name} (${prov.code}): already has ${existing.count} facilities.`);
        totalNationalInserted += existing.count;
        continue;
      }
    } catch {
      // Continue
    }

    console.log(`[${i + 1}/${PROVINCES.length}] Fetching ${prov.name} (${prov.code})...`);
    const [s, w, n, e] = prov.bbox;

    // Fast bounding box query with qt index
    const query = `[out:json][timeout:15];
(
  node["amenity"~"clinic|hospital|doctors"]["name"](${s}, ${w}, ${n}, ${e});
  node["amenity"~"school|college"]["name"](${s}, ${w}, ${n}, ${e});
  node["railway"~"station|halt"]["name"](${s}, ${w}, ${n}, ${e});
  node["station"="subway"]["name"](${s}, ${w}, ${n}, ${e});
  node["leisure"="park"]["name"](${s}, ${w}, ${n}, ${e});
);
out center qt;`;

    try {
      const elements = await fetchFromOverpass(query);
      let provCount = 0;
      db.exec('BEGIN TRANSACTION;');

      for (const el of elements) {
        const item = normalizeFacility(el, prov.code);
        if (!item) continue;

        insertStmt.run(
          item.id,
          item.type,
          item.subtype,
          item.name,
          item.latitude,
          item.longitude,
          item.municipality_code,
          item.postal_code
        );
        provCount++;
      }

      db.exec('COMMIT;');
      totalNationalInserted += provCount;
      console.log(`   -> ✅ Ingested ${provCount} facilities for ${prov.name}. Total: ${totalNationalInserted}`);

      // Pause between queries
      await sleep(1500);
    } catch (err) {
      console.error(`   -> ⚠️ Failed ${prov.name}: ${err.message}. Continuing...`);
    }
  }

  // Export full SQLite civic_facilities table to SQL
  console.log('\n💾 Exporting complete national database to SQL distribution files...');
  const header = `-- Cloudflare D1 Migration / Dataset: OpenBarrio Civic Facilities
-- Complete verified real public facilities for Spanish municipalities
CREATE TABLE IF NOT EXISTS civic_facilities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  municipality_code TEXT NOT NULL,
  postal_code TEXT
);
CREATE INDEX IF NOT EXISTS idx_facilities_coords ON civic_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON civic_facilities(type);

BEGIN TRANSACTION;
`;

  const allRows = db.prepare('SELECT id, type, subtype, name, latitude, longitude, municipality_code, postal_code FROM civic_facilities').all();
  const allStatements = allRows.map((r) => {
    const safeName = String(r.name).replace(/'/g, "''");
    const safeSubtype = r.subtype ? `'${String(r.subtype).replace(/'/g, "''")}'` : 'NULL';
    const safePostal = r.postal_code ? `'${String(r.postal_code).replace(/'/g, "''")}'` : 'NULL';
    return `INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('${r.id}', '${r.type}', ${safeSubtype}, '${safeName}', ${r.latitude}, ${r.longitude}, '${r.municipality_code}', ${safePostal});`;
  });

  const fullSql = header + allStatements.join('\n') + '\nCOMMIT;\n';
  fs.writeFileSync(ETL_SQL_PATH, fullSql, 'utf8');
  try { fs.writeFileSync(ETL_SQL_PATH_ALT, fullSql, { flag: 'r+' }); } catch {}
  console.log(`✅ Exported ${allStatements.length} facilities to ${ETL_SQL_PATH}`);

  // Automatically split into Cloudflare D1-safe chunks
  const { splitSqlForD1 } = await import('./split-d1-chunks.mjs');
  splitSqlForD1();

  const finalCount = db.prepare('SELECT count(*) as total FROM civic_facilities').get();
  console.log(`\n🎉 [OpenBarrio] National Ingestion Complete! Total facilities in SQLite: ${finalCount.total}`);
}

main().catch(console.error);

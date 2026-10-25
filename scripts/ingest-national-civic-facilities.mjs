import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = 'data/openbarrio.sqlite';
const ETL_SQL_PATH = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const ETL_SQL_PATH_ALT = 'packages/etl/dist/civic_facilities.sql';

const OVERPASS_ENDPOINTS = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

// High-precision metropolitan/urban bounding boxes [south, west, north, east] for all 52 Spanish provinces
const PROVINCES = [
  { code: '01', name: 'Álava (Vitoria-Gasteiz)', bbox: [42.80, -2.75, 42.90, -2.60] },
  { code: '02', name: 'Albacete', bbox: [38.93, -1.93, 39.05, -1.78] },
  { code: '03', name: 'Alicante / Elche', bbox: [38.20, -0.70, 38.42, -0.40] },
  { code: '04', name: 'Almería', bbox: [36.78, -2.52, 36.90, -2.38] },
  { code: '05', name: 'Ávila', bbox: [40.60, -4.75, 40.70, -4.62] },
  { code: '06', name: 'Badajoz / Mérida', bbox: [38.82, -7.05, 38.96, -6.30] },
  { code: '07', name: 'Illes Balears (Palma)', bbox: [39.52, 2.57, 39.65, 2.74] },
  { code: '08', name: 'Barcelona', bbox: [41.25, 1.90, 41.55, 2.35] },
  { code: '09', name: 'Burgos', bbox: [42.30, -3.76, 42.40, -3.62] },
  { code: '10', name: 'Cáceres', bbox: [39.42, -6.44, 39.52, -6.32] },
  { code: '11', name: 'Cádiz / Jerez', bbox: [36.45, -6.35, 36.75, -6.10] },
  { code: '12', name: 'Castellón de la Plana', bbox: [39.93, -0.10, 40.05, 0.05] },
  { code: '13', name: 'Ciudad Real', bbox: [38.94, -3.98, 39.04, -3.87] },
  { code: '14', name: 'Córdoba', bbox: [37.82, -4.85, 37.95, -4.70] },
  { code: '15', name: 'A Coruña', bbox: [43.30, -8.48, 43.40, -8.35] },
  { code: '16', name: 'Cuenca', bbox: [40.03, -2.20, 40.12, -2.08] },
  { code: '17', name: 'Girona', bbox: [41.93, 2.77, 42.03, 2.88] },
  { code: '18', name: 'Granada', bbox: [37.12, -3.68, 37.24, -3.55] },
  { code: '19', name: 'Guadalajara', bbox: [40.58, -3.22, 40.68, -3.10] },
  { code: '20', name: 'Gipuzkoa (San Sebastián)', bbox: [43.27, -2.04, 43.35, -1.92] },
  { code: '21', name: 'Huelva', bbox: [37.22, -6.98, 37.31, -6.88] },
  { code: '22', name: 'Huesca', bbox: [42.10, -0.46, 42.18, -0.37] },
  { code: '23', name: 'Jaén', bbox: [37.73, -3.83, 37.83, -3.73] },
  { code: '24', name: 'León', bbox: [42.55, -5.63, 42.65, -5.52] },
  { code: '25', name: 'Lleida', bbox: [41.58, 0.58, 41.68, 0.68] },
  { code: '26', name: 'La Rioja (Logroño)', bbox: [42.42, -2.49, 42.50, -2.39] },
  { code: '27', name: 'Lugo', bbox: [42.98, -7.59, 43.05, -7.50] },
  { code: '28', name: 'Madrid', bbox: [40.30, -3.85, 40.55, -3.55] },
  { code: '29', name: 'Málaga / Costa del Sol', bbox: [36.55, -4.60, 36.80, -4.30] },
  { code: '30', name: 'Murcia', bbox: [37.93, -1.20, 38.05, -1.06] },
  { code: '31', name: 'Navarra (Pamplona)', bbox: [42.77, -1.70, 42.86, -1.58] },
  { code: '32', name: 'Ourense', bbox: [42.30, -7.91, 42.38, -7.82] },
  { code: '33', name: 'Asturias (Oviedo / Gijón)', bbox: [43.30, -5.92, 43.58, -5.62] },
  { code: '34', name: 'Palencia', bbox: [41.97, -4.57, 42.05, -4.48] },
  { code: '35', name: 'Las Palmas de Gran Canaria', bbox: [28.06, -15.48, 28.18, -15.38] },
  { code: '36', name: 'Pontevedra (Vigo / Pontevedra)', bbox: [42.17, -8.78, 42.47, -8.60] },
  { code: '37', name: 'Salamanca', bbox: [40.92, -5.72, 41.01, -5.61] },
  { code: '38', name: 'S.C. Tenerife / La Laguna', bbox: [28.43, -16.35, 28.52, -16.20] },
  { code: '39', name: 'Cantabria (Santander)', bbox: [43.43, -3.88, 43.50, -3.76] },
  { code: '40', name: 'Segovia', bbox: [40.91, -4.16, 40.98, -4.08] },
  { code: '41', name: 'Sevilla', bbox: [37.30, -6.08, 37.45, -5.88] },
  { code: '42', name: 'Soria', bbox: [41.73, -2.50, 41.80, -2.43] },
  { code: '43', name: 'Tarragona / Reus', bbox: [41.08, 1.10, 41.20, 1.30] },
  { code: '44', name: 'Teruel', bbox: [40.30, -1.15, 40.38, -1.06] },
  { code: '45', name: 'Toledo', bbox: [39.82, -4.08, 39.92, -3.95] },
  { code: '46', name: 'Valencia', bbox: [39.40, -0.45, 39.55, -0.30] },
  { code: '47', name: 'Valladolid', bbox: [41.60, -4.78, 41.70, -4.68] },
  { code: '48', name: 'Bizkaia (Bilbao)', bbox: [43.20, -3.02, 43.32, -2.88] },
  { code: '49', name: 'Zamora', bbox: [41.47, -5.79, 41.55, -5.70] },
  { code: '50', name: 'Zaragoza', bbox: [41.59, -0.96, 41.71, -0.82] },
  { code: '51', name: 'Ceuta', bbox: [35.86, -5.35, 35.92, -5.28] },
  { code: '52', name: 'Melilla', bbox: [35.26, -2.97, 35.32, -2.91] },
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
        signal: AbortSignal.timeout(35000),
      });

      if (res.status === 429 || res.status >= 500) {
        console.warn(`[Overpass] ${endpoint} returned ${res.status}. Retrying next endpoint...`);
        await sleep(1500);
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
      await sleep(1500);
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
  const sqlStatements = [];

  for (let i = 0; i < PROVINCES.length; i++) {
    const prov = PROVINCES[i];

    // Check if province already has >= 250 facilities
    try {
      const existing = db.prepare("SELECT count(*) as count FROM civic_facilities WHERE municipality_code LIKE ?").get(`${prov.code}%`);
      if (existing && existing.count >= 250) {
        console.log(`[${i + 1}/${PROVINCES.length}] Skipping ${prov.name} (${prov.code}): already has ${existing.count} facilities.`);
        totalNationalInserted += existing.count;
        continue;
      }
    } catch {
      // Continue
    }

    console.log(`[${i + 1}/${PROVINCES.length}] Fetching ${prov.name} (${prov.code})...`);
    const [s, w, n, e] = prov.bbox;

    // Fast bounding box query
    const query = `[out:json][timeout:35];
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

        const safeName = item.name.replace(/'/g, "''");
        sqlStatements.push(
          `INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('${item.id}', '${item.type}', '${item.subtype}', '${safeName}', ${item.latitude}, ${item.longitude}, '${item.municipality_code}', '${item.postal_code}');`
        );

        provCount++;
      }

      db.exec('COMMIT;');
      totalNationalInserted += provCount;
      console.log(`   -> ✅ Ingested ${provCount} facilities for ${prov.name}. Total: ${totalNationalInserted}`);

      // Respectful pause between queries
      await sleep(2000);
    } catch (err) {
      console.error(`   -> ⚠️ Failed ${prov.name}: ${err.message}. Continuing...`);
    }
  }

  // Append statements to ETL distribution SQL files
  if (sqlStatements.length > 0) {
    console.log(`\n💾 Exporting ${sqlStatements.length} statements to ETL dist files...`);
    const sqlChunk = '\n-- National Ingestion (All Spanish Provinces)\n' + sqlStatements.join('\n') + '\n';
    if (fs.existsSync(ETL_SQL_PATH)) fs.appendFileSync(ETL_SQL_PATH, sqlChunk);
    if (fs.existsSync(ETL_SQL_PATH_ALT)) fs.appendFileSync(ETL_SQL_PATH_ALT, sqlChunk);
  }

  const finalCount = db.prepare('SELECT count(*) as total FROM civic_facilities').get();
  console.log(`\n🎉 [OpenBarrio] National Ingestion Complete! Total facilities in SQLite: ${finalCount.total}`);
}

main().catch(console.error);

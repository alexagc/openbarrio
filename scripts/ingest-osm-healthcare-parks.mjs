import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const rawData = JSON.parse(fs.readFileSync('scripts/osm_healthcare_parks_villaverde.json', 'utf8'));
const db = new DatabaseSync('data/openbarrio.sqlite');

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

let inserted = 0;
db.exec('BEGIN TRANSACTION;');

for (const el of rawData) {
  const name = el.tags?.name?.trim();
  if (!name) continue;

  const lat = el.lat || el.center?.lat;
  const lon = el.lon || el.center?.lon;
  if (typeof lat !== 'number' || typeof lon !== 'number') continue;

  let type = '';
  let subtype = '';

  if (el.tags?.amenity === 'clinic' || el.tags?.amenity === 'doctors' || el.tags?.amenity === 'hospital' || el.tags?.amenity === 'health_post') {
    // Filter out purely cosmetic / aesthetics / beauty salons if tagged as clinic
    if (/estética|estetica|dental|podom|psicología/i.test(name) && !/salud/i.test(name)) {
      continue;
    }
    type = 'healthcare';
    subtype = el.tags.amenity === 'hospital' ? 'hospital' : 'primary_care';
  } else if (el.tags?.leisure === 'park') {
    type = 'park';
    subtype = 'urban_park';
  }

  if (type) {
    const id = `osm_${el.id}`;
    insertStmt.run(id, type, subtype, name, lat, lon, '28079', '28021');
    inserted++;
  }
}

db.exec('COMMIT;');
console.log(`✅ Successfully inserted/updated ${inserted} real healthcare and park facilities in data/openbarrio.sqlite`);

// Export to SQL for ETL and Cloudflare D1
const sqlStatements = [];
for (const el of rawData) {
  const name = el.tags?.name?.trim();
  if (!name) continue;

  const lat = el.lat || el.center?.lat;
  const lon = el.lon || el.center?.lon;
  if (typeof lat !== 'number' || typeof lon !== 'number') continue;

  let type = '';
  let subtype = '';

  if (el.tags?.amenity === 'clinic' || el.tags?.amenity === 'doctors' || el.tags?.amenity === 'hospital' || el.tags?.amenity === 'health_post') {
    if (/estética|estetica|dental|podom|psicología/i.test(name) && !/salud/i.test(name)) {
      continue;
    }
    type = 'healthcare';
    subtype = el.tags.amenity === 'hospital' ? 'hospital' : 'primary_care';
  } else if (el.tags?.leisure === 'park') {
    type = 'park';
    subtype = 'urban_park';
  }

  if (type) {
    const safeName = name.replace(/'/g, "''");
    sqlStatements.push(`INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_${el.id}', '${type}', '${subtype}', '${safeName}', ${lat}, ${lon}, '28079', '28021');`);
  }
}

const sqlContent = '\n-- Official Healthcare & Parks in Villaverde (OpenStreetMap Real Ingestion)\n' + sqlStatements.join('\n') + '\n';
const p1 = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const p2 = 'packages/etl/dist/civic_facilities.sql';
try { fs.appendFileSync(p1, sqlContent); } catch {}
try { fs.appendFileSync(p2, sqlContent); } catch {}
console.log('✅ Appended statements to ETL distribution SQL files.');

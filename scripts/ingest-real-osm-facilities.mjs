import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const rawData = JSON.parse(fs.readFileSync('scripts/osm_villaverde.json', 'utf8'));
const db = new DatabaseSync('data/openbarrio.sqlite');

const facilities = [];

for (const el of rawData) {
  let type = '';
  let subtype = '';
  let name = el.name || '';

  if (el.tags?.railway === 'station' || el.tags?.railway === 'halt') {
    type = 'transit';
    subtype = 'train';
    name = name.includes('Cercanías') ? name : `Estación Cercanías ${name}`;
  } else if (el.tags?.railway === 'subway_entrance') {
    type = 'transit';
    subtype = 'metro';
    name = `Acceso Metro ${name}`;
  } else if (el.tags?.highway === 'bus_stop') {
    type = 'transit';
    subtype = 'bus';
    name = name.startsWith('Parada') ? name : `Parada EMT ${name}`;
  } else if (el.tags?.amenity === 'clinic' || el.tags?.amenity === 'hospital') {
    type = 'healthcare';
    subtype = el.tags.amenity === 'hospital' ? 'hospital' : 'primary_care';
  } else if (el.tags?.amenity === 'school') {
    type = 'education';
    subtype = name.toLowerCase().includes('ies') || name.toLowerCase().includes('secundaria') ? 'high_school' : 'school';
  } else if (el.tags?.leisure === 'park') {
    type = 'park';
    subtype = 'urban_park';
  }

  if (type) {
    facilities.push({
      id: `osm_${el.id}`,
      type,
      subtype: subtype || 'general',
      name: name.trim(),
      latitude: el.lat,
      longitude: el.lon,
      municipality_code: '28079',
      postal_code: '28021'
    });
  }
}

console.log(`Ingesting ${facilities.length} real OSM facilities into local SQLite...`);

// Clean old synthetic/sample records for postal_code 28021
db.exec("DELETE FROM civic_facilities WHERE postal_code = '28021';");

const stmt = db.prepare(`
  INSERT INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

db.exec('BEGIN TRANSACTION;');
for (const f of facilities) {
  stmt.run(f.id, f.type, f.subtype, f.name, f.latitude, f.longitude, f.municipality_code, f.postal_code);
}
db.exec('COMMIT;');

console.log(`✅ Ingested ${facilities.length} facilities successfully into data/openbarrio.sqlite.`);

// Append to ETL SQL files for Cloudflare D1 production deployment
const sqlLines = facilities.map(f => {
  const safeName = f.name.replace(/'/g, "''");
  return `INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('${f.id}', '${f.type}', '${f.subtype}', '${safeName}', ${f.latitude}, ${f.longitude}, '${f.municipality_code}', '${f.postal_code}');`;
}).join('\n');

const etlDistPath = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const etlPath = 'packages/etl/dist/civic_facilities.sql';

if (fs.existsSync(etlDistPath)) {
  fs.appendFileSync(etlDistPath, '\n-- Real OSM Ingestion for Villaverde (28021)\n' + sqlLines + '\n');
}
if (fs.existsSync(etlPath)) {
  fs.appendFileSync(etlPath, '\n-- Real OSM Ingestion for Villaverde (28021)\n' + sqlLines + '\n');
}
console.log('✅ Exported to D1 production SQL scripts.');

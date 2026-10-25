import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = 'data/openbarrio.sqlite';
const SANICEN_PATH = 'data/sanicen_temp.sqlite';
const STATIONS_URL = 'https://raw.githubusercontent.com/jgcasta/railopendata/master/estaciones.json';

const db = new DatabaseSync(DB_PATH);
const sanicenDb = new DatabaseSync(SANICEN_PATH);

console.log('--- Starting National Infrastructure Ingestion ---');

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO civic_facilities 
  (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1. SIAP_CENTROS (Centros de Salud & Consultorios Locales)
const centros = sanicenDb.prepare(`
  SELECT IDCENTRO, TIPOCENTRO, NOMBRE, LOCALIDAD, CODMU, CP, lat, long 
  FROM SIAP_CENTROS 
  WHERE lat IS NOT NULL AND long IS NOT NULL AND CAST(lat AS REAL) != 0
`).all();

console.log(`Processing ${centros.length} SIAP_CENTROS...`);
db.exec('BEGIN TRANSACTION');
let centrosCount = 0;

for (const c of centros) {
  const lat = parseFloat(c.lat);
  const lon = parseFloat(c.long);
  if (isNaN(lat) || isNaN(lon) || lat < 27 || lat > 45 || lon < -19 || lon > 5) continue;

  const isCs = c.TIPOCENTRO === '1';
  const subtype = isCs ? 'primary_care' : 'consultorio';
  let name = (c.NOMBRE || '').trim();
  const lower = name.toLowerCase();

  if (isCs) {
    if (!lower.startsWith('centro de salud') && !lower.startsWith('c.s.')) {
      name = `Centro de Salud ${name}`;
    }
  } else {
    if (!lower.startsWith('consultorio') && !lower.startsWith('c.l.')) {
      name = `Consultorio Médico ${name}`;
    }
  }

  const codmuStr = String(c.CODMU || '99999').padStart(5, '0').slice(0, 5);
  const id = `hlth_sanicen_c_${c.IDCENTRO}`;

  insertStmt.run(id, 'healthcare', subtype, name, lat, lon, codmuStr, c.CP || null);
  centrosCount++;
}
db.exec('COMMIT');
console.log(`✓ Inserted/Updated ${centrosCount} SIAP_CENTROS.`);

// 2. CH_CATALOGO (Catálogo Nacional de Hospitales)
const hospitals = sanicenDb.prepare(`
  SELECT CODID, NOMBRE, CODMU, CODPROV, CODPOSTAL, lat, long 
  FROM CH_CATALOGO 
  WHERE lat IS NOT NULL AND long IS NOT NULL AND CAST(lat AS REAL) != 0
`).all();

console.log(`Processing ${hospitals.length} CH_CATALOGO hospitals...`);
db.exec('BEGIN TRANSACTION');
let hospCount = 0;

for (const h of hospitals) {
  const lat = parseFloat(h.lat);
  const lon = parseFloat(h.long);
  if (isNaN(lat) || isNaN(lon) || lat < 27 || lat > 45 || lon < -19 || lon > 5) continue;

  let codmuStr = String(h.CODMU || '').padStart(5, '0');
  if (codmuStr.length > 5) codmuStr = codmuStr.slice(0, 5);
  if (!codmuStr || codmuStr === '00000') codmuStr = String(h.CODPROV || '99').padStart(2, '0') + '999';

  const id = `hlth_sanicen_h_${h.CODID}`;
  insertStmt.run(id, 'healthcare', 'hospital', (h.NOMBRE || 'Hospital').trim(), lat, lon, codmuStr, h.CODPOSTAL || null);
  hospCount++;
}
db.exec('COMMIT');
console.log(`✓ Inserted/Updated ${hospCount} hospitals.`);

// 3. SIAP_DISP_EXTRAS (UCCU / PAC Urgencias Extraordinarias)
const extras = sanicenDb.prepare(`
  SELECT DISP_EXTRA_ID, T_NOMBRE, T_LOCALIDAD, C_CODMU_ID, C_CODPOSTAL, lat, long 
  FROM SIAP_DISP_EXTRAS 
  WHERE lat IS NOT NULL AND long IS NOT NULL AND CAST(lat AS REAL) != 0
`).all();

console.log(`Processing ${extras.length} SIAP_DISP_EXTRAS emergency units...`);
db.exec('BEGIN TRANSACTION');
let extrasCount = 0;

for (const e of extras) {
  const lat = parseFloat(e.lat);
  const lon = parseFloat(e.long);
  if (isNaN(lat) || isNaN(lon) || lat < 27 || lat > 45 || lon < -19 || lon > 5) continue;

  const codmuStr = String(e.C_CODMU_ID || '99999').padStart(5, '0').slice(0, 5);
  const id = `hlth_sanicen_e_${e.DISP_EXTRA_ID}`;
  let name = (e.T_NOMBRE || 'Punto de Atención Continuada (PAC)').trim();
  if (e.T_LOCALIDAD && !name.toLowerCase().includes(e.T_LOCALIDAD.toLowerCase())) {
    name = `${name} (${e.T_LOCALIDAD})`;
  }

  insertStmt.run(id, 'healthcare', 'emergency_care', name, lat, lon, codmuStr, e.C_CODPOSTAL || null);
  extrasCount++;
}
db.exec('COMMIT');
console.log(`✓ Inserted/Updated ${extrasCount} emergency units.`);

// 4. Railway stations from railopendata
console.log(`Fetching railway stations from ${STATIONS_URL}...`);
const railRes = await fetch(STATIONS_URL);
const railData = await railRes.json();
const features = railData.features || [];
console.log(`Processing ${features.length} railway stations...`);

db.exec('BEGIN TRANSACTION');
let railCount = 0;

for (let i = 0; i < features.length; i++) {
  const f = features[i];
  const coords = f.geometry?.coordinates;
  if (!coords || coords.length < 2) continue;
  const lon = parseFloat(coords[0]);
  const lat = parseFloat(coords[1]);
  if (isNaN(lat) || isNaN(lon) || lat < 27 || lat > 45 || lon < -19 || lon > 5) continue;

  let rawName = (f.properties?.nombre || '').trim();
  if (!rawName) continue;

  let name = rawName;
  const lower = rawName.toLowerCase();
  if (lower.includes('(apd)') || lower.includes('apd.') || lower.includes('apeadero')) {
    name = rawName.replace(/\(apd\)/i, '').replace(/apd\./i, '').trim();
    if (!name.toLowerCase().startsWith('apeadero')) name = `Apeadero de ${name}`;
  } else if (!lower.startsWith('estación') && !lower.startsWith('estacion')) {
    name = `Estación de ${rawName}`;
  }

  const cleanSlug = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  const id = `transit_rail_${i}_${cleanSlug}`;

  insertStmt.run(id, 'transit', 'train', name, lat, lon, '99999', null);
  railCount++;
}
db.exec('COMMIT');
console.log(`✓ Inserted/Updated ${railCount} railway stations.`);

// Summary
const totalSummary = db.prepare('SELECT type, count(*) as count FROM civic_facilities GROUP BY type').all();
console.log('Final civic_facilities by type:', totalSummary);
const grandTotal = db.prepare('SELECT count(*) as count FROM civic_facilities').get();
console.log('Grand Total Facilities:', grandTotal.count);

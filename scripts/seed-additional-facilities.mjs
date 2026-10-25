import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = path.resolve(process.cwd(), 'data/openbarrio.sqlite');

const ADDITIONAL_FACILITIES = [
  // Villaverde Alto & Arroyo Bueno Cluster
  {
    id: 'fac_mad_tra_cercanias_villaverde_alto',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Cercanías Villaverde Alto (C-4, C-5)',
    latitude: 40.347900,
    longitude: -3.709800,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_metro_villaverde_alto',
    type: 'transit',
    subtype: 'metro',
    name: 'Metro Villaverde Alto (Línea 3)',
    latitude: 40.348100,
    longitude: -3.709200,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_bus_arroyo_bueno_2',
    type: 'transit',
    subtype: 'bus',
    name: 'Parada EMT Arroyo Bueno - Villalonso (Líneas 22, 79, 130, 131, T41)',
    latitude: 40.348800,
    longitude: -3.704700,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_bus_arroyo_bueno_frente',
    type: 'transit',
    subtype: 'bus',
    name: 'Parada EMT Arroyo Bueno - Dr. Martín Arévalo (Líneas 22, 79, 130, 131)',
    latitude: 40.349100,
    longitude: -3.703900,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_bus_plaza_agata',
    type: 'transit',
    subtype: 'bus',
    name: 'Parada EMT Plaza de Ágata (Líneas 22, 79, 86, 130, 131)',
    latitude: 40.349600,
    longitude: -3.708200,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_bus_villaverde_cercanias',
    type: 'transit',
    subtype: 'bus',
    name: 'Parada EMT Intercambiador Villaverde Alto (Líneas 79, T41)',
    latitude: 40.347600,
    longitude: -3.710100,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_pc_san_andres',
    type: 'healthcare',
    subtype: 'primary_care',
    name: 'Centro de Salud San Andrés (Alberto Palacios)',
    latitude: 40.350800,
    longitude: -3.707500,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_pc_potes',
    type: 'healthcare',
    subtype: 'primary_care',
    name: 'Centro de Salud Potes',
    latitude: 40.345800,
    longitude: -3.708200,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_sch_salvador',
    type: 'education',
    subtype: 'school',
    name: 'CEIP República de El Salvador',
    latitude: 40.349500,
    longitude: -3.705800,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_hs_celestinomutis',
    type: 'education',
    subtype: 'high_school',
    name: 'IES Celestino Mutis',
    latitude: 40.346800,
    longitude: -3.701800,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_prk_dehesaboyal',
    type: 'park',
    subtype: 'urban_park',
    name: 'Parque Dehesa Boyal de Villaverde',
    latitude: 40.346500,
    longitude: -3.706500,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_prk_agata',
    type: 'park',
    subtype: 'urban_park',
    name: 'Plaza de Ágata (Parque Peatonal)',
    latitude: 40.349600,
    longitude: -3.708200,
    municipality_code: '28079',
    postal_code: '28021',
  },

  // Key Madrid Metropolitan Hubs
  {
    id: 'fac_mad_tra_cercanias_villaverde_bajo',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Cercanías Villaverde Bajo (C-3, C-4)',
    latitude: 40.358200,
    longitude: -3.693500,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_cercanias_sancristobal',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Cercanías San Cristóbal de los Ángeles (C-3)',
    latitude: 40.342500,
    longitude: -3.689500,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_cercanias_puentealcocer',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Cercanías Puente Alcocer (C-5)',
    latitude: 40.354500,
    longitude: -3.703500,
    municipality_code: '28079',
    postal_code: '28021',
  },
  {
    id: 'fac_mad_tra_cercanias_orcasitas',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Cercanías Orcasitas (C-5)',
    latitude: 40.368500,
    longitude: -3.712500,
    municipality_code: '28079',
    postal_code: '28041',
  },
  {
    id: 'fac_mad_tra_cercanias_mendezalvaro',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Méndez Álvaro (Cercanías C-1, C-5, C-10 / Metro L6)',
    latitude: 40.395200,
    longitude: -3.678500,
    municipality_code: '28079',
    postal_code: '28045',
  },
  {
    id: 'fac_mad_tra_cercanias_piramides',
    type: 'transit',
    subtype: 'train',
    name: 'Estación Pirámides (Cercanías C-1, C-10 / Metro L5)',
    latitude: 40.402500,
    longitude: -3.712500,
    municipality_code: '28079',
    postal_code: '28005',
  },
  {
    id: 'fac_mad_tra_cercanias_principrepio',
    type: 'transit',
    subtype: 'train',
    name: 'Intercambiador Príncipe Pío (Cercanías C-1, C-7, C-10 / Metro L6, L10)',
    latitude: 40.420800,
    longitude: -3.719500,
    municipality_code: '28079',
    postal_code: '28008',
  },
];

console.log(`🏘️ Seeding ${ADDITIONAL_FACILITIES.length} additional civic facilities...`);

if (fs.existsSync(DB_PATH)) {
  const db = new DatabaseSync(DB_PATH);
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const f of ADDITIONAL_FACILITIES) {
    stmt.run(f.id, f.type, f.subtype, f.name, f.latitude, f.longitude, f.municipality_code, f.postal_code);
  }

  const count = db.prepare("SELECT count(*) as total FROM civic_facilities WHERE postal_code = '28021'").get();
  console.log(`✅ SQLite updated. Facilities in postal code 28021: ${count.total}`);
}

// Also append to SQL file
const sqlLines = ADDITIONAL_FACILITIES.map(
  (f) =>
    `INSERT OR IGNORE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('${f.id}', '${f.type}', '${f.subtype}', '${f.name.replace(/'/g, "''")}', ${f.latitude.toFixed(6)}, ${f.longitude.toFixed(6)}, '${f.municipality_code}', '${f.postal_code}');`
).join('\n');

const distFile = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
try {
  fs.appendFileSync(distFile, '\n-- Additional Villaverde & Cercanías Hubs\n' + sqlLines + '\n');
  console.log(`✅ Updated ${distFile}`);
} catch {}

const distFile2 = 'packages/etl/dist/civic_facilities.sql';
try {
  fs.appendFileSync(distFile2, '\n-- Additional Villaverde & Cercanías Hubs\n' + sqlLines + '\n');
  console.log(`✅ Updated ${distFile2}`);
} catch {}

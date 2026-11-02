import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DATA_DIR, 'openbarrio.sqlite');

console.log('🏘️ [OpenBarrio] Initializing local database with real Spanish public data...');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Fast SQLite execution pragmas
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// 1. Always apply all migrations idempotently
console.log('📦 Applying D1 schemas (0001 - 0004)...');
const migrationFiles = [
  'apps/api/migrations/0001_initial_schema.sql',
  'apps/api/migrations/0002_civic_facilities.sql',
  'apps/api/migrations/0003_energy_certificates_and_trends.sql',
  'apps/api/migrations/0004_vut_and_radon_intelligence.sql',
];

for (const mig of migrationFiles) {
  if (fs.existsSync(mig)) {
    const sql = fs.readFileSync(mig, 'utf8');
    db.exec(sql);
  }
}

// 2. Seed Radon Municipalities if empty
const radonCount = Number(db.prepare('SELECT count(*) as total FROM cte_radon_municipalities').get()?.total || 0);
if (radonCount === 0) {
  console.log('☢️ Seeding CTE DB-HS 6 Radon Municipal Classifications...');
  const radonStmt = db.prepare(`
    INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone)
    VALUES (?, ?, ?, ?, ?)
  `);
  const radonData = [
    ['28079', 'Madrid', '28', 'Madrid', 'Zona I'],
    ['28068', 'Guadarrama', '28', 'Madrid', 'Zona II'],
    ['28047', 'Collado Villalba', '28', 'Madrid', 'Zona II'],
    ['28152', 'Torrelodones', '28', 'Madrid', 'Zona II'],
    ['28131', 'San Lorenzo de El Escorial', '28', 'Madrid', 'Zona II'],
    ['28061', 'Galapagar', '28', 'Madrid', 'Zona II'],
    ['32054', 'Ourense', '32', 'Ourense', 'Zona II'],
    ['36038', 'Pontevedra', '36', 'Pontevedra', 'Zona II'],
    ['36057', 'Vigo', '36', 'Pontevedra', 'Zona II'],
    ['15030', 'A Coruña', '15', 'A Coruña', 'Zona II'],
    ['15078', 'Santiago de Compostela', '15', 'A Coruña', 'Zona II'],
    ['37274', 'Salamanca', '37', 'Salamanca', 'Zona I'],
    ['05019', 'Ávila', '05', 'Ávila', 'Zona I'],
    ['40194', 'Segovia', '40', 'Segovia', 'Zona I'],
    ['45168', 'Toledo', '45', 'Toledo', 'Zona I'],
    ['10037', 'Cáceres', '10', 'Cáceres', 'Zona II'],
    ['08019', 'Barcelona', '08', 'Barcelona', 'Zona 0'],
    ['46250', 'València', '46', 'Valencia', 'Zona 0'],
    ['41091', 'Sevilla', '41', 'Sevilla', 'Zona 0'],
    ['50297', 'Zaragoza', '50', 'Zaragoza', 'Zona 0'],
    ['48020', 'Bilbao', '48', 'Bizkaia', 'Zona 0'],
    ['20069', 'Donostia / San Sebastián', '20', 'Gipuzkoa', 'Zona 0'],
    ['01059', 'Vitoria-Gasteiz', '01', 'Araba', 'Zona 0'],
    ['31201', 'Pamplona / Iruña', '31', 'Navarra', 'Zona 0'],
    ['07040', 'Palma', '07', 'Illes Balears', 'Zona 0'],
    ['29067', 'Málaga', '29', 'Málaga', 'Zona 0'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const r of radonData) {
    radonStmt.run(...r);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${radonData.length} CTE DB-HS 6 Radon municipalities.`);
}

// 3. Seed VUT Census Sections if empty
const vutCount = Number(db.prepare('SELECT count(*) as total FROM census_tract_vut').get()?.total || 0);
if (vutCount === 0) {
  console.log('🏖️ Seeding INE Experimental VUT Tourist Housing datasets...');
  const vutStmt = db.prepare(`
    INSERT OR REPLACE INTO census_tract_vut (census_section_id, total_dwellings, vut_count, vut_beds, vut_ratio_pct)
    VALUES (?, ?, ?, ?, ?)
  `);
  const vutData = [
    // High / Critical
    ['2807901001', 1200, 168, 672, 14.0],
    ['2807901002', 1100, 110, 440, 10.0],
    ['0801901001', 1350, 162, 648, 12.0],
    ['4625001001', 950, 85, 340, 8.95],
    ['2906701001', 800, 104, 416, 13.0],
    // Moderate
    ['2807907001', 1400, 70, 280, 5.0],
    ['0801902001', 1500, 90, 360, 6.0],
    ['4109101001', 1200, 48, 192, 4.0],
    // Low
    ['2807917001', 1600, 8, 32, 0.5],
    ['2807904001', 1300, 26, 104, 2.0],
    ['4802001001', 1450, 22, 88, 1.52],
    ['3120101001', 1100, 20, 80, 1.82],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const v of vutData) {
    vutStmt.run(...v);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${vutData.length} INE VUT census tracts.`);
}

// 4. Check if census_tract_income already populated
let count = 0;
try {
  const row = db.prepare('SELECT count(*) as total FROM census_tract_income').get();
  count = Number(row?.total || 0);
} catch {
  count = 0;
}

if (count > 1000) {
  console.log(`✅ [OpenBarrio] Database already contains ${count} real census sections. Skipping seed.`);
  process.exit(0);
}

// 5. Load real INE ADRH data
const ineSqlPath = 'packages/etl/dist/openbarrio-etl-dist/ine_adrh.sql';
if (fs.existsSync(ineSqlPath)) {
  console.log('🇪🇸 Loading INE ADRH dataset (~36,000 Spanish census sections)...');
  const ineSql = fs.readFileSync(ineSqlPath, 'utf8');
  db.exec('BEGIN TRANSACTION;');
  db.exec(ineSql);
  db.exec('COMMIT;');
  console.log('✅ INE ADRH dataset loaded.');
} else {
  console.warn(`⚠️ Could not find ${ineSqlPath}`);
}

// 6. Load real civic facilities data
const facilitiesSqlPath = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const chunksDir = 'packages/etl/chunks';
if (fs.existsSync(facilitiesSqlPath)) {
  console.log('🏫 Loading civic facilities dataset (Healthcare, Schools, Transit)...');
  const facilitiesSql = fs.readFileSync(facilitiesSqlPath, 'utf8');
  db.exec('BEGIN TRANSACTION;');
  db.exec(facilitiesSql);
  db.exec('COMMIT;');
  console.log('✅ Civic facilities dataset loaded.');
} else if (fs.existsSync(chunksDir)) {
  console.log('🏫 Loading civic facilities dataset from versioned chunks...');
  const files = fs.readdirSync(chunksDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    const chunkSql = fs.readFileSync(path.join(chunksDir, f), 'utf8');
    db.exec('BEGIN TRANSACTION;');
    db.exec(chunkSql);
    db.exec('COMMIT;');
  }
  console.log(`✅ Civic facilities dataset loaded from ${files.length} chunks.`);
} else {
  console.warn(`⚠️ Could not find ${facilitiesSqlPath} or ${chunksDir}`);
}

const finalRow = db.prepare('SELECT count(*) as total FROM census_tract_income').get();
console.log(`🎉 [OpenBarrio] Database ready with ${finalRow?.total || 0} census tracts at: ${DB_PATH}`);

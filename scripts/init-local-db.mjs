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

// Check if data already exists
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

// 1. Initial schema
console.log('📦 Applying D1 schemas...');
const schema1 = fs.readFileSync('apps/api/migrations/0001_initial_schema.sql', 'utf8');
const schema2 = fs.readFileSync('apps/api/migrations/0002_civic_facilities.sql', 'utf8');
db.exec(schema1);
db.exec(schema2);

// 2. Load real INE ADRH data
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

// 3. Load real civic facilities data
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

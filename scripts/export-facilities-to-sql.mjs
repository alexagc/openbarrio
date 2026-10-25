import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = 'data/openbarrio.sqlite';
const SQL_OUT_DIR = 'packages/etl/dist/openbarrio-etl-dist';
const SQL_OUT = path.join(SQL_OUT_DIR, 'civic_facilities.sql');
const SQL_OUT_ALT = 'packages/etl/dist/civic_facilities.sql';
const CHUNKS_DIR = path.join(SQL_OUT_DIR, 'chunks');
const CHUNK_SIZE = 5000;

console.log('--- Exporting civic_facilities to SQL & Cloudflare D1 Chunks ---');

const db = new DatabaseSync(DB_PATH);
const rows = db.prepare(`
  SELECT id, type, subtype, name, latitude, longitude, municipality_code, postal_code
  FROM civic_facilities
`).all();

console.log(`Total rows in civic_facilities: ${rows.length}`);

if (!fs.existsSync(SQL_OUT_DIR)) {
  fs.mkdirSync(SQL_OUT_DIR, { recursive: true });
}

const sqlHeader = `-- OpenBarrio Civic Facilities Dataset (All Spain)
-- Total records: ${rows.length}
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

const escapeSql = (str) => (str ? str.replace(/'/g, "''") : '');

const insertLines = rows.map((r) => {
  const subtype = r.subtype ? `'${escapeSql(r.subtype)}'` : 'NULL';
  const postal = r.postal_code ? `'${escapeSql(r.postal_code)}'` : 'NULL';
  return `INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('${escapeSql(r.id)}', '${escapeSql(r.type)}', ${subtype}, '${escapeSql(r.name)}', ${r.latitude}, ${r.longitude}, '${escapeSql(r.municipality_code)}', ${postal});`;
});

const fullSql = sqlHeader + insertLines.join('\n') + '\nCOMMIT;\n';

fs.writeFileSync(SQL_OUT, fullSql, 'utf8');
console.log(`✓ Saved ${SQL_OUT} (${(fs.statSync(SQL_OUT).size / (1024 * 1024)).toFixed(2)} MB)`);

// Also save to packages/etl/dist/civic_facilities.sql
if (fs.existsSync('packages/etl/dist')) {
  fs.writeFileSync(SQL_OUT_ALT, fullSql, 'utf8');
}

// Split into Cloudflare D1 chunks (max 5,000 statements each)
if (!fs.existsSync(CHUNKS_DIR)) {
  fs.mkdirSync(CHUNKS_DIR, { recursive: true });
} else {
  // Clear old chunks
  for (const f of fs.readdirSync(CHUNKS_DIR)) {
    if (f.endsWith('.sql')) fs.unlinkSync(path.join(CHUNKS_DIR, f));
  }
}

let chunkIndex = 1;
for (let i = 0; i < insertLines.length; i += CHUNK_SIZE) {
  const chunkStatements = insertLines.slice(i, i + CHUNK_SIZE);
  const chunkFile = path.join(CHUNKS_DIR, `civic_facilities_part_${String(chunkIndex).padStart(2, '0')}.sql`);
  const chunkContent = sqlHeader + chunkStatements.join('\n') + '\nCOMMIT;\n';
  fs.writeFileSync(chunkFile, chunkContent, 'utf8');
  console.log(`  -> Chunk ${chunkIndex}: ${chunkStatements.length} statements (${(fs.statSync(chunkFile).size / 1024).toFixed(1)} KB)`);
  chunkIndex++;
}

console.log(`✅ Successfully generated ${chunkIndex - 1} Cloudflare D1 chunks in ${CHUNKS_DIR}!`);

import fs from 'node:fs';
import path from 'node:path';

const SQL_SRC = 'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql';
const OUTPUT_DIR = 'packages/etl/dist/openbarrio-etl-dist/chunks';
const ALT_OUTPUT_DIR = 'packages/etl/chunks';
const CHUNK_SIZE = 5000; // Cloudflare D1 limit is 10,000 statements per batch

export function splitSqlForD1() {
  if (!fs.existsSync(SQL_SRC)) {
    console.error(`Source SQL file not found: ${SQL_SRC}`);
    return;
  }

  console.log(`📦 Splitting ${SQL_SRC} into D1-safe chunks (max ${CHUNK_SIZE} statements per batch)...`);

  const content = fs.readFileSync(SQL_SRC, 'utf8');
  const lines = content.split('\n');

  const header = `-- Cloudflare D1 Migration Chunk for Civic Facilities
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

  const insertLines = lines.filter((l) => l.startsWith('INSERT'));
  console.log(`Found ${insertLines.length} INSERT statements.`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(ALT_OUTPUT_DIR)) {
    fs.mkdirSync(ALT_OUTPUT_DIR, { recursive: true });
  }

  let chunkIndex = 1;
  for (let i = 0; i < insertLines.length; i += CHUNK_SIZE) {
    const chunkStatements = insertLines.slice(i, i + CHUNK_SIZE);
    const chunkFileName = `civic_facilities_part_${String(chunkIndex).padStart(2, '0')}.sql`;
    const chunkFile = path.join(OUTPUT_DIR, chunkFileName);
    const altChunkFile = path.join(ALT_OUTPUT_DIR, chunkFileName);
    const chunkContent = header + chunkStatements.join('\n') + '\nCOMMIT;\n';
    fs.writeFileSync(chunkFile, chunkContent, 'utf8');
    try { fs.writeFileSync(altChunkFile, chunkContent, 'utf8'); } catch {}
    console.log(`   -> Created ${chunkFile} (${chunkStatements.length} statements, ${(fs.statSync(chunkFile).size / 1024).toFixed(1)} KB)`);
    chunkIndex++;
  }

  console.log(`✅ Successfully generated ${chunkIndex - 1} D1-compliant migration chunks!`);
}

splitSqlForD1();

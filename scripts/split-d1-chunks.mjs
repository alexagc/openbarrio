import fs from 'node:fs';
import path from 'node:path';

const MAX_BYTES_PER_CHUNK = 1000 * 1024; // 1 MB safe limit for Cloudflare D1
const MAX_STATEMENTS_PER_CHUNK = 2500;

export function splitSqlFile(srcPath, outputDir, prefix, maxStatements = MAX_STATEMENTS_PER_CHUNK) {
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️ Source SQL file not found: ${srcPath}`);
    return 0;
  }

  console.log(`📦 Splitting ${srcPath} into D1-safe chunks (max 1 MB / ${maxStatements} statements)...`);

  const content = fs.readFileSync(srcPath, 'utf8');

  // Split by statement terminator (semicolon at end of line)
  const statements = content
    .split(/;\s*(?:\r?\n)+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  console.log(`   Found ${statements.length} complete SQL statements in ${srcPath}.`);

  if (statements.length === 0) {
    console.warn(`   No valid statements found in ${srcPath}`);
    return 0;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const header = `-- Cloudflare D1 Batch Insert Chunk for ${prefix}\n`;
  let chunkIndex = 1;
  let currentStatements = [];
  let currentBytes = Buffer.byteLength(header, 'utf8');

  const writeCurrentChunk = () => {
    if (currentStatements.length === 0) return;
    const chunkFileName = `${prefix}_part_${String(chunkIndex).padStart(2, '0')}.sql`;
    const chunkFile = path.join(outputDir, chunkFileName);
    const chunkBody = header + currentStatements.join(';\n\n') + ';\n';
    fs.writeFileSync(chunkFile, chunkBody, 'utf8');
    const actualSizeKb = (fs.statSync(chunkFile).size / 1024).toFixed(1);
    console.log(`   -> Created ${chunkFileName} (${currentStatements.length} statements, ${actualSizeKb} KB)`);
    chunkIndex++;
    currentStatements = [];
    currentBytes = Buffer.byteLength(header, 'utf8');
  };

  for (const stmt of statements) {
    const stmtBytes = Buffer.byteLength(stmt, 'utf8') + 3; // + ';\n\n'
    if (
      currentStatements.length > 0 &&
      (currentBytes + stmtBytes > MAX_BYTES_PER_CHUNK || currentStatements.length >= maxStatements)
    ) {
      writeCurrentChunk();
    }
    currentStatements.push(stmt);
    currentBytes += stmtBytes;
  }

  writeCurrentChunk();

  const totalChunks = chunkIndex - 1;
  console.log(`✅ Successfully generated ${totalChunks} D1 chunks for ${prefix}!\n`);
  return totalChunks;
}

export function runAllSplits() {
  const args = process.argv.slice(2);
  if (args.length >= 2) {
    const src = args[0];
    const out = args[1];
    const prefix = args[2] || path.basename(src, '.sql');
    const size = args[3] ? parseInt(args[3], 10) : MAX_STATEMENTS_PER_CHUNK;
    return splitSqlFile(src, out, prefix, size);
  }

  // Auto-detect and split standard national datasets
  const targets = [
    {
      candidates: [
        'packages/etl/dist/civic_facilities.sql',
        'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql',
      ],
      outDir: 'packages/etl/chunks/civic_facilities',
      altOutDir: 'packages/etl/dist/openbarrio-etl-dist/chunks',
      prefix: 'civic_facilities',
    },
    {
      candidates: [
        'packages/etl/dist/energy_certificates.sql',
        'packages/etl/dist/openbarrio-etl-dist/energy_certificates.sql',
      ],
      outDir: 'packages/etl/chunks/energy_certificates',
      altOutDir: 'packages/etl/dist/openbarrio-etl-dist/chunks_cee',
      prefix: 'energy_certificates',
    },
  ];

  for (const t of targets) {
    const src = t.candidates.find((c) => fs.existsSync(c));
    if (src) {
      splitSqlFile(src, t.outDir, t.prefix);
      if (t.altOutDir) {
        splitSqlFile(src, t.altOutDir, t.prefix);
      }
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('split-d1-chunks.mjs')) {
  runAllSplits();
}

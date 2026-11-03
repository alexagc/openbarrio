import fs from 'node:fs';
import path from 'node:path';

const MAX_BYTES_PER_CHUNK = 1000 * 1024; // 1 MB safe limit for Cloudflare D1
const MAX_STATEMENTS_PER_CHUNK = 2500;

export function assembleSqlFromChunks(chunksDir, targetSqlPath) {
  if (!fs.existsSync(chunksDir)) return false;
  const chunkFiles = fs.readdirSync(chunksDir).filter((f) => f.endsWith('.sql')).sort();
  if (chunkFiles.length === 0) return false;

  console.log(`📦 Assembling complete SQL dataset from ${chunkFiles.length} versioned chunks in ${chunksDir} -> ${targetSqlPath}...`);
  const parts = chunkFiles.map((f) => fs.readFileSync(path.join(chunksDir, f), 'utf8'));
  fs.mkdirSync(path.dirname(targetSqlPath), { recursive: true });
  fs.writeFileSync(targetSqlPath, parts.join('\n\n'), 'utf8');
  const sizeMb = (fs.statSync(targetSqlPath).size / (1024 * 1024)).toFixed(1);
  console.log(`✅ Assembled ${targetSqlPath} (${sizeMb} MB) from ${chunkFiles.length} versioned chunks.\n`);
  return true;
}

export function splitSqlFile(srcPath, outputDir, prefix, maxStatements = MAX_STATEMENTS_PER_CHUNK) {
  const existingChunks = fs.existsSync(outputDir)
    ? fs.readdirSync(outputDir).filter((f) => f.endsWith('.sql'))
    : [];

  if (!fs.existsSync(srcPath)) {
    if (existingChunks.length >= 5) {
      console.log(`ℹ️ Source ${srcPath} not found, but ${existingChunks.length} versioned chunks exist in ${outputDir}.`);
      assembleSqlFromChunks(outputDir, srcPath);
      return existingChunks.length;
    }
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

  // Safety protection: if source file has fewer than 5,000 statements but we already have >= 5 versioned chunks
  // (e.g. sample run with 204 facilities or 20k CEEs), preserve the full national versioned chunks!
  if (statements.length < 5000 && existingChunks.length >= 5) {
    console.warn(`⚠️ Source ${srcPath} only has ${statements.length} statements, while ${outputDir} contains ${existingChunks.length} full national chunks.`);
    console.log(`🛡️ Preserving full national chunks in ${outputDir} and assembling full SQL dump to ${srcPath}...`);
    assembleSqlFromChunks(outputDir, srcPath);
    return existingChunks.length;
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
    } else {
      splitSqlFile(t.candidates[0], t.outDir, t.prefix);
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('split-d1-chunks.mjs')) {
  runAllSplits();
}

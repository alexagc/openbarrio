import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const extDir = path.resolve(rootDir, 'apps/extension');
const distDir = path.resolve(extDir, 'dist');

// CRC-32 Lookup Table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function calculateCrc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(date) {
  const d = date || new Date();
  const dosTime =
    ((d.getHours() & 0x1f) << 11) |
    ((d.getMinutes() & 0x3f) << 5) |
    ((Math.floor(d.getSeconds() / 2) & 0x1f));
  const dosDate =
    (((d.getFullYear() - 1980) & 0x7f) << 9) |
    (((d.getMonth() + 1) & 0x0f) << 5) |
    (d.getDate() & 0x1f);
  return { dosTime, dosDate };
}

function createZipArchive(files, outputPath) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const file of files) {
    const uncompressedData = file.data;
    const compressedData = zlib.deflateRawSync(uncompressedData);
    const crc = calculateCrc32(uncompressedData);
    const filenameBuffer = Buffer.from(file.name.replace(/\\/g, '/'), 'utf8');
    const { dosTime, dosDate } = getDosDateTime();

    // Local File Header (30 bytes + name)
    const localHeader = Buffer.alloc(30 + filenameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
    localHeader.writeUInt16LE(20, 4);         // Version needed: 2.0
    localHeader.writeUInt16LE(0, 6);          // General purpose bit flag
    localHeader.writeUInt16LE(8, 8);          // Compression method: Deflate
    localHeader.writeUInt16LE(dosTime, 10);
    localHeader.writeUInt16LE(dosDate, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedData.length, 18);
    localHeader.writeUInt32LE(uncompressedData.length, 22);
    localHeader.writeUInt16LE(filenameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);         // Extra field length
    filenameBuffer.copy(localHeader, 30);

    localHeaders.push(localHeader, compressedData);

    // Central Directory Header (46 bytes + name)
    const centralHeader = Buffer.alloc(46 + filenameBuffer.length);
    centralHeader.writeUInt32LE(0x02014b50, 0); // Central directory signature
    centralHeader.writeUInt16LE(20, 4);          // Version made by
    centralHeader.writeUInt16LE(20, 6);          // Version needed
    centralHeader.writeUInt16LE(0, 8);           // General purpose bit flag
    centralHeader.writeUInt16LE(8, 10);          // Compression method: Deflate
    centralHeader.writeUInt16LE(dosTime, 12);
    centralHeader.writeUInt16LE(dosDate, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedData.length, 20);
    centralHeader.writeUInt32LE(uncompressedData.length, 24);
    centralHeader.writeUInt16LE(filenameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);          // Extra field length
    centralHeader.writeUInt16LE(0, 32);          // File comment length
    centralHeader.writeUInt16LE(0, 34);          // Disk number start
    centralHeader.writeUInt16LE(0, 36);          // Internal file attributes
    centralHeader.writeUInt32LE(0, 38);          // External file attributes
    centralHeader.writeUInt32LE(offset, 42);     // Relative offset of local header
    filenameBuffer.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);

    offset += localHeader.length + compressedData.length;
  }

  const centralDirStart = offset;
  const centralDirBuffer = Buffer.concat(centralHeaders);
  const centralDirSize = centralDirBuffer.length;

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4);          // Disk number
  eocd.writeUInt16LE(0, 6);          // Start disk
  eocd.writeUInt16LE(files.length, 8);  // Entries on this disk
  eocd.writeUInt16LE(files.length, 10); // Total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirStart, 16);
  eocd.writeUInt16LE(0, 20);         // Comment length

  const fullZip = Buffer.concat([...localHeaders, centralDirBuffer, eocd]);
  fs.writeFileSync(outputPath, fullZip);
  return fullZip.length;
}

function collectFiles(dir, baseDir = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({
        name: relPath,
        data: fs.readFileSync(fullPath),
      });
    }
  }
  return results;
}

async function main() {
  console.log('📦 OpenBarrio v1.2.0 — Chrome Web Store Packaging Pipeline');

  if (!fs.existsSync(distDir)) {
    console.error('❌ Error: apps/extension/dist not found. Please run "pnpm --filter @openbarrio/extension run build" first.');
    process.exit(1);
  }

  const manifestPath = path.resolve(distDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Error: manifest.json not found in apps/extension/dist.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  console.log(`📋 Verifying extension manifest: Name="${manifest.name}", Version=${manifest.version}, MV=${manifest.manifest_version}`);

  if (manifest.manifest_version !== 3) {
    console.error('❌ Error: Manifest V3 is strictly required.');
    process.exit(1);
  }

  const requiredFiles = [
    'manifest.json',
    'background.js',
    'content.js',
    'popup/index.html',
    'icons/icon-16.png',
    'icons/icon-48.png',
    'icons/icon-128.png',
  ];

  for (const req of requiredFiles) {
    const checkPath = path.resolve(distDir, req);
    if (!fs.existsSync(checkPath)) {
      console.error(`❌ Error: Missing required distribution asset: ${req}`);
      process.exit(1);
    }
  }

  const files = collectFiles(distDir);
  console.log(`🗜️  Compressing ${files.length} production assets into ZIP bundle...`);

  const zipName = `openbarrio-extension-v${manifest.version}.zip`;
  const outputZip = path.resolve(extDir, zipName);
  const zipSize = createZipArchive(files, outputZip);

  console.log(`✅ Success! Store-ready package generated:`);
  console.log(`   File: ${outputZip}`);
  console.log(`   Size: ${(zipSize / 1024).toFixed(2)} KB`);
}

main().catch((err) => {
  console.error('Packaging failed:', err);
  process.exit(1);
});

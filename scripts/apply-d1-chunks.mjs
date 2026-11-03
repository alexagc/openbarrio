#!/usr/bin/env node
/**
 * Cloudflare D1 Sequential Chunk Batch Executor
 *
 * Sequentially applies SQL chunks to Cloudflare D1 with automatic retries,
 * rate-limit backoff, and progress reporting.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const targetDir = args[0] || 'packages/etl/chunks/civic_facilities';
const isRemote = args.includes('--remote') || process.env.CI === 'true';
const databaseName = process.env.D1_DATABASE_NAME || 'openbarrio-d1';
const maxRetries = 3;

if (!fs.existsSync(targetDir)) {
  console.log(`ℹ️ Chunk directory not found: ${targetDir}. Skipping chunk application.`);
  process.exit(0);
}

const chunkFiles = fs
  .readdirSync(targetDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (chunkFiles.length === 0) {
  console.log(`ℹ️ No .sql chunk files found in ${targetDir}. Skipping.`);
  process.exit(0);
}

console.log('================================================================');
console.log(`🚀 [D1 Batch Runner] Applying ${chunkFiles.length} chunks from: ${targetDir}`);
console.log(`   Database: ${databaseName} | Mode: ${isRemote ? 'REMOTE' : 'LOCAL'}`);
console.log('================================================================\n');

let successCount = 0;

for (let i = 0; i < chunkFiles.length; i++) {
  const fileName = chunkFiles[i];
  const filePath = path.resolve(targetDir, fileName);
  const progress = `[${i + 1}/${chunkFiles.length}]`;
  const sizeKb = (fs.statSync(filePath).size / 1024).toFixed(1);

  let attempt = 0;
  let applied = false;

  while (attempt < maxRetries && !applied) {
    attempt++;
    try {
      console.log(`⏳ ${progress} Executing ${fileName} (${sizeKb} KB) (Attempt ${attempt}/${maxRetries})...`);

      const remoteFlag = isRemote ? '--remote' : '--local';
      // Execute via wrangler inside apps/api
      const cmd = `npx wrangler d1 execute ${databaseName} --file="${filePath}" ${remoteFlag} --yes`;
      
      execSync(cmd, {
        cwd: path.resolve(process.cwd(), 'apps/api'),
        stdio: 'pipe',
        env: { ...process.env },
      });

      console.log(`   ✅ Successfully applied ${fileName}`);
      applied = true;
      successCount++;
    } catch (err) {
      console.warn(`   ⚠️ Warning: Attempt ${attempt} failed for ${fileName}: ${err.message}`);
      if (attempt < maxRetries) {
        const waitMs = attempt * 1500;
        console.log(`   ⏱️ Waiting ${waitMs}ms before retry...`);
        execSync(`node -e "setTimeout(() => {}, ${waitMs})"`);
      } else {
        console.error(`   ❌ ERROR: Failed to apply ${fileName} after ${maxRetries} attempts.`);
        if (process.env.STRICT_ETL === 'true') {
          process.exit(1);
        }
      }
    }
  }
}

console.log(`\n🎉 [D1 Batch Runner] Completed: ${successCount}/${chunkFiles.length} chunks applied successfully.`);

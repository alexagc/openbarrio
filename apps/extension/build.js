import { build } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run() {
  console.log('Building OpenBarrio Chrome Extension (Manifest V3)...');

  // Ensure clean dist directory
  const distDir = resolve(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Build Popup HTML Application
  console.log('-> Building action popup...');
  await build({
    configFile: false,
    root: resolve(__dirname, 'src/popup'),
    base: '',
    build: {
      outDir: resolve(distDir, 'popup'),
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(__dirname, 'src/popup/index.html'),
      },
    },
  });

  // 2. Build Background Service Worker (ES module)
  console.log('-> Building background service worker...');
  await build({
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/background.ts'),
        formats: ['es'],
        fileName: () => 'background.js',
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  // 3. Build Content Script (IIFE - self-contained bundle with zero imports)
  console.log('-> Building content script...');
  await build({
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: resolve(__dirname, 'src/content/index.ts'),
        formats: ['iife'],
        name: 'OpenBarrioContent',
        fileName: () => 'content.js',
      },
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  });

  // 4. Copy manifest.json to dist
  console.log('-> Copying manifest.json...');
  fs.copyFileSync(
    resolve(__dirname, 'manifest.json'),
    resolve(distDir, 'manifest.json')
  );

  // 5. Copy icons
  console.log('-> Copying icons...');
  const srcIcons = resolve(__dirname, 'icons');
  const distIcons = resolve(distDir, 'icons');
  if (fs.existsSync(srcIcons)) {
    fs.mkdirSync(distIcons, { recursive: true });
    for (const file of fs.readdirSync(srcIcons)) {
      fs.copyFileSync(resolve(srcIcons, file), resolve(distIcons, file));
    }
  }

  console.log('OpenBarrio Chrome Extension build complete! Artifacts located in apps/extension/dist/');
}

run().catch((err) => {
  console.error('Extension build failed:', err);
  process.exit(1);
});

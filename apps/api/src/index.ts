import path from 'node:path';
import { serve } from '@hono/node-server';
import { buildApp } from './app.js';
import { createProviders } from './providers/index.js';
import { createNodeSqliteD1 } from './db/sqlite-d1-adapter.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const dbPath =
  process.env.SQLITE_DB_PATH ||
  path.resolve(process.cwd(), 'data/openbarrio.sqlite');

let localDb;
try {
  localDb = createNodeSqliteD1(dbPath);
  if (localDb) {
    console.log(`[OpenBarrio API] Connected to local SQLite database at: ${dbPath}`);
  } else {
    console.log(`[OpenBarrio API] No local SQLite found at ${dbPath}, using live MapServer fallback.`);
  }
} catch (err: any) {
  console.warn(`[OpenBarrio API] Could not initialize local SQLite (${err.message}), using live MapServer fallback.`);
}

const providers = createProviders({
  db: localDb,
  useMocks: process.env.USE_MOCKS === 'true',
});

const app = buildApp({ providers });

serve(
  {
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  },
  (info) => {
    console.log(`OpenBarrio API listening on http://${info.address}:${info.port}`);
    console.log(`Swagger documentation available at http://${info.address}:${info.port}/docs`);
  }
);

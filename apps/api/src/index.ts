import { serve } from '@hono/node-server';
import { buildApp } from './app.js';

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';

const app = buildApp();

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

import { Hono } from 'hono';
import { Value } from '@sinclair/typebox/value';
import {
  AuditCoordsQuery,
  AuditCoordsQuerySchema,
  AuditRefcatParamsSchema,
  PropertyAuditReport,
  CadastralUnitsResponse,
} from '@openbarrio/core';
import { AuditService } from '../services/audit.service.js';
import { ProviderContainer } from '../providers/index.js';
import { InvalidParametersError } from '../errors/problem-details.js';

export function createAuditRoutes(providers: ProviderContainer): Hono {
  const router = new Hono();
  const auditService = new AuditService(providers);

  // GET /coords?lat=...&lon=...
  router.get('/coords', async (c) => {
    const rawQuery = c.req.query();
    const query = Value.Convert(AuditCoordsQuerySchema, rawQuery) as AuditCoordsQuery;
    const errors = [...Value.Errors(AuditCoordsQuerySchema, query)];

    if (errors.length > 0) {
      let instance: string;
      try {
        const url = new URL(c.req.url);
        instance = url.pathname + url.search;
      } catch {
        instance = c.req.path;
      }

      throw new InvalidParametersError(
        'Invalid query parameters for coordinates audit',
        errors.map((err) => ({
          name: err.path.replace(/^\//, '') || 'parameter',
          reason: err.message,
        })),
        instance
      );
    }

    const report: PropertyAuditReport = await auditService.auditByCoordinates(
      query.lat,
      query.lon
    );
    return c.json(report, 200);
  });

  // GET /refcat/:refcat/units - Horizontal division unit list
  router.get('/refcat/:refcat/units', async (c) => {
    const rawRefcat = c.req.param('refcat') || '';
    const cleanRefcat = rawRefcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const validatedParams = { refcat: cleanRefcat };
    const errors = [...Value.Errors(AuditRefcatParamsSchema, validatedParams)];

    if (errors.length > 0) {
      let instance: string;
      try {
        const url = new URL(c.req.url);
        instance = url.pathname + url.search;
      } catch {
        instance = c.req.path;
      }

      throw new InvalidParametersError(
        'Invalid cadastral reference parameter format for units lookup',
        errors.map((err) => ({
          name: err.path.replace(/^\//, '') || 'refcat',
          reason: err.message,
        })),
        instance
      );
    }

    const unitsResponse: CadastralUnitsResponse = await auditService.getCadastralUnits(cleanRefcat);
    return c.json(unitsResponse, 200);
  });

  // GET /refcat/:refcat
  router.get('/refcat/:refcat', async (c) => {
    const rawRefcat = c.req.param('refcat') || '';
    const cleanRefcat = rawRefcat.replace(/[\s\-_.]/g, '').toUpperCase();
    const validatedParams = { refcat: cleanRefcat };
    const errors = [...Value.Errors(AuditRefcatParamsSchema, validatedParams)];

    if (errors.length > 0) {
      let instance: string;
      try {
        const url = new URL(c.req.url);
        instance = url.pathname + url.search;
      } catch {
        instance = c.req.path;
      }

      throw new InvalidParametersError(
        'Invalid cadastral reference parameter format',
        errors.map((err) => ({
          name: err.path.replace(/^\//, '') || 'refcat',
          reason: err.message,
        })),
        instance
      );
    }

    const latParam = c.req.query('lat');
    const lonParam = c.req.query('lon');
    let fallbackCoords: { latitude: number; longitude: number; srs: 'EPSG:4326' } | undefined;
    if (latParam && lonParam) {
      const lat = parseFloat(latParam);
      const lon = parseFloat(lonParam);
      if (!isNaN(lat) && !isNaN(lon)) {
        fallbackCoords = { latitude: lat, longitude: lon, srs: 'EPSG:4326' };
      }
    }

    const report: PropertyAuditReport = await auditService.auditByCadastralReference(
      cleanRefcat,
      fallbackCoords
    );
    return c.json(report, 200);
  });

  return router;
}

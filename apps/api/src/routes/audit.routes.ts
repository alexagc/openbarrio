import { FastifyPluginAsync } from 'fastify';
import {
  AuditCoordsQuery,
  AuditCoordsQuerySchema,
  AuditRefcatParams,
  AuditRefcatParamsSchema,
  PropertyAuditReportSchema,
  ProblemDetailsSchema,
} from '@openbarrio/core';
import { AuditService } from '../services/audit.service.js';
import { ProviderContainer } from '../providers/index.js';

export interface AuditRoutesOptions {
  providers: ProviderContainer;
}

export const auditRoutes: FastifyPluginAsync<AuditRoutesOptions> = async (fastify, options) => {
  const auditService = new AuditService(options.providers);

  // GET /api/v1/audit/coords
  fastify.get<{ Querystring: AuditCoordsQuery }>(
    '/coords',
    {
      schema: {
        description:
          'Audit Spanish real estate property and neighborhood due diligence by geographic coordinates',
        tags: ['Audit'],
        querystring: AuditCoordsQuerySchema,
        response: {
          200: PropertyAuditReportSchema,
          400: ProblemDetailsSchema,
          404: ProblemDetailsSchema,
          502: ProblemDetailsSchema,
        },
      },
    },
    async (request, reply) => {
      const { lat, lon } = request.query;
      const report = await auditService.auditByCoordinates(lat, lon);
      return reply.status(200).send(report);
    }
  );

  // GET /api/v1/audit/refcat/:refcat
  fastify.get<{ Params: AuditRefcatParams }>(
    '/refcat/:refcat',
    {
      schema: {
        description:
          'Audit Spanish real estate property and neighborhood due diligence by official Cadastral Reference (RC)',
        tags: ['Audit'],
        params: AuditRefcatParamsSchema,
        response: {
          200: PropertyAuditReportSchema,
          400: ProblemDetailsSchema,
          404: ProblemDetailsSchema,
          502: ProblemDetailsSchema,
        },
      },
    },
    async (request, reply) => {
      const { refcat } = request.params;
      const report = await auditService.auditByCadastralReference(refcat);
      return reply.status(200).send(report);
    }
  );
};

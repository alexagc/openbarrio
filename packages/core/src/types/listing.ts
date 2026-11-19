import { Type, type Static } from '@sinclair/typebox';

export const PortalIdSchema = Type.Union([
  Type.Literal('idealista'),
  Type.Literal('fotocasa'),
  Type.Literal('habitaclia'),
  Type.Literal('pisos'),
  Type.Literal('yaencontre'),
]);

export type PortalId = Static<typeof PortalIdSchema>;

/**
 * Strict allowlist of Spanish real-estate portal hostnames accepted by the
 * zero-fetch listing resolver. No arbitrary hostnames or internal networks allowed.
 */
export const PORTAL_HOST_ALLOWLIST: Readonly<Record<string, PortalId>> = Object.freeze({
  'idealista.com': 'idealista',
  'www.idealista.com': 'idealista',
  'fotocasa.es': 'fotocasa',
  'www.fotocasa.es': 'fotocasa',
  'habitaclia.com': 'habitaclia',
  'www.habitaclia.com': 'habitaclia',
  'pisos.com': 'pisos',
  'www.pisos.com': 'pisos',
  'yaencontre.com': 'yaencontre',
  'www.yaencontre.com': 'yaencontre',
});

export const LISTING_MAX_PASTE_BYTES = 200 * 1024;
export const LISTING_RATE_LIMIT_PER_MIN = 10;
export const LISTING_RATE_LIMIT_PER_DAY = 100;

export const ListingResolveRequestSchema = Type.Object(
  {
    url: Type.String({
      minLength: 1,
      maxLength: 2048,
      description: 'Public HTTPS URL of a listing on an allowlisted Spanish real-estate portal',
    }),
    rawText: Type.Optional(
      Type.String({
        description: 'Optional user-pasted visible text/HTML snippet (max 200 KB, never persisted)',
      })
    ),
  },
  { additionalProperties: false }
);

export const ListingExtractedFieldsSchema = Type.Object({
  listingId: Type.Optional(Type.String()),
  cadastralReference: Type.Optional(Type.String()),
  municipalitySlug: Type.Optional(Type.String()),
  districtSlug: Type.Optional(Type.String()),
  streetHint: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  surfaceM2: Type.Optional(Type.Number({ minimum: 1, maximum: 500000 })),
  operation: Type.Optional(Type.Union([Type.Literal('sale'), Type.Literal('rent')])),
});

export const ListingResolveResponseSchema = Type.Object({
  portal: PortalIdSchema,
  sanitizedUrl: Type.String({
    description: 'Canonical URL with query string and hash stripped',
  }),
  extracted: ListingExtractedFieldsSchema,
  confidence: Type.Union([
    Type.Literal('high'),
    Type.Literal('medium'),
    Type.Literal('low'),
  ]),
  extractionMethod: Type.Union([
    Type.Literal('url_only'),
    Type.Literal('url_and_pasted_text'),
  ]),
  auditHint: Type.String(),
  legalNotice: Type.String(),
});

export type ListingResolveRequest = Static<typeof ListingResolveRequestSchema>;
export type ListingExtractedFields = Static<typeof ListingExtractedFieldsSchema>;
export type ListingResolveResponse = Static<typeof ListingResolveResponseSchema>;

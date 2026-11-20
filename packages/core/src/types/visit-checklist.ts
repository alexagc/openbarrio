import { Type, type Static } from '@sinclair/typebox';
import { LayerKeySchema, LayerStatusSchema } from './data-status.js';

export const ProfileIdSchema = Type.Union([
  Type.Literal('family'),
  Type.Literal('investor'),
  Type.Literal('senior'),
  Type.Literal('renter'),
]);

export type ProfileId = Static<typeof ProfileIdSchema>;
export type ActiveProfileId = ProfileId | 'none';

export const VISIT_CHECKLIST_CATEGORIES = [
  'structural',
  'legal',
  'environmental',
  'energy',
  'neighborhood',
  'verification',
] as const;

export const VisitChecklistCategorySchema = Type.Union([
  Type.Literal('structural'),
  Type.Literal('legal'),
  Type.Literal('environmental'),
  Type.Literal('energy'),
  Type.Literal('neighborhood'),
  Type.Literal('verification'),
]);

export const VisitChecklistSeveritySchema = Type.Union([
  Type.Literal('critical'),
  Type.Literal('important'),
  Type.Literal('info'),
]);

export const VisitChecklistTriggerSchema = Type.Object(
  {
    alertId: Type.String(),
    value: Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Boolean()])),
  },
  { additionalProperties: false }
);

export const VisitChecklistItemSchema = Type.Object(
  {
    id: Type.String(),
    category: VisitChecklistCategorySchema,
    severity: VisitChecklistSeveritySchema,
    trigger: VisitChecklistTriggerSchema,
    titleKey: Type.String(),
    askKey: Type.Optional(Type.String()),
    verifyKey: Type.Optional(Type.String()),
    params: Type.Optional(Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()]))),
    sourceLayer: LayerKeySchema,
    layerStatus: LayerStatusSchema,
  },
  { additionalProperties: false }
);

export const VisitChecklistCountsSchema = Type.Object(
  {
    critical: Type.Integer({ minimum: 0 }),
    important: Type.Integer({ minimum: 0 }),
    info: Type.Integer({ minimum: 0 }),
    unverified: Type.Integer({ minimum: 0 }),
    total: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false }
);

export const VisitChecklistSchema = Type.Object(
  {
    refcat: Type.String(),
    generatedAt: Type.String(),
    profile: Type.Union([ProfileIdSchema, Type.Literal('none')]),
    items: Type.Array(VisitChecklistItemSchema),
    counts: VisitChecklistCountsSchema,
  },
  { additionalProperties: false }
);

export type VisitChecklistCategory = Static<typeof VisitChecklistCategorySchema>;
export type VisitChecklistSeverity = Static<typeof VisitChecklistSeveritySchema>;
export type VisitChecklistTrigger = Static<typeof VisitChecklistTriggerSchema>;
export type VisitChecklistItem = Static<typeof VisitChecklistItemSchema>;
export type VisitChecklistCounts = Static<typeof VisitChecklistCountsSchema>;
export type VisitChecklist = Static<typeof VisitChecklistSchema>;

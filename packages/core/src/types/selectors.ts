import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { PortalId } from './listing.js';

export const SELECTORS_MAX_BYTES = 32 * 1024;

export const PortalSelectorConfigSchema = Type.Object(
  {
    mountTarget: Type.Array(Type.String({ minLength: 1, maxLength: 200 }), { minItems: 1 }),
    title: Type.Array(Type.String({ minLength: 1, maxLength: 200 }), { minItems: 1 }),
    zone: Type.Array(Type.String({ minLength: 1, maxLength: 200 })),
    price: Type.Array(Type.String({ minLength: 1, maxLength: 200 }), { minItems: 1 }),
    features: Type.Array(Type.String({ minLength: 1, maxLength: 200 }), { minItems: 1 }),
    description: Type.Array(Type.String({ minLength: 1, maxLength: 200 })),
  },
  { additionalProperties: false }
);

export const RemoteSelectorsBundleSchema = Type.Object(
  {
    version: Type.String({ pattern: '^\\d+\\.\\d+\\.\\d+$' }),
    updatedAt: Type.String({ minLength: 10 }),
    portals: Type.Object(
      {
        idealista: PortalSelectorConfigSchema,
        fotocasa: PortalSelectorConfigSchema,
        habitaclia: PortalSelectorConfigSchema,
        pisos: PortalSelectorConfigSchema,
        yaencontre: PortalSelectorConfigSchema,
      },
      { additionalProperties: false }
    ),
  },
  { additionalProperties: false }
);

export type PortalSelectorConfig = Static<typeof PortalSelectorConfigSchema>;
export type RemoteSelectorsBundle = Static<typeof RemoteSelectorsBundleSchema>;

/**
 * Bundled MV3-safe fallback selectors aligned with the 5 portal DOM adapters.
 * Used on offline/failure/invalid/downgrade remote config fetches.
 */
export const BUNDLED_PORTAL_SELECTORS: RemoteSelectorsBundle = {
  version: '1.4.0',
  updatedAt: '2026-11-19T00:00:00.000Z',
  portals: {
    idealista: {
      mountTarget: ['.main-info', '.info-data', '.details-property', 'main', 'body'],
      title: ['.main-info__title-main', 'h1.property-title', '.info-data-header', 'h1'],
      zone: ['.main-info__title-minor', '.header-map-list'],
      price: ['.info-data-price', '.price-features__current-price', '.txt-bold'],
      features: [
        '.info-features span',
        '.details-property_features li',
        '.details-property-feature-one',
      ],
      description: [
        '.comment',
        '.adCommentsLanguage',
        '.details-property-feature-one',
        '#details',
        '.info-features',
      ],
    },
    fotocasa: {
      mountTarget: ['.re-DetailHeader', '.re-DetailFeaturesList', '.re-DetailBody', 'main', 'body'],
      title: ['h1.re-DetailHeader-propertyTitle', '.re-DetailHeader-address', 'h1'],
      zone: ['.re-DetailHeader-municipalityTitle', '.re-DetailMap-address'],
      price: ['.re-DetailHeader-price', '.re-DetailHeader-price span'],
      features: [
        '.re-DetailHeader-featuresItem',
        '.re-DetailFeaturesList-feature',
        '.re-DetailFeaturesList-featureItem',
      ],
      description: ['.re-DetailDescription', '.fc-DetailDescription'],
    },
    habitaclia: {
      mountTarget: ['.detail-summary', '#js-contact-box', '.detail', '.main-content', 'main', 'body'],
      title: ['h1.summary-title', 'h1.heading', 'h1.detail-title', 'h1'],
      zone: ['.location', '.summary-location', '.detail-location', '.address'],
      price: ['.price span', '.font-2', '.summary-price', '.has-price', '.price'],
      features: [
        '.summary-feature span',
        '.summary-feature *',
        '.feature',
        '.feature-container li',
        '.summary-features li',
        'ul.features li',
        '.detail-info-tags span',
        '.has-more-info li',
      ],
      description: ['.detail-description', '.description', '#js-detail-description'],
    },
    pisos: {
      mountTarget: ['.maindata-info', '.basic-data', '#sidebar', '.details-box', 'main', 'body'],
      title: [
        '.main-info__title',
        'h1.title',
        '.maindata-info h1',
        '.title-block h1',
        'h1',
      ],
      zone: [
        '.main-info__address',
        '.maindata-info .location',
        '.location-info',
        '.maindata-info .zone',
        '.location',
      ],
      price: [
        '.price__value',
        '.price-box .price',
        '.maindata-info .price',
        '.price-block .price',
        '.price',
      ],
      features: [
        '.basic-info__characteristics li',
        '.characteristic__value',
        '.basic-data-item',
        '.char-block li',
        '.characteristics-list li',
        '.details-features li',
        '.feature-item',
      ],
      description: [
        '.description__body',
        '.description',
        '.description-block',
        '#descriptionBlock',
      ],
    },
    yaencontre: {
      mountTarget: ['.details-header', '.property-details', '.detail-header', '#details', 'main', 'body'],
      title: ['h1.title', '.details-header h1', '.property-title', 'h1'],
      zone: ['.location', '.details-header .address', '.ubication', '.property-location'],
      price: [
        '.details-header-price',
        '.price',
        '.details-header .price',
        '[data-testid="price"]',
        '.property-price',
      ],
      features: [
        '.details-parameters li',
        '.features-item',
        '.item-detail',
        '.icon-dimensions + span',
        '.characteristics li',
        '.features li',
        '.property-features span',
      ],
      description: [
        '.property-description',
        '.description',
        '#description',
        '.details-description',
      ],
    },
  },
};

export function parseSemver(version: string): [number, number, number] | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Compares two `major.minor.patch` semver strings.
 * Returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compareSemver(a: string, b: string): number {
  const pa = parseSemver(a);
  const pb = parseSemver(b);
  if (!pa || !pb) {
    throw new Error(`Invalid semver string comparison: "${a}" vs "${b}"`);
  }
  for (let i = 0; i < 3; i++) {
    if (pa[i]! > pb[i]!) return 1;
    if (pa[i]! < pb[i]!) return -1;
  }
  return 0;
}

const UNSAFE_SELECTOR_PATTERN =
  /<script|<\/|javascript:|vbscript:|data:|expression\(|url\(|\{|\}|on\w+\s*=/i;

export function isSafeCssSelector(selector: string): boolean {
  const trimmed = selector.trim();
  if (!trimmed || trimmed.length > 200) return false;
  return !UNSAFE_SELECTOR_PATTERN.test(trimmed);
}

export type SelectorValidationResult =
  | { valid: true; bundle: RemoteSelectorsBundle }
  | { valid: false; reason: string };

export function utf8ByteLength(str: string): number {
  let bytes = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) {
      bytes += 1;
    } else if (code <= 0x7ff) {
      bytes += 2;
    } else if (code >= 0xd800 && code <= 0xdbff) {
      bytes += 4;
      i++;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}

/**
 * Validates raw remote selector JSON against byte limit (<= 32 KB),
 * TypeBox schema, CSS selector safety (JSON-only, zero code/script tokens),
 * and non-downgrading semver requirement (`version >= currentVersion`).
 */
export function validateRemoteSelectorsBundle(
  rawJson: string,
  currentVersion: string = BUNDLED_PORTAL_SELECTORS.version
): SelectorValidationResult {
  const byteLength = utf8ByteLength(rawJson);
  if (byteLength > SELECTORS_MAX_BYTES) {
    return { valid: false, reason: 'oversize' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    return { valid: false, reason: 'invalid_json' };
  }

  if (!Value.Check(RemoteSelectorsBundleSchema, parsed)) {
    return { valid: false, reason: 'schema_invalid' };
  }

  if (compareSemver(parsed.version, currentVersion) < 0) {
    return { valid: false, reason: 'version_downgrade' };
  }

  const portalIds: PortalId[] = ['idealista', 'fotocasa', 'habitaclia', 'pisos', 'yaencontre'];
  for (const portalId of portalIds) {
    const cfg = parsed.portals[portalId];
    const groups = [cfg.mountTarget, cfg.title, cfg.zone, cfg.price, cfg.features, cfg.description];
    for (const list of groups) {
      for (const selector of list) {
        if (!isSafeCssSelector(selector)) {
          return { valid: false, reason: 'unsafe_selector' };
        }
      }
    }
  }

  return { valid: true, bundle: parsed };
}

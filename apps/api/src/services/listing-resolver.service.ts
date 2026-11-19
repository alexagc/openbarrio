import {
  LISTING_MAX_PASTE_BYTES,
  PORTAL_HOST_ALLOWLIST,
  utf8ByteLength,
  type ListingExtractedFields,
  type ListingResolveRequest,
  type ListingResolveResponse,
  type PortalId,
} from '@openbarrio/core';
import {
  ListingExtractionFailedError,
  ListingHostUnsupportedError,
  ListingPayloadTooLargeError,
  ListingUrlInvalidError,
} from '../errors/problem-details.js';

const IPV4_LITERAL_RE = /^\d{1,3}(?:\.\d{1,3}){3}$/;
const REFCAT_FULL_RE = /\b(\d{7}[A-Z]{2}\d{4}[A-Z]\d{4}[A-Z]{2})\b/i;
const SURFACE_M2_RE = /\b(\d{2,4})(?:[.,]\d+)?\s*(?:m[²2]|metros?\s+cuadrados?)(?!\w)/i;
const STREET_HINT_RE =
  /\b(?:calle|c\/|avenida|avda?\.?|paseo|plaza|ronda|camino|carrer|rúa|kalea)\s+[A-ZÁÉÍÓÚÜÑa-záéíóúüñ0-9'ºª.\-\s]{3,60}/i;

const LEGAL_NOTICE =
  'Zero server-side fetching: extracted solely in memory from user-supplied URL path and optional snippet with zero storage.';

function validateAndSanitizePortalUrl(rawUrl: string): {
  portal: PortalId;
  parsed: URL;
  sanitizedUrl: string;
} {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new ListingUrlInvalidError('URL is malformed or could not be parsed.');
  }

  if (parsed.protocol !== 'https:') {
    throw new ListingUrlInvalidError('Listing URL must use the HTTPS protocol.');
  }

  if (parsed.username || parsed.password) {
    throw new ListingUrlInvalidError('Listing URL must not contain embedded credentials.');
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    !hostname ||
    hostname === 'localhost' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost') ||
    IPV4_LITERAL_RE.test(hostname) ||
    hostname.startsWith('[')
  ) {
    throw new ListingHostUnsupportedError(hostname || 'unknown');
  }

  const portal = PORTAL_HOST_ALLOWLIST[hostname];
  if (!portal) {
    throw new ListingHostUnsupportedError(hostname);
  }

  const cleanPath = parsed.pathname.replace(/\/+$/, '') || '/';
  const sanitizedUrl = `https://${hostname}${cleanPath}`;
  return { portal, parsed, sanitizedUrl };
}

function slugToLabel(slug?: string): string | undefined {
  if (!slug) return undefined;
  const cleaned = decodeURIComponent(slug)
    .replace(/\.htm[l]?$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();
  if (!cleaned) return undefined;
  return cleaned.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function extractFromPortalPath(portal: PortalId, pathname: string): ListingExtractedFields {
  const lowerPath = pathname.toLowerCase();
  const segments = pathname.split('/').filter(Boolean);
  const extracted: ListingExtractedFields = {};

  if (lowerPath.includes('/alquiler') || lowerPath.includes('/alquilar')) {
    extracted.operation = 'rent';
  } else if (lowerPath.includes('/comprar') || lowerPath.includes('/venta')) {
    extracted.operation = 'sale';
  }

  if (portal === 'idealista') {
    const idMatch = /\/inmueble\/(\d+)/i.exec(pathname);
    if (idMatch) {
      extracted.listingId = idMatch[1];
    }
    // Optional slug format: /venta-viviendas/madrid/chamberi/
    if (!extracted.listingId && segments.length >= 2 && /-(viviendas|alquiler)/i.test(segments[0]!)) {
      extracted.municipalitySlug = segments[1];
      if (segments[2]) extracted.districtSlug = segments[2];
    }
  } else if (portal === 'fotocasa') {
    // e.g. /es/comprar/vivienda/madrid/chamberi/calle-santa-engracia/123456789/d
    const idMatch = /\/(\d{6,})(?:\/d)?(?:\/|$)/i.exec(pathname);
    if (idMatch) {
      extracted.listingId = idMatch[1];
    }
    const opIdx = segments.findIndex((s) => /^(comprar|alquiler)$/i.test(s));
    if (opIdx >= 0) {
      const geo = segments.slice(opIdx + 2).filter((s) => !/^\d+$/.test(s) && s !== 'd');
      if (geo[0]) extracted.municipalitySlug = geo[0];
      if (geo[1]) extracted.districtSlug = geo[1];
      if (geo[2]) extracted.streetHint = slugToLabel(geo[2]);
    }
  } else if (portal === 'habitaclia') {
    const idMatch = /(\d{5,})(?:-\d+)?\.htm/i.exec(pathname) || /\/inmueble\/(\d+)/i.exec(pathname);
    if (idMatch) {
      extracted.listingId = idMatch[1];
    }
    const lastSeg = segments[segments.length - 1] || '';
    const cityMatch = /en-([a-z0-9-]+?)(?:-\d+|\.htm|$)/i.exec(lastSeg);
    if (cityMatch?.[1]) {
      extracted.municipalitySlug = cityMatch[1];
    }
  } else if (portal === 'pisos') {
    // e.g. /comprar/piso-chamberi_trafalgar28010-48912345678_109500/
    const idMatch = /-(\d{6,})(?:_\d+)?\/?$/i.exec(pathname);
    if (idMatch) {
      extracted.listingId = idMatch[1];
    }
    if (segments[1]) {
      const cleanSlug = segments[1]
        .replace(/^(?:piso|atico|casa|estudio|duplex|chalet|local)-/i, '')
        .replace(/-\d+_\d+$/i, '');
      const parts = cleanSlug.split('_').filter(Boolean);
      if (parts[0]) extracted.districtSlug = parts[0];
      if (parts[1]) extracted.streetHint = slugToLabel(parts[1]);
    }
  } else if (portal === 'yaencontre') {
    // e.g. /venta/piso/madrid/inmueble-38495-12345678
    const idMatch = /inmueble-(?:[^/]*-)?(\d{5,})(?:\/|$)/i.exec(pathname);
    if (idMatch) {
      extracted.listingId = idMatch[1];
    }
    if (segments.length >= 4 && !segments[2]?.startsWith('inmueble')) {
      extracted.municipalitySlug = segments[2];
    }
  }

  return extracted;
}

function findClosingTagEnd(lower: string, tagName: 'script' | 'style', fromIndex: number): number {
  const needle = `</${tagName}`;
  let searchFrom = fromIndex;
  while (searchFrom < lower.length) {
    const idx = lower.indexOf(needle, searchFrom);
    if (idx === -1) return lower.length;
    const after = lower[idx + needle.length];
    if (after === undefined || after === '>' || /\s/.test(after)) {
      const closeGt = lower.indexOf('>', idx + needle.length);
      return closeGt === -1 ? lower.length : closeGt + 1;
    }
    searchFrom = idx + needle.length;
  }
  return lower.length;
}

/**
 * Strips HTML tags and script/style blocks in linear time without HTML-filtering regexes.
 */
function stripHtmlToPlainText(rawText: string): string {
  const lower = rawText.toLowerCase();
  const chunks: string[] = [];
  let i = 0;

  while (i < rawText.length) {
    const lt = rawText.indexOf('<', i);
    if (lt === -1) {
      chunks.push(rawText.slice(i));
      break;
    }
    if (lt > i) {
      chunks.push(rawText.slice(i, lt));
    }

    const isScript =
      lower.startsWith('<script', lt) &&
      (lower[lt + 7] === '>' || /\s/.test(lower[lt + 7] ?? ''));
    const isStyle =
      lower.startsWith('<style', lt) &&
      (lower[lt + 6] === '>' || /\s/.test(lower[lt + 6] ?? ''));

    const gt = rawText.indexOf('>', lt + 1);
    if (gt === -1) {
      break;
    }

    if (isScript) {
      i = findClosingTagEnd(lower, 'script', gt + 1);
    } else if (isStyle) {
      i = findClosingTagEnd(lower, 'style', gt + 1);
    } else {
      i = gt + 1;
    }
    chunks.push(' ');
  }

  return chunks.join('').replace(/\s+/g, ' ').trim();
}

function extractFromPastedText(rawText: string): ListingExtractedFields {
  const plainText = stripHtmlToPlainText(rawText);

  const out: ListingExtractedFields = {};

  const refMatch = REFCAT_FULL_RE.exec(plainText);
  if (refMatch?.[1]) {
    out.cadastralReference = refMatch[1].toUpperCase();
  }

  const surfMatch = SURFACE_M2_RE.exec(plainText);
  if (surfMatch?.[1]) {
    const val = Number(surfMatch[1]);
    if (Number.isFinite(val) && val >= 5 && val <= 500000) {
      out.surfaceM2 = val;
    }
  }

  const streetMatch = STREET_HINT_RE.exec(plainText);
  if (streetMatch?.[0]) {
    out.streetHint = streetMatch[0].trim();
  }

  return out;
}

/**
 * Pure, offline, zero-fetch listing resolver.
 * Never makes outbound network calls and never stores submitted URLs or text.
 */
export function resolveListingMetadata(
  input: ListingResolveRequest
): ListingResolveResponse {
  const { portal, parsed, sanitizedUrl } = validateAndSanitizePortalUrl(input.url);

  if (input.rawText !== undefined) {
    const textBytes = utf8ByteLength(input.rawText);
    if (textBytes > LISTING_MAX_PASTE_BYTES) {
      throw new ListingPayloadTooLargeError(LISTING_MAX_PASTE_BYTES);
    }
  }

  const fromUrl = extractFromPortalPath(portal, parsed.pathname);
  const fromText = input.rawText ? extractFromPastedText(input.rawText) : {};

  const streetHint = fromText.streetHint || fromUrl.streetHint;
  const municipalityLabel = slugToLabel(fromUrl.municipalitySlug);
  const districtLabel = slugToLabel(fromUrl.districtSlug);
  const addressParts = [streetHint, districtLabel, municipalityLabel].filter(Boolean);
  const address = addressParts.length > 0 ? addressParts.join(', ') : undefined;

  const extracted: ListingExtractedFields = {
    ...(fromUrl.listingId ? { listingId: fromUrl.listingId } : {}),
    ...(fromText.cadastralReference ? { cadastralReference: fromText.cadastralReference } : {}),
    ...(fromUrl.municipalitySlug ? { municipalitySlug: fromUrl.municipalitySlug } : {}),
    ...(fromUrl.districtSlug ? { districtSlug: fromUrl.districtSlug } : {}),
    ...(streetHint ? { streetHint } : {}),
    ...(address ? { address } : {}),
    ...(fromText.surfaceM2 !== undefined ? { surfaceM2: fromText.surfaceM2 } : {}),
    ...(fromUrl.operation ? { operation: fromUrl.operation } : {}),
  };

  const hasSignal = Boolean(
    extracted.cadastralReference ||
      extracted.listingId ||
      extracted.streetHint ||
      extracted.address ||
      extracted.surfaceM2
  );

  if (!hasSignal) {
    throw new ListingExtractionFailedError(
      'Could not extract a listing ID, cadastral reference, or address hint from the URL path or pasted snippet.'
    );
  }

  const confidence: ListingResolveResponse['confidence'] = extracted.cadastralReference
    ? 'high'
    : extracted.streetHint && extracted.municipalitySlug
    ? 'medium'
    : 'low';

  const auditHint = extracted.cadastralReference
    ? `/api/v1/audit/refcat/${extracted.cadastralReference}`
    : extracted.address
    ? extracted.address
    : municipalityLabel || extracted.listingId || sanitizedUrl;

  return {
    portal,
    sanitizedUrl,
    extracted,
    confidence,
    extractionMethod: input.rawText ? 'url_and_pasted_text' : 'url_only',
    auditHint,
    legalNotice: LEGAL_NOTICE,
  };
}

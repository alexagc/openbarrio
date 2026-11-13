import {
  PortalType,
  PropertyExtractor,
  ExtractedPropertyData,
  ExtractedCoordinates,
  ExtractionValidationResult,
} from './types.js';

export type AdapterValidationResult = ExtractionValidationResult;

export abstract class BasePortalAdapter implements PropertyExtractor {
  abstract readonly portal: PortalType;

  /**
   * Evaluates whether this adapter can extract property data from the given URL.
   */
  abstract canExtract(url: string): boolean;

  /**
   * Extracts property metadata from the DOM and URL.
   */
  abstract extract(document: Document, url: string): ExtractedPropertyData | null;

  /**
   * Locates the optimal container element in the portal DOM to mount or anchor the widget.
   */
  abstract getMountTarget(document: Document): Element | null;

  /**
   * Shared helper to parse prices in EUR from raw text or numeric strings.
   * Handles formats like "450.000 €", "1.200 €/mes", "850 000 €", "350000".
   */
  parsePrice(raw: string | number | null | undefined): number | undefined {
    if (typeof raw === 'number') {
      return !isNaN(raw) && raw > 0 ? raw : undefined;
    }
    if (!raw || typeof raw !== 'string') return undefined;

    const cleaned = raw.replace(/\./g, '').replace(/[^0-9]/g, '');
    const val = parseInt(cleaned, 10);
    return !isNaN(val) && val > 0 ? val : undefined;
  }

  cleanPrice(raw: string | number | null | undefined): number | undefined {
    return this.parsePrice(raw);
  }

  /**
   * Shared helper to parse built surface area in m² from raw text or numbers.
   * Handles "120 m²", "85,5 m2", "90 m2 útiles".
   */
  parseSurface(raw: string | number | null | undefined): number | undefined {
    if (typeof raw === 'number') {
      return !isNaN(raw) && raw > 0 ? Math.round(raw) : undefined;
    }
    if (!raw || typeof raw !== 'string') return undefined;

    const match =
      raw.match(/(\d+[.,]?\d*)\s*m[²2]/i) ||
      raw.match(/(\d+[.,]?\d*)/);
    if (!match) return undefined;

    const parsed = parseFloat(match[1].replace(',', '.'));
    return !isNaN(parsed) && parsed > 0 ? Math.round(parsed) : undefined;
  }

  cleanSurface(raw: string | number | null | undefined): number | undefined {
    return this.parseSurface(raw);
  }

  /**
   * Shared helper to parse 4-digit construction year.
   */
  parseYear(raw: string | number | null | undefined): number | undefined {
    if (typeof raw === 'number') {
      return raw >= 1500 && raw <= new Date().getFullYear() + 2 ? raw : undefined;
    }
    if (!raw || typeof raw !== 'string') return undefined;

    const match =
      raw.match(/(?:construido\s+en|año|edificio\s+de|antigüedad)\s*:?\s*(\d{4})/i) ||
      raw.match(/\b(18\d{2}|19\d{2}|20[0-2]\d)\b/);
    if (!match) return undefined;

    const yr = parseInt(match[1], 10);
    return !isNaN(yr) && yr >= 1500 && yr <= new Date().getFullYear() + 2 ? yr : undefined;
  }

  cleanYear(raw: string | number | null | undefined): number | undefined {
    return this.parseYear(raw);
  }

  /**
   * Shared helper to extract Cadastral Reference (Referencia Catastral)
   * from description containers or general text in document.
   */
  extractCadastralReference(
    doc: Document,
    customContainers?: (Element | null)[]
  ): string | undefined {
    const containers: (Element | null)[] =
      customContainers && customContainers.length > 0
        ? [...customContainers, doc.body]
        : [
            doc.querySelector(
              '.comment, .adCommentsLanguage, #details, .details-property_features, .re-DetailDescription, .description, .property-description, .detail-description, #js-detail-description, .description__body, #descriptionBody'
            ),
            doc.body,
          ];

    const refcat20Regex = /\b[0-9]{7}[A-Z]{2}[0-9]{4}[A-Z0-9]{7}\b|\b[0-9]{7}[A-Z]{2}[0-9]{7}[A-Z]{2}\b/i;
    const explicitRefcatRegex = /(?:referencia\s+catastral|ref\.?\s*catastral|refcat)\s*:?\s*([0-9A-Z]{14,20})\b/i;

    for (const container of containers) {
      if (!container || !container.textContent) continue;
      const text = container.textContent;

      const explicitMatch = text.match(explicitRefcatRegex);
      if (explicitMatch && explicitMatch[1]) {
        return explicitMatch[1].toUpperCase();
      }

      const match20 = text.match(refcat20Regex);
      if (match20 && match20[0]) {
        return match20[0].toUpperCase();
      }
    }

    return undefined;
  }

  /**
   * Shared helper to extract structured property data from JSON-LD scripts.
   */
  extractFromJsonLd(doc: Document, data: ExtractedPropertyData): void {
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
    for (const script of Array.from(scripts)) {
      try {
        const text = script.textContent?.trim();
        if (!text) continue;
        const json = JSON.parse(text);
        const items = Array.isArray(json) ? json : json['@graph'] ? json['@graph'] : [json];

        for (const item of items) {
          if (!item || typeof item !== 'object') continue;

          // Title / name
          if (!data.title && item.name && typeof item.name === 'string') {
            data.title = item.name.trim();
          }

          // Geo coordinates
          if (!data.coordinates && item.geo) {
            const lat = Number(item.geo.latitude);
            const lon = Number(item.geo.longitude);
            if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
              data.coordinates = { latitude: lat, longitude: lon };
            }
          }

          // Address
          if (item.address && typeof item.address === 'object') {
            const addr = item.address;
            if (!data.address && addr.streetAddress) {
              data.address = String(addr.streetAddress).trim();
            }
            if (!data.municipality && addr.addressLocality) {
              data.municipality = String(addr.addressLocality).trim();
            }
            if (!data.province && addr.addressRegion) {
              data.province = String(addr.addressRegion).trim();
            }
          }

          // Surface m²
          if (!data.builtSurfaceM2 && item.floorSize) {
            const sizeVal = typeof item.floorSize === 'object' ? item.floorSize.value : item.floorSize;
            const parsed = this.parseSurface(sizeVal);
            if (parsed) data.builtSurfaceM2 = parsed;
          }

          // Price
          if (!data.priceEur && item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers && offers.price) {
              const parsedPrice = this.parsePrice(offers.price);
              if (parsedPrice) data.priceEur = parsedPrice;
            }
          }
        }
      } catch {
        // Silently continue to next script
      }
    }
  }

  /**
   * Shared fallback to extract coordinates from meta tags, data-attributes, and inline scripts.
   */
  extractCoordinatesFallback(doc: Document): ExtractedCoordinates | undefined {
    // 1. Meta tags (geo.position, ICBM, og:latitude/longitude, place:location)
    const geoPos = doc.querySelector('meta[name="geo.position"]')?.getAttribute('content');
    if (geoPos) {
      const parts = geoPos.split(';');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    const icbm = doc.querySelector('meta[name="ICBM"]')?.getAttribute('content');
    if (icbm) {
      const parts = icbm.split(',');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    const ogLat = doc
      .querySelector(
        'meta[property="og:latitude"], meta[name="og:latitude"], meta[property="place:location:latitude"]'
      )
      ?.getAttribute('content');
    const ogLon = doc
      .querySelector(
        'meta[property="og:longitude"], meta[name="og:longitude"], meta[property="place:location:longitude"]'
      )
      ?.getAttribute('content');
    if (ogLat && ogLon) {
      const lat = parseFloat(ogLat);
      const lon = parseFloat(ogLon);
      if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
        return { latitude: lat, longitude: lon };
      }
    }

    // 2. Data attributes on map containers
    const mapElement = doc.querySelector('[data-latitude][data-longitude], [data-lat][data-lng]');
    if (mapElement) {
      const latStr = mapElement.getAttribute('data-latitude') || mapElement.getAttribute('data-lat');
      const lonStr = mapElement.getAttribute('data-longitude') || mapElement.getAttribute('data-lng');
      if (latStr && lonStr) {
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    // 3. Inline scripts with coordinate variables
    const scripts = doc.querySelectorAll('script:not([type="application/ld+json"])');
    for (const s of Array.from(scripts)) {
      const content = s.textContent;
      if (
        !content ||
        (!content.includes('latitude') &&
          !content.includes('lat') &&
          !content.includes('ad_latitude') &&
          !content.includes('latitud'))
      ) {
        continue;
      }

      const latMatch =
        content.match(/["']?latitude["']?\s*:\s*([0-9.-]+)/i) ||
        content.match(/["']?lat["']?\s*:\s*([0-9.-]+)/i) ||
        content.match(/ad_latitude\s*=\s*["']?([0-9.-]+)["']?/i) ||
        content.match(/latitud\s*[:=]\s*["']?([0-9.-]+)["']?/i);

      const lonMatch =
        content.match(/["']?longitude["']?\s*:\s*([0-9.-]+)/i) ||
        content.match(/["']?lng["']?\s*:\s*([0-9.-]+)/i) ||
        content.match(/["']?lon["']?\s*:\s*([0-9.-]+)/i) ||
        content.match(/ad_longitude\s*=\s*["']?([0-9.-]+)["']?/i) ||
        content.match(/longitud\s*[:=]\s*["']?([0-9.-]+)["']?/i);

      if (latMatch && lonMatch) {
        const lat = parseFloat(latMatch[1]);
        const lon = parseFloat(lonMatch[1]);
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    return undefined;
  }

  /**
   * Diagnostic validation verifying critical fields extracted for property due diligence.
   */
  validate(data: ExtractedPropertyData | null): ExtractionValidationResult {
    const missingFields: string[] = [];
    const errorMessages: string[] = [];

    if (!data) {
      return {
        isValid: false,
        missingFields: ['data'],
        diagnostics: {
          hasTitle: false,
          hasPrice: false,
          hasSurface: false,
          hasCoordinates: false,
          hasCadastralReference: false,
          hasAddress: false,
        },
        errorMessages: [
          `[${this.portal}] Critical extraction failure: extracted data is null`,
        ],
      };
    }

    const hasTitle = Boolean(data.title && data.title.trim().length > 0);
    const hasPrice = Boolean(typeof data.priceEur === 'number' && data.priceEur > 0);
    const hasSurface = Boolean(
      typeof data.builtSurfaceM2 === 'number' && data.builtSurfaceM2 > 0
    );
    const hasCoordinates = Boolean(
      data.coordinates &&
        typeof data.coordinates.latitude === 'number' &&
        typeof data.coordinates.longitude === 'number' &&
        !isNaN(data.coordinates.latitude) &&
        !isNaN(data.coordinates.longitude) &&
        (data.coordinates.latitude !== 0 || data.coordinates.longitude !== 0)
    );
    const hasCadastralReference = Boolean(
      data.cadastralReference && data.cadastralReference.trim().length >= 14
    );
    const hasAddress = Boolean(data.address && data.address.trim().length > 0);

    if (!hasTitle) {
      missingFields.push('title');
      errorMessages.push(
        `[${this.portal}] REGRESSION: Property title missing. Verify heading selectors or JSON-LD name.`
      );
    }

    if (!hasPrice) {
      missingFields.push('priceEur');
      errorMessages.push(
        `[${this.portal}] REGRESSION: Property price missing or invalid. Verify price DOM container or JSON-LD offers.price.`
      );
    }

    if (!hasSurface) {
      missingFields.push('builtSurfaceM2');
      errorMessages.push(
        `[${this.portal}] REGRESSION: Built surface (m²) missing. Verify characteristics selectors or JSON-LD floorSize.`
      );
    }

    if (!hasCoordinates && !hasCadastralReference) {
      missingFields.push('coordinates/cadastralReference');
      errorMessages.push(
        `[${this.portal}] REGRESSION: Geolocation missing. Neither coordinates nor cadastral reference could be resolved.`
      );
    }

    const isValid =
      hasTitle &&
      hasPrice &&
      hasSurface &&
      (hasCoordinates || hasCadastralReference);

    return {
      isValid,
      missingFields,
      diagnostics: {
        hasTitle,
        hasPrice,
        hasSurface,
        hasCoordinates,
        hasCadastralReference,
        hasAddress,
      },
      errorMessages,
    };
  }
}

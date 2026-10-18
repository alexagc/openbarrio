import {
  PropertyExtractor,
  ExtractedPropertyData,
  ExtractedCoordinates,
} from './types.js';

export class IdealistaExtractor implements PropertyExtractor {
  readonly portal = 'idealista' as const;

  canExtract(url: string): boolean {
    return /idealista\.com\/inmueble\/\d+/i.test(url) || url.includes('/inmueble/');
  }

  extract(doc: Document, url: string): ExtractedPropertyData | null {
    if (!this.canExtract(url)) {
      return null;
    }

    const data: ExtractedPropertyData = {
      portal: this.portal,
      url,
    };

    // 1. Try extracting structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. Fallbacks from DOM selectors if missing
    this.extractFromDom(doc, data);

    // 3. Extract Cadastral Reference if present in description or table
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc);
    }

    // 4. Coordinates extraction fallback (meta tags, scripts, data-attributes)
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
    }

    // 5. Determine sale vs rental
    if (data.isRental === undefined) {
      const lowerUrl = url.toLowerCase();
      const lowerTitle = (data.title || '').toLowerCase();
      data.isRental = lowerUrl.includes('alquiler') || lowerTitle.includes('alquiler');
    }

    return data;
  }

  private extractFromJsonLd(doc: Document, data: ExtractedPropertyData): void {
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
            if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
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
            const parsed = parseFloat(String(sizeVal).replace(',', '.'));
            if (!isNaN(parsed) && parsed > 0) {
              data.builtSurfaceM2 = Math.round(parsed);
            }
          }

          // Price
          if (!data.priceEur && item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offers && offers.price) {
              const parsedPrice = parseFloat(String(offers.price).replace(/[^0-9.]/g, ''));
              if (!isNaN(parsedPrice) && parsedPrice > 0) {
                data.priceEur = parsedPrice;
              }
            }
          }
        }
      } catch {
        // Silently continue to next script if JSON is malformed
      }
    }
  }

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector('.main-info__title-main, h1.property-title, .info-data-header');
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
    }

    // Zone / Location subtitle
    const zoneEl = doc.querySelector('.main-info__title-minor, .header-map-list');
    if (zoneEl && zoneEl.textContent) {
      data.zone = zoneEl.textContent.trim();
    }

    // Price
    if (!data.priceEur) {
      const priceEl = doc.querySelector('.info-data-price, .price-features__current-price, .txt-bold');
      if (priceEl && priceEl.textContent) {
        const cleaned = priceEl.textContent.replace(/\./g, '').replace(/[^0-9]/g, '');
        const val = parseInt(cleaned, 10);
        if (!isNaN(val) && val > 0) {
          data.priceEur = val;
        }
      }
    }

    // Features: Surface m² and Construction year
    const featureNodes = doc.querySelectorAll(
      '.info-features span, .details-property_features li, .details-property-feature-one'
    );
    for (const node of Array.from(featureNodes)) {
      const text = node.textContent?.trim() || '';

      // Surface
      if (!data.builtSurfaceM2) {
        const m2Match = text.match(/(\d+[.,]?\d*)\s*m[²2]/i);
        if (m2Match) {
          const m2 = parseFloat(m2Match[1].replace(',', '.'));
          if (!isNaN(m2) && m2 > 0) {
            data.builtSurfaceM2 = Math.round(m2);
          }
        }
      }

      // Year of construction
      if (!data.constructionYear) {
        const yearMatch = text.match(/(?:construido\s+en|año|edificio\s+de)\s*:?\s*(\d{4})/i);
        if (yearMatch) {
          const year = parseInt(yearMatch[1], 10);
          if (!isNaN(year) && year > 1500 && year <= new Date().getFullYear() + 2) {
            data.constructionYear = year;
          }
        }
      }
    }
  }

  private extractCadastralReference(doc: Document): string | undefined {
    // Look in descriptions, details list, or general text
    const textContainers = [
      doc.querySelector('.comment, .adCommentsLanguage, #details, .details-property_features'),
      doc.body,
    ];

    // Standard Spanish Cadastral Reference regex:
    // 20-character urban/rural property format: e.g. 9872023VH5797S0001WX or 1234567AB1234C0001DE
    // 14-character parcel code: e.g. 9872023VH5797S
    const refcat20Regex = /\b[0-9]{7}[A-Z]{2}[0-9]{4}[A-Z0-9]{7}\b|\b[0-9]{7}[A-Z]{2}[0-9]{7}[A-Z]{2}\b/i;
    const explicitRefcatRegex = /(?:referencia\s+catastral|ref\.?\s*catastral|refcat)\s*:?\s*([0-9A-Z]{14,20})\b/i;

    for (const container of textContainers) {
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

  private extractCoordinatesFallback(doc: Document): ExtractedCoordinates | undefined {
    // 1. Meta tags (geo.position, ICBM, og:latitude/og:longitude)
    const geoPos = doc.querySelector('meta[name="geo.position"]')?.getAttribute('content');
    if (geoPos) {
      const parts = geoPos.split(';');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lon)) {
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
        if (!isNaN(lat) && !isNaN(lon)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    // 2. Data attributes on map containers or elements
    const mapElement = doc.querySelector('[data-latitude][data-longitude], [data-lat][data-lng]');
    if (mapElement) {
      const latStr = mapElement.getAttribute('data-latitude') || mapElement.getAttribute('data-lat');
      const lonStr = mapElement.getAttribute('data-longitude') || mapElement.getAttribute('data-lng');
      if (latStr && lonStr) {
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    // 3. Script contents with inline coordinates
    const scripts = doc.querySelectorAll('script:not([type="application/ld+json"])');
    for (const s of Array.from(scripts)) {
      const content = s.textContent;
      if (!content || (!content.includes('latitude') && !content.includes('ad_latitude'))) continue;

      const latMatch = content.match(/["']?latitude["']?\s*:\s*([0-9.-]+)/i) ||
                       content.match(/ad_latitude\s*=\s*["']?([0-9.-]+)["']?/i);
      const lonMatch = content.match(/["']?longitude["']?\s*:\s*([0-9.-]+)/i) ||
                       content.match(/ad_longitude\s*=\s*["']?([0-9.-]+)["']?/i);

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
}

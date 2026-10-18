import {
  PropertyExtractor,
  ExtractedPropertyData,
  ExtractedCoordinates,
} from './types.js';

export class FotocasaExtractor implements PropertyExtractor {
  readonly portal = 'fotocasa' as const;

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isFotocasaHost =
        parsed.hostname === 'fotocasa.es' ||
        parsed.hostname.endsWith('.fotocasa.es');
      if (!isFotocasaHost) return false;
      if (/\/l(\/|\?|#|$)/i.test(parsed.pathname)) return false;
      return (
        /\/d(\/|\?|#|$)/i.test(parsed.pathname) &&
        (parsed.pathname.includes('/comprar/') || parsed.pathname.includes('/alquiler/'))
      );
    } catch {
      return false;
    }
  }

  extract(doc: Document, url: string): ExtractedPropertyData | null {
    if (!this.canExtract(url)) {
      return null;
    }

    const data: ExtractedPropertyData = {
      portal: this.portal,
      url,
      isRental: url.includes('/alquiler/'),
    };

    // 1. Try extracting structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. Try extracting from Next.js __NEXT_DATA__ script
    this.extractFromNextData(doc, data);

    // 3. Fallbacks from DOM selectors
    this.extractFromDom(doc, data);

    // 4. Extract Cadastral Reference if available in description or table
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc);
    }

    // 5. Fallback for coordinates
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
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

          // Title
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
        // Silently continue
      }
    }
  }

  private extractFromNextData(doc: Document, data: ExtractedPropertyData): void {
    const nextScript = doc.getElementById('__NEXT_DATA__');
    if (!nextScript || !nextScript.textContent) return;

    try {
      const parsed = JSON.parse(nextScript.textContent);
      const property =
        parsed?.props?.pageProps?.initialProperty ||
        parsed?.props?.pageProps?.property ||
        parsed?.props?.pageProps?.detail;

      if (!property) return;

      // Coordinates
      if (!data.coordinates && property.coordinates) {
        const lat = Number(property.coordinates.latitude || property.coordinates.lat);
        const lon = Number(property.coordinates.longitude || property.coordinates.lng);
        if (!isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
          data.coordinates = { latitude: lat, longitude: lon };
        }
      }

      // Address & municipality
      if (!data.address && property.address?.ubication) {
        data.address = property.address.ubication;
      }
      if (!data.municipality && property.address?.municipality) {
        data.municipality = property.address.municipality;
      }
      if (!data.province && property.address?.province) {
        data.province = property.address.province;
      }

      // Surface m²
      if (!data.builtSurfaceM2 && property.features) {
        if (Array.isArray(property.features)) {
          for (const f of property.features) {
            if (f.key === 'surface' || f.id === 'surface' || String(f.text).includes('m²')) {
              const num = parseFloat(String(f.value || f.text).replace(/[^0-9.]/g, ''));
              if (!isNaN(num) && num > 0) {
                data.builtSurfaceM2 = Math.round(num);
                break;
              }
            }
          }
        }
      }

      // Construction year
      if (!data.constructionYear && property.buildingYear) {
        const yr = parseInt(String(property.buildingYear), 10);
        if (!isNaN(yr) && yr > 1500) {
          data.constructionYear = yr;
        }
      }
    } catch {
      // Ignore JSON parse errors in __NEXT_DATA__
    }
  }

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector(
        'h1.re-DetailHeader-propertyTitle, .re-DetailHeader-address, h1'
      );
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
    }

    // Price
    if (!data.priceEur) {
      const priceEl = doc.querySelector('.re-DetailHeader-price, .re-DetailHeader-price span');
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
      '.re-DetailHeader-featuresItem, .re-DetailFeaturesList-feature, .re-DetailFeaturesList-featureItem'
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
        const yearMatch = text.match(/(?:antigüedad|año\s+de\s+construcción|construido\s+en)\s*:?\s*(\d{4})/i);
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
    const textContainers = [
      doc.querySelector('.re-DetailDescription, .re-DetailFeaturesList, .re-DetailBody'),
      doc.body,
    ];

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

    const mapElement = doc.querySelector('[data-latitude][data-longitude]');
    if (mapElement) {
      const latStr = mapElement.getAttribute('data-latitude');
      const lonStr = mapElement.getAttribute('data-longitude');
      if (latStr && lonStr) {
        const lat = parseFloat(latStr);
        const lon = parseFloat(lonStr);
        if (!isNaN(lat) && !isNaN(lon)) {
          return { latitude: lat, longitude: lon };
        }
      }
    }

    return undefined;
  }
}

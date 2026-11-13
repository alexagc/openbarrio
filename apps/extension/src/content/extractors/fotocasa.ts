import { BasePortalAdapter } from './base.js';
import { ExtractedPropertyData } from './types.js';

export class FotocasaExtractor extends BasePortalAdapter {
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

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector(
      '.re-DetailHeader, .re-DetailFeaturesList, .re-DetailBody, main, body'
    );
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

    // 1. Structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. Next.js __NEXT_DATA__ script
    this.extractFromNextData(doc, data);

    // 3. Fallbacks from DOM selectors
    this.extractFromDom(doc, data);

    // 4. Cadastral reference
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc);
    }

    // 5. Fallback for coordinates
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
    }

    return data;
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
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
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
              const num = this.parseSurface(f.value || f.text);
              if (num) {
                data.builtSurfaceM2 = num;
                break;
              }
            }
          }
        }
      }

      // Construction year
      if (!data.constructionYear && property.buildingYear) {
        const yr = this.parseYear(property.buildingYear);
        if (yr) {
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
      const priceEl = doc.querySelector(
        '.re-DetailHeader-price, .re-DetailHeader-price span'
      );
      if (priceEl && priceEl.textContent) {
        const val = this.parsePrice(priceEl.textContent);
        if (val) data.priceEur = val;
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
        const m2 = this.parseSurface(text);
        if (m2) data.builtSurfaceM2 = m2;
      }

      // Year of construction
      if (!data.constructionYear) {
        const year = this.parseYear(text);
        if (year) data.constructionYear = year;
      }
    }
  }
}

export { FotocasaExtractor as FotocasaAdapter };


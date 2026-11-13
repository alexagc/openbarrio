import { BasePortalAdapter } from './base.js';
import { ExtractedPropertyData } from './types.js';

export class IdealistaExtractor extends BasePortalAdapter {
  readonly portal = 'idealista' as const;

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isIdealistaHost =
        parsed.hostname === 'idealista.com' ||
        parsed.hostname.endsWith('.idealista.com');
      return isIdealistaHost && /^\/inmueble\/\d+/i.test(parsed.pathname);
    } catch {
      return false;
    }
  }

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector(
      '.main-info, .info-data, .details-property, main, body'
    );
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

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector(
        '.main-info__title-main, h1.property-title, .info-data-header, h1'
      );
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
      const priceEl = doc.querySelector(
        '.info-data-price, .price-features__current-price, .txt-bold'
      );
      if (priceEl && priceEl.textContent) {
        data.priceEur = this.parsePrice(priceEl.textContent);
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
        const m2 = this.parseSurface(text);
        if (m2) {
          data.builtSurfaceM2 = m2;
        }
      }

      // Year of construction
      if (!data.constructionYear) {
        const year = this.parseYear(text);
        if (year) {
          data.constructionYear = year;
        }
      }
    }
  }
}

export class IdealistaAdapter extends IdealistaExtractor {}

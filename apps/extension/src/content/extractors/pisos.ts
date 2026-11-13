import { BasePortalAdapter } from './base.js';
import { ExtractedPropertyData } from './types.js';

export class PisosComAdapter extends BasePortalAdapter {
  readonly portal = 'pisos' as const;

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isPisosHost =
        parsed.hostname === 'pisos.com' ||
        parsed.hostname.endsWith('.pisos.com');
      if (!isPisosHost) return false;

      const path = parsed.pathname.toLowerCase();
      return path.startsWith('/comprar/') || path.startsWith('/alquilar/');
    } catch {
      return false;
    }
  }

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector(
      '.maindata-info, .basic-data, #sidebar, .details-box, main, body'
    );
  }

  extract(doc: Document, url: string): ExtractedPropertyData | null {
    if (!this.canExtract(url)) {
      return null;
    }

    const lowerUrl = url.toLowerCase();
    const data: ExtractedPropertyData = {
      portal: this.portal,
      url,
      isRental: lowerUrl.includes('/alquilar/') || lowerUrl.includes('alquiler'),
    };

    // 1. Structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. DOM extraction fallback
    this.extractFromDom(doc, data);

    // 3. Cadastral reference fallback
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc, [
        doc.querySelector('.description__body, .description, .description-block, #descriptionBlock'),
      ]);
    }

    // 4. Coordinates fallback
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
    }

    // 5. Determine sale vs rental if still undefined
    if (data.isRental === undefined) {
      const lowerTitle = (data.title || '').toLowerCase();
      data.isRental = lowerUrl.includes('alquilar') || lowerTitle.includes('alquiler');
    }

    return data;
  }

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector(
        '.main-info__title, h1.title, .maindata-info h1, .title-block h1, h1'
      );
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
    }

    // Address & zone
    if (!data.address || !data.zone) {
      const locationEl = doc.querySelector(
        '.main-info__address, .maindata-info .location, .location-info, .maindata-info .zone, .location'
      );
      if (locationEl && locationEl.textContent) {
        const text = locationEl.textContent.trim();
        if (!data.address) data.address = text;
        if (!data.zone) data.zone = text;
      }
    }

    // Price
    if (!data.priceEur) {
      const priceEl = doc.querySelector(
        '.price__value, .price-box .price, .maindata-info .price, .price-block .price, .price'
      );
      if (priceEl && priceEl.textContent) {
        const price = this.parsePrice(priceEl.textContent);
        if (price) data.priceEur = price;
      }
    }

    // Features: Surface m² & construction year
    const featureNodes = doc.querySelectorAll(
      '.basic-info__characteristics li, .characteristic__value, .basic-data-item, .char-block li, .characteristics-list li, .details-features li, .feature-item'
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

export { PisosComAdapter as PisosAdapter };
export class PisosExtractor extends PisosComAdapter {}


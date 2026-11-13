import { BasePortalAdapter } from './base.js';
import { ExtractedPropertyData } from './types.js';

export class HabitacliaAdapter extends BasePortalAdapter {
  readonly portal = 'habitaclia' as const;

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isHabitacliaHost =
        parsed.hostname === 'habitaclia.com' ||
        parsed.hostname.endsWith('.habitaclia.com');
      if (!isHabitacliaHost) return false;

      const path = parsed.pathname.toLowerCase();
      return (
        path.startsWith('/comprar') ||
        path.startsWith('/alquiler') ||
        path.startsWith('/inmueble') ||
        path.includes('/inmueble-')
      );
    } catch {
      return false;
    }
  }

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector(
      '.detail-summary, #js-contact-box, .detail, .main-content, main, body'
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
      isRental: lowerUrl.includes('alquiler'),
    };

    // 1. Structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. DOM selectors fallback
    this.extractFromDom(doc, data);

    // 3. Cadastral reference fallback
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc, [
        doc.querySelector('.detail-description, .description, #js-detail-description'),
      ]);
    }

    // 4. Coordinates fallback
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
    }

    // 5. Determine sale vs rental if still undefined
    if (data.isRental === undefined) {
      const lowerTitle = (data.title || '').toLowerCase();
      data.isRental = lowerUrl.includes('alquiler') || lowerTitle.includes('alquiler');
    }

    return data;
  }

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector(
        'h1.summary-title, h1.heading, h1.detail-title, h1'
      );
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
    }

    // Location / Address / Zone
    if (!data.address || !data.zone) {
      const locationEl = doc.querySelector(
        '.location, .summary-location, .detail-location, .address'
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
        '.price span, .font-2, .summary-price, .has-price, .price'
      );
      if (priceEl && priceEl.textContent) {
        const price = this.parsePrice(priceEl.textContent);
        if (price) data.priceEur = price;
      }
    }

    // Features: Surface m² & construction year
    const featureNodes = doc.querySelectorAll(
      '.summary-feature span, .summary-feature *, .feature, .feature-container li, .summary-features li, ul.features li, .detail-info-tags span, .has-more-info li'
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

export class HabitacliaExtractor extends HabitacliaAdapter {}


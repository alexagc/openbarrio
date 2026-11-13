import { BasePortalAdapter } from './base.js';
import { ExtractedPropertyData } from './types.js';

export class YaEncontreAdapter extends BasePortalAdapter {
  readonly portal = 'yaencontre' as const;

  canExtract(url: string): boolean {
    try {
      const parsed = new URL(url);
      const isYaEncontreHost =
        parsed.hostname === 'yaencontre.com' ||
        parsed.hostname.endsWith('.yaencontre.com');
      if (!isYaEncontreHost) return false;

      const path = parsed.pathname.toLowerCase();
      return path.startsWith('/venta/') || path.startsWith('/alquiler/');
    } catch {
      return false;
    }
  }

  getMountTarget(doc: Document): Element | null {
    return doc.querySelector(
      '.details-header, .property-details, .detail-header, #details, main, body'
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
      isRental: lowerUrl.includes('/alquiler/') || lowerUrl.includes('alquiler'),
    };

    // 1. Structured data from JSON-LD
    this.extractFromJsonLd(doc, data);

    // 2. Next.js __NEXT_DATA__ or window state script if present
    this.extractFromNextData(doc, data);

    // 3. DOM selectors fallback
    this.extractFromDom(doc, data);

    // 4. Cadastral reference fallback
    if (!data.cadastralReference) {
      data.cadastralReference = this.extractCadastralReference(doc, [
        doc.querySelector('.property-description, .description, #description, .details-description'),
      ]);
    }

    // 5. Coordinates fallback
    if (!data.coordinates) {
      data.coordinates = this.extractCoordinatesFallback(doc);
    }

    // 6. Determine sale vs rental if still undefined
    if (data.isRental === undefined) {
      const lowerTitle = (data.title || '').toLowerCase();
      data.isRental = lowerUrl.includes('alquiler') || lowerTitle.includes('alquiler');
    }

    return data;
  }

  private extractFromNextData(doc: Document, data: ExtractedPropertyData): void {
    const nextScript = doc.getElementById('__NEXT_DATA__');
    if (!nextScript || !nextScript.textContent) return;

    try {
      const parsed = JSON.parse(nextScript.textContent);
      const property =
        parsed?.props?.pageProps?.realEstate ||
        parsed?.props?.pageProps?.property ||
        parsed?.props?.pageProps?.initialProperty;

      if (!property) return;

      if (!data.coordinates && (property.coordinates || property.location)) {
        const coords = property.coordinates || property.location;
        const lat = Number(coords.latitude || coords.lat);
        const lon = Number(coords.longitude || coords.lng || coords.lon);
        if (!isNaN(lat) && !isNaN(lon) && (lat !== 0 || lon !== 0)) {
          data.coordinates = { latitude: lat, longitude: lon };
        }
      }

      if (!data.address && property.address) {
        data.address = typeof property.address === 'string' ? property.address : property.address.street;
      }

      if (!data.priceEur && property.price) {
        const num = this.parsePrice(property.price.amount || property.price);
        if (num) data.priceEur = num;
      }

      if (!data.builtSurfaceM2 && property.dimensions) {
        const m2 = this.parseSurface(property.dimensions.surface || property.dimensions);
        if (m2) data.builtSurfaceM2 = m2;
      }
    } catch {
      // Ignore JSON parse errors in __NEXT_DATA__
    }
  }

  private extractFromDom(doc: Document, data: ExtractedPropertyData): void {
    // Title
    if (!data.title) {
      const titleEl = doc.querySelector(
        'h1.title, .details-header h1, .property-title, h1'
      );
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
    }

    // Location / Address
    if (!data.address || !data.zone) {
      const locationEl = doc.querySelector(
        '.location, .details-header .address, .ubication, .property-location'
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
        '.details-header-price, .price, .details-header .price, [data-testid="price"], .property-price'
      );
      if (priceEl && priceEl.textContent) {
        const price = this.parsePrice(priceEl.textContent);
        if (price) data.priceEur = price;
      }
    }

    // Features: Surface m² & construction year
    const featureNodes = doc.querySelectorAll(
      '.details-parameters li, .features-item, .item-detail, .icon-dimensions + span, .characteristics li, .features li, .property-features span'
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

export { YaEncontreAdapter as YaencontreAdapter };
export class YaencontreExtractor extends YaEncontreAdapter {}


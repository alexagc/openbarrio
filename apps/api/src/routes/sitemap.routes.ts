import { Hono } from 'hono';
import { IMunicipalityProvider } from '../providers/types.js';
import type { CloudflareEnv } from '../types/env.js';

interface SitemapEntry {
  es: string;
  en: string;
  ca: string;
  gl: string;
  eu: string;
  priority: string;
  changefreq: string;
}

export function createSitemapRoutes(
  municipalityProvider: IMunicipalityProvider
): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * GET /api/v1/sitemap.xml
   * Generate canonical multilingual XML sitemap index & urls with xhtml:link hreflang alternates.
   */
  router.get('/sitemap.xml', async (c) => {
    const baseUrl = 'https://openbarrio.org';
    const now = new Date().toISOString().split('T')[0];

    const staticEntries: SitemapEntry[] = [
      {
        es: `${baseUrl}/`,
        en: `${baseUrl}/en`,
        ca: `${baseUrl}/ca`,
        gl: `${baseUrl}/gl`,
        eu: `${baseUrl}/eu`,
        priority: '1.0',
        changefreq: 'daily',
      },
      {
        es: `${baseUrl}/mapa`,
        en: `${baseUrl}/map`,
        ca: `${baseUrl}/mapa`,
        gl: `${baseUrl}/gl/mapa`,
        eu: `${baseUrl}/eu/mapa`,
        priority: '0.9',
        changefreq: 'daily',
      },
      {
        es: `${baseUrl}/fuentes-oficiales`,
        en: `${baseUrl}/official-sources`,
        ca: `${baseUrl}/fonts-oficials`,
        gl: `${baseUrl}/fontes-oficiais`,
        eu: `${baseUrl}/iturri-ofizialak`,
        priority: '0.8',
        changefreq: 'monthly',
      },
      {
        es: `${baseUrl}/estado-fuentes`,
        en: `${baseUrl}/sources-status`,
        ca: `${baseUrl}/estat-fonts`,
        gl: `${baseUrl}/estado-fontes`,
        eu: `${baseUrl}/iturrien-egoera`,
        priority: '0.7',
        changefreq: 'hourly',
      },
      {
        es: `${baseUrl}/comprobar-metros-catastro`,
        en: `${baseUrl}/check-cadastral-surface`,
        ca: `${baseUrl}/comprovar-metres-cadastre`,
        gl: `${baseUrl}/comprobar-metros-catastro`,
        eu: `${baseUrl}/katastro-metroak-egiaztatu`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/calculadora-alquiler-legal`,
        en: `${baseUrl}/legal-rent-calculator`,
        ca: `${baseUrl}/calculadora-lloguer-legal`,
        gl: `${baseUrl}/calculadora-aluguer-legal`,
        eu: `${baseUrl}/alokairu-legal-kalkulagailua`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/simulador-itp-ibi`,
        en: `${baseUrl}/property-tax-simulator`,
        ca: `${baseUrl}/simulador-itp-ibi`,
        gl: `${baseUrl}/simulador-itp-ibi`,
        eu: `${baseUrl}/itp-ibi-simulagailua`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/municipios`,
        en: `${baseUrl}/municipalities`,
        ca: `${baseUrl}/municipis`,
        gl: `${baseUrl}/municipios`,
        eu: `${baseUrl}/udalerriak`,
        priority: '0.9',
        changefreq: 'weekly',
      },
    ];

    const { items: municipalities } = await municipalityProvider.listMunicipalities({ limit: 100 });
    const municipalEntries: SitemapEntry[] = municipalities.map((m) => ({
      es: `${baseUrl}/municipio/${m.slug}`,
      en: `${baseUrl}/municipality/${m.slug}`,
      ca: `${baseUrl}/municipi/${m.slug}`,
      gl: `${baseUrl}/gl/municipio/${m.slug}`,
      eu: `${baseUrl}/eu/udalerria/${m.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    }));

    const allEntries = [...staticEntries, ...municipalEntries];

    // For every entry, generate deduplicated url blocks with cross-referencing 5-language hreflangs
    const urlBlocks: string[] = [];

    for (const entry of allEntries) {
      const seenLocs = new Set<string>();
      const hreflangBlock = `    <xhtml:link rel="alternate" hreflang="es" href="${entry.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${entry.ca}"/>
    <xhtml:link rel="alternate" hreflang="gl" href="${entry.gl}"/>
    <xhtml:link rel="alternate" hreflang="eu" href="${entry.eu}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.es}"/>`;

      for (const loc of [entry.es, entry.en, entry.ca, entry.gl, entry.eu]) {
        if (seenLocs.has(loc)) continue;
        seenLocs.add(loc);
        urlBlocks.push(`  <url>
    <loc>${loc}</loc>
${hreflangBlock}
    <lastmod>${now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlBlocks.join('\n')}
</urlset>`;

    c.header('Content-Type', 'application/xml; charset=utf-8');
    c.header('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200');
    return c.body(xml, 200);
  });

  return router;
}

import { Hono } from 'hono';
import { IMunicipalityProvider } from '../providers/types.js';
import type { CloudflareEnv } from '../types/env.js';

interface SitemapEntry {
  es: string;
  en: string;
  ca: string;
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
        priority: '1.0',
        changefreq: 'daily',
      },
      {
        es: `${baseUrl}/mapa`,
        en: `${baseUrl}/map`,
        ca: `${baseUrl}/mapa`,
        priority: '0.9',
        changefreq: 'daily',
      },
      {
        es: `${baseUrl}/fuentes-oficiales`,
        en: `${baseUrl}/official-sources`,
        ca: `${baseUrl}/fonts-oficials`,
        priority: '0.8',
        changefreq: 'monthly',
      },
      {
        es: `${baseUrl}/comprobar-metros-catastro`,
        en: `${baseUrl}/check-cadastral-surface`,
        ca: `${baseUrl}/comprovar-metres-cadastre`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/calculadora-alquiler-legal`,
        en: `${baseUrl}/legal-rent-calculator`,
        ca: `${baseUrl}/calculadora-lloguer-legal`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/simulador-itp-ibi`,
        en: `${baseUrl}/property-tax-simulator`,
        ca: `${baseUrl}/simulador-itp-ibi`,
        priority: '0.9',
        changefreq: 'weekly',
      },
      {
        es: `${baseUrl}/municipios`,
        en: `${baseUrl}/municipalities`,
        ca: `${baseUrl}/municipis`,
        priority: '0.9',
        changefreq: 'weekly',
      },
    ];

    const { items: municipalities } = await municipalityProvider.listMunicipalities({ limit: 100 });
    const municipalEntries: SitemapEntry[] = municipalities.map((m) => ({
      es: `${baseUrl}/municipio/${m.slug}`,
      en: `${baseUrl}/municipality/${m.slug}`,
      ca: `${baseUrl}/municipi/${m.slug}`,
      priority: '0.8',
      changefreq: 'monthly',
    }));

    const allEntries = [...staticEntries, ...municipalEntries];

    // For every entry, generate url blocks for each language with cross-referencing hreflangs
    const urlBlocks: string[] = [];

    for (const entry of allEntries) {
      // Spanish URL block
      urlBlocks.push(`  <url>
    <loc>${entry.es}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${entry.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${entry.ca}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.es}"/>
    <lastmod>${now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);

      // English URL block
      urlBlocks.push(`  <url>
    <loc>${entry.en}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${entry.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${entry.ca}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.es}"/>
    <lastmod>${now}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);

      // Catalan URL block
      if (entry.ca !== entry.es) {
        urlBlocks.push(`  <url>
    <loc>${entry.ca}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${entry.es}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${entry.en}"/>
    <xhtml:link rel="alternate" hreflang="ca" href="${entry.ca}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${entry.es}"/>
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

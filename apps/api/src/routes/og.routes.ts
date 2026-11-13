import { Hono } from 'hono';
import { IMunicipalityProvider } from '../providers/types.js';
import type { CloudflareEnv } from '../types/env.js';

export function createOgRoutes(
  municipalityProvider: IMunicipalityProvider
): Hono<{ Bindings: CloudflareEnv }> {
  const router = new Hono<{ Bindings: CloudflareEnv }>();

  /**
   * Helper to escape XML strings.
   */
  function escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * GET /api/v1/og/municipio/:slug
   * Dynamic 1200x630 SVG social card for a Spanish municipality.
   */
  router.get('/municipio/:slug', async (c) => {
    const slug = c.req.param('slug');
    const m = await municipalityProvider.getBySlugOrCode(slug);

    const title = escapeXml(m.name);
    const province = escapeXml(m.provinceName);
    const income = m.averageHouseholdIncomeEur.toLocaleString('es-ES') + ' €';
    const percentile = `${m.percentileNational}º`;
    const score = `${m.estimatedBarrioScore}/100`;
    const rentalStatus = m.isStressedMarket ? 'Zona Tensionada (Ley 12/2023)' : 'Mercado Ordinario';
    const rentalColor = m.isStressedMarket ? '#F59E0B' : '#10B981';

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1326"/>
      <stop offset="100%" stop-color="#050914"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="0.75" stroke-opacity="0.6"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Brand Header -->
  <g transform="translate(80, 70)">
    <rect width="44" height="44" rx="10" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1.5"/>
    <text x="22" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#10B981" text-anchor="middle">🏘️</text>
    <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#F8FAFC" letter-spacing="1">OPENBARRIO</text>
    <text x="60" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="2">AUDITORÍA CÍVICA MUNICIPAL · ESTADO ESPAÑOL</text>
  </g>

  <!-- Title & Subtitle -->
  <g transform="translate(80, 180)">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="56" font-weight="800" fill="#FFFFFF">${title}</text>
    <text x="0" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#94A3B8">Provincia de ${province} · Código INE ${m.code}</text>
  </g>

  <!-- Bento Metric Cards Grid -->
  <g transform="translate(80, 280)">
    <!-- Card 1: BarrioScore -->
    <g transform="translate(0, 0)">
      <rect width="235" height="180" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
      <text x="24" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94A3B8" letter-spacing="1">BARRIOSCORE</text>
      <text x="24" y="96" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#10B981">${score}</text>
      <text x="24" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748B">Calidad y servicios urbanos</text>
    </g>

    <!-- Card 2: Renta Media INE -->
    <g transform="translate(265, 0)">
      <rect width="235" height="180" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
      <text x="24" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94A3B8" letter-spacing="1">RENTA MEDIA / HOGAR</text>
      <text x="24" y="96" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="800" fill="#38BDF8">${income}</text>
      <text x="24" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748B">Percentil nacional: ${percentile}</text>
    </g>

    <!-- Card 3: Ley de Vivienda -->
    <g transform="translate(530, 0)">
      <rect width="255" height="180" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
      <text x="24" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94A3B8" letter-spacing="1">ALQUILER REGULADO</text>
      <text x="24" y="86" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="700" fill="${rentalColor}">${rentalStatus}</text>
      <text x="24" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748B">Índice SERPAVI estatal</text>
    </g>

    <!-- Card 4: Seguridad y Radón -->
    <g transform="translate(815, 0)">
      <rect width="225" height="180" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
      <text x="24" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94A3B8" letter-spacing="1">CTE DB-HS 6 RADÓN</text>
      <text x="24" y="96" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="800" fill="#F8FAFC">${m.radonZone}</text>
      <text x="24" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748B">Riesgo subsuelo</text>
    </g>
  </g>

  <!-- Footer Verification -->
  <g transform="translate(80, 560)">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#64748B">Fuentes Oficiales: Sede Electrónica del Catastro · INE ADRH · MITECO SICA/SNCZI · MIVAU SERPAVI</text>
    <text x="1040" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#10B981" text-anchor="end">openbarrio.org/municipio/${slug}</text>
  </g>
</svg>
    `.trim();

    c.header('Content-Type', 'image/svg+xml; charset=utf-8');
    c.header('Cache-Control', 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400');
    return c.body(svg, 200);
  });

  /**
   * GET /api/v1/og/tool/:tool
   * Dynamic 1200x630 SVG social card for civic micro-tools.
   */
  router.get('/tool/:tool', async (c) => {
    const tool = c.req.param('tool');

    const config: Record<string, { title: string; subtitle: string; icon: string; badge: string; color: string }> = {
      'comprobar-metros-catastro': {
        title: 'Comprobador de Metros de Catastro',
        subtitle: 'Detecta sobreprecio y exceso de cabida (>15%) frente a los metros oficiales del Catastro OVC.',
        icon: '📐',
        badge: 'CATASTRO OVC · LEY HIPOTECARIA',
        color: '#10B981',
      },
      'calculadora-alquiler-legal': {
        title: 'Calculadora de Alquiler Legal',
        subtitle: 'Comprueba el tope de renta por Ley 12/2023, Zonas Tensionadas y límites del Índice SERPAVI.',
        icon: '⚖️',
        badge: 'LEY 12/2023 · MIVAU SERPAVI',
        color: '#F59E0B',
      },
      'simulador-itp-ibi': {
        title: 'Simulador Fiscal ITP e IBI',
        subtitle: 'Calcula el Impuesto de Transmisiones por Comunidad Autónoma, aranceles notariales y cuota de IBI.',
        icon: '🪙',
        badge: '17 CCAA · ARANCELES OFICIALES',
        color: '#38BDF8',
      },
    };

    const target = config[tool] || {
      title: 'Micro-Herramienta Cívica Inmobiliaria',
      subtitle: 'Auditoría ciudadana con datos abiertos de las administraciones públicas españolas.',
      icon: '🏘️',
      badge: 'HERRAMIENTAS CÍVICAS ABIERTAS',
      color: '#10B981',
    };

    const title = escapeXml(target.title);
    const subtitle = escapeXml(target.subtitle);
    const badge = escapeXml(target.badge);

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1326"/>
      <stop offset="100%" stop-color="#050914"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" stroke-width="0.75" stroke-opacity="0.6"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <!-- Brand Header -->
  <g transform="translate(80, 70)">
    <rect width="44" height="44" rx="10" fill="${target.color}" fill-opacity="0.15" stroke="${target.color}" stroke-width="1.5"/>
    <text x="22" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="${target.color}" text-anchor="middle">${target.icon}</text>
    <text x="60" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="800" fill="#F8FAFC" letter-spacing="1">OPENBARRIO</text>
    <text x="60" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#94A3B8" letter-spacing="2">${badge}</text>
  </g>

  <!-- Big Title & Description -->
  <g transform="translate(80, 220)">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#FFFFFF">${title}</text>
    <text x="0" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#94A3B8">${subtitle}</text>
  </g>

  <!-- Feature Highlights Box -->
  <g transform="translate(80, 360)">
    <rect width="1040" height="130" rx="16" fill="#0F172A" stroke="#1E293B" stroke-width="1.5"/>
    <g transform="translate(40, 45)">
      <circle cx="16" cy="16" r="16" fill="${target.color}" fill-opacity="0.2"/>
      <text x="16" y="22" font-size="14" fill="${target.color}" font-weight="bold" text-anchor="middle">✓</text>
      <text x="44" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#F8FAFC">100% Gratuito y de Código Abierto</text>
    </g>
    <g transform="translate(400, 45)">
      <circle cx="16" cy="16" r="16" fill="${target.color}" fill-opacity="0.2"/>
      <text x="16" y="22" font-size="14" fill="${target.color}" font-weight="bold" text-anchor="middle">✓</text>
      <text x="44" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#F8FAFC">Sin Registro ni Publicidad Inmobiliaria</text>
    </g>
    <g transform="translate(800, 45)">
      <circle cx="16" cy="16" r="16" fill="${target.color}" fill-opacity="0.2"/>
      <text x="16" y="22" font-size="14" fill="${target.color}" font-weight="bold" text-anchor="middle">✓</text>
      <text x="44" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#F8FAFC">Soporte Embed / Widget</text>
    </g>
  </g>

  <!-- Footer -->
  <g transform="translate(80, 560)">
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#64748B">OpenBarrio v1.1.0 · Plataforma Cívica de Transparencia Territorial</text>
    <text x="1040" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="${target.color}" text-anchor="end">openbarrio.org/${tool}</text>
  </g>
</svg>
    `.trim();

    c.header('Content-Type', 'image/svg+xml; charset=utf-8');
    c.header('Cache-Control', 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400');
    return c.body(svg, 200);
  });

  return router;
}

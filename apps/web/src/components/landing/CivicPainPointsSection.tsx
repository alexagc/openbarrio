import React from 'react';
import {
  Building2,
  BarChart3,
  AlertTriangle,
  Scale,
  Landmark,
  TrendingDown,
  Volume2,
  Coins,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export const CivicPainPointsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="fuentes"
      className="w-full py-16 sm:py-20 lg:py-24 px-space-md sm:px-space-lg lg:px-space-xl border-b border-outline-variant/60 scroll-mt-14"
    >
      <div className="max-w-6xl w-full mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-primary font-mono text-xs mb-2">
              <Landmark className="w-4 h-4" />
              <span>{t('pillars.tag')}</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface">
              {t('pillars.title')}
            </h2>
          </div>
          <p className="font-body text-sm text-on-surface-variant max-w-md leading-relaxed">
            {t('pillars.subtitle')}
          </p>
        </div>

        {/* ================= REJILLA DE LOS 3 DOLORES CÍVICOS (Antes / Después) ================= */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="font-headline text-xs sm:text-sm font-bold uppercase tracking-wider text-on-surface font-mono">
              Los 3 Vicios Ocultos del Mercado Inmobiliario frente al Dato Oficial
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Dolor 1: Metros Falsos */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Dolor #1 · Metros Falsos
                  </span>
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-2">
                  Discrepancia Catastral de Superficie
                </h4>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Portales inmobiliarios comercializan metros ficticios computando zonas comunes, terrazas y trasteros al precio de vivienda.
                </p>

                {/* Micro-tarjeta Antes / Después */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/60">
                    <div className="flex items-center justify-between text-[10px] text-outline uppercase mb-0.5">
                      <span className="flex items-center gap-1 text-rose-400">
                        <XCircle className="w-3.5 h-3.5" /> Anuncio en Portal
                      </span>
                      <span>Sin verificar</span>
                    </div>
                    <div className="font-bold text-on-surface text-sm">115 m² construidos</div>
                    <span className="text-[10px] text-outline">Incluye trastero y elementos comunes inflados</span>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center justify-between text-[10px] text-primary uppercase font-bold mb-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Sede Catastro OVC
                      </span>
                      <span>Dato Oficial</span>
                    </div>
                    <div className="font-bold text-primary text-sm">82 m² construidos reales</div>
                    <span className="text-[10px] text-primary/80">Desfase real del -28.7% en superficie privativa</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Protección:</span>
                <span className="font-bold text-primary">Sede Catastro OVC WFS</span>
              </div>
            </div>

            {/* Dolor 2: Ruido y Zonas Inundables */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Dolor #2 · Vicios Ocultos
                  </span>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-2">
                  Ruido Nocturno y Riesgo Fluvial
                </h4>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Visitas inmobiliarias en horarios silenciosos ocultan afecciones acústicas severas por tráfico y láminas de inundación fluvial.
                </p>

                {/* Micro-tarjeta Antes / Después */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/60">
                    <div className="flex items-center justify-between text-[10px] text-outline uppercase mb-0.5">
                      <span className="flex items-center gap-1 text-rose-400">
                        <XCircle className="w-3.5 h-3.5" /> Anuncio en Portal
                      </span>
                      <span>Subjetivo</span>
                    </div>
                    <div className="font-bold text-on-surface text-sm">«Zona residencial muy tranquila»</div>
                    <span className="text-[10px] text-outline">Sin mediciones sonoras ni cartografía de cuenca</span>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center justify-between text-[10px] text-primary uppercase font-bold mb-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> MITECO SICA & SNCZI
                      </span>
                      <span>Dato Oficial</span>
                    </div>
                    <div className="font-bold text-primary text-sm">68 dBA nocturno · Inundación T=100a</div>
                    <span className="text-[10px] text-primary/80">Tráfico rodado continuo y flujo preferente</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Protección:</span>
                <span className="font-bold text-primary">SICA + Cartografía SNCZI</span>
              </div>
            </div>

            {/* Dolor 3: Tope de Renta */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant hover:border-primary/50 transition-all flex flex-col justify-between shadow-sm backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    Dolor #3 · Límite Legal
                  </span>
                  <Coins className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-2">
                  Tope Legal de Alquiler y Tensión
                </h4>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Precios de alquiler sobreinflados que vulneran el rango oficial regulado por la Ley 12/2023 por el derecho a la vivienda.
                </p>

                {/* Micro-tarjeta Antes / Después */}
                <div className="space-y-2.5 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/60">
                    <div className="flex items-center justify-between text-[10px] text-outline uppercase mb-0.5">
                      <span className="flex items-center gap-1 text-rose-400">
                        <XCircle className="w-3.5 h-3.5" /> Anuncio en Portal
                      </span>
                      <span>Alquiler Libre</span>
                    </div>
                    <div className="font-bold text-on-surface text-sm">1.600 € / mes exigidos</div>
                    <span className="text-[10px] text-outline">Precio fijado unilateralmente sin base pública</span>
                  </div>

                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center justify-between text-[10px] text-primary uppercase font-bold mb-0.5">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> MIVAU SERPAVI BOE
                      </span>
                      <span>Dato Oficial</span>
                    </div>
                    <div className="font-bold text-primary text-sm">Tope legal: 1.150 € / mes</div>
                    <span className="text-[10px] text-primary/80">Zona Tensionada · Rango 980 € - 1.150 €</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>Protección:</span>
                <span className="font-bold text-primary">SERPAVI BOE Microdatos</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4 PILARES OFICIALES ================= */}
        <div>
          <div className="font-mono text-xs text-outline uppercase font-semibold tracking-wider mb-4">
            INFRAESTRUCTURA DE DATOS SOBERANOS · 4 PILARES PÚBLICOS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: Catastro */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono text-[10px] text-primary font-medium">
                    {t('pillars.catastro.badge')}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-semibold text-on-surface mb-1">
                  {t('pillars.catastro.title')}
                </h4>
                <p className="font-mono text-[10px] text-outline mb-2 uppercase tracking-wide">
                  {t('pillars.catastro.agency')}
                </p>
                <p className="font-body text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {t('pillars.catastro.desc')}
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
                <span className="truncate">{t('pillars.catastro.layer')}</span>
                <span className="text-primary font-semibold shrink-0 ml-1">
                  {t('pillars.catastro.protocol')}
                </span>
              </div>
            </div>

            {/* Pillar 2: INE */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono text-[10px] text-primary font-medium">
                    {t('pillars.ine.badge')}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-semibold text-on-surface mb-1">
                  {t('pillars.ine.title')}
                </h4>
                <p className="font-mono text-[10px] text-outline mb-2 uppercase tracking-wide">
                  {t('pillars.ine.agency')}
                </p>
                <p className="font-body text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {t('pillars.ine.desc')}
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
                <span className="truncate">{t('pillars.ine.layer')}</span>
                <span className="text-primary font-semibold shrink-0 ml-1">
                  {t('pillars.ine.protocol')}
                </span>
              </div>
            </div>

            {/* Pillar 3: Environmental */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono text-[10px] text-primary font-medium">
                    {t('pillars.environmental.badge')}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-semibold text-on-surface mb-1">
                  {t('pillars.environmental.title')}
                </h4>
                <p className="font-mono text-[10px] text-outline mb-2 uppercase tracking-wide">
                  {t('pillars.environmental.agency')}
                </p>
                <p className="font-body text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {t('pillars.environmental.desc')}
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
                <span className="truncate">{t('pillars.environmental.layer')}</span>
                <span className="text-primary font-semibold shrink-0 ml-1">
                  {t('pillars.environmental.protocol')}
                </span>
              </div>
            </div>

            {/* Pillar 4: SERPAVI */}
            <div className="p-5 rounded-xl bg-surface-container/90 border border-outline-variant flex flex-col justify-between hover:border-primary/50 transition-colors shadow-xs backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono text-[10px] font-semibold">
                    {t('pillars.serpavi.badge')}
                  </span>
                </div>
                <h4 className="font-headline text-sm font-semibold text-on-surface mb-1">
                  {t('pillars.serpavi.title')}
                </h4>
                <p className="font-mono text-[10px] text-outline mb-2 uppercase tracking-wide">
                  {t('pillars.serpavi.agency')}
                </p>
                <p className="font-body text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {t('pillars.serpavi.desc')}
                </p>
              </div>
              <div className="pt-3 border-t border-outline-variant flex items-center justify-between font-mono text-xs text-on-surface-variant">
                <span className="truncate">{t('pillars.serpavi.layer')}</span>
                <span className="text-primary font-semibold shrink-0 ml-1">
                  {t('pillars.serpavi.protocol')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

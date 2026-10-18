import React from 'react';
import { Map, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface MapCtaSectionProps {
  onOpenMap?: () => void;
}

export const MapCtaSection: React.FC<MapCtaSectionProps> = ({ onOpenMap }) => {
  const { t } = useTranslation();

  return (
    <section
      id="mapa"
      className="py-12 px-space-lg lg:px-space-xl bg-surface-container-lowest border-b border-outline-variant scroll-mt-14"
    >
      <div className="max-w-6xl mx-auto rounded-lg bg-surface-container border border-outline-variant p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="max-w-xl">
          <span className="font-mono text-xs text-primary uppercase font-bold tracking-wider">
            {t('mapCta.tag')}
          </span>
          <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface mt-1 mb-2">
            {t('mapCta.title')}
          </h3>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            {t('mapCta.desc')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenMap}
            className="w-full sm:w-auto px-6 py-3 rounded bg-primary text-on-primary font-body text-sm font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <Map className="w-5 h-5" />
            <span>{t('mapCta.button')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

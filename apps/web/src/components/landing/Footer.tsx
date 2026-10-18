import React from 'react';
import { Building2 } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface FooterProps {
  onOpenMap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMap }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container border-t border-outline-variant pt-12 pb-8 px-space-lg lg:px-space-xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-outline-variant">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-headline text-lg font-bold text-primary tracking-tight">
                OpenBarrio
              </span>
            </div>
            <p className="font-body text-sm text-on-surface-variant max-w-sm mb-4 leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant font-mono text-xs text-on-surface-variant">
                {t('footer.badgeAporta')}
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant font-mono text-xs text-on-surface-variant">
                {t('footer.badgeDatosGob')}
              </span>
            </div>
          </div>

          {/* Sources Column */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
              {t('footer.colSources')}
            </h4>
            <ul className="space-y-2 font-body text-xs text-on-surface-variant">
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.sedecatastro.gob.es/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkCatastro')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.ine.es/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkIne')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.miteco.gob.es/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkSica')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.miteco.gob.es/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkSnczi')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.mivau.gob.es/"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkMivau')}
                </a>
              </li>
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
              {t('footer.colTools')}
            </h4>
            <ul className="space-y-2 font-body text-xs text-on-surface-variant">
              <li>
                <button
                  type="button"
                  onClick={onOpenMap}
                  className="hover:text-primary transition-colors text-left cursor-pointer"
                >
                  {t('footer.linkMap')}
                </button>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#extension">
                  {t('footer.linkExtension')}
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  {t('footer.linkPdf')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://github.com/alexagc/openbarrio/tree/main/apps/api"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkApi')}
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  {t('footer.linkRaw')}
                </a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h4 className="font-headline text-sm font-semibold text-on-surface mb-3">
              {t('footer.colCommunity')}
            </h4>
            <ul className="space-y-2 font-body text-xs text-on-surface-variant">
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://github.com/alexagc/openbarrio"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkGithub')}
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  {t('footer.linkMatrix')}
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#fuentes">
                  {t('footer.linkMethodology')}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  rel="noreferrer"
                  target="_blank"
                >
                  {t('footer.linkLicense')}
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  {t('footer.linkTransparency')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-outline">
          <div>{t('footer.copyright', { year: currentYear })}</div>
          <div className="flex items-center gap-3">
            <span className="text-primary font-medium">{t('footer.spatialCoord')}</span>
            <span>·</span>
            <span>{t('footer.updateFrequency')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

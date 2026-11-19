import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useConsent } from '../../analytics';
import { useTranslation } from '../../i18n';
import { useWorkspaceStore, useIsEmbed } from '../../store/workspace.store';
import type { ViewMode } from '../../hooks/useUrlSync';

/**
 * Non-blocking GDPR / ePrivacy opt-in consent banner.
 * Reject and Accept controls share equal visual weight and prominence (zero dark patterns).
 */
export const ConsentBanner: React.FC = () => {
  const { t } = useTranslation();
  const { bannerVisible, acceptConsent, rejectConsent } = useConsent();
  const isEmbed = useIsEmbed();
  const setViewMode = useWorkspaceStore((s) => s.setViewMode);

  if (!bannerVisible || isEmbed) {
    return null;
  }

  const buttonClass =
    'px-3.5 py-2 rounded-lg text-xs font-semibold border border-outline-variant bg-surface-container-high hover:border-primary hover:bg-surface-container text-on-surface transition-colors cursor-pointer min-h-[36px]';

  return (
    <aside
      role="region"
      aria-label={t('consent.bannerAria')}
      data-testid="consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-lg z-40 rounded-xl bg-surface-container border border-outline-variant shadow-2xl p-4 no-print"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-primary/15 text-primary shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <h2 className="font-headline text-sm font-bold text-on-surface">
            {t('consent.title')}
          </h2>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            {t('consent.description')}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              data-testid="consent-privacy-link"
              onClick={() => setViewMode('privacy' as ViewMode)}
              className="font-mono text-xs text-primary hover:underline cursor-pointer"
            >
              {t('consent.learnMore')}
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                data-testid="consent-reject-btn"
                onClick={rejectConsent}
                className={buttonClass}
              >
                {t('consent.rejectBtn')}
              </button>
              <button
                type="button"
                data-testid="consent-accept-btn"
                onClick={() => acceptConsent()}
                className={buttonClass}
              >
                {t('consent.acceptBtn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

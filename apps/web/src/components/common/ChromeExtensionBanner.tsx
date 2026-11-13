import { useState, useEffect } from 'react';
import { Sparkles, X, ShieldCheck } from 'lucide-react';
import { Chrome } from './BrandIcons';
import { useTranslation } from '../../i18n';

interface ChromeExtensionBannerProps {
  variant?: 'in-content' | 'sticky';
  contextText?: string;
  className?: string;
}

export function ChromeExtensionBanner({
  variant = 'in-content',
  contextText,
  className = '',
}: ChromeExtensionBannerProps) {
  const { t } = useTranslation();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChrome, setIsChrome] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('openbarrio_ext_banner_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
      // Simple user agent check
      const ua = navigator.userAgent;
      const isChromium =
        /Chrome|Chromium|Edg|OPR|Brave/i.test(ua) && !/Firefox/i.test(ua);
      setIsChrome(isChromium);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('openbarrio_ext_banner_dismissed', 'true');
    } catch {
      // Ignore
    }
  };

  const ctaUrl =
    'https://chromewebstore.google.com/detail/openbarrio-auditor%C3%ADa-in/placeholder';

  if (variant === 'sticky') {
    if (isDismissed) return null;

    return (
      <aside
        aria-label="Extensión de OpenBarrio"
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-surface-container-high/95 backdrop-blur-md border border-primary/30 shadow-2xl rounded-2xl p-4 transition-all duration-300 ${className}`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {t('extensionBanner.freeExtension')}
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-medium">Manifest V3</span>
              </div>
              <p className="text-sm font-semibold text-on-surface truncate">
                {contextText || t('extensionBanner.contextSurface')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl shadow hover:bg-primary-hover transition-colors"
            >
              <Chrome className="w-4 h-4 shrink-0" />
              <span>{t('extensionBanner.installCta')}</span>
            </a>
            <button
              onClick={handleDismiss}
              aria-label={t('extensionBanner.closeNotice')}
              className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Variant in-content
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low p-6 shadow-lg ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('extensionBanner.freeExtension')}</span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-on-surface">
            {contextText || t('extension.title')}
          </h3>

          <p className="text-sm text-on-surface-variant leading-relaxed">
            {t('extension.desc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm shadow-md transition-all duration-200 hover:shadow-primary/25"
          >
            <Chrome className="w-5 h-5 shrink-0" />
            <span>{isChrome ? t('extensionBanner.installCta') : t('extension.ctaButton')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

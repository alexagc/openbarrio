import React, { useEffect, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { usePwaStore } from '../../store/pwa.store';
import { useWorkspaceStore, useIsEmbed } from '../../store/workspace.store';
import { useTranslation } from '../../i18n';

function supportsNativeManualPopover(): boolean {
  return (
    typeof HTMLElement !== 'undefined' &&
    Object.prototype.hasOwnProperty.call(HTMLElement.prototype, 'popover')
  );
}

/**
 * Controlled Service Worker update notification toast.
 * Never activates a waiting worker automatically; uses `popover="manual"` when supported
 * with a pre-mounted ARIA live region and a permanent fallback trigger in the Footer.
 */
export const SwUpdateToast: React.FC = () => {
  const { t } = useTranslation();
  const hasPendingUpdate = usePwaStore((s) => s.hasPendingUpdate);
  const toastDismissed = usePwaStore((s) => s.toastDismissed);
  const applyPendingUpdate = usePwaStore((s) => s.applyPendingUpdate);
  const dismissPendingUpdate = usePwaStore((s) => s.dismissPendingUpdate);
  const isEmbed = useIsEmbed();
  const isDuelOpen = useWorkspaceStore((s) => s.isDuelOpen);
  const isUnitPickerOpen = useWorkspaceStore((s) => s.isUnitPickerOpen);

  const toastRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const isModalOpen = isDuelOpen || isUnitPickerOpen;
  const isVisible = hasPendingUpdate && !toastDismissed && !isEmbed && !isModalOpen;

  useEffect(() => {
    const el = toastRef.current as (HTMLDivElement & {
      showPopover?: () => void;
      hidePopover?: () => void;
    }) | null;

    if (isVisible) {
      const announcement = `${t('pwa.updateTitle')}. ${t('pwa.updateDescription')} ${t('pwa.actionsAvailable')}`;
      const docAny = document as Document & { ariaNotify?: (msg: string) => void };
      if (typeof docAny.ariaNotify === 'function') {
        try {
          docAny.ariaNotify(announcement);
        } catch {
          // Fallback live region remains mounted below
        }
      }

      if (el && supportsNativeManualPopover() && typeof el.showPopover === 'function') {
        try {
          if (!el.matches(':popover-open')) {
            el.showPopover();
          }
        } catch {
          // Ignore browser popover state mismatch
        }
      }
    } else if (el && supportsNativeManualPopover() && typeof el.hidePopover === 'function') {
      try {
        if (el.matches(':popover-open')) {
          el.hidePopover();
        }
      } catch {
        // Ignore browser popover state mismatch
      }
    }
  }, [isVisible, t]);

  const handleDismiss = () => {
    const prior = previousFocusRef.current;
    dismissPendingUpdate();
    if (prior && typeof prior.focus === 'function' && document.contains(prior)) {
      prior.focus();
    }
  };

  const popoverAttrs = supportsNativeManualPopover()
    ? ({ popover: 'manual' } as Record<string, string>)
    : {};

  return (
    <div
      role="region"
      aria-label={t('pwa.notificationsRegionAria')}
      data-testid="pwa-notifications-region"
      className="no-print"
    >
      {/* Pre-mounted hidden live region fallback for assistive technologies */}
      <div className="sr-only" aria-live="polite" data-testid="pwa-toast-live-region">
        {isVisible ? `${t('pwa.updateTitle')}: ${t('pwa.updateDescription')}` : ''}
      </div>

      {isVisible && (
        <div
          ref={toastRef}
          {...popoverAttrs}
          role="status"
          data-testid="sw-update-toast"
          onFocusCapture={() => {
            if (!previousFocusRef.current && document.activeElement instanceof HTMLElement) {
              previousFocusRef.current = document.activeElement;
            }
          }}
          className="ob-toast-popover fixed inset-auto bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 m-0 p-4 rounded-xl bg-surface-container border border-primary/50 shadow-2xl text-on-surface"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/15 text-primary shrink-0 mt-0.5">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-headline text-sm font-bold text-on-surface">
                  {t('pwa.updateTitle')}
                </p>
                <button
                  type="button"
                  data-testid="sw-update-dismiss-btn"
                  onClick={handleDismiss}
                  aria-label={t('pwa.dismissBtn')}
                  className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                {t('pwa.updateDescription')}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  data-testid="sw-update-apply-btn"
                  onClick={applyPendingUpdate}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t('pwa.updateBtn')}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface text-xs font-semibold hover:border-primary transition-colors cursor-pointer"
                >
                  {t('pwa.dismissBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

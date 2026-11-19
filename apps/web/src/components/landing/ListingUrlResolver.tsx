import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Link2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  isCadastralReference,
  LISTING_MAX_PASTE_BYTES,
  utf8ByteLength,
  type ListingResolveResponse,
} from '@openbarrio/core';
import { useTranslation } from '../../i18n';
import { ApiError, apiClient } from '../../services/api.client';

interface ListingUrlResolverProps {
  onAudit: (
    query: string,
    mode: 'address' | 'refcat',
    coords?: { lat: number; lon: number }
  ) => void;
  onSwitchToManual: () => void;
}

export const ListingUrlResolver: React.FC<ListingUrlResolverProps> = ({
  onAudit,
  onSwitchToManual,
}) => {
  const { t } = useTranslation();
  const urlInputRef = useRef<HTMLInputElement>(null);

  const [urlValue, setUrlValue] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [rawTextValue, setRawTextValue] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resolved, setResolved] = useState<ListingResolveResponse | null>(null);

  // Editable confirmation state before dispatching official audit
  const [editableRefcat, setEditableRefcat] = useState('');
  const [editableAddress, setEditableAddress] = useState('');
  const [editableSurface, setEditableSurface] = useState('');

  const mapErrorToMessage = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 413) return t('listingUrl.errorPayloadTooLarge');
      if (err.status === 429) return t('listingUrl.errorRateLimit');
      if (err.problem?.type?.includes('listing-host-unsupported')) {
        return t('listingUrl.errorUnsupportedHost');
      }
      if (err.status === 400 || err.problem?.type?.includes('listing-url-invalid')) {
        return t('listingUrl.errorInvalidUrl');
      }
      return err.message || t('listingUrl.errorGeneric');
    }
    return t('listingUrl.errorGeneric');
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResolved(null);

    const trimmedUrl = urlValue.trim();
    if (!trimmedUrl) {
      setErrorMsg(t('listingUrl.errorInvalidUrl'));
      urlInputRef.current?.focus();
      return;
    }

    if (showRawText && rawTextValue && utf8ByteLength(rawTextValue) > LISTING_MAX_PASTE_BYTES) {
      setErrorMsg(t('listingUrl.errorPayloadTooLarge'));
      return;
    }

    setIsResolving(true);
    try {
      const response = await apiClient.resolveListingUrl(
        trimmedUrl,
        showRawText && rawTextValue.trim() ? rawTextValue : undefined
      );
      setResolved(response);
      setEditableRefcat(response.extracted.cadastralReference || '');
      setEditableAddress(
        response.extracted.address ||
          response.extracted.streetHint ||
          response.extracted.municipalitySlug ||
          ''
      );
      setEditableSurface(
        response.extracted.surfaceM2 !== undefined ? String(response.extracted.surfaceM2) : ''
      );
    } catch (err: unknown) {
      setErrorMsg(mapErrorToMessage(err));
      urlInputRef.current?.focus();
    } finally {
      setIsResolving(false);
    }
  };

  const handleConfirmAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const refcat = editableRefcat.replace(/[\s\-_.]/g, '').toUpperCase();
    if (refcat && isCadastralReference(refcat)) {
      onAudit(refcat, 'refcat');
      return;
    }
    const addr = editableAddress.trim();
    if (addr) {
      onAudit(addr, 'address');
      return;
    }
    setErrorMsg(t('listingUrl.errorGeneric'));
  };

  return (
    <div className="space-y-3" data-testid="listing-url-resolver">
      <form onSubmit={handleResolveSubmit} noValidate className="space-y-2.5">
        <div className="space-y-1">
          <label
            htmlFor="listing-url-input"
            className="block font-mono text-xs font-semibold text-on-surface"
          >
            {t('listingUrl.urlLabel')}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                ref={urlInputRef}
                id="listing-url-input"
                type="url"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                aria-invalid={Boolean(errorMsg)}
                aria-describedby={errorMsg ? 'listing-url-error' : undefined}
                placeholder={t('listingUrl.urlPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-body text-sm placeholder:text-outline outline-hidden transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isResolving}
              className="px-5 py-2.5 rounded bg-primary-container text-on-primary-container font-body text-sm font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer disabled:opacity-60"
            >
              <span>{isResolving ? t('listingUrl.resolvingBtn') : t('listingUrl.resolveBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Accessible inline error announcement (modern-web-guidance) */}
        {errorMsg && (
          <p
            id="listing-url-error"
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 p-2.5 rounded bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </p>
        )}

        {/* Collapsible optional user-pasted text box (zero server fetch) */}
        <div>
          <button
            type="button"
            onClick={() => setShowRawText((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline cursor-pointer"
          >
            {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{t('listingUrl.rawTextToggle')}</span>
          </button>

          {showRawText && (
            <div className="mt-2 space-y-1">
              <label
                htmlFor="listing-raw-text"
                className="block font-mono text-[11px] text-on-surface-variant"
              >
                {t('listingUrl.rawTextLabel')}
              </label>
              <textarea
                id="listing-raw-text"
                rows={3}
                value={rawTextValue}
                onChange={(e) => setRawTextValue(e.target.value)}
                placeholder={t('listingUrl.rawTextPlaceholder')}
                className="w-full p-2.5 rounded bg-surface-container-lowest border border-outline-variant focus:border-primary text-xs font-mono text-on-surface placeholder:text-outline outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Visible legal compliance & zero-retention notice */}
        <p className="flex items-start gap-2 font-mono text-[11px] text-on-surface-variant leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>{t('listingUrl.legalNotice')}</span>
        </p>
      </form>

      {/* Editable confirmation form before triggering Catastro audit */}
      {resolved && (
        <form
          onSubmit={handleConfirmAudit}
          data-testid="listing-confirm-panel"
          className="p-3.5 rounded-lg bg-surface-container-high border border-primary/40 space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-headline font-bold text-xs text-primary">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{t('listingUrl.confirmTitle')}</span>
            </span>
            <span className="font-mono text-[10px] text-on-surface-variant uppercase">
              {resolved.portal} · {resolved.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label
                htmlFor="confirm-refcat"
                className="block font-mono text-[11px] text-on-surface-variant mb-1"
              >
                {t('listingUrl.refcatFieldLabel')}
              </label>
              <input
                id="confirm-refcat"
                type="text"
                value={editableRefcat}
                onChange={(e) => setEditableRefcat(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs font-mono text-on-surface"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-address"
                className="block font-mono text-[11px] text-on-surface-variant mb-1"
              >
                {t('listingUrl.addressFieldLabel')}
              </label>
              <input
                id="confirm-address"
                type="text"
                value={editableAddress}
                onChange={(e) => setEditableAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs font-mono text-on-surface"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-surface"
                className="block font-mono text-[11px] text-on-surface-variant mb-1"
              >
                {t('listingUrl.surfaceFieldLabel')}
              </label>
              <input
                id="confirm-surface"
                type="number"
                value={editableSurface}
                onChange={(e) => setEditableSurface(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded bg-surface-container-lowest border border-outline-variant text-xs font-mono text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={onSwitchToManual}
              className="text-xs font-mono text-on-surface-variant hover:text-primary underline cursor-pointer"
            >
              {t('listingUrl.manualFallbackBtn')}
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-primary-container text-on-primary-container font-body text-xs font-semibold hover:bg-primary transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('listingUrl.launchAuditBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

import { LayerStatusInfo, isStaleAmber } from '@openbarrio/core';
import { AlertTriangle, CheckCircle2, Clock, CloudOff, MapPinOff } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface LayerStatusBadgeProps {
  info?: LayerStatusInfo;
  showOk?: boolean;
  className?: string;
}

function formatVerifiedDate(iso?: string): string {
  if (!iso) return '—';
  return iso.slice(0, 10);
}

export function LayerStatusBadge({
  info,
  showOk = false,
  className = '',
}: LayerStatusBadgeProps) {
  const { t } = useTranslation();

  if (!info) return null;
  if (info.status === 'ok' && !showOk) return null;

  if (info.status === 'ok') {
    return (
      <span
        data-testid="layer-status-badge"
        data-status="ok"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border bg-primary/10 text-primary border-primary/30 ${className}`}
      >
        <CheckCircle2 className="w-3 h-3 shrink-0" />
        <span>{t('uncertainty.statusOk')}</span>
      </span>
    );
  }

  if (info.status === 'stale') {
    const dateStr = formatVerifiedDate(info.verifiedAt ?? info.sourceDate);
    const amber = isStaleAmber(info.staleDays);
    return (
      <span
        data-testid="layer-status-badge"
        data-status="stale"
        data-amber={amber ? 'true' : 'false'}
        title={
          amber
            ? t('uncertainty.staleAmberWarning', { source: info.sourceName, date: dateStr })
            : t('uncertainty.staleVerified', { source: info.sourceName, date: dateStr })
        }
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
          amber
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/50 font-semibold'
            : 'bg-surface-container-high text-on-surface-variant border-outline/40'
        } ${className}`}
      >
        {amber ? <AlertTriangle className="w-3 h-3 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
        <span>{t('uncertainty.staleVerified', { source: info.sourceName, date: dateStr })}</span>
      </span>
    );
  }

  if (info.status === 'out_of_coverage') {
    return (
      <span
        data-testid="layer-status-badge"
        data-status="out_of_coverage"
        title={t('uncertainty.outOfCoverage', { source: info.sourceName })}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border bg-surface-container text-outline border-outline-variant ${className}`}
      >
        <MapPinOff className="w-3 h-3 shrink-0" />
        <span>{t('uncertainty.statusOutOfCoverage')}</span>
      </span>
    );
  }

  return (
    <span
      data-testid="layer-status-badge"
      data-status="unavailable"
      title={t('uncertainty.unavailable', { source: info.sourceName })}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border bg-surface-container text-outline border-outline-variant ${className}`}
    >
      <CloudOff className="w-3 h-3 shrink-0" />
      <span>{t('uncertainty.statusUnavailable')}</span>
    </span>
  );
}

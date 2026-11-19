import { LayerStatusInfo } from '@openbarrio/core';
import { CloudOff, MapPinOff } from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface DataUnavailableStateProps {
  info?: LayerStatusInfo;
  fallbackSource: string;
  compact?: boolean;
  className?: string;
}

export function DataUnavailableState({
  info,
  fallbackSource,
  compact = false,
  className = '',
}: DataUnavailableStateProps) {
  const { t } = useTranslation();
  const isOutOfCoverage = info?.status === 'out_of_coverage';
  const source = info?.sourceName || fallbackSource;

  return (
    <div
      data-testid="data-unavailable-state"
      data-status={isOutOfCoverage ? 'out_of_coverage' : 'unavailable'}
      className={`rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant flex items-start gap-2 ${
        compact ? 'p-2.5 text-[11px]' : 'p-3 text-xs'
      } ${className}`}
    >
      {isOutOfCoverage ? (
        <MapPinOff className="w-4 h-4 text-outline shrink-0 mt-0.5" />
      ) : (
        <CloudOff className="w-4 h-4 text-outline shrink-0 mt-0.5" />
      )}
      <div className="space-y-0.5 min-w-0">
        <span className="font-mono text-[10px] uppercase text-outline block">
          {isOutOfCoverage
            ? t('uncertainty.statusOutOfCoverage')
            : t('uncertainty.statusUnavailable')}
        </span>
        <p className="leading-snug text-on-surface-variant">
          {isOutOfCoverage
            ? t('uncertainty.outOfCoverage', { source })
            : t('uncertainty.unavailable', { source })}
        </p>
      </div>
    </div>
  );
}

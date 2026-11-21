import React from 'react';
import { BroadbandCoverage, LayerStatusInfo } from '@openbarrio/core';
import { Wifi, AlertTriangle, Info, Radio, Gauge } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LayerStatusBadge } from '../common/LayerStatusBadge';
import { DataUnavailableState } from '../common/DataUnavailableState';

interface BroadbandConnectivityCardProps {
  broadband?: BroadbandCoverage;
  broadbandLayer?: LayerStatusInfo;
}

export const BroadbandConnectivityCard: React.FC<BroadbandConnectivityCardProps> = ({
  broadband,
  broadbandLayer,
}) => {
  const { t } = useTranslation();

  if (!broadband && !broadbandLayer) {
    return null;
  }

  const granularityLabel = broadband
    ? t(`broadband.granularities.${broadband.granularity}`)
    : '';

  const showUnavailable =
    !broadband ||
    broadbandLayer?.status === 'unavailable' ||
    broadbandLayer?.status === 'out_of_coverage';

  return (
    <div
      data-testid="broadband-connectivity-card"
      className="p-space-lg rounded-xl bg-surface border border-outline-variant/70 space-y-3.5 shadow-sm hover:border-outline-variant transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col border-b border-outline-variant pb-2.5 gap-2">
        <div className="flex items-start gap-2">
          <Wifi className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              {t('broadband.title')}
            </h3>
            <p className="text-[11px] font-mono text-on-surface-variant">
              {t('broadband.subtitle')}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LayerStatusBadge info={broadbandLayer} showOk />
          {broadband && (
            <span
              data-testid="broadband-granularity-badge"
              className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant text-[10px] font-mono text-on-surface-variant"
            >
              {t('broadband.granularityLabel')}: {granularityLabel}
            </span>
          )}
        </div>
      </div>

      {showUnavailable ? (
        <div className="space-y-2">
          <DataUnavailableState
            info={broadbandLayer}
            fallbackSource="SETELECO / CNMC Banda Ancha"
          />
          <p className="text-[11px] font-mono text-on-surface-variant px-1">
            {broadbandLayer?.status === 'out_of_coverage'
              ? t('broadband.outOfCoverageDetail')
              : t('broadband.unavailableDetail')}
          </p>
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline uppercase">
                <Wifi className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{t('broadband.ftthLabel')}</span>
              </div>
              <span
                data-testid="broadband-ftth-pct"
                className="font-mono text-lg font-bold text-primary block mt-1 tabular-nums"
              >
                {broadband.ftthPct.toFixed(1)}%
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline uppercase">
                <Radio className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>{t('broadband.mobile5gLabel')}</span>
              </div>
              <span
                data-testid="broadband-5g-pct"
                className="font-mono text-lg font-bold text-secondary block mt-1 tabular-nums"
              >
                {broadband.mobile5gPct !== null && broadband.mobile5gPct !== undefined
                  ? `${broadband.mobile5gPct.toFixed(1)}%`
                  : t('broadband.notReported')}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline uppercase">
                <Gauge className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span>{t('broadband.maxSpeedLabel')}</span>
              </div>
              <span className="font-mono text-lg font-bold text-on-surface block mt-1 tabular-nums">
                {broadband.fixedMaxMbps !== null && broadband.fixedMaxMbps !== undefined
                  ? `${broadband.fixedMaxMbps} ${t('broadband.maxSpeedUnit')}`
                  : t('broadband.notReported')}
              </span>
            </div>
          </div>

          {/* Dataset Provenance */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-on-surface-variant px-0.5">
            <span>
              {t('broadband.datasetLabel')}: <strong className="text-on-surface">{broadband.sourceDataset}</strong>
            </span>
            <span>
              {t('broadband.sourceYearLabel')}: <strong className="text-on-surface">{broadband.sourceYear}</strong> · {broadband.entityName}
            </span>
          </div>

          {/* Mandatory Granularity & Historical ESP Disclosure */}
          <div
            data-testid="broadband-granularity-disclaimer"
            className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/35 text-xs text-amber-200 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {t('broadband.disclaimerBanner', {
                granularity: granularityLabel,
                year: broadband.sourceYear,
              })}
            </span>
          </div>

          {/* Informative-Only Notice */}
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-outline pt-1 border-t border-outline-variant/60">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{t('broadband.informativeOnlyNote')}</span>
          </div>
        </>
      )}
    </div>
  );
};

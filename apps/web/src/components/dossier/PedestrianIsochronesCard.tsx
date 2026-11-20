import React, { useId, useRef, useState } from 'react';
import {
  PedestrianIsochrones,
  CivicConnectivityData,
  TransitAccessibility,
  LayerStatusInfo,
} from '@openbarrio/core';
import {
  Clock,
  HeartPulse,
  GraduationCap,
  Train,
  Trees,
  Compass,
  AlertTriangle,
  Bus,
  TramFront,
  Timer,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LayerStatusBadge } from '../common/LayerStatusBadge';
import { DataUnavailableState } from '../common/DataUnavailableState';

interface PedestrianIsochronesCardProps {
  isochrones?: PedestrianIsochrones;
  connectivity?: CivicConnectivityData;
  transit?: TransitAccessibility;
  transitLayer?: LayerStatusInfo;
}

type ConnectivitySubTab = 'walk' | 'transit';

export const PedestrianIsochronesCard: React.FC<PedestrianIsochronesCardProps> = ({
  isochrones,
  connectivity,
  transit,
  transitLayer,
}) => {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<ConnectivitySubTab>('walk');
  const baseId = useId();
  const walkTabRef = useRef<HTMLButtonElement | null>(null);
  const transitTabRef = useRef<HTMLButtonElement | null>(null);

  if (!isochrones && !connectivity && !transit && !transitLayer) return null;

  const walkTabId = `${baseId}-tab-walk`;
  const transitTabId = `${baseId}-tab-transit`;

  const walkScore = connectivity?.walkScore15Min ?? isochrones?.totalFacilitiesWithin15Min ?? 75;
  const iso5 = isochrones?.isochrone5Min;
  const iso10 = isochrones?.isochrone10Min;
  const iso15 = isochrones?.isochrone15Min;
  const conn = connectivity;

  const ratingLabel =
    walkScore >= 90
      ? t('walkscore.walkersParadise')
      : walkScore >= 70
      ? t('walkscore.veryWalkable')
      : walkScore >= 50
      ? t('walkscore.somewhatWalkable')
      : t('walkscore.carDependent');

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (
      e.key !== 'ArrowRight' &&
      e.key !== 'ArrowLeft' &&
      e.key !== 'Home' &&
      e.key !== 'End'
    ) {
      return;
    }
    e.preventDefault();
    const next: ConnectivitySubTab =
      e.key === 'Home'
        ? 'walk'
        : e.key === 'End'
        ? 'transit'
        : activeMode === 'walk'
        ? 'transit'
        : 'walk';
    setActiveMode(next);
    if (next === 'walk') {
      walkTabRef.current?.focus();
    } else {
      transitTabRef.current?.focus();
    }
  };

  const renderModeIcon = (mode: string) => {
    if (mode === 'tram') return <TramFront className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    if (mode === 'bus') return <Bus className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    return <Train className="w-3.5 h-3.5 text-tertiary shrink-0" />;
  };

  const isPartialCoverage =
    transitLayer?.status === 'out_of_coverage' &&
    Boolean(transit) &&
    (transit?.coveragePct ?? 0) > 0;
  const coveragePctValue = transit?.coveragePct ?? transitLayer?.coveragePct ?? 0;

  return (
    <div
      data-testid="pedestrian-isochrones-card"
      className="p-space-lg rounded-xl bg-surface border border-outline-variant/70 space-y-3.5 shadow-sm hover:border-outline-variant transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-outline-variant pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-title-md text-title-md text-on-surface font-semibold flex items-center gap-1.5 flex-wrap">
            <span>Conectividad Cívica & 15-Min</span>
            <span className="text-outline text-xs font-normal">({t('walkscore.cardTitle')})</span>
          </h3>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/30">
            WalkScore {walkScore}/100
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            {ratingLabel}
          </span>
        </div>
      </div>

      {/* Accessible Walk vs GTFS Transit Tabs */}
      <div
        role="tablist"
        aria-label={t('transit.modeTabsAria')}
        className="flex items-center gap-2 border-b border-outline-variant/70 overflow-x-auto"
        {...({ focusgroup: 'tablist nomemory' } as Record<string, string>)}
      >
        <button
          ref={walkTabRef}
          type="button"
          role="tab"
          id={walkTabId}
          data-testid="connectivity-tab-walk"
          aria-selected={activeMode === 'walk'}
          tabIndex={activeMode === 'walk' ? 0 : -1}
          onClick={() => setActiveMode('walk')}
          onKeyDown={handleTabKeyDown}
          className="px-3 py-2 font-mono text-xs font-semibold whitespace-nowrap border-b-2 border-transparent text-on-surface-variant hover:text-on-surface aria-selected:border-primary aria-selected:text-primary transition-colors cursor-pointer"
          {...(activeMode === 'walk' ? ({ focusgroupstart: '' } as Record<string, string>) : {})}
        >
          {t('transit.tabWalk')}
        </button>

        <button
          ref={transitTabRef}
          type="button"
          role="tab"
          id={transitTabId}
          data-testid="connectivity-tab-transit"
          aria-selected={activeMode === 'transit'}
          tabIndex={activeMode === 'transit' ? 0 : -1}
          onClick={() => setActiveMode('transit')}
          onKeyDown={handleTabKeyDown}
          className="px-3 py-2 font-mono text-xs font-semibold whitespace-nowrap border-b-2 border-transparent text-on-surface-variant hover:text-on-surface aria-selected:border-primary aria-selected:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
          {...(activeMode === 'transit' ? ({ focusgroupstart: '' } as Record<string, string>) : {})}
        >
          <Train className="w-3.5 h-3.5 shrink-0" />
          <span>{t('transit.tabTransit')}</span>
        </button>
      </div>

      {/* Panel 1: 15-Minute Pedestrian Isochrones */}
      <div
        role="tabpanel"
        aria-labelledby={walkTabId}
        data-testid="connectivity-panel-walk"
        hidden={activeMode !== 'walk'}
      >
        <div className="space-y-3.5 pt-1">
          {/* 3 Isochrone Rings Catchment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Ring 5 min */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-indigo-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  5 min (~375m)
                </span>
                <span className="font-mono text-xs font-semibold text-on-surface">
                  {iso5?.facilitiesCount ?? 0} {t('walkscore.servicesCount')}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t('walkscore.immediateCatchment')}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-outline pt-1 border-t border-outline-variant/40">
                <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3 text-rose-400" />{iso5?.facilitiesBreakdown?.healthcare ?? 0}</span>
                <span className="flex items-center gap-1"><Train className="w-3 h-3 text-amber-400" />{iso5?.facilitiesBreakdown?.transit ?? 0}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-sky-400" />{iso5?.facilitiesBreakdown?.education ?? 0}</span>
                <span className="flex items-center gap-1"><Trees className="w-3 h-3 text-emerald-400" />{iso5?.facilitiesBreakdown?.park ?? 0}</span>
              </div>
            </div>

            {/* Ring 10 min */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-emerald-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  10 min (~750m)
                </span>
                <span className="font-mono text-xs font-semibold text-on-surface">
                  {iso10?.facilitiesCount ?? 0} {t('walkscore.servicesCount')}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t('walkscore.neighborhoodCatchment')}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-outline pt-1 border-t border-outline-variant/40">
                <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3 text-rose-400" />{iso10?.facilitiesBreakdown?.healthcare ?? 0}</span>
                <span className="flex items-center gap-1"><Train className="w-3 h-3 text-amber-400" />{iso10?.facilitiesBreakdown?.transit ?? 0}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-sky-400" />{iso10?.facilitiesBreakdown?.education ?? 0}</span>
                <span className="flex items-center gap-1"><Trees className="w-3 h-3 text-emerald-400" />{iso10?.facilitiesBreakdown?.park ?? 0}</span>
              </div>
            </div>

            {/* Ring 15 min */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-blue-500/30 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  15 min (~1.125m)
                </span>
                <span className="font-mono text-xs font-semibold text-on-surface">
                  {iso15?.facilitiesCount ?? connectivity?.facilitiesWithin15MinCount ?? 0} {t('walkscore.servicesCount')}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-tight">
                {t('walkscore.fifteenMinCatchment')}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-outline pt-1 border-t border-outline-variant/40">
                <span className="flex items-center gap-1"><HeartPulse className="w-3 h-3 text-rose-400" />{iso15?.facilitiesBreakdown?.healthcare ?? 0}</span>
                <span className="flex items-center gap-1"><Train className="w-3 h-3 text-amber-400" />{iso15?.facilitiesBreakdown?.transit ?? 0}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3 text-sky-400" />{iso15?.facilitiesBreakdown?.education ?? 0}</span>
                <span className="flex items-center gap-1"><Trees className="w-3 h-3 text-emerald-400" />{iso15?.facilitiesBreakdown?.park ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Nearest Key Landmark Facilities */}
          {conn && (
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                Equipamientos Clave Más Próximos
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* CAP Healthcare */}
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg flex flex-col justify-between space-y-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-outline uppercase">
                      <div className="flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{t('bento.facilityHealthcare')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-primary font-bold">
                        {conn.nearestHealthcare ? `${Math.round(conn.nearestHealthcare.distanceMeters)}m · ~${Math.round(conn.nearestHealthcare.walkTimeMinutes)} min` : '—'}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestHealthcare?.name || 'No detectado en radio próximo'}>
                      {conn.nearestHealthcare?.name || 'No detectado en radio próximo'}
                    </span>
                  </div>
                </div>

                {/* Education */}
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg flex flex-col justify-between space-y-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-outline uppercase">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span>{t('bento.facilityEducation')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-secondary font-bold">
                        {conn.nearestEducation ? `${Math.round(conn.nearestEducation.distanceMeters)}m · ~${Math.round(conn.nearestEducation.walkTimeMinutes)} min` : '—'}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestEducation?.name || 'No detectado en radio próximo'}>
                      {conn.nearestEducation?.name || 'No detectado en radio próximo'}
                    </span>
                  </div>
                </div>

                {/* Transit */}
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg flex flex-col justify-between space-y-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-outline uppercase">
                      <div className="flex items-center gap-1">
                        <Train className="w-3.5 h-3.5 text-tertiary shrink-0" />
                        <span>{t('bento.facilityTransit')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-tertiary font-bold">
                        {conn.nearestTransit ? `${Math.round(conn.nearestTransit.distanceMeters)}m · ~${Math.round(conn.nearestTransit.walkTimeMinutes)} min` : '—'}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestTransit?.name || 'No detectado en radio próximo'}>
                      {conn.nearestTransit?.name || 'No detectado en radio próximo'}
                    </span>
                  </div>
                </div>

                {/* Greenery Park */}
                <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg flex flex-col justify-between space-y-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-outline uppercase">
                      <div className="flex items-center gap-1">
                        <Trees className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{t('bento.facilityPark')}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {conn.nearestPark ? `${Math.round(conn.nearestPark.distanceMeters)}m · ~${Math.round(conn.nearestPark.walkTimeMinutes)} min` : '—'}
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestPark?.name || 'Zona ajardinada de manzana'}>
                      {conn.nearestPark?.name || 'Zona ajardinada de manzana'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Footnote & Explicit Parametric Disclosure */}
          <div className="space-y-1 pt-1 border-t border-outline-variant/60 text-[10px] font-mono text-outline">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" />
                <span>{t('walkscore.tortuosityLabel')}</span>
              </span>
              <span className="text-secondary font-semibold">
                {t('walkscore.pedestrianSpeed')}
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant">{t('transit.parametricWalkNotice')}</p>
          </div>
        </div>
      </div>

      {/* Panel 2: GTFS Public Transit Accessibility */}
      <div
        role="tabpanel"
        aria-labelledby={transitTabId}
        data-testid="connectivity-panel-transit"
        hidden={activeMode !== 'transit'}
      >
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <LayerStatusBadge info={transitLayer} showOk />
              <span
                data-testid="transit-resolution-badge"
                className="px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant text-[10px] font-mono text-on-surface-variant"
              >
                {t('transit.resolutionBadge')}
              </span>
            </div>
          </div>

          {isPartialCoverage && transit && (
            <div
              data-testid="transit-partial-coverage-banner"
              className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 space-y-1.5"
            >
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{t('transit.partialCoverageWarning', { pct: transit.coveragePct })}</span>
              </div>
              <div className="text-[11px] font-mono text-amber-200/90 space-y-0.5">
                {transit.coveredOperators.length > 0 && (
                  <div>
                    {t('transit.coveredOperatorsLabel')}: {transit.coveredOperators.join(', ')}
                  </div>
                )}
                {transit.missingOperators.length > 0 && (
                  <div>
                    {t('transit.missingOperatorsLabel')}: {transit.missingOperators.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {(!transit || transit.coveragePct === 0 || transitLayer?.status === 'unavailable') ? (
            <div className="space-y-2">
              <DataUnavailableState info={transitLayer} fallbackSource="MITMS NAP GTFS Transporte" />
              {transitLayer?.status !== 'unavailable' && (
                <p className="text-[11px] font-mono text-on-surface-variant px-1">
                  {t('transit.zeroCoverageDetail', { pct: coveragePctValue })}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-[10px] font-mono text-outline block">
                    {t('transit.stops5Min')}
                  </span>
                  <span className="font-mono text-base font-bold text-primary">
                    {transit.stopsWithin5Min}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant ml-1">
                    {t('transit.stopsUnit')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-[10px] font-mono text-outline block">
                    {t('transit.stops10Min')}
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    {transit.stopsWithin10Min}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant ml-1">
                    {t('transit.stopsUnit')}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-[10px] font-mono text-outline block">
                    {t('transit.stops15Min')}
                  </span>
                  <span className="font-mono text-base font-bold text-sky-400">
                    {transit.stopsWithin15Min}
                  </span>
                  <span className="text-[10px] font-mono text-on-surface-variant ml-1">
                    {t('transit.stopsUnit')}
                  </span>
                </div>
              </div>

              {(typeof transit.peakHeadwayMin === 'number' ||
                typeof transit.offPeakHeadwayMin === 'number') && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  {typeof transit.peakHeadwayMin === 'number' && (
                    <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant text-on-surface flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-primary" />
                      <span>
                        {t('transit.peakHeadway')}: {transit.peakHeadwayMin} {t('transit.minutesShort')}
                      </span>
                    </span>
                  )}
                  {typeof transit.offPeakHeadwayMin === 'number' && (
                    <span className="px-2.5 py-1 rounded bg-surface-container-low border border-outline-variant text-on-surface-variant">
                      {t('transit.offPeakHeadway')}: {transit.offPeakHeadwayMin} {t('transit.minutesShort')}
                    </span>
                  )}
                </div>
              )}

              {transit.nearestStops.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                    {t('transit.nearestStopsTitle')}
                  </div>
                  <ul className="space-y-1.5">
                    {transit.nearestStops.map((stop) => (
                      <li
                        key={stop.stopId}
                        className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {renderModeIcon(stop.mode)}
                          <div className="min-w-0">
                            <div className="font-semibold text-on-surface truncate">
                              {stop.name}
                            </div>
                            <div className="text-[10px] font-mono text-on-surface-variant">
                              {t(`transit.modes.${stop.mode}`)} · {t('transit.routesCount', { count: stop.routesCount })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-mono text-[11px] text-primary shrink-0">
                          {t('transit.walkLegShort', {
                            min: Math.round(stop.walkTimeMinutes),
                            meters: Math.round(stop.distanceMeters),
                          })}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {transit.travelTimesToHubs.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono text-outline uppercase tracking-wider font-semibold">
                    {t('transit.hubTravelTimesTitle')}
                  </div>
                  <ul className="space-y-1.5">
                    {transit.travelTimesToHubs.map((hub) => (
                      <li
                        key={`${hub.hubName}-${hub.originStopName}`}
                        className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-on-surface truncate">
                            {hub.hubName} {hub.lineName ? `(${hub.lineName})` : ''}
                          </div>
                          <div className="text-[10px] font-mono text-on-surface-variant">
                            {t('transit.hubBreakdown', {
                              walk: hub.walkMinutes,
                              wait: hub.waitMinutes,
                              ride: hub.inVehicleMinutes,
                            })}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary shrink-0">
                          ~{hub.totalMinutes} {t('transit.minutesShort')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[10px] font-mono text-outline pt-1 border-t border-outline-variant/60 leading-relaxed">
                {t('transit.parametricFootnote')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

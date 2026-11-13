import React from 'react';
import { PedestrianIsochrones, CivicConnectivityData } from '@openbarrio/core';
import { Clock, HeartPulse, GraduationCap, Train, Trees, Compass } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface PedestrianIsochronesCardProps {
  isochrones?: PedestrianIsochrones;
  connectivity?: CivicConnectivityData;
}

export const PedestrianIsochronesCard: React.FC<PedestrianIsochronesCardProps> = ({
  isochrones,
  connectivity,
}) => {
  const { t } = useTranslation();
  if (!isochrones && !connectivity) return null;

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

      {/* Model Footnote & Tortuosity Factor 1.25x */}
      <div className="flex items-center justify-between pt-1 border-t border-outline-variant/60 text-[10px] font-mono text-outline">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-primary" />
          <span>{t('walkscore.tortuosityLabel')}</span>
        </span>
        <span className="text-secondary font-semibold">
          {t('walkscore.pedestrianSpeed')}
        </span>
      </div>
    </div>
  );
};

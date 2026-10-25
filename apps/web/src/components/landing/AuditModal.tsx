import React from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  BarChart3,
  Volume2,
  Scale,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useTranslation } from '../../i18n';

export interface AuditData {
  query: string;
  refcat: string;
  address: string;
  score: number;
  yearBuilt: number;
  surfaceM2: number;
  cadastralUsage: string;
  householdIncome: number;
  incomePercentile: number;
  noiseLden: number;
  noiseLevel: string;
  floodRisk: string;
  rentMinM2: number;
  rentMaxM2: number;
  isStressedZone: boolean;
  coordinates?: { lat: number; lon: number };
  isLive?: boolean;
  isLoading?: boolean;
}

interface AuditModalProps {
  data: AuditData | null;
  onClose: () => void;
  onOpenMap?: (audit: AuditData, targetTab?: 'map' | 'dossier') => void;
  onOpenUnitPicker?: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  data,
  onClose,
  onOpenMap,
  onOpenUnitPicker,
}) => {
  const { t } = useTranslation();

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-primary bg-primary/10 border-primary/40';
    if (score >= 50) return 'text-secondary bg-secondary-container/20 border-secondary/40';
    return 'text-error bg-error-container/20 border-error/40';
  };

  const getCatastroUrl = (rc: string): string => {
    const sanitized = rc.replace(/[^A-Za-z0-9]/g, '');
    const url = new URL('https://www1.sedecatastro.gob.es/CYCBienInmueble/OVCListaBienes.aspx');
    url.searchParams.set('rc1', sanitized.slice(0, 7));
    url.searchParams.set('rc2', sanitized.slice(7, 14));
    return url.toString();
  };

  const getScoreRatingText = (score: number) => {
    if (score >= 75) return t('auditPreview.scoreRatingHigh');
    if (score >= 50) return t('auditPreview.scoreRatingMedium');
    return t('auditPreview.scoreRatingLow');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-surface-container border border-outline-variant rounded-xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          aria-label={t('auditPreview.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3 mb-6 pr-8">
          <div className="w-10 h-10 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold text-on-surface">
                {t('auditPreview.title')}
              </span>
              {data.isLoading ? (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[10px] font-semibold flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Consultando...</span>
                </span>
              ) : data.isLive ? (
                <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-mono text-[10px] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {t('auditPreview.badgeVerified')}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-mono text-[10px] font-semibold flex items-center gap-1 border border-secondary/30">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Modo Offline</span>
                </span>
              )}
            </div>
            <p className="font-body text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{data.address}</span>
            </p>
            <p className="font-mono text-[11px] text-outline mt-0.5">
              Ref: {data.refcat}
            </p>
          </div>
        </div>

        {data.isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-9 h-9 text-primary animate-spin" />
            <div className="text-center max-w-md">
              <p className="font-headline text-base font-semibold text-on-surface">
                Consultando fuentes oficiales en tiempo real...
              </p>
              <p className="font-body text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Conectando con la Sede Electrónica del Catastro (OVC), Instituto Nacional de Estadística (ADRH) y cartografía ambiental MITECO.
              </p>
            </div>
            <div className="w-full space-y-3 mt-4">
              <div className="h-14 bg-surface-container-high/60 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-28 bg-surface-container-high/60 rounded-lg animate-pulse" />
                <div className="h-28 bg-surface-container-high/60 rounded-lg animate-pulse" />
                <div className="h-28 bg-surface-container-high/60 rounded-lg animate-pulse" />
                <div className="h-28 bg-surface-container-high/60 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Barrio Score Banner */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-xs text-outline uppercase tracking-wider block">
                  {t('auditPreview.civicIndex')}
                </span>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  {getScoreRatingText(data.score)}
                </p>
              </div>
              <div
                className={`px-3 py-1.5 rounded-lg border font-headline text-2xl font-bold ${getScoreColor(
                  data.score
                )}`}
              >
                {data.score}/100
              </div>
            </div>

            {/* Horizontal Division Units Banner */}
            {onOpenUnitPicker && Boolean(data.unitsCount && data.unitsCount > 1) && (
              <div className="mb-4 p-3 rounded-lg bg-surface-container-high border border-primary/40 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 border border-primary/30">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline text-xs font-bold text-on-surface truncate">
                      División Horizontal e Inmuebles
                    </p>
                    <p className="font-body text-[11px] text-on-surface-variant truncate">
                      Audita tu piso o local específico con sus m² privativos
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenUnitPicker();
                  }}
                  className="px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container font-headline text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <span>Ver inmuebles ▾</span>
                </button>
              </div>
            )}

            {/* 4 Pillars Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Pillar 1: Catastro */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-semibold text-on-surface">
                    {t('auditPreview.pillarCatastro')}
                  </span>
                </div>
                <div className="space-y-1 font-body text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>{t('auditPreview.yearBuilt')}:</span>
                    <strong className="text-on-surface font-mono">{data.yearBuilt}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('auditPreview.constructedArea')}:</span>
                    <strong className="text-on-surface font-mono">{data.surfaceM2} m²</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('auditPreview.cadastralUsage')}:</span>
                    <strong className="text-on-surface">{data.cadastralUsage}</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 2: INE */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-tertiary" />
                  <span className="font-headline text-xs font-semibold text-on-surface">
                    {t('auditPreview.pillarIne')}
                  </span>
                </div>
                <div className="space-y-1 font-body text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>{t('auditPreview.householdIncome')}:</span>
                    <strong className="text-on-surface font-mono">
                      {data.householdIncome.toLocaleString('es-ES')} €
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('auditPreview.incomePercentile')}:</span>
                    <strong className="text-tertiary font-mono">{data.incomePercentile}%</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Ruido & SNCZI */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-secondary" />
                  <span className="font-headline text-xs font-semibold text-on-surface">
                    {t('auditPreview.pillarAcoustic')}
                  </span>
                </div>
                <div className="space-y-1 font-body text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>{t('auditPreview.noiseLevel')}:</span>
                    <strong className="text-secondary font-mono">{data.noiseLden} dB(A) ({data.noiseLevel})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('auditPreview.floodRisk')}:</span>
                    <strong className="text-primary">{data.floodRisk}</strong>
                  </div>
                </div>
              </div>

              {/* Pillar 4: SERPAVI */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="font-headline text-xs font-semibold text-on-surface">
                    {t('auditPreview.pillarRental')}
                  </span>
                </div>
                <div className="space-y-1 font-body text-xs text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>{t('auditPreview.stressedZone')}:</span>
                    <strong
                      className={`flex items-center gap-1 font-semibold ${
                        data.isStressedZone ? 'text-secondary' : 'text-primary'
                      }`}
                    >
                      {data.isStressedZone ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {t('auditPreview.isStressedYes')}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t('auditPreview.isStressedNo')}
                        </>
                      )}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('auditPreview.rentalIndex')}:</span>
                    <strong className="text-on-surface font-mono">
                      {data.rentMinM2} - {data.rentMaxM2} €/m²
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Upstream Direct Links */}
            <div className="pt-4 border-t border-outline-variant mb-6 flex flex-wrap items-center justify-between gap-3 font-body text-xs text-on-surface-variant">
              <span className="font-mono text-outline">{t('auditPreview.sourceLinks')}:</span>
              <div className="flex items-center gap-3">
                <a
                  href={getCatastroUrl(data.refcat)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  <span>Catastro OVC</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.ine.es/experimental/atlas/atlas.htm"
                  target="_blank"
                  rel="noreferrer"
                  className="text-tertiary hover:underline flex items-center gap-1"
                >
                  <span>INE ADRH</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded bg-surface-container-high border border-outline-variant hover:border-outline text-on-surface font-body text-xs font-medium transition-colors cursor-pointer"
          >
            {t('auditPreview.close')}
          </button>
          <button
            type="button"
            disabled={data.isLoading}
            onClick={() => {
              const current = data;
              onClose();
              if (onOpenMap && current) onOpenMap(current, 'dossier');
            }}
            className={`w-full sm:w-auto px-3.5 py-2 rounded bg-surface-container-high border border-primary/40 text-primary font-body text-xs font-semibold hover:bg-surface-variant transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
              data.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ver Dossier</span>
          </button>
          <button
            type="button"
            disabled={data.isLoading}
            onClick={() => {
              const current = data;
              onClose();
              if (onOpenMap && current) onOpenMap(current, 'map');
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded bg-primary text-on-primary font-body text-xs font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
              data.isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {data.isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5" />
                <span>{t('auditPreview.openInMap')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

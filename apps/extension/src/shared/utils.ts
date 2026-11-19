import {
  isLayerUsable,
  type FloodRiskData,
  type LayerStatusInfo,
  type NoiseData,
  type TrafficLightState,
} from '@openbarrio/core';
import {
  detectExtensionLanguage,
  formatExtMessage,
  getExtensionTranslations,
  type ExtensionLanguage,
} from './i18n.js';

export interface ScoreStyle {
  score: number;
  level: 'green' | 'amber' | 'red' | 'gray';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeLabel: string;
}

export function getScoreStyle(
  score: number,
  trafficLightState?: TrafficLightState,
  lang?: ExtensionLanguage
): ScoreStyle {
  const dict = getExtensionTranslations(lang);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  if (trafficLightState === 'UNCERTAIN') {
    return {
      score: clamped,
      level: 'gray',
      color: '#64748b',
      bgColor: '#f1f5f9',
      borderColor: '#cbd5e1',
      textColor: '#334155',
      badgeLabel: dict.scoreBadgeUncertain,
    };
  }

  if (trafficLightState === 'RED' || (!trafficLightState && clamped < 50)) {
    return {
      score: clamped,
      level: 'red',
      color: '#dc2626', // Red 600
      bgColor: '#fef2f2', // Red 50
      borderColor: '#fecaca', // Red 200
      textColor: '#991b1b', // Red 800
      badgeLabel: dict.scoreBadgeRed,
    };
  }

  if (trafficLightState === 'AMBER' || (!trafficLightState && clamped < 70)) {
    return {
      score: clamped,
      level: 'amber',
      color: '#d97706', // Amber 600
      bgColor: '#fffbeb', // Amber 50
      borderColor: '#fde68a', // Amber 200
      textColor: '#92400e', // Amber 800
      badgeLabel: dict.scoreBadgeAmber,
    };
  }

  return {
    score: clamped,
    level: 'green',
    color: '#16a34a', // Emerald 600
    bgColor: '#ecfdf5', // Emerald 50
    borderColor: '#a7f3d0', // Emerald 200
    textColor: '#065f46', // Emerald 800
    badgeLabel: dict.scoreBadgeGreen,
  };
}

export function formatNoiseLabel(
  category: string,
  dba: number,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  const catNames: Record<string, string> = {
    QUIET: dict.noiseQuiet,
    MODERATE: dict.noiseModerate,
    NOISY: dict.noiseNoisy,
    VERY_NOISY: dict.noiseVeryNoisy,
  };
  const categoryText = catNames[category] || category;
  return `${Math.round(dba)} dBA · ${categoryText}`;
}

export function formatNoiseDisplay(
  noise?: NoiseData,
  layerInfo?: LayerStatusInfo,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  if (layerInfo?.status === 'out_of_coverage') {
    return dict.sourceOutOfCoverage;
  }
  if (!noise || (layerInfo && !isLayerUsable(layerInfo.status))) {
    return dict.sourceUnavailable;
  }
  const base = formatNoiseLabel(noise.category, noise.dayEveningNightDecibels, lang);
  if (layerInfo?.status === 'stale' && layerInfo.verifiedAt) {
    return `${base} · ${formatExtDateShort(layerInfo.verifiedAt, lang)}`;
  }
  return base;
}

export function formatFloodRiskLabel(
  level: string,
  isInPreferentialZone: boolean,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  if (isInPreferentialZone) {
    return dict.floodPreferential;
  }
  const levelNames: Record<string, string> = {
    NONE: dict.floodNone,
    LOW: dict.floodLow,
    MEDIUM: dict.floodMedium,
    HIGH: dict.floodHigh,
  };
  return levelNames[level] || level;
}

export function formatFloodDisplay(
  floodRisk?: FloodRiskData,
  layerInfo?: LayerStatusInfo,
  lang?: ExtensionLanguage
): string {
  const dict = getExtensionTranslations(lang);
  if (layerInfo?.status === 'out_of_coverage') {
    return dict.sourceOutOfCoverage;
  }
  if (!floodRisk || (layerInfo && !isLayerUsable(layerInfo.status))) {
    return dict.sourceUnavailable;
  }
  const base = formatFloodRiskLabel(
    floodRisk.level,
    floodRisk.isInPreferentialFlowZone,
    lang
  );
  if (layerInfo?.status === 'stale' && layerInfo.verifiedAt) {
    return `${base} · ${formatExtDateShort(layerInfo.verifiedAt, lang)}`;
  }
  return base;
}

export function formatExtDateShort(iso: string, lang?: ExtensionLanguage): string {
  const dict = getExtensionTranslations(lang);
  const resolvedLang = detectExtensionLanguage(lang);
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return formatExtMessage(dict.staleVerified, { date: iso });
  }
  try {
    const formatted = d.toLocaleDateString(resolvedLang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    return formatExtMessage(dict.staleVerified, { date: formatted });
  } catch {
    return formatExtMessage(dict.staleVerified, { date: iso.slice(0, 10) });
  }
}

export function buildWebDossierUrl(
  webBaseUrl: string,
  cadastralReference?: string,
  coordinates?: { latitude: number; longitude: number }
): string {
  const base = webBaseUrl.replace(/\/+$/, '');
  if (cadastralReference) {
    return `${base}/audit?refcat=${encodeURIComponent(cadastralReference)}`;
  }
  if (coordinates) {
    return `${base}/audit?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  }
  return base;
}

/**
 * Escapes unsafe characters to prevent Cross-Site Scripting (XSS / DOM XSS).
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strictly validates URL protocols to allow only http://, https://, or safe root-relative paths.
 * Blocks javascript:, data:, vbscript:, protocol-relative //, or other XSS vectors.
 */
export function sanitizeUrl(url: string, fallback = '#'): string {
  const trimmed = (url || '').trim();
  if (/^https?:\/\//i.test(trimmed) || /^\/(?!\/)/.test(trimmed)) {
    return trimmed;
  }
  return fallback;
}

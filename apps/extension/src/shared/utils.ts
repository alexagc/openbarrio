export interface ScoreStyle {
  score: number;
  level: 'green' | 'amber' | 'red';
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeLabel: string;
}

export function getScoreStyle(score: number): ScoreStyle {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped >= 70) {
    return {
      score: clamped,
      level: 'green',
      color: '#16a34a', // Emerald 600
      bgColor: '#ecfdf5', // Emerald 50
      borderColor: '#a7f3d0', // Emerald 200
      textColor: '#065f46', // Emerald 800
      badgeLabel: 'Favorable',
    };
  }
  if (clamped >= 50) {
    return {
      score: clamped,
      level: 'amber',
      color: '#d97706', // Amber 600
      bgColor: '#fffbeb', // Amber 50
      borderColor: '#fde68a', // Amber 200
      textColor: '#92400e', // Amber 800
      badgeLabel: 'Moderado',
    };
  }
  return {
    score: clamped,
    level: 'red',
    color: '#dc2626', // Red 600
    bgColor: '#fef2f2', // Red 50
    borderColor: '#fecaca', // Red 200
    textColor: '#991b1b', // Red 800
    badgeLabel: 'Atención',
  };
}

export function formatNoiseLabel(category: string, dba: number): string {
  const catNames: Record<string, string> = {
    QUIET: 'Silencioso',
    MODERATE: 'Moderado',
    NOISY: 'Ruidoso',
    VERY_NOISY: 'Muy ruidoso',
  };
  const categoryText = catNames[category] || category;
  return `${Math.round(dba)} dBA · ${categoryText}`;
}

export function formatFloodRiskLabel(
  level: string,
  isInPreferentialZone: boolean
): string {
  if (isInPreferentialZone) {
    return 'Flujo Preferente (Alerta)';
  }
  const levelNames: Record<string, string> = {
    NONE: 'Sin riesgo',
    LOW: 'Riesgo bajo (T=500)',
    MEDIUM: 'Riesgo medio (T=100)',
    HIGH: 'Riesgo alto (T=10)',
  };
  return levelNames[level] || level;
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

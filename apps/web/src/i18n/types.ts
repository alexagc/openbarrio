export type SupportedLanguage = 'es' | 'en' | 'ca';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'es', label: 'Español', shortLabel: 'ES' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'ca', label: 'Català', shortLabel: 'CA' },
];

export interface TranslationSchema {
  nav: {
    brandSubtitle: string;
    officialSources: string;
    extension: string;
    principles: string;
    github: string;
    version: string;
    openMap: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    tabAddress: string;
    tabRefcat: string;
    spatialRef: string;
    placeholderAddress: string;
    placeholderRefcat: string;
    auditButton: string;
    auditedExamples: string;
    example1: string;
    example2: string;
    example2Badge: string;
    example3: string;
    statIne: string;
    statIneLabel: string;
    statCatastro: string;
    statCatastroLabel: string;
    statOpenSource: string;
    statOpenSourceLabel: string;
  };
  pillars: {
    tag: string;
    title: string;
    subtitle: string;
    catastro: {
      badge: string;
      title: string;
      agency: string;
      desc: string;
      layer: string;
      protocol: string;
    };
    ine: {
      badge: string;
      title: string;
      agency: string;
      desc: string;
      layer: string;
      protocol: string;
    };
    environmental: {
      badge: string;
      title: string;
      agency: string;
      desc: string;
      layer: string;
      protocol: string;
    };
    serpavi: {
      badge: string;
      title: string;
      agency: string;
      desc: string;
      layer: string;
      protocol: string;
    };
  };
  extension: {
    tag: string;
    title: string;
    desc: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    ctaButton: string;
    securityBadge: string;
    mockPortal: string;
    mockListingTitle: string;
    mockPrice: string;
    mockListingSpecs: string;
    mockListingQuote: string;
    widgetTitle: string;
    widgetVerified: string;
    widgetRefcat: string;
    widgetCivicScore: string;
    widgetRealSurface: string;
    widgetRealSurfaceVal: string;
    widgetRealSurfaceDiff: string;
    widgetYear: string;
    widgetYearVal: string;
    widgetYearSub: string;
    widgetNoise: string;
    widgetNoiseVal: string;
    widgetNoiseSub: string;
    widgetIncome: string;
    widgetIncomeVal: string;
    widgetIncomeSub: string;
    widgetStressedWarning: string;
    widgetFloodSafety: string;
  };
  principles: {
    tag: string;
    title: string;
    desc: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
    stat1Val: string;
    stat1Label: string;
    stat2Val: string;
    stat2Label: string;
    stat3Val: string;
    stat3Label: string;
  };
  mapCta: {
    tag: string;
    title: string;
    desc: string;
    button: string;
  };
  auditPreview: {
    title: string;
    badgeVerified: string;
    close: string;
    civicIndex: string;
    scoreRatingHigh: string;
    scoreRatingMedium: string;
    scoreRatingLow: string;
    pillarCatastro: string;
    pillarIne: string;
    pillarAcoustic: string;
    pillarRental: string;
    yearBuilt: string;
    constructedArea: string;
    cadastralUsage: string;
    householdIncome: string;
    incomePercentile: string;
    noiseLevel: string;
    floodRisk: string;
    rentalIndex: string;
    stressedZone: string;
    isStressedYes: string;
    isStressedNo: string;
    sourceLinks: string;
    openInMap: string;
    downloadReport: string;
  };
  footer: {
    desc: string;
    badgeAporta: string;
    badgeDatosGob: string;
    colSources: string;
    colTools: string;
    colCommunity: string;
    copyright: string;
    spatialCoord: string;
    updateFrequency: string;
    linkCatastro: string;
    linkIne: string;
    linkSica: string;
    linkSnczi: string;
    linkMivau: string;
    linkMap: string;
    linkExtension: string;
    linkPdf: string;
    linkApi: string;
    linkRaw: string;
    linkGithub: string;
    linkMatrix: string;
    linkMethodology: string;
    linkLicense: string;
    linkTransparency: string;
  };
}

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  availableLanguages: LanguageInfo[];
}

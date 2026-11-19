export type ExtensionLanguage = 'es' | 'en' | 'ca' | 'gl' | 'eu';

export interface ExtensionTranslations {
  officialPublic: string;
  loadingPrompt: string;
  radarAriaLabel: string;
  radarTitle: string;
  scoreBadgeGreen: string;
  scoreBadgeAmber: string;
  scoreBadgeRed: string;
  scoreBadgeUncertain: string;
  uncertainDesc: string;
  criticalRiskNotEvaluated: string;
  coverageLabel: string;
  staleVerified: string;
  noiseQuiet: string;
  noiseModerate: string;
  noiseNoisy: string;
  noiseVeryNoisy: string;
  floodPreferential: string;
  floodNone: string;
  floodLow: string;
  floodMedium: string;
  floodHigh: string;
  sourceUnavailable: string;
  sourceOutOfCoverage: string;
  notAvailableShort: string;
  buildingCardUnits: string;
  substandardTitle: string;
  substandardDetailPrefix: string;
  substandardDetailMiddle: string;
  substandardDetailSuffix: string;
  substandardFallbackUse: string;
  stressedTitle: string;
  stressedMaxPrefix: string;
  stressedApprox: string;
  perMonth: string;
  walkScoreLabel: string;
  noHealthCenter: string;
  noTransit: string;
  noPark: string;
  ceeOfficial: string;
  ceeEstimated: string;
  ceeExpired: string;
  discrepancyTitle: string;
  discrepancyAdvertised: string;
  discrepancyVs: string;
  discrepancyNote: string;
  itpEstimated: string;
  ibiEstimated: string;
  perYear: string;
  iteFavorable: string;
  iteUnfavorable: string;
  itePending: string;
  iteValid: string;
  iteRemediation: string;
  iteConservation: string;
  iteYearPrefix: string;
  typologyPlot: string;
  typologyIndustrial: string;
  typologyRustic: string;
  typologyCommercial: string;
  typologyEquipment: string;
  typologyOfficial: string;
  fieldConstruction: string;
  fieldTypology: string;
  fieldUse: string;
  fieldMeanIncome: string;
  fieldAcoustics: string;
  fieldFlood: string;
  fieldRefcat: string;
  incomePercentileTop: string;
  collapseTitle: string;
  closeTitle: string;
  expandTitle: string;
  viewFullAudit: string;
  errorFallback: string;
  searchManually: string;
}

const ES: ExtensionTranslations = {
  officialPublic: 'Público',
  loadingPrompt: 'Extrayendo datos oficiales de Catastro, INE y MITECO para {portal}...',
  radarAriaLabel: 'Mini Radar de 5 Ejes',
  radarTitle: 'Radar de 5 Ejes: Edificación, Conectividad, Ambiental, Socioeconómico y Urbanismo',
  scoreBadgeGreen: 'Favorable',
  scoreBadgeAmber: 'Moderado',
  scoreBadgeRed: 'Atención',
  scoreBadgeUncertain: 'Incierto',
  uncertainDesc: 'Datos insuficientes para emitir una calificación concluyente.',
  criticalRiskNotEvaluated: 'Riesgo ambiental crítico no evaluado (SICA/SNCZI sin cobertura o no disponible).',
  coverageLabel: 'Cobertura: {ok}/{total} pilares',
  staleVerified: 'Verificado el {date}',
  noiseQuiet: 'Silencioso',
  noiseModerate: 'Moderado',
  noiseNoisy: 'Ruidoso',
  noiseVeryNoisy: 'Muy ruidoso',
  floodPreferential: 'Flujo Preferente (Alerta)',
  floodNone: 'Sin riesgo',
  floodLow: 'Riesgo bajo (T=500)',
  floodMedium: 'Riesgo medio (T=100)',
  floodHigh: 'Riesgo alto (T=10)',
  sourceUnavailable: 'Fuente no disponible · Reintenta',
  sourceOutOfCoverage: 'Zona no cubierta por mapa oficial',
  notAvailableShort: 'N/D',
  buildingCardUnits: '🏢 Edificio ({count} inmuebles) · Ver unidades',
  substandardTitle: 'Presunto local comercial / Infravivienda',
  substandardDetailPrefix: 'Inmueble registrado en Catastro con uso ',
  substandardDetailMiddle: '',
  substandardDetailSuffix: '. Riesgo de carecer de cédula de habitabilidad o licencia de cambio de uso residencial.',
  substandardFallbackUse: 'Local / Almacén',
  stressedTitle: 'Zona Tensionada (Ley 12/2023)',
  stressedMaxPrefix: 'Alquiler máx. MIVAU:',
  stressedApprox: 'aprox.',
  perMonth: '€/mes',
  walkScoreLabel: '🚶 15-min WalkScore',
  noHealthCenter: '🏥 CAP N/D',
  noTransit: '🚇 Transporte N/D',
  noPark: '🌳 Parque N/D',
  ceeOfficial: 'Oficial',
  ceeEstimated: 'Est. CTE',
  ceeExpired: 'Caducado ⚠️',
  discrepancyTitle: 'Discrepancia de Superficie (+{pct}%)',
  discrepancyAdvertised: 'Anunciados',
  discrepancyVs: 'vs',
  discrepancyNote: 'en Catastro. Posible terraza cerrada o zonas comunes computadas como útiles.',
  itpEstimated: 'ITP Estimado ({rate}% {comm}):',
  ibiEstimated: 'IBI Anual Estimado:',
  perYear: 'año',
  iteFavorable: '✓ ITE/IEE Favorable',
  iteUnfavorable: '⚠ ITE Desfavorable (Defectos activos)',
  itePending: '⚠ IEE Pendiente >50 años (RD-L 7/2015)',
  iteValid: 'Vigente',
  iteRemediation: 'Subsanación obligatoria',
  iteConservation: 'Deber de conservación',
  iteYearPrefix: 'Año',
  typologyPlot: 'Solar Urbano',
  typologyIndustrial: 'Industrial',
  typologyRustic: 'Finca Rústica',
  typologyCommercial: 'Comercial',
  typologyEquipment: 'Equipamiento',
  typologyOfficial: 'Auditoría Oficial',
  fieldConstruction: 'Construcción',
  fieldTypology: 'Tipología',
  fieldUse: 'Uso',
  fieldMeanIncome: 'Renta Media',
  fieldAcoustics: 'Acústica (SICA)',
  fieldFlood: 'Inundación (SNCZI)',
  fieldRefcat: 'Ref. Catastral:',
  incomePercentileTop: 'Percentil de renta top {pct}%',
  collapseTitle: 'Minimizar',
  closeTitle: 'Cerrar',
  expandTitle: 'Expandir auditoría OpenBarrio',
  viewFullAudit: 'Ver Auditoría Completa en OpenBarrio Web ↗',
  errorFallback: 'No se pudieron sincronizar los datos de Catastro automáticamente para este anuncio.',
  searchManually: 'Buscar manualmente en OpenBarrio Web ↗',
};

const EN: ExtensionTranslations = {
  officialPublic: 'Public',
  loadingPrompt: 'Fetching official Cadastre, INE and MITECO data for {portal}...',
  radarAriaLabel: '5-Axis Mini Radar',
  radarTitle: '5-Axis Radar: Building, Connectivity, Environment, Socioeconomic & Urban Planning',
  scoreBadgeGreen: 'Favorable',
  scoreBadgeAmber: 'Moderate',
  scoreBadgeRed: 'Attention',
  scoreBadgeUncertain: 'Uncertain',
  uncertainDesc: 'Insufficient verified data to issue a conclusive score.',
  criticalRiskNotEvaluated: 'Critical environmental risk not evaluated (SICA/SNCZI unavailable or out of coverage).',
  coverageLabel: 'Coverage: {ok}/{total} pillars',
  staleVerified: 'Verified on {date}',
  noiseQuiet: 'Quiet',
  noiseModerate: 'Moderate',
  noiseNoisy: 'Noisy',
  noiseVeryNoisy: 'Very noisy',
  floodPreferential: 'Preferential Flow (Alert)',
  floodNone: 'No risk',
  floodLow: 'Low risk (T=500)',
  floodMedium: 'Medium risk (T=100)',
  floodHigh: 'High risk (T=10)',
  sourceUnavailable: 'Source unavailable · Retry',
  sourceOutOfCoverage: 'Outside official strategic map coverage',
  notAvailableShort: 'N/A',
  buildingCardUnits: '🏢 Building ({count} units) · View units',
  substandardTitle: 'Suspected commercial unit / Substandard housing',
  substandardDetailPrefix: 'Registered in Cadastre under use ',
  substandardDetailMiddle: '',
  substandardDetailSuffix: '. Risk of lacking habitability certificate or residential change-of-use permit.',
  substandardFallbackUse: 'Retail / Storage',
  stressedTitle: 'Stressed Rent Zone (Law 12/2023)',
  stressedMaxPrefix: 'MIVAU max rent cap:',
  stressedApprox: 'approx.',
  perMonth: '€/mo',
  walkScoreLabel: '🚶 15-min WalkScore',
  noHealthCenter: '🏥 Health N/A',
  noTransit: '🚇 Transit N/A',
  noPark: '🌳 Park N/A',
  ceeOfficial: 'Official',
  ceeEstimated: 'Est. CTE',
  ceeExpired: 'Expired ⚠️',
  discrepancyTitle: 'Surface Discrepancy (+{pct}%)',
  discrepancyAdvertised: 'Listed',
  discrepancyVs: 'vs',
  discrepancyNote: 'in Cadastre. Possible enclosed terrace or common areas counted as usable.',
  itpEstimated: 'Est. ITP ({rate}% {comm}):',
  ibiEstimated: 'Est. Annual IBI:',
  perYear: 'yr',
  iteFavorable: '✓ ITE/IEE Favorable',
  iteUnfavorable: '⚠ ITE Unfavorable (Active defects)',
  itePending: '⚠ IEE Pending >50 yrs (RD-L 7/2015)',
  iteValid: 'Valid',
  iteRemediation: 'Mandatory remediation',
  iteConservation: 'Duty of upkeep',
  iteYearPrefix: 'Year',
  typologyPlot: 'Urban Plot',
  typologyIndustrial: 'Industrial',
  typologyRustic: 'Rural Estate',
  typologyCommercial: 'Commercial',
  typologyEquipment: 'Public Facility',
  typologyOfficial: 'Official Audit',
  fieldConstruction: 'Construction',
  fieldTypology: 'Typology',
  fieldUse: 'Use',
  fieldMeanIncome: 'Mean Income',
  fieldAcoustics: 'Acoustics (SICA)',
  fieldFlood: 'Flood (SNCZI)',
  fieldRefcat: 'Cadastral Ref:',
  incomePercentileTop: 'Income percentile top {pct}%',
  collapseTitle: 'Minimize',
  closeTitle: 'Close',
  expandTitle: 'Expand OpenBarrio audit',
  viewFullAudit: 'View Full Audit on OpenBarrio Web ↗',
  errorFallback: 'Could not automatically synchronize Cadastre data for this listing.',
  searchManually: 'Search manually on OpenBarrio Web ↗',
};

const CA: ExtensionTranslations = {
  officialPublic: 'Públic',
  loadingPrompt: 'Extraint dades oficials del Cadastre, INE i MITECO per a {portal}...',
  radarAriaLabel: 'Mini Radar de 5 Eixos',
  radarTitle: 'Radar de 5 Eixos: Edificació, Connectivitat, Ambiental, Socioeconòmic i Urbanisme',
  scoreBadgeGreen: 'Favorable',
  scoreBadgeAmber: 'Moderat',
  scoreBadgeRed: 'Atenció',
  scoreBadgeUncertain: 'Incert',
  uncertainDesc: 'Dades insuficients per emetre una qualificació concloent.',
  criticalRiskNotEvaluated: 'Risc ambiental crític no avaluat (SICA/SNCZI sense cobertura o no disponible).',
  coverageLabel: 'Cobertura: {ok}/{total} pilars',
  staleVerified: 'Verificat el {date}',
  noiseQuiet: 'Silenciós',
  noiseModerate: 'Moderat',
  noiseNoisy: 'Sorollós',
  noiseVeryNoisy: 'Molt sorollós',
  floodPreferential: 'Flux Preferent (Alerta)',
  floodNone: 'Sense risc',
  floodLow: 'Risc baix (T=500)',
  floodMedium: 'Risc mitjà (T=100)',
  floodHigh: 'Risc alt (T=10)',
  sourceUnavailable: 'Font no disponible · Torna-ho a provar',
  sourceOutOfCoverage: 'Zona no coberta pel mapa oficial',
  notAvailableShort: 'N/D',
  buildingCardUnits: '🏢 Edifici ({count} immobles) · Veure unitats',
  substandardTitle: 'Presumpte local comercial / Infrahabitatge',
  substandardDetailPrefix: 'Immoble registrat al Cadastre amb ús ',
  substandardDetailMiddle: '',
  substandardDetailSuffix: '. Risc de no disposar de cèdula d’habitabilitat o llicència de canvi d’ús.',
  substandardFallbackUse: 'Local / Magatzem',
  stressedTitle: 'Zona Tensionada (Llei 12/2023)',
  stressedMaxPrefix: 'Lloguer màx. MIVAU:',
  stressedApprox: 'aprox.',
  perMonth: '€/mes',
  walkScoreLabel: '🚶 15-min WalkScore',
  noHealthCenter: '🏥 CAP N/D',
  noTransit: '🚇 Transport N/D',
  noPark: '🌳 Parc N/D',
  ceeOfficial: 'Oficial',
  ceeEstimated: 'Est. CTE',
  ceeExpired: 'Caducat ⚠️',
  discrepancyTitle: 'Discrepància de Superfície (+{pct}%)',
  discrepancyAdvertised: 'Anunciats',
  discrepancyVs: 'vs',
  discrepancyNote: 'al Cadastre. Possible terrassa tancada o zones comunes computades com a útils.',
  itpEstimated: 'ITP Estimat ({rate}% {comm}):',
  ibiEstimated: 'IBI Anual Estimat:',
  perYear: 'any',
  iteFavorable: '✓ ITE/IEE Favorable',
  iteUnfavorable: '⚠ ITE Desfavorable (Defectes actius)',
  itePending: '⚠ IEE Pendent >50 anys (RD-L 7/2015)',
  iteValid: 'Vigent',
  iteRemediation: 'Esmena obligatòria',
  iteConservation: 'Deure de conservació',
  iteYearPrefix: 'Any',
  typologyPlot: 'Solar Urbà',
  typologyIndustrial: 'Industrial',
  typologyRustic: 'Finca Rústica',
  typologyCommercial: 'Comercial',
  typologyEquipment: 'Equipament',
  typologyOfficial: 'Auditoria Oficial',
  fieldConstruction: 'Construcció',
  fieldTypology: 'Tipologia',
  fieldUse: 'Ús',
  fieldMeanIncome: 'Renda Mitjana',
  fieldAcoustics: 'Acústica (SICA)',
  fieldFlood: 'Inundació (SNCZI)',
  fieldRefcat: 'Ref. Cadastral:',
  incomePercentileTop: 'Percentil de renda top {pct}%',
  collapseTitle: 'Minimitzar',
  closeTitle: 'Tancar',
  expandTitle: 'Expandir auditoria OpenBarrio',
  viewFullAudit: 'Veure Auditoria Completa a OpenBarrio Web ↗',
  errorFallback: 'No s’han pogut sincronitzar automàticament les dades del Cadastre.',
  searchManually: 'Cercar manualment a OpenBarrio Web ↗',
};

const GL: ExtensionTranslations = {
  officialPublic: 'Público',
  loadingPrompt: 'Extrayendo datos oficiais de Catastro, INE e MITECO para {portal}...',
  radarAriaLabel: 'Mini Radar de 5 Eixes',
  radarTitle: 'Radar de 5 Eixes: Edificación, Conectividade, Ambiental, Socioeconómico e Urbanismo',
  scoreBadgeGreen: 'Favorable',
  scoreBadgeAmber: 'Moderado',
  scoreBadgeRed: 'Atención',
  scoreBadgeUncertain: 'Incerto',
  uncertainDesc: 'Datos insuficientes para emitir unha cualificación concluínte.',
  criticalRiskNotEvaluated: 'Risco ambiental crítico non avaliado (SICA/SNCZI sen cobertura ou non dispoñible).',
  coverageLabel: 'Cobertura: {ok}/{total} piares',
  staleVerified: 'Verificado o {date}',
  noiseQuiet: 'Silencioso',
  noiseModerate: 'Moderado',
  noiseNoisy: 'Ruidoso',
  noiseVeryNoisy: 'Moi ruidoso',
  floodPreferential: 'Fluxo Preferente (Alerta)',
  floodNone: 'Sen risco',
  floodLow: 'Risco baixo (T=500)',
  floodMedium: 'Risco medio (T=100)',
  floodHigh: 'Risco alto (T=10)',
  sourceUnavailable: 'Fonte non dispoñible · Téntao de novo',
  sourceOutOfCoverage: 'Zona non cuberta polo mapa oficial',
  notAvailableShort: 'N/D',
  buildingCardUnits: '🏢 Edificio ({count} inmobles) · Ver unidades',
  substandardTitle: 'Presunto local comercial / Infravivenda',
  substandardDetailPrefix: 'Inmoble rexistrado en Catastro con uso ',
  substandardDetailMiddle: '',
  substandardDetailSuffix: '. Risco de carecer de cédula de habitabilidade ou licenza de cambio de uso.',
  substandardFallbackUse: 'Local / Almacén',
  stressedTitle: 'Zona Tensionada (Lei 12/2023)',
  stressedMaxPrefix: 'Alugueiro máx. MIVAU:',
  stressedApprox: 'aprox.',
  perMonth: '€/mes',
  walkScoreLabel: '🚶 15-min WalkScore',
  noHealthCenter: '🏥 Centro Saúde N/D',
  noTransit: '🚇 Transporte N/D',
  noPark: '🌳 Parque N/D',
  ceeOfficial: 'Oficial',
  ceeEstimated: 'Est. CTE',
  ceeExpired: 'Caducado ⚠️',
  discrepancyTitle: 'Discrepancia de Superficie (+{pct}%)',
  discrepancyAdvertised: 'Anunciados',
  discrepancyVs: 'vs',
  discrepancyNote: 'en Catastro. Posible terraza pechada ou zonas comúns computadas como útiles.',
  itpEstimated: 'ITP Estimado ({rate}% {comm}):',
  ibiEstimated: 'IBI Anual Estimado:',
  perYear: 'ano',
  iteFavorable: '✓ ITE/IEE Favorable',
  iteUnfavorable: '⚠ ITE Desfavorable (Defectos activos)',
  itePending: '⚠ IEE Pendente >50 anos (RD-L 7/2015)',
  iteValid: 'Vixente',
  iteRemediation: 'Subsanación obrigatoria',
  iteConservation: 'Deber de conservación',
  iteYearPrefix: 'Ano',
  typologyPlot: 'Soar Urbano',
  typologyIndustrial: 'Industrial',
  typologyRustic: 'Finca Rústica',
  typologyCommercial: 'Comercial',
  typologyEquipment: 'Equipamento',
  typologyOfficial: 'Auditoría Oficial',
  fieldConstruction: 'Construción',
  fieldTypology: 'Tipoloxía',
  fieldUse: 'Uso',
  fieldMeanIncome: 'Renda Media',
  fieldAcoustics: 'Acústica (SICA)',
  fieldFlood: 'Inundación (SNCZI)',
  fieldRefcat: 'Ref. Catastral:',
  incomePercentileTop: 'Percentil de renda top {pct}%',
  collapseTitle: 'Minimizar',
  closeTitle: 'Pechar',
  expandTitle: 'Expandir auditoría OpenBarrio',
  viewFullAudit: 'Ver Auditoría Completa en OpenBarrio Web ↗',
  errorFallback: 'Non se puideron sincronizar automaticamente os datos de Catastro para este anuncio.',
  searchManually: 'Buscar manualmente en OpenBarrio Web ↗',
};

const EU: ExtensionTranslations = {
  officialPublic: 'Publikoa',
  loadingPrompt: 'Katastro, INE eta MITECO datu ofizialak eskuratzen {portal} atarirako...',
  radarAriaLabel: '5 Ardatzeko Mini Radarra',
  radarTitle: '5 Ardatzeko Radarra: Eraikuntza, Konektibitatea, Ingurumena, Sozioekonomia eta Hirigintza',
  scoreBadgeGreen: 'Egokia',
  scoreBadgeAmber: 'Ertaina',
  scoreBadgeRed: 'Arreta',
  scoreBadgeUncertain: 'Zalantzazkoa',
  uncertainDesc: 'Kalifikazio erabakigarria emateko datu nahikorik ez dago.',
  criticalRiskNotEvaluated: 'Ingurumen-arrisku kritikoa ebaluatu gabe (SICA/SNCZI estaldurarik gabe edo eskuragaitz).',
  coverageLabel: 'Estaldura: {ok}/{total} zutabe',
  staleVerified: 'Egiaztatua: {date}',
  noiseQuiet: 'Isila',
  noiseModerate: 'Ertaina',
  noiseNoisy: 'Zaratatsua',
  noiseVeryNoisy: 'Oso zaratatsua',
  floodPreferential: 'Lehentasunezko Fluxua (Alerta)',
  floodNone: 'Arriskurik gabe',
  floodLow: 'Arrisku baxua (T=500)',
  floodMedium: 'Arrisku ertaina (T=100)',
  floodHigh: 'Arrisku altua (T=10)',
  sourceUnavailable: 'Iturria ez dago erabilgarri · Saiatu berriro',
  sourceOutOfCoverage: 'Mapa ofizialak estaltzen ez duen eremua',
  notAvailableShort: 'E/D',
  buildingCardUnits: '🏢 Eraikina ({count} higiezin) · Ikusi unitateak',
  substandardTitle: 'Ustezko merkataritza-lokala / Infraetxebizitza',
  substandardDetailPrefix: 'Katastroan erabilera honekin erregistratutako higiezina: ',
  substandardDetailMiddle: '',
  substandardDetailSuffix: '. Bizigarritasun-zedularik edo erabilera-aldaketarako lizentziarik ez izateko arriskua.',
  substandardFallbackUse: 'Lokala / Biltegia',
  stressedTitle: 'Tentsionatutako Eremua (12/2023 Legea)',
  stressedMaxPrefix: 'MIVAU gehieneko alokairua:',
  stressedApprox: 'gutxi gorabehera',
  perMonth: '€/hil',
  walkScoreLabel: '🚶 15-min WalkScore',
  noHealthCenter: '🏥 Osasun Zentroa E/D',
  noTransit: '🚇 Garraioa E/D',
  noPark: '🌳 Parkea E/D',
  ceeOfficial: 'Ofiziala',
  ceeEstimated: 'CTE Est.',
  ceeExpired: 'Iraungia ⚠️',
  discrepancyTitle: 'Azalera Desadostasuna (+{pct}%)',
  discrepancyAdvertised: 'Iragarrita',
  discrepancyVs: 'vs',
  discrepancyNote: 'Katastroan. Baliteke terraza itxia edo gune komunak erabilgarritzat jotzea.',
  itpEstimated: 'ITP Estimatua ({rate}% {comm}):',
  ibiEstimated: 'Urteko IBI Estimatua:',
  perYear: 'urte',
  iteFavorable: '✓ ITE/IEE Aldekoa',
  iteUnfavorable: '⚠ ITE Aurkakoa (Akats aktiboak)',
  itePending: '⚠ IEE Zain >50 urte (7/2015 LED)',
  iteValid: 'Indarrean',
  iteRemediation: 'Nahitaezko konponketa',
  iteConservation: 'Kontserbazio-betebeharra',
  iteYearPrefix: 'Urtea',
  typologyPlot: 'Orube Hiritarra',
  typologyIndustrial: 'Industria',
  typologyRustic: 'Landa Finka',
  typologyCommercial: 'Merkataritza',
  typologyEquipment: 'Ekipamendua',
  typologyOfficial: 'Ikuskaritza Ofiziala',
  fieldConstruction: 'Eraikuntza',
  fieldTypology: 'Tipologia',
  fieldUse: 'Erabilera',
  fieldMeanIncome: 'Batez Besteko Errenta',
  fieldAcoustics: 'Akustika (SICA)',
  fieldFlood: 'Uholdea (SNCZI)',
  fieldRefcat: 'Katastro Erref.:',
  incomePercentileTop: 'Errenta pertzentila top {pct}%',
  collapseTitle: 'Minimizatu',
  closeTitle: 'Itxi',
  expandTitle: 'Zabaldu OpenBarrio ikuskaritza',
  viewFullAudit: 'Ikusi Ikuskaritza Osoa OpenBarrio Webean ↗',
  errorFallback: 'Ezin izan dira iragarki honen Katastro datuak automatikoki sinkronizatu.',
  searchManually: 'Bilatu eskuz OpenBarrio Webean ↗',
};

const DICTIONARIES: Record<ExtensionLanguage, ExtensionTranslations> = {
  es: ES,
  en: EN,
  ca: CA,
  gl: GL,
  eu: EU,
};

/**
 * Resolves the active extension UI language from document `<html lang>` or Chrome i18n API,
 * defaulting to Spanish (`es`) cleanly across headless DOM and portal contexts.
 */
export function detectExtensionLanguage(explicit?: ExtensionLanguage): ExtensionLanguage {
  if (explicit) return explicit;

  const docLang =
    typeof document !== 'undefined' ? document.documentElement?.lang?.trim().toLowerCase() : '';
  const uiLang =
    typeof chrome !== 'undefined' && chrome.i18n?.getUILanguage
      ? chrome.i18n.getUILanguage().trim().toLowerCase()
      : '';

  const candidate = docLang || uiLang;
  if (candidate.startsWith('en')) return 'en';
  if (candidate.startsWith('ca')) return 'ca';
  if (candidate.startsWith('gl')) return 'gl';
  if (candidate.startsWith('eu')) return 'eu';
  return 'es';
}

export function getExtensionTranslations(lang?: ExtensionLanguage): ExtensionTranslations {
  return DICTIONARIES[detectExtensionLanguage(lang)] || ES;
}

export function formatExtMessage(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template
  );
}

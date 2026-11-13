import { Type, Static } from '@sinclair/typebox';

export const SeismicRiskLevelSchema = Type.Union([
  Type.Literal('VERY_LOW'),
  Type.Literal('LOW'),
  Type.Literal('MEDIUM'),
  Type.Literal('HIGH'),
], { description: 'Categorized seismic risk level based on IGN NCSE-02 basic acceleration ab' });

export const NcseStandardAppliedSchema = Type.Union([
  Type.Literal('PRE_REGULATION'),
  Type.Literal('PGS_1'),
  Type.Literal('NCSE_94'),
  Type.Literal('NCSE_02'),
], { description: 'Historical Spanish seismic construction standard applied at construction year' });

export const SeismicHazardSchema = Type.Object({
  basicAccelerationG: Type.Number({ description: 'IGN NCSE-02 basic seismic acceleration ab in units of g' }),
  riskLevel: SeismicRiskLevelSchema,
  municipalityCode: Type.String({ description: '5-digit Spanish INE municipality code' }),
  municipalityName: Type.String({ description: 'Official Spanish municipality name' }),
  ncseStandardApplied: NcseStandardAppliedSchema,
  isVulnerableToSeismic: Type.Boolean({ description: 'True if constructionYear < 1994 and basicAccelerationG >= 0.08' }),
  regulatoryContext: Type.String({ description: 'Historical standard applicability and structural ductility analysis' }),
});

export type SeismicRiskLevel = Static<typeof SeismicRiskLevelSchema>;
export type NcseStandardApplied = Static<typeof NcseStandardAppliedSchema>;
export type SeismicHazard = Static<typeof SeismicHazardSchema>;

/**
 * Official basic seismic acceleration values (ab in g) under IGN NCSE-02 (Real Decreto 997/2002).
 * Key seismic clusters in Andalusia, Murcia, Valencian Community, and the Pyrenees.
 */
export const OFFICIAL_NCSE02_MUNICIPALITIES: Record<string, { name: string; ab: number }> = {
  // Granada cluster (highest seismic hazard in Iberian Peninsula)
  '18087': { name: 'Granada', ab: 0.23 },
  '18175': { name: 'Santa Fe', ab: 0.24 },
  '18021': { name: 'Atarfe', ab: 0.24 },
  '18017': { name: 'Armilla', ab: 0.23 },
  '18003': { name: 'Albolote', ab: 0.23 },
  '18127': { name: 'Maracena', ab: 0.23 },
  '18034': { name: 'Baza', ab: 0.17 },
  '18140': { name: 'Motril', ab: 0.12 },
  '18014': { name: 'Alhama de Granada', ab: 0.21 },
  '18089': { name: 'Guadix', ab: 0.15 },

  // Murcia cluster (Lorca fault system)
  '30024': { name: 'Lorca', ab: 0.19 },
  '30030': { name: 'Murcia', ab: 0.15 },
  '30039': { name: 'Totana', ab: 0.17 },
  '30016': { name: 'Cartagena', ab: 0.10 },
  '30006': { name: 'Águilas', ab: 0.16 },
  '30019': { name: 'Cieza', ab: 0.12 },
  '30015': { name: 'Caravaca de la Cruz', ab: 0.14 },
  '30026': { name: 'Mazarrón', ab: 0.16 },
  '30002': { name: 'Alcantarilla', ab: 0.15 },

  // Almería cluster
  '04013': { name: 'Almería', ab: 0.19 },
  '04029': { name: 'Berja', ab: 0.20 },
  '04902': { name: 'El Ejido', ab: 0.18 },
  '04079': { name: 'Roquetas de Mar', ab: 0.18 },
  '04003': { name: 'Adra', ab: 0.20 },
  '04100': { name: 'Vera', ab: 0.17 },
  '04038': { name: 'Cuevas del Almanzora', ab: 0.16 },

  // Alicante cluster (Vega Baja & Southern Mediterranean)
  '03014': { name: 'Alicante/Alacant', ab: 0.11 },
  '03133': { name: 'Torrevieja', ab: 0.17 },
  '03099': { name: 'Orihuela', ab: 0.17 },
  '03065': { name: 'Elche/Elx', ab: 0.13 },
  '03059': { name: 'Crevillent', ab: 0.14 },
  '03009': { name: 'Alcoi/Alcoy', ab: 0.10 },
  '03031': { name: 'Benidorm', ab: 0.08 },
  '03066': { name: 'Elda', ab: 0.10 },
  '03121': { name: 'Santa Pola', ab: 0.13 },

  // Málaga cluster
  '29067': { name: 'Málaga', ab: 0.11 },
  '29015': { name: 'Antequera', ab: 0.10 },
  '29094': { name: 'Vélez-Málaga', ab: 0.11 },
  '29070': { name: 'Marbella', ab: 0.09 },
  '29084': { name: 'Ronda', ab: 0.10 },
  '29054': { name: 'Fuengirola', ab: 0.10 },

  // Jaén & Andalusia
  '23050': { name: 'Jaén', ab: 0.09 },
  '23005': { name: 'Alcalá la Real', ab: 0.14 },
  '11012': { name: 'Cádiz', ab: 0.08 },
  '11020': { name: 'Jerez de la Frontera', ab: 0.08 },
  '11004': { name: 'Algeciras', ab: 0.09 },

  // Pyrenean seismic belt (Huesca, Girona, Navarra, Lleida)
  '22125': { name: 'Jaca', ab: 0.10 },
  '22059': { name: 'Biescas', ab: 0.10 },
  '22078': { name: 'Canfranc', ab: 0.10 },
  '22054': { name: 'Benasque', ab: 0.10 },
  '17114': { name: 'Olot', ab: 0.09 },
  '17147': { name: 'Ripoll', ab: 0.09 },
  '17038': { name: 'Camprodon', ab: 0.10 },
  '31201': { name: 'Pamplona/Iruña', ab: 0.08 },
  '25254': { name: 'Vielha e Mijaran', ab: 0.09 },

  // Low seismic baseline major capitals
  '28079': { name: 'Madrid', ab: 0.04 },
  '08019': { name: 'Barcelona', ab: 0.04 },
  '46250': { name: 'València', ab: 0.04 },
  '41091': { name: 'Sevilla', ab: 0.04 },
  '50297': { name: 'Zaragoza', ab: 0.04 },
  '48020': { name: 'Bilbao', ab: 0.04 },
  '20069': { name: 'Donostia/San Sebastián', ab: 0.04 },
  '01059': { name: 'Vitoria-Gasteiz', ab: 0.04 },
  '47186': { name: 'Valladolid', ab: 0.04 },
  '15030': { name: 'A Coruña', ab: 0.04 },
  '36057': { name: 'Vigo', ab: 0.04 },
  '33044': { name: 'Oviedo', ab: 0.04 },
  '39075': { name: 'Santander', ab: 0.04 },
  '07040': { name: 'Palma', ab: 0.04 },
  '38038': { name: 'Santa Cruz de Tenerife', ab: 0.04 },
  '35016': { name: 'Las Palmas de Gran Canaria', ab: 0.04 },
  '45168': { name: 'Toledo', ab: 0.04 },
  '10037': { name: 'Cáceres', ab: 0.04 },
  '06015': { name: 'Badajoz', ab: 0.04 },
  '14021': { name: 'Córdoba', ab: 0.06 },
};

/**
 * Provincial default basic acceleration for municipalities without specific entries.
 */
export const PROVINCIAL_DEFAULT_ACCELERATION: Record<string, { province: string; ab: number }> = {
  '18': { province: 'Granada', ab: 0.20 },
  '30': { province: 'Murcia', ab: 0.15 },
  '04': { province: 'Almería', ab: 0.18 },
  '03': { province: 'Alicante', ab: 0.11 },
  '29': { province: 'Málaga', ab: 0.10 },
  '23': { province: 'Jaén', ab: 0.09 },
  '22': { province: 'Huesca', ab: 0.07 },
  '17': { province: 'Girona', ab: 0.06 },
  '31': { province: 'Navarra', ab: 0.06 },
  '11': { province: 'Cádiz', ab: 0.08 },
  '25': { province: 'Lleida', ab: 0.05 },
};

/**
 * Categorizes the seismic risk level from basic acceleration ab.
 */
export function resolveSeismicRiskLevel(ab: number): SeismicRiskLevel {
  if (ab >= 0.16) return 'HIGH';
  if (ab >= 0.08) return 'MEDIUM';
  if (ab >= 0.06) return 'LOW';
  return 'VERY_LOW';
}

/**
 * Resolves the seismic regulation in force when the property was built.
 */
export function resolveNcseStandardApplied(constructionYear: number): NcseStandardApplied {
  if (constructionYear >= 2002) return 'NCSE_02';
  if (constructionYear >= 1994) return 'NCSE_94';
  if (constructionYear >= 1968) return 'PGS_1';
  return 'PRE_REGULATION';
}

/**
 * Evaluates the seismic hazard and structural vulnerability of a building based on
 * IGN NCSE-02 basic acceleration, municipality, and construction antiquity.
 */
export function evaluateSeismicVulnerability(
  municipalityCode: string,
  constructionYear: number,
  customAcceleration?: number,
  municipalityName?: string,
  provinceCode?: string
): SeismicHazard {
  let code = municipalityCode ? municipalityCode.trim() : '';
  if (code.length === 3 && provinceCode) {
    code = `${provinceCode.trim()}${code}`;
  } else if (code.length > 0 && code.length < 5) {
    code = code.padStart(5, '0');
  }

  let ab = customAcceleration;
  let resolvedName = municipalityName;

  if (ab === undefined) {
    if (code && OFFICIAL_NCSE02_MUNICIPALITIES[code]) {
      ab = OFFICIAL_NCSE02_MUNICIPALITIES[code].ab;
      resolvedName = resolvedName || OFFICIAL_NCSE02_MUNICIPALITIES[code].name;
    } else if (municipalityName) {
      // Fallback: match by municipality name (case-insensitive)
      const cleanName = municipalityName.trim().toLowerCase();
      const match = Object.values(OFFICIAL_NCSE02_MUNICIPALITIES).find(
        (m) => m.name.toLowerCase() === cleanName || cleanName.includes(m.name.toLowerCase())
      );
      if (match) {
        ab = match.ab;
        resolvedName = resolvedName || match.name;
      }
    }

    if (ab === undefined) {
      const prov = provinceCode ? provinceCode.trim() : (code ? code.slice(0, 2) : '');
      if (prov && PROVINCIAL_DEFAULT_ACCELERATION[prov]) {
        ab = PROVINCIAL_DEFAULT_ACCELERATION[prov].ab;
        resolvedName = resolvedName || `${PROVINCIAL_DEFAULT_ACCELERATION[prov].province} (provincial)`;
      } else {
        ab = 0.04;
        resolvedName = resolvedName || 'Municipio estándar';
      }
    }
  }

  resolvedName = resolvedName || `Municipio ${code}`;

  const riskLevel = resolveSeismicRiskLevel(ab);
  const ncseStandardApplied = resolveNcseStandardApplied(constructionYear);
  const isVulnerableToSeismic = constructionYear > 0 && constructionYear < 1994 && ab >= 0.08;

  let regulatoryContext = '';
  if (isVulnerableToSeismic) {
    regulatoryContext = `Edificación construida en ${constructionYear} previa a la norma sismorresistente NCSE-94 (RD 2493/1994) en zona con aceleración sísmica básica ab = ${ab}g (>= 0.08g). Presenta mayor vulnerabilidad estructural por ausencia de prescripciones modernas de ductilidad y armado transversal.`;
  } else if (ab >= 0.08) {
    regulatoryContext = `Zona de peligrosidad sísmica moderada/alta (ab = ${ab}g) proyectada bajo normativa sismorresistente española ${ncseStandardApplied}.`;
  } else {
    regulatoryContext = `Zona de peligrosidad sísmica baja/muy baja (ab = ${ab}g < 0.08g). El cálculo sísmico de estructuras residenciales estándar no es de aplicación obligatoria conforme a NCSE-02.`;
  }

  return {
    basicAccelerationG: Number(ab.toFixed(2)),
    riskLevel,
    municipalityCode: code,
    municipalityName: resolvedName,
    ncseStandardApplied,
    isVulnerableToSeismic,
    regulatoryContext,
  };
}

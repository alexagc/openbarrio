import { Type, Static } from '@sinclair/typebox';
import { CadastralProperty } from './catastro.js';

export const BuildingInspectionStatusSchema = Type.Union([
  Type.Literal('FAVORABLE'),
  Type.Literal('UNFAVORABLE'),
  Type.Literal('PENDING'),
  Type.Literal('EXEMPT'),
  Type.Literal('UNKNOWN'),
  Type.Literal('PREVENTIVE_REQUIRED'),
], { description: 'Official or evaluated status of the Technical Building Inspection (ITE/IEE)' });

export const BuildingInspectionSchema = Type.Object({
  status: BuildingInspectionStatusSchema,
  inspectionYear: Type.Optional(Type.Number({ description: 'Year of last recorded official inspection' })),
  nextInspectionDueYear: Type.Optional(Type.Number({ description: 'Year by which next periodic inspection is mandatory' })),
  hasDefects: Type.Boolean({ description: 'Indicates whether unresolved structural or safety defects are recorded' }),
  defectsSummary: Type.Array(Type.String(), { description: 'Summary of structural, facade, roof or network defects' }),
  municipalRegistry: Type.String({ description: 'Competent municipal or autonomous community registry' }),
  isPreventiveAlert: Type.Boolean({ description: 'Flagged if building age > 50 years and no official digital ITE/IEE is recorded' }),
  legalNotice: Type.String({ description: 'Statutory disclaimer referencing RD-L 7/2015 art. 29' }),
  accessibilityFulfillment: Type.Optional(Type.Boolean({ description: 'Compliance with universal accessibility requirements' })),
  energyCertificationIncluded: Type.Optional(Type.Boolean({ description: 'Whether energy performance evaluation is integrated into the IEE' })),
  cadastralReference: Type.Optional(Type.String({ description: 'Cadastral reference of the building' })),
  inspectionType: Type.Optional(Type.Union([Type.Literal('ITE'), Type.Literal('IEE')])),
});

export type BuildingInspectionStatus = Static<typeof BuildingInspectionStatusSchema>;
export type BuildingInspection = Static<typeof BuildingInspectionSchema>;

export const LEGAL_NOTICE_RDL_7_2015 =
  'Conforme al art. 29 del Real Decreto Legislativo 7/2015 (Texto Refundido de la Ley de Suelo y Rehabilitación Urbana), las edificaciones con tipología residencial colectiva y antigüedad superior a 50 años tienen la obligación legal de disponer de un Informe de Evaluación del Edificio (IEE/ITE) periódico que acredite el estado de conservación, la accesibilidad universal y la eficiencia energética.';

/**
 * Resolves the competent municipal or regional authority for ITE/IEE registries based on property location.
 */
export function resolveMunicipalRegistry(property: CadastralProperty): string {
  const muni = (property.address?.municipality || '').toLowerCase();
  const prov = (property.address?.province || '').toLowerCase();
  const provCode = property.address?.provinceCode || property.address?.postalCode?.slice(0, 2) || '';

  if (provCode === '28' || muni.includes('madrid')) {
    return 'Ayuntamiento de Madrid - Censo de Edificios ITE/IEE';
  }
  if (provCode === '08' || muni.includes('barcelona') || prov.includes('barcelona') || ['08', '17', '25', '43'].includes(provCode)) {
    return "Agència de l'Habitatge de Catalunya";
  }
  if (['01', '20', '48'].includes(provCode) || muni.includes('bilbao') || muni.includes('donostia') || muni.includes('vitoria')) {
    return 'Eusko Jaurlaritza - Registro de IEE del País Vasco';
  }
  if (provCode === '46' || muni.includes('valència') || muni.includes('valencia')) {
    return 'Ajuntament de València - Registre ITE';
  }
  if (provCode === '41' || muni.includes('sevilla')) {
    return 'Ayuntamiento de Sevilla - Registro ITE';
  }
  if (provCode === '50' || muni.includes('zaragoza')) {
    return 'Ayuntamiento de Zaragoza - Censo ITE';
  }
  if (property.address?.municipality) {
    return `Ayuntamiento de ${property.address.municipality} - Registro ITE/IEE`;
  }
  return 'Registro Municipal ITE / Autonómico IEE';
}

/**
 * Evaluates building inspection status and detects preventive alerts for buildings over 50 years old
 * in compliance with Real Decreto Legislativo 7/2015 art. 29.
 */
export function evaluateBuildingInspectionAlert(
  property: CadastralProperty,
  officialIteRecord?: Partial<BuildingInspection>
): BuildingInspection {
  const currentYear = new Date().getFullYear();
  const registry = officialIteRecord?.municipalRegistry ?? resolveMunicipalRegistry(property);

  // If official ITE/IEE record exists with conclusive status
  if (officialIteRecord && officialIteRecord.status && officialIteRecord.status !== 'UNKNOWN') {
    if (officialIteRecord.status === 'FAVORABLE') {
      return {
        status: 'FAVORABLE',
        inspectionYear: officialIteRecord.inspectionYear,
        nextInspectionDueYear:
          officialIteRecord.nextInspectionDueYear ??
          (officialIteRecord.inspectionYear ? officialIteRecord.inspectionYear + 10 : undefined),
        hasDefects: officialIteRecord.hasDefects ?? false,
        defectsSummary: officialIteRecord.defectsSummary ?? [],
        municipalRegistry: registry,
        isPreventiveAlert: false,
        legalNotice: LEGAL_NOTICE_RDL_7_2015,
        accessibilityFulfillment: officialIteRecord.accessibilityFulfillment,
        energyCertificationIncluded: officialIteRecord.energyCertificationIncluded,
        cadastralReference: property.cadastralReference,
        inspectionType: officialIteRecord.inspectionType ?? 'IEE',
      };
    }

    if (officialIteRecord.status === 'UNFAVORABLE') {
      return {
        status: 'UNFAVORABLE',
        inspectionYear: officialIteRecord.inspectionYear,
        nextInspectionDueYear: officialIteRecord.nextInspectionDueYear,
        hasDefects: true,
        defectsSummary:
          officialIteRecord.defectsSummary && officialIteRecord.defectsSummary.length > 0
            ? officialIteRecord.defectsSummary
            : ['Deficiencias graves o muy graves en elementos estructurales, envolvente o instalaciones'],
        municipalRegistry: registry,
        isPreventiveAlert: false,
        legalNotice: LEGAL_NOTICE_RDL_7_2015,
        accessibilityFulfillment: officialIteRecord.accessibilityFulfillment,
        energyCertificationIncluded: officialIteRecord.energyCertificationIncluded,
        cadastralReference: property.cadastralReference,
        inspectionType: officialIteRecord.inspectionType ?? 'ITE',
      };
    }

    return {
      status: officialIteRecord.status,
      inspectionYear: officialIteRecord.inspectionYear,
      nextInspectionDueYear: officialIteRecord.nextInspectionDueYear,
      hasDefects: officialIteRecord.hasDefects ?? false,
      defectsSummary: officialIteRecord.defectsSummary ?? [],
      municipalRegistry: registry,
      isPreventiveAlert: officialIteRecord.isPreventiveAlert ?? (officialIteRecord.status === 'PREVENTIVE_REQUIRED'),
      legalNotice: LEGAL_NOTICE_RDL_7_2015,
      accessibilityFulfillment: officialIteRecord.accessibilityFulfillment,
      energyCertificationIncluded: officialIteRecord.energyCertificationIncluded,
      cadastralReference: property.cadastralReference,
      inspectionType: officialIteRecord.inspectionType ?? 'IEE',
    };
  }

  // Unrecorded buildings: analyze building antiquity against 50-year statutory threshold
  const constructionYear = property.building?.constructionYear || 0;
  const age = constructionYear > 0 ? currentYear - constructionYear : 0;

  if (age >= 50 && constructionYear > 0) {
    return {
      status: 'PREVENTIVE_REQUIRED',
      inspectionYear: undefined,
      nextInspectionDueYear: currentYear,
      hasDefects: false,
      defectsSummary: [],
      municipalRegistry: registry,
      isPreventiveAlert: true,
      legalNotice: LEGAL_NOTICE_RDL_7_2015,
      cadastralReference: property.cadastralReference,
      inspectionType: 'IEE',
    };
  }

  if (age > 0 && age < 50) {
    return {
      status: 'EXEMPT',
      inspectionYear: undefined,
      nextInspectionDueYear: constructionYear + 50,
      hasDefects: false,
      defectsSummary: [],
      municipalRegistry: registry,
      isPreventiveAlert: false,
      legalNotice: LEGAL_NOTICE_RDL_7_2015,
      cadastralReference: property.cadastralReference,
      inspectionType: 'IEE',
    };
  }

  return {
    status: 'UNKNOWN',
    inspectionYear: undefined,
    nextInspectionDueYear: undefined,
    hasDefects: false,
    defectsSummary: [],
    municipalRegistry: registry,
    isPreventiveAlert: false,
    legalNotice: LEGAL_NOTICE_RDL_7_2015,
    cadastralReference: property.cadastralReference,
    inspectionType: 'IEE',
  };
}

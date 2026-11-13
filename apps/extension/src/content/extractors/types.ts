export type PortalType =
  | 'idealista'
  | 'fotocasa'
  | 'habitaclia'
  | 'pisos'
  | 'yaencontre';

export const PORTAL_NAMES: Record<PortalType, string> = {
  idealista: 'Idealista',
  fotocasa: 'Fotocasa',
  habitaclia: 'Habitaclia',
  pisos: 'Pisos.com',
  yaencontre: 'YaEncontre',
};

export interface ExtractedCoordinates {
  latitude: number;
  longitude: number;
}

export interface ExtractedPropertyData {
  portal: PortalType;
  url: string;
  title?: string;
  address?: string;
  zone?: string;
  municipality?: string;
  province?: string;
  coordinates?: ExtractedCoordinates;
  cadastralReference?: string;
  builtSurfaceM2?: number;
  constructionYear?: number;
  priceEur?: number;
  isRental?: boolean;
}

export interface ExtractionValidationResult {
  isValid: boolean;
  missingFields: string[];
  errorMessages: string[];
  diagnostics?: {
    hasTitle: boolean;
    hasPrice: boolean;
    hasSurface: boolean;
    hasCoordinates: boolean;
    hasCadastralReference: boolean;
    hasAddress: boolean;
  };
}

export interface PropertyExtractor {
  readonly portal: PortalType;
  canExtract(url: string): boolean;
  extract(document: Document, url: string): ExtractedPropertyData | null;
  getMountTarget?(document: Document): Element | null;
}

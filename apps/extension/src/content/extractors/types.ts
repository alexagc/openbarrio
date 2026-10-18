export type PortalType = 'idealista' | 'fotocasa';

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

export interface PropertyExtractor {
  readonly portal: PortalType;
  canExtract(url: string): boolean;
  extract(document: Document, url: string): ExtractedPropertyData | null;
}

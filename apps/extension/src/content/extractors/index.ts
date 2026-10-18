import { PropertyExtractor } from './types.js';
import { IdealistaExtractor } from './idealista.js';
import { FotocasaExtractor } from './fotocasa.js';

export * from './types.js';
export * from './idealista.js';
export * from './fotocasa.js';

export const EXTRACTORS: PropertyExtractor[] = [
  new IdealistaExtractor(),
  new FotocasaExtractor(),
];

export function findExtractorForUrl(url: string): PropertyExtractor | null {
  for (const extractor of EXTRACTORS) {
    if (extractor.canExtract(url)) {
      return extractor;
    }
  }
  return null;
}

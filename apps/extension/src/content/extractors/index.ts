import { BasePortalAdapter } from './base.js';
import { IdealistaExtractor } from './idealista.js';
import { FotocasaExtractor } from './fotocasa.js';
import { HabitacliaAdapter } from './habitaclia.js';
import { PisosComAdapter } from './pisos.js';
import { YaEncontreAdapter } from './yaencontre.js';
import { PortalType } from './types.js';

export * from './types.js';
export * from './base.js';
export * from './idealista.js';
export * from './fotocasa.js';
export * from './habitaclia.js';
export * from './pisos.js';
export * from './yaencontre.js';

export const PORTAL_NAMES: Record<PortalType, string> = {
  idealista: 'Idealista',
  fotocasa: 'Fotocasa',
  habitaclia: 'Habitaclia',
  pisos: 'Pisos.com',
  yaencontre: 'Yaencontre',
};

export const EXTRACTORS: BasePortalAdapter[] = [
  new IdealistaExtractor(),
  new FotocasaExtractor(),
  new HabitacliaAdapter(),
  new PisosComAdapter(),
  new YaEncontreAdapter(),
];

export function findExtractorForUrl(url: string): BasePortalAdapter | null {
  for (const extractor of EXTRACTORS) {
    if (extractor.canExtract(url)) {
      return extractor;
    }
  }
  return null;
}

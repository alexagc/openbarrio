import {
  ICatastroProvider,
  IINEProvider,
  ISICAProvider,
  ISNCZIProvider,
  ISERPAVIProvider,
  IEnvironmentalProvider,
} from './types.js';
import { CatastroProvider } from './catastro.provider.js';
import { MockCatastroProvider } from './catastro.mock.js';
import { INEProvider } from './ine.provider.js';
import { MockINEProvider } from './ine.mock.js';
import { SICAProvider } from './sica.provider.js';
import { MockSICAProvider } from './sica.mock.js';
import { SNCZIProvider } from './snczi.provider.js';
import { MockSNCZIProvider } from './snczi.mock.js';
import { SERPAVIProvider } from './serpavi.provider.js';
import { MockSERPAVIProvider } from './serpavi.mock.js';
import { EnvironmentalProvider } from './environmental.provider.js';
import { MockEnvironmentalProvider } from './environmental.mock.js';

export * from './types.js';
export * from './catastro.provider.js';
export * from './catastro.mock.js';
export * from './catastro.parser.js';
export * from './ine.provider.js';
export * from './ine.mock.js';
export * from './sica.provider.js';
export * from './sica.mock.js';
export * from './snczi.provider.js';
export * from './snczi.mock.js';
export * from './serpavi.provider.js';
export * from './serpavi.mock.js';
export * from './environmental.provider.js';
export * from './environmental.mock.js';

export interface ProviderContainer {
  catastro: ICatastroProvider;
  ine: IINEProvider;
  sica: ISICAProvider;
  snczi: ISNCZIProvider;
  serpavi: ISERPAVIProvider;
  environmental: IEnvironmentalProvider;
}

export function createProviders(options?: {
  useMocks?: boolean;
  overrides?: Partial<ProviderContainer>;
}): ProviderContainer {
  const useMocks =
    options?.useMocks ?? (process.env.NODE_ENV === 'test' || process.env.USE_MOCKS !== 'false');

  const defaultCatastro = useMocks ? new MockCatastroProvider() : new CatastroProvider();
  const defaultINE = useMocks ? new MockINEProvider() : new INEProvider();
  const defaultSICA = useMocks ? new MockSICAProvider() : new SICAProvider();
  const defaultSNCZI = useMocks ? new MockSNCZIProvider() : new SNCZIProvider();
  const defaultSERPAVI = useMocks ? new MockSERPAVIProvider() : new SERPAVIProvider();

  const effectiveSica = options?.overrides?.sica || defaultSICA;
  const effectiveSnczi = options?.overrides?.snczi || defaultSNCZI;

  const defaultEnvironmental = useMocks
    ? new MockEnvironmentalProvider({ sica: effectiveSica, snczi: effectiveSnczi })
    : new EnvironmentalProvider({ sica: effectiveSica, snczi: effectiveSnczi });

  return {
    catastro: options?.overrides?.catastro || defaultCatastro,
    ine: options?.overrides?.ine || defaultINE,
    sica: effectiveSica,
    snczi: effectiveSnczi,
    serpavi: options?.overrides?.serpavi || defaultSERPAVI,
    environmental: options?.overrides?.environmental || defaultEnvironmental,
  };
}

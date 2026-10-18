import { ICatastroProvider, IINEProvider, IEnvironmentalProvider } from './types.js';
import { CatastroProvider } from './catastro.provider.js';
import { MockCatastroProvider } from './catastro.mock.js';
import { INEProvider } from './ine.provider.js';
import { MockINEProvider } from './ine.mock.js';
import { MockEnvironmentalProvider } from './environmental.mock.js';

export * from './types.js';
export * from './catastro.provider.js';
export * from './catastro.mock.js';
export * from './catastro.parser.js';
export * from './ine.provider.js';
export * from './ine.mock.js';
export * from './environmental.mock.js';

export interface ProviderContainer {
  catastro: ICatastroProvider;
  ine: IINEProvider;
  environmental: IEnvironmentalProvider;
}

export function createProviders(options?: {
  useMocks?: boolean;
  overrides?: Partial<ProviderContainer>;
}): ProviderContainer {
  const useMocks = options?.useMocks ?? (process.env.NODE_ENV === 'test' || process.env.USE_MOCKS !== 'false');

  const defaultCatastro = useMocks ? new MockCatastroProvider() : new CatastroProvider();
  const defaultINE = useMocks ? new MockINEProvider() : new INEProvider();
  const defaultEnvironmental = new MockEnvironmentalProvider();

  return {
    catastro: options?.overrides?.catastro || defaultCatastro,
    ine: options?.overrides?.ine || defaultINE,
    environmental: options?.overrides?.environmental || defaultEnvironmental,
  };
}

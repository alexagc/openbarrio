import {
  ICatastroProvider,
  IINEProvider,
  ISICAProvider,
  ISNCZIProvider,
  ISERPAVIProvider,
  IEnvironmentalProvider,
  ICivicConnectivityProvider,
  IUrbanPlanningProvider,
  IAirQualityProvider,
} from './types.js';
import { D1Database, CloudflareEnv } from '../types/env.js';
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
import {
  D1CivicConnectivityProvider,
  MockCivicConnectivityProvider,
} from './connectivity.provider.js';
import {
  UrbanPlanningProvider,
  MockUrbanPlanningProvider,
} from './urban-planning.provider.js';
import {
  AirQualityProvider,
  MockAirQualityProvider,
} from './air-quality.provider.js';

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
export * from './connectivity.provider.js';
export * from './urban-planning.provider.js';
export * from './air-quality.provider.js';
export * from './capex.provider.js';

export interface ProviderContainer {
  catastro: ICatastroProvider;
  ine: IINEProvider;
  sica: ISICAProvider;
  snczi: ISNCZIProvider;
  serpavi: ISERPAVIProvider;
  environmental: IEnvironmentalProvider;
  connectivity: ICivicConnectivityProvider;
  urbanPlanning: IUrbanPlanningProvider;
  airQuality: IAirQualityProvider;
}

export function createMockProviders(overrides?: Partial<ProviderContainer>): ProviderContainer {
  const catastro = new MockCatastroProvider();
  const ine = new MockINEProvider();
  const sica = new MockSICAProvider();
  const snczi = new MockSNCZIProvider();
  const serpavi = new MockSERPAVIProvider();
  const connectivity = new MockCivicConnectivityProvider();
  const urbanPlanning = new MockUrbanPlanningProvider();
  const airQuality = new MockAirQualityProvider();

  const effectiveSica = overrides?.sica || sica;
  const effectiveSnczi = overrides?.snczi || snczi;
  const effectiveAirQuality = overrides?.airQuality || airQuality;

  const environmental =
    overrides?.environmental ||
    new MockEnvironmentalProvider({
      sica: effectiveSica,
      snczi: effectiveSnczi,
      airQuality: effectiveAirQuality,
    });

  return {
    catastro: overrides?.catastro || catastro,
    ine: overrides?.ine || ine,
    sica: effectiveSica,
    snczi: effectiveSnczi,
    serpavi: overrides?.serpavi || serpavi,
    environmental,
    connectivity: overrides?.connectivity || connectivity,
    urbanPlanning: overrides?.urbanPlanning || urbanPlanning,
    airQuality: effectiveAirQuality,
  };
}

export function createProviders(
  optionsOrEnv?:
    | {
        useMocks?: boolean;
        db?: D1Database;
        overrides?: Partial<ProviderContainer>;
      }
    | CloudflareEnv
): ProviderContainer {
  const db: D1Database | undefined =
    (optionsOrEnv as any)?.db || (optionsOrEnv as any)?.DB;
  const overrides: Partial<ProviderContainer> | undefined = (optionsOrEnv as any)?.overrides;

  const isTest = process.env.NODE_ENV === 'test' || typeof (globalThis as any).it === 'function';
  const useMocks =
    (optionsOrEnv as any)?.useMocks ??
    (isTest
      ? process.env.USE_MOCKS !== 'false'
      : process.env.USE_MOCKS === 'true');

  if (useMocks) {
    return createMockProviders(overrides);
  }

  const defaultCatastro = new CatastroProvider();
  const defaultINE = new INEProvider({ db });
  const defaultSICA = new SICAProvider();
  const defaultSNCZI = new SNCZIProvider();
  const defaultSERPAVI = new SERPAVIProvider();
  const defaultAirQuality = new AirQualityProvider();
  const defaultConnectivity = new D1CivicConnectivityProvider({ db });
  const defaultUrbanPlanning = new UrbanPlanningProvider();

  const effectiveSica = overrides?.sica || defaultSICA;
  const effectiveSnczi = overrides?.snczi || defaultSNCZI;
  const effectiveAirQuality = overrides?.airQuality || defaultAirQuality;

  const defaultEnvironmental =
    overrides?.environmental ||
    new EnvironmentalProvider({
      sica: effectiveSica,
      snczi: effectiveSnczi,
      airQuality: effectiveAirQuality,
    });

  return {
    catastro: overrides?.catastro || defaultCatastro,
    ine: overrides?.ine || defaultINE,
    sica: effectiveSica,
    snczi: effectiveSnczi,
    serpavi: overrides?.serpavi || defaultSERPAVI,
    environmental: defaultEnvironmental,
    connectivity: overrides?.connectivity || defaultConnectivity,
    urbanPlanning: overrides?.urbanPlanning || defaultUrbanPlanning,
    airQuality: effectiveAirQuality,
  };
}

import { EnvironmentalData } from '@openbarrio/core';
import { IEnvironmentalProvider, ISICAProvider, ISNCZIProvider } from './types.js';
import { SICAProvider } from './sica.provider.js';
import { SNCZIProvider } from './snczi.provider.js';

/**
 * Composite Environmental Provider aggregating MITECO SICA (noise) and MITECO SNCZI (flood hazard).
 */
export class EnvironmentalProvider implements IEnvironmentalProvider {
  private readonly sica: ISICAProvider;
  private readonly snczi: ISNCZIProvider;

  constructor(options?: { sica?: ISICAProvider; snczi?: ISNCZIProvider }) {
    this.sica = options?.sica || new SICAProvider();
    this.snczi = options?.snczi || new SNCZIProvider();
  }

  async getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData> {
    const [noise, floodRisk] = await Promise.all([
      this.sica.getNoiseData(latitude, longitude),
      this.snczi.getFloodRiskData(latitude, longitude),
    ]);

    return {
      noise,
      floodRisk,
    };
  }
}

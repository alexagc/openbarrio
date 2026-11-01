import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

export interface UseEnvironmentalLayersProps {
  map: MapLibreMap | null;
  showIneIncome: boolean;
  showMitecoNoise: boolean;
  showSncziFlood: boolean;
  ineOpacity: number;
  noiseOpacity: number;
  floodOpacity: number;
}

export function useEnvironmentalLayers({
  map,
  showIneIncome,
  showMitecoNoise,
  showSncziFlood,
  ineOpacity,
  noiseOpacity,
  floodOpacity,
}: UseEnvironmentalLayersProps) {
  useEffect(() => {
    if (!map) return;

    try {
      if (map.getLayer('ine-income-layer')) {
        map.setLayoutProperty(
          'ine-income-layer',
          'visibility',
          showIneIncome ? 'visible' : 'none'
        );
        if (showIneIncome) {
          map.setPaintProperty('ine-income-layer', 'raster-opacity', ineOpacity);
        }
      }

      if (map.getLayer('sica-layer')) {
        map.setLayoutProperty(
          'sica-layer',
          'visibility',
          showMitecoNoise ? 'visible' : 'none'
        );
        if (showMitecoNoise) {
          map.setPaintProperty('sica-layer', 'raster-opacity', noiseOpacity);
        }
      }

      if (map.getLayer('snczi-layer')) {
        map.setLayoutProperty(
          'snczi-layer',
          'visibility',
          showSncziFlood ? 'visible' : 'none'
        );
        if (showSncziFlood) {
          map.setPaintProperty('snczi-layer', 'raster-opacity', floodOpacity);
        }
      }
    } catch {
      // Ignore during initial style compilation
    }
  }, [
    map,
    showIneIncome,
    showMitecoNoise,
    showSncziFlood,
    ineOpacity,
    noiseOpacity,
    floodOpacity,
  ]);
}

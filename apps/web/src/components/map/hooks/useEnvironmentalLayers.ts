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
        if (map.getLayer('ine-income-borders')) {
          map.setLayoutProperty(
            'ine-income-borders',
            'visibility',
            showIneIncome ? 'visible' : 'none'
          );
        }
        if (showIneIncome) {
          const layerType = (map.getLayer('ine-income-layer') as any)?.type;
          const propName = layerType === 'fill' ? 'fill-opacity' : 'raster-opacity';
          map.setPaintProperty('ine-income-layer', propName, ineOpacity);
        }
      }

      if (map.getLayer('sica-layer')) {
        map.setLayoutProperty(
          'sica-layer',
          'visibility',
          showMitecoNoise ? 'visible' : 'none'
        );
        if (map.getLayer('sica-borders')) {
          map.setLayoutProperty(
            'sica-borders',
            'visibility',
            showMitecoNoise ? 'visible' : 'none'
          );
        }
        if (showMitecoNoise) {
          const layerType = (map.getLayer('sica-layer') as any)?.type;
          const propName = layerType === 'fill' ? 'fill-opacity' : 'raster-opacity';
          map.setPaintProperty('sica-layer', propName, noiseOpacity);
          if (map.getLayer('sica-borders')) {
            map.setPaintProperty('sica-borders', 'line-opacity', Math.min(1, noiseOpacity * 1.15));
          }
        }
      }

      if (map.getLayer('snczi-layer')) {
        map.setLayoutProperty(
          'snczi-layer',
          'visibility',
          showSncziFlood ? 'visible' : 'none'
        );
        if (map.getLayer('snczi-borders')) {
          map.setLayoutProperty(
            'snczi-borders',
            'visibility',
            showSncziFlood ? 'visible' : 'none'
          );
        }
        if (showSncziFlood) {
          const layerType = (map.getLayer('snczi-layer') as any)?.type;
          const propName = layerType === 'fill' ? 'fill-opacity' : 'raster-opacity';
          map.setPaintProperty('snczi-layer', propName, floodOpacity);
          if (map.getLayer('snczi-borders')) {
            map.setPaintProperty('snczi-borders', 'line-opacity', Math.min(1, floodOpacity * 1.2));
          }
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

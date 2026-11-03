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

/**
 * Zoom-driven opacity expression for acoustic micro-cartography (MITECO SICA).
 * Uses official MITECO continuous semi-transparent color bands without isophone line borders
 * (eliminates tile seams and jitter on zoom), attenuating softly at micro-zoom (0.20-0.25)
 * so parcel lines, street names, and building numbers remain perfectly legible.
 */
export function getSicaOpacityExpression(multiplier: number = 1) {
  const m = Math.max(0, multiplier);
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    6, Number(Math.min(1, 0.35 * m).toFixed(3)),
    13, Number(Math.min(1, 0.25 * m).toFixed(3)),
    14, Number(Math.min(1, 0.16 * m).toFixed(3)),
    16, Number(Math.min(1, 0.10 * m).toFixed(3)),
    18, Number(Math.min(1, 0.08 * m).toFixed(3)),
    19, Number(Math.min(1, 0.06 * m).toFixed(3)),
  ];
}

/**
 * Zoom-driven isophone curve opacity expression for sharp, high-contrast decibel contours.
 */
export function getSicaBorderOpacityExpression(multiplier: number = 1) {
  const m = Math.max(0, multiplier);
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    8, Number(Math.min(1, 0.75 * m).toFixed(3)),
    13, Number(Math.min(1, 0.85 * m).toFixed(3)),
    16, Number(Math.min(1, 0.90 * m).toFixed(3)),
    19, Number(Math.min(1, 0.85 * m).toFixed(3)),
  ];
}

/**
 * Zoom-driven opacity expression for hydrological sheets (MITECO SNCZI).
 * Ensures smooth edge transitions without seams or jarring changes across return periods.
 */
export function getSncziOpacityExpression(baseMax: number, multiplier: number = 1) {
  const m = Math.max(0, multiplier);
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    6, Number(Math.min(1, baseMax * m).toFixed(3)),
    13, Number(Math.min(1, baseMax * 0.92 * m).toFixed(3)),
    16, Number(Math.min(1, baseMax * 0.78 * m).toFixed(3)),
    19, Number(Math.min(1, baseMax * 0.62 * m).toFixed(3)),
  ];
}

/**
 * Zoom-driven boundary line opacity for hydrological flood sheets.
 */
export function getSncziBorderOpacityExpression(multiplier: number = 1) {
  const m = Math.max(0, multiplier);
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    8, Number(Math.min(1, 0.60 * m).toFixed(3)),
    13, Number(Math.min(1, 0.80 * m).toFixed(3)),
    16, Number(Math.min(1, 0.85 * m).toFixed(3)),
    19, Number(Math.min(1, 0.75 * m).toFixed(3)),
  ];
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
      // 1. INE Income Demographic Layer
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

      // 2. MITECO SICA Noise Layer (Curvas Isófonas + Halo + Ambient Cushion)
      const noiseMultiplier = noiseOpacity > 0 ? noiseOpacity / 0.75 : 0;

      if (map.getLayer('sica-layer')) {
        map.setLayoutProperty(
          'sica-layer',
          'visibility',
          showMitecoNoise ? 'visible' : 'none'
        );
        if (showMitecoNoise) {
          const layerType = (map.getLayer('sica-layer') as any)?.type;
          if (layerType === 'fill') {
            map.setPaintProperty(
              'sica-layer',
              'fill-opacity',
              getSicaOpacityExpression(noiseMultiplier) as any
            );
          } else {
            map.setPaintProperty('sica-layer', 'raster-opacity', noiseOpacity);
          }
        }
      }

      if (map.getLayer('sica-isophone-halo')) {
        map.setLayoutProperty(
          'sica-isophone-halo',
          'visibility',
          showMitecoNoise ? 'visible' : 'none'
        );
        if (showMitecoNoise) {
          map.setPaintProperty(
            'sica-isophone-halo',
            'line-opacity',
            getSicaOpacityExpression(noiseMultiplier) as any
          );
        }
      }

      if (map.getLayer('sica-borders')) {
        map.setLayoutProperty(
          'sica-borders',
          'visibility',
          showMitecoNoise ? 'visible' : 'none'
        );
        if (showMitecoNoise) {
          map.setPaintProperty(
            'sica-borders',
            'line-opacity',
            getSicaBorderOpacityExpression(noiseMultiplier) as any
          );
        }
      }

      // 3. MITECO SNCZI Hydrological Coherently Stacked Flood Sheets
      const floodMultiplier = floodOpacity > 0 ? floodOpacity / 0.75 : 0;
      const sncziLayers = [
        { id: 'snczi-layer', baseMax: 0.35 },
        { id: 'snczi-t100-layer', baseMax: 0.55 },
        { id: 'snczi-t10-layer', baseMax: 0.72 },
        { id: 'snczi-zfp-layer', baseMax: 0.85 },
      ];

      for (const { id, baseMax } of sncziLayers) {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', showSncziFlood ? 'visible' : 'none');
          if (showSncziFlood) {
            const layerType = (map.getLayer(id) as any)?.type;
            if (layerType === 'fill') {
              map.setPaintProperty(
                id,
                'fill-opacity',
                getSncziOpacityExpression(baseMax, floodMultiplier) as any
              );
            } else {
              map.setPaintProperty(id, 'raster-opacity', floodOpacity);
            }
          }
        }
      }

      if (map.getLayer('snczi-borders')) {
        map.setLayoutProperty(
          'snczi-borders',
          'visibility',
          showSncziFlood ? 'visible' : 'none'
        );
        if (showSncziFlood) {
          map.setPaintProperty(
            'snczi-borders',
            'line-opacity',
            getSncziBorderOpacityExpression(floodMultiplier) as any
          );
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

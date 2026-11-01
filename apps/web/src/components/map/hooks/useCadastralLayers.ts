import { useEffect } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

export interface UseCadastralLayersProps {
  map: MapLibreMap | null;
  showCatastroWms: boolean;
  catastroOpacity: number;
  selectedCoords?: { lat: number; lon: number };
}

export function useCadastralLayers({
  map,
  showCatastroWms,
  catastroOpacity,
  selectedCoords,
}: UseCadastralLayersProps) {
  useEffect(() => {
    if (!map) return;

    const lat = selectedCoords?.lat ?? 40.42028;
    const lon = selectedCoords?.lon ?? -3.70379;

    // Detect autonomous territory
    const isNavarra = lat >= 41.9 && lat <= 43.4 && lon >= -2.55 && lon <= -0.7 && lon > -1.75;
    const isEuskadi = !isNavarra && lat >= 42.4 && lat <= 43.6 && lon >= -3.5 && lon <= -1.7;
    const isBizkaia = isEuskadi && lon < -2.4;
    const isGipuzkoa = isEuskadi && lon >= -2.4 && lon < -1.7;
    const isAraba = isEuskadi && !isBizkaia && !isGipuzkoa;

    const cadastralLayers = [
      { id: 'catastro-layer', active: showCatastroWms && !isEuskadi && !isNavarra },
      { id: 'catastro-bizkaia-layer', active: showCatastroWms && isBizkaia },
      { id: 'catastro-navarra-layer', active: showCatastroWms && isNavarra },
      { id: 'catastro-araba-layer', active: showCatastroWms && isAraba },
      { id: 'catastro-gipuzkoa-layer', active: showCatastroWms && isGipuzkoa },
    ];

    try {
      for (const layer of cadastralLayers) {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(
            layer.id,
            'visibility',
            layer.active ? 'visible' : 'none'
          );
          if (layer.active) {
            map.setPaintProperty(layer.id, 'raster-opacity', catastroOpacity);
          }
        }
      }
    } catch {
      // Ignore during initial style compilation
    }
  }, [map, showCatastroWms, catastroOpacity, selectedCoords?.lat, selectedCoords?.lon]);
}

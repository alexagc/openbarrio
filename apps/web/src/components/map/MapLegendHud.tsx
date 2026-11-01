import { CartographicLegendsHud, ActiveLayersState } from '../CartographicLegendsHud';

export interface MapLegendHudProps {
  activeLayers: ActiveLayersState;
  defaultCollapsed?: boolean;
  isDragging?: boolean;
}

export function MapLegendHud({ activeLayers, defaultCollapsed = true, isDragging = false }: MapLegendHudProps) {
  return (
    <CartographicLegendsHud
      activeLayers={activeLayers}
      defaultCollapsed={defaultCollapsed}
      isDragging={isDragging}
    />
  );
}

export type { ActiveLayersState };

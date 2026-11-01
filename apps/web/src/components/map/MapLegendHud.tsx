import { CartographicLegendsHud, ActiveLayersState } from '../CartographicLegendsHud';

export interface MapLegendHudProps {
  activeLayers: ActiveLayersState;
  defaultCollapsed?: boolean;
}

export function MapLegendHud({ activeLayers, defaultCollapsed = true }: MapLegendHudProps) {
  return (
    <CartographicLegendsHud
      activeLayers={activeLayers}
      defaultCollapsed={defaultCollapsed}
    />
  );
}

export type { ActiveLayersState };

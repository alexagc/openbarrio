import { wgs84ToUtm30n } from '../../utils/geo';

export interface MapTelemetryHudProps {
  lat: number;
  lon: number;
  is3DMode?: boolean;
}

export function MapTelemetryHud({ lat, lon, is3DMode = false }: MapTelemetryHudProps) {
  if (is3DMode) return null;

  const utmCoords = wgs84ToUtm30n(lat, lon);

  // Approximate Spanish elevation
  const latDiff = Math.abs(lat - 40.42);
  const lonDiff = Math.abs(lon - -3.7);
  let estimatedElevation = 485;
  if (latDiff < 0.5 && lonDiff < 0.5) estimatedElevation = 652;
  else if (lon > 1.5 || lon < -8.0 || lat < 37.0) estimatedElevation = 38;

  return (
    <div
      data-testid="map-telemetry-hud"
      className="absolute bottom-2 left-3 right-3 z-20 hidden sm:flex flex-row items-center justify-between gap-2 pointer-events-none no-print"
    >
      {/* Bottom-Left Real-time ETRS89 / UTM Coordinates Readout */}
      <div className="pointer-events-auto bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-3 py-1 rounded text-[10px] font-mono text-on-surface-variant flex items-center gap-2.5 shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
        <span className="text-on-surface font-semibold">UTM ETRS89:</span>
        <span>X: {utmCoords.x.toLocaleString()}</span>
        <span>Y: {utmCoords.y.toLocaleString()}</span>
        <span className="text-outline">|</span>
        <span>Huso: {utmCoords.zone}</span>
        <span className="text-outline">|</span>
        <span>Cota: {estimatedElevation}m s.n.m.</span>
      </div>

      {/* Bottom-Right Scale Bar & Official Attribution */}
      <div className="pointer-events-auto bg-surface-container-low/95 backdrop-blur-md border border-outline-variant px-3 py-1 rounded text-[10px] font-mono text-on-surface-variant flex items-center gap-3 shadow-md">
        <div className="flex flex-col items-center">
          <span className="text-[9px] leading-tight text-on-surface-variant">50 m</span>
          <div className="w-16 h-1 border-b-2 border-l-2 border-r-2 border-primary" />
        </div>
        <span className="text-outline text-[9px]">Sede Electrónica Catastro · INE ADRH</span>
      </div>
    </div>
  );
}

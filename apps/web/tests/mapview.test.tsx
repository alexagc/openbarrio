import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapView, wgs84ToUtm30n } from '../src/components/map/MapView';

// Mock MapLibre GL
vi.mock('maplibre-gl', () => {
  const mockMapInstance = {
    on: vi.fn(),
    off: vi.fn(),
    resize: vi.fn(),
    remove: vi.fn(),
    flyTo: vi.fn(),
    easeTo: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    resetNorthPitch: vi.fn(),
    getCanvas: vi.fn().mockReturnValue({ style: {} }),
    getZoom: vi.fn().mockReturnValue(15),
    getCenter: vi.fn().mockReturnValue({ lat: 40.42028, lng: -3.70379 }),
    setLayoutProperty: vi.fn(),
    setPaintProperty: vi.fn(),
    setLight: vi.fn(),
    getBearing: vi.fn().mockReturnValue(-15),
    getPitch: vi.fn().mockReturnValue(55),
    getLayer: vi.fn().mockReturnValue({}),
    getSource: vi.fn().mockReturnValue({ setData: vi.fn() }),
    isStyleLoaded: vi.fn().mockReturnValue(true),
  };

  class MockMarker {
    setLngLat = vi.fn().mockReturnThis();
    setPopup = vi.fn().mockReturnThis();
    addTo = vi.fn().mockReturnThis();
    remove = vi.fn().mockReturnThis();
    togglePopup = vi.fn().mockReturnThis();
  }

  class MockPopup {
    setHTML = vi.fn().mockReturnThis();
    on = vi.fn().mockReturnThis();
    addTo = vi.fn().mockReturnThis();
    remove = vi.fn().mockReturnThis();
    isOpen = vi.fn().mockReturnValue(false);
  }

  return {
    default: {
      Map: vi.fn(() => mockMapInstance),
      Marker: MockMarker,
      Popup: MockPopup,
      setWorkerUrl: vi.fn(),
      getWorkerUrl: vi.fn(),
      addProtocol: vi.fn(),
    },
    Map: vi.fn(() => mockMapInstance),
    Marker: MockMarker,
    Popup: MockPopup,
    setWorkerUrl: vi.fn(),
    getWorkerUrl: vi.fn(),
    addProtocol: vi.fn(),
  };
});

describe('MapView Component (Stitch Civic Precision)', () => {
  describe('wgs84ToUtm30n Coordinate Converter', () => {
    it('should correctly project Madrid coordinates to official UTM Zone 30N', () => {
      // Madrid Gran Vía: 40.42028 N, -3.70379 W
      const utm = wgs84ToUtm30n(40.42028, -3.70379);

      expect(utm.zone).toBe('30N');
      // Expected X around 440,219m +/- 50m
      expect(utm.x).toBeGreaterThan(440150);
      expect(utm.x).toBeLessThan(440300);
      // Expected Y around 4,474,644m
      expect(utm.y).toBeGreaterThan(4474500);
      expect(utm.y).toBeLessThan(4474800);
    });

    it('should correctly project Barcelona coordinates to Zone 30N', () => {
      // Barcelona: 41.39167 N, 2.16472 E
      const utm = wgs84ToUtm30n(41.39167, 2.16472);
      expect(utm.zone).toBe('30N');
      expect(utm.x).toBeGreaterThan(900000);
      expect(utm.y).toBeGreaterThan(4580000);
    });
  });

  describe('Stitch Dark GIS Map HUD & Controls Rendering', () => {
    it('should render Stitch Thematic Layer Switcher with all 4 pillars and basemap pills', () => {
      const mockClick = vi.fn();
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={mockClick}
          propertyName="Gran Vía 28"
          propertyAddress="Gran Vía 28, Madrid"
        />
      );

      // Verify Top-Left HUD
      expect(screen.getByText(/Capas Temáticas GIS/i)).toBeTruthy();
      expect(screen.getByText('Dark GIS')).toBeTruthy();
      expect(screen.getByText('Satélite')).toBeTruthy();
      expect(screen.getByText('IGN')).toBeTruthy();

      // Verify 4 Thematic Pillars
      expect(screen.getByText('Catastro Parcels')).toBeTruthy();
      expect(screen.getByText(/INE Renta \(ADRH\)/i)).toBeTruthy();
      expect(screen.getByText('MITECO Ruido')).toBeTruthy();
      expect(screen.getByText('SNCZI Inundación')).toBeTruthy();
    });

    it('should render ETRS89 Spatial Telemetry and Scale Bar in Bottom HUD', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      // Verify Telemetry Readout
      expect(screen.getByText('UTM ETRS89:')).toBeTruthy();
      expect(screen.getByText(/Huso: 30N/i)).toBeTruthy();
      expect(screen.getByText(/50 m/i)).toBeTruthy();
      expect(screen.getByText(/Sede Electrónica Catastro · INE ADRH/i)).toBeTruthy();
    });

    it('should toggle 3D axonometry mode when clicking Luz 3D thematic lens', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const btn3D = screen.getByTestId('lens-tab-solar');
      expect(btn3D).toBeTruthy();
      fireEvent.click(btn3D);
    });

    it('should switch basemap layer to satellite and dark-gis without errors', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const satBtn = screen.getByText('Satélite');
      fireEvent.click(satBtn);

      const darkBtn = screen.getByText('Dark GIS');
      fireEvent.click(darkBtn);
      expect(darkBtn).toBeTruthy();
    });

    it('should toggle thematic layers for INE Renta, MITECO Ruido and SNCZI Inundacion', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      // Verify checkboxes are rendered and can be clicked
      const ineCheckbox = screen.getByLabelText(/INE Renta/i) || screen.getByText(/INE Renta/i);
      expect(ineCheckbox).toBeTruthy();
      fireEvent.click(ineCheckbox);

      const noiseCheckbox = screen.getByText(/MITECO Ruido/i);
      expect(noiseCheckbox).toBeTruthy();
      fireEvent.click(noiseCheckbox);

      const floodCheckbox = screen.getByText(/SNCZI Inundación/i);
      expect(floodCheckbox).toBeTruthy();
      fireEvent.click(floodCheckbox);
    });

    it('should configure esri-dark source with maxzoom 16 and layer with maxzoom 22 for seamless high-zoom overzooming', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      expect(mapConstructor).toHaveBeenCalled();
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];
      const esriDarkSource = lastCallArgs.style.sources['esri-dark'];
      expect(esriDarkSource.maxzoom).toBe(16);

      const esriDarkLayer = lastCallArgs.style.layers.find((l: any) => l.id === 'esri-dark-layer');
      expect(esriDarkLayer.maxzoom).toBe(22);
    });

    it('should configure PMTiles protocol and vector source for census tracts with interpolated color ramp', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      expect(maplibreMock.addProtocol).toHaveBeenCalledWith('pmtiles', expect.any(Function));

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];
      const ineSource = lastCallArgs.style.sources['ine-income-pmtiles'];
      expect(ineSource).toBeTruthy();
      expect(ineSource.type).toBe('vector');
      expect(ineSource.url).toContain('/api/v1/tiles/census_tracts.pmtiles');

      const ineLayer = lastCallArgs.style.layers.find((l: any) => l.id === 'ine-income-layer');
      expect(ineLayer).toBeTruthy();
      expect(ineLayer.type).toBe('fill');
      expect(ineLayer.paint['fill-color'][0]).toBe('interpolate');
    });

    it('should rely on Legend HUD instead of attaching hover tooltip listeners on ine-income-layer', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const mapInstance = mapConstructor.mock.results[mapConstructor.mock.results.length - 1].value;

      expect(mapInstance.on).not.toHaveBeenCalledWith('mousemove', 'ine-income-layer', expect.any(Function));
      expect(mapInstance.on).not.toHaveBeenCalledWith('mouseleave', 'ine-income-layer', expect.any(Function));
    });
  });

  describe('Phase 11B: Mobile Full-Bleed Map Viewport & Touch FAB Toolbar', () => {
    it('should render the mobile Touch FAB toolbar with Layers FAB, badge, Compass, GPS button, and Zoom controls', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      // Verify Touch FAB Toolbar
      const fabToolbar = screen.getByTestId('mobile-fab-toolbar');
      expect(fabToolbar).toBeTruthy();

      // Layers FAB with badge showing active layers (default 3: Catastro, INE, Isochrones)
      const layersFab = screen.getByTestId('mobile-fab-layers');
      expect(layersFab).toBeTruthy();
      const badge = screen.getByTestId('mobile-layers-badge');
      expect(badge.textContent).toBe('3');

      // Compass FAB with "N" text
      const compassFab = screen.getByTestId('mobile-fab-compass');
      expect(compassFab).toBeTruthy();
      expect(compassFab.textContent).toContain('N');

      // GPS Locate Me FAB
      const locateFab = screen.getByTestId('mobile-fab-locate');
      expect(locateFab).toBeTruthy();

      // Zoom Pair (+ / -)
      expect(screen.getByTestId('mobile-fab-zoom-in')).toBeTruthy();
      expect(screen.getByTestId('mobile-fab-zoom-out')).toBeTruthy();
    });

    it('should render the floating ETRS89 UTM Zone 30N real-time telemetry HUD pill at top-left on mobile', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mobileUtmHud = screen.getByTestId('mobile-utm-hud');
      expect(mobileUtmHud).toBeTruthy();
      expect(mobileUtmHud.textContent).toMatch(/UTM 30N:\s*\d+,\s*\d+\s*·\s*\d+m s\.n\.m\./);
    });

    it('should call navigator.geolocation.getCurrentPosition, pan the map, and trigger onMapClick when GPS Locate Me button is clicked', async () => {
      const mockOnMapClick = vi.fn();
      const mockGetCurrentPosition = vi.fn((success) => {
        success({
          coords: {
            latitude: 40.415363,
            longitude: -3.707398,
            accuracy: 10,
          },
        });
      });

      const originalGeolocation = globalThis.navigator.geolocation;
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: {
          getCurrentPosition: mockGetCurrentPosition,
        },
        writable: true,
        configurable: true,
      });

      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={mockOnMapClick}
        />
      );

      const locateFab = screen.getByTestId('mobile-fab-locate');
      fireEvent.click(locateFab);

      expect(mockGetCurrentPosition).toHaveBeenCalled();
      expect(mockOnMapClick).toHaveBeenCalledWith(40.415363, -3.707398);

      // Restore geolocation
      Object.defineProperty(globalThis.navigator, 'geolocation', {
        value: originalGeolocation,
        writable: true,
        configurable: true,
      });
    });

    it('should toggle mobile layers drawer when clicking mobile Layers FAB and close it on backdrop or close button', () => {
      const onToggleMobileLayers = vi.fn();
      const { rerender } = render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
          onToggleMobileLayers={onToggleMobileLayers}
        />
      );

      // Initially closed
      expect(screen.queryByTestId('mobile-layers-drawer')).toBeNull();

      // Click Layers FAB to open
      const layersFab = screen.getByTestId('mobile-fab-layers');
      fireEvent.click(layersFab);
      expect(onToggleMobileLayers).toHaveBeenCalledWith(true);

      // Rerender with drawer open (controlled mode)
      rerender(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
          isMobileLayersOpen={true}
          onToggleMobileLayers={onToggleMobileLayers}
        />
      );

      const drawer = screen.getByTestId('mobile-layers-drawer');
      expect(drawer).toBeTruthy();
      expect(screen.getByText('Mapas Base')).toBeTruthy();
      expect(screen.getByText('Capas Temáticas Oficiales')).toBeTruthy();
      expect(screen.getByText('Catastro WMS')).toBeTruthy();
      expect(screen.getByText('IGN Topográfico')).toBeTruthy();

      // Verify close button
      const closeBtn = screen.getByTestId('mobile-layers-close');
      fireEvent.click(closeBtn);
      expect(onToggleMobileLayers).toHaveBeenCalledWith(false);

      // Click backdrop also closes
      const backdrop = screen.getByTestId('mobile-layers-backdrop');
      fireEvent.click(backdrop);
      expect(onToggleMobileLayers).toHaveBeenCalledWith(false);
    });

    it('should reset north and pitch when clicking mobile compass FAB', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const compassFab = screen.getByTestId('mobile-fab-compass');
      fireEvent.click(compassFab);

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const mapInstance = mapConstructor.mock.results[0]?.value;
      expect(mapInstance.resetNorthPitch).toHaveBeenCalled();
    });
  });

  describe('Phase 12A & 12B: 3D Building Extrusion & Solar Simulation HUD Integration', () => {
    it('should configure building-3d-source and building-3d-extrusion layer in MapLibre', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];

      // Verify GeoJSON Source
      const buildingSource = lastCallArgs.style.sources['building-3d-source'];
      expect(buildingSource).toBeTruthy();
      expect(buildingSource.type).toBe('geojson');
      expect(buildingSource.data.features.length).toBeGreaterThanOrEqual(1);

      // Verify 3D fill-extrusion layer
      const extrusionLayer = lastCallArgs.style.layers.find(
        (l: any) => l.id === 'building-3d-extrusion'
      );
      expect(extrusionLayer).toBeTruthy();
      expect(extrusionLayer.type).toBe('fill-extrusion');
      expect(extrusionLayer.source).toBe('building-3d-source');
      expect(extrusionLayer.paint['fill-extrusion-height']).toBeDefined();
    });

    it('should render 3D Compass Gizmo and Thematic Lens Selector with Luz 3D', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      // Verify Compass Gizmo exists
      const gizmo = screen.getByTestId('3d-compass-gizmo');
      expect(gizmo).toBeTruthy();
      expect(screen.getByText('VISTA CENITAL')).toBeTruthy();

      // Verify Luz 3D Lens exists
      expect(screen.getByTestId('lens-tab-solar')).toBeTruthy();
    });

    it('should toggle 3D mode via Luz 3D lens, update camera pitch to 55 and bearing to -15, and open Solar HUD', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const btn3D = screen.getByTestId('lens-tab-solar');
      fireEvent.click(btn3D);

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const mapInstance = mapConstructor.mock.results[0]?.value;

      // Verify camera easeTo
      expect(mapInstance.easeTo).toHaveBeenCalledWith(
        expect.objectContaining({ pitch: 55, bearing: -15 })
      );

      // Verify Solar HUD is mounted
      expect(screen.getByTestId('solar-simulation-hud')).toBeTruthy();
      expect(screen.getByText('SIMULADOR SOLAR & SOMBRAS')).toBeTruthy();
      expect(screen.getByText('ÓRBITA 3D')).toBeTruthy();
    });

    it('should allow closing Solar HUD in 3D mode and re-opening it via the floating pill', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      // Enable 3D mode via Luz 3D lens
      const btn3D = screen.getByTestId('lens-tab-solar');
      fireEvent.click(btn3D);

      expect(screen.getByTestId('solar-simulation-hud')).toBeTruthy();

      // Close Solar HUD
      const closeBtn = screen.getByLabelText(/Cerrar Simulador Solar/i);
      fireEvent.click(closeBtn);

      // HUD is unmounted, floating pill is displayed
      expect(screen.queryByTestId('solar-simulation-hud')).toBeNull();
      const reopenBtn = screen.getByTitle(/Abrir Simulador Solar & Sombras/i);
      expect(reopenBtn).toBeTruthy();

      // Click to re-open
      fireEvent.click(reopenBtn);
      expect(screen.getByTestId('solar-simulation-hud')).toBeTruthy();
    });
  });

  describe('Isochrones and Noise Layer Reliability (Bugfix Verification)', () => {
    it('should configure walking isochrones layers with valid MapLibre expressions', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];

      // Verify GeoJSON isochrones source
      const isochroneSource = lastCallArgs.style.sources['walking-isochrones'];
      expect(isochroneSource).toBeTruthy();
      expect(isochroneSource.type).toBe('geojson');

      // Verify layers have valid expression filters (['==', ['get', 'ring'], '<time>'])
      const fill15 = lastCallArgs.style.layers.find((l: any) => l.id === 'isochrone-15m-fill');
      const fill10 = lastCallArgs.style.layers.find((l: any) => l.id === 'isochrone-10m-fill');
      const fill5 = lastCallArgs.style.layers.find((l: any) => l.id === 'isochrone-5m-fill');

      expect(fill15).toBeTruthy();
      expect(fill15.filter).toEqual(['==', ['get', 'ring'], '15m']);
      expect(fill10).toBeTruthy();
      expect(fill10.filter).toEqual(['==', ['get', 'ring'], '10m']);
      expect(fill5).toBeTruthy();
      expect(fill5.filter).toEqual(['==', ['get', 'ring'], '5m']);

      const line15 = lastCallArgs.style.layers.find((l: any) => l.id === 'isochrone-15m-line');
      expect(line15).toBeTruthy();
      expect(line15.filter).toEqual(['==', ['get', 'ring'], '15m']);
    });

    it('should configure MITECO SICA and SNCZI PMTiles vector sources and overzoom up to z22', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];

      const sicaSource = lastCallArgs.style.sources['miteco-sica'];
      expect(sicaSource).toBeTruthy();
      expect(sicaSource.type).toBe('vector');
      expect(sicaSource.url).toContain('/api/v1/tiles/noise.pmtiles');

      const sncziSource = lastCallArgs.style.sources['miteco-snczi'];
      expect(sncziSource).toBeTruthy();
      expect(sncziSource.type).toBe('vector');
      expect(sncziSource.url).toContain('/api/v1/tiles/floods.pmtiles');

      // Verify layers allow zooming past z19 (up to z22)
      const sicaHalo = lastCallArgs.style.layers.find((l: any) => l.id === 'sica-isophone-halo');
      expect(sicaHalo).toBeTruthy();
      expect(sicaHalo.type).toBe('line');
      expect(sicaHalo.maxzoom).toBe(22);

      // Verify no fill layer exists for SICA noise (eliminates polygon closing artifacts)
      const sicaFillLayer = lastCallArgs.style.layers.find((l: any) => l.id === 'sica-layer');
      expect(sicaFillLayer).toBeUndefined();

      const sncziLayer = lastCallArgs.style.layers.find((l: any) => l.id === 'snczi-layer');
      expect(sncziLayer).toBeTruthy();
      expect(sncziLayer.type).toBe('fill');
      expect(sncziLayer.maxzoom).toBe(22);
    });

    it('should configure MITECO SICA as acoustic ribbon corridors without fill polygon artifacts', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];

      // Verify no fill layer exists for noise
      const sicaFill = lastCallArgs.style.layers.find((l: any) => l.id === 'sica-layer');
      expect(sicaFill).toBeUndefined();

      // Verify sica-isophone-halo (diffuse acoustic glow ribbon corridor)
      const sicaHalo = lastCallArgs.style.layers.find((l: any) => l.id === 'sica-isophone-halo');
      expect(sicaHalo).toBeTruthy();
      expect(sicaHalo.type).toBe('line');
      expect(sicaHalo.paint['line-blur']).toBeDefined();
      expect(sicaHalo.layout['line-join']).toBe('round');
      expect(sicaHalo.layout['line-cap']).toBe('round');

      // Verify zoom-driven attenuation expression for halo ribbon
      const haloOpacity = sicaHalo.paint['line-opacity'];
      expect(Array.isArray(haloOpacity)).toBe(true);
      expect(haloOpacity[0]).toBe('interpolate');
      expect(haloOpacity[1]).toEqual(['linear']);
      expect(haloOpacity[2]).toEqual(['zoom']);

      // Verify sica-borders (sharp isophone contour line)
      const sicaBorders = lastCallArgs.style.layers.find((l: any) => l.id === 'sica-borders');
      expect(sicaBorders).toBeTruthy();
      expect(sicaBorders.type).toBe('line');
      expect(sicaBorders.paint['line-width']).toBeDefined();
      expect(sicaBorders.layout['line-join']).toBe('round');
      expect(sicaBorders.layout['line-cap']).toBe('round');
    });

    it('should enforce WebGL layer render stack order: ground acoustic below cadastre and 3D buildings', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const layers: any[] = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0].style.layers;

      const sicaHaloIndex = layers.findIndex((l) => l.id === 'sica-isophone-halo');
      const sicaBordersIndex = layers.findIndex((l) => l.id === 'sica-borders');
      const sncziIndex = layers.findIndex((l) => l.id === 'snczi-layer');
      const catastroIndex = layers.findIndex((l) => l.id === 'catastro-layer');
      const building3dIndex = layers.findIndex((l) => l.id === 'building-3d-extrusion');

      expect(sicaHaloIndex).toBeGreaterThan(-1);
      expect(sicaBordersIndex).toBeGreaterThan(-1);
      expect(sncziIndex).toBeGreaterThan(-1);
      expect(catastroIndex).toBeGreaterThan(-1);
      expect(building3dIndex).toBeGreaterThan(-1);

      // SICA and SNCZI must render on ground plane below Cadastre
      expect(sicaHaloIndex).toBeLessThan(catastroIndex);
      expect(sicaBordersIndex).toBeLessThan(catastroIndex);
      expect(sncziIndex).toBeLessThan(catastroIndex);

      // Cadastre must render below 3D buildings
      expect(catastroIndex).toBeLessThan(building3dIndex);
    });

    it('should coherently stack MITECO SNCZI flood sheets from outer T=500 to core ZFP with antialiased borders without seam artifacts', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const layers: any[] = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0].style.layers;

      const sncziOuter = layers.find((l) => l.id === 'snczi-layer');
      const sncziT100 = layers.find((l) => l.id === 'snczi-t100-layer');
      const sncziT10 = layers.find((l) => l.id === 'snczi-t10-layer');
      const sncziZfp = layers.find((l) => l.id === 'snczi-zfp-layer');
      const sncziBorders = layers.find((l) => l.id === 'snczi-borders');

      expect(sncziOuter).toBeTruthy();
      expect(sncziT100).toBeTruthy();
      expect(sncziT10).toBeTruthy();
      expect(sncziZfp).toBeTruthy();
      expect(sncziBorders).toBeTruthy();

      // Outer sheet T=500: official MITECO sky blue / celeste
      expect(sncziOuter.paint['fill-color']).toBe('#38bdf8');
      expect(sncziOuter.paint['fill-antialias']).toBe(true);
      expect(sncziOuter.paint['fill-outline-color']).toBeUndefined(); // Seam-free: no conflicting outline

      // Core ZFP: official MITECO midnight indigo warning
      expect(sncziZfp.paint['fill-color']).toBe('#172554');
      expect(sncziZfp.paint['fill-antialias']).toBe(true);

      // High energy T=10: official MITECO deep navy blue
      expect(sncziT10.paint['fill-color']).toBe('#1e3a8a');

      // Borders: line layer with round joins and anti-jitter blur
      expect(sncziBorders.type).toBe('line');
      expect(sncziBorders.layout['line-join']).toBe('round');
      expect(sncziBorders.paint['line-blur']).toBe(0.5);

      // Verify layer stacking hierarchy (T=500 bottom -> T=100 -> T=10 -> ZFP top -> Borders)
      const idxOuter = layers.indexOf(sncziOuter);
      const idxT100 = layers.indexOf(sncziT100);
      const idxT10 = layers.indexOf(sncziT10);
      const idxZfp = layers.indexOf(sncziZfp);
      const idxBorders = layers.indexOf(sncziBorders);

      expect(idxOuter).toBeLessThan(idxT100);
      expect(idxT100).toBeLessThan(idxT10);
      expect(idxT10).toBeLessThan(idxZfp);
      expect(idxZfp).toBeLessThan(idxBorders);
    });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapView, wgs84ToUtm30n } from '../src/components/MapView';

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
  }

  return {
    default: {
      Map: vi.fn(() => mockMapInstance),
      Marker: MockMarker,
      Popup: MockPopup,
    },
    Map: vi.fn(() => mockMapInstance),
    Marker: MockMarker,
    Popup: MockPopup,
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

    it('should toggle 3D axonometry mode when clicking 3D button', () => {
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const btn3D = screen.getByTitle(/Alternar Perspectiva 3D/i);
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

    it('should configure ine-income-wms source with official INE ADRH MapServer choropleth endpoint', async () => {
      const maplibreMock = await import('maplibre-gl');
      render(
        <MapView
          selectedCoords={{ lat: 40.42028, lon: -3.70379 }}
          onMapClick={vi.fn()}
        />
      );

      const mapConstructor = maplibreMock.Map as unknown as ReturnType<typeof vi.fn>;
      const lastCallArgs = mapConstructor.mock.calls[mapConstructor.mock.calls.length - 1][0];
      const ineSource = lastCallArgs.style.sources['ine-income-wms'];
      expect(ineSource).toBeTruthy();
      expect(ineSource.tiles[0]).toContain('ADRH_renta_media_por_hogar/MapServer/export');
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

      const originalGeolocation = global.navigator.geolocation;
      Object.defineProperty(global.navigator, 'geolocation', {
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
      Object.defineProperty(global.navigator, 'geolocation', {
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
});

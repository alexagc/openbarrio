import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MapView, wgs84ToUtm30n } from '../src/components/MapView';

// Mock MapLibre GL
vi.mock('maplibre-gl', () => {
  const mockMapInstance = {
    on: vi.fn(),
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
  });
});


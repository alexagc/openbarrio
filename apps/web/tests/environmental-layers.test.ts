import { describe, it, expect, vi } from 'vitest';
import {
  getSicaOpacityExpression,
  getSicaBorderOpacityExpression,
  getSncziOpacityExpression,
  getSncziBorderOpacityExpression,
  useEnvironmentalLayers,
} from '../src/components/map/hooks/useEnvironmentalLayers';
import { renderHook } from '@testing-library/react';

describe('useEnvironmentalLayers Micro-Cartography & Zoom Expressions', () => {
  describe('getSicaOpacityExpression', () => {
    it('produces standard zoom-driven attenuation stops at multiplier 1', () => {
      const expr = getSicaOpacityExpression(1);
      expect(expr[0]).toBe('interpolate');
      expect(expr[1]).toEqual(['linear']);
      expect(expr[2]).toEqual(['zoom']);

      // Macro-zoom (Z6-Z13): 0.35 down to 0.25
      expect(expr[3]).toBe(6);
      expect(expr[4]).toBe(0.35);
      expect(expr[5]).toBe(13);
      expect(expr[6]).toBe(0.25);

      // Micro-zoom transition (Z14-Z19): 0.16 down to 0.06 ambient cushion
      expect(expr[7]).toBe(14);
      expect(expr[8]).toBe(0.16);
      expect(expr[9]).toBe(16);
      expect(expr[10]).toBe(0.1);
      expect(expr[11]).toBe(18);
      expect(expr[12]).toBe(0.08);
      expect(expr[13]).toBe(19);
      expect(expr[14]).toBe(0.06);
    });

    it('scales proportionally with custom multiplier without exceeding 1.0', () => {
      const exprHigh = getSicaOpacityExpression(2.0);
      expect(exprHigh[4]).toBe(0.7); // 0.35 * 2.0
      expect(exprHigh[14]).toBe(0.12); // 0.06 * 2.0

      const exprLow = getSicaOpacityExpression(0.5);
      expect(exprLow[4]).toBe(0.175); // 0.35 * 0.5
      expect(exprLow[14]).toBe(0.03); // 0.06 * 0.5
    });
  });

  describe('getSicaBorderOpacityExpression', () => {
    it('produces subtle perimeter attenuation for diffuse noise contours', () => {
      const expr = getSicaBorderOpacityExpression(1);
      expect(expr[0]).toBe('interpolate');
      expect(expr[3]).toBe(8);
      expect(expr[4]).toBe(0.75);
      expect(expr[6]).toBe(0.85);
      expect(expr[8]).toBe(0.9);
      expect(expr[10]).toBe(0.85);
    });
  });

  describe('getSncziOpacityExpression', () => {
    it('generates coherent step attenuation based on baseMax', () => {
      const exprZfp = getSncziOpacityExpression(0.75, 1);
      expect(exprZfp[4]).toBe(0.75); // z6
      expect(exprZfp[6]).toBe(0.69); // z13 (0.75 * 0.92)
      expect(exprZfp[8]).toBe(0.585); // z16 (0.75 * 0.78)
      expect(exprZfp[10]).toBe(0.465); // z19 (0.75 * 0.62)

      const exprT500 = getSncziOpacityExpression(0.45, 1);
      expect(exprT500[4]).toBe(0.45);
      expect(exprT500[10]).toBe(0.279);
    });
  });

  describe('getSncziBorderOpacityExpression', () => {
    it('generates smooth border line opacity expression', () => {
      const expr = getSncziBorderOpacityExpression(1);
      expect(expr[0]).toBe('interpolate');
      expect(expr[3]).toBe(8);
      expect(expr[4]).toBe(0.6);
      expect(expr[6]).toBe(0.8);
      expect(expr[8]).toBe(0.85);
      expect(expr[10]).toBe(0.75);
    });
  });

  describe('useEnvironmentalLayers hook lifecycle', () => {
    it('applies visibility and zoom-attenuated paint properties to all stacked layers', () => {
      const mockSetLayout = vi.fn();
      const mockSetPaint = vi.fn();
      const mockGetLayer = vi.fn().mockImplementation((id: string) => {
        if (['snczi-layer', 'snczi-t100-layer', 'snczi-t10-layer', 'snczi-zfp-layer', 'snczi-borders', 'sica-isophone-halo', 'sica-borders'].includes(id)) {
          return { id, type: id.includes('snczi-layer') || id.includes('snczi-t') || id.includes('snczi-zfp') ? 'fill' : 'line' };
        }
        return null;
      });

      const mockMap = {
        getLayer: mockGetLayer,
        setLayoutProperty: mockSetLayout,
        setPaintProperty: mockSetPaint,
      } as any;

      renderHook(() =>
        useEnvironmentalLayers({
          map: mockMap,
          showIneIncome: false,
          showMitecoNoise: true,
          showSncziFlood: true,
          ineOpacity: 0.75,
          noiseOpacity: 0.75,
          floodOpacity: 0.75,
        })
      );

      // Verify SICA visibility & paint properties for acoustic ribbons
      expect(mockSetLayout).toHaveBeenCalledWith('sica-isophone-halo', 'visibility', 'visible');
      expect(mockSetLayout).toHaveBeenCalledWith('sica-borders', 'visibility', 'visible');
      expect(mockSetPaint).toHaveBeenCalledWith(
        'sica-isophone-halo',
        'line-opacity',
        expect.arrayContaining(['interpolate'])
      );
      expect(mockSetPaint).toHaveBeenCalledWith(
        'sica-borders',
        'line-opacity',
        expect.arrayContaining(['interpolate'])
      );

      // Verify SNCZI all 4 stacked sheets + borders
      expect(mockSetLayout).toHaveBeenCalledWith('snczi-layer', 'visibility', 'visible');
      expect(mockSetLayout).toHaveBeenCalledWith('snczi-t100-layer', 'visibility', 'visible');
      expect(mockSetLayout).toHaveBeenCalledWith('snczi-t10-layer', 'visibility', 'visible');
      expect(mockSetLayout).toHaveBeenCalledWith('snczi-zfp-layer', 'visibility', 'visible');
      expect(mockSetLayout).toHaveBeenCalledWith('snczi-borders', 'visibility', 'visible');

      expect(mockSetPaint).toHaveBeenCalledWith(
        'snczi-layer',
        'fill-opacity',
        expect.arrayContaining(['interpolate'])
      );
      expect(mockSetPaint).toHaveBeenCalledWith(
        'snczi-zfp-layer',
        'fill-opacity',
        expect.arrayContaining(['interpolate'])
      );
      expect(mockSetPaint).toHaveBeenCalledWith(
        'snczi-borders',
        'line-opacity',
        expect.arrayContaining(['interpolate'])
      );
    });
  });
});

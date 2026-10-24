import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { parseUrlState } from '../src/hooks/useUrlSync';

describe('useUrlSync & parseUrlState', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/',
        search: '',
        href: 'http://localhost/',
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });

  it('parses default landing state when path is root and has no params', () => {
    window.location.pathname = '/';
    window.location.search = '';

    const state = parseUrlState();
    expect(state.viewMode).toBe('landing');
    expect(state.activeTab).toBe('dossier');
    expect(state.refcat).toBeUndefined();
    expect(state.coords).toBeUndefined();
  });

  it('parses map mode and refcat when /map?refcat=9872023VH5797S is queried', () => {
    window.location.pathname = '/map';
    window.location.search = '?refcat=9872023VH5797S';

    const state = parseUrlState();
    expect(state.viewMode).toBe('map');
    expect(state.activeTab).toBe('dossier');
    expect(state.refcat).toBe('9872023VH5797S');
  });

  it('supports alias ?rc=... parameter and converts to uppercase', () => {
    window.location.pathname = '/map';
    window.location.search = '?rc=9872023vh5797s0001wx';

    const state = parseUrlState();
    expect(state.viewMode).toBe('map');
    expect(state.refcat).toBe('9872023VH5797S0001WX');
  });

  it('parses coordinates and active tab when ?lat=40.42028&lon=-3.70379&tab=map', () => {
    window.location.pathname = '/map';
    window.location.search = '?lat=40.42028&lon=-3.70379&tab=map';

    const state = parseUrlState();
    expect(state.viewMode).toBe('map');
    expect(state.activeTab).toBe('map');
    expect(state.coords).toEqual({ lat: 40.42028, lon: -3.70379 });
  });

  it('switches viewMode to map automatically when refcat or coords are present even if path is root', () => {
    window.location.pathname = '/';
    window.location.search = '?refcat=9872023VH5797S0001WX';

    const state = parseUrlState();
    expect(state.viewMode).toBe('map');
    expect(state.refcat).toBe('9872023VH5797S0001WX');
  });
});

import { describe, it, expect } from 'vitest';
import { Value } from '@sinclair/typebox/value';
import {
  BUNDLED_PORTAL_SELECTORS,
  LISTING_MAX_PASTE_BYTES,
  ListingResolveRequestSchema,
  PORTAL_HOST_ALLOWLIST,
  SELECTORS_MAX_BYTES,
  compareSemver,
  validateRemoteSelectorsBundle,
} from '../src/index.js';

describe('Listing & Remote Selectors Schemas (@openbarrio/core)', () => {
  it('allows only exact 5-portal hostnames in PORTAL_HOST_ALLOWLIST', () => {
    expect(PORTAL_HOST_ALLOWLIST['www.idealista.com']).toBe('idealista');
    expect(PORTAL_HOST_ALLOWLIST['www.fotocasa.es']).toBe('fotocasa');
    expect(PORTAL_HOST_ALLOWLIST['www.habitaclia.com']).toBe('habitaclia');
    expect(PORTAL_HOST_ALLOWLIST['www.pisos.com']).toBe('pisos');
    expect(PORTAL_HOST_ALLOWLIST['www.yaencontre.com']).toBe('yaencontre');
    expect(PORTAL_HOST_ALLOWLIST['evil-idealista.com']).toBeUndefined();
    expect(LISTING_MAX_PASTE_BYTES).toBe(200 * 1024);
  });

  it('validates ListingResolveRequestSchema strictly without extra properties', () => {
    expect(
      Value.Check(ListingResolveRequestSchema, {
        url: 'https://www.idealista.com/inmueble/104567890/',
      })
    ).toBe(true);
    expect(
      Value.Check(ListingResolveRequestSchema, {
        url: 'https://www.idealista.com/inmueble/104567890/',
        unexpected: true,
      })
    ).toBe(false);
  });

  it('compares semver strings accurately', () => {
    expect(compareSemver('1.4.0', '1.4.0')).toBe(0);
    expect(compareSemver('1.4.1', '1.4.0')).toBe(1);
    expect(compareSemver('1.3.9', '1.4.0')).toBe(-1);
  });

  it('accepts valid non-downgrading remote selector JSON bundles and rejects downgrades/oversize/code', () => {
    const upgradeBundle = {
      ...BUNDLED_PORTAL_SELECTORS,
      version: '1.4.1',
    };
    const valid = validateRemoteSelectorsBundle(JSON.stringify(upgradeBundle), '1.4.0');
    expect(valid.valid).toBe(true);

    // Downgrade rejected
    const downgradeBundle = {
      ...BUNDLED_PORTAL_SELECTORS,
      version: '1.3.2',
    };
    const downgrade = validateRemoteSelectorsBundle(JSON.stringify(downgradeBundle), '1.4.0');
    expect(downgrade).toEqual({ valid: false, reason: 'version_downgrade' });

    // Oversize > 32 KB rejected
    const huge = ' '.repeat(SELECTORS_MAX_BYTES + 10);
    expect(validateRemoteSelectorsBundle(huge, '1.4.0')).toEqual({
      valid: false,
      reason: 'oversize',
    });

    // Unsafe selector string rejected
    const unsafeBundle = structuredClone(BUNDLED_PORTAL_SELECTORS);
    unsafeBundle.portals.idealista.title = ['<script>alert(1)</script>'];
    expect(validateRemoteSelectorsBundle(JSON.stringify(unsafeBundle), '1.4.0')).toEqual({
      valid: false,
      reason: 'unsafe_selector',
    });

    // Invalid JSON rejected
    expect(validateRemoteSelectorsBundle('{broken', '1.4.0')).toEqual({
      valid: false,
      reason: 'invalid_json',
    });
  });
});

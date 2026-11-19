import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  METHODOLOGY_VERSION,
  SCORING_WEIGHTS_BY_TYPOLOGY,
  SCORING_MODIFIERS,
  METHODOLOGY_CHANGELOG,
} from '../src/scoring/weights.js';
import {
  STALE_FRESH_DAYS,
  STALE_AMBER_DAYS,
  STALE_MAX_DAYS,
} from '../src/types/data-status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docPath = path.resolve(__dirname, '../../../docs/methodology/barrioscore.md');

describe('BarrioScore Methodology Doc <-> Core Code Sync', () => {
  const markdown = fs.readFileSync(docPath, 'utf8');

  it('documents the exact live METHODOLOGY_VERSION', () => {
    expect(markdown).toContain(`**Methodology Version:** \`${METHODOLOGY_VERSION}\``);
  });

  it('documents the exact typology weights table from SCORING_WEIGHTS_BY_TYPOLOGY', () => {
    for (const [typology, weights] of Object.entries(SCORING_WEIGHTS_BY_TYPOLOGY)) {
      const pct = (w: number) => `${Math.round(w * 100)}%`;
      const expectedRow = `| \`${typology}\` | \`${pct(weights.connectivity)}\` | \`${pct(weights.building)}\` | \`${pct(weights.socioeconomic)}\` | \`${pct(weights.environmental)}\` | \`${pct(weights.urbanPlanning)}\` |`;
      expect(markdown).toContain(expectedRow);

      const sum =
        weights.connectivity +
        weights.building +
        weights.socioeconomic +
        weights.environmental +
        weights.urbanPlanning;
      expect(sum).toBeCloseTo(1, 5);
    }
  });

  it('documents every modifier and exact signed adjustment from SCORING_MODIFIERS', () => {
    for (const mod of SCORING_MODIFIERS) {
      expect(markdown).toContain(`| \`${mod.id}\` | \`${mod.pillar}\` | \`${mod.signedLabel}\` |`);
    }
  });

  it('documents exact stale snapshot day thresholds and methodology changelog entries', () => {
    expect(markdown).toContain(`STALE_FRESH_DAYS = ${STALE_FRESH_DAYS}`);
    expect(markdown).toContain(`STALE_AMBER_DAYS = ${STALE_AMBER_DAYS}`);
    expect(markdown).toContain(`STALE_MAX_DAYS = ${STALE_MAX_DAYS}`);

    for (const entry of METHODOLOGY_CHANGELOG) {
      expect(markdown).toContain(`\`${entry.version}\``);
      expect(markdown).toContain(entry.date);
    }
  });
});

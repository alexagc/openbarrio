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
import { PROFILE_IDS, PROFILE_TEMPLATES } from '../src/scoring/profiles.js';
import { VISIT_CHECKLIST_ITEM_IDS } from '../src/checklist/generate-visit-checklist.js';
import {
  BROADBAND_STALE_MAX_DAYS,
  STALE_FRESH_DAYS,
  STALE_AMBER_DAYS,
  STALE_MAX_DAYS,
} from '../src/types/data-status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docPath = path.resolve(__dirname, '../../../docs/methodology/barrioscore.md');
const broadbandResearchDocPath = path.resolve(__dirname, '../../../docs/research/broadband-coverage.md');
const profilesDocPath = path.resolve(__dirname, '../../../docs/methodology/profiles.md');
const checklistDocPath = path.resolve(__dirname, '../../../docs/methodology/visit-checklist.md');

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
    expect(markdown).toContain(`BROADBAND_STALE_MAX_DAYS = ${BROADBAND_STALE_MAX_DAYS}`);

    const broadbandResearchMd = fs.readFileSync(broadbandResearchDocPath, 'utf8');
    expect(broadbandResearchMd).toContain(`BROADBAND_STALE_MAX_DAYS = ${BROADBAND_STALE_MAX_DAYS}`);

    for (const entry of METHODOLOGY_CHANGELOG) {
      expect(markdown).toContain(`\`${entry.version}\``);
      expect(markdown).toContain(entry.date);
    }
  });

  it('documents every decision profile and exact pillar multipliers in profiles.md', () => {
    const profilesMd = fs.readFileSync(profilesDocPath, 'utf8');
    expect(profilesMd).toContain(`**Methodology Version:** \`${METHODOLOGY_VERSION}\``);

    for (const pid of PROFILE_IDS) {
      const m = PROFILE_TEMPLATES[pid].pillarWeightMultipliers;
      const expectedRow = `| \`${pid}\` | \`×${m.connectivity}\` | \`×${m.building}\` | \`×${m.socioeconomic}\` | \`×${m.environmental}\` | \`×${m.urbanPlanning}\` |`;
      expect(profilesMd).toContain(expectedRow);
    }
  });

  it('documents every deterministic checklist alert ID in visit-checklist.md', () => {
    const checklistMd = fs.readFileSync(checklistDocPath, 'utf8');
    expect(checklistMd).toContain(`**Methodology Version:** \`${METHODOLOGY_VERSION}\``);

    for (const id of VISIT_CHECKLIST_ITEM_IDS) {
      expect(checklistMd).toContain(`\`${id}\``);
    }
    expect(checklistMd).toContain('`unverified_<layer>`');
  });
});

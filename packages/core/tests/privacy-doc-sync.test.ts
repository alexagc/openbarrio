import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_LENS_VALUES,
  ANALYTICS_MAX_PAYLOAD_BYTES,
  ANALYTICS_RETENTION_MONTHS,
  ANALYTICS_RETURNING_WINDOW_DAYS,
  VISIT_MODE_MAX_DOSSIERS,
} from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const privacyDocPath = path.resolve(__dirname, '../../../docs/privacy.md');

describe('Privacy Policy Doc <-> Core Telemetry Contract Sync', () => {
  const markdown = fs.readFileSync(privacyDocPath, 'utf8');

  it('documents the exact closed set of ANALYTICS_EVENTS with zero missing or undocumented events', () => {
    const sectionMatch = markdown.match(
      /## 3\. Exact Telemetry Events Collected([\s\S]*?)## 4\./
    );
    expect(sectionMatch).not.toBeNull();
    const eventsSection = sectionMatch![1]!;

    const documentedEvents: string[] = [];
    for (const line of eventsSection.split(/\r?\n/)) {
      const rowMatch = /^\|\s*`([a-z0-9_]+)`\s*\|/.exec(line.trim());
      if (rowMatch?.[1]) {
        documentedEvents.push(rowMatch[1]);
      }
    }

    expect(documentedEvents.sort()).toEqual([...ANALYTICS_EVENTS].sort());
  });

  it('documents every allowed lens value in ANALYTICS_LENS_VALUES', () => {
    for (const lens of ANALYTICS_LENS_VALUES) {
      expect(markdown).toContain(`\`${lens}\``);
    }
  });

  it('documents exact retention, returning window, payload limit, and LRU cap constants', () => {
    expect(markdown).toContain(`ANALYTICS_RETENTION_MONTHS = ${ANALYTICS_RETENTION_MONTHS}`);
    expect(markdown).toContain(
      `ANALYTICS_RETURNING_WINDOW_DAYS = ${ANALYTICS_RETURNING_WINDOW_DAYS}`
    );
    expect(markdown).toContain(`ANALYTICS_MAX_PAYLOAD_BYTES = ${ANALYTICS_MAX_PAYLOAD_BYTES}`);
    expect(markdown).toContain(`VISIT_MODE_MAX_DOSSIERS = ${VISIT_MODE_MAX_DOSSIERS}`);
  });
});

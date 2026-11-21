import type { VisitChecklist, VisitChecklistItem } from '@openbarrio/core';

export type ChecklistTranslator = (
  key: string,
  params?: Record<string, string | number>
) => string;

function formatItemLines(
  item: VisitChecklistItem,
  t: ChecklistTranslator,
  format: 'md' | 'txt'
): string[] {
  const title = t(item.titleKey, item.params);
  const severityLabel = t(`checklist.severity.${item.severity}`);
  const statusLabel = t(`uncertainty.status.${item.layerStatus}`);
  const ask = item.askKey ? t(item.askKey, item.params) : null;
  const verify = item.verifyKey ? t(item.verifyKey, item.params) : null;

  if (format === 'md') {
    const lines = [`- [ ] **[${severityLabel}]** ${title} _(${item.sourceLayer}: ${statusLabel})_`];
    if (ask) lines.push(`  - ${t('checklist.askLabel')}: ${ask}`);
    if (verify) lines.push(`  - ${t('checklist.verifyLabel')}: ${verify}`);
    return lines;
  }

  const lines = [`[ ] [${severityLabel}] ${title} (${item.sourceLayer}: ${statusLabel})`];
  if (ask) lines.push(`    ${t('checklist.askLabel')}: ${ask}`);
  if (verify) lines.push(`    ${t('checklist.verifyLabel')}: ${verify}`);
  return lines;
}

/**
 * Formats a VisitChecklist into deterministic Markdown or plain-text output.
 */
export function formatChecklistExport(
  checklist: VisitChecklist,
  format: 'md' | 'txt',
  t: ChecklistTranslator
): string {
  const headerTitle = t('checklist.title');
  const metaRef = `${t('checklist.exportRefcatLabel')}: ${checklist.refcat}`;
  const metaDate = `${t('checklist.exportDateLabel')}: ${checklist.generatedAt}`;
  const metaProfile = `${t('checklist.exportProfileLabel')}: ${
    checklist.profile === 'none'
      ? t('checklist.exportProfileNone')
      : t(`profiles.options.${checklist.profile}.label`)
  }`;

  const lines: string[] =
    format === 'md'
      ? [`# ${headerTitle}`, '', `- ${metaRef}`, `- ${metaDate}`, `- ${metaProfile}`, '']
      : [headerTitle, '='.repeat(headerTitle.length), metaRef, metaDate, metaProfile, ''];

  if (checklist.items.length === 0) {
    lines.push(t('checklist.emptyTitle'));
    lines.push(t('checklist.emptyDesc'));
  } else {
    for (const item of checklist.items) {
      lines.push(...formatItemLines(item, t, format));
    }
  }

  lines.push('');
  lines.push(format === 'md' ? `> ${t('checklist.legalDisclaimer')}` : t('checklist.legalDisclaimer'));
  lines.push('');

  return lines.join('\n');
}

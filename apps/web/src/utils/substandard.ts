import { PropertyAuditReport } from '@openbarrio/core';

/**
 * Checks whether an audit report flags substandard housing or illegal
 * commercial-to-residential conversion (Infravivienda).
 *
 * Checks:
 * 1. report.substandardHousing.isAlert or severity === 'HIGH'
 * 2. report.score.substandardHousing alert
 * 3. report.score.keyRisks mentioning "Presunto local", "infravivienda", "substandard", etc.
 */
export function isSubstandardHousing(report?: PropertyAuditReport | null): boolean {
  if (!report) return false;

  const sub = (report as unknown as { substandardHousing?: { isAlert?: boolean; severity?: string } })
    .substandardHousing;
  if (sub?.isAlert || sub?.severity === 'HIGH') {
    return true;
  }

  const scoreSub = (report.score as unknown as { substandardHousing?: { isAlert?: boolean; severity?: string } })
    ?.substandardHousing;
  if (scoreSub?.isAlert || scoreSub?.severity === 'HIGH') {
    return true;
  }

  const risks = report.score?.keyRisks || [];
  return risks.some((r: string) => {
    const l = r.toLowerCase();
    return (
      l.includes('presunto local') ||
      l.includes('infravivienda') ||
      l.includes('substandard') ||
      l.includes('local comercial sin cédula') ||
      l.includes('commercial-to-residential')
    );
  });
}

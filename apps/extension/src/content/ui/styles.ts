export const WIDGET_STYLES = `
:host {
  all: initial;
  display: block;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.ob-card {
  width: 340px;
  max-width: calc(100vw - 48px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.18), 0 4px 12px -2px rgba(15, 23, 42, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.ob-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.ob-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ob-logo {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 800;
  font-size: 11px;
}

.ob-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.ob-badge-official {
  font-size: 10px;
  font-weight: 600;
  color: #4338ca;
  background: #e0e7ff;
  padding: 2px 6px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ob-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ob-btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 1;
  transition: all 0.15s ease;
}

.ob-btn-icon:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.ob-body {
  padding: 14px 16px;
}

/* Score Section */
.ob-score-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid;
}

.ob-score-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
  border: 2px solid;
}

.ob-score-number {
  font-size: 20px;
  line-height: 1;
}

.ob-score-max {
  font-size: 9px;
  font-weight: 600;
  opacity: 0.8;
  margin-top: 1px;
}

.ob-score-info {
  flex: 1;
}

.ob-score-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 2px 0;
}

.ob-score-desc {
  font-size: 11px;
  opacity: 0.85;
  margin: 0;
  line-height: 1.3;
}

/* Stressed Housing Alert */
.ob-stressed-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  margin-bottom: 12px;
}

.ob-stressed-icon {
  color: #b45309;
  font-size: 16px;
  line-height: 1;
  margin-top: 1px;
}

.ob-stressed-content {
  flex: 1;
}

.ob-stressed-title {
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  margin: 0 0 2px 0;
}

.ob-stressed-detail {
  font-size: 11px;
  color: #78350f;
  margin: 0;
  line-height: 1.3;
}

/* Grid Breakdown */
.ob-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.ob-stat-box {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 10px;
}

.ob-stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.ob-stat-value {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

/* CTA Footer */
.ob-footer {
  padding-top: 2px;
}

.ob-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 9px 12px;
  background: #4f46e5;
  color: #ffffff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.15s ease;
  border: none;
  cursor: pointer;
}

.ob-btn-primary:hover {
  background: #4338ca;
}

/* Collapsed Pill */
.ob-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #ffffff;
  border-radius: 9999px;
  box-shadow: 0 8px 24px -2px rgba(15, 23, 42, 0.2);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ob-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -2px rgba(15, 23, 42, 0.25);
}

.ob-pill-score {
  font-size: 12px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 9999px;
}

.ob-pill-label {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

/* Skeleton Loading */
.ob-skeleton-shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ob-shimmer 1.5s infinite;
  border-radius: 6px;
}

@keyframes ob-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.ob-skeleton-score {
  width: 52px;
  height: 52px;
  border-radius: 50%;
}

.ob-skeleton-line {
  height: 12px;
  margin-bottom: 6px;
}

.ob-skeleton-line.sm {
  width: 60%;
}

.ob-skeleton-line.md {
  width: 80%;
}
`;

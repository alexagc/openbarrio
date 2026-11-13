export const WIDGET_STYLES = `
:host {
  all: initial;
  display: block;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483647;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #dae2fd;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

.ob-card {
  width: 360px;
  max-width: calc(100vw - 48px);
  background: #0b1326;
  border-radius: 16px;
  box-shadow: 0 12px 32px -4px rgba(6, 14, 32, 0.75), 0 4px 12px -2px rgba(6, 14, 32, 0.5);
  border: 1px solid #3d4a42;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: #dae2fd;
}

.ob-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #131b2e;
  border-bottom: 1px solid #3d4a42;
}

.ob-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ob-logo {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #25a475;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #002114;
  font-weight: 800;
  font-size: 11px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-title {
  font-size: 13px;
  font-weight: 700;
  color: #dae2fd;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-badge-official {
  font-size: 10px;
  font-weight: 600;
  color: #68dba9;
  background: rgba(104, 219, 169, 0.15);
  border: 1px solid rgba(104, 219, 169, 0.35);
  padding: 1px 6px;
  border-radius: 9999px;
  text-transform: uppercase;
}

.ob-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ob-btn-icon {
  background: transparent;
  border: none;
  color: #bccac0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: background 0.15s ease, color 0.15s ease;
}

.ob-btn-icon:hover {
  background: #222a3d;
  color: #dae2fd;
}

.ob-body {
  padding: 16px;
  background: #0b1326;
}

/* Main Score Banner */
.ob-score-banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  border-width: 1px;
  border-style: solid;
  margin-bottom: 10px;
  background: #171f33;
}

.ob-score-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border-width: 3px;
  border-style: solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #131b2e !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.ob-score-number {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  font-family: 'JetBrains Mono', monospace;
}

.ob-score-max {
  font-size: 8px;
  font-weight: 700;
  opacity: 0.7;
  margin-top: 1px;
}

.ob-score-info {
  flex: 1;
  min-width: 0;
}

.ob-score-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-score-desc {
  font-size: 11px;
  margin: 0;
  opacity: 0.85;
  line-height: 1.3;
}

/* Unit Switcher Pill (Horizontal Division) */
.ob-unit-pill-link {
  text-decoration: none;
  display: block;
  margin-bottom: 10px;
}

.ob-unit-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  background: #171f33;
  border: 1px solid #3d4a42;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  color: #dae2fd;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;
}

.ob-unit-pill:hover {
  background: #222a3d;
  border-color: #68dba9;
  color: #68dba9;
}

/* Substandard Commercial Housing Alert (Presunto local comercial / Infravivienda) */
.ob-substandard-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(225, 29, 72, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.45);
  border-radius: 10px;
  margin-bottom: 12px;
}

.ob-substandard-icon {
  color: #fb7185;
  font-size: 16px;
  line-height: 1;
  margin-top: 1px;
}

.ob-substandard-content {
  flex: 1;
}

.ob-substandard-title {
  font-size: 11px;
  font-weight: 700;
  color: #fb7185;
  margin: 0 0 2px 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-substandard-detail {
  font-size: 11px;
  color: #fecdd3;
  margin: 0;
  line-height: 1.3;
}

/* Stressed Housing Alert */
.ob-stressed-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(217, 119, 7, 0.15);
  border: 1px solid rgba(217, 119, 7, 0.45);
  border-radius: 10px;
  margin-bottom: 12px;
}

.ob-stressed-icon {
  color: #ffb77d;
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
  color: #ffb77d;
  margin: 0 0 2px 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-stressed-detail {
  font-size: 11px;
  color: #dae2fd;
  margin: 0;
  line-height: 1.3;
}

/* Discrepancy pill / card */
.ob-discrepancy-alert {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 183, 125, 0.12);
  border: 1px solid rgba(255, 183, 125, 0.4);
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  color: #ffb77d;
}

/* Grid Breakdown */
.ob-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.ob-stat-box {
  background: #171f33;
  border: 1px solid #3d4a42;
  border-radius: 8px;
  padding: 8px 10px;
}

.ob-stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #87948b;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.ob-stat-value {
  font-size: 12px;
  font-weight: 700;
  color: #dae2fd;
  font-family: 'JetBrains Mono', monospace;
}

/* 5-Axis Mini-Radar & Telemetry Section */
.ob-radar-telemetry-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.ob-mini-radar-container {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  background: #0b1326;
  border: 1px solid #3d4a42;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(6, 14, 32, 0.4);
}

.ob-mini-radar {
  width: 120px;
  height: 120px;
  display: block;
}

.ob-mini-radar polygon {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ob-mini-radar circle {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Connectivity Telemetry Chips */
.ob-connectivity-chips {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.ob-telemetry-chip {
  font-size: 10px;
  font-weight: 500;
  padding: 4px 7px;
  border-radius: 6px;
  background: #171f33;
  color: #dae2fd;
  border: 1px solid #3d4a42;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'JetBrains Mono', monospace;
}

.ob-telemetry-chip.highlight {
  background: rgba(104, 219, 169, 0.15);
  color: #68dba9;
  border-color: rgba(104, 219, 169, 0.4);
  font-weight: 700;
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
  background: #25a475;
  color: #002114;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  transition: background 0.15s ease;
  border: none;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.ob-btn-primary:hover {
  background: #68dba9;
}

/* Collapsed Pill */
.ob-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #0b1326;
  border-radius: 9999px;
  box-shadow: 0 8px 24px -2px rgba(6, 14, 32, 0.6);
  border: 1px solid #3d4a42;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  color: #dae2fd;
}

.ob-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -2px rgba(6, 14, 32, 0.8);
  border-color: #68dba9;
}

.ob-pill-score {
  font-size: 12px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 9999px;
  font-family: 'JetBrains Mono', monospace;
}

.ob-pill-label {
  font-size: 12px;
  font-weight: 700;
  color: #dae2fd;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Skeleton Loading */
.ob-skeleton-shimmer {
  background: linear-gradient(90deg, #131b2e 25%, #222a3d 50%, #131b2e 75%);
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

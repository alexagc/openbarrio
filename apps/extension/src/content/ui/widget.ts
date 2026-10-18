import { PropertyAuditReport } from '@openbarrio/core';
import { WIDGET_STYLES } from './styles.js';
import {
  renderLoadingSkeleton,
  renderAuditCard,
  renderCollapsedPill,
  renderErrorState,
} from './templates.js';

export const WIDGET_ROOT_ID = 'openbarrio-audit-root';

export class OpenBarrioWidget {
  private host: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private currentReport: PropertyAuditReport | null = null;
  private currentWebUrl: string = 'http://localhost:3000';
  private isCollapsed: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof document === 'undefined') {
      return;
    }

    // Idempotent mount check
    const existing = document.getElementById(WIDGET_ROOT_ID);
    if (existing) {
      this.host = existing;
      this.shadow = existing.shadowRoot;
      return;
    }

    this.host = document.createElement('div');
    this.host.id = WIDGET_ROOT_ID;
    this.shadow = this.host.attachShadow({ mode: 'open' });

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = WIDGET_STYLES;
    this.shadow.appendChild(styleEl);

    document.body.appendChild(this.host);
  }

  showLoading(portalName: string): void {
    if (!this.shadow) return;
    this.updateContent(renderLoadingSkeleton(portalName));
  }

  showReport(report: PropertyAuditReport, webUrl: string): void {
    if (!this.shadow) return;
    this.currentReport = report;
    this.currentWebUrl = webUrl;
    this.renderCurrentReportState();
  }

  showError(message: string, webUrl: string): void {
    if (!this.shadow) return;
    this.updateContent(renderErrorState(message, webUrl));
    this.bindErrorEvents();
  }

  collapse(): void {
    if (!this.currentReport) return;
    this.isCollapsed = true;
    this.renderCurrentReportState();
  }

  expand(): void {
    if (!this.currentReport) return;
    this.isCollapsed = false;
    this.renderCurrentReportState();
  }

  destroy(): void {
    if (this.host && this.host.parentElement) {
      this.host.parentElement.removeChild(this.host);
    }
    this.host = null;
    this.shadow = null;
  }

  private renderCurrentReportState(): void {
    if (!this.shadow || !this.currentReport) return;

    if (this.isCollapsed) {
      this.updateContent(
        renderCollapsedPill(this.currentReport.score.overallScore)
      );
      this.bindCollapsedEvents();
    } else {
      this.updateContent(
        renderAuditCard(this.currentReport, this.currentWebUrl)
      );
      this.bindCardEvents();
    }
  }

  private updateContent(html: string): void {
    if (!this.shadow) return;
    // Keep style tag intact
    let style = this.shadow.querySelector('style');
    if (!style) {
      style = document.createElement('style');
      style.textContent = WIDGET_STYLES;
    }
    this.shadow.innerHTML = '';
    this.shadow.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.id = 'ob-wrapper';
    wrapper.innerHTML = html;
    this.shadow.appendChild(wrapper);
  }

  private bindCardEvents(): void {
    if (!this.shadow) return;

    const collapseBtn = this.shadow.getElementById('ob-btn-collapse');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.collapse();
      });
    }

    const closeBtn = this.shadow.getElementById('ob-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.destroy();
      });
    }
  }

  private bindCollapsedEvents(): void {
    if (!this.shadow) return;

    const pill = this.shadow.getElementById('ob-pill-expand');
    if (pill) {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        this.expand();
      });
    }
  }

  private bindErrorEvents(): void {
    if (!this.shadow) return;

    const closeBtn = this.shadow.getElementById('ob-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.destroy();
      });
    }
  }

  getShadowRoot(): ShadowRoot | null {
    return this.shadow;
  }
}

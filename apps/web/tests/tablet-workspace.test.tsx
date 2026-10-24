import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../src/App';

// Polyfill URL.createObjectURL for JSDOM environment
if (typeof window !== 'undefined') {
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:mock-url';
  }
  if (!window.URL.revokeObjectURL) {
    window.URL.revokeObjectURL = () => {};
  }
}

vi.mock('../src/components/MapView', () => ({
  MapView: (props: any) => (
    <div data-testid="mock-mapview" data-layers-open={props.isMobileLayersOpen}>
      <button
        data-testid="mock-view-report"
        onClick={() => props.onViewReport?.()}
      >
        View Report
      </button>
    </div>
  ),
}));

describe('Tablet Adaptive Split Workspace & Mobile Synchronization (Phase 11E)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/?view=map');
  });

  it('renders the 52/48 tablet adaptive split workspace classes', () => {
    const { container } = render(<App />);

    // Locate the main workspace container
    const mainWorkspace = container.querySelector('main');
    expect(mainWorkspace).toBeDefined();

    // Map section on tablet should have md:w-[52%] and xl:w-[60%]
    const mapSection = container.querySelector('section.cadastral-grid');
    expect(mapSection).toBeDefined();
    expect(mapSection?.className).toContain('md:w-[52%]');
    expect(mapSection?.className).toContain('xl:w-[60%]');

    // Dossier section on tablet should have md:w-[48%] and xl:w-[40%]
    const dossierSection = container.querySelector('section.bg-surface');
    expect(dossierSection).toBeDefined();
    expect(dossierSection?.className).toContain('md:w-[48%]');
    expect(dossierSection?.className).toContain('xl:w-[40%]');
  });

  it('synchronizes MobileBottomNav destinations with bottom sheet and workspace', () => {
    render(<App />);

    // Mobile bottom nav should be rendered
    const mobileNav = screen.getByRole('navigation', { name: /navegación móvil inferior/i });
    expect(mobileNav).toBeDefined();

    // Selecting 'report' destination transitions active destination and triggers report view
    const reportNavBtn = screen.getByRole('button', { name: /informe/i });
    fireEvent.click(reportNavBtn);
    expect(reportNavBtn.getAttribute('aria-current')).toBe('page');

    // Selecting 'map' destination transitions active destination back to map
    const mapNavBtn = screen.getByRole('button', { name: /mapa/i });
    fireEvent.click(mapNavBtn);
    expect(mapNavBtn.getAttribute('aria-current')).toBe('page');
  });

  it('renders dynamic viewport 100dvh container without layout shifts', () => {
    const { container } = render(<App />);

    const rootWrapper = container.firstChild as HTMLElement;
    expect(rootWrapper).toBeDefined();
    expect(rootWrapper.className).toContain('h-[100dvh]');
  });
});

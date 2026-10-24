import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MobileBottomNav } from '../src/components/MobileBottomNav';

describe('MobileBottomNav Component (Stitch Civic Precision Phase 11D)', () => {
  it('renders all 4 primary mobile navigation destinations', () => {
    const handleSelect = vi.fn();
    render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
      />
    );

    expect(screen.getByRole('navigation', { name: /navegación móvil inferior/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /mapa/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /informe/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /capas/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeDefined();
  });

  it('calls onSelectDestination with appropriate destination ID when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /informe/i }));
    expect(handleSelect).toHaveBeenCalledWith('report');

    fireEvent.click(screen.getByRole('button', { name: /capas/i }));
    expect(handleSelect).toHaveBeenCalledWith('layers');

    fireEvent.click(screen.getByRole('button', { name: /buscar/i }));
    expect(handleSelect).toHaveBeenCalledWith('search');

    fireEvent.click(screen.getByRole('button', { name: /mapa/i }));
    expect(handleSelect).toHaveBeenCalledWith('map');
  });

  it('highlights the active destination with aria-current="page" and active indicator dot', () => {
    const handleSelect = vi.fn();
    const { rerender } = render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
      />
    );

    const mapButton = screen.getByRole('button', { name: /mapa/i });
    const reportButton = screen.getByRole('button', { name: /informe/i });

    expect(mapButton.getAttribute('aria-current')).toBe('page');
    expect(reportButton.getAttribute('aria-current')).toBeNull();
    expect(screen.getByTestId('active-indicator')).toBeDefined();

    // Rerender with 'report' active
    rerender(
      <MobileBottomNav
        activeDestination="report"
        onSelectDestination={handleSelect}
      />
    );

    expect(mapButton.getAttribute('aria-current')).toBeNull();
    expect(reportButton.getAttribute('aria-current')).toBe('page');
  });

  it('displays layers count badge when layersCount > 0', () => {
    const handleSelect = vi.fn();
    const { rerender } = render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
        layersCount={3}
      />
    );

    const badge = screen.getByTestId('layers-count-badge');
    expect(badge).toBeDefined();
    expect(badge.textContent).toBe('3');

    // Does not render badge when 0
    rerender(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
        layersCount={0}
      />
    );
    expect(screen.queryByTestId('layers-count-badge')).toBeNull();
  });

  it('strictly adheres to Stitch Shell Border Ban (no border-t, uses tonal elevation)', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
      />
    );

    const navElement = container.querySelector('nav');
    expect(navElement).toBeDefined();
    expect(navElement?.className).not.toContain('border-t');
    expect(navElement?.className).toContain('bg-surface-container-lowest');
    expect(navElement?.className).toContain('shadow-lg');
  });

  it('applies safe-area-inset-bottom and accessible touch targets (>=44x44px)', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <MobileBottomNav
        activeDestination="map"
        onSelectDestination={handleSelect}
      />
    );

    const nav = container.querySelector('nav');
    expect(nav?.className).toContain('pb-[env(safe-area-inset-bottom,0.5rem)]');

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4);
    for (const btn of buttons) {
      expect(btn.className).toContain('min-h-[44px]');
      expect(btn.className).toContain('min-w-[44px]');
      expect(btn.className).toContain('active:scale-95');
    }
  });
});

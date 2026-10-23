import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RadarChart } from '../src/components/RadarChart';

describe('RadarChart Component (Stitch Civic Precision 5-Axis Pentagon)', () => {
  const mockSubscores = {
    connectivity: 88,
    building: 76,
    socioeconomic: 82,
    environmental: 70,
    urbanPlanning: 90,
  };

  it('renders SVG with accessible role, title, and responsive viewBox', () => {
    render(<RadarChart subscores={mockSubscores} overallScore={81} />);

    const svg = screen.getByRole('img', { name: /5-axis Barrio Due Diligence Radar Chart/i });
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('viewBox')).toBe('0 0 360 270');
  });

  it('renders default labels and score badges for all 5 civic axes', () => {
    render(<RadarChart subscores={mockSubscores} overallScore={81} />);

    // Default axis labels
    expect(screen.getByText(/Conectividad \(15-min\)/i)).toBeTruthy();
    expect(screen.getByText(/Salud Edificatoria/i)).toBeTruthy();
    expect(screen.getByText(/Nivel Socioeconómico/i)).toBeTruthy();
    expect(screen.getByText(/Confort Ambiental/i)).toBeTruthy();
    expect(screen.getByText(/Planeamiento SIU/i)).toBeTruthy();

    // Value badges
    expect(screen.getByText('88/100')).toBeTruthy();
    expect(screen.getByText('76/100')).toBeTruthy();
    expect(screen.getByText('82/100')).toBeTruthy();
    expect(screen.getByText('70/100')).toBeTruthy();
    expect(screen.getByText('90/100')).toBeTruthy();
  });

  it('applies emerald styling (#10B981) when score >= 75', () => {
    const { container } = render(<RadarChart subscores={mockSubscores} overallScore={82} />);

    const dataPolygon = container.querySelector('polygon[fill="rgba(16, 185, 129, 0.22)"]');
    expect(dataPolygon).toBeTruthy();
    expect(dataPolygon?.getAttribute('stroke')).toBe('#10B981');
  });

  it('applies amber styling (#F59E0B) when score is between 50 and 74', () => {
    const amberSubscores = {
      connectivity: 60,
      building: 55,
      socioeconomic: 65,
      environmental: 50,
      urbanPlanning: 58,
    };

    const { container } = render(<RadarChart subscores={amberSubscores} overallScore={58} />);

    const dataPolygon = container.querySelector('polygon[fill="rgba(245, 158, 11, 0.22)"]');
    expect(dataPolygon).toBeTruthy();
    expect(dataPolygon?.getAttribute('stroke')).toBe('#F59E0B');
  });

  it('applies rose styling (#EF4444) when score < 50', () => {
    const lowSubscores = {
      connectivity: 40,
      building: 35,
      socioeconomic: 45,
      environmental: 30,
      urbanPlanning: 42,
    };

    const { container } = render(<RadarChart subscores={lowSubscores} overallScore={38} />);

    const dataPolygon = container.querySelector('polygon[fill="rgba(239, 68, 68, 0.22)"]');
    expect(dataPolygon).toBeTruthy();
    expect(dataPolygon?.getAttribute('stroke')).toBe('#EF4444');
  });

  it('renders custom localized axis labels when passed as props', () => {
    const customLabels = {
      connectivity: '15-Min Walkability',
      building: 'Building Integrity',
      socioeconomic: 'Household Wealth',
      environmental: 'Eco Comfort',
      urbanPlanning: 'Zoning & Legal',
    };

    render(<RadarChart subscores={mockSubscores} labels={customLabels} />);

    expect(screen.getByText('15-Min Walkability')).toBeTruthy();
    expect(screen.getByText('Building Integrity')).toBeTruthy();
    expect(screen.getByText('Household Wealth')).toBeTruthy();
    expect(screen.getByText('Eco Comfort')).toBeTruthy();
    expect(screen.getByText('Zoning & Legal')).toBeTruthy();
  });

  it('handles missing or partial subscores with graceful fallback without throwing', () => {
    expect(() => {
      render(<RadarChart subscores={{}} />);
    }).not.toThrow();

    // Renders default 70/100 for undefined axes
    expect(screen.getAllByText('70/100').length).toBe(5);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitPickerModal } from '../src/components/UnitPickerModal';
import { CadastralUnitsResponse } from '@openbarrio/core';

describe('UnitPickerModal Component', () => {
  const mockUnitsResponse: CadastralUnitsResponse = {
    parcelCadastralReference: '9872023VH5797S',
    totalUnits: 3,
    units: [
      {
        cadastralReference: '9872023VH5797S0001WX',
        floor: '01',
        door: 'A',
        staircase: '1',
        block: '1',
        use: 'Vivienda',
        builtSurfaceM2: 85,
        participationCoefficient: 2.15,
      },
      {
        cadastralReference: '9872023VH5797S0002EZ',
        floor: '02',
        door: 'B',
        staircase: '1',
        block: '1',
        use: 'Vivienda',
        builtSurfaceM2: 110,
        participationCoefficient: 2.78,
      },
      {
        cadastralReference: '9872023VH5797S0003RT',
        floor: '00',
        door: '01',
        staircase: '1',
        block: '1',
        use: 'Comercial',
        builtSurfaceM2: 240,
        participationCoefficient: 6.05,
      },
    ],
  };

  it('renders modal with units list when open', () => {
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={vi.fn()}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={vi.fn()}
        onSelectBuilding={vi.fn()}
      />
    );

    expect(screen.getByText('División Horizontal')).toBeDefined();
    expect(screen.getByText(/3 inmuebles registrados/)).toBeDefined();
    expect(screen.getByText('Planta 01 · Puerta A')).toBeDefined();
    expect(screen.getByText('Planta 02 · Puerta B')).toBeDefined();
    expect(screen.getByText('Planta 00 · Puerta 01')).toBeDefined();
  });

  it('filters units when typing in the search input', () => {
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={vi.fn()}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={vi.fn()}
        onSelectBuilding={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Buscar planta, puerta/i);
    fireEvent.change(searchInput, { target: { value: 'Puerta B' } });

    expect(screen.getByText('Planta 02 · Puerta B')).toBeDefined();
    expect(screen.queryByText('Planta 01 · Puerta A')).toBeNull();
  });

  it('filters by usage category when filter button is clicked', () => {
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={vi.fn()}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={vi.fn()}
        onSelectBuilding={vi.fn()}
      />
    );

    const comercialFilterBtn = screen.getByRole('button', { name: /Locales/i });
    fireEvent.click(comercialFilterBtn);

    expect(screen.getByText('Planta 00 · Puerta 01')).toBeDefined();
    expect(screen.queryByText('Planta 01 · Puerta A')).toBeNull();
    expect(screen.queryByText('Planta 02 · Puerta B')).toBeNull();
  });

  it('invokes onSelectUnit when a unit is selected and action button clicked', () => {
    const handleSelectUnit = vi.fn();
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={vi.fn()}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={handleSelectUnit}
        onSelectBuilding={vi.fn()}
      />
    );

    // Click on Unit 1 card button
    const unit1Text = screen.getByText('Planta 01 · Puerta A');
    const unit1Card = unit1Text.closest('button') || unit1Text;
    fireEvent.click(unit1Card);

    // Click confirm button
    const confirmButton = screen.getByRole('button', { name: /Auditar Inmueble/i });
    fireEvent.click(confirmButton);

    expect(handleSelectUnit).toHaveBeenCalledTimes(1);
    expect(handleSelectUnit).toHaveBeenCalledWith(mockUnitsResponse.units[0]);
  });

  it('invokes onSelectBuilding when "Auditar Edificio Completo" button is clicked', () => {
    const handleSelectBuilding = vi.fn();
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={vi.fn()}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={vi.fn()}
        onSelectBuilding={handleSelectBuilding}
      />
    );

    const buildingButton = screen.getByRole('button', { name: /Auditar Edificio Completo/i });
    fireEvent.click(buildingButton);

    expect(handleSelectBuilding).toHaveBeenCalledTimes(1);
  });

  it('invokes onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <UnitPickerModal
        isOpen={true}
        onClose={handleClose}
        unitsData={mockUnitsResponse}
        currentRefcat="9872023VH5797S"
        buildingAddress="Gran Vía 28, Madrid"
        onSelectUnit={vi.fn()}
        onSelectBuilding={vi.fn()}
      />
    );

    const closeButton = screen.getByLabelText('Cerrar selector');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

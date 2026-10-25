import { useState, useMemo, useEffect } from 'react';
import { CadastralUnit, CadastralUnitsResponse } from '@openbarrio/core';
import {
  X,
  Search,
  Building,
  Home,
  Store,
  Warehouse,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface UnitPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitsData: CadastralUnitsResponse | null;
  currentRefcat?: string;
  buildingAddress?: string;
  onSelectUnit: (unit: CadastralUnit) => void;
  onSelectBuilding: () => void;
  onCompareUnit?: (unit: CadastralUnit) => void;
  isLoading?: boolean;
}

export function UnitPickerModal({
  isOpen,
  onClose,
  unitsData,
  currentRefcat,
  buildingAddress,
  onSelectUnit,
  onSelectBuilding,
  onCompareUnit,
  isLoading = false,
}: UnitPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUseFilter, setSelectedUseFilter] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<CadastralUnit | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedUseFilter('all');
      setSelectedUnit(null);
    }
  }, [isOpen]);

  const units = unitsData?.units || [];

  // Filter units by search query and usage category
  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      // Use filter
      if (selectedUseFilter !== 'all') {
        const uUse = u.use.toLowerCase();
        if (selectedUseFilter === 'vivienda' && !uUse.includes('residencial') && !uUse.includes('vivienda')) {
          return false;
        }
        if (selectedUseFilter === 'comercial' && !uUse.includes('comercial') && !uUse.includes('local') && !uUse.includes('oficina')) {
          return false;
        }
        if (selectedUseFilter === 'otros' && (uUse.includes('residencial') || uUse.includes('vivienda') || uUse.includes('comercial') || uUse.includes('local'))) {
          return false;
        }
      }

      // Search query (floor, door, full refcat, staircase)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
                const fullLabel = `portal ${u.block || ''} bloque ${u.block || ''} ${u.block || ''} planta ${u.floor} puerta ${u.door} ${u.floor} ${u.door} ${u.floor}${u.door} ${u.floor}-${u.door}`.toLowerCase();
        const matchLabel = fullLabel.includes(q);
        const matchRef = q.length >= 4 && u.cadastralReference.toLowerCase().includes(q);
        const matchStair = (u.staircase || '').toLowerCase().includes(q);
        const matchBlock = (u.block || '').toLowerCase() === q;
        return matchLabel || matchRef || matchStair || matchBlock;
      }

      return true;
    });
  }, [units, selectedUseFilter, searchQuery]);

  // Group units by floor for clean cartographic scanning
  const groupedByFloor = useMemo(() => {
    const map = new Map<string, CadastralUnit[]>();
    for (const u of filteredUnits) {
      const key = u.floor || '00';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    }
    return Array.from(map.entries());
  }, [filteredUnits]);

  // Count by categories for filter badges
  const counts = useMemo(() => {
    let viviendas = 0;
    let comerciales = 0;
    let otros = 0;
    for (const u of units) {
      const use = u.use.toLowerCase();
      if (use.includes('residencial') || use.includes('vivienda')) viviendas++;
      else if (use.includes('comercial') || use.includes('local') || use.includes('oficina')) comerciales++;
      else otros++;
    }
    return { all: units.length, viviendas, comerciales, otros };
  }, [units]);

  if (!isOpen) return null;

  const isCurrentSelection = (unitRef: string) => currentRefcat === unitRef;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-surface-container-lowest/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unit-picker-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container-low border border-outline-variant rounded-xl shadow-2xl flex flex-col overflow-hidden text-on-surface">
        {/* ================= MODAL HEADER (Stitch Civic Precision) ================= */}
        <div className="p-4 sm:p-5 bg-surface-container border-b border-outline-variant flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary-container/20 text-primary border border-primary/30 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" />
                División Horizontal
              </span>
              <span className="text-xs font-mono text-outline">
                RC Matriz: {unitsData?.parcelCadastralReference || '—'}
              </span>
            </div>
            <h2 id="unit-picker-title" className="text-base sm:text-lg font-bold font-headline text-on-surface truncate">
              {buildingAddress || 'Edificio en Régimen de Propiedad Horizontal'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {unitsData?.totalUnits || units.length} inmuebles registrados en la Sede Electrónica del Catastro
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Cerrar selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= CONTROLS & FILTER BAR ================= */}
        <div className="p-3 sm:p-4 bg-surface-container-lowest border-b border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Use filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedUseFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedUseFilter === 'all'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              Todos ({isLoading || !unitsData ? '...' : counts.all})
            </button>
            <button
              type="button"
              onClick={() => setSelectedUseFilter('vivienda')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedUseFilter === 'vivienda'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Home className="w-3 h-3" />
              Viviendas ({isLoading || !unitsData ? '...' : counts.viviendas})
            </button>
            <button
              type="button"
              onClick={() => setSelectedUseFilter('comercial')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                selectedUseFilter === 'comercial'
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <Store className="w-3 h-3" />
              Locales ({isLoading || !unitsData ? '...' : counts.comerciales})
            </button>
            {counts.otros > 0 && (
              <button
                type="button"
                onClick={() => setSelectedUseFilter('otros')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedUseFilter === 'otros'
                    ? 'bg-primary text-on-primary font-semibold'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                }`}
              >
                <Warehouse className="w-3 h-3" />
                Otros ({isLoading || !unitsData ? '...' : counts.otros})
              </button>
            )}
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar planta, puerta (ej. 3º B)..."
              className="w-full bg-surface-container border border-outline-variant rounded-lg pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary font-mono transition-colors"
            />
          </div>
        </div>

        {/* ================= UNIT LIST / GRID BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {isLoading || !unitsData ? (
            <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center">
              <div className="w-9 h-9 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-mono font-semibold text-on-surface">Consultando división horizontal en Sede del Catastro...</p>
              <p className="text-[11px] text-outline mt-1 font-mono">Obteniendo fincas registrales y coeficientes de copropiedad oficiales</p>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant">
              <Building className="w-10 h-10 mx-auto mb-2 text-outline/60" />
              <p className="text-sm font-semibold text-on-surface">No se encontraron inmuebles</p>
              <p className="text-xs text-outline mt-1">Prueba a cambiar el filtro de uso o término de búsqueda.</p>
            </div>
          ) : (
            groupedByFloor.map(([floor, floorUnits]) => (
              <div key={floor} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-outline px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60">
                    {floor === 'PB' || floor === '00' ? 'Planta Baja / Acceso' : `Planta ${floor}ªª`}
                  </span>
                  <div className="h-px flex-1 bg-outline-variant/40" />
                  <span className="text-[10px] font-mono text-outline">{floorUnits.length} inmuebles</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {floorUnits.map((u) => {
                    const isSelected = selectedUnit?.cadastralReference === u.cadastralReference;
                    const isAudited = isCurrentSelection(u.cadastralReference);

                    return (
                      <div
                        key={u.cadastralReference}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedUnit(u)}
                        onDoubleClick={() => { setSelectedUnit(u); onSelectUnit(u); onClose(); }}
                        className={`text-left p-3 rounded-lg border transition-all cursor-pointer relative flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-md'
                            : isAudited
                            ? 'bg-primary-container/10 border-primary/50'
                            : 'bg-surface-container hover:bg-surface-container-high border-outline-variant hover:border-outline'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                                                        <div className="text-sm font-bold font-headline text-on-surface flex items-center gap-1.5">
                              {u.block && (
                                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-surface-variant text-tertiary">
                                  Portal {u.block}
                                </span>
                              )}
                              <span>Planta {u.floor} · Puerta {u.door}</span>
                              {u.staircase && (
                                <span className="text-[10px] font-mono text-outline font-normal">
                                  (Esc. {u.staircase})
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-on-surface-variant font-mono mt-0.5 inline-block">
                              {u.builtSurfaceM2 > 0 ? `${u.builtSurfaceM2} m² privativos` : 'Finca registrada'}
                              {u.participationCoefficient ? ` · cpt: ${u.participationCoefficient}%` : ''}
                            </span>
                          </div>

                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${
                              u.use.toLowerCase().includes('comercial')
                                ? 'bg-secondary-container/20 text-secondary border border-secondary/30'
                                : 'bg-primary-container/20 text-primary border border-primary/30'
                            }`}
                          >
                            {u.use}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-outline-variant/40 text-[10px] font-mono text-outline">
                          <span className="truncate">{u.cadastralReference}</span>
                          <button
                            type="button"
                            data-testid="instant-audit-unit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectUnit(u);
                              onClose();
                            }}
                            className="px-2 py-0.5 rounded bg-primary/20 hover:bg-primary text-primary hover:text-on-primary border border-primary/40 font-semibold text-[10px] transition-colors flex items-center gap-0.5 cursor-pointer ml-auto"
                            title="Auditar inmediatamente este inmueble"
                          >
                            <span>Auditar</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                          {isAudited && (
                            <span className="flex items-center gap-1 text-primary font-semibold">
                              <Check className="w-3 h-3" /> Auditado
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= MODAL FOOTER & ACTION BAR ================= */}
        <div className="p-4 bg-surface-container border-t border-outline-variant flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            {selectedUnit ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>
                  Seleccionado: <strong>Planta {selectedUnit.floor} - Puerta {selectedUnit.door}</strong> ({selectedUnit.builtSurfaceM2} m²)
                </span>
              </div>
            ) : (
              <span className="text-outline">Selecciona un inmueble de la lista o audita el bloque completo.</span>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                onSelectBuilding();
                onClose();
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container-high border border-outline-variant transition-colors cursor-pointer"
            >
              Auditar Edificio Completo
            </button>

            {selectedUnit && (
              <>
                {onCompareUnit && (
                  <button
                    type="button"
                    data-testid="unit-picker-compare-btn"
                    onClick={() => {
                      onCompareUnit(selectedUnit);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-surface-container-high border border-primary/40 hover:bg-surface-variant text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Comparar Unidad</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onSelectUnit(selectedUnit);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-primary hover:bg-primary-container text-on-primary transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Auditar Inmueble ({selectedUnit.floor}-{selectedUnit.door})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

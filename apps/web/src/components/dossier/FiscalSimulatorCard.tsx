import { useState, useEffect } from 'react';
import { CadastralProperty, FiscalEstimateDTO, calculateFiscalEstimate } from '@openbarrio/core';
import { Coins, AlertTriangle, Building2 } from 'lucide-react';

interface FiscalSimulatorCardProps {
  property: CadastralProperty;
  fiscal?: FiscalEstimateDTO;
}

export function FiscalSimulatorCard({ property, fiscal }: FiscalSimulatorCardProps) {
  const cadastralSurface = property.unit?.builtSurfaceM2 || property.building.builtSurfaceM2 || 90;
  const provCode = property.address.provinceCode || property.address.postalCode.slice(0, 2) || '28';

  // Read initial values from URL search params
  const [purchasePrice, setPurchasePrice] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search).get('price');
      if (p && !isNaN(Number(p)) && Number(p) > 0) return Number(p);
    }
    return fiscal?.purchasePriceEur && fiscal.purchasePriceEur > 0 ? fiscal.purchasePriceEur : 280000;
  });

  // Read advertised m2 if passed via deep-link from extension
  const advertisedM2 = (() => {
    if (typeof window !== 'undefined') {
      const m2 = new URLSearchParams(window.location.search).get('advertised_m2');
      if (m2 && !isNaN(Number(m2)) && Number(m2) > 0) return Number(m2);
    }
    return fiscal?.advertisedSurfaceM2;
  })();

  // Sync params with URL search
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (purchasePrice > 0) {
      url.searchParams.set('price', purchasePrice.toString());
    } else {
      url.searchParams.delete('price');
    }
    window.history.replaceState({}, '', url.toString());
  }, [purchasePrice]);

  // Recalculate fiscal estimate interactively
  const currentFiscal = calculateFiscalEstimate({
    cadastralReference: property.cadastralReference,
    provinceCode: provCode,
    municipalityName: property.address.municipality,
    purchasePriceEur: purchasePrice,
    cadastralSurfaceM2: cadastralSurface,
    advertisedSurfaceM2: advertisedM2,
    constructionYear: property.building.constructionYear,
  });

  return (
    <div
      data-testid="fiscal-simulator-card"
      className="p-4 rounded-lg bg-surface-container-low border border-outline-variant space-y-4"
    >
      <div className="flex items-center justify-between border-b border-outline-variant pb-2">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary shrink-0" />
          <span className="font-headline text-sm font-bold text-on-surface">
            Simulador Fiscal ITP & IBI Municipal
          </span>
        </div>
        <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          {currentFiscal.autonomousCommunity}
        </span>
      </div>

      {/* Interactive Controls & Computable Base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Purchase price slider & input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="purchase-price-slider" className="text-on-surface-variant font-medium">
              Precio Estimado de Compraventa
            </label>
            <span className="font-mono font-bold text-primary text-sm">
              €{purchasePrice.toLocaleString('es-ES')}
            </span>
          </div>
          <input
            id="purchase-price-slider"
            type="range"
            min="50000"
            max="1200000"
            step="5000"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-outline">
            <span>50.000 €</span>
            <span>600.000 €</span>
            <span>1.200.000 €</span>
          </div>
        </div>

        {/* Cadastral computable surface for IBI */}
        <div className="space-y-1.5 p-2.5 rounded bg-surface-container border border-outline-variant flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              Superficie Computable IBI
            </span>
            <span className="font-mono font-bold text-on-surface text-sm">
              {cadastralSurface} m²
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant leading-tight">
            Superficie construida oficial de Catastro considerada como base para la valoración y cálculo de la cuota anual.
          </p>
        </div>
      </div>

      {/* Surface Discrepancy Alert (if passed via deep-link from extension) */}
      {currentFiscal.surfaceAlert && (
        <div
          data-testid="surface-discrepancy-alert"
          className={`p-2.5 rounded border flex items-start gap-2 text-xs ${
            (currentFiscal.surfaceDiscrepancyPct || 0) > 15
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
              : 'bg-surface-container border-outline-variant text-on-surface-variant'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{currentFiscal.surfaceAlert}</p>
        </div>
      )}

      {/* Calculated Tax Quotas Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-outline-variant">
        <div>
          <span className="text-on-surface-variant block">Tipo ITP Autonómico</span>
          <span className="font-mono font-bold text-on-surface">
            {currentFiscal.itpRatePct.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">Cuota ITP a Liquidar</span>
          <span className="font-mono font-bold text-primary text-sm">
            €{currentFiscal.itpQuotaEur.toLocaleString('es-ES')}
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">Tipo IBI Municipal</span>
          <span className="font-mono font-bold text-on-surface">
            {currentFiscal.ibiRatePct.toFixed(3)}%
          </span>
        </div>
        <div>
          <span className="text-on-surface-variant block">IBI Anual Estimado</span>
          <span className="font-mono font-bold text-on-surface text-sm">
            €{currentFiscal.ibiEstimatedAnnualQuotaEur.toLocaleString('es-ES')} / año
          </span>
        </div>
      </div>
    </div>
  );
}

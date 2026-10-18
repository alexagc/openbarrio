import { RentalBenchmark } from '@openbarrio/core';
import { Euro, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RentalModuleProps {
  rental?: RentalBenchmark;
}

export function RentalModule({ rental }: RentalModuleProps) {
  if (!rental) return null;

  const {
    officialRangeLowerEurM2,
    officialRangeUpperEurM2,
    estimatedMonthlyRentLowerEur,
    estimatedMonthlyRentUpperEur,
    isStressedHousingZone,
  } = rental;

  return (
    <div className="p-space-lg bg-surface space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Euro className="text-tertiary w-4 h-4" />
          <h3 className="font-title-md text-title-md text-on-surface font-semibold">
            Índice Alquiler MIVAU & Yield
          </h3>
        </div>
        <span className="text-[10px] font-mono text-outline">SERPAVI 2024/2025</span>
      </div>

      <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[10px] font-mono text-outline uppercase">
            Rango Estatal Oficial Alquiler
          </span>
          <span className="font-mono text-sm sm:text-base font-bold text-on-surface">
            {officialRangeLowerEurM2.toFixed(2)} €/m² - {officialRangeUpperEurM2.toFixed(2)} €/m²
          </span>
        </div>

        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden my-2.5">
          <div
            className="bg-gradient-to-r from-tertiary to-primary h-full rounded-full transition-all duration-700"
            style={{ width: '70%' }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-mono text-on-surface-variant gap-1">
          <div className="flex items-center gap-1.5">
            <span>Zona Tensionada:</span>
            {isStressedHousingZone ? (
              <span className="inline-flex items-center gap-1 text-error font-semibold">
                <AlertOctagon className="w-3 h-3 text-error" /> Declarada (Topes Vigentes)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-primary font-semibold">
                <CheckCircle2 className="w-3 h-3 text-primary" /> No declarada
              </span>
            )}
          </div>

          <span className="text-primary font-semibold">
            Estimado: €{estimatedMonthlyRentLowerEur} - €{estimatedMonthlyRentUpperEur} / mes
          </span>
        </div>
      </div>
    </div>
  );
}

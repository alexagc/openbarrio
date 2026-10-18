import { RentalBenchmark } from '@openbarrio/core';
import { Euro, AlertOctagon, CheckCircle2, Scale } from 'lucide-react';

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
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Euro className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Referencia de Alquiler MIVAU
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                SERPAVI
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sistema Estatal de Referencia del Precio del Alquiler de Vivienda
            </p>
          </div>
        </div>

        {/* Stressed Zone Indicator Badge */}
        {isStressedHousingZone ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
            Zona de Mercado Tensionado
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Mercado No Tensionado
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
        {/* Monthly Estimate Range */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Alquiler mensual oficial estimado:</span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              €{estimatedMonthlyRentLowerEur.toLocaleString('es-ES')} - €{estimatedMonthlyRentUpperEur.toLocaleString('es-ES')}
            </span>
            <span className="text-xs text-slate-500">/ mes</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Calculado con superficie catastral y rango SERPAVI
          </span>
        </div>

        {/* Unit Price per m2 Range */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <span className="text-xs font-medium text-slate-500">Precio unitario oficial por m²:</span>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-indigo-600 tracking-tight">
              €{officialRangeLowerEurM2.toFixed(1)} - €{officialRangeUpperEurM2.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">/ m² · mes</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1">
            Horquilla del índice del Ministerio de Vivienda
          </span>
        </div>
      </div>

      {/* Legal Implication Note based on Stressed Zone status */}
      <div
        className={`mt-4 p-3.5 rounded-xl border text-xs leading-relaxed flex items-start space-x-2.5 ${
          isStressedHousingZone
            ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
            : 'bg-slate-50/70 border-slate-200 text-slate-700'
        }`}
      >
        <Scale className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isStressedHousingZone ? 'text-rose-600' : 'text-slate-500'}`} />
        <div>
          {isStressedHousingZone ? (
            <>
              <span className="font-bold">Afección Legal Ley 12/2023 por el Derecho a la Vivienda: </span>
              Inmueble ubicado en un municipio o distrito con declaración oficial de Zona de Mercado Residencial Tensionado. En nuevos contratos de arrendamiento aplican límites de contención de rentas (tope del contrato anterior para pequeños propietarios y techo del índice MIVAU para grandes tenedores o viviendas que no hayan estado alquiladas en los últimos 5 años).
            </>
          ) : (
            <>
              <span className="font-semibold">Régimen Ordinario de Arrendamientos Urbanos: </span>
              Inmueble radicado fuera de zona de mercado residencial tensionado. La fijación de la renta inicial es de libre pacto entre las partes (art. 17 LAU), con actualizaciones anuales sujetas al índice legal de actualización.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

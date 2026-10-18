import React from 'react';
import {
  TrendingUp,
  Building,
  Volume2,
  Waves,
  Calendar,
  Users,
  Shield,
  Home,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
} from '@openbarrio/core';

interface PillarCardsProps {
  property: CadastralProperty;
  neighborhood: CensusTractIncome;
  environment: EnvironmentalData;
}

export function PillarCards({ property, neighborhood, environment }: PillarCardsProps) {
  // 1. Building regulation era helper
  const year = property.building.constructionYear;
  let codeStandard = 'Pre-normativa (Sin código térmico)';
  let codeBadge = 'bg-amber-50 text-amber-800 border-amber-200';

  if (year >= 2007) {
    codeStandard = 'CTE (Código Técnico Edificación RD 314/2006)';
    codeBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (year >= 1980) {
    codeStandard = 'NBE-CT-79 (Primera norma de aislamiento térmico)';
    codeBadge = 'bg-blue-50 text-blue-800 border-blue-200';
  }

  // 2. Noise category helper
  const noise = environment.noise;
  let noiseBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let noiseLabel = 'Silencioso (< 55 dBA)';

  if (noise.dayEveningNightDecibels >= 70) {
    noiseBadge = 'bg-rose-50 text-rose-800 border-rose-200';
    noiseLabel = 'Muy Ruidoso (> 70 dBA)';
  } else if (noise.dayEveningNightDecibels >= 60) {
    noiseBadge = 'bg-amber-50 text-amber-800 border-amber-200';
    noiseLabel = 'Moderado (60-69 dBA)';
  }

  const noiseSourceTranslation: Record<string, string> = {
    ROAD_TRAFFIC: 'Tráfico Rodado',
    RAILWAY: 'Ferrocarril',
    AIRPORT: 'Aeropuerto',
    INDUSTRIAL: 'Industrial',
    NONE: 'Sin fuente crítica',
  };

  // 3. Flood risk helper
  const flood = environment.floodRisk;
  let floodBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let floodLabel = 'Riesgo Nulo';

  if (flood.level === 'HIGH') {
    floodBadge = 'bg-rose-50 text-rose-800 border-rose-200';
    floodLabel = 'Riesgo Alto (T=10 años)';
  } else if (flood.level === 'MEDIUM') {
    floodBadge = 'bg-amber-50 text-amber-800 border-amber-200';
    floodLabel = 'Riesgo Medio (T=100 años)';
  } else if (flood.level === 'LOW') {
    floodBadge = 'bg-blue-50 text-blue-800 border-blue-200';
    floodLabel = 'Riesgo Bajo (T=500 años)';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Socioeconomic Card (INE ADRH) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Socioeconómico & Renta</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              INE ADRH
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Renta neta media por hogar:</span>
              <span className="font-bold text-slate-900">
                €{neighborhood.averageNetHouseholdIncomeEur.toLocaleString('es-ES')} / año
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Renta neta media por persona:</span>
              <span className="font-semibold text-slate-800">
                €{neighborhood.averageNetPersonIncomeEur.toLocaleString('es-ES')} / año
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Percentil en el municipio:</span>
              <span className="font-bold text-indigo-600">
                Top {Math.max(1, 100 - Math.round(neighborhood.percentileInMunicipality))}% (P{Math.round(neighborhood.percentileInMunicipality)})
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Ranking en el municipio:</span>
              <span className="text-slate-800 font-medium">
                Puesto #{neighborhood.rankingInCity.rank} de {neighborhood.rankingInCity.totalSections} secciones
              </span>
            </div>

            <div className="flex justify-between pt-1 text-[11px] text-slate-500">
              <span>Edad mediana: {neighborhood.demographics.medianAge} años</span>
              <span>{neighborhood.demographics.singlePersonHouseholdPercentage}% hogares unipersonales</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Sección Censal: {neighborhood.censusSectionCode}</span>
        </div>
      </div>

      {/* 2. Building Health Card (Catastro) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Salud & Antigüedad</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Catastro OVC
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> Año de construcción:
              </span>
              <span className="font-bold text-slate-900">{year}</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Superficie construida:</span>
              <span className="font-semibold text-slate-800">
                {property.building.builtSurfaceM2.toLocaleString('es-ES')} m²
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Número de unidades:</span>
              <span className="text-slate-800 font-medium">
                {property.building.unitsCount} unidades ({property.building.primaryUse})
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Planta baja comercial:</span>
              <span className="text-slate-800 font-medium">
                {property.building.hasCommercialGroundFloor ? 'Sí (Actividad a pie de calle)' : 'No (Solo residencial)'}
              </span>
            </div>

            <div className="pt-1">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium border ${codeBadge}`}>
                {codeStandard}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[10px] text-slate-400 flex items-center justify-between">
          <span className="truncate">Ref: {property.cadastralReference}</span>
        </div>
      </div>

      {/* 3. Acoustic Comfort Card (MITECO SICA) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Confort Acústico</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              MITECO SICA
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Índice Día-Tarde-Noche (Lden):</span>
              <span className="font-bold text-slate-900 text-sm">
                {noise.dayEveningNightDecibels} dBA
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Evaluación de nivel:</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${noiseBadge}`}>
                {noiseLabel}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Fuente predominante:</span>
              <span className="text-slate-800 font-medium">
                {noiseSourceTranslation[noise.predominantSource] || noise.predominantSource}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              {noise.dayEveningNightDecibels < 65
                ? 'El nivel acústico permite descanso adecuado conforme a la Ley del Ruido 37/2003.'
                : 'Se aconseja doble acristalamiento y aislamiento acústico en fachada.'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[10px] text-slate-400">
          Cartografía Estratégica de Ruido SICA
        </div>
      </div>

      {/* 4. Climate Safety & Flood Risk (MITECO SNCZI) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Waves className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Seguridad Climática</h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              MITECO SNCZI
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Riesgo de inundación:</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${floodBadge}`}>
                {floodLabel}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Periodo de retorno (T):</span>
              <span className="text-slate-800 font-medium">
                {flood.returnPeriodYears ? `T = ${flood.returnPeriodYears} años` : 'Sin inundabilidad modelada'}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Zona Flujo Preferente (ZFP):</span>
              <span className="text-slate-800 font-medium">
                {flood.isInPreferentialFlowZone ? (
                  <span className="text-rose-600 font-bold">Sí (Afección hidráulica)</span>
                ) : (
                  <span className="text-emerald-600 font-medium">No afectada</span>
                )}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              {!flood.isInPreferentialFlowZone && flood.level === 'NONE'
                ? 'Emplazamiento protegido fuera de zonas de afección fluvial o mareal del SNCZI.'
                : 'Verificar póliza de seguro del Consorcio de Compensación de Seguros y estanqueidad.'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[10px] text-slate-400">
          Sistema Nacional de Cartografía de Zonas Inundables
        </div>
      </div>
    </div>
  );
}

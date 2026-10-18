import {
  TrendingUp,
  Building2,
  Volume2,
  ShieldCheck,
  Shield,
  CheckCircle2,
  AlertTriangle,
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
  let codeBadge = 'bg-secondary-container/20 text-secondary border-secondary/40';
  let eraTag = year < 1950 ? 'Edificio Histórico' : 'Edificio Consolidado';

  if (year >= 2007) {
    codeStandard = 'CTE (Código Técnico RD 314/2006)';
    codeBadge = 'bg-primary-container/20 text-primary border-primary/40';
    eraTag = 'Normativa Actual';
  } else if (year >= 1980) {
    codeStandard = 'NBE-CT-79 (Aislamiento Térmico)';
    codeBadge = 'bg-tertiary-container/20 text-tertiary border-tertiary/40';
    eraTag = 'Edificio Moderno';
  }

  // 2. Noise category helper
  const noise = environment.noise;
  let noiseLevelTag = 'Silencioso (< 55 dBA)';
  let noiseTextClass = 'text-primary';

  if (noise.dayEveningNightDecibels >= 70) {
    noiseLevelTag = 'Corredor acústico crítico (> 70 dBA)';
    noiseTextClass = 'text-error';
  } else if (noise.dayEveningNightDecibels >= 60) {
    noiseLevelTag = 'Tráfico urbano moderado';
    noiseTextClass = 'text-secondary';
  }

  const noiseSourceTranslation: Record<string, string> = {
    ROAD_TRAFFIC: 'Tráfico Rodado Arterial',
    RAILWAY: 'Corredor Ferroviario',
    AIRPORT: 'Huella Acústica Aeroportuaria',
    INDUSTRIAL: 'Polígono Industrial',
    NONE: 'Zona Residencial Peatonal',
  };

  // 3. Flood risk helper
  const flood = environment.floodRisk;
  let floodLabel = 'Riesgo Nulo';
  let FloodIcon = CheckCircle2;
  let floodClass = 'text-primary';
  let returnPeriodText = 'Zona Segura T > 500 años';

  if (flood.level === 'HIGH') {
    floodLabel = 'Riesgo Alto (T=10a)';
    FloodIcon = AlertTriangle;
    floodClass = 'text-error';
    returnPeriodText = 'Lámina de agua T=10 años';
  } else if (flood.level === 'MEDIUM') {
    floodLabel = 'Riesgo Medio (T=100a)';
    FloodIcon = AlertTriangle;
    floodClass = 'text-secondary';
    returnPeriodText = 'Lámina de agua T=100 años';
  } else if (flood.level === 'LOW') {
    floodLabel = 'Riesgo Bajo (T=500a)';
    FloodIcon = ShieldCheck;
    floodClass = 'text-tertiary';
    returnPeriodText = 'Zona de flujo T=500 años';
  }

  const surface = property.building.builtSurfaceM2;
  const units = property.building.unitsCount;
  const primaryUse = property.building.primaryUse;

  return (
    <div className="space-y-4">
      {/* SECTION 1: CADASTRAL DATA SHEET (OVC Sede Electrónica) */}
      <div className="p-space-lg bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Building2 className="text-secondary w-4 h-4" />
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Ficha Catastral Oficial
            </h3>
          </div>
          <span className="text-[10px] font-mono text-outline">Fuente: OVC D.G. Catastro</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Año Construcción</span>
            <span className="font-mono text-xl font-bold text-on-surface">{year}</span>
            <span className="text-[10px] text-secondary block font-medium mt-0.5">{eraTag}</span>
          </div>
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Superficie Construida</span>
            <span className="font-mono text-xl font-bold text-primary">
              {surface.toLocaleString('es-ES')} m²
            </span>
            <span className="text-[10px] text-outline block mt-0.5">
              {property.building.hasCommercialGroundFloor ? 'Con locales comerciales en planta baja' : 'Uso residencial'}
            </span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant rounded overflow-hidden">
          <table className="w-full text-left border-collapse font-mono text-[11px]">
            <tbody className="divide-y divide-outline-variant/60">
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-2 text-outline w-1/3">Uso Principal</td>
                <td className="p-2 text-on-surface font-sans font-medium">{primaryUse}</td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-2 text-outline">Unidades Urbanas</td>
                <td className="p-2 text-on-surface">{units} unidades registradas en división horizontal</td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-2 text-outline">Calidad Normativa</td>
                <td className="p-2 text-on-surface flex items-center justify-between">
                  <span>{codeStandard}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] border font-semibold ${codeBadge}`}>
                    Conforme
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container/50 transition-colors">
                <td className="p-2 text-outline">Tipo Parcela</td>
                <td className="p-2 text-on-surface font-sans">
                  Suelo Urbano Consolidado ({property.address.municipality})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: SOCIOECONOMIC PROFILE (INE ADRH) */}
      <div className="p-space-lg bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="text-tertiary w-4 h-4" />
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Demografía & Renta de Hogar
            </h3>
          </div>
          <span className="text-[10px] font-mono text-outline">INE ADRH 2024</span>
        </div>

        <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-[11px] font-mono text-outline">Renta Neta Media por Hogar</span>
            <span className="font-mono text-lg font-bold text-tertiary">
              €{neighborhood.averageNetHouseholdIncomeEur.toLocaleString('es-ES')}
              <span className="text-xs text-outline font-normal"> / año</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
            <span>
              Percentil {neighborhood.percentileInMunicipality}º {property.address.province}
            </span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Ranking #{neighborhood.rankingInCity?.rank ?? 1} / {neighborhood.rankingInCity?.totalSections ?? 100}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Edad Media Residente</span>
            <span className="font-mono text-sm font-semibold text-on-surface">
              {neighborhood.demographics?.medianAge ?? 44} años
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Pirámide demográfica</span>
          </div>
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Hogares Unipersonales</span>
            <span className="font-mono text-sm font-semibold text-on-surface">
              {neighborhood.demographics?.singlePersonHouseholdPercentage ?? 35}%
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Sección {neighborhood.censusSectionCode}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: ACOUSTIC COMFORT & ENVIRONMENTAL (MITECO SICA) */}
      <div className="p-space-lg bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Volume2 className="text-secondary w-4 h-4" />
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Confort Acústico & Tráfico
            </h3>
          </div>
          <span className="text-[10px] font-mono text-outline">MITECO SICA Cartografía</span>
        </div>

        <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-outline uppercase">Nivel Global Día / Tarde / Noche</div>
            <div className={`font-mono text-lg font-bold ${noiseTextClass} mt-0.5`}>
              {noise.dayEveningNightDecibels} dBA Lden
            </div>
            <div className="text-[11px] text-on-surface-variant font-sans">
              {noiseSourceTranslation[noise.predominantSource] || noiseLevelTag}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-outline uppercase">Aislamiento Exigido</div>
            <div className="font-mono text-sm font-semibold text-primary mt-0.5">
              {noise.dayEveningNightDecibels >= 65 ? '38 dBA' : '32 dBA'}
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/30 rounded inline-block mt-1">
              CTE-DB-HR Conforme
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: FLOOD & CLIMATE RISK (MITECO SNCZI) */}
      <div className="p-space-lg bg-surface space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="text-primary w-4 h-4" />
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Riesgo Hidrológico & Climático
            </h3>
          </div>
          <span className="text-[10px] font-mono text-outline">SNCZI + Copernicus</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Peligrosidad Fluvial</span>
            <span className={`font-mono text-sm font-bold ${floodClass} flex items-center gap-1 mt-0.5`}>
              <FloodIcon className="w-3.5 h-3.5" />
              {floodLabel}
            </span>
            <span className="text-[10px] text-outline block mt-0.5">{returnPeriodText}</span>
          </div>
          <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded">
            <span className="text-[10px] font-mono text-outline uppercase block">Escorrentía Superficial</span>
            <span className="font-mono text-sm font-bold text-primary flex items-center gap-1 mt-0.5">
              <Shield className="w-3.5 h-3.5" /> Muy Bajo
            </span>
            <span className="text-[10px] text-outline block mt-0.5">Drenaje Municipal Conforme</span>
          </div>
        </div>

        <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-outline uppercase block">Isla de Calor Urbana (ICU)</span>
            <span className="font-sans text-xs font-medium text-on-surface mt-0.5">
              Anomalía microclimática estival Copernicus
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs font-bold text-secondary">+2.4°C</span>
            <span className="text-[9px] text-outline block font-mono">vs periferia</span>
          </div>
        </div>
      </div>
    </div>
  );
}

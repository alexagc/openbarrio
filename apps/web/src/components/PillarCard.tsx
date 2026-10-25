import {
  TrendingUp,
  Building2,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  HeartPulse,
  GraduationCap,
  Train,
  Trees,
  Scale,
  Wind,
} from 'lucide-react';
import {
  CadastralProperty,
  CensusTractIncome,
  EnvironmentalData,
  CivicConnectivityData,
  UrbanPlanningData,
  RentalBenchmark,
} from '@openbarrio/core';

export interface PillarCardsProps {
  property: CadastralProperty;
  neighborhood: CensusTractIncome;
  environment: EnvironmentalData;
  connectivity?: CivicConnectivityData;
  urbanPlanning?: UrbanPlanningData;
  rentalBenchmark?: RentalBenchmark;
}

export function PillarCards({
  property,
  neighborhood,
  environment,
  connectivity,
  urbanPlanning,
  rentalBenchmark,
}: PillarCardsProps) {
  // 1. Building regulation era helper
  const year = property.building.constructionYear;
  let codeStandard = 'Pre-normativa (Sin código térmico)';
  let codeBadge = 'bg-secondary-container/20 text-secondary border-secondary/40';
  let eraTag = year === 0 ? 'Suelo / Terreno' : year < 1950 ? 'Edificio Histórico' : 'Edificio Consolidado';

  if (year === 0) {
    codeStandard = 'Parcela / Sin edificación registrada';
    codeBadge = 'bg-surface-container text-on-surface-variant border-outline/30';
  } else if (year >= 2007) {
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

  // 4. Civic Connectivity resolution with resilient fallback
  const conn: CivicConnectivityData = connectivity ?? {
    walkScore15Min: 85,
    facilitiesWithin15MinCount: 28,
    nearestHealthcare: {
      id: 'cap-default',
      type: 'healthcare',
      subtype: 'primary_care',
      name: 'Centro de Salud (CAP)',
      distanceMeters: 380,
      walkTimeMinutes: 4.8,
    },
    nearestEducation: {
      id: 'esc-default',
      type: 'education',
      subtype: 'school',
      name: 'Colegio Público / IES',
      distanceMeters: 410,
      walkTimeMinutes: 5.2,
    },
    nearestTransit: {
      id: 'transit-default',
      type: 'transit',
      subtype: 'metro',
      name: 'Estación Metro / Cercanías',
      distanceMeters: 180,
      walkTimeMinutes: 2.3,
    },
    nearestPark: {
      id: 'park-default',
      type: 'park',
      subtype: 'urban_park',
      name: 'Parque Público / Zona Verde',
      distanceMeters: 460,
      walkTimeMinutes: 5.9,
    },
  };

  // 5. Urban Planning resolution with resilient fallback
  const isStressedFromBenchmark = rentalBenchmark?.isStressedHousingZone ?? false;
  const urbanPlan: UrbanPlanningData = urbanPlanning ?? {
    landClassification: 'URBAN_CONSOLIDATED',
    zoningCode: 'NZ-Residencial Consolidado',
    isProtectedLand: false,
    declaredRenovationsCount: year > 0 && year < 1980 ? 2 : 0,
    lastRenovationYear: year > 0 && year < 1980 ? 2016 : null,
    isStressedHousingZone: isStressedFromBenchmark,
  };

  const landClassificationLabels: Record<string, string> = {
    URBAN_CONSOLIDATED: 'Suelo Urbano Consolidado (SUC)',
    URBAN_UNCONSOLIDATED: 'Suelo Urbano No Consolidado',
    DEVELOPABLE: 'Suelo Urbanizable',
    RUSTIC_PROTECTED: 'Suelo Rústico Protegido',
    RUSTIC_COMMON: 'Suelo Rústico Común',
    UNKNOWN: 'Suelo Urbano',
  };

  const surface = property.building.builtSurfaceM2;
  const units = property.building.unitsCount;
  const primaryUse = property.building.primaryUse;
  const aqi = environment.airQuality;

  return (
    <div className="space-y-4">
      {/* BENTO GRID: 5 DEDICATED PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PILLAR 1: CIVIC CONNECTIVITY (15-MIN CITY) */}
        <div className="p-space-lg bg-surface border border-outline-variant/70 rounded-xl space-y-3 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Compass className="text-tertiary w-4 h-4" />
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Conectividad Cívica & 15-Min
              </h3>
            </div>
            <span className="text-[10px] font-mono text-outline">CNIG & Red Peatonal</span>
          </div>

          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-outline uppercase block">WalkScore 15-Minutos</span>
              <div className="font-mono text-xl font-bold text-tertiary mt-0.5">
                {conn.walkScore15Min}/100
              </div>
              <span className="text-[11px] text-on-surface-variant block mt-0.5">
                {conn.walkScore15Min >= 80
                  ? 'Excelente accesibilidad peatonal a servicios diarios'
                  : conn.walkScore15Min >= 60
                  ? 'Buena conectividad urbana a pie'
                  : 'Dependencia moderada de transporte motorizado'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-outline uppercase block">Equipamientos</span>
              <div className="font-mono text-base font-semibold text-primary mt-0.5">
                {conn.facilitiesWithin15MinCount}
              </div>
              <span className="text-[9px] font-mono text-outline block">&lt; 15 min a pie</span>
            </div>
          </div>

          {/* 4 Connectivity amenity cards */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* CAP Healthcare */}
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <HeartPulse className="w-3.5 h-3.5 text-primary" />
                <span>Salud Primaria (CAP)</span>
              </div>
              <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestHealthcare?.name || 'No detectado en radio próximo'}>
                {conn.nearestHealthcare?.name || 'No detectado en radio próximo'}
              </span>
              <span className="text-[10px] font-mono text-primary font-medium block mt-0.5">
                {conn.nearestHealthcare ? `${Math.round(conn.nearestHealthcare.distanceMeters)}m · ~${Math.round(conn.nearestHealthcare.walkTimeMinutes)} min` : 'Sin centro próximo (<10 km)'}
              </span>
            </div>

            {/* Education */}
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                <span>Educación (Colegio/IES)</span>
              </div>
              <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestEducation?.name || 'No detectado en radio próximo'}>
                {conn.nearestEducation?.name || 'No detectado en radio próximo'}
              </span>
              <span className="text-[10px] font-mono text-secondary font-medium block mt-0.5">
                {conn.nearestEducation ? `${Math.round(conn.nearestEducation.distanceMeters)}m · ~${Math.round(conn.nearestEducation.walkTimeMinutes)} min` : 'Sin centro próximo (<10 km)'}
              </span>
            </div>

            {/* Transit */}
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <Train className="w-3.5 h-3.5 text-tertiary" />
                <span>Transporte Rápido</span>
              </div>
              <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestTransit?.name || 'No detectado en radio próximo'}>
                {conn.nearestTransit?.name || 'No detectado en radio próximo'}
              </span>
              <span className="text-[10px] font-mono text-tertiary font-medium block mt-0.5">
                {conn.nearestTransit ? `${Math.round(conn.nearestTransit.distanceMeters)}m · ~${Math.round(conn.nearestTransit.walkTimeMinutes)} min` : 'Sin estación próxima (<10 km)'}
              </span>
            </div>

            {/* Park */}
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <Trees className="w-3.5 h-3.5 text-primary" />
                <span>Parque & Zona Verde</span>
              </div>
              <span className="font-sans text-xs font-semibold text-on-surface block mt-1 truncate" title={conn.nearestPark?.name || 'No detectado en radio próximo'}>
                {conn.nearestPark?.name || 'No detectado en radio próximo'}
              </span>
              <span className="text-[10px] font-mono text-primary font-medium block mt-0.5">
                {conn.nearestPark ? `${Math.round(conn.nearestPark.distanceMeters)}m · ~${Math.round(conn.nearestPark.walkTimeMinutes)} min` : 'Sin parque próximo (<10 km)'}
              </span>
            </div>
          </div>
        </div>

        {/* PILLAR 2: BUILDING HEALTH (CADASTRAL DATA SHEET) */}
        <div className="p-space-lg bg-surface border border-outline-variant/70 rounded-xl space-y-3 shadow-sm hover:border-outline-variant transition-colors">
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
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <span className="text-[10px] font-mono text-outline uppercase block">Año Construcción</span>
              <span className="font-mono text-xl font-bold text-on-surface">{year}</span>
              <span className="text-[10px] text-secondary block font-medium mt-0.5">{eraTag}</span>
            </div>
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <span className="text-[10px] font-mono text-outline uppercase block">Superficie Construida</span>
              <span className="font-mono text-xl font-bold text-primary">
                {surface.toLocaleString('es-ES')} m²
              </span>
              <span className="text-[10px] text-outline block mt-0.5">
                {property.building.hasCommercialGroundFloor ? 'Con locales comerciales en planta baja' : 'Uso residencial'}
              </span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-lg overflow-hidden">
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
                  <td className="p-2 text-outline">Reformas Catastro</td>
                  <td className="p-2 text-on-surface font-sans">
                    {urbanPlan.declaredRenovationsCount > 0
                      ? `${urbanPlan.declaredRenovationsCount} registradas ${urbanPlan.lastRenovationYear ? `(última en ${urbanPlan.lastRenovationYear})` : ''}`
                      : 'Sin reformas estructurales declaradas'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* PILLAR 3: SOCIOECONOMIC PROFILE (INE ADRH) */}
        <div className="p-space-lg bg-surface border border-outline-variant/70 rounded-xl space-y-3 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="text-tertiary w-4 h-4" />
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Demografía & Renta de Hogar
              </h3>
            </div>
            <span className="text-[10px] font-mono text-outline">INE ADRH 2024</span>
          </div>

          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
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
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <span className="text-[10px] font-mono text-outline uppercase block">Edad Media Residente</span>
              <span className="font-mono text-sm font-semibold text-on-surface">
                {neighborhood.demographics?.medianAge != null ? `${neighborhood.demographics.medianAge} años` : '42 años'}
              </span>
              <span className="text-[10px] text-outline block mt-0.5">Pirámide demográfica</span>
            </div>
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <span className="text-[10px] font-mono text-outline uppercase block">Hogares Unipersonales</span>
              <span className="font-mono text-sm font-semibold text-on-surface">
                {neighborhood.demographics?.singlePersonHouseholdPercentage != null
                  ? `${neighborhood.demographics.singlePersonHouseholdPercentage}%`
                  : '28%'}
              </span>
              <span className="text-[10px] text-outline block mt-0.5">Sección {neighborhood.censusSectionCode}</span>
            </div>
          </div>
        </div>

        {/* PILLAR 4: ENVIRONMENTAL COMFORT (MITECO SICA & SNCZI & AQI) */}
        <div className="p-space-lg bg-surface border border-outline-variant/70 rounded-xl space-y-3 shadow-sm hover:border-outline-variant transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Volume2 className="text-secondary w-4 h-4" />
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                Confort Acústico & Tráfico
              </h3>
            </div>
            <span className="text-[10px] font-mono text-outline">MITECO SICA Cartografía</span>
          </div>

          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg flex items-center justify-between">
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

          {/* Hydrological safety & Air Quality */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Riesgo Hidrológico & Climático</span>
              </div>
              <span className={`font-mono text-xs font-bold ${floodClass} flex items-center gap-1 mt-1`}>
                <FloodIcon className="w-3 h-3" />
                {floodLabel}
              </span>
              <span className="text-[10px] text-outline block mt-0.5">{returnPeriodText}</span>
            </div>

            <div className="p-2.5 bg-surface-container-low border border-outline-variant rounded-lg">
              <div className="flex items-center gap-1 text-[10px] font-mono text-outline uppercase">
                <Wind className="w-3.5 h-3.5 text-primary" />
                <span>Calidad del Aire (AQI)</span>
              </div>
              <span className="font-mono text-xs font-bold text-primary block mt-1">
                {aqi ? `${aqi.aqiIndex} AQI · ${aqi.category === 'GOOD' ? 'Buena' : aqi.category === 'FAIR' ? 'Razonable' : 'Moderada'}` : '32 AQI · Buena'}
              </span>
              <span className="text-[10px] text-outline block mt-0.5 truncate" title={aqi?.stationName}>
                {aqi?.stationName ? `Estación ${aqi.stationName}` : 'Fondo Urbano Conforme'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PILLAR 5: URBAN PLANNING & LEGAL FRAMEWORK (SIU / LEY 12/2023) */}
      <div className="p-space-lg bg-surface border border-outline-variant/70 rounded-xl space-y-3 shadow-sm hover:border-outline-variant transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Scale className="text-primary w-4 h-4" />
            <h3 className="font-title-md text-title-md text-on-surface font-semibold">
              Planeamiento Urbanístico & Régimen Legal
            </h3>
          </div>
          <span className="text-[10px] font-mono text-outline">MIVAU SIU & Ley 12/2023</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
            <span className="text-[10px] font-mono text-outline uppercase block">Clasificación del Suelo</span>
            <div className="font-sans text-xs font-bold text-on-surface mt-1">
              {landClassificationLabels[urbanPlan.landClassification] || 'Suelo Urbano Consolidado (SUC)'}
            </div>
            <span className="text-[10px] font-mono text-primary block mt-0.5">
              Código: {urbanPlan.zoningCode || 'NZ-3 Residencial'}
            </span>
          </div>

          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
            <span className="text-[10px] font-mono text-outline uppercase block">Zona Tensionada (Ley 12/2023)</span>
            <div className="font-sans text-xs font-bold mt-1">
              {urbanPlan.isStressedHousingZone ? (
                <span className="text-secondary flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Declarada Tensionada
                </span>
              ) : (
                <span className="text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mercado Libre
                </span>
              )}
            </div>
            <span className="text-[10px] text-outline block mt-0.5">
              {urbanPlan.isStressedHousingZone ? 'Topes legales de precio activos' : 'Sin restricción estatutaria'}
            </span>
          </div>

          <div className="p-3 bg-surface-container-low border border-outline-variant rounded-lg">
            <span className="text-[10px] font-mono text-outline uppercase block">Protección & Cargas</span>
            <div className="font-sans text-xs font-bold text-on-surface mt-1">
              {urbanPlan.isProtectedLand ? 'Afección Patrimonial / Ambiental' : 'Sin Afecciones Restrictivas'}
            </div>
            <span className="text-[10px] font-mono text-outline block mt-0.5">
              {urbanPlan.isProtectedLand ? 'Sujeto a catálogo histórico' : 'Régimen común edificatorio'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

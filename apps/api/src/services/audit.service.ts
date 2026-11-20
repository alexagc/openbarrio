import { randomUUID } from 'node:crypto';
import {
  PropertyAuditReport,
  PropertyTypology,
  detectPropertyTypology,
  CadastralProperty,
  CadastralCoordinates,
  CadastralUnitsResponse,
  CensusTractIncome,
  RentalBenchmark,
  CivicConnectivityData,
  TransitAccessibility,
  BroadbandCoverage,
  UrbanPlanningData,
  EnergyPerformanceCertificate,
  NeighborhoodTrends,
  BuildingSurroundingsDTO,
  RadonEvaluationDTO,
  VutEvaluationDTO,
  FiscalEstimateDTO,
  calculateFiscalEstimate,
  calculateBarrioScore,
  BuildingInspection,
  SeismicHazard,
  PedestrianIsochrones,
  evaluateBuildingInspectionAlert,
  evaluateSeismicVulnerability,
  calculatePedestrianIsochrones,
  LayerKey,
  LayerStatusInfo,
  toLayerStatusInfo,
  layerOk,
  layerUnavailable,
  layerOutOfCoverage,
  isLayerUsable,
} from '@openbarrio/core';
import { ProviderContainer, EnvironmentalAggregateResult, calculateBuildingCapExRisk } from '../providers/index.js';

export class AuditService {
  constructor(private readonly providers: ProviderContainer) {}

  /**
   * Generates a full due diligence audit report by WGS84 geographic coordinates.
   */
  async auditByCoordinates(
    latitude: number,
    longitude: number,
    waitUntil?: (promise: Promise<unknown>) => void
  ): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro (primary anchor)
    const catastroRes = this.providers.catastro.getByCoordinatesWithStatus
      ? await this.providers.catastro.getByCoordinatesWithStatus(latitude, longitude)
      : layerOk(
          'Sede Electrónica del Catastro (OVC)',
          await this.providers.catastro.getByCoordinates(latitude, longitude)
        );

    return this.generateReportForProperty(
      catastroRes.data!,
      waitUntil,
      toLayerStatusInfo(catastroRes)
    );
  }

  /**
   * Generates a full due diligence audit report by official Spanish cadastral reference.
   */
  async auditByCadastralReference(
    refcat: string,
    fallbackCoords?: CadastralCoordinates,
    preferredPortal?: string,
    waitUntil?: (promise: Promise<unknown>) => void
  ): Promise<PropertyAuditReport> {
    // 1. Fetch cadastral property data from Catastro (primary anchor)
    const catastroRes = this.providers.catastro.getByCadastralReferenceWithStatus
      ? await this.providers.catastro.getByCadastralReferenceWithStatus(
          refcat,
          fallbackCoords,
          preferredPortal
        )
      : layerOk(
          'Sede Electrónica del Catastro (OVC)',
          await this.providers.catastro.getByCadastralReference(refcat, fallbackCoords, preferredPortal)
        );

    return this.generateReportForProperty(
      catastroRes.data!,
      waitUntil,
      toLayerStatusInfo(catastroRes)
    );
  }

  /**
   * Retrieves horizontal division cadastral units for a parcel reference.
   */
  async getCadastralUnits(refcat: string): Promise<CadastralUnitsResponse> {
    return this.providers.catastro.getUnitsByCadastralReference(refcat);
  }

  /**
   * Retrieves official building/parcel geometry from Catastro WFS for 3D extrusion.
   */
  async getCadastralGeometry(refcat: string) {
    return this.providers.catastro.getGeometryByCadastralReference(refcat);
  }

  /**
   * Retrieves surrounding building volumes (INSPIRE WFS GetBuildingByParcel) for 3D urban context.
   */
  async getCadastralSurroundings(refcat?: string, bbox?: [number, number, number, number]): Promise<BuildingSurroundingsDTO> {
    if (refcat) {
      return this.providers.catastro.getSurroundingsByCadastralReference(refcat);
    }
    if (bbox && this.providers.catastro.getSurroundingsByBbox) {
      return this.providers.catastro.getSurroundingsByBbox(bbox);
    }
    return this.providers.catastro.getSurroundingsByCadastralReference('DEFAULT_REFCAT');
  }

  private async generateReportForProperty(
    property: CadastralProperty,
    waitUntil?: (promise: Promise<unknown>) => void,
    resolvedCatastroLayer?: LayerStatusInfo
  ): Promise<PropertyAuditReport> {
    const lat = property.coordinates.latitude;
    const lon = property.coordinates.longitude;

    // Detect authoritative property typology (prioritizing specific unit use if queried)
    const effectiveUse = property.unit?.use || property.building.primaryUse;
    const typology: PropertyTypology = property.typology ?? detectPropertyTypology(
      effectiveUse,
      property.building.constructionYear,
      property.building.unitsCount,
      property.cadastralReference
    );
    property.typology = typology;

    // 2. Resolve socioeconomic neighborhood first to obtain authoritative censusSectionCode
    const neighborhoodRes = await this.resolveNeighborhood(property);
    const neighborhood = neighborhoodRes.data;
    const censusSectionCode = neighborhood?.censusSectionCode;

    const provCode = property.address.provinceCode || property.address.postalCode.slice(0, 2) || '28';
    const rawMuniCode = property.address.municipalityCode || '';
    const resolvedMuniCode =
      rawMuniCode.length >= 5
        ? rawMuniCode
        : rawMuniCode.length > 0
        ? `${provCode}${rawMuniCode.padStart(3, '0')}`
        : censusSectionCode && censusSectionCode.length >= 5
        ? censusSectionCode.slice(0, 5)
        : undefined;

    // 3. Fetch parallel provider metrics using census tract context
    const [envAggregate, connectivityRes, urbanPlanningRes, energyRes, transitRes, broadbandRes] = await Promise.all([
      this.resolveEnvironment(property, censusSectionCode, waitUntil),
      this.resolveConnectivity(lat, lon, {
        municipality: property.address.municipality,
        street: property.address.street,
      }),
      this.resolveUrbanPlanning(property),
      this.resolveEnergy(property),
      this.resolveTransit(lat, lon, resolvedMuniCode),
      this.resolveBroadband(resolvedMuniCode, property.cadastralReference),
    ]);
    const environment = envAggregate.data;
    const connectivity = connectivityRes.data;
    const urbanPlanning = urbanPlanningRes.data;
    const energy = energyRes.data;
    const transit = transitRes.data;
    const broadband = broadbandRes.data;

    // 4. Calculate MIVAU SERPAVI rental benchmark & check stressed market status (Residential only)
    let rentalBenchmark: RentalBenchmark | undefined;
    let mivauLayer: LayerStatusInfo;
    if (typology === 'RESIDENTIAL') {
      const mivauRes = await this.providers.serpavi.getRentalBenchmark(property, censusSectionCode);
      mivauLayer = toLayerStatusInfo(mivauRes);
      rentalBenchmark = isLayerUsable(mivauRes.status) ? mivauRes.data : undefined;
    } else {
      mivauLayer = toLayerStatusInfo(
        layerOutOfCoverage('MIVAU SERPAVI', { reason: 'not_applicable' })
      );
    }

    // 5. Longitudinal Market Trends (INE IPV + ADRH income history, anchored on verified INE section)
    let marketTrends: NeighborhoodTrends | undefined;
    if (neighborhood) {
      try {
        marketTrends = await this.providers.marketTrends.getMarketTrends(
          property,
          neighborhood.censusSectionCode,
          neighborhood.averageNetHouseholdIncomeEur
        );
      } catch (err) {
        console.warn('[AuditService] Market trends resolution failed:', (err as Error)?.message);
        marketTrends = undefined;
      }
    }

    // 6. INE Experimental VUT Tourist Housing Evaluation (Residential only)
    let vut: VutEvaluationDTO | undefined;
    let vutLayer: LayerStatusInfo;
    if (typology === 'RESIDENTIAL') {
      const vutRes = await this.providers.vut.getVutEvaluation(censusSectionCode || '', {
        latitude: lat,
        longitude: lon,
      });
      vutLayer = toLayerStatusInfo(vutRes);
      vut = isLayerUsable(vutRes.status) ? vutRes.data : undefined;
    } else {
      vutLayer = toLayerStatusInfo(
        layerOutOfCoverage('INE VUT Experimental', { reason: 'not_applicable' })
      );
    }

    // 7. CTE DB-HS 6 Radon Geological Hazard Evaluation
    let floorLevel: number | undefined;
    if (property.unit?.floor) {
      const parsedFloor = parseInt(property.unit.floor, 10);
      if (!isNaN(parsedFloor)) {
        floorLevel = parsedFloor;
      } else if (/^(bj|b|pb|baja)$/i.test(property.unit.floor)) {
        floorLevel = 0;
      } else if (/^(ss|sótano|semisótano)$/i.test(property.unit.floor)) {
        floorLevel = -1;
      }
    }
    const radonMuniCode = resolvedMuniCode ?? `${provCode}001`;
    const radonRes = await this.providers.radon.getRadonEvaluation(
      radonMuniCode,
      provCode,
      floorLevel,
      property.building.unitsCount
    );
    const radonLayer = toLayerStatusInfo(radonRes);
    const radon: RadonEvaluationDTO | undefined = isLayerUsable(radonRes.status) ? radonRes.data : undefined;

    // 8. Municipal IBI & Regional ITP Fiscal Estimation
    const isUnbuilt = typology === 'VACANT_PLOT' || typology === 'RUSTIC' || property.building.builtSurfaceM2 === 0;
    const cadastralSurface = isUnbuilt
      ? (property.plotSurfaceM2 || property.building.plotSurfaceM2 || 0)
      : (property.unit?.builtSurfaceM2 || property.building.builtSurfaceM2 || 0);

    const fiscal: FiscalEstimateDTO = calculateFiscalEstimate({
      cadastralReference: property.cadastralReference,
      provinceCode: property.address.provinceCode || property.address.postalCode.slice(0, 2),
      municipalityName: property.address.municipality,
      purchasePriceEur: 0,
      cadastralSurfaceM2: cadastralSurface,
      constructionYear: property.building.constructionYear,
      typology,
    });

    // 9. Technical Building Inspection (ITE/IEE) & Preventive Alert (RD-L 7/2015)
    const iteResolution = await this.resolveBuildingInspection(property);
    const buildingInspection: BuildingInspection = iteResolution.inspection;

    // 10. IGN NCSE-02 Seismic Hazard & Structural Vulnerability
    let muniCodeForSeismic = property.address.municipalityCode;
    if (muniCodeForSeismic && muniCodeForSeismic.length === 3 && property.address.provinceCode) {
      muniCodeForSeismic = `${property.address.provinceCode}${muniCodeForSeismic}`;
    } else if (!muniCodeForSeismic || muniCodeForSeismic.length < 5) {
      muniCodeForSeismic = censusSectionCode
        ? censusSectionCode.slice(0, 5)
        : (property.address.provinceCode ? `${property.address.provinceCode}001` : '28079');
    }
    const seismicHazard: SeismicHazard = evaluateSeismicVulnerability(
      muniCodeForSeismic,
      property.building.constructionYear,
      undefined,
      property.address.municipality,
      property.address.provinceCode
    );
    const seismicLayer = toLayerStatusInfo(
      layerOk('IGN NCSE-02 Sismicidad', seismicHazard)
    );

    // 11. 15-Minute City Pedestrian Isochrones & Catchment Breakdown
    const pedestrianIsochrones: PedestrianIsochrones = calculatePedestrianIsochrones(
      [lon, lat],
      connectivity?.nearbyFacilities || []
    );

    // 12. Assemble all typed layer statuses and compute honest BarrioScore
    const catastroLayer =
      resolvedCatastroLayer ??
      toLayerStatusInfo(layerOk('Sede Electrónica del Catastro (OVC)', property));
    const allLayers: Record<LayerKey, LayerStatusInfo> = {
      catastro: catastroLayer,
      ine: neighborhoodRes.layer,
      sica: toLayerStatusInfo(envAggregate.layers.sica),
      snczi: toLayerStatusInfo(envAggregate.layers.snczi),
      mivau: mivauLayer,
      cee: energyRes.layer,
      radon: radonLayer,
      seismic: seismicLayer,
      ite: iteResolution.layer,
      vut: vutLayer,
      airQuality: toLayerStatusInfo(envAggregate.layers.airQuality),
      urbanPlanning: urbanPlanningRes.layer,
      connectivity: connectivityRes.layer,
      transit: transitRes.layer,
      broadband: broadbandRes.layer,
    };

    const score = calculateBarrioScore({
      property,
      neighborhood,
      environment,
      rentalBenchmark,
      connectivity,
      urbanPlanning,
      energy,
      vut,
      buildingInspection,
      seismicHazard,
      pedestrianIsochrones,
      layers: allLayers,
    });

    // 13. Calculate Building CapEx & Community Risk Intelligence (omit for unbuilt plots and rustic land)
    const capex = (typology === 'VACANT_PLOT' || typology === 'RUSTIC')
      ? undefined
      : calculateBuildingCapExRisk(property);

    // 14. Fetch surrounding buildings for 3D context
    let surroundings: BuildingSurroundingsDTO | undefined;
    try {
      surroundings = await this.getCadastralSurroundings(property.cadastralReference);
    } catch (err) {
      console.warn('[AuditService] Cadastral surroundings query failed:', (err as Error)?.message);
      surroundings = undefined;
    }

    return {
      id: randomUUID(),
      generatedAt: new Date().toISOString(),
      property,
      typology,
      neighborhood,
      environment,
      connectivity,
      urbanPlanning,
      score,
      layers: allLayers,
      coverage: score.coverage,
      rentalBenchmark,
      capex,
      energy,
      marketTrends,
      radon,
      vut,
      fiscal,
      surroundings,
      buildingInspection,
      seismicHazard,
      pedestrianIsochrones,
      ...(transit ? { transit } : {}),
      ...(broadband ? { broadband } : {}),
    };
  }

  private async resolveBuildingInspection(
    property: CadastralProperty
  ): Promise<{ inspection: BuildingInspection; layer: LayerStatusInfo }> {
    const refcat = property.cadastralReference;
    let officialRecord: Partial<BuildingInspection> | undefined;
    let d1Error = false;

    const db = this.providers.db;
    if (db) {
      try {
        const row = await db
          .prepare(
            `SELECT status, inspection_year, next_inspection_due_year, has_defects, defects_summary, municipal_registry
             FROM municipal_ite_records
             WHERE cadastral_reference = ?1 OR cadastral_reference = SUBSTR(?1, 1, 14) OR cadastral_reference LIKE ?1 || '%'
             ORDER BY LENGTH(cadastral_reference) DESC
             LIMIT 1`
          )
          .bind(refcat)
          .first<{
            status: string;
            inspection_year: number;
            next_inspection_due_year: number;
            has_defects: number;
            defects_summary: string;
            municipal_registry: string;
          }>();

        if (row) {
          let defectsSummary: string[] = [];
          if (row.defects_summary) {
            try {
              defectsSummary = JSON.parse(row.defects_summary);
            } catch {
              defectsSummary = [];
            }
          }

          officialRecord = {
            status: row.status as any,
            inspectionYear: row.inspection_year,
            nextInspectionDueYear: row.next_inspection_due_year,
            hasDefects: row.has_defects === 1,
            defectsSummary,
            municipalRegistry: row.municipal_registry,
          };
        }
      } catch (err) {
        d1Error = true;
        console.warn('[AuditService] Municipal ITE lookup failed:', (err as Error)?.message);
      }
    }

    const inspection = evaluateBuildingInspectionAlert(property, officialRecord);
    if (d1Error) {
      return {
        inspection,
        layer: toLayerStatusInfo(layerUnavailable('Registros Municipales ITE/IEE', 'upstream_error')),
      };
    }

    if (
      property.typology === 'VACANT_PLOT' ||
      property.typology === 'RUSTIC' ||
      !property.building.constructionYear ||
      property.building.constructionYear <= 0
    ) {
      return {
        inspection,
        layer: toLayerStatusInfo(
          layerOutOfCoverage('Registros Municipales ITE/IEE', { reason: 'not_applicable' })
        ),
      };
    }

    return {
      inspection,
      layer: toLayerStatusInfo(layerOk('Registros Municipales ITE/IEE', inspection)),
    };
  }

  private async resolveEnergy(
    property: CadastralProperty
  ): Promise<{ data?: EnergyPerformanceCertificate; layer: LayerStatusInfo }> {
    const res = await this.providers.cee.getEnergyCertificate(property);
    return {
      data: isLayerUsable(res.status) ? res.data : undefined,
      layer: toLayerStatusInfo(res),
    };
  }

  private async resolveNeighborhood(
    property: CadastralProperty
  ): Promise<{ data?: CensusTractIncome; layer: LayerStatusInfo }> {
    const sectionRes = await this.providers.ine.resolveCensusSection(
      property.coordinates.latitude,
      property.coordinates.longitude,
      property.address.provinceCode || property.address.postalCode.slice(0, 2),
      property.address.municipalityCode
    );
    if (!isLayerUsable(sectionRes.status) || !sectionRes.data) {
      return {
        data: undefined,
        layer: toLayerStatusInfo(sectionRes),
      };
    }

    const incomeRes = await this.providers.ine.getIncomeByCensusSection(sectionRes.data);
    return {
      data: isLayerUsable(incomeRes.status) ? incomeRes.data : undefined,
      layer: toLayerStatusInfo(incomeRes),
    };
  }

  private async resolveEnvironment(
    property: CadastralProperty,
    censusSectionCode?: string,
    waitUntil?: (promise: Promise<unknown>) => void
  ): Promise<EnvironmentalAggregateResult> {
    let aggregate: EnvironmentalAggregateResult;
    try {
      aggregate = await this.providers.environmental.getEnvironmentalData(
        property.coordinates.latitude,
        property.coordinates.longitude,
        censusSectionCode,
        waitUntil
      );
    } catch {
      aggregate = {
        data: {},
        layers: {
          sica: layerUnavailable('MITECO SICA', 'upstream_error'),
          snczi: layerUnavailable('MITECO SNCZI', 'upstream_error'),
          airQuality: layerUnavailable('MITECO ICA', 'upstream_error'),
        },
      };
    }

    // Attach air quality if provider was configured separately and sub-layer has not resolved yet
    if (!aggregate.data.airQuality && this.providers.airQuality) {
      try {
        const airQualityRes = await this.providers.airQuality.getAirQualityData(
          property.coordinates.latitude,
          property.coordinates.longitude
        );
        aggregate.layers.airQuality = airQualityRes;
        if (isLayerUsable(airQualityRes.status) && airQualityRes.data) {
          aggregate.data.airQuality = airQualityRes.data;
        }
      } catch {
        aggregate.layers.airQuality = layerUnavailable('MITECO ICA', 'upstream_error');
      }
    } else if (!this.providers.airQuality && aggregate.layers.airQuality.status === 'out_of_coverage') {
      aggregate.layers.airQuality = layerOutOfCoverage('MITECO ICA');
    }

    return aggregate;
  }

  private async resolveConnectivity(
    latitude: number,
    longitude: number,
    context?: { municipality?: string; street?: string }
  ): Promise<{ data?: CivicConnectivityData; layer: LayerStatusInfo }> {
    if (!this.providers.connectivity) {
      return {
        data: undefined,
        layer: toLayerStatusInfo(layerUnavailable('IGN / CNIG Equipamientos', 'upstream_error')),
      };
    }
    const res = await this.providers.connectivity.getConnectivityData(latitude, longitude, context);
    return {
      data: isLayerUsable(res.status) ? res.data : undefined,
      layer: toLayerStatusInfo(res),
    };
  }

  private async resolveTransit(
    latitude: number,
    longitude: number,
    municipalityCode?: string
  ): Promise<{ data?: TransitAccessibility; layer: LayerStatusInfo }> {
    if (!this.providers.transit) {
      return {
        data: undefined,
        layer: toLayerStatusInfo(layerUnavailable('MITMS NAP GTFS Transporte', 'upstream_error')),
      };
    }
    const res = await this.providers.transit.getTransitAccessibility(
      latitude,
      longitude,
      municipalityCode
    );
    const keepPartialData =
      isLayerUsable(res.status) ||
      (res.status === 'out_of_coverage' && res.data !== undefined);
    return {
      data: keepPartialData ? res.data : undefined,
      layer: toLayerStatusInfo(res),
    };
  }

  private async resolveBroadband(
    municipalityCode?: string,
    cadastralReference?: string
  ): Promise<{ data?: BroadbandCoverage; layer: LayerStatusInfo }> {
    if (!this.providers.broadband) {
      return {
        data: undefined,
        layer: toLayerStatusInfo(layerUnavailable('SETELECO / CNMC Banda Ancha', 'upstream_error')),
      };
    }
    const res = await this.providers.broadband.getBroadbandCoverage(
      municipalityCode,
      cadastralReference
    );
    return {
      data: isLayerUsable(res.status) ? res.data : undefined,
      layer: toLayerStatusInfo(res),
    };
  }

  private async resolveUrbanPlanning(
    property: CadastralProperty
  ): Promise<{ data?: UrbanPlanningData; layer: LayerStatusInfo }> {
    if (!this.providers.urbanPlanning) {
      return {
        data: undefined,
        layer: toLayerStatusInfo(layerUnavailable('MIVAU SIU Urbanismo', 'upstream_error')),
      };
    }
    const res = await this.providers.urbanPlanning.getUrbanPlanningData(property);
    return {
      data: isLayerUsable(res.status) ? res.data : undefined,
      layer: toLayerStatusInfo(res),
    };
  }
}

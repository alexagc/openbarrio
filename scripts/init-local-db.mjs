import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DATA_DIR, 'openbarrio.sqlite');

console.log('🏘️ [OpenBarrio] Initializing local database with real Spanish public data...');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Fast SQLite execution pragmas
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA synchronous = NORMAL;');

// 1. Always apply all migrations idempotently
console.log('📦 Applying D1 schemas (0001 - 0012)...');
const migrationFiles = [
  'apps/api/migrations/0001_initial_schema.sql',
  'apps/api/migrations/0002_civic_facilities.sql',
  'apps/api/migrations/0003_energy_certificates_and_trends.sql',
  'apps/api/migrations/0004_vut_and_radon_intelligence.sql',
  'apps/api/migrations/0005_serpavi_benchmarks.sql',
  'apps/api/migrations/0006_environmental_risk_precalc.sql',
  'apps/api/migrations/0007_cadastral_cache.sql',
  'apps/api/migrations/0008_building_inspection_and_seismic.sql',
  'apps/api/migrations/0009_source_snapshots.sql',
  'apps/api/migrations/0010_telemetry_aggregates.sql',
  'apps/api/migrations/0011_transit_stops.sql',
  'apps/api/migrations/0012_broadband_coverage.sql',
];

for (const mig of migrationFiles) {
  if (fs.existsSync(mig)) {
    const sql = fs.readFileSync(mig, 'utf8');
    db.exec(sql);
  }
}

// 2. Seed Radon Municipalities if empty
const radonCandidates = [
  'packages/etl/dist/openbarrio-etl-dist/cte_radon.sql',
  'packages/etl/dist/cte_radon.sql',
];
const radonDistSql = radonCandidates.find((p) => fs.existsSync(p));
const radonCount = Number(db.prepare('SELECT count(*) as total FROM cte_radon_municipalities').get()?.total || 0);

if (radonDistSql && radonCount < 1000) {
  console.log(`☢️ Loading CTE DB-HS 6 Radon distribution from ${radonDistSql}...`);
  const sql = fs.readFileSync(radonDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM cte_radon_municipalities').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} CTE DB-HS 6 Radon municipalities.`);
} else if (radonCount === 0) {
  console.log('☢️ Seeding CTE DB-HS 6 Radon Municipal Classifications...');
  const radonStmt = db.prepare(`
    INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone)
    VALUES (?, ?, ?, ?, ?)
  `);
  const radonData = [
    ['28079', 'Madrid', '28', 'Madrid', 'Zona I'],
    ['28068', 'Guadarrama', '28', 'Madrid', 'Zona II'],
    ['28047', 'Collado Villalba', '28', 'Madrid', 'Zona II'],
    ['28152', 'Torrelodones', '28', 'Madrid', 'Zona II'],
    ['28131', 'San Lorenzo de El Escorial', '28', 'Madrid', 'Zona II'],
    ['28061', 'Galapagar', '28', 'Madrid', 'Zona II'],
    ['32054', 'Ourense', '32', 'Ourense', 'Zona II'],
    ['36038', 'Pontevedra', '36', 'Pontevedra', 'Zona II'],
    ['36057', 'Vigo', '36', 'Pontevedra', 'Zona II'],
    ['15030', 'A Coruña', '15', 'A Coruña', 'Zona II'],
    ['15078', 'Santiago de Compostela', '15', 'A Coruña', 'Zona II'],
    ['37274', 'Salamanca', '37', 'Salamanca', 'Zona I'],
    ['05019', 'Ávila', '05', 'Ávila', 'Zona I'],
    ['40194', 'Segovia', '40', 'Segovia', 'Zona I'],
    ['45168', 'Toledo', '45', 'Toledo', 'Zona I'],
    ['10037', 'Cáceres', '10', 'Cáceres', 'Zona II'],
    ['08019', 'Barcelona', '08', 'Barcelona', 'Zona 0'],
    ['46250', 'València', '46', 'Valencia', 'Zona 0'],
    ['41091', 'Sevilla', '41', 'Sevilla', 'Zona 0'],
    ['50297', 'Zaragoza', '50', 'Zaragoza', 'Zona 0'],
    ['48020', 'Bilbao', '48', 'Bizkaia', 'Zona 0'],
    ['20069', 'Donostia / San Sebastián', '20', 'Gipuzkoa', 'Zona 0'],
    ['01059', 'Vitoria-Gasteiz', '01', 'Araba', 'Zona 0'],
    ['31201', 'Pamplona / Iruña', '31', 'Navarra', 'Zona 0'],
    ['07040', 'Palma', '07', 'Illes Balears', 'Zona 0'],
    ['29067', 'Málaga', '29', 'Málaga', 'Zona 0'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const r of radonData) {
    radonStmt.run(...r);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${radonData.length} CTE DB-HS 6 Radon municipalities.`);
}

// 3. Seed VUT Census Sections if empty
const vutCandidates = [
  'packages/etl/dist/openbarrio-etl-dist/vut_census_tracts.sql',
  'packages/etl/dist/vut_census_tracts.sql',
];
const vutDistSql = vutCandidates.find((p) => fs.existsSync(p));
const vutCount = Number(db.prepare('SELECT count(*) as total FROM census_tract_vut').get()?.total || 0);

if (vutDistSql && vutCount < 1000) {
  console.log(`🏖️ Loading INE Experimental VUT distribution from ${vutDistSql}...`);
  const sql = fs.readFileSync(vutDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM census_tract_vut').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} INE VUT census tracts.`);
} else if (vutCount < 14) {
  console.log('🏖️ Seeding INE Experimental VUT Tourist Housing datasets...');
  const vutStmt = db.prepare(`
    INSERT OR REPLACE INTO census_tract_vut (census_section_id, total_dwellings, vut_count, vut_beds, vut_ratio_pct)
    VALUES (?, ?, ?, ?, ?)
  `);
  const vutData = [
    // High / Critical
    ['2807901001', 1200, 168, 672, 14.0],
    ['2807901002', 1100, 110, 440, 10.0],
    ['0801901001', 1350, 162, 648, 12.0],
    ['4625001001', 950, 85, 340, 8.95],
    ['2906701001', 800, 104, 416, 13.0],
    // Moderate
    ['2807907001', 1400, 70, 280, 5.0],
    ['0801902001', 1500, 90, 360, 6.0],
    ['4109101001', 1200, 48, 192, 4.0],
    // Low
    ['2807917001', 1600, 8, 32, 0.5],
    ['2807917119', 1081, 4, 11, 0.37],
    ['2807917113', 1081, 4, 11, 0.37],
    ['2807904001', 1300, 26, 104, 2.0],
    ['4802001001', 1450, 22, 88, 1.52],
    ['3120101001', 1100, 20, 80, 1.82],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const v of vutData) {
    vutStmt.run(...v);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${vutData.length} INE VUT census tracts.`);
}

// 3b. Seed MIVAU SERPAVI Statutory Rental Benchmarks if empty
const serpaviCandidates = [
  'packages/etl/dist/openbarrio-etl-dist/serpavi_benchmarks.sql',
  'packages/etl/dist/serpavi_benchmarks.sql',
];
const serpaviDistSql = serpaviCandidates.find((p) => fs.existsSync(p));
const serpaviCount = Number(db.prepare('SELECT count(*) as total FROM mivau_serpavi_benchmarks').get()?.total || 0);

if (serpaviDistSql && serpaviCount < 100) {
  console.log(`⚖️ Loading MIVAU SERPAVI rental benchmarks from ${serpaviDistSql}...`);
  const sql = fs.readFileSync(serpaviDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM mivau_serpavi_benchmarks').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} MIVAU SERPAVI benchmarks.`);
} else if (serpaviCount === 0) {
  console.log('⚖️ Seeding MIVAU SERPAVI Statutory Rental Benchmarks...');
  const serpaviStmt = db.prepare(`
    INSERT OR REPLACE INTO mivau_serpavi_benchmarks (cusec, municipality_code, is_stressed_market, lower_bound_eur_m2, median_eur_m2, upper_bound_eur_m2, sample_size)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const serpaviData = [
    // Municipal aggregates (cusec = null)
    [null, '08019', 1, 15.2, 17.5, 19.8, 14200], // Barcelona (Stressed)
    [null, '08101', 1, 13.5, 15.2, 17.0, 4800],  // L'Hospitalet de Llobregat (Stressed)
    [null, '08015', 1, 12.8, 14.5, 16.2, 3200],  // Badalona (Stressed)
    [null, '28079', 0, 14.2, 16.4, 18.5, 21500], // Madrid
    [null, '46250', 0, 10.5, 12.2, 14.5, 6800],  // Valencia
    [null, '29067', 0, 11.0, 12.8, 14.8, 5400],  // Málaga
    [null, '41091', 0, 9.8, 11.5, 13.5, 4900],   // Sevilla
    [null, '48020', 0, 11.5, 13.2, 15.2, 3600],  // Bilbao
    [null, '20069', 0, 13.8, 15.9, 18.2, 2100],  // Donostia / San Sebastián
    [null, '07040', 0, 12.5, 14.8, 17.2, 3900],  // Palma
    [null, '50297', 0, 8.5, 9.8, 11.5, 3100],    // Zaragoza
    // Census tract fine-grained records
    ['0801901001', '08019', 1, 17.5, 19.8, 22.4, 450], // Barcelona - Eixample Dreta
    ['0801901002', '08019', 1, 16.8, 18.9, 21.2, 380], // Barcelona - Eixample Esquerra
    ['2807901001', '28079', 0, 16.5, 18.8, 21.5, 520], // Madrid - Centro / Gran Vía
    ['2807901002', '28079', 0, 15.8, 17.9, 20.2, 410], // Madrid - Palacio
    ['4625001001', '46250', 0, 11.8, 13.5, 15.8, 310], // Valencia - Ciutat Vella
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const s of serpaviData) {
    serpaviStmt.run(...s);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${serpaviData.length} MIVAU SERPAVI benchmarks.`);
}

// 3c. Seed MITECO SNCZI Pre-calculated Flood Risk if empty
const sncziCount = Number(db.prepare('SELECT count(*) as total FROM census_tract_snczi_risk').get()?.total || 0);
if (sncziCount === 0) {
  console.log('🌊 Seeding MITECO SNCZI Pre-calculated Flood Risk...');
  const sncziStmt = db.prepare(`
    INSERT OR REPLACE INTO census_tract_snczi_risk (cusec, municipality_code, flood_risk_level, return_period_years, is_in_preferential_flow_zone, source_layer)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const sncziData = [
    // Valencia / Paiporta / Horta Sud flood plain
    ['4625001001', '46250', 'HIGH', 10, 1, 'Zi_laminas_q10'],
    ['4625001002', '46250', 'MEDIUM', 50, 1, 'Zi_laminas_q50'],
    [null, '46250', 'HIGH', 10, 1, 'Zi_laminas_q10'],
    // Murcia / Segura river bend
    ['3000101001', '30001', 'MEDIUM', 100, 0, 'Zi_laminas_q100'],
    [null, '30001', 'LOW', 500, 0, 'Zi_laminas_q500'],
    // Zaragoza / Ebro basin
    ['5029701001', '50297', 'LOW', 500, 0, 'Zi_laminas_q500'],
    [null, '50297', 'NONE', null, 0, 'SNCZI_SAFE'],
    // Madrid / Centro
    ['2807901001', '28079', 'NONE', null, 0, 'SNCZI_SAFE'],
    [null, '28079', 'NONE', null, 0, 'SNCZI_SAFE'],
    // Barcelona / Eixample
    ['0801901001', '08019', 'NONE', null, 0, 'SNCZI_SAFE'],
    [null, '08019', 'NONE', null, 0, 'SNCZI_SAFE'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const row of sncziData) {
    sncziStmt.run(...row);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${sncziData.length} MITECO SNCZI flood risk records.`);
}

// 3d. Seed MITECO SICA Pre-calculated Strategic Noise Map if empty
const sicaCount = Number(db.prepare('SELECT count(*) as total FROM census_tract_sica_noise').get()?.total || 0);
if (sicaCount === 0) {
  console.log('📢 Seeding MITECO SICA Pre-calculated Strategic Noise Map...');
  const sicaStmt = db.prepare(`
    INSERT OR REPLACE INTO census_tract_sica_noise (cusec, municipality_code, day_evening_night_decibels, category, predominant_source)
    VALUES (?, ?, ?, ?, ?)
  `);
  const sicaData = [
    // Madrid
    ['2807901001', '28079', 68.5, 'NOISY', 'ROAD_TRAFFIC'],
    ['2807901002', '28079', 64.0, 'MODERATE', 'ROAD_TRAFFIC'],
    ['2807917001', '28079', 49.0, 'QUIET', 'NONE'],
    [null, '28079', 58.0, 'MODERATE', 'ROAD_TRAFFIC'],
    // Barcelona
    ['0801901001', '08019', 66.5, 'NOISY', 'ROAD_TRAFFIC'],
    ['0801901002', '08019', 62.0, 'MODERATE', 'ROAD_TRAFFIC'],
    [null, '08019', 61.5, 'MODERATE', 'ROAD_TRAFFIC'],
    // Prat airport corridor
    ['0816901001', '08169', 72.0, 'NOISY', 'AIRPORT'],
    [null, '08169', 68.0, 'NOISY', 'AIRPORT'],
    // Valencia
    ['4625001001', '46250', 65.5, 'NOISY', 'ROAD_TRAFFIC'],
    [null, '46250', 57.0, 'MODERATE', 'ROAD_TRAFFIC'],
    // Railway corridor (Sevilla)
    ['4109101001', '41091', 63.5, 'MODERATE', 'RAILWAY'],
    [null, '41091', 56.0, 'MODERATE', 'ROAD_TRAFFIC'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const row of sicaData) {
    sicaStmt.run(...row);
  }
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${sicaData.length} MITECO SICA noise records.`);
}

// 3e. Load pre-calculated MITECO environmental SQL distributions if present
const sncziCandidates = [
  'packages/etl/dist/snczi_risk.sql',
  'packages/etl/dist/openbarrio-etl-dist/snczi_risk.sql',
];
const sncziDistSql = sncziCandidates.find((p) => fs.existsSync(p));
if (sncziDistSql) {
  console.log(`🌊 Loading MITECO SNCZI flood risk distribution from ${sncziDistSql}...`);
  const sql = fs.readFileSync(sncziDistSql, 'utf8');
  db.exec(sql);
}

const sicaCandidates = [
  'packages/etl/dist/sica_noise.sql',
  'packages/etl/dist/openbarrio-etl-dist/sica_noise.sql',
];
const sicaDistSql = sicaCandidates.find((p) => fs.existsSync(p));
if (sicaDistSql) {
  console.log(`🔊 Loading MITECO SICA noise distribution from ${sicaDistSql}...`);
  const sql = fs.readFileSync(sicaDistSql, 'utf8');
  db.exec(sql);
}

// 3f. Seed Municipal Technical Building Inspection (ITE/IEE) Records
const iteCandidates = [
  'packages/etl/dist/openbarrio-etl-dist/municipal_ite.sql',
  'packages/etl/dist/municipal_ite.sql',
];
const iteDistSql = iteCandidates.find((p) => fs.existsSync(p));
const iteCount = Number(db.prepare('SELECT count(*) as total FROM municipal_ite_records').get()?.total || 0);

if (iteDistSql && iteCount < 10) {
  console.log(`🏗️ Loading Municipal ITE/IEE records from ${iteDistSql}...`);
  const sql = fs.readFileSync(iteDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM municipal_ite_records').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} Municipal ITE/IEE records.`);
}

// 3g. Seed IGN NCSE-02 Basic Seismic Hazard Records
const seismicCandidates = [
  'packages/etl/dist/openbarrio-etl-dist/ign_seismic.sql',
  'packages/etl/dist/ign_seismic.sql',
];
const seismicDistSql = seismicCandidates.find((p) => fs.existsSync(p));
const seismicCount = Number(db.prepare('SELECT count(*) as total FROM ign_seismic_hazard').get()?.total || 0);

if (seismicDistSql && seismicCount < 50) {
  console.log(`🌋 Loading IGN NCSE-02 Seismic Hazard reference from ${seismicDistSql}...`);
  const sql = fs.readFileSync(seismicDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM ign_seismic_hazard').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} IGN NCSE-02 Seismic Hazard municipal records.`);
}

// 4. Check & Load real INE ADRH data
let ineCount;
try {
  const row = db.prepare('SELECT count(*) as total FROM census_tract_income').get();
  ineCount = Number(row?.total || 0);
} catch {
  ineCount = 0;
}

if (ineCount > 1000) {
  console.log(`✅ [OpenBarrio] Database already contains ${ineCount} real census sections. Skipping INE ADRH seed.`);
} else {
  const ineCandidates = [
    'packages/etl/dist/ine_adrh.sql',
    'packages/etl/dist/openbarrio-etl-dist/ine_adrh.sql',
  ];
  const ineSqlPath = ineCandidates.find((p) => fs.existsSync(p));
  if (ineSqlPath) {
    console.log(`🇪🇸 Loading INE ADRH dataset (~36,000 Spanish census sections) from ${ineSqlPath}...`);
    const ineSql = fs.readFileSync(ineSqlPath, 'utf8');
    db.exec('BEGIN TRANSACTION;');
    db.exec(ineSql);
    db.exec('COMMIT;');
    console.log('✅ INE ADRH dataset loaded.');
  } else {
    console.warn('⚠️ Could not find ine_adrh.sql');
  }
}

// 5. Check & Load real civic facilities data
let facilitiesCount;
try {
  facilitiesCount = Number(db.prepare('SELECT count(*) as total FROM civic_facilities').get()?.total || 0);
} catch {
  facilitiesCount = 0;
}

if (facilitiesCount >= 50000) {
  console.log(`✅ [OpenBarrio] Database already contains ${facilitiesCount} civic facilities. Skipping seed.`);
} else {
  if (facilitiesCount > 0) {
    db.exec('DELETE FROM civic_facilities;');
  }
  const chunkCandidates = [
    'packages/etl/chunks/civic_facilities',
    'packages/etl/chunks',
    'packages/etl/dist/openbarrio-etl-dist/chunks',
  ];
  const activeChunksDir = chunkCandidates.find((d) => fs.existsSync(d) && fs.readdirSync(d).filter((f) => f.endsWith('.sql')).length >= 10);

  const facilitiesCandidates = [
    'packages/etl/dist/civic_facilities.sql',
    'packages/etl/dist/openbarrio-etl-dist/civic_facilities.sql',
  ];
  const facilitiesSqlPath = facilitiesCandidates.find((p) => fs.existsSync(p) && fs.statSync(p).size > 5 * 1024 * 1024);

  if (activeChunksDir) {
    console.log(`🏫 Loading civic facilities dataset from ${activeChunksDir}...`);
    const files = fs.readdirSync(activeChunksDir).filter((f) => f.endsWith('.sql') && f.includes('civic_facilities')).sort();
    for (const f of files) {
      const chunkSql = fs.readFileSync(path.join(activeChunksDir, f), 'utf8');
      db.exec(chunkSql);
    }
    const newCount = db.prepare('SELECT count(*) as total FROM civic_facilities').get()?.total || 0;
    console.log(`✅ Civic facilities dataset loaded from ${files.length} chunks (${newCount} facilities).`);
  } else if (facilitiesSqlPath) {
    console.log(`🏫 Loading civic facilities dataset from ${facilitiesSqlPath}...`);
    const facilitiesSql = fs.readFileSync(facilitiesSqlPath, 'utf8');
    db.exec(facilitiesSql);
    const newCount = db.prepare('SELECT count(*) as total FROM civic_facilities').get()?.total || 0;
    console.log(`✅ Civic facilities dataset loaded (${newCount} facilities).`);
  } else {
    console.warn('⚠️ Could not find full civic_facilities chunks or large SQL dump');
  }
}

// 6. Load Energy Performance Certificates (CEE) if empty or incomplete
let ceeCount;
try {
  ceeCount = Number(db.prepare('SELECT count(*) as total FROM building_energy_certificates').get()?.total || 0);
} catch {
  ceeCount = 0;
}

if (ceeCount >= 150000) {
  console.log(`⚡ Database already contains ${ceeCount} official energy certificates (CEE).`);
} else {
  if (ceeCount > 0) {
    db.exec('DELETE FROM building_energy_certificates;');
  }
  const ceeChunkCandidates = [
    'packages/etl/chunks/energy_certificates',
    'packages/etl/dist/openbarrio-etl-dist/chunks_cee',
  ];
  const ceeChunksDir = ceeChunkCandidates.find((d) => fs.existsSync(d) && fs.readdirSync(d).filter((f) => f.endsWith('.sql')).length >= 5);

  const ceeCandidates = [
    'packages/etl/dist/energy_certificates.sql',
    'packages/etl/dist/openbarrio-etl-dist/energy_certificates.sql',
  ];
  const ceeSqlPath = ceeCandidates.find((p) => fs.existsSync(p) && fs.statSync(p).size > 10 * 1024 * 1024);

  if (ceeChunksDir) {
    console.log(`⚡ Loading Energy Performance Certificates from ${ceeChunksDir}...`);
    const files = fs.readdirSync(ceeChunksDir).filter((f) => f.endsWith('.sql')).sort();
    for (const f of files) {
      const chunkSql = fs.readFileSync(path.join(ceeChunksDir, f), 'utf8');
      db.exec(chunkSql);
    }
    const newCount = db.prepare('SELECT count(*) as total FROM building_energy_certificates').get()?.total || 0;
    console.log(`✅ Energy Performance Certificates loaded from ${files.length} chunks (${newCount} certificates).`);
  } else if (ceeSqlPath) {
    console.log(`⚡ Loading Energy Performance Certificates from ${ceeSqlPath}...`);
    const ceeSql = fs.readFileSync(ceeSqlPath, 'utf8');
    db.exec(ceeSql);
    const newCount = db.prepare('SELECT count(*) as total FROM building_energy_certificates').get()?.total || 0;
    console.log(`✅ Energy Performance Certificates loaded (${newCount} certificates).`);
  } else {
    console.log('ℹ️ No full CEE chunks or large dump found (normative CTE engine will be used as fallback).');
  }
}

// 7. Seed GTFS/NAP Transit Stops & Feed Coverage if empty
const transitCandidates = [
  'packages/etl/dist/transit_stops.sql',
  'packages/etl/dist/openbarrio-etl-dist/transit_stops.sql',
];
const transitDistSql = transitCandidates.find((p) => fs.existsSync(p));
const transitCount = Number(db.prepare('SELECT count(*) as total FROM transit_stops').get()?.total || 0);

if (transitDistSql && transitCount < 10) {
  console.log(`🚆 Loading GTFS/NAP transit stops from ${transitDistSql}...`);
  const sql = fs.readFileSync(transitDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM transit_stops').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} GTFS/NAP transit stops.`);
} else if (transitCount === 0) {
  console.log('🚆 Seeding canonical GTFS/NAP transit MVP stops & coverage...');
  const covStmt = db.prepare(`
    INSERT OR REPLACE INTO transit_feed_coverage
    (municipality_code, area_name, ingested_feeds_count, expected_feeds_count, coverage_pct, covered_operators_json, missing_operators_json, source_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const covRows = [
    ['28079', 'Madrid', 4, 4, 100, JSON.stringify(['Metro de Madrid', 'EMT Madrid', 'Renfe Cercanías', 'Metro Ligero']), '[]', '2026-11-01'],
    ['08019', 'Barcelona', 4, 4, 100, JSON.stringify(['TMB Metro', 'TMB Bus', 'Rodalies de Catalunya', 'FGC / TRAM']), '[]', '2026-11-01'],
    ['46250', 'València', 2, 2, 100, JSON.stringify(['EMT València', 'Metrovalencia (FGV)']), '[]', '2026-11-01'],
    ['41091', 'Sevilla', 2, 2, 100, JSON.stringify(['TUSSAM', 'Metro de Sevilla / CTAN']), '[]', '2026-11-01'],
    ['50297', 'Zaragoza', 1, 2, 50, JSON.stringify(['Tranvía de Zaragoza']), JSON.stringify(['Avanza Bus Urbano', 'Renfe Cercanías Zaragoza']), '2026-11-01'],
    ['29067', 'Málaga', 1, 2, 50, JSON.stringify(['EMT Málaga']), JSON.stringify(['Metro de Málaga', 'Renfe Cercanías Málaga']), '2026-11-01'],
  ];

  const stopStmt = db.prepare(`
    INSERT OR REPLACE INTO transit_stops
    (stop_id, feed_id, operator_name, municipality_code, province_code, stop_name, mode, latitude, longitude, routes_count, peak_headway_min, offpeak_headway_min, hub_travel_times_json, source_date, license_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const stopRows = [
    ['crtm-madrid:SOL', 'crtm-madrid', 'CRTM Madrid (Metro / Cercanías)', '28079', '28', 'Sol (Metro L1, L2, L3 · Cercanías C3, C4)', 'metro', 40.4169, -3.7035, 5, 3.0, 5.0, JSON.stringify([{ hubName: 'Atocha Renfe', inVehicleMinutes: 4, mode: 'rail', lineName: 'C3 / C4' }, { hubName: 'Nuevos Ministerios', inVehicleMinutes: 7, mode: 'rail', lineName: 'C3 / C4' }]), '2026-11-01', 'MITMS-NAP-RISP / CRTM Open Data'],
    ['crtm-madrid:GRAN_VIA', 'crtm-madrid', 'CRTM Madrid (Metro)', '28079', '28', 'Gran Vía (Metro L1, L5)', 'metro', 40.4201, -3.7022, 2, 3.5, 5.5, JSON.stringify([{ hubName: 'Sol', inVehicleMinutes: 2, mode: 'metro', lineName: 'L1' }, { hubName: 'Atocha', inVehicleMinutes: 7, mode: 'metro', lineName: 'L1' }]), '2026-11-01', 'MITMS-NAP-RISP / CRTM Open Data'],
    ['crtm-madrid:CALLAO', 'crtm-madrid', 'CRTM Madrid (Metro)', '28079', '28', 'Callao (Metro L3, L5)', 'metro', 40.4202, -3.7056, 2, 3.5, 6.0, JSON.stringify([{ hubName: 'Moncloa', inVehicleMinutes: 7, mode: 'metro', lineName: 'L3' }]), '2026-11-01', 'MITMS-NAP-RISP / CRTM Open Data'],
    ['crtm-madrid:CASTELLANA_BM', 'crtm-madrid', 'CRTM Madrid (Metro / EMT)', '28079', '28', 'Santiago Bernabéu (Metro L10 · EMT 14, 27, 40)', 'metro', 40.4521, -3.6908, 5, 4.0, 6.5, JSON.stringify([{ hubName: 'Nuevos Ministerios', inVehicleMinutes: 2, mode: 'metro', lineName: 'L10' }]), '2026-11-01', 'MITMS-NAP-RISP / CRTM Open Data'],
    ['crtm-madrid:VILLAVERDE_ALTO', 'crtm-madrid', 'CRTM Madrid (Metro / Cercanías)', '28079', '28', 'Villaverde Alto (L3 · Cercanías C4, C5)', 'rail', 40.3479, -3.7098, 3, 6.0, 10.0, JSON.stringify([{ hubName: 'Atocha Renfe', inVehicleMinutes: 13, mode: 'rail', lineName: 'C4 / C5' }]), '2026-11-01', 'MITMS-NAP-RISP / CRTM Open Data'],
    ['tmb-atm-barcelona:PASSEIG_GRACIA', 'tmb-atm-barcelona', 'TMB & ATM Barcelona', '08019', '08', 'Passeig de Gràcia (L2, L3, L4 · Rodalies R2)', 'metro', 41.3922, 2.1652, 5, 3.0, 5.0, JSON.stringify([{ hubName: 'Plaça de Catalunya', inVehicleMinutes: 2, mode: 'metro', lineName: 'L3' }, { hubName: 'Barcelona Sants', inVehicleMinutes: 6, mode: 'rail', lineName: 'R2' }]), '2026-11-01', 'CC-BY-4.0 / TMB Open Data'],
    ['tmb-atm-barcelona:DIAGONAL', 'tmb-atm-barcelona', 'TMB & ATM Barcelona', '08019', '08', 'Diagonal / Provença (L3, L5 · FGC)', 'metro', 41.3936, 2.1604, 4, 3.5, 5.5, JSON.stringify([{ hubName: 'Plaça de Catalunya', inVehicleMinutes: 4, mode: 'rail', lineName: 'FGC S1/S2' }]), '2026-11-01', 'CC-BY-4.0 / TMB Open Data'],
    ['emt-atmv-valencia:COLON', 'emt-atmv-valencia', 'Metrovalencia & EMT València', '46250', '46', 'Colón (Metrovalencia L3, L5, L7, L9)', 'metro', 39.4695, -0.3715, 4, 5.0, 8.0, JSON.stringify([{ hubName: 'Xàtiva / Estació del Nord', inVehicleMinutes: 2, mode: 'metro', lineName: 'L3 / L5' }]), '2026-11-01', 'CC-BY-4.0 (GVA / Ayto. València)'],
    ['emt-atmv-valencia:XATIVA', 'emt-atmv-valencia', 'Metrovalencia & EMT València', '46250', '46', 'Xàtiva (Metro L3, L5, L9 · Estació del Nord)', 'metro', 39.4673, -0.3771, 5, 4.5, 7.5, JSON.stringify([{ hubName: 'Joaquín Sorolla AVE', inVehicleMinutes: 4, mode: 'metro', lineName: 'L1 / L2' }]), '2026-11-01', 'CC-BY-4.0 (GVA / Ayto. València)'],
    ['tussam-ctan-sevilla:PLAZA_NUEVA', 'tussam-ctan-sevilla', 'TUSSAM & MetroCentro Sevilla', '41091', '41', 'Plaza Nueva (Tranvía T1 · TUSSAM)', 'tram', 37.3888, -5.9962, 4, 6.0, 10.0, JSON.stringify([{ hubName: 'Puerta de Jerez (Metro L1)', inVehicleMinutes: 4, mode: 'tram', lineName: 'T1' }]), '2026-11-01', 'CC-BY-4.0 (IDE Sevilla / Junta de Andalucía)'],
    ['tussam-ctan-sevilla:PUERTA_JEREZ', 'tussam-ctan-sevilla', 'Metro de Sevilla & TUSSAM', '41091', '41', 'Puerta de Jerez (Metro L1 · Tranvía T1)', 'metro', 37.3821, -5.9945, 3, 5.0, 8.5, JSON.stringify([{ hubName: 'Nervión / Santa Justa', inVehicleMinutes: 7, mode: 'metro', lineName: 'L1' }]), '2026-11-01', 'CC-BY-4.0 (IDE Sevilla / Junta de Andalucía)'],
    ['zaragoza-tranvia:PLAZA_ESPANA', 'zaragoza-tranvia', 'Tranvía de Zaragoza', '50297', '50', 'Plaza España (Tranvía L1)', 'tram', 41.6528, -0.8809, 1, 5.5, 9.0, JSON.stringify([{ hubName: 'Gran Vía / Universidad', inVehicleMinutes: 7, mode: 'tram', lineName: 'L1' }]), '2026-11-01', 'CC-BY-4.0 (Ayto. Zaragoza)'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const r of covRows) covStmt.run(...r);
  for (const r of stopRows) stopStmt.run(...r);
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${stopRows.length} GTFS/NAP transit stops across ${covRows.length} coverage zones.`);
}

// 8. Seed SETELECO / CNMC Broadband Coverage if empty
const broadbandCandidates = [
  'packages/etl/dist/broadband_coverage.sql',
  'packages/etl/dist/openbarrio-etl-dist/broadband_coverage.sql',
];
const broadbandDistSql = broadbandCandidates.find((p) => fs.existsSync(p));
const broadbandCount = Number(db.prepare('SELECT count(*) as total FROM broadband_coverage').get()?.total || 0);

if (broadbandDistSql && broadbandCount === 0) {
  console.log(`📡 Loading SETELECO / CNMC broadband coverage from ${broadbandDistSql}...`);
  const sql = fs.readFileSync(broadbandDistSql, 'utf8');
  db.exec(sql);
  const newCount = db.prepare('SELECT count(*) as total FROM broadband_coverage').get()?.total || 0;
  console.log(`✅ Loaded ${newCount} broadband coverage territories.`);
} else if (broadbandCount === 0) {
  console.log('📡 Seeding canonical SETELECO / CNMC broadband coverage rows...');
  const bbStmt = db.prepare(`
    INSERT OR REPLACE INTO broadband_coverage
    (territory_code, municipality_code, entity_name, granularity, ftth_pct, fixed_max_mbps, mobile_5g_pct, source_year, source_date, source_dataset)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const bbRows = [
    ['28079', '28079', 'Madrid', 'municipality', 99.1, 10000, 98.4, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['08019', '08019', 'Barcelona', 'municipality', 99.3, 10000, 98.7, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['46250', '46250', 'València', 'municipality', 98.6, 10000, 97.2, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['41091', '41091', 'Sevilla', 'municipality', 97.8, 1000, 96.5, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['48020', '48020', 'Bilbao', 'municipality', 98.4, 10000, 96.8, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['20069', '20069', 'Donostia / San Sebastián', 'municipality', 98.1, 10000, 96.1, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['31201', '31201', 'Pamplona / Iruña', 'municipality', 97.9, 1000, 95.4, 2025, '2026-11-01', 'CNMCData / SETELECO Municipal 2025'],
    ['50297', '50297', 'Zaragoza', 'municipality', 96.9, 1000, 95.2, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['29067', '29067', 'Málaga', 'municipality', 96.4, 1000, 95.0, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['18087', '18087', 'Granada', 'municipality', 95.8, 1000, 93.4, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['30030', '30030', 'Murcia', 'municipality', 94.2, 1000, 91.8, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['07040', '07040', 'Palma', 'municipality', 95.1, 1000, 92.6, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['36057', '36057', 'Vigo', 'municipality', 94.6, 1000, 90.4, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['15030', '15030', 'A Coruña', 'municipality', 96.2, 1000, 92.1, 2024, '2024-06-30', 'SETELECO Cobertura Banda Ancha 2024'],
    ['28068000100', '28068', 'Guadarrama (ESP 2020)', 'population_entity', 82.4, 300, 12.0, 2020, '2020-12-31', 'SETELECO ESP Serie Histórica 2020'],
    ['44216000100', '44216', 'Teruel (ESP 2020)', 'population_entity', 78.5, 300, 8.5, 2020, '2020-12-31', 'SETELECO ESP Serie Histórica 2020'],
    ['42173000100', '42173', 'Soria (ESP 2020)', 'population_entity', 79.1, 300, 9.0, 2020, '2020-12-31', 'SETELECO ESP Serie Histórica 2020'],
  ];

  db.exec('BEGIN TRANSACTION;');
  for (const r of bbRows) bbStmt.run(...r);
  db.exec('COMMIT;');
  console.log(`✅ Seeded ${bbRows.length} SETELECO / CNMC broadband coverage rows.`);
}

const finalRow = db.prepare('SELECT count(*) as total FROM census_tract_income').get();
console.log(`🎉 [OpenBarrio] Database ready with ${finalRow?.total || 0} census tracts at: ${DB_PATH}`);

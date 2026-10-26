import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { DatabaseSync } from 'node:sqlite';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'openbarrio.sqlite');

console.log('⚡ [OpenBarrio ETL] Multi-region Open Data Energy Certificates (CEE) Ingestion...');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new DatabaseSync(DB_PATH);

// Ensure schema exists
const migrationSql = fs.readFileSync('apps/api/migrations/0003_energy_certificates_and_trends.sql', 'utf8');
db.exec(migrationSql);

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO building_energy_certificates 
  (cadastral_reference, rating_emissions, rating_consumption, co2_emissions, primary_energy, registration_number, scope, valid_until, is_estimated)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
`);

// 1. Ingest Priority Reference Certificates
const priorityCertificates = [
  {
    refcat: '0269303VK4606G0077SR',
    emissions: 'D',
    consumption: 'D',
    co2: 22.03,
    primary: 107.06,
    regNum: '10/339702.9/22',
    scope: 'unit',
    validUntil: '2032-05-31'
  },
  {
    refcat: '0269303VK4606G0079FY',
    emissions: 'G',
    consumption: 'G',
    co2: 84.34,
    primary: 405.61,
    regNum: '45/345077.9/18',
    scope: 'unit',
    validUntil: '2028-07-02'
  },
  {
    refcat: '0269303VK4606G',
    emissions: 'E',
    consumption: 'E',
    co2: 34.1,
    primary: 162.0,
    regNum: 'MAD-DGIEM-2022-0039104',
    scope: 'building',
    validUntil: '2032-10-18'
  },
  {
    refcat: '9872023VH5797S0001WX',
    emissions: 'C',
    consumption: 'C',
    co2: 18.4,
    primary: 98.2,
    regNum: 'MAD-CEE-2023-0049182',
    scope: 'building',
    validUntil: '2033-04-15'
  },
  {
    refcat: '0549711VK4704H',
    emissions: 'D',
    consumption: 'D',
    co2: 24.5,
    primary: 125.0,
    regNum: 'MAD-CEE-2022-0081293',
    scope: 'building',
    validUntil: '2032-11-20'
  },
  {
    refcat: '0227802DF3802E',
    emissions: 'B',
    consumption: 'B',
    co2: 12.1,
    primary: 65.4,
    regNum: 'BCN-ICAEN-2024-0012934',
    scope: 'building',
    validUntil: '2034-02-10'
  },
  {
    refcat: '48020A00100010',
    emissions: 'D',
    consumption: 'D',
    co2: 26.2,
    primary: 134.5,
    regNum: 'EUS-CEE-2021-0019284',
    scope: 'parcel',
    validUntil: '2031-06-30'
  },
  {
    refcat: '201010485A',
    emissions: 'C',
    consumption: 'C',
    co2: 19.8,
    primary: 104.2,
    regNum: 'NAV-CEE-2023-0008472',
    scope: 'parcel',
    validUntil: '2033-08-14'
  }
];

db.exec('BEGIN TRANSACTION;');
for (const cert of priorityCertificates) {
  insertStmt.run(
    cert.refcat,
    cert.emissions,
    cert.consumption,
    cert.co2,
    cert.primary,
    cert.regNum,
    cert.scope,
    cert.validUntil
  );
}
db.exec('COMMIT;');
console.log(`✅ Seeded ${priorityCertificates.length} reference certificates.`);

// 2. Ingest Catalunya (ICAEN Socrata) in fast streaming chunks
function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve([]);
        }
      });
      res.on('error', () => resolve([]));
    });
  });
}

async function ingestCatalunya(totalTarget = 25000) {
  console.log(`📡 Fetching Open Data Catalunya (ICAEN), target: ${totalTarget} records...`);
  const chunkSize = 2500;
  let inserted = 0;

  for (let offset = 0; offset < totalTarget; offset += chunkSize) {
    const url = `https://analisi.transparenciacatalunya.cat/resource/j6ii-t3w2.json?$limit=${chunkSize}&$offset=${offset}&$where=referencia_cadastral+IS+NOT+NULL`;
    const rows = await fetchJson(url);
    if (!rows || rows.length === 0) break;

    db.exec('BEGIN TRANSACTION;');
    let batch = 0;
    for (const r of rows) {
      const refcat = r.referencia_cadastral?.toUpperCase().replace(/[\s\-_.]/g, '');
      const emiss = r.qualificacio_d_emissions?.toUpperCase();
      const cons = r.qualificaci_de_consum_d?.toUpperCase();
      if (!refcat || refcat.length < 14 || !emiss || !cons) continue;
      if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(emiss)) continue;
      if (!['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(cons)) continue;

      const co2 = parseFloat(r.emissions_de_co2?.replace(',', '.')) || null;
      const energy = parseFloat(r.energia_prim_ria_no_renovable?.replace(',', '.')) || null;
      const reg = r.num_cas ? `CAT-${r.num_cas}` : 'CAT-ICAEN';
      let validUntil = null;
      if (r.data_entrada && r.data_entrada.includes('-')) {
        const p = r.data_entrada.split('T')[0].split('-');
        if (p.length === 3) validUntil = `${parseInt(p[0], 10) + 10}-${p[1]}-${p[2]}`;
      }

      try {
        insertStmt.run(
          refcat,
          emiss,
          cons,
          co2,
          energy,
          reg,
          refcat.length === 20 ? 'unit' : 'building',
          validUntil
        );
        batch++;
      } catch {
        // ignore collisions
      }
    }
    db.exec('COMMIT;');
    inserted += batch;
    console.log(`  ⏳ Catalunya: +${batch} CEEs (Offset: ${offset}, Total Cat: ${inserted})`);
  }
  console.log(`🎉 Finished Catalunya! Inserted ${inserted} official certificates.`);
}

await ingestCatalunya(25000);

const total = db.prepare('SELECT count(*) as total FROM building_energy_certificates').get();
console.log(`🏆 Total official CEE certificates in SQLite: ${total.total}`);

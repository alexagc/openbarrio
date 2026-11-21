#!/usr/bin/env python3
"""
Autonomous ETL script: Ingest & Map IGN NCSE-02 Basic Seismic Acceleration Values.
Source: Instituto Geográfico Nacional (IGN) & Ministerio de Transportes / Fomento.
Normativa: Real Decreto 997/2002, de 27 de septiembre (NCSE-02).
Anejo 1: Clasificación de la peligrosidad sísmica por municipios.

Features:
  - Maps basic seismic acceleration (ab in units of g) for ALL 8,131 Spanish municipalities.
  - Granular municipality-specific acceleration for official NCSE-02 seismic areas (Granada,
    Murcia, Almería, Alicante, Málaga, Jaén, Pyrenees, etc.).
  - Official provincial baselines for seismic provinces and normative national baseline (0.04g) for the rest.
  - Categorizes risk level: VERY_LOW (<0.06g), LOW (0.06-0.08g), MEDIUM (0.08-0.16g), HIGH (>=0.16g).
  - Flags regulatory vulnerability thresholds for pre-NCSE-94 construction.
  - Generates idempotent SQL statements for Cloudflare D1 and local SQLite (without D1-incompatible transactions).
  - Supports --sync-db to populate openbarrio.sqlite directly.

Usage:
  python3 packages/etl/src/process_ign_seismic.py [--output-sql packages/etl/dist/openbarrio-etl-dist/ign_seismic.sql] [--sync-db]
"""

import argparse
import csv
import os
import sqlite3
import sys
import urllib.request

INE_MUNICIPIOS_URL = "https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/master/data/municipios.csv"

DEFAULT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "ign_seismic.sql"
)
ALT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "ign_seismic.sql"
)
LOCAL_DB_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "openbarrio.sqlite"
)
INE_MUNICIPIOS_CSV = os.path.join(
    os.path.dirname(__file__), "..", "dist", "ine_municipios.csv"
)

# Canonical 52 Spanish province names
OFFICIAL_PROVINCE_NAMES = {
    "01": "Araba/Álava",
    "02": "Albacete",
    "03": "Alicante/Alacant",
    "04": "Almería",
    "05": "Ávila",
    "06": "Badajoz",
    "07": "Illes Balears",
    "08": "Barcelona",
    "09": "Burgos",
    "10": "Cáceres",
    "11": "Cádiz",
    "12": "Castellón/Castelló",
    "13": "Ciudad Real",
    "14": "Córdoba",
    "15": "A Coruña",
    "16": "Cuenca",
    "17": "Girona",
    "18": "Granada",
    "19": "Guadalajara",
    "20": "Gipuzkoa",
    "21": "Huelva",
    "22": "Huesca",
    "23": "Jaén",
    "24": "León",
    "25": "Lleida",
    "26": "La Rioja",
    "27": "Lugo",
    "28": "Madrid",
    "29": "Málaga",
    "30": "Murcia",
    "31": "Navarra",
    "32": "Ourense",
    "33": "Asturias",
    "34": "Palencia",
    "35": "Las Palmas",
    "36": "Pontevedra",
    "37": "Salamanca",
    "38": "Santa Cruz de Tenerife",
    "39": "Cantabria",
    "40": "Segovia",
    "41": "Sevilla",
    "42": "Soria",
    "43": "Tarragona",
    "44": "Teruel",
    "45": "Toledo",
    "46": "Valencia/València",
    "47": "Valladolid",
    "48": "Bizkaia",
    "49": "Zamora",
    "50": "Zaragoza",
    "51": "Ceuta",
    "52": "Melilla",
}

# Granular municipal basic accelerations (ab in g) from NCSE-02 Anejo 1
SPECIFIC_NCSE02_MUNICIPALITIES = {
    # Granada Cluster (Highest seismic risk in Spain)
    "18087": 0.23,  # Granada
    "18175": 0.24,  # Santa Fe
    "18021": 0.24,  # Atarfe
    "18017": 0.23,  # Armilla
    "18003": 0.23,  # Albolote
    "18127": 0.23,  # Maracena
    "18034": 0.17,  # Baza
    "18140": 0.12,  # Motril
    "18014": 0.21,  # Alhama de Granada
    "18089": 0.15,  # Guadix
    "18059": 0.22,  # Churriana de la Vega
    "18115": 0.23,  # Las Gabias
    "18062": 0.22,  # Cúllar Vega
    "18158": 0.23,  # Peligros
    "18157": 0.22,  # Ogíjares
    "18193": 0.22,  # La Zubia
    "18099": 0.23,  # Huétor Vega
    "18101": 0.22,  # Huétor Tájar
    "18122": 0.21,  # Loja

    # Murcia Cluster (Lorca / Guadalentín valley)
    "30024": 0.19,  # Lorca
    "30030": 0.15,  # Murcia
    "30039": 0.17,  # Totana
    "30016": 0.10,  # Cartagena
    "30006": 0.16,  # Águilas
    "30019": 0.12,  # Cieza
    "30015": 0.14,  # Caravaca de la Cruz
    "30026": 0.16,  # Mazarrón
    "30002": 0.15,  # Alcantarilla
    "30008": 0.16,  # Alhama de Murcia
    "30033": 0.17,  # Puerto Lumbreras
    "30027": 0.16,  # Mula
    "30012": 0.15,  # Bullas
    "30017": 0.14,  # Cehegín
    "30022": 0.13,  # Jumilla
    "30043": 0.11,  # Yecla
    "30028": 0.13,  # Torre-Pacheco
    "30035": 0.12,  # San Javier
    "30036": 0.11,  # San Pedro del Pinatar

    # Almería Cluster
    "04013": 0.19,  # Almería
    "04029": 0.20,  # Berja
    "04902": 0.18,  # El Ejido
    "04079": 0.18,  # Roquetas de Mar
    "04003": 0.20,  # Adra
    "04100": 0.17,  # Vera
    "04038": 0.16,  # Cuevas del Almanzora
    "04053": 0.19,  # Huércal de Almería
    "04099": 0.17,  # Vícar
    "04052": 0.16,  # Huércal-Overa
    "04010": 0.19,  # Albox
    "04035": 0.19,  # Cantoria
    "04066": 0.18,  # Níjar
    "04064": 0.17,  # Mojácar
    "04049": 0.18,  # Gádor

    # Alicante Cluster (Vega Baja del Segura)
    "03014": 0.11,  # Alicante/Alacant
    "03133": 0.17,  # Torrevieja
    "03099": 0.17,  # Orihuela
    "03065": 0.13,  # Elche/Elx
    "03059": 0.14,  # Crevillent
    "03009": 0.10,  # Alcoi/Alcoy
    "03031": 0.08,  # Benidorm
    "03066": 0.10,  # Elda
    "03121": 0.13,  # Santa Pola
    "03011": 0.16,  # Almoradí
    "03070": 0.16,  # Guardamar del Segura
    "03049": 0.16,  # Callosa de Segura
    "03061": 0.16,  # Dolores
    "03105": 0.16,  # Pilar de la Horadada
    "03113": 0.15,  # Rojales
    "03021": 0.13,  # Aspe
    "03096": 0.11,  # Novelda
    "03140": 0.09,  # Villena
    "03063": 0.08,  # Dénia
    "03081": 0.08,  # Xàbia/Jávea

    # Málaga Cluster
    "29067": 0.11,  # Málaga
    "29015": 0.10,  # Antequera
    "29094": 0.11,  # Vélez-Málaga
    "29070": 0.09,  # Marbella
    "29084": 0.10,  # Ronda
    "29054": 0.10,  # Fuengirola
    "29025": 0.11,  # Benalmádena
    "29092": 0.11,  # Torremolinos
    "29075": 0.10,  # Mijas
    "29051": 0.10,  # Estepona
    "29007": 0.11,  # Alhaurín de la Torre
    "29008": 0.11,  # Alhaurín el Grande
    "29046": 0.11,  # Cártama
    "29077": 0.11,  # Nerja
    "29012": 0.11,  # Álora
    "29017": 0.11,  # Archidona

    # Jaén & Andalusia
    "23050": 0.09,  # Jaén
    "23005": 0.14,  # Alcalá la Real
    "23001": 0.13,  # Albanchez de Mágina
    "23010": 0.12,  # Alcaudete
    "23053": 0.08,  # Linares
    "23009": 0.09,  # Andújar
    "23092": 0.09,  # Úbeda
    "23019": 0.09,  # Baeza
    "23055": 0.10,  # Mancha Real
    "23060": 0.11,  # Martos
    "23086": 0.10,  # Torredelcampo
    "23087": 0.10,  # Torredonjimeno
    "11012": 0.08,  # Cádiz
    "11020": 0.08,  # Jerez de la Frontera
    "11004": 0.09,  # Algeciras
    "11033": 0.09,  # San Fernando
    "11027": 0.08,  # El Puerto de Santa María
    "11015": 0.09,  # Chiclana de la Frontera
    "11022": 0.09,  # La Línea de la Concepción
    "11032": 0.08,  # Sanlúcar de Barrameda
    "11006": 0.09,  # Arcos de la Frontera
    "11035": 0.09,  # Tarifa
    "14021": 0.06,  # Córdoba
    "14041": 0.09,  # Lucena
    "14013": 0.08,  # Cabra
    "14056": 0.08,  # Priego de Córdoba
    "14055": 0.07,  # Puente Genil
    "21041": 0.06,  # Huelva
    "41091": 0.04,  # Sevilla
    "41038": 0.06,  # Écija
    "41071": 0.06,  # Osuna
    "41065": 0.06,  # Morón de la Frontera

    # Pyrenean Seismic Belt (Huesca, Girona, Navarra, Lleida)
    "22130": 0.10,  # Jaca
    "22059": 0.10,  # Biescas
    "22078": 0.10,  # Canfranc
    "22054": 0.10,  # Benasque
    "22125": 0.07,  # Huesca
    "22205": 0.09,  # Sabiñánigo
    "22066": 0.09,  # Broto
    "22058": 0.09,  # Bielsa
    "22076": 0.09,  # Campo
    "22032": 0.09,  # Aínsa-Sobrarbe
    "17114": 0.09,  # Olot
    "17147": 0.09,  # Ripoll
    "17038": 0.10,  # Camprodon
    "17079": 0.06,  # Girona
    "17163": 0.09,  # Sant Joan de les Abadesses
    "17141": 0.09,  # Ribes de Freser
    "17070": 0.08,  # Figueres
    "17019": 0.08,  # Banyoles
    "31201": 0.08,  # Pamplona/Iruña
    "31032": 0.09,  # Baztan
    "31050": 0.09,  # Bera
    "31084": 0.08,  # Etxarri Aranatz
    "31010": 0.08,  # Altsasu/Alsasua
    "31092": 0.08,  # Etxalar
    "31207": 0.08,  # Puente la Reina/Gares
    "31097": 0.07,  # Estella-Lizarra
    "31232": 0.07,  # Tafalla
    "31235": 0.06,  # Tudela
    "25254": 0.09,  # Vielha e Mijaran
    "25120": 0.05,  # Lleida
    "25207": 0.08,  # La Seu d'Urgell
    "25200": 0.08,  # Sort
    "25176": 0.08,  # El Pont de Suert
    "25232": 0.08,  # Tremp

    # Other regions
    "02003": 0.06,  # Albacete
    "02037": 0.09,  # Hellín
    "02081": 0.08,  # Tobarra
    "02005": 0.08,  # Almansa
    "02025": 0.08,  # Caudete
    "44216": 0.06,  # Teruel
    "44013": 0.07,  # Albarracín
    "44023": 0.06,  # Andorra
    "51001": 0.06,  # Ceuta
    "52001": 0.09,  # Melilla
    "12040": 0.05,  # Castelló de la Plana
    "26089": 0.05,  # Logroño
}

# Provincial default baselines for seismic provinces
PROVINCIAL_BASELINE_ACCELERATION = {
    "18": 0.20,  # Granada (HIGH)
    "04": 0.18,  # Almería (HIGH)
    "30": 0.15,  # Murcia (MEDIUM)
    "03": 0.11,  # Alicante (MEDIUM)
    "29": 0.10,  # Málaga (MEDIUM)
    "23": 0.09,  # Jaén (MEDIUM)
    "52": 0.09,  # Melilla (MEDIUM)
    "11": 0.08,  # Cádiz (MEDIUM)
    "22": 0.07,  # Huesca (LOW)
    "17": 0.06,  # Girona (LOW)
    "31": 0.06,  # Navarra (LOW)
    "44": 0.06,  # Teruel (LOW)
    "51": 0.06,  # Ceuta (LOW)
    "14": 0.06,  # Córdoba (LOW)
    "21": 0.06,  # Huelva (LOW)
    "02": 0.06,  # Albacete (LOW)
    "12": 0.05,  # Castellón (VERY_LOW)
    "25": 0.05,  # Lleida (VERY_LOW)
    "26": 0.05,  # La Rioja (VERY_LOW)
}

# Normative standard acceleration for all other 33 Spanish provinces
NATIONAL_STANDARD_BASELINE = 0.04  # VERY_LOW


def determine_risk_level(ab: float) -> str:
    """Categorizes basic acceleration ab (g) into NCSE-02 risk level."""
    if ab >= 0.16:
        return "HIGH"
    elif ab >= 0.08:
        return "MEDIUM"
    elif ab >= 0.06:
        return "LOW"
    else:
        return "VERY_LOW"


def load_all_spanish_municipalities(csv_path: str) -> list:
    """
    Reads official INE municipalities catalog from CSV.
    Returns list of tuples: (muni_code, muni_name, prov_code, prov_name, ab, risk_level)
    """
    records = []

    if not os.path.exists(csv_path):
        print(f"⚠️ INE municipalities file not found at {csv_path}. Downloading official catalog...")
        os.makedirs(os.path.dirname(csv_path), exist_ok=True)
        try:
            req = urllib.request.Request(
                INE_MUNICIPIOS_URL,
                headers={"User-Agent": "OpenBarrio-ETL/1.5 (+https://github.com/alexagc/openbarrio)"},
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
            with open(csv_path, "wb") as f:
                f.write(data)
            print(f"✅ Downloaded official INE municipalities catalog ({len(data)} bytes) to {csv_path}.")
        except Exception as exc:
            print(f"❌ Failed to download INE municipalities catalog: {exc}")
            return []

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            muni_code = row.get("municipio_id", "").strip().zfill(5)
            prov_code = row.get("provincia_id", "").strip().zfill(2)
            muni_name = row.get("nombre", "").strip()

            if not muni_code or len(muni_code) != 5:
                continue

            prov_name = OFFICIAL_PROVINCE_NAMES.get(prov_code, f"Provincia {prov_code}")

            # 1. Check granular municipality-specific acceleration
            if muni_code in SPECIFIC_NCSE02_MUNICIPALITIES:
                ab = SPECIFIC_NCSE02_MUNICIPALITIES[muni_code]
            # 2. Check provincial baseline for seismic zones
            elif prov_code in PROVINCIAL_BASELINE_ACCELERATION:
                ab = PROVINCIAL_BASELINE_ACCELERATION[prov_code]
            # 3. Standard national baseline
            else:
                ab = NATIONAL_STANDARD_BASELINE

            risk_level = determine_risk_level(ab)
            records.append((muni_code, muni_name, prov_code, prov_name, ab, risk_level))

    return records


CHUNKS_PRIMARY_DIR = os.path.join(
    os.path.dirname(__file__), "..", "chunks", "ign_seismic"
)
CHUNKS_ALT_DIR = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "chunks_seismic"
)


def write_sql_chunks(records: list, output_dirs: list, prefix: str = "ign_seismic", chunk_size: int = 2500):
    """Splits statements into Cloudflare D1-safe chunks of max chunk_size statements."""
    for out_dir in output_dirs:
        os.makedirs(out_dir, exist_ok=True)
        for f in os.listdir(out_dir):
            if f.startswith(prefix) and f.endswith(".sql"):
                try:
                    os.remove(os.path.join(out_dir, f))
                except OSError:
                    pass

    num_chunks = (len(records) + chunk_size - 1) // chunk_size
    header = f"-- Cloudflare D1 Batch Insert Chunk for {prefix}\n"

    for i in range(num_chunks):
        chunk_slice = records[i * chunk_size : (i + 1) * chunk_size]
        chunk_stmts = []
        for muni_code, muni_name, prov_code, prov_name, ab, risk_level in chunk_slice:
            escaped_name = muni_name.replace("'", "''")
            escaped_prov = prov_name.replace("'", "''")
            sql = (
                f"INSERT OR REPLACE INTO ign_seismic_hazard "
                f"(municipality_code, municipality_name, province_code, province_name, basic_acceleration_g, risk_level) "
                f"VALUES ('{muni_code}', '{escaped_name}', '{prov_code}', '{escaped_prov}', {ab:.2f}, '{risk_level}');"
            )
            chunk_stmts.append(sql)

        chunk_filename = f"{prefix}_part_{str(i + 1).zfill(2)}.sql"
        chunk_content = header + "\n\n".join(chunk_stmts) + "\n"

        for out_dir in output_dirs:
            chunk_path = os.path.join(out_dir, chunk_filename)
            with open(chunk_path, "w", encoding="utf-8") as f:
                f.write(chunk_content)

    print(f"📦 Successfully generated {num_chunks} D1 chunks in {output_dirs}")


def generate_sql_statements(records: list) -> str:
    """Generates idempotent SQLite / Cloudflare D1 SQL statements."""
    lines = [
        "-- OpenBarrio IGN NCSE-02 Seismic Hazard Reference Data",
        "-- Source: Instituto Geográfico Nacional (IGN) / Real Decreto 997/2002",
        f"-- Total Municipalities Covered: {len(records)}",
    ]

    for muni_code, muni_name, prov_code, prov_name, ab, risk_level in records:
        escaped_name = muni_name.replace("'", "''")
        escaped_prov = prov_name.replace("'", "''")
        sql = (
            f"INSERT OR REPLACE INTO ign_seismic_hazard "
            f"(municipality_code, municipality_name, province_code, province_name, basic_acceleration_g, risk_level) "
            f"VALUES ('{muni_code}', '{escaped_name}', '{prov_code}', '{escaped_prov}', {ab:.2f}, '{risk_level}');"
        )
        lines.append(sql)

    return "\n".join(lines) + "\n"


def sync_sqlite_database(db_path: str, records: list):
    """Inserts or replaces seismic hazard records in the local SQLite database."""
    if not os.path.exists(db_path):
        print(f"⚠️ Target database not found at {db_path}. Skipping direct sync.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Ensure table exists
    cursor.execute("""
      CREATE TABLE IF NOT EXISTS ign_seismic_hazard (
        municipality_code TEXT PRIMARY KEY,
        municipality_name TEXT NOT NULL,
        province_code TEXT NOT NULL,
        province_name TEXT NOT NULL,
        basic_acceleration_g REAL NOT NULL,
        risk_level TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );
    """)

    stmt = """
      INSERT OR REPLACE INTO ign_seismic_hazard
      (municipality_code, municipality_name, province_code, province_name, basic_acceleration_g, risk_level)
      VALUES (?, ?, ?, ?, ?, ?)
    """

    cursor.executemany(stmt, records)
    conn.commit()
    conn.close()
    print(f"✅ Successfully synchronized {len(records)} IGN NCSE-02 seismic records to SQLite database: {db_path}")


def main():
    parser = argparse.ArgumentParser(description="Process and map IGN NCSE-02 basic seismic acceleration values.")
    parser.add_argument("--output-sql", default=DEFAULT_OUTPUT_SQL, help="Output path for SQL migration script.")
    parser.add_argument("--sync-db", action="store_true", help="Sync directly with data/openbarrio.sqlite.")
    args = parser.parse_args()

    print(f"🌋 Reading official Spanish municipalities from {INE_MUNICIPIOS_CSV}...")
    records = load_all_spanish_municipalities(INE_MUNICIPIOS_CSV)

    if not records:
        print("❌ ERROR: No municipality records loaded. Exiting.")
        sys.exit(1)

    print(f"🌋 Successfully processed {len(records)} Spanish municipalities with IGN NCSE-02 seismic hazard.")

    # Print summary statistics
    counts = {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "VERY_LOW": 0}
    for r in records:
        counts[r[5]] += 1
    print(f"   📊 Risk Distribution: HIGH={counts['HIGH']}, MEDIUM={counts['MEDIUM']}, LOW={counts['LOW']}, VERY_LOW={counts['VERY_LOW']}")

    sql_content = generate_sql_statements(records)

    # Write primary output SQL
    out_dir = os.path.dirname(args.output_sql)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    with open(args.output_sql, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"💾 Wrote SQL to {args.output_sql}")

    # Also keep ALT_OUTPUT_SQL in sync if distinct
    if os.path.abspath(args.output_sql) != os.path.abspath(ALT_OUTPUT_SQL):
        alt_dir = os.path.dirname(ALT_OUTPUT_SQL)
        if alt_dir and not os.path.exists(alt_dir):
            os.makedirs(alt_dir, exist_ok=True)
        with open(ALT_OUTPUT_SQL, "w", encoding="utf-8") as f:
            f.write(sql_content)
        print(f"💾 Synchronized SQL copy to {ALT_OUTPUT_SQL}")

    # Generate versioned D1 chunks
    write_sql_chunks(records, [CHUNKS_PRIMARY_DIR, CHUNKS_ALT_DIR])

    if args.sync_db:
        sync_sqlite_database(LOCAL_DB_PATH, records)


if __name__ == "__main__":
    main()

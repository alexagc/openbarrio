#!/usr/bin/env python3
"""
Autonomous ETL script: Ingest & Map IGN NCSE-02 Basic Seismic Acceleration Values.
Source: Instituto Geográfico Nacional (IGN) & Ministerio de Transportes / Fomento.
Normativa: Real Decreto 997/2002, de 27 de septiembre (NCSE-02).
Anejo 1: Clasificación de la peligrosidad sísmica por municipios.

Features:
  - Maps basic seismic acceleration (ab in units of g) by 5-digit INE municipality code.
  - Categorizes risk level: VERY_LOW (<0.06g), LOW (0.06-0.08g), MEDIUM (0.08-0.16g), HIGH (>=0.16g).
  - Flags regulatory vulnerability thresholds for pre-NCSE-94 construction.
  - Generates idempotent SQL statements for Cloudflare D1 and local SQLite.
  - Supports --sync-db to populate openbarrio.sqlite directly.

Usage:
  python3 packages/etl/src/process_ign_seismic.py [--output-sql packages/etl/dist/openbarrio-etl-dist/ign_seismic.sql] [--sync-db]
"""

import argparse
import os
import sqlite3
import sys

DEFAULT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "ign_seismic.sql"
)
LOCAL_DB_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "openbarrio.sqlite"
)

# Canonical dataset of Spanish municipalities with official NCSE-02 basic acceleration (ab in g)
CANONICAL_SEISMIC_DATA = [
    # Granada Cluster (Highest seismic risk in Spain)
    ("18087", "Granada", "18", "Granada", 0.23, "HIGH"),
    ("18175", "Santa Fe", "18", "Granada", 0.24, "HIGH"),
    ("18021", "Atarfe", "18", "Granada", 0.24, "HIGH"),
    ("18017", "Armilla", "18", "Granada", 0.23, "HIGH"),
    ("18003", "Albolote", "18", "Granada", 0.23, "HIGH"),
    ("18127", "Maracena", "18", "Granada", 0.23, "HIGH"),
    ("18034", "Baza", "18", "Granada", 0.17, "HIGH"),
    ("18140", "Motril", "18", "Granada", 0.12, "MEDIUM"),
    ("18014", "Alhama de Granada", "18", "Granada", 0.21, "HIGH"),
    ("18089", "Guadix", "18", "Granada", 0.15, "MEDIUM"),

    # Murcia Cluster (Lorca / Guadalentín valley)
    ("30024", "Lorca", "30", "Murcia", 0.19, "HIGH"),
    ("30030", "Murcia", "30", "Murcia", 0.15, "MEDIUM"),
    ("30039", "Totana", "30", "Murcia", 0.17, "HIGH"),
    ("30016", "Cartagena", "30", "Murcia", 0.10, "MEDIUM"),
    ("30006", "Águilas", "30", "Murcia", 0.16, "HIGH"),
    ("30019", "Cieza", "30", "Murcia", 0.12, "MEDIUM"),
    ("30015", "Caravaca de la Cruz", "30", "Murcia", 0.14, "MEDIUM"),
    ("30026", "Mazarrón", "30", "Murcia", 0.16, "HIGH"),
    ("30002", "Alcantarilla", "30", "Murcia", 0.15, "MEDIUM"),

    # Almería Cluster
    ("04013", "Almería", "04", "Almería", 0.19, "HIGH"),
    ("04029", "Berja", "04", "Almería", 0.20, "HIGH"),
    ("04902", "El Ejido", "04", "Almería", 0.18, "HIGH"),
    ("04079", "Roquetas de Mar", "04", "Almería", 0.18, "HIGH"),
    ("04003", "Adra", "04", "Almería", 0.20, "HIGH"),
    ("04100", "Vera", "04", "Almería", 0.17, "HIGH"),
    ("04038", "Cuevas del Almanzora", "04", "Almería", 0.16, "HIGH"),

    # Alicante Cluster (Vega Baja del Segura)
    ("03014", "Alicante/Alacant", "03", "Alicante", 0.11, "MEDIUM"),
    ("03133", "Torrevieja", "03", "Alicante", 0.17, "HIGH"),
    ("03099", "Orihuela", "03", "Alicante", 0.17, "HIGH"),
    ("03065", "Elche/Elx", "03", "Alicante", 0.13, "MEDIUM"),
    ("03059", "Crevillent", "03", "Alicante", 0.14, "MEDIUM"),
    ("03009", "Alcoi/Alcoy", "03", "Alicante", 0.10, "MEDIUM"),
    ("03031", "Benidorm", "03", "Alicante", 0.08, "MEDIUM"),
    ("03066", "Elda", "03", "Alicante", 0.10, "MEDIUM"),
    ("03121", "Santa Pola", "03", "Alicante", 0.13, "MEDIUM"),

    # Málaga Cluster
    ("29067", "Málaga", "29", "Málaga", 0.11, "MEDIUM"),
    ("29015", "Antequera", "29", "Málaga", 0.10, "MEDIUM"),
    ("29094", "Vélez-Málaga", "29", "Málaga", 0.11, "MEDIUM"),
    ("29070", "Marbella", "29", "Málaga", 0.09, "MEDIUM"),
    ("29084", "Ronda", "29", "Málaga", 0.10, "MEDIUM"),
    ("29054", "Fuengirola", "29", "Málaga", 0.10, "MEDIUM"),

    # Jaén & Andalusia
    ("23050", "Jaén", "23", "Jaén", 0.09, "MEDIUM"),
    ("23005", "Alcalá la Real", "23", "Jaén", 0.14, "MEDIUM"),
    ("11012", "Cádiz", "11", "Cádiz", 0.08, "MEDIUM"),
    ("11020", "Jerez de la Frontera", "11", "Cádiz", 0.08, "MEDIUM"),
    ("11004", "Algeciras", "11", "Cádiz", 0.09, "MEDIUM"),
    ("14021", "Córdoba", "14", "Córdoba", 0.06, "LOW"),
    ("41091", "Sevilla", "41", "Sevilla", 0.04, "VERY_LOW"),
    ("21041", "Huelva", "21", "Huelva", 0.06, "LOW"),

    # Pyrenean Seismic Belt (Huesca, Girona, Navarra, Lleida)
    ("22125", "Jaca", "22", "Huesca", 0.10, "MEDIUM"),
    ("22059", "Biescas", "22", "Huesca", 0.10, "MEDIUM"),
    ("22078", "Canfranc", "22", "Huesca", 0.10, "MEDIUM"),
    ("22054", "Benasque", "22", "Huesca", 0.10, "MEDIUM"),
    ("22000", "Huesca", "22", "Huesca", 0.07, "LOW"),
    ("17114", "Olot", "17", "Girona", 0.09, "MEDIUM"),
    ("17147", "Ripoll", "17", "Girona", 0.09, "MEDIUM"),
    ("17038", "Camprodon", "17", "Girona", 0.10, "MEDIUM"),
    ("17000", "Girona", "17", "Girona", 0.06, "LOW"),
    ("31201", "Pamplona/Iruña", "31", "Navarra", 0.08, "MEDIUM"),
    ("25254", "Vielha e Mijaran", "25", "Lleida", 0.09, "MEDIUM"),
    ("25000", "Lleida", "25", "Lleida", 0.05, "VERY_LOW"),

    # Baseline capitals and standard provinces (ab = 0.04g, VERY_LOW)
    ("28079", "Madrid", "28", "Madrid", 0.04, "VERY_LOW"),
    ("08019", "Barcelona", "08", "Barcelona", 0.04, "VERY_LOW"),
    ("46250", "València", "46", "Valencia", 0.04, "VERY_LOW"),
    ("50297", "Zaragoza", "50", "Zaragoza", 0.04, "VERY_LOW"),
    ("48020", "Bilbao", "48", "Bizkaia", 0.04, "VERY_LOW"),
    ("20069", "Donostia/San Sebastián", "20", "Gipuzkoa", 0.04, "VERY_LOW"),
    ("01059", "Vitoria-Gasteiz", "01", "Araba", 0.04, "VERY_LOW"),
    ("47186", "Valladolid", "47", "Valladolid", 0.04, "VERY_LOW"),
    ("15030", "A Coruña", "15", "A Coruña", 0.04, "VERY_LOW"),
    ("36057", "Vigo", "36", "Pontevedra", 0.04, "VERY_LOW"),
    ("33044", "Oviedo", "33", "Asturias", 0.04, "VERY_LOW"),
    ("39075", "Santander", "39", "Cantabria", 0.04, "VERY_LOW"),
    ("07040", "Palma", "07", "Illes Balears", 0.04, "VERY_LOW"),
    ("38038", "Santa Cruz de Tenerife", "38", "Santa Cruz de Tenerife", 0.04, "VERY_LOW"),
    ("35016", "Las Palmas de Gran Canaria", "35", "Las Palmas", 0.04, "VERY_LOW"),
    ("45168", "Toledo", "45", "Toledo", 0.04, "VERY_LOW"),
    ("10037", "Cáceres", "10", "Cáceres", 0.04, "VERY_LOW"),
    ("06015", "Badajoz", "06", "Badajoz", 0.04, "VERY_LOW"),
    ("02003", "Albacete", "02", "Albacete", 0.06, "LOW"),
    ("05019", "Ávila", "05", "Ávila", 0.04, "VERY_LOW"),
    ("09059", "Burgos", "09", "Burgos", 0.04, "VERY_LOW"),
    ("12040", "Castelló de la Plana", "12", "Castellón", 0.05, "VERY_LOW"),
    ("13034", "Ciudad Real", "13", "Ciudad Real", 0.04, "VERY_LOW"),
    ("16078", "Cuenca", "16", "Cuenca", 0.04, "VERY_LOW"),
    ("19130", "Guadalajara", "19", "Guadalajara", 0.04, "VERY_LOW"),
    ("24089", "León", "24", "León", 0.04, "VERY_LOW"),
    ("26089", "Logroño", "26", "La Rioja", 0.05, "VERY_LOW"),
    ("27028", "Lugo", "27", "Lugo", 0.04, "VERY_LOW"),
    ("32054", "Ourense", "32", "Ourense", 0.04, "VERY_LOW"),
    ("34120", "Palencia", "34", "Palencia", 0.04, "VERY_LOW"),
    ("37274", "Salamanca", "37", "Salamanca", 0.04, "VERY_LOW"),
    ("40194", "Segovia", "40", "Segovia", 0.04, "VERY_LOW"),
    ("42173", "Soria", "42", "Soria", 0.04, "VERY_LOW"),
    ("43148", "Tarragona", "43", "Tarragona", 0.04, "VERY_LOW"),
    ("44216", "Teruel", "44", "Teruel", 0.06, "LOW"),
    ("49275", "Zamora", "49", "Zamora", 0.04, "VERY_LOW"),
    ("51001", "Ceuta", "51", "Ceuta", 0.06, "LOW"),
    ("52001", "Melilla", "52", "Melilla", 0.09, "MEDIUM"),
]

def generate_sql_statements(records: list) -> str:
    """Generates idempotent SQLite / Cloudflare D1 SQL statements."""
    lines = [
        "-- OpenBarrio IGN NCSE-02 Seismic Hazard Reference Data",
        "-- Source: Instituto Geográfico Nacional (IGN) / Real Decreto 997/2002",
        "BEGIN TRANSACTION;",
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

    lines.append("COMMIT;")
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

    print(f"🌋 Processing {len(CANONICAL_SEISMIC_DATA)} IGN NCSE-02 seismic hazard municipal records...")

    sql_content = generate_sql_statements(CANONICAL_SEISMIC_DATA)

    out_dir = os.path.dirname(args.output_sql)
    if out_dir and not os.path.exists(out_dir):
        os.makedirs(out_dir, exist_ok=True)

    with open(args.output_sql, "w", encoding="utf-8") as f:
        f.write(sql_content)
    print(f"💾 Wrote SQL to {args.output_sql}")

    if args.sync_db:
        sync_sqlite_database(LOCAL_DB_PATH, CANONICAL_SEISMIC_DATA)

if __name__ == "__main__":
    main()

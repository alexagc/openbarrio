#!/usr/bin/env python3
"""
Autonomous ETL script: Process Spanish Civic Facilities (Phase 9B).
Ingests and normalizes official public facility records for Spain across 4 civic types:
  - 'healthcare' (subtypes: 'primary_care', 'hospital' from REPS / Catálogo Nacional de Hospitales)
  - 'education'  (subtypes: 'school', 'high_school' from MEFP Centros Docentes)
  - 'transit'    (subtypes: 'metro', 'train', 'bus_hub' from Adif / Cercanías / Metro networks)
  - 'park'       (subtypes: 'urban_park', 'metropolitan_park' from IGN CartoCiudad / SIOSE)

Outputs:
  - Cloudflare D1 SQL script: `dist/openbarrio-etl-dist/civic_facilities.sql`
  - Optional local SQLite database: `dist/civic_facilities.db`

Usage:
  python3 process_civic_facilities.py [--input path/to/facilities.csv]
                                     [--output-sql dist/openbarrio-etl-dist/civic_facilities.sql]
                                     [--output-db dist/civic_facilities.db]
                                     [--force-sample]
"""

import argparse
import csv
import json
import os
import sys

# Try importing duckdb if available
try:
    import duckdb
    HAS_DUCKDB = True
except ImportError:
    HAS_DUCKDB = False

# Import sample facilities seed generator
try:
    from sample_facilities import get_sample_facilities
except ImportError:
    try:
        from .sample_facilities import get_sample_facilities
    except ImportError:
        get_sample_facilities = None

DEFAULT_OUTPUT_DIST_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "civic_facilities.sql"
)
DEFAULT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "civic_facilities.sql"
)
DEFAULT_OUTPUT_DB = os.path.join(
    os.path.dirname(__file__), "..", "dist", "civic_facilities.db"
)

D1_FACILITIES_SCHEMA_SQL = """-- Cloudflare D1 Schema for OpenBarrio Civic Facilities (Phase 9B)
CREATE TABLE IF NOT EXISTS civic_facilities (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  municipality_code TEXT NOT NULL,
  postal_code TEXT
);
CREATE INDEX IF NOT EXISTS idx_facilities_coords ON civic_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_type ON civic_facilities(type);
"""

VALID_TYPES = {"healthcare", "education", "transit", "park"}
VALID_SUBTYPES = {
    "healthcare": {"primary_care", "hospital"},
    "education": {"school", "high_school"},
    "transit": {"metro", "train", "bus_hub"},
    "park": {"urban_park", "metropolitan_park"},
}

# Mapping common Spanish terms to standard types and subtypes
TYPE_NORMALIZATION_MAP = {
    # Healthcare
    "salud": "healthcare",
    "sanidad": "healthcare",
    "sanitario": "healthcare",
    "hospital": "healthcare",
    "centro de salud": "healthcare",
    "hospitalario": "healthcare",
    "atencion primaria": "healthcare",
    "cap": "healthcare",
    # Education
    "educacion": "education",
    "educativo": "education",
    "colegio": "education",
    "instituto": "education",
    "escuela": "education",
    "centro docente": "education",
    "ceip": "education",
    "ies": "education",
    # Transit
    "transporte": "transit",
    "transito": "transit",
    "movilidad": "transit",
    "metro": "transit",
    "ferrocarril": "transit",
    "renfe": "transit",
    "adif": "transit",
    "tren": "transit",
    "cercanias": "transit",
    "autobus": "transit",
    "estacion": "transit",
    "intercambiador": "transit",
    # Park
    "parque": "park",
    "zonas verdes": "park",
    "espacio verde": "park",
    "jardin": "park",
    "siose": "park",
}

SUBTYPE_NORMALIZATION_MAP = {
    # Healthcare
    "hospital": "hospital",
    "hospital general": "hospital",
    "hospital universitario": "hospital",
    "complejo hospitalario": "hospital",
    "centro de salud": "primary_care",
    "consultorio": "primary_care",
    "cap": "primary_care",
    "atencion primaria": "primary_care",
    "ambulatorio": "primary_care",
    # Education
    "school": "school",
    "colegio": "school",
    "ceip": "school",
    "primaria": "school",
    "infantil": "school",
    "escuela": "school",
    "high_school": "high_school",
    "ies": "high_school",
    "instituto": "high_school",
    "secundaria": "high_school",
    "bachillerato": "high_school",
    # Transit
    "metro": "metro",
    "subway": "metro",
    "tren": "train",
    "train": "train",
    "cercanias": "train",
    "rodalies": "train",
    "ferrocarril": "train",
    "adif": "train",
    "renfe": "train",
    "ave": "train",
    "bus": "bus_hub",
    "autobus": "bus_hub",
    "estacion autobuses": "bus_hub",
    "bus_hub": "bus_hub",
    "intercambiador": "bus_hub",
    # Parks
    "urban_park": "urban_park",
    "parque urbano": "urban_park",
    "jardin": "urban_park",
    "jardin historico": "urban_park",
    "plaza ajardinada": "urban_park",
    "metropolitan_park": "metropolitan_park",
    "parque metropolitano": "metropolitan_park",
    "parque periurbano": "metropolitan_park",
    "parque natural": "metropolitan_park",
    "parque forestal": "metropolitan_park",
}


def normalize_facility(raw: dict, index: int = 0) -> dict | None:
    """Normalizes a raw facility dictionary into the verified schema."""
    # Resolve name
    name = (
        raw.get("name")
        or raw.get("nombre")
        or raw.get("denominacion")
        or raw.get("nom")
        or raw.get("center_name")
        or ""
    ).strip()

    if not name:
        return None

    # Resolve coordinates
    try:
        lat_raw = raw.get("latitude") or raw.get("lat") or raw.get("latitud") or raw.get("y")
        lon_raw = raw.get("longitude") or raw.get("lon") or raw.get("lng") or raw.get("longitud") or raw.get("x")
        if lat_raw is None or lon_raw is None:
            return None
        latitude = float(str(lat_raw).replace(",", "."))
        longitude = float(str(lon_raw).replace(",", "."))
    except (ValueError, TypeError):
        return None

    # Validate Spanish geographical bounds (Canary Islands: ~27.5N, Mainland: 36N to 43.8N, -18.2W to 4.5E)
    if not (27.0 <= latitude <= 44.5 and -18.5 <= longitude <= 5.0):
        return None

    # Resolve municipality code (5-digit INE CUMUN)
    muni_raw = (
        raw.get("municipality_code")
        or raw.get("cod_mun")
        or raw.get("cumun")
        or raw.get("municipio_codigo")
        or raw.get("ine_code")
        or ""
    )
    municipality_code = str(muni_raw).strip().zfill(5) if muni_raw else "00000"
    if len(municipality_code) > 5:
        municipality_code = municipality_code[:5]

    # Resolve postal code
    postal_raw = (
        raw.get("postal_code")
        or raw.get("codigo_postal")
        or raw.get("cp")
        or raw.get("zip_code")
        or ""
    )
    postal_code = str(postal_raw).strip().zfill(5) if postal_raw else None
    if postal_code and (len(postal_code) != 5 or not postal_code.isdigit()):
        postal_code = None

    # Resolve type
    raw_type = (
        raw.get("type")
        or raw.get("tipo")
        or raw.get("categoria")
        or raw.get("ambito")
        or ""
    ).strip().lower()

    facility_type = None
    if raw_type in VALID_TYPES:
        facility_type = raw_type
    else:
        for pattern, mapped in TYPE_NORMALIZATION_MAP.items():
            if pattern in raw_type or pattern in name.lower():
                facility_type = mapped
                break

    if not facility_type:
        facility_type = "transit"  # Safe default if indeterminate

    # Resolve subtype
    raw_subtype = (
        raw.get("subtype")
        or raw.get("subtipo")
        or raw.get("tipo_centro")
        or raw.get("categoria_especifica")
        or ""
    ).strip().lower()

    facility_subtype = None
    if raw_subtype in VALID_SUBTYPES.get(facility_type, set()):
        facility_subtype = raw_subtype
    else:
        for pattern, mapped in SUBTYPE_NORMALIZATION_MAP.items():
            if pattern in raw_subtype or pattern in name.lower():
                if mapped in VALID_SUBTYPES.get(facility_type, set()):
                    facility_subtype = mapped
                    break

    # Default subtypes per category
    if not facility_subtype:
        default_subtypes = {
            "healthcare": "primary_care",
            "education": "school",
            "transit": "metro",
            "park": "urban_park",
        }
        facility_subtype = default_subtypes.get(facility_type, "primary_care")

    # Resolve id
    fac_id = raw.get("id") or raw.get("codigo") or raw.get("cod_centro")
    if not fac_id:
        slug = "".join(c for c in name.lower().replace(" ", "_") if c.isalnum() or c == "_")[:20]
        fac_id = f"fac_{municipality_code}_{facility_type[:3]}_{slug}_{index:03d}"

    return {
        "id": str(fac_id).strip(),
        "type": facility_type,
        "subtype": facility_subtype,
        "name": name,
        "latitude": round(latitude, 6),
        "longitude": round(longitude, 6),
        "municipality_code": municipality_code,
        "postal_code": postal_code,
    }


def load_from_file(file_path: str) -> list[dict]:
    """Loads facilities from a CSV, JSON, or GeoJSON file."""
    if not os.path.exists(file_path):
        print(f"Warning: File '{file_path}' does not exist.")
        return []

    ext = os.path.splitext(file_path)[1].lower()
    raw_records = []

    if ext == ".csv":
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            # Detect delimiter
            sample = f.read(4096)
            f.seek(0)
            delimiter = ";" if sample.count(";") > sample.count(",") else ","
            reader = csv.DictReader(f, delimiter=delimiter)
            for row in reader:
                raw_records.append(row)

    elif ext in (".json", ".geojson"):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                raw_records = data
            elif isinstance(data, dict):
                if data.get("type") == "FeatureCollection" and "features" in data:
                    for feat in data["features"]:
                        props = feat.get("properties", {})
                        geom = feat.get("geometry", {})
                        if geom.get("type") == "Point" and len(geom.get("coordinates", [])) >= 2:
                            coords = geom["coordinates"]
                            props["longitude"] = coords[0]
                            props["latitude"] = coords[1]
                        raw_records.append(props)
                elif "data" in data and isinstance(data["data"], list):
                    raw_records = data["data"]
                else:
                    raw_records = [data]

    return raw_records


def generate_sql_insert_script(facilities: list[dict]) -> str:
    """Generates complete SQL script containing table creation and INSERT OR IGNORE statements."""
    lines = [
        "-- ============================================================================",
        "-- OpenBarrio Civic Facilities D1 SQL Export (Phase 9B: 15-Minute Connectivity)",
        "-- Aggregated from official Spanish open datasets (REPS, MEFP, Adif, SIOSE)",
        f"-- Total facilities: {len(facilities)}",
        "-- ============================================================================",
        "",
        D1_FACILITIES_SCHEMA_SQL.strip(),
        "",
        "-- Batch Insert Statements",
    ]

    for fac in facilities:
        fac_id = fac["id"].replace("'", "''")
        fac_type = fac["type"].replace("'", "''")
        fac_subtype = f"'{fac['subtype'].replace(\"'\", \"''\")}'" if fac.get("subtype") else "NULL"
        fac_name = fac["name"].replace("'", "''")
        lat = f"{fac['latitude']:.6f}"
        lon = f"{fac['longitude']:.6f}"
        muni = fac["municipality_code"].replace("'", "''")
        postal = f"'{fac['postal_code'].replace(\"'\", \"''\")}'" if fac.get("postal_code") else "NULL"

        stmt = (
            f"INSERT OR IGNORE INTO civic_facilities "
            f"(id, type, subtype, name, latitude, longitude, municipality_code, postal_code) "
            f"VALUES ('{fac_id}', '{fac_type}', {fac_subtype}, '{fac_name}', {lat}, {lon}, '{muni}', {postal});"
        )
        lines.append(stmt)

    lines.append("")
    return "\n".join(lines)


def export_to_sqlite(facilities: list[dict], db_path: str):
    """Exports normalized facilities to a local SQLite database for verification."""
    import sqlite3

    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.executescript(D1_FACILITIES_SCHEMA_SQL)

    insert_sql = """
    INSERT OR IGNORE INTO civic_facilities
    (id, type, subtype, name, latitude, longitude, municipality_code, postal_code)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """

    rows = [
        (
            f["id"],
            f["type"],
            f.get("subtype"),
            f["name"],
            f["latitude"],
            f["longitude"],
            f["municipality_code"],
            f.get("postal_code"),
        )
        for f in facilities
    ]

    cursor.executemany(insert_sql, rows)
    conn.commit()
    conn.close()
    print(f"SQLite database created at: {db_path} ({len(rows)} facilities inserted).")


def process_civic_facilities(
    input_path: str | None = None,
    output_sql_paths: list[str] | None = None,
    output_db_path: str | None = None,
    force_sample: bool = False,
) -> int:
    """Main processing function for civic facilities pipeline."""
    raw_facilities = []

    # 1. Ingestion: File or Seed Data
    if not force_sample and input_path and os.path.exists(input_path):
        print(f"Loading civic facilities from input file: {input_path}")
        raw_facilities = load_from_file(input_path)
        print(f"Loaded {len(raw_facilities)} raw facility records.")
    else:
        if get_sample_facilities:
            print("Using rich nationwide seed dataset of Spanish civic facilities...")
            raw_facilities = get_sample_facilities()
            print(f"Loaded {len(raw_facilities)} seed facility records.")
        else:
            print("Error: No input file provided and sample_facilities module unavailable.", file=sys.stderr)
            return 1

    # 2. Normalization
    normalized: list[dict] = []
    seen_ids = set()

    for idx, raw in enumerate(raw_facilities):
        item = normalize_facility(raw, idx)
        if item and item["id"] not in seen_ids:
            seen_ids.add(item["id"])
            normalized.append(item)

    if not normalized:
        print("Error: No valid facilities could be normalized.", file=sys.stderr)
        return 1

    # 3. Telemetry & Breakdown
    type_counts = {}
    muni_counts = {}
    for f in normalized:
        t = f["type"]
        type_counts[t] = type_counts.get(t, 0) + 1
        m = f["municipality_code"]
        muni_counts[m] = muni_counts.get(m, 0) + 1

    print(f"Normalized {len(normalized)} unique facilities across {len(muni_counts)} Spanish municipalities.")
    print(f"Type breakdown: {type_counts}")

    # 4. Generate SQL Script
    sql_content = generate_sql_insert_script(normalized)

    # 5. Write SQL Outputs
    if not output_sql_paths:
        output_sql_paths = [DEFAULT_OUTPUT_DIST_SQL, DEFAULT_OUTPUT_SQL]

    for sql_path in output_sql_paths:
        os.makedirs(os.path.dirname(os.path.abspath(sql_path)), exist_ok=True)
        with open(sql_path, "w", encoding="utf-8") as f:
            f.write(sql_content)
        print(f"Exported D1 SQL script to: {sql_path} ({len(sql_content.splitlines())} lines).")

    # 6. Optional Local SQLite Export
    if output_db_path:
        export_to_sqlite(normalized, output_db_path)

    print("Civic facilities ingestion and D1 export completed successfully.")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Process Spanish civic facilities and generate Cloudflare D1 SQL script."
    )
    parser.add_argument(
        "--input",
        "-i",
        help="Path to raw facilities CSV/JSON/GeoJSON file (optional).",
        default=None,
    )
    parser.add_argument(
        "--output-sql",
        "-o",
        help="Path to output SQL file.",
        default=None,
    )
    parser.add_argument(
        "--output-db",
        help="Path to output SQLite database file (optional).",
        default=None,
    )
    parser.add_argument(
        "--force-sample",
        action="store_true",
        help="Force use of sample seed dataset even if input is provided.",
    )

    args = parser.parse_args()

    output_sql_paths = [args.output_sql] if args.output_sql else [DEFAULT_OUTPUT_DIST_SQL, DEFAULT_OUTPUT_SQL]
    return process_civic_facilities(
        input_path=args.input,
        output_sql_paths=output_sql_paths,
        output_db_path=args.output_db,
        force_sample=args.force_sample,
    )


if __name__ == "__main__":
    sys.exit(main())

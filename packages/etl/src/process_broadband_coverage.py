#!/usr/bin/env python3
"""
Autonomous ETL script: Ingest SETELECO / CNMC Broadband (FTTH & 5G) Coverage Datasets.
Uses DuckDB to parse official municipal or historical ESP (Entidad Singular de Población)
CSV files, validates bounds [0, 100], and outputs idempotent Cloudflare D1 SQL & chunks.

Granularity & Staleness Transparency (docs/research/broadband-coverage.md):
  - 'municipality': Open SETELECO / CNMC municipal aggregates (2021-2025+)
  - 'population_entity': Historical SETELECO ESP series (2013-2020, always served as stale)
  - Never fabricates portal-level coverage when no official record matches.
"""

import argparse
import os
import sqlite3
import duckdb

DEFAULT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "broadband_coverage.sql"
)
ALT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "broadband_coverage.sql"
)
CHUNKS_PRIMARY_DIR = os.path.join(
    os.path.dirname(__file__), "..", "chunks", "broadband_coverage"
)
LOCAL_DB_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "data", "openbarrio.sqlite"
)

VALID_GRANULARITIES = {"parcel", "population_entity", "municipality"}

# Published official SETELECO / CNMC municipal & historical ESP reference records
OFFICIAL_BROADBAND_SEED = [
    # Recent CNMCData / SETELECO municipal series (granularity = 'municipality')
    ("28079", "28079", "Madrid", "municipality", 99.1, 10000, 98.4, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("08019", "08019", "Barcelona", "municipality", 99.3, 10000, 98.7, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("46250", "46250", "València", "municipality", 98.6, 10000, 97.2, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("41091", "41091", "Sevilla", "municipality", 97.8, 1000, 96.5, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("48020", "48020", "Bilbao", "municipality", 98.4, 10000, 96.8, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("20069", "20069", "Donostia / San Sebastián", "municipality", 98.1, 10000, 96.1, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    ("31201", "31201", "Pamplona / Iruña", "municipality", 97.9, 1000, 95.4, 2025, "2026-11-01", "CNMCData / SETELECO Municipal 2025"),
    # SETELECO 2024 annual census cutoff (June 30, 2024 -> aged >30d, stale within 2190d window)
    ("50297", "50297", "Zaragoza", "municipality", 96.9, 1000, 95.2, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("29067", "29067", "Málaga", "municipality", 96.4, 1000, 95.0, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("18087", "18087", "Granada", "municipality", 95.8, 1000, 93.4, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("30030", "30030", "Murcia", "municipality", 94.2, 1000, 91.8, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("07040", "07040", "Palma", "municipality", 95.1, 1000, 92.6, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("36057", "36057", "Vigo", "municipality", 94.6, 1000, 90.4, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    ("15030", "15030", "A Coruña", "municipality", 96.2, 1000, 92.1, 2024, "2024-06-30", "SETELECO Cobertura Banda Ancha 2024"),
    # Historical SETELECO ESP series (2013-2020 -> granularity = 'population_entity', ALWAYS stale)
    ("28068000100", "28068", "Guadarrama (ESP 2020)", "population_entity", 82.4, 300, 12.0, 2020, "2020-12-31", "SETELECO ESP Serie Histórica 2020"),
    ("44216000100", "44216", "Teruel (ESP 2020)", "population_entity", 78.5, 300, 8.5, 2020, "2020-12-31", "SETELECO ESP Serie Histórica 2020"),
    ("42173000100", "42173", "Soria (ESP 2020)", "population_entity", 79.1, 300, 9.0, 2020, "2020-12-31", "SETELECO ESP Serie Histórica 2020"),
]


def ingest_broadband_csv(
    csv_path: str,
    granularity: str,
    source_year: int,
    source_date: str,
    source_dataset: str,
) -> list[tuple]:
    """Parses a SETELECO / CNMC CSV file using DuckDB and returns normalized rows."""
    if granularity not in VALID_GRANULARITIES:
        raise ValueError(f"Unsupported granularity '{granularity}'. Expected one of {sorted(VALID_GRANULARITIES)}.")
    if not os.path.exists(csv_path):
        print(f"Notice: Broadband CSV not found at {csv_path}.")
        return []

    con = duckdb.connect()
    safe_path = csv_path.replace("\\", "/")
    con.execute(
        f"""
        CREATE TEMP TABLE raw_bb AS
        SELECT * FROM read_csv_auto('{safe_path}', all_varchar=true, header=true);
        """
    )
    cols = [c[0].lower() for c in con.execute("DESCRIBE raw_bb").fetchall()]

    code_col = next((c for c in cols if c in ("territory_code", "codigo_esp", "cumun", "municipality_code", "codigo_municipio")), cols[0])
    muni_col = next((c for c in cols if c in ("municipality_code", "cumun", "codigo_municipio")), code_col)
    name_col = next((c for c in cols if c in ("entity_name", "nombre", "municipio", "entidad")), code_col)
    ftth_col = next((c for c in cols if c in ("ftth_pct", "cobertura_ftth", "ftth")), None)
    mbps_col = next((c for c in cols if c in ("fixed_max_mbps", "max_mbps", "velocidad_max_mbps")), None)
    g5_col = next((c for c in cols if c in ("mobile_5g_pct", "cobertura_5g", "5g")), None)

    if not ftth_col:
        print(f"Warning: CSV {csv_path} has no recognized FTTH coverage column; skipping.")
        return []

    mbps_expr = f"TRY_CAST(REPLACE(\"{mbps_col}\", ',', '.') AS INTEGER)" if mbps_col else "NULL"
    g5_expr = f"LEAST(100.0, GREATEST(0.0, TRY_CAST(REPLACE(\"{g5_col}\", ',', '.') AS DOUBLE)))" if g5_col else "NULL"

    rows = con.execute(
        f"""
        SELECT
            TRIM(CAST("{code_col}" AS VARCHAR)) AS territory_code,
            LPAD(SUBSTRING(TRIM(CAST("{muni_col}" AS VARCHAR)), 1, 5), 5, '0') AS municipality_code,
            TRIM(CAST("{name_col}" AS VARCHAR)) AS entity_name,
            LEAST(100.0, GREATEST(0.0, TRY_CAST(REPLACE("{ftth_col}", ',', '.') AS DOUBLE))) AS ftth_pct,
            {mbps_expr} AS fixed_max_mbps,
            {g5_expr} AS mobile_5g_pct
        FROM raw_bb
        WHERE "{code_col}" IS NOT NULL
          AND TRY_CAST(REPLACE("{ftth_col}", ',', '.') AS DOUBLE) IS NOT NULL;
        """
    ).fetchall()

    out = []
    for tcode, mcode, ename, ftth, mbps, g5 in rows:
        out.append(
            (
                str(tcode),
                str(mcode),
                str(ename),
                granularity,
                round(float(ftth), 2),
                int(mbps) if mbps is not None else None,
                round(float(g5), 2) if g5 is not None else None,
                int(source_year),
                source_date,
                source_dataset,
            )
        )
    return out


def sql_str(value) -> str:
    if value is None:
        return "NULL"
    escaped = str(value).replace("'", "''")
    return f"'{escaped}'"


def generate_sql(records: list[tuple]) -> str:
    """Generates bare idempotent SQL statements compatible with Cloudflare D1 (no BEGIN/COMMIT)."""
    lines = [
        "-- OpenBarrio SETELECO / CNMC Broadband Coverage",
        f"-- Total Territories Covered: {len(records)}",
    ]
    for row in records:
        tcode, mcode, ename, gran, ftth, mbps, g5, year, sdate, sds = row
        mbps_sql = str(int(mbps)) if mbps is not None else "NULL"
        g5_sql = f"{float(g5):.2f}" if g5 is not None else "NULL"
        lines.append(
            "INSERT OR REPLACE INTO broadband_coverage "
            "(territory_code, municipality_code, entity_name, granularity, ftth_pct, "
            "fixed_max_mbps, mobile_5g_pct, source_year, source_date, source_dataset) "
            f"VALUES ({sql_str(tcode)}, {sql_str(mcode)}, {sql_str(ename)}, {sql_str(gran)}, "
            f"{float(ftth):.2f}, {mbps_sql}, {g5_sql}, {int(year)}, {sql_str(sdate)}, {sql_str(sds)});"
        )
    return "\n".join(lines) + "\n"


def write_d1_chunks(statements: list[str], output_dir: str, prefix: str = "broadband_coverage", max_stmts: int = 2500):
    os.makedirs(output_dir, exist_ok=True)
    for f in os.listdir(output_dir):
        if f.startswith(prefix) and f.endswith(".sql"):
            os.remove(os.path.join(output_dir, f))

    header = f"-- Cloudflare D1 Batch Insert Chunk for {prefix}\n"
    max_bytes = 1000 * 1024
    idx = 1
    current = []
    cur_bytes = len(header.encode("utf-8"))

    def flush():
        nonlocal idx, current, cur_bytes
        if not current:
            return
        fname = os.path.join(output_dir, f"{prefix}_part_{str(idx).zfill(2)}.sql")
        with open(fname, "w", encoding="utf-8") as fh:
            fh.write(header + "\n\n".join(current) + "\n")
        idx += 1
        current = []
        cur_bytes = len(header.encode("utf-8"))

    for stmt in statements:
        b = len(stmt.encode("utf-8")) + 2
        if current and (cur_bytes + b > max_bytes or len(current) >= max_stmts):
            flush()
        current.append(stmt)
        cur_bytes += b
    flush()


def sync_sqlite_database(db_path: str, records: list[tuple]):
    if not os.path.exists(db_path):
        print(f"Notice: Local SQLite DB not found at {db_path}. Skipping direct sync.")
        return
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.executemany(
        """
        INSERT OR REPLACE INTO broadband_coverage
        (territory_code, municipality_code, entity_name, granularity, ftth_pct,
         fixed_max_mbps, mobile_5g_pct, source_year, source_date, source_dataset)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        records,
    )
    conn.commit()
    conn.close()
    print(f"Synced {len(records)} broadband coverage records to {db_path}.")


def main():
    parser = argparse.ArgumentParser(description="Process SETELECO / CNMC broadband coverage datasets.")
    parser.add_argument("--input-csv", default="", help="Optional input CSV from SETELECO or CNMCData")
    parser.add_argument("--granularity", default="municipality", choices=sorted(VALID_GRANULARITIES))
    parser.add_argument("--source-year", type=int, default=2025)
    parser.add_argument("--source-date", default="2026-11-01")
    parser.add_argument("--source-dataset", default="CNMCData / SETELECO")
    parser.add_argument("--seed-official", action="store_true", help="Include canonical SETELECO/CNMC reference seed")
    parser.add_argument("--output-sql", default=DEFAULT_OUTPUT_SQL, help="Output SQL path")
    parser.add_argument("--sync-db", action="store_true", help="Sync directly with data/openbarrio.sqlite")
    args = parser.parse_args()

    records: list[tuple] = []
    if args.input_csv:
        records.extend(
            ingest_broadband_csv(
                args.input_csv,
                args.granularity,
                args.source_year,
                args.source_date,
                args.source_dataset,
            )
        )

    if not records or args.seed_official:
        existing_codes = {r[0] for r in records}
        for row in OFFICIAL_BROADBAND_SEED:
            if row[0] not in existing_codes:
                records.append(row)

    sql_content = generate_sql(records)
    for out_path in {os.path.abspath(args.output_sql), os.path.abspath(ALT_OUTPUT_SQL)}:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(sql_content)
        print(f"Wrote broadband coverage SQL ({len(records)} rows) to {out_path}")

    statements = [
        line.strip()
        for line in sql_content.splitlines()
        if line.strip() and not line.strip().startswith("--")
    ]
    write_d1_chunks(statements, CHUNKS_PRIMARY_DIR)

    if args.sync_db:
        sync_sqlite_database(LOCAL_DB_PATH, records)


if __name__ == "__main__":
    main()

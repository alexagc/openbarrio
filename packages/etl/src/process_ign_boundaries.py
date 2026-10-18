#!/usr/bin/env python3
"""
Autonomous ETL script: Process IGN Seccionado Censal boundary polygons with DuckDB Spatial.
Simplifies geometries, reprojects to WGS84 (EPSG:4326), and packages as PMTiles for Cloudflare R2.
Used for Edge Point-in-Polygon spatial resolution and MapLibre GL frontend vector heatmaps.

Supports:
- Official IGN/INE Shapefiles (.shp) extracted from official zips
- GeoJSON feature collections (.geojson)
- Automatic CRS reprojection (ETRS89 UTM -> WGS84)

Usage:
  python3 process_ign_boundaries.py [--input path/to/ign.geojson] [--output-pmtiles dist/census_tracts.pmtiles]
"""

import argparse
import os
import shutil
import subprocess
import sys
import duckdb

DEFAULT_INPUT = os.path.join(os.path.dirname(__file__), "..", "data", "ign_secciones_censales.geojson")
DEFAULT_GEOJSON = os.path.join(os.path.dirname(__file__), "..", "dist", "census_tracts_simplified.geojson")
DEFAULT_PMTILES = os.path.join(os.path.dirname(__file__), "..", "dist", "census_tracts.pmtiles")
CARTOGRAFIA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "cartografia")


def find_actual_input_file(specified_path: str) -> str:
    """Finds the most suitable cartography boundary file (Shapefile or GeoJSON)."""
    if os.path.exists(specified_path):
        return specified_path

    # Check if a shapefile was extracted into the cartografia directory
    if os.path.exists(CARTOGRAFIA_DIR):
        shp_candidates = [
            os.path.join(CARTOGRAFIA_DIR, f)
            for f in os.listdir(CARTOGRAFIA_DIR)
            if f.lower().endswith(".shp")
        ]
        if shp_candidates:
            print(f"Discovered official Shapefile in cartography directory: {shp_candidates[0]}")
            return shp_candidates[0]

    return specified_path


def process_ign_boundaries(input_path: str, output_geojson: str, output_pmtiles: str) -> int:
    """Processes IGN boundaries using DuckDB Spatial and generates PMTiles via Tippecanoe."""
    actual_input = find_actual_input_file(input_path)

    if not os.path.exists(actual_input):
        print(f"Error: Boundary cartography file '{actual_input}' not found.", file=sys.stderr)
        return 1

    os.makedirs(os.path.dirname(os.path.abspath(output_geojson)), exist_ok=True)
    os.makedirs(os.path.dirname(os.path.abspath(output_pmtiles)), exist_ok=True)

    print("Connecting to DuckDB and loading spatial extension...")
    con = duckdb.connect()
    con.execute("INSTALL spatial; LOAD spatial;")

    print(f"Loading boundary features from: {actual_input}")
    con.execute(f"CREATE TABLE raw_boundaries AS SELECT * FROM ST_Read('{actual_input}');")

    # Detect attribute column names
    cols = [col[0].lower() for col in con.execute("DESCRIBE raw_boundaries").fetchall()]
    cusec_col = next((c for c in cols if c in ['cusec', 'seccion', 'seccion_censal', 'code']), cols[0])
    cumun_col = next((c for c in cols if c in ['cumun', 'municipio', 'muni']), None)

    cumun_expr = (
        f"CAST(\"{cumun_col}\" AS VARCHAR)"
        if cumun_col
        else f"SUBSTRING(CAST(\"{cusec_col}\" AS VARCHAR), 1, 5)"
    )

    print("Simplifying boundaries and reprojecting to WGS84 (EPSG:4326) if in UTM projection...")
    # Tolerance 0.0001 degrees is ~11m in Spain, optimal for web map rendering and compact PMTiles
    query = f"""
    CREATE TABLE simplified_tracts AS
    SELECT
        LPAD(TRIM(CAST(\"{cusec_col}\" AS VARCHAR)), 10, '0') AS census_section_code,
        LPAD(TRIM({cumun_expr}), 5, '0') AS municipality_code,
        ST_SimplifyPreserveTopology(
            CASE
                WHEN ST_X(ST_Centroid(geom)) > 1000 THEN ST_Transform(geom, 'EPSG:25830', 'EPSG:4326', always_xy := true)
                ELSE geom
            END,
            0.0001
        ) AS geom
    FROM raw_boundaries
    WHERE \"{cusec_col}\" IS NOT NULL;
    """

    con.execute(query)
    tracts_count = con.execute("SELECT COUNT(*) FROM simplified_tracts").fetchone()[0]
    print(f"Successfully processed and simplified {tracts_count} boundary polygons.")

    print(f"Exporting simplified GeoJSON to: {output_geojson}")
    if os.path.exists(output_geojson):
        os.remove(output_geojson)

    con.execute(f"""
    COPY (
        SELECT census_section_code, municipality_code, geom
        FROM simplified_tracts
    ) TO '{output_geojson}'
    WITH (FORMAT GDAL, DRIVER 'GeoJSON');
    """)

    # Check if tippecanoe is installed for building PMTiles
    tippecanoe_bin = shutil.which("tippecanoe")
    if tippecanoe_bin:
        print(f"Packaging PMTiles using Tippecanoe -> {output_pmtiles}")
        cmd = [
            tippecanoe_bin,
            "-o", output_pmtiles,
            "-l", "census_tracts",
            "-z", "14",
            "-Z", "6",
            "--drop-densest-as-needed",
            "--force",
            output_geojson
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Tippecanoe warning/error: {result.stderr}", file=sys.stderr)
        else:
            print(f"PMTiles successfully built: {os.path.getsize(output_pmtiles)} bytes.")
    else:
        print(
            "Note: 'tippecanoe' not found on system PATH. Simplified GeoJSON generated for Cloudflare R2 pipeline. "
            "In GitHub Actions CI/CD runner, tippecanoe will compile PMTiles directly."
        )

    return 0


def main():
    parser = argparse.ArgumentParser(description="Process IGN Seccionado Censal boundary polygons with DuckDB Spatial")
    parser.add_argument("--input", default=DEFAULT_INPUT, help="Input IGN Cartography (GeoJSON/SHP)")
    parser.add_argument("--output-geojson", default=DEFAULT_GEOJSON, help="Output simplified GeoJSON path")
    parser.add_argument("--output-pmtiles", default=DEFAULT_PMTILES, help="Output PMTiles path")
    args = parser.parse_args()

    return process_ign_boundaries(args.input, args.output_geojson, args.output_pmtiles)


if __name__ == "__main__":
    sys.exit(main())

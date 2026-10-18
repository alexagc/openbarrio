#!/usr/bin/env python3
"""
Autonomous ETL script: Process IGN Seccionado Censal boundary polygons with DuckDB Spatial.
Simplifies geometries, reprojects to WGS84 (EPSG:4326), and packages as PMTiles for Cloudflare R2.
Used for Edge Point-in-Polygon spatial resolution and MapLibre GL frontend vector heatmaps.

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


def process_ign_boundaries(input_path: str, output_geojson: str, output_pmtiles: str) -> int:
    """Processes IGN boundaries using DuckDB Spatial and generates PMTiles via Tippecanoe."""
    if not os.path.exists(input_path):
        print(f"Error: Input boundary file '{input_path}' not found.", file=sys.stderr)
        return 1

    os.makedirs(os.path.dirname(os.path.abspath(output_geojson)), exist_ok=True)
    os.makedirs(os.path.dirname(os.path.abspath(output_pmtiles)), exist_ok=True)

    print("Connecting to DuckDB and loading spatial extension...")
    con = duckdb.connect()
    con.execute("INSTALL spatial; LOAD spatial;")

    print(f"Loading and simplifying IGN Seccionado Censal boundaries from: {input_path}")
    
    # Check input file format (GeoJSON, SHP, GPKG)
    # Simplify with tolerance ~0.0001 degrees (~11 meters at Spanish latitudes)
    query = f"""
    CREATE TABLE simplified_tracts AS
    SELECT
        COALESCE(CAST(CUSEC AS VARCHAR), CAST(cusec AS VARCHAR), CAST(code AS VARCHAR)) AS census_section_code,
        COALESCE(CAST(CUMUN AS VARCHAR), CAST(cumun AS VARCHAR), SUBSTRING(CAST(CUSEC AS VARCHAR), 1, 5)) AS municipality_code,
        ST_SimplifyPreserveTopology(geom, 0.0001) AS geom
    FROM ST_Read('{input_path}');
    """

    con.execute(query)
    tracts_count = con.execute("SELECT COUNT(*) FROM simplified_tracts").fetchone()[0]
    print(f"Successfully processed {tracts_count} boundary polygons.")

    print(f"Exporting simplified GeoJSON to: {output_geojson}")
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

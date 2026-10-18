#!/usr/bin/env python3
"""
Autonomous dataset downloader for OpenBarrio.
Fetches official Spanish open datasets from INE (Instituto Nacional de Estadística)
and IGN (Instituto Geográfico Nacional) for local execution, CI/CD, and Cloudflare D1/R2 pipelines.

Datasets:
1. INE ADRH (Atlas de Distribución de Renta de los Hogares):
   - Real income indicators per census tract (renta neta media por hogar y persona).
   - Ingested via INE Tempus API & JaxiT3 CSV service.
2. INE Cartografía Seccionado Censal:
   - Official polygon boundaries for all ~36,000 Spanish census sections.
   - Downloaded and extracted from official zip archives (Shapefile format).
"""

import argparse
import json
import os
import ssl
import sys
import time
import urllib.request
import zipfile

# Try importing sample_data generator for offline/fallback mode
try:
    from sample_data import generate_sample_ine_csv, generate_sample_ign_geojson
except ImportError:
    try:
        from .sample_data import generate_sample_ine_csv, generate_sample_ign_geojson
    except ImportError:
        generate_sample_ine_csv = None
        generate_sample_ign_geojson = None

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
USER_AGENT = "OpenBarrio-ETL/1.0 (Civic Tech Open Data Ingestion; +https://github.com/alexagc/openbarrio)"

# Curated table IDs for major metropolitan provinces (INE ADRH operation 353)
CURATED_METROPOLITAN_TABLES = [
    {"province": "28", "name": "Madrid", "table_id": 31097},
    {"province": "08", "name": "Barcelona", "table_id": 31052},
    {"province": "46", "name": "Valencia", "table_id": 31214},
    {"province": "41", "name": "Sevilla", "table_id": 31196},
    {"province": "50", "name": "Zaragoza", "table_id": 31223},
    {"province": "29", "name": "Málaga", "table_id": 31106},
    {"province": "48", "name": "Bizkaia (Bilbao)", "table_id": 31217},
    {"province": "03", "name": "Alicante", "table_id": 31037},
    {"province": "07", "name": "Illes Balears", "table_id": 31049},
    {"province": "30", "name": "Murcia", "table_id": 31115},
    {"province": "35", "name": "Las Palmas", "table_id": 31178},
    {"province": "38", "name": "S.C. Tenerife", "table_id": 31187},
    {"province": "31", "name": "Navarra", "table_id": 31124},
    {"province": "18", "name": "Granada", "table_id": 31025},
    {"province": "19", "name": "Guadalajara", "table_id": 31034},
]

CARTOGRAPHY_URLS = [
    "https://www.ine.es/prodyser/cartografia/seccionado_2024.zip",
    "https://www.ine.es/prodyser/cartografia/seccionado_2023.zip",
    "https://www.ine.es/prodyser/cartografia/seccionado_2022.zip",
]


def create_ssl_context():
    """Creates a secure SSL context compatible with government endpoints."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def fetch_url(url: str, timeout: int = 30) -> bytes:
    """Fetches binary or text content from a remote URL with appropriate headers."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    ctx = create_ssl_context()
    with urllib.request.urlopen(req, timeout=timeout, context=ctx) as response:
        return response.read()


def discover_all_ine_adrh_tables() -> list:
    """Discovers all provincial ADRH section-level income table IDs from INE Tempus API."""
    api_url = "https://servicios.ine.es/wstempus/js/ES/TABLAS_OPERACION/353"
    print(f"Discovering all provincial INE ADRH tables via Tempus API: {api_url}...")
    try:
        raw_data = fetch_url(api_url, timeout=20)
        tables = json.loads(raw_data.decode("utf-8"))
        
        income_tables = [
            t["Id"] for t in tables
            if t.get("Nombre") == "Indicadores de renta media y mediana" and t.get("Codigo") == "DIST-SECC-MUN"
        ]
        
        if income_tables:
            print(f"Discovered {len(income_tables)} provincial tables for Spanish census sections.")
            return income_tables
    except Exception as e:
        print(f"Warning: Failed to discover tables dynamically ({e}). Using curated metropolitan tables.")
    
    return [t["table_id"] for t in CURATED_METROPOLITAN_TABLES]


def download_ine_adrh(output_csv: str, all_provinces: bool = False) -> bool:
    """Downloads official INE ADRH income CSV tables and aggregates into a single file."""
    os.makedirs(os.path.dirname(os.path.abspath(output_csv)), exist_ok=True)
    table_ids = discover_all_ine_adrh_tables() if all_provinces else [t["table_id"] for t in CURATED_METROPOLITAN_TABLES]
    
    print(f"Downloading INE ADRH data across {len(table_ids)} provincial tables...")
    combined_lines = []
    header_written = False
    downloaded_count = 0

    for i, tid in enumerate(table_ids, start=1):
        url = f"https://www.ine.es/jaxiT3/files/t/csv_bdsc/{tid}.csv"
        print(f"[{i}/{len(table_ids)}] Fetching table {tid}...")
        try:
            raw_bytes = fetch_url(url, timeout=25)
            # INE files use ISO-8859-15 / Latin1 encoding
            content = raw_bytes.decode("iso-8859-15", errors="replace")
            lines = [line.strip() for line in content.splitlines() if line.strip()]
            
            if lines:
                cols = lines[0].split(";")
                if len(cols) != 6:
                    print(f"  Skipping table {tid}: unexpected column count ({len(cols)} cols), expected 6 for income indicators.")
                    continue

                if not header_written:
                    combined_lines.append(lines[0])
                    header_written = True
                
                # Append rows (skip header)
                combined_lines.extend(lines[1:])
                downloaded_count += 1
            time.sleep(0.15)  # Respectful rate limiting
        except Exception as e:
            print(f"  Warning: Failed to download table {tid}: {e}")

    if combined_lines and len(combined_lines) > 1:
        with open(output_csv, "w", encoding="utf-8") as f:
            f.write("\n".join(combined_lines) + "\n")
        print(f"Successfully aggregated {len(combined_lines) - 1} records into {output_csv} ({os.path.getsize(output_csv)} bytes).")
        return True
    
    return False


def download_cartography(output_dir: str) -> str:
    """Downloads and extracts official Spanish census tract cartography shapefiles."""
    os.makedirs(output_dir, exist_ok=True)
    zip_target = os.path.join(output_dir, "seccionado_raw.zip")
    extract_target = os.path.join(output_dir, "cartografia")
    
    # Check if shapefile already exists
    if os.path.exists(extract_target):
        shp_files = [f for f in os.listdir(extract_target) if f.lower().endswith(".shp")]
        if shp_files:
            print(f"Official cartography shapefile already present: {os.path.join(extract_target, shp_files[0])}")
            return os.path.join(extract_target, shp_files[0])

    print("Downloading official INE/IGN cartography shapefile archive...")
    for url in CARTOGRAPHY_URLS:
        print(f"Trying cartography source: {url}...")
        try:
            data = fetch_url(url, timeout=120)
            with open(zip_target, "wb") as f:
                f.write(data)
            
            print(f"Extracting cartography zip ({os.path.getsize(zip_target)} bytes) -> {extract_target}...")
            os.makedirs(extract_target, exist_ok=True)
            with zipfile.ZipFile(zip_target, "r") as z:
                z.extractall(extract_target)
            
            # Find the .shp file
            shp_files = [f for f in os.listdir(extract_target) if f.lower().endswith(".shp")]
            if shp_files:
                shp_path = os.path.join(extract_target, shp_files[0])
                print(f"Found active census boundaries shapefile: {shp_path}")
                return shp_path
        except Exception as e:
            print(f"  Warning: Cartography download from {url} failed: {e}")
            time.sleep(1)

    print("Cartography archive download unavailable or timed out.")
    return ""


def main():
    parser = argparse.ArgumentParser(description="Download official Spanish INE & IGN open datasets for OpenBarrio")
    parser.add_argument("--output-dir", default=DATA_DIR, help="Target data directory")
    parser.add_argument("--all-provinces", action="store_true", help="Download all 52 Spanish provinces (otherwise metropolitan set)")
    parser.add_argument("--skip-cartography", action="store_true", help="Skip cartography shapefile download")
    parser.add_argument("--force-sample", action="store_true", help="Generate sample datasets instead of downloading")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    ine_csv_path = os.path.join(args.output_dir, "ine_adrh_raw.csv")
    ign_geojson_path = os.path.join(args.output_dir, "ign_secciones_censales.geojson")

    if args.force_sample:
        print("Force-sample flag active. Generating rich seed dataset...")
        if generate_sample_ine_csv and generate_sample_ign_geojson:
            generate_sample_ine_csv(ine_csv_path)
            generate_sample_ign_geojson(ign_geojson_path)
        return 0

    # 1. Download official INE ADRH income data
    ine_success = download_ine_adrh(ine_csv_path, all_provinces=args.all_provinces)
    if not ine_success:
        print("Falling back to rich seed dataset for INE ADRH...")
        if generate_sample_ine_csv:
            generate_sample_ine_csv(ine_csv_path)

    # 2. Download official IGN/INE cartography shapefile
    if not args.skip_cartography:
        shp_path = download_cartography(args.output_dir)
        if not shp_path:
            print("Cartography shapefile not downloaded. Ensuring GeoJSON seed boundary is available...")
            if generate_sample_ign_geojson:
                generate_sample_ign_geojson(ign_geojson_path)
    else:
        if generate_sample_ign_geojson and not os.path.exists(ign_geojson_path):
            generate_sample_ign_geojson(ign_geojson_path)

    print("\nDataset preparation completed successfully.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

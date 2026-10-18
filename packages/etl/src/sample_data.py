#!/usr/bin/env python3
"""
Generates representative sample datasets for INE ADRH and IGN Seccionado Censal.
Used for local testing, CI validation, and test harness execution.
"""

import json
import os
import csv

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")


def generate_sample_ine_csv(output_path: str):
    """Generates sample INE ADRH CSV with realistic census sections from Madrid and Barcelona."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    rows = [
        {"CUSEC": "2807901001", "renta_media_hogar": "52000", "renta_media_persona": "23500", "edad_mediana": "44.5", "pct_unipersonal": "28.4"},
        {"CUSEC": "2807901002", "renta_media_hogar": "48500", "renta_media_persona": "21800", "edad_mediana": "46.0", "pct_unipersonal": "31.2"},
        {"CUSEC": "2807901003", "renta_media_hogar": "61200", "renta_media_persona": "27900", "edad_mediana": "43.1", "pct_unipersonal": "25.0"},
        {"CUSEC": "2807902001", "renta_media_hogar": "34200", "renta_media_persona": "15100", "edad_mediana": "41.8", "pct_unipersonal": "33.5"},
        {"CUSEC": "2807902002", "renta_media_hogar": "27800", "renta_media_persona": "12300", "edad_mediana": "40.2", "pct_unipersonal": "35.1"},
        {"CUSEC": "0801901001", "renta_media_hogar": "45000", "renta_media_persona": "20500", "edad_mediana": "45.0", "pct_unipersonal": "30.0"},
        {"CUSEC": "0801901002", "renta_media_hogar": "58000", "renta_media_persona": "26000", "edad_mediana": "43.5", "pct_unipersonal": "27.5"},
        {"CUSEC": "0801902001", "renta_media_hogar": "31500", "renta_media_persona": "14200", "edad_mediana": "42.0", "pct_unipersonal": "34.0"},
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["CUSEC", "renta_media_hogar", "renta_media_persona", "edad_mediana", "pct_unipersonal"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Sample INE ADRH CSV created at: {output_path}")


def generate_sample_ign_geojson(output_path: str):
    """Generates sample IGN Seccionado Censal GeoJSON polygon features."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    features = [
        {
            "type": "Feature",
            "properties": {"CUSEC": "2807901001", "CUMUN": "28079"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-3.7050, 40.4200],
                    [-3.7020, 40.4200],
                    [-3.7020, 40.4230],
                    [-3.7050, 40.4230],
                    [-3.7050, 40.4200]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"CUSEC": "2807901002", "CUMUN": "28079"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-3.7020, 40.4200],
                    [-3.6990, 40.4200],
                    [-3.6990, 40.4230],
                    [-3.7020, 40.4230],
                    [-3.7020, 40.4200]
                ]]
            }
        },
        {
            "type": "Feature",
            "properties": {"CUSEC": "0801901001", "CUMUN": "08019"},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [2.1650, 41.3850],
                    [2.1700, 41.3850],
                    [2.1700, 41.3900],
                    [2.1650, 41.3900],
                    [2.1650, 41.3850]
                ]]
            }
        }
    ]

    fc = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(fc, f, indent=2)

    print(f"Sample IGN GeoJSON created at: {output_path}")


def main():
    ine_path = os.path.join(DATA_DIR, "ine_adrh_raw.csv")
    ign_path = os.path.join(DATA_DIR, "ign_secciones_censales.geojson")
    generate_sample_ine_csv(ine_path)
    generate_sample_ign_geojson(ign_path)


if __name__ == "__main__":
    main()

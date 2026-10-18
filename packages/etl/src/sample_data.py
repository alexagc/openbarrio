#!/usr/bin/env python3
"""
Generates representative sample datasets for INE ADRH and IGN Seccionado Censal.
Used for local testing, CI validation, test harness execution, and offline fallback.
Provides comprehensive coverage across major Spanish autonomous communities,
provincial capitals, and preset audit points.
"""

import json
import os
import csv

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

SAMPLE_SECTIONS = [
    # Madrid (28079)
    {"CUSEC": "2807901001", "CUMUN": "28079", "renta_media_hogar": "52000", "renta_media_persona": "23500", "edad_mediana": "44.5", "pct_unipersonal": "28.4", "bbox": [-3.7050, 40.4190, -3.7020, 40.4220]}, # Gran Vía / Sol
    {"CUSEC": "2807901002", "CUMUN": "28079", "renta_media_hogar": "48500", "renta_media_persona": "21800", "edad_mediana": "46.0", "pct_unipersonal": "31.2", "bbox": [-3.7080, 40.4170, -3.7050, 40.4200]}, # Opera / Palacio
    {"CUSEC": "2807901003", "CUMUN": "28079", "renta_media_hogar": "61200", "renta_media_persona": "27900", "edad_mediana": "43.1", "pct_unipersonal": "25.0", "bbox": [-3.7010, 40.4150, -3.6980, 40.4180]}, # Cortes / Huertas
    {"CUSEC": "2807904001", "CUMUN": "28079", "renta_media_hogar": "88400", "renta_media_persona": "39100", "edad_mediana": "49.0", "pct_unipersonal": "35.0", "bbox": [-3.6890, 40.4240, -3.6850, 40.4280]}, # Salamanca - Recoletos
    {"CUSEC": "2807905001", "CUMUN": "28079", "renta_media_hogar": "72000", "renta_media_persona": "31500", "edad_mediana": "47.2", "pct_unipersonal": "32.0", "bbox": [-3.6950, 40.4320, -3.6910, 40.4360]}, # Chamberí - Almagro
    {"CUSEC": "2807913010", "CUMUN": "28079", "renta_media_hogar": "22100", "renta_media_persona": "9400",  "edad_mediana": "41.0", "pct_unipersonal": "24.0", "bbox": [-3.6650, 40.3950, -3.6600, 40.3990]}, # Puente de Vallecas

    # Barcelona (08019)
    {"CUSEC": "0801901001", "CUMUN": "08019", "renta_media_hogar": "45000", "renta_media_persona": "20500", "edad_mediana": "45.0", "pct_unipersonal": "30.0", "bbox": [2.1720, 41.3810, 2.1760, 41.3850]},   # Ciutat Vella - Gòtic
    {"CUSEC": "0801901002", "CUMUN": "08019", "renta_media_hogar": "41000", "renta_media_persona": "18500", "edad_mediana": "42.0", "pct_unipersonal": "33.0", "bbox": [2.1680, 41.3780, 2.1720, 41.3820]},   # Raval
    {"CUSEC": "0801902001", "CUMUN": "08019", "renta_media_hogar": "58000", "renta_media_persona": "26000", "edad_mediana": "43.5", "pct_unipersonal": "27.5", "bbox": [2.1600, 41.3880, 2.1640, 41.3920]},   # Eixample Esquerra
    {"CUSEC": "0801902005", "CUMUN": "08019", "renta_media_hogar": "64500", "renta_media_persona": "29800", "edad_mediana": "46.5", "pct_unipersonal": "34.0", "bbox": [2.1630, 41.3900, 2.1670, 41.3940]},   # Passeig de Gràcia / Eixample
    {"CUSEC": "0801905001", "CUMUN": "08019", "renta_media_hogar": "78500", "renta_media_persona": "36200", "edad_mediana": "48.0", "pct_unipersonal": "29.0", "bbox": [2.1280, 41.3980, 2.1330, 41.4030]},   # Sarrià - Sant Gervasi

    # València (46250)
    {"CUSEC": "4625001001", "CUMUN": "46250", "renta_media_hogar": "39500", "renta_media_persona": "19200", "edad_mediana": "45.0", "pct_unipersonal": "39.0", "bbox": [-0.3780, 39.4720, -0.3740, 39.4760]}, # Ciutat Vella - Carme
    {"CUSEC": "4625001002", "CUMUN": "46250", "renta_media_hogar": "47200", "renta_media_persona": "22600", "edad_mediana": "46.2", "pct_unipersonal": "36.5", "bbox": [-0.3750, 39.4680, -0.3710, 39.4720]}, # Carrer de Colón / Sant Francesc
    {"CUSEC": "4625002001", "CUMUN": "46250", "renta_media_hogar": "43000", "renta_media_persona": "20800", "edad_mediana": "42.5", "pct_unipersonal": "35.0", "bbox": [-0.3700, 39.4600, -0.3660, 39.4640]}, # Ruzafa / Eixample

    # Sevilla (41091)
    {"CUSEC": "4109101001", "CUMUN": "41091", "renta_media_hogar": "44200", "renta_media_persona": "19800", "edad_mediana": "45.8", "pct_unipersonal": "32.0", "bbox": [-5.9960, 37.3890, -5.9920, 37.3930]}, # Calle Sierpes / Casco Antiguo
    {"CUSEC": "4109102001", "CUMUN": "41091", "renta_media_hogar": "36500", "renta_media_persona": "16200", "edad_mediana": "43.0", "pct_unipersonal": "30.0", "bbox": [-6.0050, 37.3830, -6.0000, 37.3870]}, # Triana
    {"CUSEC": "4109103001", "CUMUN": "41091", "renta_media_hogar": "51000", "renta_media_persona": "23100", "edad_mediana": "47.5", "pct_unipersonal": "28.5", "bbox": [-5.9800, 37.3800, -5.9750, 37.3850]}, # Nervión

    # Zaragoza (50297)
    {"CUSEC": "5029701001", "CUMUN": "50297", "renta_media_hogar": "42500", "renta_media_persona": "19500", "edad_mediana": "45.2", "pct_unipersonal": "31.0", "bbox": [-0.8820, 41.6520, -0.8770, 41.6560]}, # Casco Histórico / Plaza del Pilar
    {"CUSEC": "5029702001", "CUMUN": "50297", "renta_media_hogar": "48900", "renta_media_persona": "22400", "edad_mediana": "47.0", "pct_unipersonal": "29.0", "bbox": [-0.8850, 41.6460, -0.8800, 41.6500]}, # Centro / Paseo Independencia

    # Málaga (29067)
    {"CUSEC": "2906701001", "CUMUN": "29067", "renta_media_hogar": "41800", "renta_media_persona": "19100", "edad_mediana": "44.0", "pct_unipersonal": "34.0", "bbox": [-4.4240, 36.7190, -4.4190, 36.7230]}, # Calle Larios / Centro
    {"CUSEC": "2906702001", "CUMUN": "29067", "renta_media_hogar": "53500", "renta_media_persona": "24900", "edad_mediana": "48.2", "pct_unipersonal": "31.5", "bbox": [-4.4120, 36.7170, -4.4070, 36.7210]}, # La Malagueta

    # Bilbao (48020)
    {"CUSEC": "4802001001", "CUMUN": "48020", "renta_media_hogar": "54200", "renta_media_persona": "25800", "edad_mediana": "47.8", "pct_unipersonal": "33.0", "bbox": [-2.9360, 43.2610, -2.9310, 43.2650]}, # Gran Vía / Abando
    {"CUSEC": "4802002001", "CUMUN": "48020", "renta_media_hogar": "38900", "renta_media_persona": "17800", "edad_mediana": "43.5", "pct_unipersonal": "36.0", "bbox": [-2.9260, 43.2560, -2.9210, 43.2600]}, # Casco Viejo

    # Palma de Mallorca (07040)
    {"CUSEC": "0704001001", "CUMUN": "07040", "renta_media_hogar": "46800", "renta_media_persona": "21400", "edad_mediana": "45.0", "pct_unipersonal": "32.0", "bbox": [2.6460, 39.5680, 2.6510, 39.5720]},   # Passeig del Born / Centre

    # Alicante / Alacant (03014)
    {"CUSEC": "0301401001", "CUMUN": "03014", "renta_media_hogar": "39200", "renta_media_persona": "18000", "edad_mediana": "44.6", "pct_unipersonal": "33.5", "bbox": [-0.4860, 38.3440, -0.4810, 38.3480]}, # Rambla / Centro

    # Las Palmas de Gran Canaria (35016)
    {"CUSEC": "3501601001", "CUMUN": "35016", "renta_media_hogar": "38500", "renta_media_persona": "17600", "edad_mediana": "43.8", "pct_unipersonal": "31.0", "bbox": [-15.4180, 28.1020, -15.4130, 28.1060]}, # Triana

    # Santa Cruz de Tenerife (38038)
    {"CUSEC": "3803801001", "CUMUN": "38038", "renta_media_hogar": "41200", "renta_media_persona": "18900", "edad_mediana": "45.1", "pct_unipersonal": "33.0", "bbox": [-16.2520, 28.4660, -16.2470, 28.4700]}, # Centro / Weyler

    # Valladolid (47186)
    {"CUSEC": "4718601001", "CUMUN": "47186", "renta_media_hogar": "42100", "renta_media_persona": "19400", "edad_mediana": "46.7", "pct_unipersonal": "30.5", "bbox": [-4.7290, 41.6500, -4.7240, 41.6540]}, # Plaza Mayor / Centro
]


def generate_sample_ine_csv(output_path: str):
    """Generates rich sample INE ADRH CSV covering key Spanish cities and audit presets."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    rows = []
    for item in SAMPLE_SECTIONS:
        rows.append({
            "CUSEC": item["CUSEC"],
            "renta_media_hogar": item["renta_media_hogar"],
            "renta_media_persona": item["renta_media_persona"],
            "edad_mediana": item["edad_mediana"],
            "pct_unipersonal": item["pct_unipersonal"],
        })

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["CUSEC", "renta_media_hogar", "renta_media_persona", "edad_mediana", "pct_unipersonal"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Rich sample INE ADRH CSV created at: {output_path} ({len(rows)} census sections).")


def generate_sample_ign_geojson(output_path: str):
    """Generates rich sample IGN Seccionado Censal GeoJSON polygon features."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    features = []
    for item in SAMPLE_SECTIONS:
        min_lon, min_lat, max_lon, max_lat = item["bbox"]
        polygon = [
            [min_lon, min_lat],
            [max_lon, min_lat],
            [max_lon, max_lat],
            [min_lon, max_lat],
            [min_lon, min_lat],
        ]
        features.append({
            "type": "Feature",
            "properties": {
                "CUSEC": item["CUSEC"],
                "CUMUN": item["CUMUN"],
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [polygon],
            },
        })

    fc = {
        "type": "FeatureCollection",
        "features": features,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(fc, f, indent=2)

    print(f"Rich sample IGN GeoJSON created at: {output_path} ({len(features)} boundary polygons).")


def main():
    ine_path = os.path.join(DATA_DIR, "ine_adrh_raw.csv")
    ign_path = os.path.join(DATA_DIR, "ign_secciones_censales.geojson")
    generate_sample_ine_csv(ine_path)
    generate_sample_ign_geojson(ign_path)


if __name__ == "__main__":
    main()

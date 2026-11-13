#!/usr/bin/env python3
"""
Autonomous ETL script: Ingest CTE DB-HS 6 Radon Municipal Classifications.
Source: Ministerio de Transportes, Movilidad y Agenda Urbana / BOE.
Real Decreto 732/2019, de 20 de diciembre (BOE-A-2019-18528).
Documento Básico DB-HS Salubridad - Sección HS 6: Protección frente a la exposición al radón.
Apéndice B: Clasificación de municipios en función del potencial de radón.

Features:
- Downloads or reads official BOE XML publication (BOE-A-2019-18528, Anejo II).
- Resolves all municipalities classified as 'Zona I' (moderate risk) and 'Zona II' (high risk).
- Maps each municipality to standard 5-digit INE code and 2-digit province code.
- Normalizes multilingual names (Galician, Catalan, Basque) and historical renamings.
- Formats inverted articles naturally (e.g. 'A Coruña' instead of 'Coruña, A').
- Generates idempotent SQL statements for Cloudflare D1 and SQLite.
- Supports offline caching and local database synchronization.

Usage:
  python3 packages/etl/src/process_cte_radon.py [--output-sql packages/etl/dist/openbarrio-etl-dist/cte_radon.sql] [--sync-db]
"""

import argparse
import csv
import io
import os
import re
import sys
import unicodedata
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

BOE_XML_URL = "https://www.boe.es/diario_boe/xml.php?id=BOE-A-2019-18528"
INE_MUNICIPIOS_URL = "https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/master/data/municipios.csv"
INE_PROVINCIAS_URL = "https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/master/data/provincias.csv"

DEFAULT_OUTPUT_SQL = os.path.join(
    os.path.dirname(__file__), "..", "dist", "openbarrio-etl-dist", "cte_radon.sql"
)
CACHE_DIR = os.path.join(os.path.dirname(__file__), "..", "dist")
LOCAL_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "openbarrio.sqlite")

USER_AGENT = "OpenBarrio-ETL/1.1 (Civic Tech Radon DB-HS 6 Ingestion; +https://github.com/alexagc/openbarrio)"

# Canonical Spanish province names (52 official provinces)
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

# Special historical renamings or enclaves to standard INE codes
KNOWN_SPECIAL_CASES = {
    # León
    ("24", "candin"): ("24036", "Valle de Ancares"),
    ("24", "valle de ancares"): ("24036", "Valle de Ancares"),
    # Badajoz
    ("06", "guadiana del caudillo"): ("06903", "Guadiana"),
    ("06", "guadiana"): ("06903", "Guadiana"),
    # Barcelona
    ("08", "bigues i riells"): ("08023", "Bigues i Riells del Fai"),
    # Girona
    ("17", "brunyola"): ("17028", "Brunyola i Sant Martí Sapresa"),
    ("17", "calonge"): ("17034", "Calonge i Sant Antoni"),
    ("17", "castell platja d aro"): ("17048", "Castell d'Aro, Platja d'Aro i s'Agaró"),
    ("17", "castell platja d'aro"): ("17048", "Castell d'Aro, Platja d'Aro i s'Agaró"),
    ("17", "masarac"): ("17100", "Masarac i Vilarnadal"),
    # Pontevedra (merger into Cerdedo-Cotobade)
    ("36", "cerdedo"): ("36902", "Cerdedo-Cotobade"),
    ("36", "cotobade"): ("36902", "Cerdedo-Cotobade"),
    ("36", "cerdedo cotobade"): ("36902", "Cerdedo-Cotobade"),
    # Toledo
    ("45", "la iglesuela"): ("45079", "Iglesuela del Tiétar, La"),
    ("45", "iglesuela"): ("45079", "Iglesuela del Tiétar, La"),
    # Zaragoza
    ("50", "jarque"): ("50130", "Jarque de Moncayo"),
    # Cáceres
    ("10", "higuera"): ("10097", "Higuera de Albalat"),
    # Navarra
    ("31", "atez atetz"): ("31040", "Atez / Atetz"),
    ("31", "atez/atetz"): ("31040", "Atez / Atetz"),
    # Valencia
    ("46", "sagunto sagunt"): ("46220", "Sagunto/Sagunt"),
    ("46", "sagunto/sagunt"): ("46220", "Sagunto/Sagunt"),
    ("46", "sagunt"): ("46220", "Sagunto/Sagunt"),
}

# Provincial alias map to 2-digit INE code
PROVINCE_ALIASES = {
    "alava": "01",
    "araba": "01",
    "albacete": "02",
    "alicante": "03",
    "alacant": "03",
    "almeria": "04",
    "avila": "05",
    "badajoz": "06",
    "baleares": "07",
    "illes balears": "07",
    "islas baleares": "07",
    "barcelona": "08",
    "burgos": "09",
    "caceres": "10",
    "cadiz": "11",
    "castellon": "12",
    "castello": "12",
    "ciudad real": "13",
    "cordoba": "14",
    "coruna": "15",
    "a coruna": "15",
    "la coruna": "15",
    "cuenca": "16",
    "girona": "17",
    "gerona": "17",
    "granada": "18",
    "guadalajara": "19",
    "guipuzcoa": "20",
    "gipuzkoa": "20",
    "huelva": "21",
    "huesca": "22",
    "jaen": "23",
    "leon": "24",
    "lleida": "25",
    "lerida": "25",
    "rioja": "26",
    "la rioja": "26",
    "lugo": "27",
    "madrid": "28",
    "malaga": "29",
    "murcia": "30",
    "navarra": "31",
    "ourense": "32",
    "orense": "32",
    "asturias": "33",
    "palencia": "34",
    "las palmas": "35",
    "palmas": "35",
    "pontevedra": "36",
    "salamanca": "37",
    "santa cruz de tenerife": "38",
    "tenerife": "38",
    "cantabria": "39",
    "segovia": "40",
    "sevilla": "41",
    "soria": "42",
    "tarragona": "43",
    "teruel": "44",
    "toledo": "45",
    "valencia": "46",
    "valladolid": "47",
    "bizkaia": "48",
    "vizcaya": "48",
    "zamora": "49",
    "zaragoza": "50",
    "ceuta": "51",
    "melilla": "52",
}


def clean_apostrophes(text: str) -> str:
    """Replaces smart quotes and typographic apostrophes with standard single quote."""
    if not text:
        return ""
    return text.replace("’", "'").replace("‘", "'").replace("`", "'")


def naturalize_name(name: str) -> str:
    """Transforms inverted administrative names into natural language (e.g. 'Coruña, A' -> 'A Coruña')."""
    if not name:
        return ""
    name = clean_apostrophes(name.strip())
    # Handle comma inverted articles: 'Coruña, A' -> 'A Coruña', 'Tiemblo, El' -> 'El Tiemblo'
    comma_m = re.match(r"^(.*?),\s*(A|O|As|Os|El|La|Los|Las|L'|Es|Sa|Ses|Els|Les)$", name, re.IGNORECASE)
    if comma_m:
        art = comma_m.group(2).strip()
        base = comma_m.group(1).strip()
        if art.endswith("'"):
            return f"{art}{base}"
        return f"{art} {base}"

    # Handle parenthetical inverted articles: 'Tiemblo (El)' -> 'El Tiemblo'
    paren_m = re.match(r"^(.*?)\s*\((A|O|As|Os|El|La|Los|Las|L'|Es|Sa|Ses|Els|Les)\)$", name, re.IGNORECASE)
    if paren_m:
        art = paren_m.group(2).strip()
        base = paren_m.group(1).strip()
        if art.endswith("'"):
            return f"{art}{base}"
        return f"{art} {base}"

    return name


def normalize_text(text: str) -> str:
    """Normalizes text for fuzzy cross-matching across dialectal official names."""
    if not text:
        return ""
    text = clean_apostrophes(text)
    text = text.strip().rstrip(".").strip()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r"[\s\-_\'/,\.]+", " ", text)
    # Strip common leading or trailing articles
    text = re.sub(r"^(el|la|los|las|l|es|sa|ses|els|les|a|o|as|os)\s+", "", text)
    text = re.sub(r"\s+(el|la|los|las|l|es|sa|ses|els|les|a|o|as|os)$", "", text)
    return text.strip()


def fetch_file(url: str, cache_filename: str, force_download: bool = False) -> str:
    """Fetches a file from URL or reads from local disk cache."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = os.path.join(CACHE_DIR, cache_filename)

    if os.path.exists(cache_path) and not force_download:
        print(f"[ETL-RADON] Using cached file: {cache_path}")
        with open(cache_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    print(f"[ETL-RADON] Downloading upstream from: {url}")
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=45) as res:
            content = res.read().decode("utf-8", errors="ignore")
            with open(cache_path, "w", encoding="utf-8") as f:
                f.write(content)
            return content
    except Exception as err:
        if os.path.exists(cache_path):
            print(f"[ETL-RADON] Warning: Download failed ({err}). Falling back to cached file.", file=sys.stderr)
            with open(cache_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        raise RuntimeError(f"Failed to fetch {url}: {err}")


def load_provinces(force_download: bool = False) -> dict:
    """Loads official Spanish province codes and names."""
    return OFFICIAL_PROVINCE_NAMES.copy()


def load_municipalities(force_download: bool = False) -> tuple[dict, dict, dict]:
    """
    Loads official Spanish municipalities dictionary.
    Returns:
      - all_by_id: dict[municipality_code, {id, name, prov_id}]
      - lookup_by_prov_norm: dict[(prov_id, normalized_name), list[{id, name, prov_id}]]
      - all_by_prov: dict[prov_id, list[{id, name, prov_id}]]
    """
    raw_csv = fetch_file(INE_MUNICIPIOS_URL, "ine_municipios.csv", force_download)
    reader = csv.DictReader(io.StringIO(raw_csv))

    all_by_id = {}
    lookup_by_prov_norm = {}
    all_by_prov = {}

    for r in reader:
        mid = r["municipio_id"].zfill(5)
        pid = r["provincia_id"].zfill(2)
        raw_name = clean_apostrophes(r["nombre"])
        mname = naturalize_name(raw_name)
        record = {"id": mid, "name": mname, "prov_id": pid}

        all_by_id[mid] = record
        all_by_prov.setdefault(pid, []).append(record)

        norm = normalize_text(mname)
        lookup_by_prov_norm.setdefault((pid, norm), []).append(record)

        # Bilingual slash split
        for part in mname.split("/"):
            part_norm = normalize_text(part)
            lookup_by_prov_norm.setdefault((pid, part_norm), []).append(record)

        # Parenthetical inverted article e.g. "Tiemblo (El)"
        if "(" in raw_name and ")" in raw_name:
            m = re.search(r"^(.*?)\s*\((.*?)\)$", raw_name)
            if m:
                alt1 = f"{m.group(2)} {m.group(1)}"
                lookup_by_prov_norm.setdefault((pid, normalize_text(alt1)), []).append(record)
                lookup_by_prov_norm.setdefault((pid, normalize_text(m.group(1))), []).append(record)

        # Comma inverted article e.g. "Coruña, A"
        if "," in raw_name:
            parts = [p.strip() for p in raw_name.split(",")]
            if len(parts) == 2:
                alt = f"{parts[1]} {parts[0]}"
                lookup_by_prov_norm.setdefault((pid, normalize_text(alt)), []).append(record)
                lookup_by_prov_norm.setdefault((pid, normalize_text(parts[0])), []).append(record)

    return all_by_id, lookup_by_prov_norm, all_by_prov


def parse_boe_radon_table(raw_xml: str) -> list[tuple[str, str, str, str]]:
    """
    Parses CTE DB-HS 6 Apéndice B from official BOE XML.
    Returns list of tuples: (province_code, province_name, raw_municipality_name, zone).
    """
    marker = "Clasificación de municipios en función del potencial de radón"
    pos = raw_xml.rfind(marker)
    if pos == -1:
        raise ValueError(f"Could not locate Apéndice B marker '{marker}' in BOE XML.")

    table_start = raw_xml.find("<table", pos)
    table_end = raw_xml.find("</table>", table_start) + len("</table>")
    if table_start == -1 or table_end == -1:
        raise ValueError("Could not locate <table> tags in BOE XML Apéndice B.")

    root = ET.fromstring(raw_xml[table_start:table_end])
    tbody = root.find("{*}tbody")
    if tbody is None:
        tbody = root.find("tbody")
    if tbody is None:
        raise ValueError("Could not locate <tbody> in BOE XML Apéndice B table.")

    rows = list(tbody)
    print(f"[ETL-RADON] Parsing {len(rows)} table rows in BOE Apéndice B...")

    extracted = []
    current_prov_name = ""
    current_prov_code = ""

    for r in rows:
        cells = [clean_apostrophes(("".join(c.itertext())).strip()) for c in list(r)]
        while len(cells) < 4:
            cells.append("")
        ccaa_cell, prov_cell, z1_cell, z2_cell = cells[:4]

        if prov_cell:
            current_prov_name = prov_cell.rstrip(".")
            norm_prov = normalize_text(current_prov_name)
            current_prov_code = PROVINCE_ALIASES.get(norm_prov, "")
            if not current_prov_code:
                for part in current_prov_name.split("/"):
                    code = PROVINCE_ALIASES.get(normalize_text(part), "")
                    if code:
                        current_prov_code = code
                        break

        if not current_prov_code:
            continue

        if z1_cell:
            extracted.append((current_prov_code, current_prov_name, z1_cell.rstrip("."), "Zona I"))
        if z2_cell:
            extracted.append((current_prov_code, current_prov_name, z2_cell.rstrip("."), "Zona II"))

    print(f"[ETL-RADON] Extracted {len(extracted)} entries from official BOE table.")
    return extracted


def resolve_municipality_records(
    extracted_entries: list[tuple[str, str, str, str]],
    provinces: dict,
    all_by_id: dict,
    lookup_by_prov_norm: dict,
    all_by_prov: dict,
) -> list[tuple[str, str, str, str, str]]:
    """
    Resolves raw municipality entries to canonical 5-digit INE records.
    Returns: list of (municipality_code, municipality_name, province_code, province_name, zone).
    De-duplicates entries: 'Zona II' takes precedence over 'Zona I' if a territory is listed in both.
    """
    resolved_dict = {}
    unmatched_count = 0

    for prov_code, raw_prov_name, raw_muni_name, zone in extracted_entries:
        norm = normalize_text(raw_muni_name)

        # Check special cases dictionary first
        if (prov_code, norm) in KNOWN_SPECIAL_CASES:
            code, canonical_name = KNOWN_SPECIAL_CASES[(prov_code, norm)]
            pname = provinces.get(prov_code, raw_prov_name)
            existing_zone = resolved_dict.get(code, {}).get("zone")
            final_zone = "Zona II" if existing_zone == "Zona II" or zone == "Zona II" else "Zona I"
            resolved_dict[code] = {
                "code": code,
                "name": naturalize_name(canonical_name),
                "prov_code": prov_code,
                "prov_name": pname,
                "zone": final_zone,
            }
            continue

        candidates = lookup_by_prov_norm.get((prov_code, norm), [])

        if not candidates and "," in raw_muni_name:
            p = [x.strip() for x in raw_muni_name.split(",")]
            alt = f"{p[1]} {p[0]}"
            candidates = lookup_by_prov_norm.get((prov_code, normalize_text(alt)), [])

        if not candidates:
            # Check exact match against all municipal names in that province
            for pm in all_by_prov.get(prov_code, []):
                if norm == normalize_text(pm["name"]):
                    candidates = [pm]
                    break

        if candidates:
            cand = candidates[0]
            code = cand["id"]
            canonical_name = cand["name"]
            pname = provinces.get(prov_code, raw_prov_name)
            existing_zone = resolved_dict.get(code, {}).get("zone")
            final_zone = "Zona II" if existing_zone == "Zona II" or zone == "Zona II" else zone
            resolved_dict[code] = {
                "code": code,
                "name": naturalize_name(canonical_name),
                "prov_code": prov_code,
                "prov_name": pname,
                "zone": final_zone,
            }
        else:
            unmatched_count += 1

    records = [
        (v["code"], v["name"], v["prov_code"], v["prov_name"], v["zone"])
        for v in sorted(resolved_dict.values(), key=lambda x: x["code"])
    ]

    print(f"[ETL-RADON] Successfully resolved {len(records)} unique municipalities.")
    if unmatched_count > 0:
        print(f"[ETL-RADON] Skipped {unmatched_count} non-municipal enclave references.")

    return records


def generate_sql_file(records: list[tuple[str, str, str, str, str]], output_path: str) -> None:
    """Writes idempotent SQL migration/seed file."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    zona_1 = sum(1 for r in records if r[4] == "Zona I")
    zona_2 = sum(1 for r in records if r[4] == "Zona II")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("-- OpenBarrio Autonomous ETL: CTE DB-HS 6 Radon Municipal Classifications\n")
        f.write("-- Source: Real Decreto 732/2019, de 20 de diciembre (BOE-A-2019-18528)\n")
        f.write("-- Apéndice B: Clasificación de municipios en función del potencial de radón\n")
        f.write(f"-- Total classified municipalities: {len(records)} (Zona I: {zona_1}, Zona II: {zona_2})\n\n")

        f.write("CREATE TABLE IF NOT EXISTS cte_radon_municipalities (\n")
        f.write("  municipality_code TEXT PRIMARY KEY,\n")
        f.write("  municipality_name TEXT NOT NULL,\n")
        f.write("  province_code TEXT NOT NULL,\n")
        f.write("  province_name TEXT NOT NULL,\n")
        f.write("  zone TEXT NOT NULL,\n")
        f.write("  created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)\n")
        f.write(");\n\n")

        f.write("CREATE INDEX IF NOT EXISTS idx_radon_muni ON cte_radon_municipalities(municipality_code);\n")
        f.write("CREATE INDEX IF NOT EXISTS idx_radon_prov ON cte_radon_municipalities(province_code);\n\n")

        f.write("BEGIN TRANSACTION;\n")
        for code, name, prov_code, prov_name, zone in records:
            safe_name = name.replace("'", "''")
            safe_prov = prov_name.replace("'", "''")
            f.write(
                f"INSERT OR REPLACE INTO cte_radon_municipalities "
                f"(municipality_code, municipality_name, province_code, province_name, zone) "
                f"VALUES ('{code}', '{safe_name}', '{prov_code}', '{safe_prov}', '{zone}');\n"
            )
        f.write("COMMIT;\n")

    print(f"[ETL-RADON] Generated SQL file at: {output_path} ({os.path.getsize(output_path):,} bytes)")


def sync_local_sqlite(sql_path: str, sqlite_path: str) -> None:
    """Executes the generated SQL file against local SQLite database."""
    if not os.path.exists(sqlite_path):
        print(f"[ETL-RADON] SQLite database not found at {sqlite_path}. Skipping local sync.")
        return

    import sqlite3

    print(f"[ETL-RADON] Synchronizing with local SQLite: {sqlite_path}...")
    with open(sql_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    conn = sqlite3.connect(sqlite_path)
    try:
        conn.executescript(sql_content)
        total = conn.execute("SELECT COUNT(*) FROM cte_radon_municipalities").fetchone()[0]
        z1 = conn.execute("SELECT COUNT(*) FROM cte_radon_municipalities WHERE zone = 'Zona I'").fetchone()[0]
        z2 = conn.execute("SELECT COUNT(*) FROM cte_radon_municipalities WHERE zone = 'Zona II'").fetchone()[0]
        print(f"[ETL-RADON] Local SQLite synced successfully: {total} total rows (Zona I: {z1}, Zona II: {z2}).")
    finally:
        conn.close()


def main():
    parser = argparse.ArgumentParser(description="Process CTE DB-HS 6 Radon Municipal Classifications.")
    parser.add_argument(
        "--output-sql",
        default=DEFAULT_OUTPUT_SQL,
        help=f"Path to output SQL file (default: {DEFAULT_OUTPUT_SQL})",
    )
    parser.add_argument(
        "--force-download",
        action="store_true",
        help="Force download of upstream BOE XML and INE dictionaries",
    )
    parser.add_argument(
        "--sync-db",
        action="store_true",
        default=True,
        help="Apply generated SQL directly to data/openbarrio.sqlite (default: True)",
    )
    parser.add_argument(
        "--no-sync-db",
        action="store_false",
        dest="sync_db",
        help="Do not apply generated SQL to data/openbarrio.sqlite",
    )

    args = parser.parse_args()

    print("[ETL-RADON] Starting CTE DB-HS 6 Radon Municipal ETL pipeline...")

    # 1. Load reference geographies
    provinces = load_provinces(args.force_download)
    all_by_id, lookup_by_prov_norm, all_by_prov = load_municipalities(args.force_download)

    # 2. Fetch official BOE XML
    boe_xml = fetch_file(BOE_XML_URL, "BOE-A-2019-18528.xml", args.force_download)

    # 3. Parse table
    extracted = parse_boe_radon_table(boe_xml)

    # 4. Resolve canonical records
    records = resolve_municipality_records(extracted, provinces, all_by_id, lookup_by_prov_norm, all_by_prov)

    # 5. Generate SQL
    generate_sql_file(records, args.output_sql)

    # 6. Synchronize with local SQLite if requested
    if args.sync_db:
        sync_local_sqlite(args.output_sql, LOCAL_DB_PATH)

    print("[ETL-RADON] Processing complete.")


if __name__ == "__main__":
    main()

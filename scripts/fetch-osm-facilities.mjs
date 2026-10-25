import fs from 'node:fs';

async function main() {
  const query = `[out:json][timeout:30];
(
  node["amenity"~"clinic|doctors|hospital|health_post"](40.330,-3.730,40.365,-3.680);
  way["amenity"~"clinic|doctors|hospital|health_post"](40.330,-3.730,40.365,-3.680);
  node["leisure"="park"](40.330,-3.730,40.365,-3.680);
  way["leisure"="park"](40.330,-3.730,40.365,-3.680);
);
out center;`;

  console.log('Fetching OSM facilities from Overpass API...');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    headers: { 'User-Agent': 'OpenBarrio-CivicIngestion/0.1' },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  console.log(`Fetched ${json.elements.length} elements from OSM.`);
  
  const named = json.elements.filter(el => el.tags && el.tags.name);
  console.log(`Named facilities count: ${named.length}`);
  named.forEach(el => {
    const lat = el.lat || el.center?.lat;
    const lon = el.lon || el.center?.lon;
    console.log(`- [${el.tags.amenity || el.tags.leisure}] ${el.tags.name} (${lat}, ${lon})`);
  });

  fs.writeFileSync('scripts/osm_healthcare_parks_villaverde.json', JSON.stringify(json.elements, null, 2));
  console.log('Saved to scripts/osm_healthcare_parks_villaverde.json');
}

main().catch(console.error);

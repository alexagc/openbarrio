import fs from 'node:fs';

async function main() {
  const bbox = '40.340,-3.715,40.352,-3.700';
  const query = `[out:json][timeout:15];(
    node["highway"="bus_stop"](${bbox});
    node["railway"="station"](${bbox});
    node["railway"="halt"](${bbox});
    node["railway"="subway_entrance"](${bbox});
    node["amenity"="hospital"](${bbox});
    node["amenity"="clinic"](${bbox});
    node["amenity"="school"](${bbox});
    node["leisure"="park"](${bbox});
  );out body;`;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  console.log('Fetching Overpass data for Villaverde Alto...');
  
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'OpenBarrioCivicETL/1.0 (contact@openbarrio.org)' }
    });
    if (!res.ok) {
      console.error('Overpass HTTP error:', res.status, res.statusText);
      return;
    }
    const data = await res.json();
    console.log(`Found ${data.elements?.length || 0} real elements in OSM.`);
    
    const results = (data.elements || []).map(el => ({
      id: el.id,
      name: el.tags?.name || el.tags?.ref || 'Sin nombre',
      lat: el.lat,
      lon: el.lon,
      tags: el.tags
    }));
    
    fs.writeFileSync('scripts/osm_villaverde.json', JSON.stringify(results, null, 2));
    console.log('Saved to scripts/osm_villaverde.json');
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

main();

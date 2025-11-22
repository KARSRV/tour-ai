export async function getTouristPlacesForCoords(
  lat: number,
  lon: number,
  limit = 5
): Promise<{ name: string; lat: number; lon: number }[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["tourism"~"attraction|museum|gallery|zoo|theme_park|park|historic|viewpoint"]["name"](around:15000,${lat},${lon});
      way["tourism"~"attraction|museum|gallery|zoo|theme_park|park|historic|viewpoint"]["name"](around:15000,${lat},${lon});
      relation["tourism"~"attraction|museum|gallery|zoo|theme_park|park|historic|viewpoint"]["name"](around:15000,${lat},${lon});
    );
    out center 20;
  `;

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) return [];

  const data: any = await res.json();
  if (!data.elements) return [];

  const results: { name: string; lat: number; lon: number }[] = [];
  const seen = new Set<string>();

  for (const el of data.elements) {
    const name = el.tags?.name;
    if (!name || seen.has(name)) continue;

    seen.add(name);

    const nodeLat = el.lat;
    const nodeLon = el.lon;

    const centerLat = el.center?.lat;
    const centerLon = el.center?.lon;

    const finalLat = nodeLat ?? centerLat;
    const finalLon = nodeLon ?? centerLon;

    if (!finalLat || !finalLon) continue;

    results.push({
      name,
      lat: finalLat,
      lon: finalLon,
    });

    if (results.length >= limit) break;
  }

  return results;
}

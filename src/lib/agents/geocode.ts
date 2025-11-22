export type GeocodeResult = {
  lat: number;
  lon: number;
  displayName: string;
};

export class PlaceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlaceNotFoundError";
  }
}

export async function geocodePlace(place: string): Promise<GeocodeResult> {
  if (!place || !place.trim()) {
    throw new PlaceNotFoundError("Place name cannot be empty");
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    place
  )}&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "tourism-multi-agent-app/1.0 (souravkaranth@gmail.com)",
    },
  });

  if (!res.ok) {
    throw new Error(`Nominatim error: ${res.status}`);
  }

  const data: any[] = await res.json();

  // No results at all
  if (!data || data.length === 0) {
    throw new PlaceNotFoundError(`Place not found: ${place}`);
  }

  const first = data[0];

  // Parse numbers safely
  const lat = parseFloat(first.lat);
  const lon = parseFloat(first.lon);

  // ❌ If Nominatim gives "state" or "region" without coords → reject
  if (!isFinite(lat) || !isFinite(lon)) {
    throw new PlaceNotFoundError(`Place not found: ${place}`);
  }

  return {
    lat,
    lon,
    displayName: first.display_name as string,
  };
}

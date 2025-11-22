import { NextRequest, NextResponse } from "next/server";
import { geocodePlace, PlaceNotFoundError } from "@/lib/agents/geocode";
import { getWeatherForCoords } from "@/lib/agents/weather";
import { getTouristPlacesForCoords } from "@/lib/agents/places";

export const runtime = "nodejs";

type RequestBody = {
  place: string;
  wantWeather?: boolean;
  wantPlaces?: boolean;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const place = body.place?.trim();
  const wantWeather = body.wantWeather ?? true;
  const wantPlaces = body.wantPlaces ?? true;

  if (!place) {
    return NextResponse.json({ error: "place is required" }, { status: 400 });
  }

  try {
    // 1. Geocode place
    const geo = await geocodePlace(place);

    const lat = Number(geo.lat);
    const lon = Number(geo.lon);

    // Validate coords before passing deeper
    const coordsAreValid = Number.isFinite(lat) && Number.isFinite(lon);
    if (!coordsAreValid) {
      throw new PlaceNotFoundError("Invalid coordinates found.");
    }

    // 2. Fetch weather + places in parallel
    const [weather, places] = await Promise.all([
      wantWeather ? getWeatherForCoords(lat, lon) : Promise.resolve(null),
      wantPlaces ? getTouristPlacesForCoords(lat, lon) : Promise.resolve(null),
    ]);

    // 3. Build chat response
    const textParts: string[] = [];

    if (wantWeather && weather) {
      const temp =
        weather.temperatureC != null
          ? `${weather.temperatureC}°C`
          : "unknown temperature";

      const rain =
        weather.rainChancePercent != null
          ? `with a chance of ${weather.rainChancePercent}% to rain`
          : "";

      textParts.push(`In ${place} it is currently ${temp} ${rain}.`);
    }

    if (wantPlaces && Array.isArray(places) && places.length > 0) {
      const intro =
        wantWeather && textParts.length > 0
          ? "And these are the places you can go:"
          : `In ${place} these are the places you can go:`;

      const list = places.map((p) => `• ${p.name}`).join("\n");

      textParts.push(`${intro}\n${list}`);
    }

    // If no results (weather false + places false) send fallback
    if (textParts.length === 0) {
      textParts.push("I could not gather any information for this query.");
    }

    return NextResponse.json({
      success: true,
      place,
      lat,
      lon,
      placesCoords: places ?? [],
      message: textParts.join("\n\n"),
    });
  } catch (err: any) {
    // If the geocode API or coordinate logic fails:
    if (err instanceof PlaceNotFoundError) {
      return NextResponse.json(
        { success: false, message: "I do not know this place exists." },
        { status: 404 }
      );
    }

    // Log for debugging (optional)
    console.error("Child agents error:", err);

    // Generic failback
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong talking to the child agents.",
      },
      { status: 500 }
    );
  }
}

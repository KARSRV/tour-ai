export type WeatherInfo = {
  temperatureC: number | null;
  rainChancePercent: number | null;
};

export async function getWeatherForCoords(
  lat: number,
  lon: number
): Promise<WeatherInfo> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat.toString());
  url.searchParams.set("longitude", lon.toString());
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("daily", "precipitation_probability_max");
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Open Meteo error: ${res.status}`);
  }

  const data: any = await res.json();

  const temp =
    data.current_weather && typeof data.current_weather.temperature === "number"
      ? data.current_weather.temperature
      : null;

  const rain =
    data.daily &&
    Array.isArray(data.daily.precipitation_probability_max) &&
    data.daily.precipitation_probability_max.length > 0
      ? data.daily.precipitation_probability_max[0]
      : null;

  return {
    temperatureC: temp,
    rainChancePercent: rain,
  };
}

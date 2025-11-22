"use client";

export default function AgentsPage() {
  return (
    <div className="pt-32 px-6 flex justify-center w-full min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-purple-200">
      <div className="max-w-3xl w-full bg-black/30 backdrop-blur-xl border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-900/40 p-10 fadeIn">
        <h1 className="text-4xl font-bold text-purple-300 mb-6">
          Multi-Agent System
        </h1>

        <p className="text-lg text-purple-200/90 mb-8">
          Tourism-AI is powered by three core agents that collaborate to
          understand your query and deliver live, accurate tourism results.
        </p>

        <div className="grid grid-cols-1 gap-6">
          {/* Weather Agent */}
          <div className="bg-black/40 border border-purple-800/40 rounded-2xl p-6 shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition-transform">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">
              Weather Agent
            </h2>
            <p className="text-purple-200/90 mb-3">
              Fetches real-time temperature, rain probability, and weather
              forecasts.
            </p>
            <p className="text-sm text-purple-300">
              API:{" "}
              <span className="text-purple-200">Open-Meteo Forecast API</span>
            </p>
            <p className="text-sm text-purple-300 break-all">
              Endpoint: https://api.open-meteo.com/v1/forecast
            </p>
          </div>

          {/* Places Agent */}
          <div className="bg-black/40 border border-purple-800/40 rounded-2xl p-6 shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition-transform">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">
              Places Agent
            </h2>
            <p className="text-purple-200/90 mb-3">
              Suggests nearby attractions such as parks, museums, galleries and
              more.
            </p>
            <p className="text-sm text-purple-300">
              API:{" "}
              <span className="text-purple-200">
                Overpass OpenStreetMap API
              </span>
            </p>
            <p className="text-sm text-purple-300 break-all">
              Endpoint: https://overpass-api.de/api/interpreter
            </p>
          </div>

          {/* Geocoding Agent */}
          <div className="bg-black/40 border border-purple-800/40 rounded-2xl p-6 shadow-lg shadow-purple-900/40 hover:scale-[1.02] transition-transform">
            <h2 className="text-2xl font-semibold text-purple-300 mb-2">
              Geocoding Agent
            </h2>
            <p className="text-purple-200/90 mb-3">
              Converts place names into precise latitude and longitude
              coordinates.
            </p>
            <p className="text-sm text-purple-300">
              API:{" "}
              <span className="text-purple-200">
                Nominatim OpenStreetMap API
              </span>
            </p>
            <p className="text-sm text-purple-300 break-all">
              Endpoint: https://nominatim.openstreetmap.org/search
            </p>
          </div>
        </div>

        <p className="mt-10 text-lg text-purple-300">
          These agents work in sync to interpret your query, fetch data, and
          support your trip with AI-driven precision.
        </p>
      </div>
    </div>
  );
}

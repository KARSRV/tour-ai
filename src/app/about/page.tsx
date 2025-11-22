"use client";

export default function AboutPage() {
  return (
    <div className="pt-32 px-6 flex justify-center w-full min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-purple-200">
      <div className="max-w-3xl w-full bg-black/30 backdrop-blur-xl border border-purple-900/40 rounded-2xl shadow-2xl shadow-purple-900/40 p-10 fadeIn">
        <h1 className="text-4xl font-bold text-purple-300 mb-6">
          About Tourism-AI
        </h1>

        <p className="text-lg leading-relaxed text-purple-200/90 mb-6">
          Tourism-AI is an intelligent multi-agent travel companion designed to
          help users get real-time insights about <b>weather</b>,{" "}
          <b>tourist attractions</b>, and <b>locations</b>. It combines
          open-source APIs and AI-driven query parsing to provide instant,
          accurate travel support.
        </p>

        <p className="text-lg leading-relaxed text-purple-200/90 mb-6">
          Whether you're exploring a new city or planning your next vacation,
          Tourism-AI guides you using:
        </p>

        <ul className="space-y-3 text-purple-300 text-lg">
          <li className="bg-purple-900/30 px-4 py-2 rounded-xl border border-purple-800/40">
            Live weather forecasting tools
          </li>
          <li className="bg-purple-900/30 px-4 py-2 rounded-xl border border-purple-800/40">
            Geolocation and place-detection services
          </li>
          <li className="bg-purple-900/30 px-4 py-2 rounded-xl border border-purple-800/40">
            A smart natural-language query system
          </li>
        </ul>

        <p className="mt-8 text-lg leading-relaxed text-purple-200/90">
          Built using Next.js, multi-agent architecture, and interactive map
          visualization, Tourism-AI delivers a smooth, visually immersive and
          intelligent trip-planning experience.
        </p>
      </div>
    </div>
  );
}

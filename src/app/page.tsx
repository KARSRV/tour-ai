"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { parseUserMessage } from "@/lib/parseMessage";

const Map = dynamic(() => import("@/components/MapComponent"), { ssr: false });

type ChatMessage = {
  sender: "user" | "agent";
  text: string;
};

type PlaceCoord = {
  name: string;
  lat: number;
  lon: number;
};

export default function HomePage() {
  const [showChat, setShowChat] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [placesCoords, setPlacesCoords] = useState<PlaceCoord[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const [welcomeInput, setWelcomeInput] = useState("");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, typingText, loading]);

  async function handleSend(forced?: string) {
    const message = forced ?? input.trim();
    if (!message) return;

    setChat((prev) => [...prev, { sender: "user", text: message }]);
    if (!forced) setInput("");

    setLoading(true);
    const parsed = parseUserMessage(message);

    try {
      const res = await fetch("/api/tourism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      setLoading(false);

      const validCoords =
        Number.isFinite(data.lat) && Number.isFinite(data.lon);

      setCoords(validCoords ? { lat: data.lat, lon: data.lon } : null);

      if (Array.isArray(data.placesCoords)) {
        setPlacesCoords(
          data.placesCoords.filter(
            (p: any) =>
              Number.isFinite(p.lat) && Number.isFinite(p.lon) && p.name
          )
        );
      } else {
        setPlacesCoords([]);
      }

      setShowMap(
        Array.isArray(data.placesCoords) && data.placesCoords.length > 0
      );

      let i = 0;
      const full = data.message || "I could not process your request.";
      setTypingText("");

      const interval = setInterval(() => {
        setTypingText(full.slice(0, ++i));
        if (i >= full.length) {
          clearInterval(interval);
          setTypingText("");
          setChat((prev) => [...prev, { sender: "agent", text: full }]);
        }
      }, 18);
    } catch {
      setLoading(false);
      setCoords(null);
      setShowMap(false);

      setChat((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Something went wrong processing your request.",
        },
      ]);
    }
  }

  function startChat() {
    if (!welcomeInput.trim()) return;

    const first = welcomeInput.trim();
    setWelcomeInput("");
    setShowChat(true);

    setTimeout(() => handleSend(first), 200);
  }

  return (
    <div
      className={`grid h-full w-full pt-24 ${
        showMap ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      } bg-gradient-to-br from-black via-purple-950 to-black`}
    >
      {/* LEFT CHAT AREA */}
      <div
        className={`p-6 h-full flex transition-all duration-700 ${
          showMap ? "slide-left items-start" : "slide-center items-center"
        } justify-center`}
        style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
      >
        {!showChat && (
          <div className="w-full max-w-lg text-center fadeIn bg-black/20 backdrop-blur-xl py-10 px-7 rounded-2xl border border-purple-900/40 shadow-xl shadow-purple-900/40">
            <h1 className="text-4xl font-bold mb-6 text-purple-300 tracking-wide">
              Tourism-AI
            </h1>

            <input
              value={welcomeInput}
              onChange={(e) => setWelcomeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startChat()}
              placeholder="Ask something like: Plan my trip to Bangalore"
              className="w-full rounded-xl border border-purple-700/40 bg-black/50 text-purple-200 px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-600/40 transition-all"
            />

            <button
              onClick={startChat}
              className="mt-5 rounded-xl bg-purple-600 px-7 py-2.5 text-sm font-semibold hover:bg-purple-700 shadow-purple-500/40 shadow-lg transition-all active:scale-95"
            >
              Ask
            </button>
          </div>
        )}

        {showChat && (
          <div className="w-full max-w-xl max-h-[75vh] rounded-2xl border border-purple-900/40 bg-black/40 backdrop-blur-lg p-6 flex flex-col fadeInUp shadow-xl shadow-purple-900/30">
            <h1 className="text-xl font-semibold mb-4 text-purple-300 tracking-wide">
              TourAI Assistant
            </h1>

            <div className="flex-1 overflow-y-auto max-h-[60vh] space-y-4 pr-2 custom-scroll">
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm whitespace-pre-line shadow ${
                    msg.sender === "user"
                      ? "bg-purple-600 text-white self-end ml-auto shadow-purple-600/40"
                      : "bg-purple-900/50 text-purple-200 border border-purple-800/30 shadow-purple-900/20"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {typingText && (
                <div className="max-w-[80%] px-4 py-2.5 rounded-xl text-sm bg-purple-900/50 text-purple-200 border border-purple-800/20 shadow shadow-purple-900/20 whitespace-pre-line">
                  {typingText}
                </div>
              )}

              {loading && (
                <div className="max-w-[80%] px-4 py-2.5 rounded-xl text-sm bg-purple-900/50 text-purple-300 border border-purple-800/20 animate-fadePulse shadow shadow-purple-900/20">
                  Thinking…
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-purple-800/40 bg-black/50 text-purple-200 px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-600/40 transition-all"
              />
              <button
                onClick={() => handleSend()}
                className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold hover:bg-purple-700 shadow-purple-500/40 shadow active:scale-95 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT MAP AREA */}
      <div
        className={`p-6 h-full transition-all duration-700 ${
          showMap ? "map-visible hidden lg:flex" : "map-hidden hidden"
        }`}
      >
        <div className="w-full h-full rounded-2xl border border-purple-900/40 bg-black/40 backdrop-blur-xl shadow-2xl shadow-purple-900/40 overflow-hidden">
          <Map coords={coords} places={placesCoords} />
        </div>
      </div>
    </div>
  );
}

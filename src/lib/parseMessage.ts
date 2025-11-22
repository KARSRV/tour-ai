export function parseUserMessage(msg: string) {
  const original = msg.trim();
  const lower = original.toLowerCase();

  // Intent detection
  const wantWeather =
    lower.includes("weather") ||
    lower.includes("temperature") ||
    lower.includes("rain") ||
    lower.includes("climate");

  const wantPlaces =
    lower.includes("visit") ||
    lower.includes("places") ||
    lower.includes("attractions") ||
    lower.includes("plan my trip") ||
    lower.includes("plan a trip") ||
    lower.includes("trip") ||
    lower.includes("go visit") ||
    lower.includes("what to do");

  let place = "";

  // Strong regex-based extraction
  const regexList = [
    /in ([a-zA-Z\s]+)/, // plan my trip in bangalore
    /to ([a-zA-Z\s]+)/, // travel to bangalore
    /at ([a-zA-Z\s]+)/,
    /trip to ([a-zA-Z\s]+)/,
    /trip in ([a-zA-Z\s]+)/,
    /visit ([a-zA-Z\s]+)/,
    /around ([a-zA-Z\s]+)/,
    /near ([a-zA-Z\s]+)/,
    /([a-zA-Z\s]+) trip/, // bangalore trip
  ];

  for (const r of regexList) {
    const m = lower.match(r);
    if (m && m[1]) {
      place = m[1].trim();
      break;
    }
  }

  
  if (!place) {
    const preps = [" to ", " in ", " at "];
    let pos = -1;
    let prep = "";

    for (const p of preps) {
      const idx = lower.lastIndexOf(p);
      if (idx > -1 && idx + p.length < lower.length) {
        if (idx > pos) {
          pos = idx;
          prep = p;
        }
      }
    }

    if (pos >= 0) {
      let after = original.slice(pos + prep.length).trim();

      const stopChars = [",", "?", ".", "!"];
      let cutIndex = after.length;

      for (const ch of stopChars) {
        const i = after.indexOf(ch);
        if (i !== -1 && i < cutIndex) {
          cutIndex = i;
        }
      }

      after = after.slice(0, cutIndex).trim();
      place = after;
    }
  }

  // Fallback: if message is short like "Bangalore"
  if (!place && original.split(/\s+/).length <= 3) {
    place = original;
  }

  // Cleanup: remove trailing words
  if (place) {
    place = place.replace(/(please|let.*|plan.*)$/gi, "").trim();
  }

  return {
    place,
    wantWeather,
    wantPlaces,
  };
}

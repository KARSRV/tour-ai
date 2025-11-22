import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { places } = await req.json();

    if (!Array.isArray(places) || places.length === 0) {
      return NextResponse.json(
        { success: false, message: "No places provided." },
        { status: 400 }
      );
    }

    const prompt = `
Give me short but rich descriptions for each of these tourist places.
Keep each summary under 5 lines.
Make it useful, simple, and travel-friendly.

Places:
${places.map((p: string) => "- " + p).join("\n")}
`;

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
        }),
      }
    );

    const data = await groqRes.json();

    const text =
      data?.choices?.[0]?.message?.content ??
      "I could not generate more details.";

    return NextResponse.json({
      success: true,
      info: text,
    });
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch additional place info." },
      { status: 500 }
    );
  }
}

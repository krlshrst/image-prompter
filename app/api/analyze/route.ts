import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your-key-here") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY nicht konfiguriert. Bitte in .env.local setzen." }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { description, imageBase64, imageMime, selectedAIs, stylePreset, aspectRatio } = body;

    if (!description?.trim() && !imageBase64) {
      return NextResponse.json({ error: "Bitte Bild oder Beschreibung angeben." }, { status: 400 });
    }

    const content: Array<Record<string, unknown>> = [];
    if (imageBase64) {
      content.push({ type: "image", source: { type: "base64", media_type: imageMime, data: imageBase64 } });
    }

    const parts: string[] = [];
    if (description) parts.push(`Nutzerbeschreibung: ${description}`);
    if (stylePreset) parts.push(`Gewünschter Stil: ${stylePreset}`);
    if (aspectRatio) parts.push(`Gewünschtes Seitenverhältnis: ${aspectRatio}`);
    if (imageBase64) parts.push("Analysiere dieses Bild sorgfältig und extrahiere alle visuellen Parameter.");
    parts.push(`Generiere strukturierte Prompt-Parameter NUR für: ${selectedAIs.join(", ")}.`);
    parts.push("Gib NUR die JSON-Struktur zurück.");
    content.push({ type: "text", text: parts.join("\n") });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      }),
    });

    const data = await res.json();
    if (data.error) {
      return NextResponse.json({ error: data.error.message || JSON.stringify(data.error) }, { status: 502 });
    }

    const raw = (data.content || []).map((b: { text?: string }) => b.text ?? "").join("").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: "Kein JSON in der Antwort." }, { status: 502 });
    }

    let jsonStr = match[0];
    try {
      return NextResponse.json(JSON.parse(jsonStr));
    } catch {
      let open = 0, inStr = false, esc = false;
      for (const ch of jsonStr) {
        if (esc) { esc = false; continue; }
        if (ch === "\\") { esc = true; continue; }
        if (ch === '"') { inStr = !inStr; continue; }
        if (!inStr) { if (ch === "{") open++; else if (ch === "}") open--; }
      }
      if (inStr) jsonStr += '"';
      jsonStr += "}".repeat(Math.max(0, open));
      return NextResponse.json(JSON.parse(jsonStr));
    }
  } catch (err) {
    return NextResponse.json({ error: `Fehler: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}

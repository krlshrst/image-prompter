import type { AISystem, PromptFormState } from "./types";

export const AI_SYSTEMS: AISystem[] = ["Midjourney", "Flux", "Nano Banana Pro", "GPT Image 2"];

/** Wann welches Modell? (Update-Bericht Bild-Prompting 2025–2026) */
export const MODEL_HINTS: Record<AISystem, string> = {
  "Midjourney": "Ästhetik & Kunst — V8.1, native 2K",
  "Flux": "Fotorealismus & Charakter-Konsistenz (bis 8 Referenzbilder)",
  "Nano Banana Pro": "Konversationelles Editing & Text",
  "GPT Image 2": "Komplexe Anweisungen, Text & Infografiken — Reasoning-First",
};

export const ASPECT_RATIOS: Record<string, string> = {
  "":      "Automatisch",
  "1:1":   "1:1 – Quadrat (Instagram, Profilbild)",
  "4:5":   "4:5 – Portrait (Instagram Portrait)",
  "9:16":  "9:16 – Story (Reels, TikTok)",
  "16:9":  "16:9 – Landscape (YouTube, Screens)",
  "3:2":   "3:2 – Foto-Standard",
  "21:9":  "21:9 – Kino (Ultrawide)",
  "4:1":   "4:1 – Banner (LinkedIn)",
};

export const STYLE_OPTIONS: Record<string, string> = {
  "": "— Stil auswählen oder frei eingeben —",
  "Editorial Photography": "Editorial photography, natürliches diffuses Licht, Filmkörnung, entsättigte Töne, Leica-Qualität",
  "Commercial Product": "Commercial product photography, weißer Seamless-Hintergrund, Studio-Ringlicht, gestochen scharf",
  "Cinematic": "Cinematic still, filmische Beleuchtung, shallow depth of field, dramatisch, Kinoqualität",
  "Flat Vector": "Flat vector illustration, geometrische Formen, begrenzte Farbpalette, keine Verläufe, Swiss Design",
  "Lifestyle Brand": "Lifestyle photography, warme Töne, authentisch, Kinfolk-Ästhetik, natürliches Licht",
  "Corporate Modern": "Corporate-Fotografie, aufgeräumt, modern, neutrales Licht, Getty-Premium-Qualität",
  "Tech Brand": "Tech-Brand-Visual, Verlaufslichter, blau-lila Töne, Startup-Ästhetik",
  "Watercolor": "Aquarellmalerei, Nass-in-Nass-Technik, botanischer Illustrationsstil, Papiertextur",
  "Cyberpunk": "Cyberpunk-Ästhetik, Neon-Beleuchtung, regenglänzende Straßen, volumetrischer Nebel",
  "3D Render": "Fotorealistisches 3D-Rendering, Blender-Cycles-Qualität, HDRI Studio-Licht, PBR-Materialien",
  "Isometric": "Isometrische 3D-Illustration, weiche Schatten, Pastelltöne, Tech-Startup-Ästhetik",
  "Retro Poster": "Vintage-Plakat 1950er/60er, Art-Deco-Typografie, begrenzte Farbpalette, Siebdruck-Textur",
  "Minimalist Scandinavian": "Skandinavisch-minimalistisch, viel Weißraum, natürliche Materialien, ruhige Palette",
  "Beauty Portrait": "Beauty-Portrait, Schmetterlingslicht, seichte Schärfentiefe, sichtbare Hauttextur",
  "Documentary Street": "Candid-Streetfotografie, 35mm-Film, Magnum Photos Stil, verfügbares Licht",
  "Oil Painting": "Klassische Ölmalerei, Chiaroscuro-Beleuchtung, Old Masters Technik, satte Farben",
  "Concept Art": "Concept Art, Artstation trending, cinematic Lighting, Matte Painting Style",
  "Japanese Woodblock": "Japanischer Holzschnitt Ukiyo-e, Hiroshige-Einfluss, Erdtöne, markante Umrisse",
};

export const LIGHTING_OPTIONS = [
  "", "Natürliches Tageslicht", "Golden Hour (Sonnenuntergang)", "Weiches diffuses Studiolicht",
  "Dramatisches Chiaroscuro", "Rembrandt Lighting", "High-Contrast Lighting",
  "Neon / Rim Light", "Practical Lights (Lampen im Bild)", "Gegenlicht (Backlighting)",
  "Overcast / Bewölkt", "Blaue Stunde", "Ring Light", "Kerzenlicht / Warm",
  "Hartes Blitzlicht", "Fensterlicht von der Seite",
];

/** Fotografische Details für Flux 2 Pro — Kameraparameter direkt im Prompt */
export const FLUX_PHOTO_TAGS = [
  "Bokeh", "Shallow Depth of Field", "Film Grain",
  "Chromatische Aberration", "Lens Distortion", "Motion Blur",
];

export const CAMERA_OPTIONS = [
  "", "Nahaufnahme / Close-up", "Portrait (Brustbild)", "Halbtotale (Medium Shot)",
  "Totale (Wide Shot)", "Vogelperspektive / Overhead", "Froschperspektive (Low Angle)",
  "Extreme Nahaufnahme / Macro", "Dutch Angle", "Over-the-shoulder",
  "Rule of Thirds", "Symmetrische Komposition", "Panorama / Ultrawide",
];

export const QUALITY_TAGS_NB = [
  "hochauflösend", "maximale Detailschärfe", "professionelle Qualität",
  "8K-Detail", "druckfähige Qualität", "fotorealistisch", "gestochen scharf",
];

export const USE_CASE_TEMPLATES: Record<string, { subject: string; scene: string; ar: string; style: string }> = {
  "Instagram Lifestyle":     { subject: "", scene: "Warmes Morgenlicht, authentisch, Kinfolk-Ästhetik", ar: "4:5", style: "Lifestyle Brand" },
  "Instagram Produkt":       { subject: "", scene: "Weißer Seamless-Hintergrund, Studio", ar: "1:1", style: "Commercial Product" },
  "LinkedIn Banner":         { subject: "", scene: "Modernes Büro-Umfeld, professionell", ar: "4:1", style: "Corporate Modern" },
  "Story / Reels":           { subject: "", scene: "Hoher Kontrast, vertikales Format, Platz für Text-Overlay", ar: "9:16", style: "Editorial Photography" },
  "YouTube Thumbnail":       { subject: "", scene: "Dramatische Beleuchtung, Freiraum links für Text", ar: "16:9", style: "Cinematic" },
  "Website Hero":            { subject: "", scene: "Modern, freundlich, Schweizer Design", ar: "16:9", style: "Flat Vector" },
  "Pinterest":               { subject: "", scene: "Flat Lay, Vogelperspektive, Negativraum, Fensterlicht", ar: "9:16", style: "Lifestyle Brand" },
  "Event / Kampagne":        { subject: "", scene: "Mutig, energetisch, Platz für Text in der Mitte", ar: "4:5", style: "Cinematic" },
};

export const SYSTEM_PROMPT = `Du bist ein Experte für KI-Bildgenerierungs-Prompts (Stand: Bild-Prompting-Update 2025–2026). Analysiere das gegebene Bild und/oder die Beschreibung und generiere hochoptimierte, strukturierte Prompts für die angeforderten KI-Systeme.

Jeder Prompt muss als strukturiertes Parameter-Objekt zurückgegeben werden – NICHT als einzelner String.

UNIVERSELLES PROMPT-FRAMEWORK (für alle Modelle):
[MOTIV/SUBJEKT] + [BILDSTIL] + [TECHNISCHE DETAILS] + [LICHT] + [BILDKOMPOSITION] + [ATMOSPHÄRE] + [KAMERA-EINSTELLUNGEN]
Licht ist die mächtigste Variable – benenne es präzise (Golden Hour, Rembrandt Lighting, High-Contrast, Practical Lights, Overcast). Komposition explizit steuern (Drittel-Regel, Perspektive, Framing).

MIDJOURNEY (V8.1) – Natural Language First
Neu geschriebene Engine, 4–5x schneller, native 2K-Auflösung als Standard. Stärkstes Modell für Ästhetik und künstlerische Interpretation.
Schreibe vollständige, beschreibende Sätze – KEINE Keyword-Listen.
Farben verbal beschreiben (MJ versteht KEINE Hex-Codes). Reihenfolge zählt: Frühe Begriffe wirken stärker – Motiv zuerst.
Parameter: prompt, style, aspect_ratio, version ("8.1"), quality ("1"/"2"), stylize (0-1000), chaos (0-100), weird (0-3000), style_mode ("raw"/null), negative, seed, full_command

FLUX 2 PRO – Spitzenreiter Fotorealismus
Schreibe 2-4 vollständige natürliche Sätze (kein Komma-Tag-Stil).
Für Fotorealismus Kameraparameter DIREKT einbauen – das Modell versteht und setzt um: Brennweite (85mm), Blende (f/1.8), Bokeh, Lens Distortion, Chromatische Aberration, Film Grain.
Flux 2 Pro versteht **Hex-Farbwerte direkt** – Farben aus dem Bild IMMER als konkrete Hex-Codes im prompt-Text angeben (z.B. "Farbpalette: #1a2b3c, #f5e6d3"). NICHT nur verbal.
Rendert **stilisierten Text** stark (Neon-Schriften, Graffiti, Gravuren) – Text wörtlich in Anführungszeichen integrieren.
Charakter-Konsistenz über bis zu 8 Referenzbilder. Auflösung nativ 4 MP (z.B. 2048x1152 für 16:9).
Defaults: model "flux-2-pro", steps 32, guidance_scale 3.5, scheduler "Euler".
Parameter: model ("flux-2-pro"), prompt (2-4 Sätze inkl. Kameraparameter, Hex-Codes & ggf. Text), negative_prompt, width, height, steps, guidance_scale, seed, style_preset, scheduler

NANO BANANA PRO – Konversationell, Natural Language Only
Kein Parameter-System. Alles über natürliche Sprache.
Formel: [Erstelle/Generiere] + [Subjekt] + [Aktion] + [Szene/Kontext] + [Stilangaben] + [Qualitätshinweise] + [Format]
Positive Formulierungen statt Verbote. Hex-Codes direkt nutzbar. Textrendering ist eine Stärke.
Parameter: subject, action, scene, style, lighting, mood, color_palette, quality_tags, format_description, text_content, full_prompt

GPT IMAGE 2 – Reasoning-First, komplexe Anweisungen
Integrierter Denkschritt vor der Synthese: versteht Kontext, Hierarchie und Absicht – keine Keyword-Listen.
Sequenzielle Struktur: erst Gesamtkomposition, dann Stil, dann Subjekt, dann Umgebung, dann Licht, dann Farbe, dann Text-Elemente, dann Qualität.
Bestes Modell für sauberen Dokumententext im Bild (>95%, multilingual): Etiketten, UI-Mockups, Infografiken – Text wörtlich in Anführungszeichen.
Positive Formulierungen statt Verbote ("bokeh-Hintergrund" statt "kein unscharfer Hintergrund").
2K nativ, 4K optional. Defaults: model "gpt-image-2", quality "high", output_format "png".
Parameter: model ("gpt-image-2"), prompt (sequenziell, alle Dimensionen), size (z.B. "2048x2048", "2048x1152"), quality ("high"/"medium"/"low"), output_format, text_content

Gib NUR valides JSON zurück:
{ "Midjourney": { ... }, "Flux": { ... }, "Nano Banana Pro": { ... }, "GPT Image 2": { ... } }
Nur Keys für angeforderte KI-Systeme.`;

export const EMPTY_FORM_STATE: PromptFormState = {
  subject: "", action: "", scene: "", style_select: "", style_text: "",
  camera: "", lens: "", lighting: "", mood: "",
  colors_verbal: "", colors_hex: "",
  negative: "", negative_positive: "",
  text_in_image: "", text_style: "",
  ar: "", selectedAIs: [...AI_SYSTEMS],
  mj_version: "8.1", mj_quality: "1", mj_stylize: "", mj_chaos: "", mj_weird: "", mj_seed: "", mj_style_raw: true,
  flux_style_preset: "",
  flux_photo_tags: [],
  nb_quality_tags: ["hochauflösend", "professionelle Qualität"],
  gpt_quality: "high",
};

export const AI_COLORS: Record<AISystem, { primary: string; light: string; bg: string; border: string }> = {
  "Midjourney":      { primary: "#7c6cff", light: "#a78bfa", bg: "bg-mj/10",      border: "border-mj/30" },
  "Flux":            { primary: "#f97316", light: "#fb923c", bg: "bg-flux/10",     border: "border-flux/30" },
  "Nano Banana Pro": { primary: "#10b981", light: "#34d399", bg: "bg-nb/10",       border: "border-nb/30" },
  "GPT Image 2":     { primary: "#3b82f6", light: "#60a5fa", bg: "bg-gpt/10",      border: "border-gpt/30" },
};

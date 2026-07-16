import type { PromptFormState, MidjourneyPrompt, FluxPrompt, NanoBananaPrompt, GPTImage2Prompt, AssembledPrompts } from "./types";
import { ASPECT_RATIOS } from "./constants";

export function assembleMidjourney(f: PromptFormState): MidjourneyPrompt {
  // Framework 2026: Motiv zuerst (frühe Begriffe wirken stärker), dann Stil,
  // Technik, Licht, Komposition, Atmosphäre.
  const descParts: string[] = [];
  if (f.subject) descParts.push(f.subject);
  if (f.action) descParts.push(f.action);
  if (f.scene) descParts.push(f.scene);
  if (f.style_text) descParts.push(f.style_text);
  if (f.lens) descParts.push(f.lens);
  if (f.lighting) descParts.push(f.lighting);
  if (f.camera) descParts.push(f.camera);
  if (f.mood) descParts.push(f.mood);
  if (f.colors_verbal) descParts.push(f.colors_verbal);

  const prompt = descParts.filter(Boolean).join(", ");
  if (!prompt) return { prompt: "", style: null, aspect_ratio: null, version: f.mj_version || "8.1", quality: "1", stylize: null, chaos: null, weird: null, style_mode: null, negative: null, seed: null, full_command: "" };

  const params: string[] = [];
  if (f.ar) params.push(`--ar ${f.ar}`);
  if (f.mj_style_raw) params.push("--style raw");
  if (f.mj_version) params.push(`--v ${f.mj_version}`);
  if (f.mj_stylize) params.push(`--stylize ${f.mj_stylize}`);
  if (f.mj_quality && f.mj_quality !== "1") params.push(`--q ${f.mj_quality}`);
  if (f.mj_chaos) params.push(`--chaos ${f.mj_chaos}`);
  if (f.mj_weird) params.push(`--weird ${f.mj_weird}`);
  if (f.mj_seed) params.push(`--seed ${f.mj_seed}`);
  if (f.negative) params.push(`--no ${f.negative}`);

  const full_command = prompt + (params.length ? " " + params.join(" ") : "");

  return {
    prompt,
    style: f.style_text || null,
    aspect_ratio: f.ar || null,
    version: f.mj_version || "8.1",
    quality: f.mj_quality || "1",
    stylize: f.mj_stylize || null,
    chaos: f.mj_chaos || null,
    weird: f.mj_weird || null,
    style_mode: f.mj_style_raw ? "raw" : null,
    negative: f.negative || null,
    seed: f.mj_seed || null,
    full_command,
  };
}

export function assembleFlux(f: PromptFormState): FluxPrompt {
  // Flux 2 Pro versteht natürliche Sprache, Hex-Farbcodes und Text-im-Bild nativ.
  // Wir bauen daher zusammenhängende Sätze statt Komma-Tags.
  const sentences: string[] = [];

  const mainParts: string[] = [];
  if (f.subject) mainParts.push(f.subject);
  if (f.action) mainParts.push(f.action);
  if (f.scene) mainParts.push(`in ${f.scene}`);
  if (mainParts.length) sentences.push(mainParts.join(" "));

  if (f.style_text) sentences.push(`Stil: ${f.style_text}`);
  if (f.lighting) sentences.push(`Beleuchtung: ${f.lighting}`);
  if (f.mood) sentences.push(`Stimmung: ${f.mood}`);

  // Flux 2 Pro kann Hex-Werte direkt verarbeiten
  if (f.colors_hex) {
    sentences.push(`Farbpalette mit exakten Hex-Werten: ${f.colors_hex}`);
  } else if (f.colors_verbal) {
    sentences.push(`Farbpalette: ${f.colors_verbal}`);
  }

  // Fotorealismus: Kameraparameter direkt einbauen — Flux versteht und setzt um
  const camParts: string[] = [];
  if (f.camera) camParts.push(f.camera);
  if (f.lens) camParts.push(f.lens);
  if (camParts.length) sentences.push(`Kamera: ${camParts.join(", ")}`);
  if (f.flux_photo_tags?.length) {
    sentences.push(`Fotografische Details: ${f.flux_photo_tags.join(", ")}`);
  }

  // Flux 2 Pro rendert Text im Bild zuverlässig
  if (f.text_in_image) {
    const textStyle = f.text_style ? ` in ${f.text_style}` : "";
    sentences.push(`Im Bild ist exakt der Text "${f.text_in_image}"${textStyle} klar lesbar zu sehen`);
  }

  if (f.flux_style_preset) sentences.push(`Style-Preset: ${f.flux_style_preset}`);

  const prompt = sentences.filter(Boolean).join(". ") + (sentences.length ? "." : "");

  // Flux 2 Pro unterstützt höhere Auflösungen (bis ~4MP)
  let width = 1536, height = 1536;
  if (f.ar) {
    const map: Record<string, [number, number]> = {
      "1:1": [1536, 1536],
      "4:5": [1408, 1760],
      "9:16": [1152, 2048],
      "16:9": [2048, 1152],
      "3:2": [1824, 1216],
      "21:9": [2048, 880],
      "4:1": [2048, 512],
    };
    const dims = map[f.ar];
    if (dims) { width = dims[0]; height = dims[1]; }
  }

  return {
    model: "flux-2-pro",
    prompt,
    negative_prompt: f.negative || "blurry, low quality, watermark",
    width,
    height,
    steps: 32,
    guidance_scale: 3.5,
    seed: null,
    style_preset: f.flux_style_preset || null,
    scheduler: "Euler",
  };
}

export function assembleNanoBanana(f: PromptFormState): NanoBananaPrompt {
  const parts: string[] = [];
  parts.push("Generiere ein hochauflösendes Bild:");
  if (f.subject) parts.push(f.subject);
  if (f.action) parts.push(f.action);
  if (f.scene) parts.push(f.scene);
  if (f.style_text) parts.push(f.style_text);
  if (f.lighting) parts.push(f.lighting);
  if (f.mood) parts.push(f.mood);
  if (f.colors_hex) parts.push(`Dominante Farben: ${f.colors_hex}`);
  else if (f.colors_verbal) parts.push(f.colors_verbal);
  if (f.camera) parts.push(f.camera);
  if (f.lens) parts.push(f.lens);
  if (f.text_in_image) parts.push(`Im Bild steht der Text "${f.text_in_image}" in ${f.text_style || "klarer, gut lesbarer Schrift"}`);
  const qt = f.nb_quality_tags || [];
  if (qt.length > 0) parts.push(qt.join(", "));
  if (f.ar) {
    const fmtMap: Record<string, string> = { "1:1": "quadratisches Format 1:1", "4:5": "Hochformat 4:5", "9:16": "Hochformat 9:16", "16:9": "Querformat 16:9", "3:2": "Querformat 3:2", "21:9": "Panorama 21:9", "4:1": "breites Bannerformat 4:1" };
    parts.push(fmtMap[f.ar] || f.ar);
  }
  if (f.negative_positive) parts.push(f.negative_positive);

  const full_prompt = parts.filter(Boolean).join(". ").replace(/\.\./g, ".").replace(/\. \./g, ".") + ".";

  return {
    subject: f.subject || null,
    action: f.action || null,
    scene: f.scene || null,
    style: f.style_text || null,
    lighting: f.lighting || null,
    mood: f.mood || null,
    color_palette: f.colors_hex || f.colors_verbal || null,
    quality_tags: qt.length > 0 ? qt : ["hochauflösend", "professionelle Qualität"],
    format_description: f.ar ? ASPECT_RATIOS[f.ar] : null,
    text_content: f.text_in_image || null,
    full_prompt,
  };
}

export function assembleGPTImage2(f: PromptFormState): GPTImage2Prompt {
  // GPT Image 2 ist Reasoning-First: sequenzielle Struktur statt Keyword-Liste.
  // Reihenfolge: Komposition → Stil → Subjekt → Umgebung → Licht → Farbe → Text → Qualität.
  const sentences: string[] = [];

  if (f.camera) sentences.push(`Komposition: ${f.camera}`);
  if (f.style_text) sentences.push(`Stil: ${f.style_text}`);

  const subjectParts: string[] = [];
  if (f.subject) subjectParts.push(f.subject);
  if (f.action) subjectParts.push(f.action);
  if (subjectParts.length) sentences.push(subjectParts.join(", "));

  if (f.scene) sentences.push(`Umgebung: ${f.scene}`);
  if (f.lens) sentences.push(`Kamera-Einstellungen: ${f.lens}`);
  if (f.lighting) sentences.push(`Licht: ${f.lighting}`);
  if (f.mood) sentences.push(`Atmosphäre: ${f.mood}`);

  if (f.colors_hex) sentences.push(`Farbpalette: ${f.colors_hex}`);
  else if (f.colors_verbal) sentences.push(`Farbpalette: ${f.colors_verbal}`);

  if (f.text_in_image) {
    const textStyle = f.text_style ? ` (${f.text_style})` : "";
    sentences.push(`Im Bild steht exakt der Text "${f.text_in_image}"${textStyle}, sauber und korrekt gerendert`);
  }

  // Positive Formulierung statt Verbot
  if (f.negative_positive) sentences.push(f.negative_positive);

  const prompt = sentences.filter(Boolean).join(". ") + (sentences.length ? "." : "");

  // 2K nativ; Größe nach Seitenverhältnis
  const sizeMap: Record<string, string> = {
    "1:1": "2048x2048",
    "4:5": "1638x2048",
    "9:16": "1152x2048",
    "16:9": "2048x1152",
    "3:2": "2048x1365",
    "21:9": "2048x878",
    "4:1": "2048x512",
  };

  return {
    model: "gpt-image-2",
    prompt,
    size: (f.ar && sizeMap[f.ar]) || "2048x2048",
    quality: f.gpt_quality || "high",
    output_format: "png",
    text_content: f.text_in_image || null,
  };
}

export function assembleAll(f: PromptFormState): AssembledPrompts {
  const result: AssembledPrompts = {};
  if (f.selectedAIs.includes("Midjourney")) result["Midjourney"] = assembleMidjourney(f);
  if (f.selectedAIs.includes("Flux")) result["Flux"] = assembleFlux(f);
  if (f.selectedAIs.includes("Nano Banana Pro")) result["Nano Banana Pro"] = assembleNanoBanana(f);
  if (f.selectedAIs.includes("GPT Image 2")) result["GPT Image 2"] = assembleGPTImage2(f);
  return result;
}

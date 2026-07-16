"use client";

import { useState, useRef } from "react";
import type { AISystem, AssembledPrompts } from "@/lib/types";
import { AI_SYSTEMS, STYLE_OPTIONS, ASPECT_RATIOS } from "@/lib/constants";
import { AITabs } from "@/components/shared/AITabs";
import { PromptPreview } from "@/components/shared/PromptPreview";
import { CopyButton } from "@/components/shared/CopyButton";
import { toXML } from "@/lib/xml-export";

const MODEL_BG: Record<AISystem, string> = {
  "Midjourney": "bg-mj-pastel",
  "Flux": "bg-flux-pastel",
  "Nano Banana Pro": "bg-nb-pastel",
  "GPT Image 2": "bg-gpt-pastel",
};

export function AnalyzeView() {
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string | null>(null);
  const [selectedAIs, setSelectedAIs] = useState<AISystem[]>([...AI_SYSTEMS]);
  const [outputFormat, setOutputFormat] = useState<"JSON" | "XML">("JSON");
  const [stylePreset, setStylePreset] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");
  const [result, setResult] = useState<AssembledPrompts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AISystem>("Midjourney");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setError(null);
    const reader = new FileReader();
    reader.onerror = () => setError("Datei konnte nicht gelesen werden.");
    reader.onload = ev => {
      const originalDataUrl = ev.target?.result as string;
      const img = new Image();
      img.onerror = () => {
        setImagePreview(originalDataUrl);
        setImageBase64(originalDataUrl.split(",")[1]);
        setImageMime(file.type || "image/jpeg");
      };
      img.onload = () => {
        const MAX_PX = 1920;
        let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
        if (w > MAX_PX || h > MAX_PX) { const r = Math.min(MAX_PX / w, MAX_PX / h); w = Math.round(w * r); h = Math.round(h * r); }
        try {
          const c = document.createElement("canvas"); c.width = w; c.height = h;
          c.getContext("2d")!.drawImage(img, 0, 0, w, h);
          let q = 0.85;
          let dataUrl: string;
          do { dataUrl = c.toDataURL("image/jpeg", q); q = Math.round((q - 0.05) * 100) / 100; }
          while (dataUrl.length * 0.75 > 4 * 1024 * 1024 && q > 0.2);
          setImagePreview(dataUrl);
          setImageBase64(dataUrl.split(",")[1]);
          setImageMime("image/jpeg");
        } catch {
          setImagePreview(originalDataUrl);
          setImageBase64(originalDataUrl.split(",")[1]);
          setImageMime(file.type || "image/jpeg");
        }
      };
      img.src = originalDataUrl;
    };
    reader.readAsDataURL(file);
  }

  function toggleAI(ai: AISystem) {
    setSelectedAIs(p => p.includes(ai) ? p.filter(a => a !== ai) : [...p, ai]);
  }

  async function generate() {
    if (!description.trim() && !imageBase64) { setError("Bitte Bild hochladen oder Beschreibung eingeben."); return; }
    if (selectedAIs.length === 0) { setError("Bitte mindestens eine KI auswählen."); return; }
    setError(null); setResult(null); setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, imageBase64, imageMime, selectedAIs, stylePreset, aspectRatio }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unbekannter Fehler");
      setResult(data);
      setActiveTab(selectedAIs[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <section className="card-brutal p-4 mb-4">
        <label className="label-brutal">Bild hochladen (optional)</label>
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-ink rounded-xl p-6 text-center cursor-pointer bg-paper hover:bg-cat-licht/50 transition-colors mb-3"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Vorschau des hochgeladenen Bildes" className="max-h-44 max-w-full mx-auto rounded-lg border-2 border-ink" />
          ) : (
            <span className="text-ink-muted text-sm font-semibold">Klicken zum Hochladen — JPG, PNG, WebP</span>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
        {imagePreview && (
          <button
            onClick={() => { setImagePreview(null); setImageBase64(null); }}
            className="btn-brutal-off px-3 py-1.5 text-xs font-bold mb-3"
          >
            Bild entfernen ✕
          </button>
        )}
        <label className="label-brutal" htmlFor="an-desc">Beschreibung</label>
        <textarea
          id="an-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Beschreibe das gewünschte Bild oder ergänze den Upload…"
          rows={3}
          className="input-brutal resize-y leading-relaxed"
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <section className="card-brutal p-4">
          <h3 className="label-brutal">Ziel-Modelle</h3>
          <div className="flex flex-col gap-2 items-start">
            {AI_SYSTEMS.map(ai => (
              <button
                key={ai}
                onClick={() => toggleAI(ai)}
                aria-pressed={selectedAIs.includes(ai)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.04em] font-display ${
                  selectedAIs.includes(ai) ? `btn-brutal ${MODEL_BG[ai]}` : "btn-brutal-off font-bold"
                }`}
              >
                {ai}
              </button>
            ))}
          </div>
        </section>
        <section className="card-brutal p-4">
          <label className="label-brutal" htmlFor="an-ar">Seitenverhältnis</label>
          <select id="an-ar" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className="input-brutal mb-3">
            {Object.entries(ASPECT_RATIOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className="label-brutal" htmlFor="an-style">Stil-Preset</label>
          <select id="an-style" value={stylePreset} onChange={e => setStylePreset(e.target.value)} className="input-brutal">
            {Object.keys(STYLE_OPTIONS).map(k => <option key={k} value={k}>{k || "Kein Preset"}</option>)}
          </select>
        </section>
        <section className="card-brutal p-4">
          <h3 className="label-brutal">Ausgabeformat</h3>
          <div className="flex gap-1.5">
            {(["JSON", "XML"] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setOutputFormat(fmt)}
                className={`tile-brutal ${outputFormat === fmt ? "tile-on" : ""}`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </section>
      </div>

      {error && (
        <div className="card-brutal bg-cat-farben p-3 mb-4 text-sm font-semibold text-ink">
          {error}
        </div>
      )}

      <button
        onClick={generate}
        disabled={loading}
        className="btn-brutal bg-action w-full py-3.5 font-display text-[13px] font-extrabold uppercase tracking-[0.05em] disabled:opacity-50"
      >
        {loading ? "Analysiere & generiere…" : "Prompts generieren →"}
      </button>

      {result && (
        <div className="mt-7">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em] mb-3">Generierte Prompts</h2>
          {selectedAIs.length > 1 && (
            <div className="mb-3"><AITabs selectedAIs={selectedAIs} activeTab={activeTab} onTabChange={setActiveTab} /></div>
          )}
          {result[activeTab] && <PromptPreview ai={activeTab} prompts={result} outputFormat={outputFormat} />}
          {selectedAIs.length > 1 && (
            <div className="mt-4 pt-3 border-t-2 border-dashed border-line-soft flex justify-between items-center">
              <span className="text-xs font-bold text-ink-soft">Alles exportieren</span>
              <CopyButton text={outputFormat === "JSON" ? JSON.stringify(result, null, 2) : toXML(result as Record<string, unknown>)} label="Alles kopieren" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

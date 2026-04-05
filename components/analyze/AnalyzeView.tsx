"use client";

import { useState, useRef } from "react";
import type { AISystem, AssembledPrompts } from "@/lib/types";
import { AI_SYSTEMS, STYLE_OPTIONS, ASPECT_RATIOS } from "@/lib/constants";
import { AITabs } from "@/components/shared/AITabs";
import { PromptPreview } from "@/components/shared/PromptPreview";
import { CopyButton } from "@/components/shared/CopyButton";
import { toXML } from "@/lib/xml-export";

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

  const inputClass = "w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50";
  const labelClass = "text-xs font-semibold text-text-secondary block mb-1.5";

  return (
    <div>
      <div className="bg-bg-surface border border-border-default rounded-xl p-4 mb-3">
        <label className={labelClass}>Bild hochladen (optional)</label>
        <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-border-accent rounded-xl p-6 text-center cursor-pointer bg-bg-elevated hover:border-mj/30 transition-colors mb-3">
          {imagePreview ? (
            <img src={imagePreview} alt="preview" className="max-h-44 max-w-full mx-auto rounded-lg" />
          ) : (
            <span className="text-text-muted text-sm">Klicken zum Hochladen - JPG, PNG, WebP</span>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
        {imagePreview && (
          <button onClick={() => { setImagePreview(null); setImageBase64(null); }} className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 cursor-pointer mb-3">Bild entfernen</button>
        )}
        <label className={labelClass}>Beschreibung</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Beschreibe das gewünschte Bild oder ergänze den Upload..." rows={3} className={`${inputClass} resize-y leading-relaxed`} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-bg-surface border border-border-default rounded-xl p-3">
          <label className={labelClass}>Ziel-KIs</label>
          {AI_SYSTEMS.map(ai => (
            <label key={ai} className="flex items-center gap-2 mb-1.5 cursor-pointer text-xs text-text-primary">
              <input type="checkbox" checked={selectedAIs.includes(ai)} onChange={() => toggleAI(ai)} className="accent-mj" />
              {ai}
            </label>
          ))}
        </div>
        <div className="bg-bg-surface border border-border-default rounded-xl p-3">
          <label className={labelClass}>Seitenverhältnis</label>
          <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} className={inputClass}>
            {Object.entries(ASPECT_RATIOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <label className={`${labelClass} mt-2.5`}>Stil-Preset</label>
          <select value={stylePreset} onChange={e => setStylePreset(e.target.value)} className={inputClass}>
            {Object.keys(STYLE_OPTIONS).map(k => <option key={k} value={k}>{k || "Kein Preset"}</option>)}
          </select>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-xl p-3">
          <label className={labelClass}>Format</label>
          {(["JSON", "XML"] as const).map(fmt => (
            <label key={fmt} className="flex items-center gap-2 mb-1.5 cursor-pointer text-xs text-text-primary">
              <input type="radio" name="afmt" value={fmt} checked={outputFormat === fmt} onChange={() => setOutputFormat(fmt)} className="accent-mj" />
              {fmt}
            </label>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3 text-sm text-red-400">{error}</div>}

      <button onClick={generate} disabled={loading} className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-mj to-nb hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
        {loading ? "Analysiere & generiere..." : "Prompts generieren"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-base font-bold mb-3">Generierte Prompts</h2>
          {selectedAIs.length > 1 && (
            <div className="mb-3"><AITabs selectedAIs={selectedAIs} activeTab={activeTab} onTabChange={setActiveTab} /></div>
          )}
          {result[activeTab] && <PromptPreview ai={activeTab} prompts={result} outputFormat={outputFormat} />}
          {selectedAIs.length > 1 && (
            <div className="mt-3 pt-3 border-t border-border-default border-dashed flex justify-between items-center">
              <span className="text-xs font-semibold text-text-secondary">Alles exportieren</span>
              <CopyButton text={outputFormat === "JSON" ? JSON.stringify(result, null, 2) : toXML(result as Record<string, unknown>)} label="Alles kopieren" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

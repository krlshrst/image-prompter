"use client";

import { useState } from "react";
import type { PromptFormState } from "@/lib/types";
import { USE_CASE_TEMPLATES, STYLE_OPTIONS, ASPECT_RATIOS, CAMERA_OPTIONS, LIGHTING_OPTIONS, AI_SYSTEMS, QUALITY_TAGS_NB } from "@/lib/constants";

interface InputPanelProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  applyTemplate: (name: string) => void;
  toggleAI: (ai: PromptFormState["selectedAIs"][number]) => void;
  toggleQualityTag: (tag: string) => void;
  handleStyleSelect: (val: string) => void;
  reset: () => void;
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-bg-surface border border-border-default rounded-lg mb-2">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-3 cursor-pointer">
        <span className="text-[13px] font-semibold text-text-secondary">{title}</span>
        <span className={`text-mj text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

const inputClass = "w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50";
const labelClass = "text-xs font-semibold text-text-secondary block mb-1";

export function InputPanel({ formState, setField, applyTemplate, toggleAI, toggleQualityTag, handleStyleSelect, reset }: InputPanelProps) {
  const [showMJParams, setShowMJParams] = useState(false);

  return (
    <div className="overflow-y-auto h-full p-4">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] text-text-muted uppercase tracking-wider">Eingabe</span>
        <button onClick={reset} className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer">Zurücksetzen</button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.keys(USE_CASE_TEMPLATES).map(name => (
          <button key={name} onClick={() => applyTemplate(name)} className="px-2 py-1 rounded-md text-[10px] font-medium bg-bg-elevated text-text-muted hover:text-text-secondary cursor-pointer transition-colors">{name}</button>
        ))}
      </div>

      <Section title="Motiv & Handlung" defaultOpen>
        <div className="mb-2">
          <label className={labelClass}>Hauptmotiv *</label>
          <input value={formState.subject} onChange={e => setField("subject", e.target.value)} className={inputClass} placeholder="z.B. eine Architektin Mitte 30..." />
        </div>
        <div>
          <label className={labelClass}>Aktion</label>
          <input value={formState.action} onChange={e => setField("action", e.target.value)} className={inputClass} placeholder="z.B. schaut auf Architekturpläne" />
        </div>
      </Section>

      <Section title="Stil & Atmosphäre">
        <div className="mb-2">
          <label className={labelClass}>Stil-Preset</label>
          <select value={formState.style_select} onChange={e => handleStyleSelect(e.target.value)} className={inputClass}>
            {Object.keys(STYLE_OPTIONS).map(k => <option key={k} value={k}>{k || "— Stil auswählen —"}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className={labelClass}>Stil-Beschreibung</label>
          <textarea value={formState.style_text} onChange={e => setField("style_text", e.target.value)} rows={2} className={`${inputClass} resize-y leading-relaxed`} placeholder="Frei editierbar..." />
        </div>
        <div className="mb-2">
          <label className={labelClass}>Szene</label>
          <input value={formState.scene} onChange={e => setField("scene", e.target.value)} className={inputClass} placeholder="Umgebung, Ort, Kontext" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Stimmung</label>
            <input value={formState.mood} onChange={e => setField("mood", e.target.value)} className={inputClass} placeholder="z.B. ruhig" />
          </div>
          <div>
            <label className={labelClass}>Seitenverhältnis</label>
            <select value={formState.ar} onChange={e => setField("ar", e.target.value)} className={inputClass}>
              {Object.entries(ASPECT_RATIOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </Section>

      <Section title="Kamera & Licht">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className={labelClass}>Komposition</label>
            <select value={formState.camera} onChange={e => setField("camera", e.target.value)} className={inputClass}>
              <option value="">— auswählen —</option>
              {CAMERA_OPTIONS.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Objektiv</label>
            <input value={formState.lens} onChange={e => setField("lens", e.target.value)} className={inputClass} placeholder="z.B. 85mm" />
          </div>
        </div>
        <div className="mb-2">
          <label className={labelClass}>Beleuchtung</label>
          <select value={formState.lighting} onChange={e => setField("lighting", e.target.value)} className={inputClass}>
            <option value="">— auswählen —</option>
            {LIGHTING_OPTIONS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className={labelClass}>Farben (verbal)</label>
            <input value={formState.colors_verbal} onChange={e => setField("colors_verbal", e.target.value)} className={inputClass} placeholder="Für MJ" />
          </div>
          <div>
            <label className={labelClass}>Hex-Codes</label>
            <input value={formState.colors_hex} onChange={e => setField("colors_hex", e.target.value)} className={inputClass} placeholder="Für NB" />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <div>
            <label className={labelClass}>Text im Bild</label>
            <input value={formState.text_in_image} onChange={e => setField("text_in_image", e.target.value)} className={inputClass} placeholder='z.B. "Sale 2025"' />
          </div>
          <div>
            <label className={labelClass}>Typografie</label>
            <input value={formState.text_style} onChange={e => setField("text_style", e.target.value)} className={inputClass} placeholder="Stil" />
          </div>
        </div>
      </Section>

      <Section title="KI-Parameter">
        <div className="flex gap-3 mb-3 flex-wrap">
          {AI_SYSTEMS.map(ai => (
            <label key={ai} className="flex items-center gap-1.5 cursor-pointer text-xs text-text-primary">
              <input type="checkbox" checked={formState.selectedAIs.includes(ai)} onChange={() => toggleAI(ai)} className="accent-mj w-3.5 h-3.5" />
              {ai}
            </label>
          ))}
        </div>

        {formState.selectedAIs.includes("Midjourney") && (
          <div className="bg-mj/5 border border-mj/20 rounded-md p-2.5 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-text-muted">MJ V7</span>
              <button onClick={() => setShowMJParams(!showMJParams)} className="text-mj text-[10px] cursor-pointer">{showMJParams ? "−" : "+"}</button>
            </div>
            {showMJParams && (
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Version</label>
                  <select value={formState.mj_version} onChange={e => setField("mj_version", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none">
                    <option value="7">V7</option><option value="6.1">V6.1</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Stylize</label>
                  <input type="number" min="0" max="1000" value={formState.mj_stylize} onChange={e => setField("mj_stylize", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none" placeholder="100" />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Quality</label>
                  <select value={formState.mj_quality} onChange={e => setField("mj_quality", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none">
                    <option value="1">1</option><option value="2">2</option><option value="0.25">0.25</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Chaos</label>
                  <input type="number" min="0" max="100" value={formState.mj_chaos} onChange={e => setField("mj_chaos", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Weird</label>
                  <input type="number" min="0" max="3000" value={formState.mj_weird} onChange={e => setField("mj_weird", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none" placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-0.5">Seed</label>
                  <input type="number" value={formState.mj_seed} onChange={e => setField("mj_seed", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded px-1.5 py-1 text-[11px] text-text-primary focus:outline-none" placeholder="—" />
                </div>
                <div className="col-span-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-text-secondary">
                    <input type="checkbox" checked={formState.mj_style_raw} onChange={e => setField("mj_style_raw", e.target.checked)} className="accent-mj" />
                    --style raw
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {formState.selectedAIs.includes("Flux") && (
          <div className="bg-flux/5 border border-flux/20 rounded-md p-2.5 mb-2">
            <span className="text-[11px] font-semibold text-text-muted block mb-1">Flux 2 Pro</span>
            <p className="text-[10px] text-text-muted leading-snug">
              Versteht natürliche Sprache, <strong className="text-text-secondary">Hex-Farbwerte</strong> (Farbpalette → Hex) und rendert <strong className="text-text-secondary">Text im Bild</strong> (Text-Feld) zuverlässig. Auflösung bis ~4 MP.
            </p>
          </div>
        )}

        {formState.selectedAIs.includes("Nano Banana Pro") && (
          <div className="bg-nb/5 border border-nb/20 rounded-md p-2.5 mb-2">
            <span className="text-[11px] font-semibold text-text-muted block mb-1.5">NB Qualität</span>
            <div className="flex flex-wrap gap-1">
              {QUALITY_TAGS_NB.map(tag => (
                <button key={tag} onClick={() => toggleQualityTag(tag)} className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${formState.nb_quality_tags.includes(tag) ? "bg-nb text-white" : "bg-bg-elevated text-text-muted"}`}>{tag}</button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Negativ (MJ/Flux)</label>
            <input value={formState.negative} onChange={e => setField("negative", e.target.value)} className={inputClass} placeholder="text, watermark..." />
          </div>
          <div>
            <label className={labelClass}>Positiv (NB)</label>
            <input value={formState.negative_positive} onChange={e => setField("negative_positive", e.target.value)} className={inputClass} placeholder="klare Ästhetik..." />
          </div>
        </div>
      </Section>
    </div>
  );
}

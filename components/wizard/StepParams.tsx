"use client";

import { useState } from "react";
import type { PromptFormState } from "@/lib/types";
import { AI_SYSTEMS, QUALITY_TAGS_NB } from "@/lib/constants";

interface StepParamsProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  toggleAI: (ai: PromptFormState["selectedAIs"][number]) => void;
  toggleQualityTag: (tag: string) => void;
}

export function StepParams({ formState, setField, toggleAI, toggleQualityTag }: StepParamsProps) {
  const [showMJParams, setShowMJParams] = useState(false);

  return (
    <div>
      <div className="text-xs text-mj uppercase tracking-[2px] mb-2">Schritt 4</div>
      <h2 className="text-2xl font-bold text-white mb-1">KI-Parameter & Export</h2>
      <p className="text-sm text-text-muted mb-6">Wähle Ziel-KIs und feinere Einstellungen</p>

      <div className="flex gap-4 mb-4 flex-wrap">
        {AI_SYSTEMS.map(ai => (
          <label key={ai} className="flex items-center gap-2 cursor-pointer text-sm text-text-primary">
            <input type="checkbox" checked={formState.selectedAIs.includes(ai)} onChange={() => toggleAI(ai)} className="accent-mj w-4 h-4" />
            {ai}
            <span className="text-[10px] text-text-muted">{ai === "Midjourney" ? "V7" : ai === "Nano Banana Pro" ? "Gemini" : ai === "Flux" ? "2 Pro · Hex & Text" : ""}</span>
          </label>
        ))}
      </div>

      {formState.selectedAIs.includes("Midjourney") && (
        <div className="bg-mj/5 border border-mj/20 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-text-secondary">Midjourney V7 Parameter</span>
            <button onClick={() => setShowMJParams(!showMJParams)} className="text-mj text-[11px] font-medium cursor-pointer">{showMJParams ? "Einklappen" : "Ausklappen"}</button>
          </div>
          {showMJParams && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Version</label>
                <select value={formState.mj_version} onChange={e => setField("mj_version", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none">
                  <option value="7">V7 (Standard)</option><option value="6.1">V6.1</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Stylize (0-1000)</label>
                <input type="number" min="0" max="1000" value={formState.mj_stylize} onChange={e => setField("mj_stylize", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none" placeholder="100" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Quality</label>
                <select value={formState.mj_quality} onChange={e => setField("mj_quality", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none">
                  <option value="1">1 (Standard)</option><option value="2">2 (Feiner)</option><option value="0.25">0.25 (Schnell)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Chaos (0-100)</label>
                <input type="number" min="0" max="100" value={formState.mj_chaos} onChange={e => setField("mj_chaos", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none" placeholder="0" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Weird (0-3000)</label>
                <input type="number" min="0" max="3000" value={formState.mj_weird} onChange={e => setField("mj_weird", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none" placeholder="0" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-text-muted block mb-1">Seed</label>
                <input type="number" value={formState.mj_seed} onChange={e => setField("mj_seed", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-md px-2 py-1.5 text-xs text-text-primary focus:outline-none" placeholder="Zufällig" />
              </div>
              <div className="col-span-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary">
                  <input type="checkbox" checked={formState.mj_style_raw} onChange={e => setField("mj_style_raw", e.target.checked)} className="accent-mj" />
                  --style raw (empfohlen für Fotorealismus)
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {formState.selectedAIs.includes("Nano Banana Pro") && (
        <div className="bg-nb/5 border border-nb/20 rounded-lg p-3 mb-3">
          <span className="text-xs font-semibold text-text-secondary block mb-2">Nano Banana – Qualitäts-Booster</span>
          <div className="flex flex-wrap gap-1.5">
            {QUALITY_TAGS_NB.map(tag => (
              <button key={tag} onClick={() => toggleQualityTag(tag)} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-colors ${formState.nb_quality_tags.includes(tag) ? "bg-nb text-white" : "bg-bg-elevated text-text-muted hover:text-text-secondary"}`}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Negativ-Prompt (MJ & Flux)</label>
          <input value={formState.negative} onChange={e => setField("negative", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. text, watermark, blur" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Positiv (Nano Banana)</label>
          <input value={formState.negative_positive} onChange={e => setField("negative_positive", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. klare, sachliche Ästhetik" />
        </div>
      </div>
    </div>
  );
}

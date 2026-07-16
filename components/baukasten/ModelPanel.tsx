"use client";

import { useState } from "react";
import type { AISystem, PromptFormState } from "@/lib/types";
import { AI_SYSTEMS, QUALITY_TAGS_NB } from "@/lib/constants";

interface ModelPanelProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  toggleAI: (ai: AISystem) => void;
  toggleQualityTag: (tag: string) => void;
}

const MODEL_BG: Record<AISystem, string> = {
  "Midjourney": "bg-mj-pastel",
  "Flux": "bg-flux-pastel",
  "Nano Banana Pro": "bg-nb-pastel",
};

const MODEL_LABEL: Record<AISystem, string> = {
  "Midjourney": "Midjourney V7",
  "Flux": "Flux 2 Pro",
  "Nano Banana Pro": "Nano Banana Pro",
};

const smallInput = "w-full input-brutal !px-2 !py-1 !text-[12px]";

export function ModelPanel({ formState, setField, toggleAI, toggleQualityTag }: ModelPanelProps) {
  const [showMJParams, setShowMJParams] = useState(false);
  const mjActive = formState.selectedAIs.includes("Midjourney");
  const fluxActive = formState.selectedAIs.includes("Flux");
  const nbActive = formState.selectedAIs.includes("Nano Banana Pro");

  return (
    <section className="card-brutal p-4 mb-5">
      <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.12em] mb-3">
        Modelle
      </h3>
      <div className="flex flex-wrap gap-2.5 mb-1">
        {AI_SYSTEMS.map(ai => {
          const active = formState.selectedAIs.includes(ai);
          return (
            <button
              key={ai}
              onClick={() => toggleAI(ai)}
              aria-pressed={active}
              className={`px-4 py-2 text-xs uppercase tracking-[0.04em] font-display ${
                active ? `btn-brutal ${MODEL_BG[ai]}` : "btn-brutal-off font-bold"
              }`}
            >
              {MODEL_LABEL[ai]}
            </button>
          );
        })}
      </div>

      {mjActive && (
        <div className="mt-3 border-2 border-ink rounded-lg bg-mj-pastel/40 p-3">
          <div className="flex justify-between items-center">
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
              Midjourney-Parameter
            </span>
            <button
              onClick={() => setShowMJParams(!showMJParams)}
              className="text-[11px] font-bold underline underline-offset-2 cursor-pointer"
            >
              {showMJParams ? "Einklappen" : "Anpassen"}
            </button>
          </div>
          {showMJParams && (
            <div className="grid grid-cols-3 gap-2 mt-2.5">
              <div>
                <label className="label-brutal" htmlFor="mj-version">Version</label>
                <select id="mj-version" value={formState.mj_version} onChange={e => setField("mj_version", e.target.value)} className={smallInput}>
                  <option value="7">V7</option><option value="6.1">V6.1</option>
                </select>
              </div>
              <div>
                <label className="label-brutal" htmlFor="mj-stylize">Stylize</label>
                <input id="mj-stylize" type="number" min="0" max="1000" value={formState.mj_stylize} onChange={e => setField("mj_stylize", e.target.value)} className={smallInput} placeholder="100" />
              </div>
              <div>
                <label className="label-brutal" htmlFor="mj-quality">Quality</label>
                <select id="mj-quality" value={formState.mj_quality} onChange={e => setField("mj_quality", e.target.value)} className={smallInput}>
                  <option value="1">1</option><option value="2">2</option><option value="0.25">0.25</option>
                </select>
              </div>
              <div>
                <label className="label-brutal" htmlFor="mj-chaos">Chaos</label>
                <input id="mj-chaos" type="number" min="0" max="100" value={formState.mj_chaos} onChange={e => setField("mj_chaos", e.target.value)} className={smallInput} placeholder="0" />
              </div>
              <div>
                <label className="label-brutal" htmlFor="mj-weird">Weird</label>
                <input id="mj-weird" type="number" min="0" max="3000" value={formState.mj_weird} onChange={e => setField("mj_weird", e.target.value)} className={smallInput} placeholder="0" />
              </div>
              <div>
                <label className="label-brutal" htmlFor="mj-seed">Seed</label>
                <input id="mj-seed" type="number" value={formState.mj_seed} onChange={e => setField("mj_seed", e.target.value)} className={smallInput} placeholder="—" />
              </div>
              <label className="col-span-3 flex items-center gap-2 cursor-pointer text-[12px] font-semibold">
                <input type="checkbox" checked={formState.mj_style_raw} onChange={e => setField("mj_style_raw", e.target.checked)} className="accent-ink w-3.5 h-3.5" />
                --style raw
              </label>
            </div>
          )}
        </div>
      )}

      {fluxActive && (
        <div className="mt-3 border-2 border-ink rounded-lg bg-flux-pastel/40 p-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft block mb-1">
            Flux 2 Pro
          </span>
          <p className="text-[12px] text-ink-soft leading-snug">
            Versteht natürliche Sprache, <strong>Hex-Farbwerte</strong> (Karte „Farben &amp; Text“) und rendert <strong>Text im Bild</strong> zuverlässig. Auflösung bis ~4 MP.
          </p>
        </div>
      )}

      {nbActive && (
        <div className="mt-3 border-2 border-ink rounded-lg bg-nb-pastel/40 p-3">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft block mb-2">
            Nano-Banana-Qualität
          </span>
          <div className="flex flex-wrap gap-1.5">
            {QUALITY_TAGS_NB.map(tag => (
              <button
                key={tag}
                onClick={() => toggleQualityTag(tag)}
                className={`tile-brutal ${formState.nb_quality_tags.includes(tag) ? "tile-on" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

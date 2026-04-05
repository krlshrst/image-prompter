"use client";

import type { PromptFormState } from "@/lib/types";
import { STYLE_OPTIONS, ASPECT_RATIOS } from "@/lib/constants";

interface StepStyleProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  handleStyleSelect: (val: string) => void;
}

export function StepStyle({ formState, setField, handleStyleSelect }: StepStyleProps) {
  return (
    <div>
      <div className="text-xs text-mj uppercase tracking-[2px] mb-2">Schritt 2</div>
      <h2 className="text-2xl font-bold text-white mb-1">Stil & Atmosphäre</h2>
      <p className="text-sm text-text-muted mb-6">Definiere den visuellen Stil und die Stimmung</p>

      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Stil-Preset</label>
        <select value={formState.style_select} onChange={e => handleStyleSelect(e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-mj/50">
          {Object.keys(STYLE_OPTIONS).map(k => <option key={k} value={k}>{k || "— Stil auswählen oder frei eingeben —"}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Stil-Beschreibung (frei editierbar)</label>
        <textarea value={formState.style_text} onChange={e => setField("style_text", e.target.value)} rows={2} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50 resize-y leading-relaxed" placeholder="z.B. editorial photography, Vogue magazine spread, shot on Hasselblad" />
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Szene / Umgebung</label>
        <input value={formState.scene} onChange={e => setField("scene", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. minimalistisches Glasschreibtisch-Büro, Herbstnachmittag" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Stimmung</label>
          <input value={formState.mood} onChange={e => setField("mood", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. ruhig, professionell" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Seitenverhältnis</label>
          <select value={formState.ar} onChange={e => setField("ar", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-mj/50">
            {Object.entries(ASPECT_RATIOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

"use client";

import type { PromptFormState } from "@/lib/types";
import { CAMERA_OPTIONS, LIGHTING_OPTIONS } from "@/lib/constants";

interface StepCameraProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
}

export function StepCamera({ formState, setField }: StepCameraProps) {
  return (
    <div>
      <div className="text-xs text-mj uppercase tracking-[2px] mb-2">Schritt 3</div>
      <h2 className="text-2xl font-bold text-white mb-1">Kamera & Technik</h2>
      <p className="text-sm text-text-muted mb-6">Komposition, Beleuchtung und Farben</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Komposition / Kamera</label>
          <select value={formState.camera} onChange={e => setField("camera", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-mj/50">
            <option value="">— auswählen —</option>
            {CAMERA_OPTIONS.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Objektiv</label>
          <input value={formState.lens} onChange={e => setField("lens", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. 85mm, Canon R5" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Beleuchtung</label>
        <select value={formState.lighting} onChange={e => setField("lighting", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-mj/50">
          <option value="">— auswählen —</option>
          {LIGHTING_OPTIONS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Farben (verbal, für MJ)</label>
          <input value={formState.colors_verbal} onChange={e => setField("colors_verbal", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. muted Scandinavian palette" />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Hex-Codes (für Nano Banana)</label>
          <input value={formState.colors_hex} onChange={e => setField("colors_hex", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. #1E3A5F, #C9A84C" />
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Text im Bild</label>
          <input value={formState.text_in_image} onChange={e => setField("text_in_image", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder='z.B. "Neue Kollektion 2025"' />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Typografie-Stil</label>
          <input value={formState.text_style} onChange={e => setField("text_style", e.target.value)} className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50" placeholder="z.B. weiße Majuskeln" />
        </div>
      </div>
    </div>
  );
}

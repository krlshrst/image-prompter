"use client";

import type { PromptFormState } from "@/lib/types";
import { USE_CASE_TEMPLATES } from "@/lib/constants";

interface StepTemplateProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  applyTemplate: (name: string) => void;
}

const TEMPLATE_ICONS: Record<string, string> = {
  "Instagram Lifestyle": "📸",
  "Instagram Produkt": "🛍️",
  "LinkedIn Banner": "💼",
  "Story / Reels": "📱",
  "YouTube Thumbnail": "🎬",
  "Website Hero": "🌐",
  "Pinterest": "📌",
  "Event / Kampagne": "✨",
};

export function StepTemplate({ formState, setField, applyTemplate }: StepTemplateProps) {
  return (
    <div>
      <div className="text-xs text-mj uppercase tracking-[2px] mb-2">Schritt 1</div>
      <h2 className="text-2xl font-bold text-white mb-1">Was willst du erstellen?</h2>
      <p className="text-sm text-text-muted mb-6">Wähle eine Vorlage oder beschreibe dein Motiv frei</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {Object.keys(USE_CASE_TEMPLATES).map(name => (
          <button
            key={name}
            onClick={() => applyTemplate(name)}
            className="bg-bg-surface border border-border-accent rounded-xl p-3.5 text-center cursor-pointer hover:border-mj/50 hover:shadow-[0_0_20px_rgba(124,108,255,0.1)] transition-all"
          >
            <div className="text-xl mb-1.5">{TEMPLATE_ICONS[name] || "🎨"}</div>
            <div className="text-xs font-semibold text-text-secondary">{name}</div>
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Hauptmotiv *</label>
        <input
          value={formState.subject}
          onChange={e => setField("subject", e.target.value)}
          className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50"
          placeholder="z.B. eine Architektin Mitte 30 in weißem Blazer, Bauplan in der Hand"
        />
        <p className="text-[11px] text-text-muted mt-1">So präzise wie möglich beschreiben.</p>
      </div>

      <div>
        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Aktion (optional)</label>
        <input
          value={formState.action}
          onChange={e => setField("action", e.target.value)}
          className="w-full bg-bg-elevated border border-border-accent rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-mj/50"
          placeholder="z.B. schaut konzentriert auf Architekturpläne"
        />
      </div>
    </div>
  );
}

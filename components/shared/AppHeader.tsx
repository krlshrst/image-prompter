"use client";

import type { AppMode } from "@/lib/types";

interface AppHeaderProps {
  appMode: AppMode;
  onAppModeChange: (mode: AppMode) => void;
}

export function AppHeader({ appMode, onAppModeChange }: AppHeaderProps) {
  return (
    <header className="mb-7 flex items-center gap-4 flex-wrap">
      <div className="bg-ink text-paper font-display font-bold text-sm uppercase tracking-[0.06em] px-4 py-2 rounded-md -rotate-1 shadow-[3px_3px_0_var(--color-line-soft)]">
        Prompt-Baukasten
      </div>
      <p className="text-xs text-ink-muted font-semibold">
        Midjourney V7 · Flux 2 Pro · Nano Banana Pro
      </p>
      <nav aria-label="Modus" className="ml-auto flex gap-2.5">
        {([
          { key: "builder" as const, label: "Bauen" },
          { key: "analyze" as const, label: "Analysieren" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => onAppModeChange(tab.key)}
            className={`px-4 py-2 text-xs uppercase tracking-[0.05em] font-display ${
              appMode === tab.key ? "btn-brutal bg-card" : "btn-brutal-off font-bold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

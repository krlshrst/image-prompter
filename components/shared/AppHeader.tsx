"use client";

import type { AppMode, BuilderMode } from "@/lib/types";
import { ModeToggle } from "./ModeToggle";

interface AppHeaderProps {
  appMode: AppMode;
  builderMode: BuilderMode;
  onAppModeChange: (mode: AppMode) => void;
  onBuilderModeChange: (mode: BuilderMode) => void;
}

export function AppHeader({ appMode, builderMode, onAppModeChange, onBuilderModeChange }: AppHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Image Prompt Generator</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Optimierte Prompts für Midjourney V7, Flux & Nano Banana Pro
          </p>
        </div>
        {appMode === "builder" && (
          <ModeToggle mode={builderMode} onChange={onBuilderModeChange} />
        )}
      </div>

      <div className="flex gap-0 rounded-lg overflow-hidden border border-border-default">
        {([
          { key: "builder" as const, label: "Prompt Builder" },
          { key: "analyze" as const, label: "Bildanalyse" },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => onAppModeChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${
              appMode === tab.key
                ? "bg-mj text-white font-semibold"
                : "bg-bg-surface text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}

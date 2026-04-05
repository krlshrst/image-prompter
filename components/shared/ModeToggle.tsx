"use client";

import type { BuilderMode } from "@/lib/types";

interface ModeToggleProps {
  mode: BuilderMode;
  onChange: (mode: BuilderMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="bg-bg-elevated rounded-lg p-0.5 flex gap-0.5 text-xs">
      <button
        onClick={() => onChange("wizard")}
        className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
          mode === "wizard" ? "bg-mj text-white" : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Wizard
      </button>
      <button
        onClick={() => onChange("dashboard")}
        className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
          mode === "dashboard" ? "bg-mj text-white" : "text-text-muted hover:text-text-secondary"
        }`}
      >
        Dashboard
      </button>
    </div>
  );
}

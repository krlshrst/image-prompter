"use client";

import type { AISystem } from "@/lib/types";

interface AITabsProps {
  selectedAIs: AISystem[];
  activeTab: AISystem;
  onTabChange: (ai: AISystem) => void;
}

const TAB_COLORS: Record<AISystem, string> = {
  "Midjourney": "bg-mj text-white",
  "Flux": "bg-flux text-white",
  "Nano Banana Pro": "bg-nb text-white",
};

const TAB_LABELS: Record<AISystem, string> = {
  "Midjourney": "Midjourney",
  "Flux": "Flux",
  "Nano Banana Pro": "Nano Banana",
};

export function AITabs({ selectedAIs, activeTab, onTabChange }: AITabsProps) {
  return (
    <div className="flex gap-0 rounded-lg overflow-hidden border border-border-default">
      {selectedAIs.map(ai => (
        <button
          key={ai}
          onClick={() => onTabChange(ai)}
          className={`flex-1 text-center py-2 px-3 text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === ai ? TAB_COLORS[ai] : "bg-bg-surface text-text-muted hover:text-text-secondary"
          }`}
        >
          {TAB_LABELS[ai]}
        </button>
      ))}
    </div>
  );
}

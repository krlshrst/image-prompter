"use client";

import type { AISystem } from "@/lib/types";

interface AITabsProps {
  selectedAIs: AISystem[];
  activeTab: AISystem;
  onTabChange: (ai: AISystem) => void;
}

const TAB_ON: Record<AISystem, string> = {
  "Midjourney": "bg-mj-pastel",
  "Flux": "bg-flux-pastel",
  "Nano Banana Pro": "bg-nb-pastel",
  "GPT Image 2": "bg-gpt-pastel",
};

const TAB_LABELS: Record<AISystem, string> = {
  "Midjourney": "Midjourney",
  "Flux": "Flux",
  "Nano Banana Pro": "Nano Banana",
  "GPT Image 2": "GPT Image 2",
};

export function AITabs({ selectedAIs, activeTab, onTabChange }: AITabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {selectedAIs.map(ai => (
        <button
          key={ai}
          onClick={() => onTabChange(ai)}
          className={`px-4 py-1.5 text-xs uppercase tracking-wide font-display ${
            activeTab === ai ? `btn-brutal ${TAB_ON[ai]}` : "btn-brutal-off font-semibold"
          }`}
        >
          {TAB_LABELS[ai]}
        </button>
      ))}
    </div>
  );
}

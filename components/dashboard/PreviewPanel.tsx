"use client";

import { useState } from "react";
import type { PromptFormState, AssembledPrompts, AISystem } from "@/lib/types";
import { AITabs } from "@/components/shared/AITabs";
import { PromptPreview } from "@/components/shared/PromptPreview";
import { CopyButton } from "@/components/shared/CopyButton";
import { toXML } from "@/lib/xml-export";

interface PreviewPanelProps {
  formState: PromptFormState;
  assembled: AssembledPrompts;
  hasContent: boolean;
  onSave?: () => void;
}

export function PreviewPanel({ formState, assembled, hasContent, onSave }: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<AISystem>(formState.selectedAIs[0] || "Midjourney");
  const [outputFormat, setOutputFormat] = useState<"JSON" | "XML">("JSON");

  if (!hasContent) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm">
        <p>Fülle die Felder links aus, um eine Live-Vorschau zu sehen.</p>
      </div>
    );
  }

  const allExport = outputFormat === "JSON"
    ? JSON.stringify(assembled, null, 2)
    : toXML(assembled as Record<string, unknown>);

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] text-text-muted uppercase tracking-wider">Live Preview</span>
        <div className="flex gap-1">
          {(["JSON", "XML"] as const).map(fmt => (
            <button key={fmt} onClick={() => setOutputFormat(fmt)} className={`px-2 py-1 rounded text-[10px] font-medium cursor-pointer transition-colors ${outputFormat === fmt ? "bg-mj text-white" : "bg-bg-elevated text-text-muted"}`}>{fmt}</button>
          ))}
        </div>
      </div>

      {formState.selectedAIs.length > 1 && (
        <div className="mb-3">
          <AITabs selectedAIs={formState.selectedAIs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {assembled[activeTab] && (
        <PromptPreview ai={activeTab} prompts={assembled} outputFormat={outputFormat} />
      )}

      {formState.selectedAIs.length > 1 && (
        <div className="mt-4 pt-3 border-t border-border-default border-dashed">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-text-secondary">Alles exportieren</span>
            <CopyButton text={allExport} label="Alles kopieren" />
          </div>
        </div>
      )}

      {onSave && hasContent && (
        <div className="mt-3">
          <button onClick={onSave} className="w-full py-2 rounded-lg text-xs font-semibold text-mj bg-mj/10 hover:bg-mj/20 cursor-pointer transition-colors">
            In History speichern
          </button>
        </div>
      )}
    </div>
  );
}

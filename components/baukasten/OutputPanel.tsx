"use client";

import { useState } from "react";
import type { AISystem, AssembledPrompts, PromptFormState } from "@/lib/types";
import { AITabs } from "@/components/shared/AITabs";
import { PromptPreview } from "@/components/shared/PromptPreview";
import { CopyButton } from "@/components/shared/CopyButton";
import { copyToClipboard } from "@/lib/clipboard";
import { toXML } from "@/lib/xml-export";

interface OutputPanelProps {
  formState: PromptFormState;
  assembled: AssembledPrompts;
  hasContent: boolean;
  onSave?: () => void;
}

function getActivePrompt(ai: AISystem, assembled: AssembledPrompts): string {
  const data = assembled[ai];
  if (!data) return "";
  if ("full_command" in data) return data.full_command || "";
  if ("full_prompt" in data) return data.full_prompt || "";
  if ("prompt" in data) return data.prompt || "";
  return "";
}

export function OutputPanel({ formState, assembled, hasContent, onSave }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<AISystem>(formState.selectedAIs[0] || "Midjourney");
  const [outputFormat, setOutputFormat] = useState<"JSON" | "XML">("JSON");
  const [copied, setCopied] = useState(false);

  if (!hasContent) {
    return (
      <section className="border-2 border-dashed border-line-soft rounded-xl p-6 text-center text-sm text-ink-muted">
        Sobald Bausteine da sind, erscheint hier dein fertiger Prompt.
      </section>
    );
  }

  const shownTab: AISystem = formState.selectedAIs.includes(activeTab)
    ? activeTab
    : (formState.selectedAIs[0] || "Midjourney");

  const allExport = outputFormat === "JSON"
    ? JSON.stringify(assembled, null, 2)
    : toXML(assembled as Record<string, unknown>);

  async function copyActive() {
    const ok = await copyToClipboard(getActivePrompt(shownTab, assembled));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section aria-label="Ergebnis">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.12em]">Ergebnis</h2>
        <div className="flex gap-1.5">
          {(["JSON", "XML"] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              className={`tile-brutal ${outputFormat === fmt ? "tile-on" : ""}`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {formState.selectedAIs.length > 1 && (
        <div className="mb-3">
          <AITabs selectedAIs={formState.selectedAIs} activeTab={shownTab} onTabChange={setActiveTab} />
        </div>
      )}

      {assembled[shownTab] && (
        <PromptPreview ai={shownTab} prompts={assembled} outputFormat={outputFormat} />
      )}

      <div className="flex items-center gap-3 flex-wrap mt-4">
        <button
          onClick={copyActive}
          className="btn-brutal bg-action px-6 py-3 font-display text-[13px] font-extrabold uppercase tracking-[0.05em]"
        >
          {copied ? "Kopiert ✓" : "Prompt kopieren →"}
        </button>
        {formState.selectedAIs.length > 1 && (
          <CopyButton text={allExport} label={`Alle Modelle (${outputFormat})`} />
        )}
        {onSave && (
          <button
            onClick={onSave}
            className="btn-brutal-off px-4 py-2.5 text-xs font-bold"
          >
            In Verlauf speichern
          </button>
        )}
      </div>
    </section>
  );
}

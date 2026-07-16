"use client";

import type { AISystem, AssembledPrompts } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { toXML } from "@/lib/xml-export";

interface PromptPreviewProps {
  ai: AISystem;
  prompts: AssembledPrompts;
  outputFormat: "JSON" | "XML";
}

function getFullPrompt(ai: AISystem, prompts: AssembledPrompts): string | null {
  const data = prompts[ai];
  if (!data) return null;
  if (ai === "Midjourney" && "full_command" in data) return data.full_command || null;
  if (ai === "Nano Banana Pro" && "full_prompt" in data) return data.full_prompt || null;
  if ((ai === "Flux" || ai === "GPT Image 2") && "prompt" in data) return data.prompt || null;
  return null;
}

const PROMPT_LABEL: Record<AISystem, string> = {
  "Midjourney": "/imagine",
  "Flux": "Prompt",
  "Nano Banana Pro": "Prompt",
  "GPT Image 2": "Prompt",
};

const CARD_BG: Record<AISystem, string> = {
  "Midjourney": "bg-mj-pastel",
  "Flux": "bg-flux-pastel",
  "Nano Banana Pro": "bg-nb-pastel",
  "GPT Image 2": "bg-gpt-pastel",
};

export function PromptPreview({ ai, prompts, outputFormat }: PromptPreviewProps) {
  const fullPrompt = getFullPrompt(ai, prompts);
  const data = prompts[ai];
  if (!data) return null;

  const paramStr = outputFormat === "JSON"
    ? JSON.stringify({ [ai]: data }, null, 2)
    : toXML({ [ai]: data });

  return (
    <div className="mb-3">
      {fullPrompt && (
        <div className={`card-brutal p-4 mb-3 ${CARD_BG[ai]}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
              {PROMPT_LABEL[ai]}
            </span>
            <CopyButton text={fullPrompt} label="Kopieren" />
          </div>
          <p className="text-sm leading-relaxed text-ink">{fullPrompt}</p>
        </div>
      )}

      <details>
        <summary className="cursor-pointer text-xs font-semibold text-ink-muted hover:text-ink">
          Alle Parameter ({outputFormat})
        </summary>
        <div className="flex justify-end mt-2 mb-1">
          <CopyButton text={paramStr} label={outputFormat} />
        </div>
        <pre className="card-brutal p-3 text-[11px] overflow-x-auto whitespace-pre-wrap break-words leading-relaxed text-ink-soft mt-1">
          {paramStr}
        </pre>
      </details>
    </div>
  );
}

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
  if (ai === "Flux" && "prompt" in data) return data.prompt || null;
  return null;
}

const PROMPT_LABEL: Record<AISystem, string> = {
  "Midjourney": "/imagine",
  "Flux": "Prompt",
  "Nano Banana Pro": "Prompt",
};

const BG_COLORS: Record<AISystem, string> = {
  "Midjourney": "bg-mj/5 border-mj/20",
  "Flux": "bg-flux/5 border-flux/20",
  "Nano Banana Pro": "bg-nb/5 border-nb/20",
};

const LABEL_COLORS: Record<AISystem, string> = {
  "Midjourney": "text-mj",
  "Flux": "text-flux",
  "Nano Banana Pro": "text-nb",
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
        <div className={`rounded-lg border p-3 mb-2 ${BG_COLORS[ai]}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[11px] font-semibold ${LABEL_COLORS[ai]}`}>
              {PROMPT_LABEL[ai]}
            </span>
            <CopyButton text={fullPrompt} label="Kopieren" />
          </div>
          <p className="text-sm leading-relaxed text-text-primary">{fullPrompt}</p>
        </div>
      )}

      <details>
        <summary className="cursor-pointer text-xs text-text-muted hover:text-text-secondary">
          Alle Parameter ({outputFormat})
        </summary>
        <div className="flex justify-end mt-1 mb-1">
          <CopyButton text={paramStr} label={outputFormat} />
        </div>
        <pre className="bg-bg-elevated rounded-lg p-3 text-[11px] overflow-x-auto whitespace-pre-wrap break-words leading-relaxed text-text-primary mt-1">
          {paramStr}
        </pre>
      </details>
    </div>
  );
}

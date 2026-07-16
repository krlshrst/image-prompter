"use client";

import type { AISystem, AssembledPrompts, PromptFormState } from "@/lib/types";
import { USE_CASE_TEMPLATES } from "@/lib/constants";
import { PromptStrip } from "./PromptStrip";
import { InputCards } from "./InputCards";
import { ModelPanel } from "./ModelPanel";
import { OutputPanel } from "./OutputPanel";

interface BaukastenContainerProps {
  formState: PromptFormState;
  assembled: AssembledPrompts;
  hasContent: boolean;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  applyTemplate: (name: string) => void;
  toggleAI: (ai: AISystem) => void;
  toggleQualityTag: (tag: string) => void;
  handleStyleSelect: (val: string) => void;
  reset: () => void;
  onSave?: () => void;
}

export function BaukastenContainer(props: BaukastenContainerProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted mr-1.5">
          Vorlagen
        </span>
        {Object.keys(USE_CASE_TEMPLATES).map(name => (
          <button key={name} onClick={() => props.applyTemplate(name)} className="tile-brutal">
            {name}
          </button>
        ))}
      </div>

      <PromptStrip formState={props.formState} setField={props.setField} reset={props.reset} />

      <InputCards
        formState={props.formState}
        setField={props.setField}
        handleStyleSelect={props.handleStyleSelect}
      />

      <ModelPanel
        formState={props.formState}
        setField={props.setField}
        toggleAI={props.toggleAI}
        toggleQualityTag={props.toggleQualityTag}
      />

      <OutputPanel
        formState={props.formState}
        assembled={props.assembled}
        hasContent={props.hasContent}
        onSave={props.onSave}
      />
    </div>
  );
}

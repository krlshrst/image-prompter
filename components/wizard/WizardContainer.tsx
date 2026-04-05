"use client";

import { useState } from "react";
import type { PromptFormState, AssembledPrompts, AISystem } from "@/lib/types";
import { StepTemplate } from "./StepTemplate";
import { StepStyle } from "./StepStyle";
import { StepCamera } from "./StepCamera";
import { StepParams } from "./StepParams";
import { AITabs } from "@/components/shared/AITabs";
import { PromptPreview } from "@/components/shared/PromptPreview";

interface WizardContainerProps {
  formState: PromptFormState;
  assembled: AssembledPrompts;
  hasContent: boolean;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  applyTemplate: (name: string) => void;
  toggleAI: (ai: PromptFormState["selectedAIs"][number]) => void;
  toggleQualityTag: (tag: string) => void;
  handleStyleSelect: (val: string) => void;
  reset: () => void;
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

export function WizardContainer({
  formState, assembled, hasContent, setField, applyTemplate, toggleAI, toggleQualityTag, handleStyleSelect, reset, onComplete,
}: WizardContainerProps) {
  const [step, setStep] = useState(0);
  const [outputFormat, setOutputFormat] = useState<"JSON" | "XML">("JSON");
  const [activeTab, setActiveTab] = useState<AISystem>(formState.selectedAIs[0] || "Midjourney");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex gap-1 mb-8">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`flex-1 h-[3px] rounded-full transition-colors ${i <= step ? "bg-gradient-to-r from-mj to-nb" : "bg-bg-elevated"}`} />
        ))}
      </div>

      {step === 0 && <StepTemplate formState={formState} setField={setField} applyTemplate={applyTemplate} />}
      {step === 1 && <StepStyle formState={formState} setField={setField} handleStyleSelect={handleStyleSelect} />}
      {step === 2 && <StepCamera formState={formState} setField={setField} />}
      {step === 3 && <StepParams formState={formState} setField={setField} toggleAI={toggleAI} toggleQualityTag={toggleQualityTag} />}

      <div className="flex justify-between items-center mt-8">
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-secondary bg-bg-elevated hover:text-text-primary transition-colors cursor-pointer">Zurück</button>
          )}
          <button onClick={reset} className="px-4 py-2.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer">Zurücksetzen</button>
        </div>
        {step < TOTAL_STEPS - 1 ? (
          <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-mj to-mj-light hover:opacity-90 transition-opacity cursor-pointer">Weiter</button>
        ) : hasContent ? (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1 mr-2">
              {(["JSON", "XML"] as const).map(fmt => (
                <button key={fmt} onClick={() => setOutputFormat(fmt)} className={`px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${outputFormat === fmt ? "bg-mj text-white" : "bg-bg-elevated text-text-muted"}`}>{fmt}</button>
              ))}
            </div>
            <button onClick={onComplete} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-mj to-mj-light hover:opacity-90 transition-opacity cursor-pointer">Prompts anzeigen</button>
          </div>
        ) : null}
      </div>

      {step === TOTAL_STEPS - 1 && hasContent && (
        <div className="mt-8 pt-6 border-t border-border-default">
          <h3 className="text-sm font-bold text-text-primary mb-3">Vorschau</h3>
          {formState.selectedAIs.length > 1 && (
            <div className="mb-3"><AITabs selectedAIs={formState.selectedAIs} activeTab={activeTab} onTabChange={setActiveTab} /></div>
          )}
          {assembled[activeTab] && <PromptPreview ai={activeTab} prompts={assembled} outputFormat={outputFormat} />}
        </div>
      )}
    </div>
  );
}

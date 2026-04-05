"use client";

import type { PromptFormState, AssembledPrompts } from "@/lib/types";
import { InputPanel } from "./InputPanel";
import { PreviewPanel } from "./PreviewPanel";

interface DashboardContainerProps {
  formState: PromptFormState;
  assembled: AssembledPrompts;
  hasContent: boolean;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  applyTemplate: (name: string) => void;
  toggleAI: (ai: PromptFormState["selectedAIs"][number]) => void;
  toggleQualityTag: (tag: string) => void;
  handleStyleSelect: (val: string) => void;
  reset: () => void;
  onSave?: () => void;
}

export function DashboardContainer(props: DashboardContainerProps) {
  return (
    <div className="flex flex-col lg:flex-row border border-border-default rounded-xl overflow-hidden lg:h-[calc(100vh-180px)]">
      <div className="w-full lg:w-1/2 lg:border-r border-b lg:border-b-0 border-border-default">
        <InputPanel
          formState={props.formState}
          setField={props.setField}
          applyTemplate={props.applyTemplate}
          toggleAI={props.toggleAI}
          toggleQualityTag={props.toggleQualityTag}
          handleStyleSelect={props.handleStyleSelect}
          reset={props.reset}
        />
      </div>
      <div className="w-full lg:w-1/2 bg-bg-deep">
        <PreviewPanel
          formState={props.formState}
          assembled={props.assembled}
          hasContent={props.hasContent}
          onSave={props.onSave}
        />
      </div>
    </div>
  );
}

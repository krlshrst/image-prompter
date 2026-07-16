"use client";

import { useState } from "react";
import type { AppMode } from "@/lib/types";
import { AppHeader } from "@/components/shared/AppHeader";
import { BaukastenContainer } from "@/components/baukasten/BaukastenContainer";
import { AnalyzeView } from "@/components/analyze/AnalyzeView";
import { usePromptForm } from "@/hooks/usePromptForm";
import { useHistory } from "@/hooks/useHistory";

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>("builder");

  const {
    formState, assembled, hasContent,
    setField, applyTemplate, toggleAI, toggleQualityTag, handleStyleSelect, reset,
  } = usePromptForm();

  const { saveToHistory } = useHistory();

  function handleSave() {
    if (hasContent) saveToHistory(formState, assembled);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 pb-16">
      <AppHeader appMode={appMode} onAppModeChange={setAppMode} />

      {appMode === "builder" ? (
        <BaukastenContainer
          formState={formState}
          assembled={assembled}
          hasContent={hasContent}
          setField={setField}
          applyTemplate={applyTemplate}
          toggleAI={toggleAI}
          toggleQualityTag={toggleQualityTag}
          handleStyleSelect={handleStyleSelect}
          reset={reset}
          onSave={handleSave}
        />
      ) : (
        <AnalyzeView />
      )}
    </main>
  );
}

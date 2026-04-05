"use client";

import { useState, useEffect } from "react";
import type { AppMode, BuilderMode } from "@/lib/types";
import { AppHeader } from "@/components/shared/AppHeader";
import { WizardContainer } from "@/components/wizard/WizardContainer";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { AnalyzeView } from "@/components/analyze/AnalyzeView";
import { usePromptForm } from "@/hooks/usePromptForm";
import { useHistory } from "@/hooks/useHistory";

const MODE_KEY = "image-prompter-mode";

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>("builder");
  const [builderMode, setBuilderMode] = useState<BuilderMode>("wizard");

  const {
    formState, assembled, hasContent,
    setField, applyTemplate, toggleAI, toggleQualityTag, handleStyleSelect, reset,
  } = usePromptForm();

  const { saveToHistory } = useHistory();

  useEffect(() => {
    const saved = localStorage.getItem(MODE_KEY);
    if (saved === "wizard" || saved === "dashboard") setBuilderMode(saved);
  }, []);

  function handleBuilderModeChange(mode: BuilderMode) {
    setBuilderMode(mode);
    localStorage.setItem(MODE_KEY, mode);
  }

  function handleWizardComplete() {
    setBuilderMode("dashboard");
    localStorage.setItem(MODE_KEY, "dashboard");
  }

  function handleSave() {
    if (hasContent) saveToHistory(formState, assembled);
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <AppHeader
        appMode={appMode}
        builderMode={builderMode}
        onAppModeChange={setAppMode}
        onBuilderModeChange={handleBuilderModeChange}
      />

      {appMode === "builder" ? (
        builderMode === "wizard" ? (
          <WizardContainer
            formState={formState}
            assembled={assembled}
            hasContent={hasContent}
            setField={setField}
            applyTemplate={applyTemplate}
            toggleAI={toggleAI}
            toggleQualityTag={toggleQualityTag}
            handleStyleSelect={handleStyleSelect}
            reset={reset}
            onComplete={handleWizardComplete}
          />
        ) : (
          <DashboardContainer
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
        )
      ) : (
        <AnalyzeView />
      )}
    </main>
  );
}

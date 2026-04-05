"use client";

import { useState, useCallback, useEffect } from "react";
import type { HistoryEntry, PromptFormState, AssembledPrompts } from "@/lib/types";

const STORAGE_KEY = "image-prompter-history";
const MAX_ENTRIES = 20;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const saveToHistory = useCallback((formState: PromptFormState, prompts: AssembledPrompts) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: Date.now(),
      formState,
      prompts,
    };
    setEntries(prev => {
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { entries, saveToHistory, clearHistory };
}

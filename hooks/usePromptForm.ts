"use client";

import { useReducer, useMemo, useCallback } from "react";
import type { PromptFormState, AssembledPrompts } from "@/lib/types";
import { EMPTY_FORM_STATE, STYLE_OPTIONS, USE_CASE_TEMPLATES } from "@/lib/constants";
import { assembleAll } from "@/lib/prompt-assemblers";

type FormAction =
  | { type: "SET_FIELD"; key: keyof PromptFormState; value: PromptFormState[keyof PromptFormState] }
  | { type: "APPLY_TEMPLATE"; name: string }
  | { type: "TOGGLE_AI"; ai: PromptFormState["selectedAIs"][number] }
  | { type: "TOGGLE_QUALITY_TAG"; tag: string }
  | { type: "RESET" };

function formReducer(state: PromptFormState, action: FormAction): PromptFormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.key]: action.value };
    case "APPLY_TEMPLATE": {
      const t = USE_CASE_TEMPLATES[action.name];
      if (!t) return state;
      return {
        ...state,
        scene: t.scene || state.scene,
        ar: t.ar || state.ar,
        style_select: t.style || state.style_select,
        style_text: STYLE_OPTIONS[t.style] || state.style_text,
      };
    }
    case "TOGGLE_AI":
      return {
        ...state,
        selectedAIs: state.selectedAIs.includes(action.ai)
          ? state.selectedAIs.filter(a => a !== action.ai)
          : [...state.selectedAIs, action.ai],
      };
    case "TOGGLE_QUALITY_TAG":
      return {
        ...state,
        nb_quality_tags: state.nb_quality_tags.includes(action.tag)
          ? state.nb_quality_tags.filter(t => t !== action.tag)
          : [...state.nb_quality_tags, action.tag],
      };
    case "RESET":
      return EMPTY_FORM_STATE;
    default:
      return state;
  }
}

export function usePromptForm() {
  const [formState, dispatch] = useReducer(formReducer, EMPTY_FORM_STATE);

  const setField = useCallback(<K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => {
    dispatch({ type: "SET_FIELD", key, value: value as PromptFormState[keyof PromptFormState] });
  }, []);

  const applyTemplate = useCallback((name: string) => {
    dispatch({ type: "APPLY_TEMPLATE", name });
  }, []);

  const toggleAI = useCallback((ai: PromptFormState["selectedAIs"][number]) => {
    dispatch({ type: "TOGGLE_AI", ai });
  }, []);

  const toggleQualityTag = useCallback((tag: string) => {
    dispatch({ type: "TOGGLE_QUALITY_TAG", tag });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const handleStyleSelect = useCallback((val: string) => {
    dispatch({ type: "SET_FIELD", key: "style_select", value: val });
    if (val && STYLE_OPTIONS[val]) {
      dispatch({ type: "SET_FIELD", key: "style_text", value: STYLE_OPTIONS[val] });
    }
  }, []);

  const assembled: AssembledPrompts = useMemo(() => assembleAll(formState), [formState]);

  const hasContent = !!(formState.subject || formState.scene || formState.style_text);

  return {
    formState,
    assembled,
    hasContent,
    setField,
    applyTemplate,
    toggleAI,
    toggleQualityTag,
    handleStyleSelect,
    reset,
  };
}

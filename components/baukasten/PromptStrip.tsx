"use client";

import type { PromptFormState } from "@/lib/types";
import { ASPECT_RATIOS } from "@/lib/constants";

interface PromptStripProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  reset: () => void;
}

interface Brick {
  id: string;
  label: string;
  color: string;
  onClear: () => void;
}

const MAX_BRICK_LABEL = 38;

function truncate(text: string): string {
  return text.length > MAX_BRICK_LABEL ? `${text.slice(0, MAX_BRICK_LABEL)}…` : text;
}

export function PromptStrip({ formState, setField, reset }: PromptStripProps) {
  const bricks: Brick[] = [];

  const add = (id: string, label: string, color: string, onClear: () => void) => {
    bricks.push({ id, label: truncate(label), color, onClear });
  };

  if (formState.subject) add("subject", formState.subject, "bg-cat-motiv", () => setField("subject", ""));
  if (formState.action) add("action", formState.action, "bg-cat-motiv", () => setField("action", ""));
  if (formState.style_select || formState.style_text) {
    add("style", formState.style_select || formState.style_text, "bg-cat-stil", () => {
      setField("style_select", "");
      setField("style_text", "");
    });
  }
  if (formState.scene) add("scene", formState.scene, "bg-cat-szene", () => setField("scene", ""));
  if (formState.mood) add("mood", formState.mood, "bg-cat-szene", () => setField("mood", ""));
  if (formState.lighting) add("lighting", formState.lighting, "bg-cat-licht", () => setField("lighting", ""));
  if (formState.camera) add("camera", formState.camera, "bg-cat-kamera", () => setField("camera", ""));
  if (formState.lens) add("lens", formState.lens, "bg-cat-kamera", () => setField("lens", ""));
  if (formState.colors_verbal) add("colors_verbal", formState.colors_verbal, "bg-cat-farben", () => setField("colors_verbal", ""));
  if (formState.colors_hex) add("colors_hex", formState.colors_hex, "bg-cat-farben", () => setField("colors_hex", ""));
  if (formState.text_in_image) add("text", `„${formState.text_in_image}“`, "bg-cat-farben", () => setField("text_in_image", ""));
  if (formState.ar) add("ar", ASPECT_RATIOS[formState.ar]?.split(" – ")[0] || formState.ar, "bg-card", () => setField("ar", ""));
  if (formState.negative) add("negative", `ohne: ${formState.negative}`, "bg-card", () => setField("negative", ""));

  return (
    <div className="card-brutal p-4 mb-5 sticky top-3 z-10">
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          Dein Prompt — {bricks.length} {bricks.length === 1 ? "Baustein" : "Bausteine"}
        </span>
        {bricks.length > 0 && (
          <button onClick={reset} className="text-[11px] font-bold text-ink-muted hover:text-ink cursor-pointer underline underline-offset-2">
            Alles löschen
          </button>
        )}
      </div>
      {bricks.length === 0 ? (
        <p className="text-[13px] text-ink-muted">
          Noch leer. Fülle die Karten unten aus — jeder Eintrag wird ein Baustein.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {bricks.map(brick => (
            <span
              key={brick.id}
              className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold border-2 border-ink rounded-lg pl-2.5 pr-1.5 py-1 shadow-brutal-sm ${brick.color}`}
            >
              {brick.label}
              <button
                onClick={brick.onClear}
                aria-label={`Baustein „${brick.label}“ entfernen`}
                className="w-4.5 h-4.5 grid place-items-center rounded text-[11px] font-bold text-ink-soft hover:bg-ink hover:text-card cursor-pointer transition-colors"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

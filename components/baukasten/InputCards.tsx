"use client";

import type { PromptFormState } from "@/lib/types";
import { STYLE_OPTIONS, ASPECT_RATIOS, CAMERA_OPTIONS, LIGHTING_OPTIONS } from "@/lib/constants";

interface InputCardsProps {
  formState: PromptFormState;
  setField: <K extends keyof PromptFormState>(key: K, value: PromptFormState[K]) => void;
  handleStyleSelect: (val: string) => void;
}

function Card({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="card-brutal p-4">
      <h3 className="flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] mb-3">
        <i className={`w-3 h-3 border-2 border-ink rounded-[3px] inline-block ${color}`} aria-hidden />
        {title}
      </h3>
      {children}
    </section>
  );
}

function TileGroup({ options, value, onSelect }: { options: string[]; value: string; onSelect: (val: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.filter(Boolean).map(opt => (
        <button
          key={opt}
          onClick={() => onSelect(value === opt ? "" : opt)}
          className={`tile-brutal ${value === opt ? "tile-on" : ""}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function InputCards({ formState, setField, handleStyleSelect }: InputCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      <Card title="Motiv" color="bg-cat-motiv">
        <label className="label-brutal" htmlFor="bk-subject">Hauptmotiv *</label>
        <input
          id="bk-subject"
          value={formState.subject}
          onChange={e => setField("subject", e.target.value)}
          className="input-brutal mb-3"
          placeholder="z.B. eine Architektin Mitte 30…"
        />
        <label className="label-brutal" htmlFor="bk-action">Aktion</label>
        <input
          id="bk-action"
          value={formState.action}
          onChange={e => setField("action", e.target.value)}
          className="input-brutal"
          placeholder="z.B. schaut auf Architekturpläne"
        />
      </Card>

      <Card title="Stil" color="bg-cat-stil">
        <TileGroup
          options={Object.keys(STYLE_OPTIONS).filter(Boolean)}
          value={formState.style_select}
          onSelect={handleStyleSelect}
        />
        <label className="label-brutal mt-3" htmlFor="bk-styletext">Stil-Beschreibung (frei editierbar)</label>
        <textarea
          id="bk-styletext"
          value={formState.style_text}
          onChange={e => setField("style_text", e.target.value)}
          rows={2}
          className="input-brutal resize-y leading-relaxed"
          placeholder="Eigener Stil oder Preset anpassen…"
        />
      </Card>

      <Card title="Szene & Stimmung" color="bg-cat-szene">
        <label className="label-brutal" htmlFor="bk-scene">Szene</label>
        <input
          id="bk-scene"
          value={formState.scene}
          onChange={e => setField("scene", e.target.value)}
          className="input-brutal mb-3"
          placeholder="Umgebung, Ort, Kontext"
        />
        <label className="label-brutal" htmlFor="bk-mood">Stimmung</label>
        <input
          id="bk-mood"
          value={formState.mood}
          onChange={e => setField("mood", e.target.value)}
          className="input-brutal"
          placeholder="z.B. ruhig, melancholisch, energetisch"
        />
      </Card>

      <Card title="Licht" color="bg-cat-licht">
        <TileGroup
          options={LIGHTING_OPTIONS}
          value={formState.lighting}
          onSelect={val => setField("lighting", val)}
        />
      </Card>

      <Card title="Kamera" color="bg-cat-kamera">
        <TileGroup
          options={CAMERA_OPTIONS}
          value={formState.camera}
          onSelect={val => setField("camera", val)}
        />
        <label className="label-brutal mt-3" htmlFor="bk-lens">Objektiv</label>
        <input
          id="bk-lens"
          value={formState.lens}
          onChange={e => setField("lens", e.target.value)}
          className="input-brutal"
          placeholder="z.B. 85mm, f/1.4"
        />
      </Card>

      <Card title="Farben & Text" color="bg-cat-farben">
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <label className="label-brutal" htmlFor="bk-colors">Farben (verbal)</label>
            <input
              id="bk-colors"
              value={formState.colors_verbal}
              onChange={e => setField("colors_verbal", e.target.value)}
              className="input-brutal"
              placeholder="Für Midjourney"
            />
          </div>
          <div>
            <label className="label-brutal" htmlFor="bk-hex">Hex-Codes</label>
            <input
              id="bk-hex"
              value={formState.colors_hex}
              onChange={e => setField("colors_hex", e.target.value)}
              className="input-brutal"
              placeholder="#1a2b3c, … für Flux/NB"
            />
          </div>
        </div>
        <div className="grid grid-cols-[2fr_1fr] gap-2.5">
          <div>
            <label className="label-brutal" htmlFor="bk-text">Text im Bild</label>
            <input
              id="bk-text"
              value={formState.text_in_image}
              onChange={e => setField("text_in_image", e.target.value)}
              className="input-brutal"
              placeholder='z.B. "Sale 2025"'
            />
          </div>
          <div>
            <label className="label-brutal" htmlFor="bk-typo">Typografie</label>
            <input
              id="bk-typo"
              value={formState.text_style}
              onChange={e => setField("text_style", e.target.value)}
              className="input-brutal"
              placeholder="Stil"
            />
          </div>
        </div>
      </Card>

      <Card title="Format" color="bg-card">
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(ASPECT_RATIOS).filter(([k]) => k).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setField("ar", formState.ar === key ? "" : key)}
              className={`tile-brutal ${formState.ar === key ? "tile-on" : ""}`}
              title={label}
            >
              {label.split(" – ")[0]}
              <span className="block text-[9px] font-medium opacity-70">{label.split(" – ")[1]}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="Feinschliff" color="bg-card">
        <label className="label-brutal" htmlFor="bk-negative">Ausschließen (Midjourney / Flux)</label>
        <input
          id="bk-negative"
          value={formState.negative}
          onChange={e => setField("negative", e.target.value)}
          className="input-brutal mb-3"
          placeholder="text, watermark, blur…"
        />
        <label className="label-brutal" htmlFor="bk-positive">Positiv formuliert (Nano Banana)</label>
        <input
          id="bk-positive"
          value={formState.negative_positive}
          onChange={e => setField("negative_positive", e.target.value)}
          className="input-brutal"
          placeholder="klare Ästhetik, aufgeräumt…"
        />
      </Card>
    </div>
  );
}

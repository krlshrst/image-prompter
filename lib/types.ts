export type AISystem = "Midjourney" | "Flux" | "Nano Banana Pro";

export interface PromptFormState {
  subject: string;
  action: string;
  scene: string;
  style_select: string;
  style_text: string;
  camera: string;
  lens: string;
  lighting: string;
  mood: string;
  colors_verbal: string;
  colors_hex: string;
  negative: string;
  negative_positive: string;
  text_in_image: string;
  text_style: string;
  ar: string;
  selectedAIs: AISystem[];
  mj_version: string;
  mj_quality: string;
  mj_stylize: string;
  mj_chaos: string;
  mj_weird: string;
  mj_seed: string;
  mj_style_raw: boolean;
  flux_style_preset: string;
  nb_quality_tags: string[];
}

export interface MidjourneyPrompt {
  prompt: string;
  style: string | null;
  aspect_ratio: string | null;
  version: string;
  quality: string;
  stylize: string | null;
  chaos: string | null;
  weird: string | null;
  style_mode: string | null;
  negative: string | null;
  seed: string | null;
  full_command: string;
}

export interface FluxPrompt {
  model: string;
  prompt: string;
  negative_prompt: string;
  width: number;
  height: number;
  steps: number;
  guidance_scale: number;
  seed: null;
  style_preset: string | null;
  scheduler: string;
}

export interface NanoBananaPrompt {
  subject: string | null;
  action: string | null;
  scene: string | null;
  style: string | null;
  lighting: string | null;
  mood: string | null;
  color_palette: string | null;
  quality_tags: string[];
  format_description: string | null;
  text_content: string | null;
  full_prompt: string;
}

export type AssembledPrompts = {
  Midjourney?: MidjourneyPrompt;
  Flux?: FluxPrompt;
  "Nano Banana Pro"?: NanoBananaPrompt;
};

export interface HistoryEntry {
  id: string;
  timestamp: number;
  formState: PromptFormState;
  prompts: AssembledPrompts;
}

export type AppMode = "builder" | "analyze";

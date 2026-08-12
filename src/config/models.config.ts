import { AI_MODELS, GPT_VARIANTS, CLAUDE_VARIANTS } from "@/features/models/data/models";

export const DEFAULT_MODEL_ID = "gpt-omni";
export const DEFAULT_GPT_VARIANT_ID = "gpt-5.6-luna";
export const DEFAULT_CLAUDE_VARIANT_ID = "claude-haiku-4-5";

/** Real model string mapped per UI model ID. */
const API_MODEL_MAP: Record<string, string> = {
  "gpt-omni":           "gpt-5.6-sol",
  "gpt-5.6-sol":        "gpt-5.6-sol",
  "gpt-5.6-terra":      "gpt-5.6-terra",
  "gpt-5.6-luna":       "gpt-5.6-luna",
  "claude-omni":        "claude-haiku-4-5-20251001",  // default Claude variant
  "claude-haiku-4-5":   "claude-haiku-4-5-20251001",
  "claude-sonnet-5":    "claude-sonnet-5",
  "claude-fable-5":     "claude-fable-5",
  "claude-opus-5":      "claude-opus-5",
};

export function resolveApiModel(modelId: string): string {
  return API_MODEL_MAP[modelId] ?? API_MODEL_MAP[DEFAULT_MODEL_ID]!;
}

/** Reverse of resolveApiModel — used to hydrate the UI selection from a backend-stored API model string. */
export function getUiModelIdForApiModel(apiModel: string): string {
  const entry = Object.entries(API_MODEL_MAP).find(([, api]) => api === apiModel);
  return entry?.[0] ?? DEFAULT_MODEL_ID;
}

export function isModelAvailable(modelId: string): boolean {
  if (modelId === "gpt-omni" || GPT_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "claude-omni" || CLAUDE_VARIANTS.some((v) => v.id === modelId)) return true;
  return AI_MODELS.find((m) => m.id === modelId)?.available ?? false;
}

export function getModelName(modelId: string): string {
  const gptVariant = GPT_VARIANTS.find((v) => v.id === modelId);
  if (gptVariant) return gptVariant.name;
  const claudeVariant = CLAUDE_VARIANTS.find((v) => v.id === modelId);
  if (claudeVariant) return claudeVariant.name;
  return AI_MODELS.find((m) => m.id === modelId)?.name ?? "This model";
}

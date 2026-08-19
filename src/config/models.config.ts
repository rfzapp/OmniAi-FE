import { AI_MODELS, GPT_VARIANTS, CLAUDE_VARIANTS, DEEPSEEK_VARIANTS, GROK_VARIANTS, QWEN_VARIANTS, MISTRAL_VARIANTS, KIMI_VARIANTS } from "@/features/models/data/models";

export const DEFAULT_MODEL_ID = "gpt-omni";
export const DEFAULT_GPT_VARIANT_ID = "gpt-5.6-luna";
export const DEFAULT_CLAUDE_VARIANT_ID = "claude-haiku-4-5";
export const DEFAULT_DEEPSEEK_VARIANT_ID = "deepseek-chat";
export const DEFAULT_GROK_VARIANT_ID = "grok-4";
export const DEFAULT_QWEN_VARIANT_ID = "qwen-turbo";
export const DEFAULT_MISTRAL_VARIANT_ID = "mistral-small-latest";
export const DEFAULT_KIMI_VARIANT_ID = "kimi-k3";

const API_MODEL_MAP: Record<string, string> = {
  "gpt-omni":               "gpt-5.6-sol",
  "gpt-5.6-sol":            "gpt-5.6-sol",
  "gpt-5.6-terra":          "gpt-5.6-terra",
  "gpt-5.6-luna":           "gpt-5.6-luna",
  "gpt-4.1-mini":           "gpt-5.6-luna",
  "claude-omni":            "claude-haiku-4-5-20251001",
  "claude-haiku-4-5":       "claude-haiku-4-5-20251001",
  "claude-sonnet-5":        "claude-sonnet-5",
  "claude-fable-5":         "claude-fable-5",
  "claude-opus-5":          "claude-opus-5",
  "deepseek-omni":          "deepseek-chat",
  "deepseek-chat":          "deepseek-chat",
  "deepseek-reasoner":      "deepseek-reasoner",
  "grok-omni":              "grok-4",
  "grok-4":                 "grok-4",
  "grok-3":                 "grok-3",
  "qwen-omni":              "qwen-turbo",
  "qwen-max":               "qwen-max",
  "qwen-plus":              "qwen-plus",
  "qwen-turbo":             "qwen-turbo",
  "mistral-omni":           "mistral-small-latest",
  "mistral-large-latest":   "mistral-large-latest",
  "mistral-small-latest":   "mistral-small-latest",
  "kimi-omni":              "kimi-k3",
  "kimi-k3":                "kimi-k3",
  "kimi-k2.6":              "kimi-k2.6",
  "moonshot-v1-128k":       "moonshot-v1-128k",
};

export function resolveApiModel(modelId: string): string {
  return API_MODEL_MAP[modelId] ?? API_MODEL_MAP[DEFAULT_MODEL_ID]!;
}

/** Reverse of resolveApiModel — maps API model string back to the most specific UI model ID. */
export function getUiModelIdForApiModel(apiModel: string): string {
  const entries = Object.entries(API_MODEL_MAP).filter(([, api]) => api === apiModel);
  if (entries.length === 0) return DEFAULT_MODEL_ID;
  // Prefer the specific variant key (e.g. "claude-haiku-4-5") over the generic "-omni" alias
  const specific = entries.find(([key]) => !key.endsWith("-omni"));
  return (specific ?? entries[0]!)[0];
}

export function isModelAvailable(modelId: string): boolean {
  if (modelId === "gpt-omni" || GPT_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "claude-omni" || CLAUDE_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "deepseek-omni" || DEEPSEEK_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "grok-omni" || GROK_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "qwen-omni" || QWEN_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "mistral-omni" || MISTRAL_VARIANTS.some((v) => v.id === modelId)) return true;
  if (modelId === "kimi-omni" || KIMI_VARIANTS.some((v) => v.id === modelId)) return true;
  return AI_MODELS.find((m) => m.id === modelId)?.available ?? false;
}

export function getModelName(modelId: string): string {
  const gptVariant = GPT_VARIANTS.find((v) => v.id === modelId);
  if (gptVariant) return gptVariant.name;
  const claudeVariant = CLAUDE_VARIANTS.find((v) => v.id === modelId);
  if (claudeVariant) return claudeVariant.name;
  const deepseekVariant = DEEPSEEK_VARIANTS.find((v) => v.id === modelId);
  if (deepseekVariant) return deepseekVariant.name;
  const grokVariant = GROK_VARIANTS.find((v) => v.id === modelId);
  if (grokVariant) return grokVariant.name;
  const qwenVariant = QWEN_VARIANTS.find((v) => v.id === modelId);
  if (qwenVariant) return qwenVariant.name;
  const mistralVariant = MISTRAL_VARIANTS.find((v) => v.id === modelId);
  if (mistralVariant) return mistralVariant.name;
  const kimiVariant = KIMI_VARIANTS.find((v) => v.id === modelId);
  if (kimiVariant) return kimiVariant.name;
  return AI_MODELS.find((m) => m.id === modelId)?.name ?? "This model";
}

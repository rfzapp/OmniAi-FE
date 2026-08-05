import { AI_MODELS } from "@/features/models/data/models";

export const DEFAULT_MODEL_ID = "gpt-omni";

/** Real OpenAI model string used for the one model actually wired up on the backend. */
const API_MODEL_MAP: Record<string, string> = {
  "gpt-omni": "gpt-4.1-mini",
};

export function resolveApiModel(modelId: string): string {
  return API_MODEL_MAP[modelId] ?? API_MODEL_MAP[DEFAULT_MODEL_ID]!;
}

export function isModelAvailable(modelId: string): boolean {
  return AI_MODELS.find((m) => m.id === modelId)?.available ?? false;
}

export function getModelName(modelId: string): string {
  return AI_MODELS.find((m) => m.id === modelId)?.name ?? "This model";
}

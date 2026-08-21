/**
 * Defines which model variant IDs are unlocked per subscription plan.
 * Each plan is cumulative — higher plans include lower plan models too.
 */

/** Free: only the 3 recommended models */
const FREE_MODELS = [
  "gpt-5.6-luna",
  "claude-haiku-4-5",
  "kimi-k3",
];

/** Standard: cheapest/fastest model from every provider */
const STANDARD_MODELS = [
  ...FREE_MODELS,
  "gpt-5.6-sol",       // GPT balanced
  "deepseek-chat",     // DeepSeek V3
  "grok-3",            // Grok 4.3
  "qwen-turbo",        // Qwen Turbo
  "mistral-small-latest", // Mistral Small
  "kimi-k2.6",         // Kimi K2.6
];

/** Pro: mid-tier + some powerful models */
const PRO_MODELS = [
  ...STANDARD_MODELS,
  "gpt-5.6-sol",       // already in standard — just ensuring
  "claude-opus-5",
  "deepseek-reasoner", // DeepSeek R1
  "grok-4",            // Grok 4.6
  "qwen-plus",         // Qwen Plus
  "mistral-large-latest",
];

/** Ultra Pro: everything */
const ULTRA_PRO_MODELS: string[] = [
  ...PRO_MODELS,
  "gpt-5.6-terra",
  "claude-sonnet-5",
  "claude-fable-5",
  "qwen-max",
  "moonshot-v1-128k",
];

export const MODEL_ACCESS: Record<string, string[]> = {
  free: FREE_MODELS,
  standard: STANDARD_MODELS,
  pro: PRO_MODELS,
  ultra_pro: ULTRA_PRO_MODELS,
};

export function isModelUnlocked(modelId: string, plan: string): boolean {
  const allowed = MODEL_ACCESS[plan] ?? MODEL_ACCESS.free!;
  return allowed.includes(modelId);
}

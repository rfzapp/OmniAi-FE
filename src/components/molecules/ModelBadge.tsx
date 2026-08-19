import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import {
  AI_MODELS, GPT_VARIANTS, CLAUDE_VARIANTS, DEEPSEEK_VARIANTS,
  GROK_VARIANTS, QWEN_VARIANTS, MISTRAL_VARIANTS, KIMI_VARIANTS,
} from "@/features/models/data/models";
import { getUiModelIdForApiModel } from "@/config/models.config";

const VARIANT_PARENT: Record<string, string> = {
  "gpt-5.6-luna": "gpt-omni", "gpt-5.6-terra": "gpt-omni", "gpt-5.6-sol": "gpt-omni",
  "claude-haiku-4-5": "claude-omni", "claude-sonnet-5": "claude-omni", "claude-opus-5": "claude-omni", "claude-fable-5": "claude-omni",
  "deepseek-chat": "deepseek-omni", "deepseek-reasoner": "deepseek-omni",
  "grok-4": "grok-omni", "grok-3": "grok-omni",
  "qwen-max-latest": "qwen-omni", "qwen-plus": "qwen-omni", "qwen-turbo": "qwen-omni",
  "mistral-large-latest": "mistral-omni", "mistral-small-latest": "mistral-omni",
  "kimi-latest": "kimi-omni", "moonshot-v1-128k": "kimi-omni", "moonshot-v1-32k": "kimi-omni",
};

const ALL_VARIANTS = [
  ...GPT_VARIANTS, ...CLAUDE_VARIANTS, ...DEEPSEEK_VARIANTS,
  ...GROK_VARIANTS, ...QWEN_VARIANTS, ...MISTRAL_VARIANTS, ...KIMI_VARIANTS,
];

export function ModelBadge({ modelId: rawModelId }: { modelId?: string }) {
  if (!rawModelId) return null;

  const isAlreadyUiId = ALL_VARIANTS.some((v) => v.id === rawModelId) || AI_MODELS.some((m) => m.id === rawModelId);
  const uiModelId = isAlreadyUiId ? rawModelId : getUiModelIdForApiModel(rawModelId);

  const variant = ALL_VARIANTS.find((v) => v.id === uiModelId);
  const parentId = VARIANT_PARENT[uiModelId] ?? uiModelId;
  const model = AI_MODELS.find((m) => m.id === parentId) ?? AI_MODELS.find((m) => m.id === uiModelId);

  if (!variant && !model) return null;

  return (
    <Badge variant="secondary" className="gap-1.5 font-normal text-muted-foreground">
      {model?.logo && (
        <Image src={model.logo} alt="" width={12} height={12} className="size-3 shrink-0 rounded-sm object-contain" />
      )}
      {variant?.name ?? model?.name}
    </Badge>
  );
}

import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import { AI_MODELS, GPT_VARIANTS, CLAUDE_VARIANTS, DEEPSEEK_VARIANTS, GROK_VARIANTS } from "@/features/models/data/models";
import { getUiModelIdForApiModel } from "@/config/models.config";

// Maps variant model IDs to their parent "omni" model for logo lookup
const VARIANT_PARENT: Record<string, string> = {
  "gpt-5.6-luna": "gpt-omni",
  "gpt-5.6-terra": "gpt-omni",
  "gpt-5.6-sol": "gpt-omni",
  "claude-haiku-4-5": "claude-omni",
  "claude-sonnet-5": "claude-omni",
  "claude-opus-5": "claude-omni",
  "claude-fable-5": "claude-omni",
  "deepseek-chat": "deepseek-omni",
  "deepseek-reasoner": "deepseek-omni",
  "grok-4": "grok-omni",
  "grok-3": "grok-omni",
};

export function ModelBadge({ modelId: rawModelId }: { modelId?: string }) {
  if (!rawModelId) return null;

  // Check if already a UI variant ID, otherwise convert from API string
  const allVariantIds = [
    ...GPT_VARIANTS.map((v) => v.id),
    ...CLAUDE_VARIANTS.map((v) => v.id),
    ...DEEPSEEK_VARIANTS.map((v) => v.id),
    ...GROK_VARIANTS.map((v) => v.id),
  ];

  const isAlreadyUiId = allVariantIds.includes(rawModelId) || AI_MODELS.some((m) => m.id === rawModelId);
  const uiModelId = isAlreadyUiId ? rawModelId : getUiModelIdForApiModel(rawModelId);

  // Find variant display name
  const variant =
    GPT_VARIANTS.find((v) => v.id === uiModelId) ??
    CLAUDE_VARIANTS.find((v) => v.id === uiModelId) ??
    DEEPSEEK_VARIANTS.find((v) => v.id === uiModelId) ??
    GROK_VARIANTS.find((v) => v.id === uiModelId);

  // Find logo from parent model
  const parentId = VARIANT_PARENT[uiModelId] ?? uiModelId;
  const model = AI_MODELS.find((m) => m.id === parentId) ?? AI_MODELS.find((m) => m.id === uiModelId);

  if (!variant && !model) return null;

  const displayName = variant?.name ?? model?.name;
  const logo = model?.logo;

  return (
    <Badge variant="secondary" className="gap-1.5 font-normal text-muted-foreground">
      {logo && (
        <Image
          src={logo}
          alt=""
          width={12}
          height={12}
          className="size-3 shrink-0 rounded-sm object-contain"
        />
      )}
      {displayName}
    </Badge>
  );
}

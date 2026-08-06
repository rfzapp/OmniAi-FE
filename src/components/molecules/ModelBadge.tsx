import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import { AI_MODELS, GPT_VARIANTS } from "@/features/models/data/models";

export function ModelBadge({ modelId }: { modelId?: string }) {
  const gptVariant = GPT_VARIANTS.find((v) => v.id === modelId);
  const model =
    AI_MODELS.find((m) => m.id === modelId) ??
    (gptVariant ? AI_MODELS.find((m) => m.id === "gpt-omni") : undefined);

  if (!model && !gptVariant) return null;

  const displayName = gptVariant ? gptVariant.name : model?.name;
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

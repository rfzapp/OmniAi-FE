import Image from "next/image";
import { Badge } from "@/components/atoms/Badge";
import { AI_MODELS } from "@/features/models/data/models";

export function ModelBadge({ modelId }: { modelId?: string }) {
  const model = AI_MODELS.find((m) => m.id === modelId);
  if (!model) return null;
  return (
    <Badge variant="secondary" className="gap-1.5 font-normal text-muted-foreground">
      <Image
        src={model.logo}
        alt=""
        width={12}
        height={12}
        className="size-3 shrink-0 rounded-sm object-contain"
      />
      {model.name}
    </Badge>
  );
}

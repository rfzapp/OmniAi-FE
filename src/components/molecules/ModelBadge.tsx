import { Badge } from "@/components/atoms/Badge";
import { AI_MODELS } from "@/features/models/data/models";

export function ModelBadge({ modelId }: { modelId?: string }) {
  const model = AI_MODELS.find((m) => m.id === modelId);
  if (!model) return null;
  return (
    <Badge variant="secondary" className="font-normal text-muted-foreground">
      {model.name}
    </Badge>
  );
}

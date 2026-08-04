import { Check } from "lucide-react";
import { SpeedIndicator } from "@/components/molecules/SpeedIndicator";
import { cn } from "@/lib/utils";
import type { AiModel } from "../types";

interface ModelListItemProps {
  model: AiModel;
  selected?: boolean;
}

export function ModelListItem({ model, selected }: ModelListItemProps) {
  return (
    <div className="flex w-full items-center gap-3 py-1">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
        )}
        aria-hidden="true"
      >
        {model.glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground">{model.name}</span>
          <span className="text-xs text-muted-foreground">{model.provider}</span>
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {model.description}
        </span>
      </span>
      <SpeedIndicator speed={model.speed} />
      {selected && <Check className="size-4 shrink-0 text-brand-600" />}
    </div>
  );
}

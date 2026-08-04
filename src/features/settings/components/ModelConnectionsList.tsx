"use client";

import Image from "next/image";
import { Switch } from "@/components/atoms/Switch";
import { AI_MODELS } from "@/features/models/data/models";
import { useSettingsStore } from "@/store/useSettingsStore";

export function ModelConnectionsList() {
  const connectedModelIds = useSettingsStore((s) => s.connectedModelIds);
  const toggleConnectedModel = useSettingsStore((s) => s.toggleConnectedModel);

  return (
    <>
      {AI_MODELS.map((model) => (
        <div key={model.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-black/5">
              <Image
                src={model.logo}
                alt={`${model.name} logo`}
                width={22}
                height={22}
                className="size-[22px] object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{model.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {model.provider} — {model.description}
              </p>
            </div>
          </div>
          <Switch
            checked={connectedModelIds.includes(model.id)}
            onCheckedChange={() => toggleConnectedModel(model.id)}
          />
        </div>
      ))}
    </>
  );
}

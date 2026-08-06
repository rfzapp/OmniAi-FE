"use client";

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/atoms/Switch";
import { AI_MODELS } from "@/features/models/data/models";
import { useSettingsStore } from "@/store/useSettingsStore";
import { settingsService } from "../services/settingsService";
import { getApiErrorMessage } from "@/services/httpClient";

export function ModelConnectionsList() {
  const connectedModelIds = useSettingsStore((s) => s.connectedModelIds);
  const toggleConnectedModel = useSettingsStore((s) => s.toggleConnectedModel);
  const [error, setError] = useState<string | null>(null);

  const connectedAvailableCount = AI_MODELS.filter(
    (m) => m.available && connectedModelIds.includes(m.id),
  ).length;

  async function handleToggle(modelId: string, model: (typeof AI_MODELS)[number]) {
    setError(null);
    const isConnected = connectedModelIds.includes(modelId);

    // Don't let the last connected *working* model be turned off — that
    // would leave the chat composer with nothing usable.
    if (isConnected && model.available && connectedAvailableCount <= 1) {
      setError(`${model.name} must stay connected — it's your only working model.`);
      return;
    }

    toggleConnectedModel(modelId);
    const nextIds = isConnected
      ? connectedModelIds.filter((id) => id !== modelId)
      : [...connectedModelIds, modelId];

    try {
      await settingsService.updatePreferences({ connectedModelIds: nextIds });
    } catch (err) {
      toggleConnectedModel(modelId); // revert
      setError(getApiErrorMessage(err));
    }
  }

  return (
    <>
      {error && (
        <p role="alert" className="mx-4 my-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
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
            onCheckedChange={() => handleToggle(model.id, model)}
          />
        </div>
      ))}
    </>
  );
}
